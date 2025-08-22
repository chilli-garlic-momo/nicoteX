import pandas as pd

alerts_db = []

def add_alert(txn, score):
    alerts_db.append({'txn': txn, 'score': score})

def get_alerts():
    return alerts_db
