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
  useTheme,
  Button
} from '@mui/material';
import {
  TrendingUp,
  People,
  Schedule,
  CheckCircle,
  Cancel,
  Business,
  Download
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectAllLeads } from '../../store/slices/leadsSlice';
import DashboardMetrics from '../../components/dashboard/DashboardMetrics';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import { exportDashboardData } from '../../services/reportService';
import { hasPermission } from '../../services/authService';

const Dashboard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const leads = useSelector(selectAllLeads);
  const { roles } = useSelector(state => state.auth.user);

  // Show export button only for authorized roles
  const showExportButton = hasPermission(roles, 'export_data');

  // Mock data now inside component where theme is available
  const mockData = {
    metrics: [
      {
        title: 'Total Leads',
        value: 142,
        icon: '👥',
        color: theme.palette.primary.main,
        bgColor: `${theme.palette.primary.main}15`
      },
      {
        title: 'Converted',
        value: 42,
        icon: '✅', 
        color: theme.palette.success.main,
        bgColor: `${theme.palette.success.main}15`
      },
      {
        title: 'Pending',
        value: 68,
        icon: '⏳',
        color: theme.palette.warning.main,
        bgColor: `${theme.palette.warning.main}15`
      },
      {
        title: 'Lost',
        value: 32,
        icon: '❌',
        color: theme.palette.error.main,
        bgColor: `${theme.palette.error.main}15`
      }
    ],
    leadDistribution: [
      { name: 'Web', value: 65 },
      { name: 'Referral', value: 32 },
      { name: 'Event', value: 28 },
      { name: 'Other', value: 17 }
    ],
    statusAnalysis: [
      { name: 'New', value: 42 },
      { name: 'Contacted', value: 38 },
      { name: 'Qualified', value: 27 },
      { name: 'Proposal', value: 15 },
      { name: 'Closed', value: 20 }
    ]
  };

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

  const handleExport = () => {
    exportDashboardData(mockData);
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 4,
        alignItems: 'center'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: theme.palette.text.primary,
          letterSpacing: '-0.5px'
        }}>
          {t('dashboard.title')}
        </Typography>
        {showExportButton && (
          <Button 
            variant="contained"
            startIcon={<Download />}
            onClick={handleExport}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: theme.shadows[2],
              '&:hover': {
                boxShadow: theme.shadows[4]
              }
            }}
          >
            {t('dashboard.export')}
          </Button>
        )}
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricCards.map((card, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <Card sx={{ 
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              borderRadius: '12px',
              background: card.bgColor,
              boxShadow: theme.shadows[2],
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4]
              }
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: card.color }}>
                  {card.value}
                </Typography>
              </CardContent>
              <Box sx={{ 
                p: 2,
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <Avatar sx={{ 
                  bgcolor: card.color,
                  width: 56,
                  height: 56,
                  color: theme.palette.getContrastText(card.color)
                }}>
                  {card.icon}
                </Avatar>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Paper sx={{
        p: 3,
        mb: 4,
        borderRadius: '16px',
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[1]
      }}>
        <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
          <Grid xs={12} lg={6}>
            <Box sx={{ 
              height: '400px',
              width: '100%',
              minWidth: '500px'
            }}>
              <PieChart 
                data={mockData.leadDistribution}
                colors={[
                  theme.palette.primary.main,
                  theme.palette.secondary.main,
                  theme.palette.success.main,
                  theme.palette.warning.main
                ]}
                title="Lead Sources"
              />
            </Box>
          </Grid>
          <Grid xs={12} lg={6}>
            <Box sx={{
              height: '400px',
              width: '100%',
              minWidth: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <BarChart
                data={mockData.statusAnalysis}
                bars={[{
                  dataKey: 'value',
                  color: theme.palette.primary.main,
                  label: 'Leads'
                }]}
                title="Lead Status"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Analytics Section */}
      <DashboardMetrics metrics={mockData.metrics} />

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
              Welcome to LeadOrbit
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Your intelligent lead management system is ready to transform your sales journey. 
              Start by adding leads, exploring features, and accelerating your business growth.
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label="🚀 Get Started"
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
            label="📊 View Analytics"
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
      {hasPermission(roles, 'manage_users') && (
        <AdminTools />
      )}
    </Box>
  );
};

export default Dashboard;