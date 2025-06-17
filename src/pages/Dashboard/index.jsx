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
import { enqueueSnackbar } from '../../services/notificationService';

const Dashboard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const leads = useSelector(selectAllLeads);
  const { roles } = useSelector(state => state.auth.user);

  // Show export button only for authorized roles
  const showExportButton = hasPermission(roles, 'export_data');

  // Process leads data for charts
  const processLeadsData = () => {
    const leadSources = {};
    const leadStatuses = {};
    
    leads.forEach(lead => {
      // Count lead sources
      leadSources[lead.source] = (leadSources[lead.source] || 0) + 1;
      
      // Count lead statuses
      leadStatuses[lead.status] = (leadStatuses[lead.status] || 0) + 1;
    });
    
    return {
      leadDistribution: Object.entries(leadSources).map(([name, value]) => ({ name, value })),
      statusAnalysis: Object.entries(leadStatuses).map(([name, value]) => ({ name, value })),
      totalLeads: leads.length,
      converted: leads.filter(lead => lead.status === 'Converted').length,
      pending: leads.filter(lead => lead.status !== 'Converted' && lead.status !== 'Lost').length,
      lost: leads.filter(lead => lead.status === 'Lost').length
    };
  };
  
  const leadsData = processLeadsData();
  
  const metricCards = [
    {
      title: t('dashboard.metrics.totalLeads'),
      value: leadsData.totalLeads,
      icon: <People />,
      color: theme.palette.primary.main,
      bgColor: `${theme.palette.primary.main}15`,
    },
    {
      title: t('dashboard.metrics.newThisWeek'),
      value: 0, // TODO: Implement new this week calculation
      icon: <Schedule />,
      color: theme.palette.secondary.main,
      bgColor: `${theme.palette.secondary.main}15`,
    },
    {
      title: t('dashboard.metrics.converted'),
      value: leadsData.converted,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      bgColor: `${theme.palette.success.main}15`,
    },
    {
      title: t('dashboard.metrics.lost'),
      value: leadsData.lost,
      icon: <Cancel />,
      color: theme.palette.error.main,
      bgColor: `${theme.palette.error.main}15`,
    }
  ];

  const handleExport = async () => {
    try {
      const metrics = [
        {
          title: 'TotalLeads',
          value: leadsData.totalLeads
        },
        {
          title: 'NewThisWeek',
          value: leadsData.newThisWeek
        },
        {
          title: 'Converted',
          value: leadsData.converted
        },
        {
          title: 'Lost',
          value: leadsData.lost
        }
      ];
      
      await exportDashboardData({
        metrics,
        leadDistribution: leadsData.leadDistribution,
        statusAnalysis: leadsData.statusAnalysis,
        totalLeads: leadsData.totalLeads,
        converted: leadsData.converted,
        pending: leadsData.pending,
        lost: leadsData.lost,
        conversionRate: leadsData.conversionRate
      });
      
      enqueueSnackbar('Report exported successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Export failed: ' + error.message, { variant: 'error' });
    }
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
          <Grid key={index} item xs={12} sm={6} lg={3} sx={{ minWidth: '280px' }}>
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
          <Grid item xs={12} lg={6}>
            <Box sx={{ 
              height: '400px',
              width: '100%',
              minWidth: '500px'
            }}>
              <PieChart 
                data={leadsData.leadDistribution}
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
          <Grid item xs={12} lg={6}>
            <Box sx={{
              height: '400px',
              width: '100%',
              minWidth: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <BarChart
                data={leadsData.statusAnalysis}
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
      <DashboardMetrics metrics={[
        {
          title: 'Total Leads',
          value: leadsData.totalLeads,
          icon: '👥',
          color: theme.palette.primary.main,
          bgColor: `${theme.palette.primary.main}15`
        },
        {
          title: 'Converted',
          value: leadsData.converted,
          icon: '✅', 
          color: theme.palette.success.main,
          bgColor: `${theme.palette.success.main}15`
        },
        {
          title: 'Pending',
          value: leadsData.pending,
          icon: '⏳',
          color: theme.palette.warning.main,
          bgColor: `${theme.palette.warning.main}15`
        },
        {
          title: 'Lost',
          value: leadsData.lost,
          icon: '❌',
          color: theme.palette.error.main,
          bgColor: `${theme.palette.error.main}15`
        }
      ]} />
    </Box>
  );
};

export default Dashboard;