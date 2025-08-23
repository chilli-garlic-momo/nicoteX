import io
from fastapi import FastAPI, Request, File, UploadFile
import pandas as pd
from api.model import score_transactions
from api.alerts import add_alert, get_alerts

app = FastAPI()

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

@app.post("/transactions/batch")
async def score_batch_endpoint(file: UploadFile = File(...)):
    """
    Endpoint to receive a CSV file with multiple transactions, score them, and return results.
    """
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    # Expect columns like user_id, amount, location, device, merchant, timestamp, txn_id (optional)
    results = score_transactions(df.to_dict(orient='records'))

    # Save alerts for flagged transactions
    for r in results:
        if r['alert_flag']:
            # Store minimum transaction identifying data in alerts for backend use
            add_alert({'txn_id': r['txn_id']}, r['anomaly_score'])

    return results

@app.get("/alerts")
def get_flags():
    return get_alerts()
