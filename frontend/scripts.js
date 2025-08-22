import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Shield, Activity, Clock, MapPin, CreditCard, User, TrendingUp, Eye, Play, Pause, RotateCcw } from 'lucide-react';

// Synthetic transaction generator - replace this with data output from your fraud detection model
const generateTransaction = () => {
  const users = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown'];
  const merchants = ['Amazon', 'Walmart', 'Starbucks', 'Gas Station', 'Restaurant', 'ATM Withdrawal', 'Online Store'];
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
  const devices = ['iPhone 14', 'Android Samsung', 'Desktop Chrome', 'iPad', 'Mobile Safari'];
  
  const user = users[Math.floor(Math.random() * users.length)];
  const baseAmount = Math.random() * 1000;
  const isFraud = Math.random() < 0.15; // 15% fraud rate
  
  let transaction = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toLocaleTimeString(),
    user: user,
    amount: isFraud ? baseAmount * (2 + Math.random() * 3) : baseAmount,
    merchant: merchants[Math.floor(Math.random() * merchants.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    device: devices[Math.floor(Math.random() * devices.length)],
    hour: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
    isFraud: isFraud
  };
  
  // Calculate fraud score and features
  const features = calculateFraudFeatures(transaction);
  transaction = { ...transaction, ...features };
  
  return transaction;
};

// Fraud Detection Dashboard JavaScript
class FraudDetectionDashboard {
    constructor() {
        this.transactions = [];
        this.isStreaming = false;
        this.selectedTransaction = null;
        this.stats = {
            total: 0,
            fraudulent: 0,
            blocked: 0,
            approved: 0
        };
        this.chartData = [];
        this.streamInterval = null;
        this.volumeChart = null;
        this.riskChart = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initCharts();
    }

    bindEvents() {
        const streamBtn = document.getElementById('streamBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        streamBtn.addEventListener('click', () => this.toggleStreaming());
        resetBtn.addEventListener('click', () => this.resetDemo());
    }

    initCharts() {
        // Volume Chart
        const volumeCtx = document.getElementById('volumeChart').getContext('2d');
        this.volumeChart = new Chart(volumeCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Total Transactions',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Fraudulent',
                        data: [],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9'
                        }
                    },
                    x: {
                        grid: {
                            color: '#f1f5f9'
                        }
                    }
                }
            }
        });

        // Risk Distribution Chart
        const riskCtx = document.getElementById('riskChart').getContext('2d');
        this.riskChart = new Chart(riskCtx, {
            type: 'doughnut',
            data: {
                labels: ['Low Risk', 'Medium Risk', 'High Risk'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    generateTransaction() {
        const users = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown'];
        const merchants = ['Amazon', 'Walmart', 'Starbucks', 'Gas Station', 'Restaurant', 'ATM Withdrawal', 'Online Store'];
        const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
        const devices = ['iPhone 14', 'Android Samsung', 'Desktop Chrome', 'iPad', 'Mobile Safari'];
        
        const user = users[Math.floor(Math.random() * users.length)];
        const baseAmount = Math.random() * 1000;
        const isFraud = Math.random() < 0.15; // 15% fraud rate
        
        let transaction = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toLocaleTimeString(),
            user: user,
            amount: isFraud ? baseAmount * (2 + Math.random() * 3) : baseAmount,
            merchant: merchants[Math.floor(Math.random() * merchants.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            device: devices[Math.floor(Math.random() * devices.length)],
            hour: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            isFraud: isFraud
        };
        
        // Calculate fraud features
        const features = this.calculateFraudFeatures(transaction);
        transaction = { ...transaction, ...features };
        
        return transaction;
    }

    calculateFraudFeatures(transaction) {
        let score = 0;
        let explanations = [];
        let featureImportances = {};
        
        // Amount anomaly
        if (transaction.amount > 2000) {
            score += 0.3;
            explanations.push("Unusually high transaction amount");
            featureImportances.amount = 0.3;
        }
        
        // Time anomaly (late night transactions)
        if (transaction.hour < 6 || transaction.hour > 23) {
            score += 0.25;
            explanations.push("Transaction at unusual hours (late night/early morning)");
            featureImportances.time = 0.25;
        }
        
        // Weekend pattern
        if (transaction.dayOfWeek === 0 || transaction.dayOfWeek === 6) {
            score += 0.15;
            explanations.push("Weekend transaction pattern deviation");
            featureImportances.dayPattern = 0.15;
        }
        
        // Device/location mismatch simulation
        if (Math.random() < 0.3) {
            score += 0.2;
            explanations.push("New device or unusual location detected");
            featureImportances.deviceLocation = 0.2;
        }
        
        // Merchant risk
        if (transaction.merchant === 'ATM Withdrawal' && transaction.amount > 500) {
            score += 0.1;
            explanations.push("Large ATM withdrawal");
            featureImportances.merchantRisk = 0.1;
        }
        
        const riskLevel = score > 0.7 ? 'HIGH' : score > 0.4 ? 'MEDIUM' : 'LOW';
        const fraudProbability = Math.min(score * 100, 95);
        
        return {
            fraudScore: score,
            fraudProbability: fraudProbability,
            riskLevel: riskLevel,
            explanations: explanations,
            featureImportances: featureImportances,
            isAlert: score > 0.4
        };
    }

    toggleStreaming() {
        const streamBtn = document.getElementById('streamBtn');
        const icon = streamBtn.querySelector('i');
        
        if (this.isStreaming) {
            // Stop streaming
            clearInterval(this.streamInterval);
            this.isStreaming = false;
            streamBtn.innerHTML = '<i class="fas fa-play"></i> Start Stream';
            streamBtn.classList.remove('streaming');
        } else {
            // Start streaming
            this.isStreaming = true;
            streamBtn.innerHTML = '<i class="fas fa-pause"></i> Stop Stream';
            streamBtn.classList.add('streaming');
            
            this.streamInterval = setInterval(() => {
                this.addTransaction();
            }, 2000);
        }
    }

    addTransaction() {
        const newTransaction = this.generateTransaction();
        this.transactions = [newTransaction, ...this.transactions].slice(0, 50); // Keep last 50
        
        // Update stats
        this.stats.total += 1;
        if (newTransaction.isAlert) this.stats.fraudulent += 1;
        if (newTransaction.fraudScore > 0.7) this.stats.blocked += 1;
        else this.stats.approved += 1;
        
        // Update UI
        this.updateStatsDisplay();
        this.updateTransactionStream();
        this.updateCharts();
    }

    updateStatsDisplay() {
        document.getElementById('totalTransactions').textContent = this.stats.total;
        document.getElementById('fraudulentAlerts').textContent = this.stats.fraudulent;
        document.getElementById('blockedTransactions').textContent = this.stats.blocked;
        document.getElementById('approvedTransactions').textContent = this.stats.approved;
    }

    updateTransactionStream() {
        const streamContainer = document.getElementById('transactionStream');
        
        // Clear empty state if it exists
        const emptyState = streamContainer.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Clear existing transactions and rebuild
        streamContainer.innerHTML = '';
        
        this.transactions.forEach((transaction, index) => {
            const transactionElement = this.createTransactionElement(transaction);
            if (index === 0) {
                transactionElement.classList.add('new-transaction');
            }
            streamContainer.appendChild(transactionElement);
        });
    }

    createTransactionElement(transaction) {
        const div = document.createElement('div');
        div.className = `transaction-item ${transaction.isAlert ? 'fraud-alert' : ''}`;
        div.addEventListener('click', () => this.selectTransaction(transaction));
        
        const riskClass = transaction.riskLevel === 'HIGH' ? 'risk-high' : 
                         transaction.riskLevel === 'MEDIUM' ? 'risk-medium' : 'risk-low';
        
        div.innerHTML = `
            <div class="transaction-header">
                <div class="transaction-info">
                    <div class="risk-indicator ${riskClass}"></div>
                    <div>
                        <div class="transaction-user">${transaction.user}</div>
                        <div class="transaction-details">${transaction.merchant} • ${transaction.location}</div>
                    </div>
                </div>
                <div>
                    <div class="transaction-amount">${transaction.amount.toFixed(2)}</div>
                    <div class="transaction-time">${transaction.timestamp}</div>
                </div>
            </div>
            ${transaction.isAlert ? `
                <div class="fraud-alert-badge">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Fraud Alert - ${transaction.fraudProbability.toFixed(1)}% probability</span>
                </div>
            ` : ''}
        `;
        
        return div;
    }

    selectTransaction(transaction) {
        this.selectedTransaction = transaction;
        this.updateExplainabilityPanel();
        
        // Highlight selected transaction
        document.querySelectorAll('.transaction-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.target.closest('.transaction-item').classList.add('selected');
    }

    updateExplainabilityPanel() {
        const content = document.getElementById('explainabilityContent');
        
        if (!this.selectedTransaction) {
            content.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-eye"></i>
                    <p>Select a transaction from the stream to see detailed AI explanations and risk analysis.</p>
                </div>
            `;
            return;
        }
        
        const transaction = this.selectedTransaction;
        const riskBadgeClass = transaction.riskLevel === 'HIGH' ? 'risk-badge-high' : 
                              transaction.riskLevel === 'MEDIUM' ? 'risk-badge-medium' : 'risk-badge-low';
        
        content.innerHTML = `
            <!-- Transaction Details -->
            <div class="transaction-detail-card">
                <h3>Transaction Details</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <span>${transaction.user}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-credit-card"></i>
                        <span>${transaction.amount.toFixed(2)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${transaction.location}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${transaction.timestamp}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-store"></i>
                        <span>${transaction.merchant}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-mobile-alt"></i>
                        <span>${transaction.device}</span>
                    </div>
                </div>
            </div>

            <!-- Risk Assessment -->
            <div class="risk-assessment">
                <h3>Risk Assessment</h3>
                <div class="risk-badge ${riskBadgeClass}">
                    ${transaction.riskLevel} RISK - ${transaction.fraudProbability.toFixed(1)}% probability
                </div>
            </div>

            <!-- Feature Importance -->
            <div class="feature-importance">
                <h3>Key Risk Factors</h3>
                <div class="feature-list">
                    ${Object.entries(transaction.featureImportances || {}).map(([feature, importance]) => `
                        <div class="feature-item">
                            <span class="feature-name">${feature.replace(/([A-Z])/g, ' $1')}</span>
                            <div class="feature-bar-container">
                                <div class="feature-bar">
                                    <div class="feature-bar-fill" style="width: ${importance * 100}%"></div>
                                </div>
                                <span class="feature-percentage">${(importance * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- AI Explanations -->
            <div class="ai-explanations">
                <h3>AI Explanation</h3>
                <div class="explanation-list">
                    ${transaction.explanations.map(explanation => `
                        <div class="explanation-item">
                            <div class="explanation-dot"></div>
                            <p>${explanation}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- What-if Analysis -->
            <div class="what-if-analysis">
                <h3>What-If Analysis</h3>
                <p>If this transaction occurred during normal business hours (9 AM - 6 PM), 
                the fraud probability would decrease by approximately 25%.</p>
                ${transaction.amount > 1000 ? `
                    <p>If the amount were under $500, this would likely be classified as low risk.</p>
                ` : ''}
            </div>
        `;
    }

    updateCharts() {
        // Update volume chart
        const timeSlot = new Date().toLocaleTimeString().slice(0, 5);
        let chartData = [...this.chartData];
        
        const existing = chartData.find(d => d.time === timeSlot);
        if (existing) {
            existing.transactions += 1;
            if (this.transactions[0] && this.transactions[0].isAlert) existing.fraudulent += 1;
        } else {
            chartData.push({
                time: timeSlot,
                transactions: 1,
                fraudulent: this.transactions[0] && this.transactions[0].isAlert ? 1 : 0
            });
        }
        
        this.chartData = chartData.slice(-10); // Keep last 10 time slots
        
        this.volumeChart.data.labels = this.chartData.map(d => d.time);
        this.volumeChart.data.datasets[0].data = this.chartData.map(d => d.transactions);
        this.volumeChart.data.datasets[1].data = this.chartData.map(d => d.fraudulent);
        this.volumeChart.update('none');
        
        // Update risk distribution chart
        const lowRisk = this.stats.total - this.stats.fraudulent;
        const mediumRisk = Math.floor(this.stats.fraudulent * 0.6);
        const highRisk = Math.floor(this.stats.fraudulent * 0.4);
        
        this.riskChart.data.datasets[0].data = [lowRisk, mediumRisk, highRisk];
        this.riskChart.update('none');
    }

    resetDemo() {
        // Stop streaming if active
        if (this.isStreaming) {
            this.toggleStreaming();
        }
        
        // Reset data
        this.transactions = [];
        this.selectedTransaction = null;
        this.stats = { total: 0, fraudulent: 0, blocked: 0, approved: 0 };
        this.chartData = [];
        
        // Reset UI
        this.updateStatsDisplay();
        
        // Reset transaction stream
        const streamContainer = document.getElementById('transactionStream');
        streamContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-line"></i>
                <p>No transactions yet. Start the stream to begin monitoring.</p>
            </div>
        `;
        
        // Reset explainability panel
        this.updateExplainabilityPanel();
        
        // Reset charts
        this.volumeChart.data.labels = [];
        this.volumeChart.data.datasets[0].data = [];
        this.volumeChart.data.datasets[1].data = [];
        this.volumeChart.update();
        
        this.riskChart.data.datasets[0].data = [0, 0, 0];
        this.riskChart.update();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FraudDetectionDashboard();
});

const calculateFraudFeatures = (transaction) => {
  let score = 0;
  let explanations = [];
  let featureImportances = {};
  
  // Amount anomaly
  if (transaction.amount > 2000) {
    score += 0.3;
    explanations.push("Unusually high transaction amount");
    featureImportances.amount = 0.3;
  }
  
  // Time anomaly (late night transactions)
  if (transaction.hour < 6 || transaction.hour > 23) {
    score += 0.25;
    explanations.push("Transaction at unusual hours (late night/early morning)");
    featureImportances.time = 0.25;
  }
  
  // Weekend pattern
  if (transaction.dayOfWeek === 0 || transaction.dayOfWeek === 6) {
    score += 0.15;
    explanations.push("Weekend transaction pattern deviation");
    featureImportances.dayPattern = 0.15;
  }
  
  // Device/location mismatch simulation
  if (Math.random() < 0.3) {
    score += 0.2;
    explanations.push("New device or unusual location detected");
    featureImportances.deviceLocation = 0.2;
  }
  
  // Merchant risk
  if (transaction.merchant === 'ATM Withdrawal' && transaction.amount > 500) {
    score += 0.1;
    explanations.push("Large ATM withdrawal");
    featureImportances.merchantRisk = 0.1;
  }
  
  const riskLevel = score > 0.7 ? 'HIGH' : score > 0.4 ? 'MEDIUM' : 'LOW';
  const fraudProbability = Math.min(score * 100, 95);
  
  return {
    fraudScore: score,
    fraudProbability: fraudProbability,
    riskLevel: riskLevel,
    explanations: explanations,
    featureImportances: featureImportances,
    isAlert: score > 0.4
  };
};

const FraudDetectionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    fraudulent: 0,
    blocked: 0,
    approved: 0
  });
  const [chartData, setChartData] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = setInterval(() => {
        const newTransaction = generateTransaction();
        setTransactions(prev => {
          const updated = [newTransaction, ...prev].slice(0, 50); // Keep last 50
          return updated;
        });
        
        // Update stats
        setStats(prev => ({
          total: prev.total + 1,
          fraudulent: newTransaction.isAlert ? prev.fraudulent + 1 : prev.fraudulent,
          blocked: newTransaction.fraudScore > 0.7 ? prev.blocked + 1 : prev.blocked,
          approved: newTransaction.fraudScore <= 0.7 ? prev.approved + 1 : prev.approved
        }));
        
        // Update chart data
        setChartData(prev => {
          const timeSlot = new Date().toLocaleTimeString().slice(0, 5);
          const existing = prev.find(d => d.time === timeSlot);
          if (existing) {
            existing.transactions += 1;
            if (newTransaction.isAlert) existing.fraudulent += 1;
            return [...prev];
          } else {
            return [...prev, {
              time: timeSlot,
              transactions: 1,
              fraudulent: newTransaction.isAlert ? 1 : 0
            }].slice(-10);
          }
        });
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStreaming]);

  const resetDemo = () => {
    setTransactions([]);
    setStats({ total: 0, fraudulent: 0, blocked: 0, approved: 0 });
    setChartData([]);
    setSelectedTransaction(null);
    setIsStreaming(false);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />
                Fraud Detection Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Real-time transaction monitoring with AI-powered explanations</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                  isStreaming 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isStreaming ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isStreaming ? 'Stop Stream' : 'Start Stream'}
              </button>
              <button
                onClick={resetDemo}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Demo
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fraudulent Alerts</p>
                <p className="text-2xl font-bold text-red-600">{stats.fraudulent}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked</p>
                <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Transaction Volume
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="fraudulent" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Low Risk', value: stats.total - stats.fraudulent, fill: '#22c55e' },
                    { name: 'Medium Risk', value: Math.floor(stats.fraudulent * 0.6), fill: '#eab308' },
                    { name: 'High Risk', value: Math.floor(stats.fraudulent * 0.4), fill: '#ef4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Stream */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Transaction Stream
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No transactions yet. Start the stream to begin monitoring.</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      transaction.isAlert ? 'border-l-4 border-l-red-500 bg-red-50' : ''
                    }`}
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          transaction.riskLevel === 'HIGH' ? 'bg-red-500' :
                          transaction.riskLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.user}</p>
                          <p className="text-sm text-gray-600">{transaction.merchant} • {transaction.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${transaction.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{transaction.timestamp}</p>
                      </div>
                    </div>
                    {transaction.isAlert && (
                      <div className="mt-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-600">
                          Fraud Alert - {transaction.fraudProbability.toFixed(1)}% probability
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Explainability Panel */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                AI Explainability
              </h2>
            </div>
            <div className="p-6">
              {selectedTransaction ? (
                <div className="space-y-6">
                  {/* Transaction Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Transaction Details</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{selectedTransaction.user}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span>${selectedTransaction.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{selectedTransaction.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{selectedTransaction.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Risk Assessment</h3>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(selectedTransaction.riskLevel)}`}>
                      {selectedTransaction.riskLevel} RISK - {selectedTransaction.fraudProbability.toFixed(1)}% probability
                    </div>
                  </div>

                  {/* Feature Importance */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Key Risk Factors</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedTransaction.featureImportances || {}).map(([feature, importance]) => (
                        <div key={feature} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{width: `${importance * 100}%`}}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{(importance * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanations */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">AI Explanation</h3>
                    <div className="space-y-2">
                      {selectedTransaction.explanations.map((explanation, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                          <p className="text-gray-700">{explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What-if Analysis */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">What-If Analysis</h3>
                    <p className="text-sm text-gray-700">
                      If this transaction occurred during normal business hours (9 AM - 6 PM), 
                      the fraud probability would decrease by approximately 25%.
                    </p>
                    {selectedTransaction.amount > 1000 && (
                      <p className="text-sm text-gray-700 mt-2">
                        If the amount were under $500, this would likely be classified as low risk.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a transaction from the stream to see detailed AI explanations and risk analysis.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Instructions</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Click "Start Stream" to begin simulating real-time transactions</p>
            <p>• Red-highlighted transactions indicate potential fraud alerts</p>
            <p>• Click on any transaction to see detailed AI explanations and risk factors</p>
            <p>• The system automatically flags suspicious patterns like unusual amounts, timing, and locations</p>
            <p>• Use "Reset Demo" to clear all data and start fresh</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudDetectionDashboard;
