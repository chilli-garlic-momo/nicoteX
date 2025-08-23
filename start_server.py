#!/usr/bin/env python3
"""
Startup script for the Fraud Detection System
This script will start the FastAPI backend server
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import pandas
        import torch
        import sklearn
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def start_backend():
    """Start the FastAPI backend server"""
    print("🚀 Starting Fraud Detection Backend...")
    
    # Change to backend directory
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return False
    
    os.chdir(backend_dir)
    
    try:
        # Start the server
        print("📡 Starting FastAPI server on http://localhost:8000")
        print("📊 API Documentation will be available at http://localhost:8000/docs")
        print("🔍 Health check: http://localhost:8000/health")
        print("\n" + "="*50)
        print("Press Ctrl+C to stop the server")
        print("="*50 + "\n")
        
        # Start uvicorn server
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "api.main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ])
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        return True
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return False

def main():
    """Main function"""
    print("🔐 Fraud Detection System")
    print("=" * 30)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Start backend
    start_backend()

if __name__ == "__main__":
    main()
