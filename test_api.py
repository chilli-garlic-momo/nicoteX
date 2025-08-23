#!/usr/bin/env python3
"""
Simple API test without ML model
"""

import requests
import json

def test_health():
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"Health check: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_template():
    try:
        response = requests.get("http://localhost:8000/template")
        print(f"Template check: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Template check failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing API endpoints...")
    test_health()
    test_template()
