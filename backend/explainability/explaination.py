import pandas as pd

def generate_explanation(txn):
    text = []
    # Existing checks
    if txn['amount'] > 4000:
        text.append("Unusually high amount.")
    if txn['location'] not in ['Mumbai', 'Delhi', 'Bangalore']:
        text.append("Location deviates from normal profile.")
    if txn['device'] not in ['ios', 'android', 'web']:
        text.append("Unknown device used.")
    hour = pd.to_datetime(txn['timestamp']).hour
    if hour < 6 or hour > 22:
        text.append("Off-hour transaction.")

    # New contextual explanations
    if 'avg_amount' in txn and txn['amount'] > txn['avg_amount'] * 2:
        text.append("Transaction amount is significantly above user’s average.")

    if 'txn_count' in txn and txn['txn_count'] > 5:
        text.append("High transaction frequency detected for user.")

    if text:
        return " ".join(text)
    return "No suspicious features detected."
