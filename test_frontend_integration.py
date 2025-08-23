#!/usr/bin/env python3
"""
Test frontend integration by simulating CSV upload
"""

import requests
import json

def test_csv_upload():
    print("Testing CSV upload (simulating frontend)...")
    
    try:
        # Simulate frontend CSV upload
        with open('test_transactions.csv', 'rb') as f:
            files = {'file': ('test_transactions.csv', f, 'text/csv')}
            response = requests.post("http://localhost:8000/transactions/batch", files=files, timeout=30)
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ CSV upload successful!")
            print(f"Total transactions: {result['total_transactions']}")
            print(f"Fraudulent transactions: {result['fraudulent_transactions']}")
            
            # Show sample results
            if result['results']:
                print("\nSample results:")
                for i, txn in enumerate(result['results'][:3]):
                    print(f"  Transaction {i+1}:")
                    print(f"    ID: {txn['txn_id']}")
                    print(f"    Score: {txn['anomaly_score']:.3f}")
                    print(f"    Alert: {txn['alert_flag']}")
                    print(f"    Explanation: {txn['explanation']}")
            
            return True
        else:
            print(f"❌ CSV upload failed: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error during CSV upload: {e}")
        return False

def test_single_transaction():
    print("\nTesting single transaction...")
    
    try:
        test_txn = {
            "user_id": "user_1",
            "amount": 1500.50,
            "location": "Mumbai",
            "device": "android",
            "merchant": "Cafe",
            "timestamp": "2024-01-15 14:30:00"
        }
        
        response = requests.post(
            "http://localhost:8000/transaction",
            json=test_txn,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Single transaction successful!")
            print(f"Score: {result['anomaly_score']:.3f}")
            print(f"Alert: {result['alert_flag']}")
            print(f"Explanation: {result['explanation']}")
            return True
        else:
            print(f"❌ Single transaction failed: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error during single transaction: {e}")
        return False

if __name__ == "__main__":
    print("🔐 Testing Frontend-Backend Integration")
    print("=" * 40)
    
    # Test CSV upload
    csv_success = test_csv_upload()
    
    # Test single transaction
    single_success = test_single_transaction()
    
    print("\n" + "=" * 40)
    if csv_success and single_success:
        print("🎉 All tests passed! Frontend integration should work.")
    else:
        print("❌ Some tests failed. Check the backend logs.")
