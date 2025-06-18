import React, { useRef, useState } from 'react';
import { usePDF } from 'react-to-pdf';
import { 
  Box, Typography, Paper, Grid, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Divider, LinearProgress, Link, TextField, Tabs, Tab 
} from '@mui/material';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import { Download, Assessment, Timeline, People, ShowChart } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

export default function ReportPage({ data }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { toPDF, targetRef } = usePDF({
    filename: 'crm-report.pdf',
    page: {
      margin: 15,
      format: 'a4',
      orientation: 'landscape'
    },
    canvas: {
      logging: true,
      scale: 2 // Higher quality
    }
  });

  const { 
    metrics = [], 
    leadDistribution = [], 
    statusAnalysis = [], 
    deals = []
  } = data || {};

  const handleExport = () => {
    // Export implementation
  };

  // Get top performing sources
  const topSources = [...leadDistribution]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  // Get conversion funnel
  const funnelStages = [
    { name: 'Total Leads', value: metrics.find(m => m.title === 'TotalLeads')?.value || 0 },
    { name: 'Contacted', value: metrics.find(m => m.title === 'NewThisWeek')?.value || 0 },
    { name: 'Converted', value: metrics.find(m => m.title === 'Converted')?.value || 0 }
  ];

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: 'background.default', 
      minHeight: '100vh',
      background: theme.palette.mode === 'light' 
        ? 'linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%)' 
        : 'linear-gradient(to bottom, #121212 0%, #1e1e1e 100%)'
    }} ref={targetRef}>
      
      {/* Header */}
      <Paper sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)'
          : 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
        color: 'common.white',
        boxShadow: 3
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
              {t('reports.title')}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {new Date().toLocaleDateString()}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={() => toPDF()}
            startIcon={<Download />}
            sx={{ 
              bgcolor: 'common.white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              minWidth: 180,
              fontWeight: 600
            }}
          >
            {t('reports.exportPdf')}
          </Button>
        </Box>
      </Paper>

      {/* Lead Distribution Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Assessment color="primary" sx={{ mr: 2 }} />
          <Typography variant="h5">
            {t('reports.leadDistribution')}
          </Typography>
        </Box>
        <Box sx={{ height: 400 }}>
          <PieChart 
            data={leadDistribution}
            colors={[
              theme.palette.primary.main,
              theme.palette.secondary.main,
              theme.palette.success.main,
              theme.palette.warning.main
            ]}
            title={t('reports.leadDistribution')}
          />
        </Box>
      </Paper>

      {/* Lead Performance */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
            <People color="primary" sx={{ mr: 1 }} />
            {t('reports.leadPerformance')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button variant="contained" size="small">
              {t('reports.refresh')}
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Conversion Funnel
            </Typography>
            <BarChart
              data={funnelStages}
              bars={[{
                dataKey: 'value',
                color: theme.palette.primary.main,
                label: 'Leads'
              }]}
              layout="vertical"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Top Lead Sources
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Source</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">% of Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topSources.map((source) => (
                    <TableRow key={source.name}>
                      <TableCell>{source.name}</TableCell>
                      <TableCell align="right">{source.value}</TableCell>
                      <TableCell align="right">
                        {Math.round((source.value / metrics.find(m => m.title === 'TotalLeads')?.value) * 100)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>

      {/* Activity Summary */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <People color="primary" sx={{ mr: 2 }} />
          <Typography variant="h5">
            {t('reports.activitySummary')}
          </Typography>
        </Box>
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          Team productivity metrics including calls made, emails sent, and meetings scheduled
        </Typography>
        <LinearProgress variant="determinate" value={65} sx={{ height: 8, mb: 2, borderRadius: 4 }} />
        <Typography variant="caption" color="text.secondary">
          Development 65% complete • ETA: September 2025
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
          <Link href="mailto:support@crm.com">Contact us</Link> for early access or feature requests
        </Typography>
      </Paper>

      {/* Pipeline Analysis */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ShowChart color="primary" sx={{ mr: 2 }} />
          <Typography variant="h5">
            {t('reports.pipelineAnalysis')}
          </Typography>
        </Box>
        <Box sx={{ height: 260, bgcolor: 'background.paper', borderRadius: 2, p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main', fontWeight: 'medium' }}>Pipeline Performance</Typography>
          <Box sx={{ display: 'flex', height: 180, width: '100%', alignItems: 'flex-end' }}>
            {['Prospects', 'Qualified', 'Proposal', 'Negotiation', 'Closed'].map((stage, i) => (
              <Box key={stage} sx={{
                flex: 1,
                height: `${100 - (i * 15)}%`,
                background: `linear-gradient(to top, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                mx: 0.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '4px 4px 0 0',
                boxShadow: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Typography variant="caption" sx={{ 
                  mt: 1, 
                  color: 'common.white',
                  textAlign: 'center',
                  fontWeight: 'medium'
                }}>
                  {`${100 - (i * 15)}%`}
                </Typography>
                <Typography variant="caption" sx={{ 
                  mb: 0.5, 
                  color: 'common.white',
                  textAlign: 'center',
                  fontSize: '0.7rem'
                }}>
                  {stage}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">High Volume</Typography>
            <Typography variant="caption" color="text.secondary">High Value</Typography>
          </Box>
        </Box>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Key Metrics</Typography>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
              <Typography variant="body2">Avg. conversion rate: <strong>32%</strong></Typography>
              <Typography variant="body2">Bottleneck stage: <strong>Qualified → Proposal</strong></Typography>
              <Typography variant="body2">Avg. sales cycle: <strong>42 days</strong></Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Improvement Tips</Typography>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
              <Typography variant="body2">• Increase follow-ups in Qualification</Typography>
              <Typography variant="body2">• Improve proposal templates</Typography>
              <Typography variant="body2">• Reduce response time in Negotiation</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
