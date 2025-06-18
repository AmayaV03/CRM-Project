import React from 'react';
import { Grid } from '@mui/material';
import ChartCard from '../charts/ChartCard';

/**
 * DashboardMetrics
 * Displays charts and visualizations for the dashboard.
 * Props:
 *   charts: Array<{ 
 *     type: 'bar' | 'line' | 'pie',
 *     title: string,
 *     data: Object,
 *     options: Object
 *   }>
 */
const DashboardMetrics = ({ charts = [] }) => (
  <Grid container spacing={2}>
    {Array.isArray(charts) && charts.map((chart, idx) => (
      <Grid key={idx} item xs={12} md={6}>
        <ChartCard {...chart} />
      </Grid>
    ))}
  </Grid>
);

DashboardMetrics.defaultProps = {
  charts: []
};

export default DashboardMetrics;
