import io
from fastapi import FastAPI, Request, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import json
from api.model import score_transactions
from api.alerts import add_alert, get_alerts

app = FastAPI(title="Fraud Detection API", version="1.0.0")

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Single transaction scoring endpoint
@app.post("/transaction")
async def score_endpoint(request: Request):
    try:
        txn = await request.json()
        score, alert = score_transactions(txn)
        explanation = "Transaction flagged due to high reconstruction error from normal pattern."
        if alert:
            add_alert(txn, score)
            explanation += " Likely reasons: unusual device/location/amount/timing."
        return {
            "anomaly_score": score,
            "alert_flag": alert,
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing transaction: {str(e)}")

# Batch transactions scoring endpoint
@app.post("/transactions/batch")
async def score_batch_endpoint(file: UploadFile = File(...)):
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

    # Validate required columns
    required = {'user_id', 'amount', 'location', 'device', 'merchant', 'timestamp'}
    if not required.issubset(df.columns):
        missing = required - set(df.columns)
        raise HTTPException(status_code=400, detail=f"Missing required columns: {missing}")

    try:
        results = score_transactions(df.to_dict(orient='records'))

        # Save alerts for flagged transactions
        for r in results:
            if r['alert_flag']:
                add_alert({'txn_id': r['txn_id']}, r['anomaly_score'])

        return {
            "success": True,
            "total_transactions": len(results),
            "fraudulent_transactions": len([r for r in results if r['alert_flag']]),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing transactions: {str(e)}")

# Get all alerts
@app.get("/alerts")
def get_flags():
    return get_alerts()

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "fraud-detection-api"}

# Get CSV template
@app.get("/template")
def get_csv_template():
    """Return a sample CSV structure for users to understand the expected format"""
    sample_data = {
        "columns": ["user_id", "amount", "location", "device", "merchant", "timestamp"],
        "sample_row": {
            "user_id": "user_1",
            "amount": 1500.50,
            "location": "Mumbai",
            "device": "android",
            "merchant": "Cafe",
            "timestamp": "2024-01-15 14:30:00"
        },
        "description": "Upload a CSV file with transaction data. Each row should contain user_id, amount, location, device, merchant, and timestamp."
    }
    return sample_data
