import React from 'react';
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const { t } = useTranslation();

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>{t('reports.title')}</h1>
        <p>{t('reports.overview')}</p>
      </div>
      
      <div className="reports-content">
        <div className="reports-grid">
          <div className="report-card">
            <h3>{t('reports.performance')}</h3>
            <p>{t('reports.charts.ownerPerformance')}</p>
            <div className="report-placeholder">
              {t('reports.noData')}
            </div>
          </div>
          
          <div className="report-card">
            <h3>{t('reports.sources')}</h3>
            <p>{t('reports.charts.sourcePerformance')}</p>
            <div className="report-placeholder">
              {t('reports.noData')}
            </div>
          </div>
          
          <div className="report-card">
            <h3>{t('reports.conversion')}</h3>
            <p>{t('reports.charts.conversionRate')}</p>
            <div className="report-placeholder">
              {t('reports.noData')}
            </div>
          </div>
          
          <div className="report-card">
            <h3>{t('reports.charts.leadsOverTime')}</h3>
            <p>{t('reports.overview')}</p>
            <div className="report-placeholder">
              {t('reports.noData')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 