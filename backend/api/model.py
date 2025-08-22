import os
import torch
import pandas as pd
import numpy as np
from model.autoEncoder import Autoencoder
from sklearn.preprocessing import OneHotEncoder, StandardScaler

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


def score_transaction(txn):
    """
    Given a single transaction dict, preprocess and score anomaly:
    Returns:
      - reconstruction_error (float)
      - alert_flag (bool)
    """
    df = pd.DataFrame([txn])
    X = preprocess(df)

    X_tensor = torch.tensor(X, dtype=torch.float32)
    model = load_model()

    with torch.no_grad():
        output = model(X_tensor)
    error = torch.mean(torch.abs(output - X_tensor)).item()

    threshold = 0.25  # Demo threshold to mark anomaly
    alert = error > threshold

    return error, alert
