import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * PieChartComponent
 * Props:
 *   data: [{ name: string, value: number }]
 *   colors: string[]
 *   title?: string
 */
const PieChartComponent = ({ data, colors, title }) => (
  <div style={{ width: '100%', height: 300 }}>
    {title && <h4 style={{ textAlign: 'center', marginBottom: 8 }}>{title}</h4>}
    <ResponsiveContainer>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default PieChartComponent;
