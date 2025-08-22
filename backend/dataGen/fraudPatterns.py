import pandas as pd
from datetime import timedelta
import random

def inject_frauds(df, num_frauds=100):
    frauds = []
    for _ in range(num_frauds):
        idx = random.randint(0, len(df)-1)
        user = df.iloc[idx].copy()  # Copy before modifying
        fraud_type = random.choice(['location_drift', 'device_takeover', 'high_amount', 'odd_hour'])
        user['is_fraud'] = True
        if fraud_type == 'location_drift':
            user['location'] = random.choice(['Dubai', 'London', 'Tokyo'])
        elif fraud_type == 'device_takeover':
            user['device'] = random.choice(['unknown_dev', 'bot_net'])
        elif fraud_type == 'high_amount':
            user['amount'] = user['amount'] * random.uniform(3,6)
        elif fraud_type == 'odd_hour':
            user['timestamp'] = pd.to_datetime(user['timestamp']) + timedelta(hours=random.choice([1,2,3]))
        frauds.append(user)

    fraud_df = pd.DataFrame(frauds)

    # Add the is_fraud column to original df as False
    df['is_fraud'] = False

    combined = pd.concat([df, fraud_df], ignore_index=True)
    combined.to_csv('syntheticTransactions.csv', index=False)


if __name__ == "__main__":
    df = pd.read_csv('normalTransactions.csv')
    inject_frauds(df)
