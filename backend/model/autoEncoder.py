import torch
import torch.nn as nn
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split

class Autoencoder(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 32),
            nn.ReLU(),
            nn.Linear(32, 12),
            nn.ReLU(),
            nn.Linear(12, 4)
        )
        self.decoder = nn.Sequential(
            nn.Linear(4, 12),
            nn.ReLU(),
            nn.Linear(12, 32),
            nn.ReLU(),
            nn.Linear(32, input_dim),
            nn.Sigmoid()
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

def preprocess(df):
    enc = OneHotEncoder(sparse_output=False)
    scaler = StandardScaler()
    # Select relevant features (drop user_id, timestamp for modeling)
    X = df[['amount', 'location', 'device', 'merchant']].copy()
    X_enc = enc.fit_transform(X[['location','device','merchant']])
    X_num = scaler.fit_transform(X[['amount']])
    X_final = np.hstack([X_num, X_enc])
    return X_final, enc, scaler

def train_ae(df):
    # Train only on normal transactions
    df_normal = df[df.get('is_fraud', False) == False]
    X, enc, scaler = preprocess(df_normal)
    X_train, X_val = train_test_split(X, test_size=0.2, random_state=42)
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = Autoencoder(X.shape[1]).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()

    for epoch in range(12):
        model.train()
        idx = np.random.choice(len(X_train), 64)
        batch = torch.tensor(X_train[idx], dtype=torch.float32).to(device)
        optimizer.zero_grad()
        output = model(batch)
        loss = criterion(output, batch)
        loss.backward()
        optimizer.step()
        print(f'Epoch {epoch+1}, Loss {loss.item():.4f}')

    torch.save(model.state_dict(), 'autoencoder.pth')
    # Save encoders for future inference
    pd.to_pickle(enc, 'onehot.pkl')
    pd.to_pickle(scaler, 'scaler.pkl')

if __name__ == "__main__":
    import numpy as np
    df = pd.read_csv('../dataGen/syntheticTransactions.csv')
    train_ae(df)
