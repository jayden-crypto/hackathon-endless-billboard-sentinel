
import React, { useEffect, useState } from 'react';
import UserReport from './UserReport';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'report'
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReview: 0,
    resolved: 0,
    responseTime: '24h'
  });
  const [apiStatus, setApiStatus] = useState('connecting...');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const API_BASE = 'http://localhost:8000/api';
  
  useEffect(() => {
    checkApiConnection();
    loadDashboard();
  }, []);

  const checkApiConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('disconnected');
      console.error('API connection failed:', error);
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      // Try to load real data from API
      let apiReports = [];
      try {
        const response = await fetch(`${API_BASE}/reports`);
        if (response.ok) {
          apiReports = await response.json();
          // Transform API data to match frontend expectations
          apiReports = apiReports.map(report => ({
            ...report,
            detections: report.detections.map(det => {
              // Extract detection tags from violations
              const tags = [];
              if (det.violations) {
                det.violations.forEach(violation => {
                  if (violation.type === 'size') tags.push('Oversized');
                  if (violation.type === 'placement') tags.push('Improper Placement');
                  if (violation.type === 'license_missing') tags.push('No License');
                  if (violation.type === 'license_invalid') tags.push('Invalid License');
                });
              }
              return tags.length > 0 ? tags : ['Billboard'];
            }).flat()
          }));
        }
      } catch (error) {
        console.log('Using mock data - API not available:', error.message);
      }

      // If no API data, use mock data
      if (apiReports.length === 0) {
        apiReports = [
          {
            id: 1,
            location: "Downtown Area",
            coordinates: [30.354, 76.366],
            status: "Pending Review",
            timestamp: "2024-01-15T10:30:00Z",
            detections: ["Billboard", "Unauthorized"],
            image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Billboard+Detection"
          },
          {
            id: 2,
            location: "Highway Exit",
            coordinates: [30.358, 76.370],
            status: "Under Investigation",
            timestamp: "2024-01-15T09:15:00Z",
            detections: ["Billboard", "Safety Hazard"],
            image: "https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Safety+Hazard"
          },
          {
            id: 3,
            location: "Residential Zone",
            coordinates: [30.350, 76.362],
            status: "Resolved",
            timestamp: "2024-01-14T16:45:00Z",
            detections: ["Billboard", "Removed"],
            image: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Resolved+Case"
          }
        ];
      }

      setReports(apiReports);
      updateStats(apiReports);
      setLoading(false);
      
      showNotificationMessage('Dashboard loaded successfully!');
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
      showNotificationMessage('Error loading dashboard', 'error');
    }
  };

  const updateStats = (reportsData) => {
    setStats({
      totalReports: reportsData.length,
      pendingReview: reportsData.filter(r => r.status === "Pending Review").length,
      resolved: reportsData.filter(r => r.status === "Resolved").length,
      responseTime: '24h'
    });
  };

  const seedRegistry = async () => {
    try {
      const response = await fetch(`${API_BASE}/registry/seed`, {
        method: 'POST'
      });
      
      if (response.ok) {
        showNotificationMessage('Registry seeded successfully!');
        loadDashboard(); // Reload data
      } else {
        showNotificationMessage('Failed to seed registry', 'error');
      }
    } catch (error) {
      console.error('Error seeding registry:', error);
      showNotificationMessage('Error seeding registry', 'error');
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          showNotificationMessage(`Report status updated to ${newStatus}`);
          loadDashboard(); // Reload data
          setSelectedReport(null); // Close panel
        } else {
          showNotificationMessage('Failed to update status', 'error');
        }
      } else {
        const errorData = await response.json();
        showNotificationMessage(`Failed to update status: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showNotificationMessage('Error updating status', 'error');
    }
  };

  const exportData = async () => {
    try {
      const csvContent = convertToCSV(reports);
      downloadCSV(csvContent, 'billboard-reports.csv');
      showNotificationMessage('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      showNotificationMessage('Error exporting data', 'error');
    }
  };

  const convertToCSV = (data) => {
    const headers = ['ID', 'Location', 'Status', 'Timestamp', 'Detections', 'Coordinates'];
    const rows = data.map(report => [
      report.id,
      report.location,
      report.status,
      new Date(report.timestamp).toLocaleString(),
      report.detections.join(', '),
      `${report.coordinates[0]}, ${report.coordinates[1]}`
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Review': return '#FF9800';
      case 'Under Investigation': return '#2196F3';
      case 'Resolved': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Navigation component
  const Navigation = () => (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          🚨 Billboard Sentinel
        </div>
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Admin Dashboard
          </button>
          <button 
            className={`nav-tab ${currentView === 'report' ? 'active' : ''}`}
            onClick={() => setCurrentView('report')}
          >
            📱 Report Billboard
          </button>
        </div>
      </div>
    </nav>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>🚨 Loading Billboard Sentinel...</h2>
        <p>Please wait while we initialize the dashboard</p>
      </div>
    );
  }

  // Show user report interface
  if (currentView === 'report') {
    return (
      <div className="app">
        <Navigation />
        <UserReport />
      </div>
    );
  }

  // Show admin dashboard
  return (
    <div className="app">
      <Navigation />
      
      {/* Notification */}
      {showNotification && (
        <div className={`notification ${notificationMessage.includes('Error') ? 'error' : 'success'}`}>
          {notificationMessage}
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div>
            <h1 className="app-title">
              🚨 Billboard Sentinel
            </h1>
            <p className="app-subtitle">Smart Detection & Civic Reporting System</p>
            <div className="api-status">
              API Status: <span className={`status-indicator ${apiStatus}`}>{apiStatus}</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={loadDashboard}>
              🔄 Refresh
            </button>
            <button className="btn btn-secondary" onClick={exportData}>
              📊 Export Data
            </button>
            <button className="btn btn-secondary" onClick={seedRegistry}>
              🌱 Seed Registry
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalReports}</h3>
            <p>Total Reports</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingReview}</h3>
            <p>Pending Review</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <h3>{stats.responseTime}</h3>
            <p>Response Time</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Reports List */}
        <div className="reports-section">
          <h2 className="section-title">📋 Recent Reports</h2>
          <div className="reports-grid">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className={`report-card ${selectedReport?.id === report.id ? 'selected' : ''}`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="report-image">
                  <img src={report.image} alt="Detection" />
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(report.status) }}
                  >
                    {report.status}
                  </div>
                </div>
                <div className="report-details">
                  <h3>{report.location}</h3>
                  <p className="timestamp">🕒 {formatDate(report.timestamp)}</p>
                  <div className="detections">
                    {report.detections.map((detection, index) => (
                      <span key={index} className="detection-tag">
                        {detection}
                      </span>
                    ))}
                  </div>
                  <p className="coordinates">
                    📍 {report.coordinates[0].toFixed(4)}, {report.coordinates[1].toFixed(4)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Details Panel */}
        {selectedReport && (
          <div className="details-panel">
            <div className="panel-header">
              <h2>📋 Report Details</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedReport(null)}
              >
                ✕
              </button>
            </div>
            <div className="panel-content">
              <div className="detail-image">
                <img src={selectedReport.image} alt="Detection" />
              </div>
              <div className="detail-info">
                <h3>{selectedReport.location}</h3>
                <p><strong>Status:</strong> 
                  <span 
                    className="status-text"
                    style={{ color: getStatusColor(selectedReport.status) }}
                  >
                    {selectedReport.status}
                  </span>
                </p>
                <p><strong>Reported:</strong> {formatDate(selectedReport.timestamp)}</p>
                <p><strong>Coordinates:</strong> {selectedReport.coordinates[0].toFixed(6)}, {selectedReport.coordinates[1].toFixed(6)}</p>
                <div className="detections-detail">
                  <strong>Detections:</strong>
                  <div className="detection-tags">
                    {selectedReport.detections.map((detection, index) => (
                      <span key={index} className="detection-tag">
                        {detection}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="panel-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => updateReportStatus(selectedReport.id, 'Under Investigation')}
                >
                  📝 Mark Investigating
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.open(`https://maps.google.com/?q=${selectedReport.coordinates[0]},${selectedReport.coordinates[1]}`, '_blank')}
                >
                  🗺️ View on Map
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => updateReportStatus(selectedReport.id, 'Resolved')}
                >
                  🚫 Mark Resolved
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Billboard Sentinel - Civic Tech for Safer Communities</p>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#contact">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
