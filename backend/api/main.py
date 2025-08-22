from fastapi import FastAPI, Request
from api.model import score_transaction
from api.alerts import add_alert, get_alerts

app = FastAPI()

@app.post("/transaction")
async def score_endpoint(request: Request):
    txn = await request.json()
    score, alert = score_transaction(txn)
    explanation = "Transaction flagged due to high reconstruction error from normal pattern."
    if alert:
        add_alert(txn, score)
        explanation += " Likely reasons: unusual device/location/amount/timing."
    return {
        "anomaly_score": score,
        "alert_flag": alert,
        "explanation": explanation
    }

@app.get("/alerts")
def get_flags():
    return get_alerts()
