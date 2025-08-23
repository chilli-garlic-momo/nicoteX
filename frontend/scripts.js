const app = {
      isLoggedIn: false,
      currentUser: null,
      
      init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.updateTimestamp();
      },

      checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
          this.showDashboard();
        } else {
          this.showLogin();
        }
      },

      setupEventListeners() {
        // Navigation
        document.querySelectorAll('.sidebar-nav-link').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            this.showSection(section);
            this.setActiveNavItem(link);
          });
        });

        // Scenario filter
        const scenarioFilter = document.getElementById('scenario-filter');
        if (scenarioFilter) {
          scenarioFilter.addEventListener('change', this.updateScenarioDetails);
        }

        // CSV File Input
        const csvFileInput = document.getElementById('csvFileInput');
        const csvDragDropArea = document.getElementById('csvDragDropArea');

        if (csvFileInput && csvDragDropArea) {
          csvFileInput.addEventListener('change', (e) => this.handleCsvFile(e.target.files[0]));
          csvDragDropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            csvDragDropArea.style.borderColor = 'var(--primary)';
          });
          csvDragDropArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            csvDragDropArea.style.borderColor = 'var(--border)';
          });
          csvDragDropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            csvDragDropArea.style.borderColor = 'var(--border)';
            this.handleCsvFile(e.dataTransfer.files[0]);
          });
        }
      },

      showSection(sectionName) {
        // Hide all content sections
        document.querySelectorAll('.page-content').forEach(section => {
          section.style.display = 'none';
        });

        // Show selected section
        const targetSection = document.getElementById(${sectionName}-content);
        if (targetSection) {
          targetSection.style.display = 'block';
        }

        // Update page title and subtitle
        const pageTitle = document.getElementById('page-title');
        const pageSubtitle = document.getElementById('page-subtitle');
        
        const sectionConfig = {
          dashboard: {
            title: 'Dashboard Overview',
            subtitle: 'Monitor your banking security in real-time'
          },
          alerts: {
            title: 'Fraud Alerts',
            subtitle: 'Manage and review security alerts and notifications'
          },
          transactions: {
            title: 'Transaction History',
            subtitle: 'View and analyze your transaction patterns'
          },
          scenarios: {
            title: 'Synthetic Scenarios',
            subtitle: 'Test fraud detection with simulated scenarios'
          }
        };

        const config = sectionConfig[sectionName] || sectionConfig.dashboard;
        pageTitle.textContent = config.title;
        pageSubtitle.textContent = config.subtitle;
      },

      showLogin() {
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('dashboard-page').style.display = 'none';
        document.getElementById('username').focus();
      },

      showDashboard() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard-page').style.display = 'block';
        this.isLoggedIn = true;
        this.showSection('dashboard'); // Show default section
        this.startLiveUpdates();
        this.updateWelcomeMessage(); // New: Update welcome message
      },

      setActiveNavItem(activeLink) {
        document.querySelectorAll('.sidebar-nav-link').forEach(link => {
          link.classList.remove('active');
        });
        activeLink.classList.add('active');
      },

      updateWelcomeMessage() { // New method
        const username = localStorage.getItem('username') || 'User';
        document.getElementById('welcome-message').textContent = Hello, ${username}!;
        document.querySelector('.user-avatar').textContent = username.charAt(0).toUpperCase();
      },

      updateScenarioDetails() {
        const scenario = document.getElementById('scenario-filter').value;
        const detailsDiv = document.getElementById('synthetic-details');
        
        const scenarios = {
          'normal': 'Normal operations with standard transaction patterns and expected user behavior.',
          'fraud-type-1': 'Card fraud simulation: Unusual spending patterns, geographic anomalies, and merchant category deviations.',
          'fraud-type-2': 'Identity theft simulation: Multiple account access attempts, profile changes, and suspicious authentication patterns.',
          'fraud-type-3': 'Account takeover simulation: Login from new devices, password changes, and unauthorized transaction attempts.'
        };

        detailsDiv.innerHTML = <p>${scenarios[scenario]}</p>;
      },

      updateTimestamp() {
        const updateElement = document.getElementById('last-update');
        if (updateElement) {
          const now = new Date();
          updateElement.textContent = now.toLocaleTimeString();
        }
      },

      startLiveUpdates() {
        // Update timestamp every 30 seconds
        setInterval(() => {
          this.updateTimestamp();
        }, 30000);
      },

      handleCsvFile(file) {
        const fileNameDisplay = document.getElementById('fileNameDisplay');
        const csvDataDisplay = document.querySelector('#csvFileInput + label + div + p + .chart-placeholder');

        if (!file) {
          fileNameDisplay.textContent = 'No file selected.';
          csvDataDisplay.innerHTML = '📊 Uploaded CSV data will be displayed here';
          return;
        }

        fileNameDisplay.textContent = Selected file: ${file.name};

        const reader = new FileReader();
        reader.onload = (e) => {
          const csvContent = e.target.result;
          this.displayCsvOnDashboard(csvContent);
        };
        reader.readAsText(file);
      },

      displayCsvOnDashboard(csvString) {
        const csvDataDisplay = document.querySelector('#csvFileInput + label + div + p + .chart-placeholder');
        const lines = csvString.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length === 0) {
          csvDataDisplay.innerHTML = '<p style="color: var(--error);">Error: CSV file is empty.</p>';
          return;
        }

        let html = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; text-align: left;">';
        
        // Headers
        html += '<thead><tr style="border-bottom: 1px solid var(--glass-border);">';
        lines[0].split(',').forEach(header => {
          html += <th style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">${header.trim()}</th>;
        });
        html += '</tr></thead>';
        
        // Body
        html += '<tbody>';
        for (let i = 1; i < lines.length; i++) {
          html += '<tr style="border-bottom: 1px solid var(--glass-border);">';
          lines[i].split(',').forEach(cell => {
            html += <td style="padding: 0.75rem 0.5rem;">${cell.trim()}</td>;
          });
          html += '</tr>';
        }
        html += '</tbody></table></div>';
        
        csvDataDisplay.innerHTML = html;
      }
    };

    // Authentication Functions
    function handleLogin(event) {
      event.preventDefault();
      
      const form = document.querySelector('.login-container');
      const loginBtn = document.getElementById('login-text');
      const loadingSpinner = document.getElementById('login-loading');
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      // Show loading state
      loginBtn.style.display = 'none';
      loadingSpinner.style.display = 'block';

      // Simulate API call delay
      setTimeout(() => {
        const validCredentials = username === 'user123' && password === 'pass123';
        
        if (validCredentials) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', username);
          app.currentUser = username;
          app.showDashboard();
        } else {
          // Reset button state
          loginBtn.style.display = 'block';
          loadingSpinner.style.display = 'none';
          
          // Show error
          form.classList.add('shake');
          setTimeout(() => form.classList.remove('shake'), 500);
          
          // Focus on username field
          document.getElementById('username').focus();
          document.getElementById('username').select();
        }
      }, 1000);
    }

    function handleLogout() {
      if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        app.currentUser = null;
        app.isLoggedIn = false;
        app.showLogin();
      }
    }

    function toggleSidebar() {
      // On mobile, this can still be used for manual toggle
      // On desktop, hover handles the interaction
      const sidebar = document.getElementById('sidebar');
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('collapsed');
      }
    }

    // Initialize app when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      app.init();
    });