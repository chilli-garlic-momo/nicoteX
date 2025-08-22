import pandas as pd

def generate_explanation(txn):
    text = []
    if txn['amount'] > 4000:
        text.append("Unusually high amount.")
    if txn['location'] not in ['Mumbai', 'Delhi', 'Bangalore']:
        text.append("Location deviates from normal profile.")
    if txn['device'] not in ['ios', 'android', 'web']:
        text.append("Unknown device used.")
    # Time-based (simplified)
    hour = pd.to_datetime(txn['timestamp']).hour
    if hour < 6 or hour > 22:
        text.append("Off-hour transaction.")
    if text:
        return " ".join(text)
    return "No suspicious features detected."
