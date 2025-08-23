#!/usr/bin/env python3
"""
Demo script for the Fraud Detection System
This script demonstrates how to use the API programmatically
"""

import requests
import json
import time

def test_backend_health():
    """Test if the backend is running"""
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✅ Backend is healthy!")
            return True
        else:
            print("❌ Backend health check failed")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running. Please start it first:")
        print("   cd backend && uvicorn api.main:app --reload")
        return False

def test_csv_upload():
    """Test CSV file upload and analysis"""
    print("\n📊 Testing CSV Upload and Analysis...")
    
    try:
        # Upload the test CSV file
        with open('test_transactions.csv', 'rb') as f:
            files = {'file': ('test_transactions.csv', f, 'text/csv')}
            response = requests.post("http://localhost:8000/transactions/batch", files=files)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ CSV analysis completed successfully!")
            print(f"📈 Total transactions: {result['total_transactions']}")
            print(f"🚨 Fraudulent transactions: {result['fraudulent_transactions']}")
            print(f"✅ Legitimate transactions: {result['total_transactions'] - result['fraudulent_transactions']}")
            
            # Show fraudulent transactions
            fraudulent = [r for r in result['results'] if r['alert_flag']]
            if fraudulent:
                print("\n🚨 Fraudulent Transactions Detected:")
                for txn in fraudulent:
                    print(f"   - Transaction ID: {txn['txn_id']}")
                    print(f"     Anomaly Score: {txn['anomaly_score']:.3f}")
                    print(f"     Explanation: {txn['explanation']}")
                    print()
            else:
                print("\n✅ No fraudulent transactions detected!")
            
            return True
        else:
            print(f"❌ CSV upload failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error during CSV upload: {e}")
        return False

def test_single_transaction():
    """Test single transaction analysis"""
    print("\n💳 Testing Single Transaction Analysis...")
    
    # Test transaction data
    test_txn = {
        "user_id": "user_test",
        "amount": 5000.00,
        "location": "New York",
        "device": "android",
        "merchant": "Electronics",
        "timestamp": "2024-01-15 02:30:00"
    }
    
    try:
        response = requests.post(
            "http://localhost:8000/transaction",
            json=test_txn,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Single transaction analysis completed!")
            print(f"   Anomaly Score: {result['anomaly_score']:.3f}")
            print(f"   Alert Flag: {result['alert_flag']}")
            print(f"   Explanation: {result['explanation']}")
            return True
        else:
            print(f"❌ Single transaction analysis failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error during single transaction analysis: {e}")
        return False

def main():
    """Main demo function"""
    print("🔐 Fraud Detection System - Demo")
    print("=" * 40)
    
    # Test backend health
    if not test_backend_health():
        return
    
    # Test single transaction
    test_single_transaction()
    
    # Test CSV upload
    test_csv_upload()
    
    print("\n🎉 Demo completed!")
    print("\n📝 Next steps:")
    print("   1. Open frontend/index.html in your browser")
    print("   2. Login with: user123 / pass123")
    print("   3. Upload the test_transactions.csv file")
    print("   4. View the fraud detection results!")

if __name__ == "__main__":
    main()
