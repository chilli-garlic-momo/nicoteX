import torch
from model.autoEncoder import Autoencoder, preprocess
import pandas as pd
import numpy as np

# Load preprocessing artifacts
enc = pd.read_pickle('onehot.pkl')
scaler = pd.read_pickle('scaler.pkl')

# Load the trained model
def load_model():
    dummy_df = pd.read_csv('syntheticTransactions.csv').head(1)
    X_dummy, _, _ = preprocess(dummy_df)
    model = Autoencoder(X_dummy.shape[1])
    model.load_state_dict(torch.load('autoencoder.pth', map_location='cpu'))
    model.eval()
    return model

# Scoring function
def score_transaction(txn):
    X, _, _ = preprocess(pd.DataFrame([txn]))
    X_torch = torch.tensor(X, dtype=torch.float32)
    model = load_model()
    decoded = model(X_torch)
    error = ((X_torch - decoded).abs().mean()).item()
    # Dynamic threshold: for demo, use 0.25 (tune as needed)
    alert = error > 0.25
    return error, alert
