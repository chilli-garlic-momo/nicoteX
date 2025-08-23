import io
from fastapi import FastAPI, Request, File, UploadFile
import pandas as pd
from api.model import score_transactions
from api.alerts import add_alert, get_alerts

app = FastAPI()

# Single transaction scoring endpoint
@app.post("/transaction")
async def score_endpoint(request: Request):
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

# Batch transactions scoring endpoint
@app.post("/transactions/batch")
async def score_batch_endpoint(file: UploadFile = File(...)):
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        return {"error": f"Failed to parse CSV: {str(e)}"}

    # Validate required columns
    required = {'user_id', 'amount', 'location', 'device', 'merchant', 'timestamp'}
    if not required.issubset(df.columns):
        missing = required - set(df.columns)
        return {"error": f"Missing columns: {missing}"}

    results = score_transactions(df.to_dict(orient='records'))

    # Save alerts for flagged transactions
    for r in results:
        if r['alert_flag']:
            add_alert({'txn_id': r['txn_id']}, r['anomaly_score'])

    return results

# Get all alerts
@app.get("/alerts")
def get_flags():
    return get_alerts()
