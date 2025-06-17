import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

/**
 * MetricCard
 * Props:
 *   title: string
 *   value: number|string
 *   icon: React.ReactNode
 *   color: string
 *   bgColor: string
 */
const MetricCard = ({ title, value, icon, color, bgColor }) => (
  <Card sx={{ display: 'flex', alignItems: 'center', background: bgColor, boxShadow: 2 }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
    </CardContent>
    <Box sx={{ pr: 2 }}>
      <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>{icon}</Avatar>
    </Box>
  </Card>
);

export default MetricCard;
