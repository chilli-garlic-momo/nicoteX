
import os
import torch
import pandas as pd
import numpy as np
from model.autoEncoder import Autoencoder
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from explainability.explaination import generate_explanation

# Paths for model and preprocessors relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, '..', 'model')

# Load preprocessing artifacts with correct paths
enc_path = os.path.join(MODEL_DIR, 'onehot.pkl')
scaler_path = os.path.join(MODEL_DIR, 'scaler.pkl')

enc = pd.read_pickle(enc_path)
scaler = pd.read_pickle(scaler_path)

model = None  # Global model variable


def preprocess(df):
    """
    Preprocess a DataFrame of transactions for scoring:
    - Scale numeric 'amount'
    - One-hot encode categorical features: location, device, merchant
    Returns a numpy array ready for PyTorch model input.
    """
    # Extract features expected by model
    X_num = scaler.transform(df[['amount']])
    X_cat = enc.transform(df[['location', 'device', 'merchant']])
    X_final = np.hstack([X_num, X_cat])
    return X_final


def load_model():
    """
    Load and cache the trained autoencoder model.
    """
    global model
    if model is None:
        # Determine input dimension from encoder output + 1 numeric feature
        input_dim = scaler.transform(np.array([[0]])).shape[1] + enc.transform(
            [['Mumbai', 'android', 'Cafe']]
        ).shape[1]

        model_inst = Autoencoder(input_dim)
        model_path = os.path.join(MODEL_DIR, 'autoencoder.pth')
        model_inst.load_state_dict(torch.load(model_path, map_location='cpu'))
        model_inst.eval()
        model = model_inst
    return model



def score_transactions(batch_txns):
    """
    Score multiple transactions with anomaly detection and contextual analysis.

    Args:
        batch_txns (list of dict): Transactions, each as a dict including keys:
                                  'txn_id' (optional), 'user_id', 'amount', 'location',
                                  'device', 'merchant', 'timestamp', etc.

    Returns:
        list of dict: each dict contains:
                      - txn_id
                      - anomaly_score
                      - alert_flag (bool)
                      - explanation (str)
    """
    df = pd.DataFrame(batch_txns)

    # Ensure timestamp is datetime
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    # Basic contextual features per user (over the batch)
    agg = df.groupby('user_id').agg(
        avg_amount=('amount', 'mean'),
        txn_count=('amount', 'count')
    ).reset_index()

    df = df.merge(agg, on='user_id', how='left')

    # Preprocess input for the model (scale numeric, one-hot encode categorical)
    X = preprocess(df)

    X_tensor = torch.tensor(X, dtype=torch.float32)
    m = load_model()
    with torch.no_grad():
        output = m(X_tensor)
    errors = torch.mean(torch.abs(output - X_tensor), dim=1).numpy()

    results = []
    threshold = 0.25  # Adjust as necessary after tuning
    for i, txn in df.iterrows():
        score = errors[i]
        alert = score > threshold

        explanation = generate_explanation(txn)
        if alert:
            explanation += f" | Anomaly score {score:.3f} exceeds threshold."
            # Context based checks
            if txn['amount'] > txn['avg_amount'] * 2:
                explanation += " Amount significantly higher than user's average."
            if txn['txn_count'] > 5:
                explanation += " High frequency of transactions detected."

        results.append({
            'txn_id': txn.get('txn_id', i),  # Use txn_id if available, else index
            'anomaly_score': score,
            'alert_flag': alert,
            'explanation': explanation
        })
    return results
