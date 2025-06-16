import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';

export const chartComponents = {
  bar: Bar,
  line: Line,
  pie: Pie
};

/**
 * ChartCard
 * Props:
 *   type: 'bar' | 'line' | 'pie'
 *   title: string
 *   data: Object
 *   options: Object
 */
const ChartCard = ({ type, title, data, options }) => {
  const ChartComponent = chartComponents[type] || Bar;
  
  return (
    <Card sx={{ boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <div style={{ height: '300px' }}>
          <ChartComponent data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
