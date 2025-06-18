import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LabelList
} from 'recharts';

/**
 * BarChartComponent
 * Props:
 *   data: [{ name: string, [key: string]: number }]
 *   bars: [{ dataKey: string, color: string, label: string }]
 *   title?: string
 */
const BarChartComponent = ({ data, bars, title }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{ width: '100%', height: 350 }}>
      {title && (
        <h4 style={{ 
          textAlign: 'center', 
          marginBottom: 8,
          color: '#333',
          fontWeight: 500
        }}>
          {title}
        </h4>
      )}
      <ResponsiveContainer>
        <RechartsBarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          barSize={28}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 12 }}
            label={{ 
              value: t('common.status'), 
              position: 'bottom', 
              offset: 0,
              fill: '#666'
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 12 }}
            label={{ 
              value: t('common.count'), 
              angle: -90, 
              position: 'insideLeft',
              fill: '#666'
            }}
          />
          <Tooltip 
            contentStyle={{
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: 20 }}
            iconType="circle"
            iconSize={10}
          />
          {bars.map((bar) => (
            <Bar 
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={bar.color}
              name={bar.label}
              radius={[4, 4, 0, 0]}
            >
              <LabelList 
                dataKey={bar.dataKey} 
                position="top"
                fill="#333"
                fontSize={12}
                formatter={(value) => value.toLocaleString()}
              />
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
