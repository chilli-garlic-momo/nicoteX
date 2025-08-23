# 🔐 Fraud Detection System

A comprehensive fraud detection system with a beautiful web interface that uses machine learning to identify fraudulent transactions in CSV data.

## 🚀 Features

- **Beautiful Web Interface**: Modern, responsive dashboard with real-time fraud detection
- **ML-Powered Analysis**: Autoencoder-based anomaly detection for transaction fraud
- **CSV Upload**: Easy drag-and-drop CSV file upload with validation
- **Real-time Results**: Instant fraud analysis with detailed explanations
- **Alert System**: Real-time fraud alerts with transaction details
- **Template Download**: Get CSV template to understand expected format

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## 🛠️ Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd nicoteX
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify installation**:
   ```bash
   python start_server.py
   ```

## 🚀 Quick Start

### Option 1: Using the startup script (Recommended)
```bash
python start_server.py
```

### Option 2: Manual startup
```bash
cd backend
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

### Access the Application

1. **Backend API**: http://localhost:8000
2. **API Documentation**: http://localhost:8000/docs
3. **Frontend**: Open `frontend/index.html` in your browser

## 📊 CSV Format

Your CSV file should contain the following columns:

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `user_id` | String | Unique user identifier | `user_1` |
| `amount` | Float | Transaction amount | `1500.50` |
| `location` | String | Transaction location | `Mumbai` |
| `device` | String | Device used | `android` |
| `merchant` | String | Merchant category | `Cafe` |
| `timestamp` | String | Transaction timestamp | `2024-01-15 14:30:00` |

### Sample CSV:
```csv
user_id,amount,location,device,merchant,timestamp
user_1,1500.50,Mumbai,android,Cafe,2024-01-15 14:30:00
user_2,2500.75,Delhi,ios,Grocery,2024-01-15 15:45:00
user_3,800.25,Bangalore,web,Electronics,2024-01-15 16:20:00
```

## 🔍 How to Use

1. **Start the System**:
   - Run `python start_server.py`
   - Wait for the backend to start

2. **Access the Frontend**:
   - Open `frontend/index.html` in your browser
   - Login with: `user123` / `pass123`

3. **Upload CSV Data**:
   - Click "Choose CSV File" or drag & drop
   - Use the "Template" button to download a sample CSV
   - Wait for analysis to complete

4. **View Results**:
   - Check the "Fraud Alerts" section for detected fraud
   - View detailed analysis in the main dashboard
   - See transaction statistics and explanations

## 🧠 Machine Learning Model

The system uses an **Autoencoder** neural network for anomaly detection:

- **Input**: Preprocessed transaction features
- **Output**: Anomaly score (0-1, higher = more suspicious)
- **Threshold**: 0.25 (configurable)
- **Features**: Amount, location, device, merchant, timing patterns

### Fraud Detection Logic:
- **High Amount**: Transactions significantly above user average
- **Location Anomaly**: Transactions from unusual locations
- **Device Mismatch**: Transactions from unknown devices
- **Off-hours**: Transactions outside normal hours (6 AM - 10 PM)
- **Frequency**: High transaction frequency for a user

## 📁 Project Structure

```
nicoteX/
├── frontend/
│   └── index.html          # Main web interface
├── backend/
│   ├── api/
│   │   ├── main.py         # FastAPI server
│   │   ├── model.py        # ML model integration
│   │   └── alerts.py       # Alert management
│   ├── model/
│   │   ├── autoencoder.pth # Trained model
│   │   ├── scaler.pkl      # Feature scaler
│   │   └── onehot.pkl      # Categorical encoder
│   ├── dataGen/            # Data generation scripts
│   └── explainability/     # Explanation generation
├── requirements.txt        # Python dependencies
├── start_server.py        # Startup script
└── README.md              # This file
```

## 🔧 API Endpoints

- `POST /transactions/batch` - Upload and analyze CSV file
- `POST /transaction` - Analyze single transaction
- `GET /alerts` - Get all fraud alerts
- `GET /health` - Health check
- `GET /template` - Get CSV template info

## 🎯 Example Usage

### 1. Upload CSV File
```javascript
const formData = new FormData();
formData.append('file', csvFile);

const response = await fetch('http://localhost:8000/transactions/batch', {
    method: 'POST',
    body: formData
});

const result = await response.json();
console.log(result);
```

### 2. Response Format
```json
{
  "success": true,
  "total_transactions": 100,
  "fraudulent_transactions": 5,
  "results": [
    {
      "txn_id": 0,
      "anomaly_score": 0.85,
      "alert_flag": true,
      "explanation": "Unusually high amount. Transaction amount is significantly above user's average."
    }
  ]
}
```

## 🐛 Troubleshooting

### Common Issues:

1. **Backend won't start**:
   - Check if port 8000 is available
   - Ensure all dependencies are installed
   - Check Python version (3.8+)

2. **CSV upload fails**:
   - Verify CSV format matches template
   - Check required columns are present
   - Ensure timestamp format is correct

3. **Frontend can't connect**:
   - Verify backend is running on localhost:8000
   - Check browser console for CORS errors
   - Ensure frontend is opened via HTTP (not file://)

### Debug Mode:
```bash
# Start with debug logging
cd backend
uvicorn api.main:app --reload --log-level debug
```

## 🔒 Security Notes

- This is a demo system - not for production use
- No real authentication implemented
- CORS is open for development
- Model files should be secured in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes.

---

**Happy Fraud Detection! 🕵️‍♂️**
