import requests
import random
from datetime import datetime

URL = "http://localhost:8000/transaction"

def test_normal():
    txn = {
        "user_id": "user_5",
        "timestamp": str(datetime.now()),
        "location": "Mumbai",
        "amount": 950,
        "merchant": "Cafe",
        "device": "android"
    }
    r = requests.post(URL, json=txn)
    print("Normal:", r.json())

def test_fraud():
    txn = {
        "user_id": "user_5",
        "timestamp": str(datetime.now()),
        "location": "London",                       # location drift
        "amount": 8000,                             # high amount
        "merchant": "Electronics",
        "device": "unknown_dev"                     # takeover pattern
    }
    r = requests.post(URL, json=txn)
    print("Fraud:", r.json())

if __name__ == "__main__":
    test_normal()
    test_fraud()
