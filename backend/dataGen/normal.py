import numpy as np
import pandas as pd
import random
from datetime import datetime, timedelta

# Basic config
NUM_USERS = 50
SEQS_PER_USER = 100

def generate_normal_sequence(user_id):
    base_location = random.choice(['Mumbai', 'Delhi', 'Bangalore'])
    device = random.choice(['android', 'ios', 'web'])
    merchant_choices = ['Cafe', 'Grocery', 'Electronics', 'Online Store']
    transactions = []
    last_time = datetime.now() - timedelta(days=10)

    for _ in range(SEQS_PER_USER):
        timestamp = last_time + timedelta(minutes=random.randint(20, 1440))
        amount = round(np.random.normal(1200, 500), 2)
        merchant = random.choice(merchant_choices)
        transactions.append({
            'user_id': user_id,
            'timestamp': timestamp,
            'location': base_location,
            'amount': max(amount, 50),  # Avoid negative
            'merchant': merchant,
            'device': device
        })
        last_time = timestamp

    return transactions

def generate_dataset():
    all_txn = []
    for user in range(NUM_USERS):
        all_txn.extend(generate_normal_sequence(f"user_{user}"))
    return pd.DataFrame(all_txn)

if __name__ == "__main__":
    df = generate_dataset()
    df.to_csv('normal_transactions.csv', index=False)
