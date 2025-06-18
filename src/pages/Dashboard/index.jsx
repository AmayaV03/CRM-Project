import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  People,
  Schedule,
  CheckCircle,
  Cancel,
  Business
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectAllLeads } from '../../store/slices/leadsSlice.jsx';

const Dashboard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const leads = useSelector(selectAllLeads);

  const metricCards = [
    {
      title: t('dashboard.metrics.totalLeads'),
      value: leads.length,
      icon: <People />,
      color: theme.palette.primary.main,
      bgColor: `${theme.palette.primary.main}15`,
    },
    {
      title: t('dashboard.metrics.newThisWeek'),
      value: 0,
      icon: <Schedule />,
      color: theme.palette.secondary.main,
      bgColor: `${theme.palette.secondary.main}15`,
    },
    {
      title: t('dashboard.metrics.converted'),
      value: 0,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      bgColor: `${theme.palette.success.main}15`,
    },
    {
      title: t('dashboard.metrics.lost'),
      value: 0,
      icon: <Cancel />,
      color: theme.palette.error.main,
      bgColor: `${theme.palette.error.main}15`,
    },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('dashboard.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.welcome.subtitle')}
        </Typography>
      </Box>
      
      {/* Metrics Cards */}
      <Box sx={{ display: 'flex', gap: theme.spacing(2), padding: theme.spacing(2), mb: 4 }}>
        {metricCards.map((metric, index) => (
          <Box sx={{ width: '100%', flex: '1 1 0' }} key={index}>
            <Card 
              sx={{ 
                borderRadius: 3,
                border: `1px solid ${metric.color}20`,
                boxShadow: `0 4px 20px ${metric.color}15`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 30px ${metric.color}25`,
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: metric.bgColor,
                      color: metric.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {metric.icon}
                  </Avatar>
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: metric.bgColor,
                      color: metric.color,
                      fontWeight: 500,
                    }}
                  />
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    color: metric.color,
                    mb: 1
                  }}
                >
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {metric.title}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      
      {/* Welcome Section */}
      <Paper 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
          border: `1px solid ${theme.palette.primary.main}20`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              mr: 2,
              width: 56,
              height: 56,
            }}
          >
            <Business sx={{ fontSize: '2rem' }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('dashboard.welcome.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {t('dashboard.welcome.description')}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={t('dashboard.welcome.getStarted')}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: 'white',
              fontWeight: 500,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              }
            }}
          />
          <Chip
            label={t('dashboard.welcome.viewAnalytics')}
            variant="outlined"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              fontWeight: 500,
              '&:hover': {
                bgcolor: `${theme.palette.primary.main}10`,
              }
            }}
          />
          <Chip
            label="⚙️ Settings"
            variant="outlined"
            sx={{
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              fontWeight: 500,
              '&:hover': {
                bgcolor: `${theme.palette.secondary.main}10`,
              }
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;