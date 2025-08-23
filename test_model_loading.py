#!/usr/bin/env python3
"""
Test model loading in FastAPI context
"""

import sys
import os
sys.path.append('backend')

def test_model_loading():
    try:
        print("Testing model loading...")
        
        # Test imports
        from api.model import load_model, preprocess
        print("✅ Imports successful")
        
        # Test model loading
        model = load_model()
        print("✅ Model loaded successfully")
        
        # Test preprocessing
        import pandas as pd
        test_df = pd.DataFrame([{
            'user_id': 'user_1',
            'amount': 1500.50,
            'location': 'Mumbai',
            'device': 'android',
            'merchant': 'Cafe',
            'timestamp': '2024-01-15 14:30:00'
        }])
        
        X = preprocess(test_df)
        print(f"✅ Preprocessing successful, shape: {X.shape}")
        
        # Test model inference
        import torch
        X_tensor = torch.tensor(X, dtype=torch.float32)
        with torch.no_grad():
            output = model(X_tensor)
        print(f"✅ Model inference successful, output shape: {output.shape}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_model_loading()
