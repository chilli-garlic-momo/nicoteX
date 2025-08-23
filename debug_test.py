#!/usr/bin/env python3
"""
Debug script to test the ML model
"""

import sys
import os
sys.path.append('backend')

try:
    print("Testing imports...")
    from api.model import score_transactions
    print("✅ Model imports successfully")
    
    # Test with a simple transaction
    test_txn = {
        "user_id": "user_1",
        "amount": 1500.50,
        "location": "Mumbai",
        "device": "android",
        "merchant": "Cafe",
        "timestamp": "2024-01-15 14:30:00"
    }
    
    print("Testing single transaction...")
    results = score_transactions(test_txn)
    print(f"✅ Single transaction processed: {len(results)} results")
    
    if results:
        result = results[0]
        print(f"Anomaly Score: {result['anomaly_score']}")
        print(f"Alert Flag: {result['alert_flag']}")
        print(f"Explanation: {result['explanation']}")
    
    # Test with multiple transactions
    test_txns = [
        {
            "user_id": "user_1",
            "amount": 1500.50,
            "location": "Mumbai",
            "device": "android",
            "merchant": "Cafe",
            "timestamp": "2024-01-15 14:30:00"
        },
        {
            "user_id": "user_2",
            "amount": 5000.00,
            "location": "Delhi",
            "device": "ios",
            "merchant": "Electronics",
            "timestamp": "2024-01-15 02:30:00"
        }
    ]
    
    print("\nTesting multiple transactions...")
    results = score_transactions(test_txns)
    print(f"✅ Multiple transactions processed: {len(results)} results")
    
    for i, result in enumerate(results):
        print(f"Transaction {i+1}:")
        print(f"  Anomaly Score: {result['anomaly_score']}")
        print(f"  Alert Flag: {result['alert_flag']}")
        print(f"  Explanation: {result['explanation']}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
