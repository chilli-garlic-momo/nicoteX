// Add a transaction to the live transaction stream
function addTransaction(tx) {
    const el = document.createElement('div');
    el.classList.add('transaction-item');
    el.innerHTML = `<b>${tx.amount}</b> from <span>${tx.user}</span> — ${tx.device}<br><small>${tx.time}</small>`;
    document.getElementById('transaction-stream').appendChild(el);
}

// Add a fraud alert
function addAlert(alert) {
    const el = document.createElement('div');
    el.classList.add('alert-item');
    el.innerHTML = `<span>⚠</span> Score: <b>${alert.score}</b><br>${alert.reason}`;
    document.getElementById('alert-list').appendChild(el);
}

// Show explanation text
function showExplanation(exp) {
    document.getElementById('explanation-box').innerText = exp;
}

// Show synthetic scenario details
function showSyntheticScenario(details) {
    document.getElementById('synthetic-details').innerText = details;
}

// Example simulated data for demo
addTransaction({amount: '$1200', user: 'U123', device: 'Mobile', time: '12:41 PM'});
addTransaction({amount: '$22', user: 'U889', device: 'Web', time: '12:43 PM'});
addAlert({score: '0.87', reason: 'Unusual amount at late hour.'});
showExplanation('Pattern deviates from user’s normal routine on weekday evenings. This would be normal if from their usual location.');
showSyntheticScenario('Scenario: Fraud Type 1. Multiple high-value transfers detected from new device.');

// Scenario filter change event
document.getElementById('scenario-filter').addEventListener('change', function(e) {
    const val = e.target.value;
    if (val === 'normal') {
        showSyntheticScenario('Normal transaction behavior observed.');
    } else if (val === 'fraud-type-1') {
        showSyntheticScenario('Scenario: Fraud Type 1. Multiple high-value transfers detected from new device.');
    } else if (val === 'fraud-type-2') {
        showSyntheticScenario('Scenario: Fraud Type 2. Suspicious frequency during late night hours.');
    }
});

const sidebar = document.getElementById('sidebar');
        const body = document.body;

        sidebar.addEventListener('mouseenter', function() {
            body.classList.add('sidebar-expanded');
        });

        sidebar.addEventListener('mouseleave', function() {
            body.classList.remove('sidebar-expanded');
        });