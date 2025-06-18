import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import { 
  DateRange, 
  FilterAlt, 
  Download,
  Assessment,
  Timeline,
  People,
  BarChart as BarChartIcon,
  ShowChart
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { enqueueSnackbar } from '../../services/notificationService';
import { exportDashboardData } from '../../services/reportService';

const Reports = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  {/* Updated reportData with sample data */}
  const reportData = {
    performance: { value: 68, trend: 'up', change: '+12%' },
    sources: [
      { name: t('reports.sources.website'), value: 45, color: theme.palette.primary.main },
      { name: t('reports.sources.referral'), value: 28, color: theme.palette.secondary.main },
      { name: t('reports.sources.social'), value: 17, color: theme.palette.info.main },
      { name: t('reports.sources.email'), value: 10, color: theme.palette.warning.main }
    ],
    leadsOverTime: {
      labels: [t('datetime.jan'), t('datetime.feb'), t('datetime.mar'), t('datetime.apr'), t('datetime.may'), t('datetime.jun')],
      values: [120, 190, 170, 220, 240, 210]
    },
    conversion: {
      stages: [t('reports.conversion.leads'), t('reports.conversion.contacted'), t('reports.conversion.demo'), t('reports.conversion.closed')],
      values: [1000, 600, 300, 150],
      rates: ['100%', '60%', '50%', '50%']
    },
    status: {
      labels: [t('reports.status.new'), t('reports.status.inProgress'), t('reports.status.qualified'), t('reports.status.closedWon'), t('reports.status.closedLost')],
      values: [120, 85, 60, 45, 30]
    }
  };

  const handleExport = async () => {
    try {
      await exportDashboardData({
        metrics: [
          { title: t('dashboard.metrics.totalLeads'), value: reportData.leadsOverTime.values.reduce((a,b) => a + b, 0) },
          { title: t('dashboard.metrics.newThisWeek'), value: 42 },
          { title: t('dashboard.metrics.converted'), value: reportData.conversion.values[3] },
          { title: t('dashboard.metrics.lost'), value: 15 }
        ],
        leadSource: reportData.sources,
        leadStatus: reportData.status.labels.map((label, i) => ({
          name: label,
          value: reportData.status.values[i]
        })),
        totalLeads: reportData.leadsOverTime.values.reduce((a,b) => a + b, 0),
        converted: reportData.conversion.values[3],
        conversionRate: Math.round((reportData.conversion.values[3] / reportData.leadsOverTime.values.reduce((a,b) => a + b, 0)) * 100)
      });
      
      enqueueSnackbar(t('dashboard.messages.exportSuccess'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(t('dashboard.messages.exportFailed', { error: error.message }), { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {t('reports.title')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select
            size="small"
            defaultValue="last30"
            sx={{ minWidth: 180 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRange />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="last7">{t('reports.filters.last7Days')}</MenuItem>
            <MenuItem value="last30">{t('reports.filters.last30Days')}</MenuItem>
            <MenuItem value="last90">{t('reports.filters.lastQuarter')}</MenuItem>
            <MenuItem value="custom">{t('reports.filters.customRange')}</MenuItem>
          </TextField>
          
          <Button 
            variant="contained" 
            startIcon={<Download />}
            onClick={handleExport}
            sx={{ textTransform: 'none' }}
          >
            {t('common.export')}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
        {/* Performance Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 2
              }}>
                <Assessment sx={{ 
                  color: theme.palette.primary.main,
                  mr: 2,
                  fontSize: '2rem'
                }} />
                <Typography variant="h6">{t('reports.performance')}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {reportData.performance.value}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('reports.conversionRate')} ({reportData.performance.change} {t('reports.fromLastPeriod')})
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sources Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ 
                  color: theme.palette.secondary.main,
                  mr: 2,
                  fontSize: '2rem'
                }} />
                <Typography variant="h6">{t('reports.topSources')}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {reportData.sources.map((source, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 1
                }}>
                  <Typography>{source.name}</Typography>
                  <Typography fontWeight={600}>{source.value}%</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Leads Over Time - Area Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <Timeline sx={{ mr: 1, color: theme.palette.success.main }} />
                {t('reports.charts.leadsOverTime')}
              </Typography>
              <TextField size="small" select defaultValue="weekly" sx={{ width: 120 }}>
                <MenuItem value="daily">{t('reports.filters.daily')}</MenuItem>
                <MenuItem value="weekly">{t('reports.filters.weekly')}</MenuItem>
                <MenuItem value="monthly">{t('reports.filters.monthly')}</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ height: 300, p: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                height: '80%',
                gap: 1
              }}>
                {reportData.leadsOverTime.values.map((value, index) => (
                  <Box key={index} sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Typography variant="caption" sx={{ mb: 0.5 }}>
                      {reportData.leadsOverTime.labels[index]}
                    </Typography>
                    <Box sx={{
                      width: '100%',
                      height: `${value / 3}px`,
                      bgcolor: theme.palette.primary.main,
                      borderRadius: '4px 4px 0 0'
                    }} />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  <strong>{t('reports.average')}:</strong> 192/{t('reports.perMonth')}
                </Typography>
                <Typography variant="body2" color="success.main">
                  <strong>↑ 18%</strong> {t('reports.fromLastPeriod')}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Conversion Funnel - Bar Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', p: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShowChart sx={{ mr: 1, color: theme.palette.warning.main }} />
              {t('reports.conversionFunnel')}
            </Typography>
            <Box sx={{ height: 300, p: 1 }}>
              {reportData.conversion.stages.map((stage, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{stage}</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {reportData.conversion.values[index]}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={reportData.conversion.values[index]/10} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        bgcolor: index < 2 ? theme.palette.success.main : 
                               index < 3 ? theme.palette.warning.main : theme.palette.error.main
                      }
                    }} 
                  />
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                    {reportData.conversion.rates[index]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Lead Sources - Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', p: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assessment sx={{ mr: 1, color: theme.palette.info.main }} />
              {t('reports.leadSources')}
            </Typography>
            <Box sx={{ height: 300 }}>
              {/* Replace with actual PieChart component */}
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: theme.palette.grey[100],
                borderRadius: 1
              }}>
                <Typography color="text.secondary">{t('reports.leadSourcesChart')}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Status Distribution - Horizontal Bar */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <BarChartIcon sx={{ mr: 1, color: theme.palette.error.main }} />
                {t('reports.statusDistribution')}
              </Typography>
              <Button size="small" endIcon={<Download />}>{t('reports.exportData')}</Button>
            </Box>
            <Box sx={{ height: 300 }}>
              {/* Replace with actual BarChart component */}
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: theme.palette.grey[100],
                borderRadius: 1
              }}>
                <Typography color="text.secondary">{t('reports.statusDistributionChart')}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;