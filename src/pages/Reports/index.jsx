import React from 'react';

const Reports = () => {
  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
        <p>View and analyze your lead data with comprehensive reports</p>
      </div>
      
      <div className="reports-content">
        <div className="reports-grid">
          <div className="report-card">
            <h3>Lead Performance</h3>
            <p>Track lead conversion rates and performance metrics</p>
            <div className="report-placeholder">
              Report content coming soon...
            </div>
          </div>
          
          <div className="report-card">
            <h3>Sales Analytics</h3>
            <p>Analyze sales trends and revenue data</p>
            <div className="report-placeholder">
              Report content coming soon...
            </div>
          </div>
          
          <div className="report-card">
            <h3>Activity Summary</h3>
            <p>Overview of team activities and engagement</p>
            <div className="report-placeholder">
              Report content coming soon...
            </div>
          </div>
          
          <div className="report-card">
            <h3>Pipeline Analysis</h3>
            <p>Detailed analysis of your sales pipeline</p>
            <div className="report-placeholder">
              Report content coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 