// Utility functions for transforming lead data into chart formats

export const getLeadMetrics = (leads, theme) => {
  const totalLeads = leads.length;
  const converted = leads.filter(l => l.status === 'Converted').length;
  const pending = leads.filter(l => l.status === 'Pending').length;
  const lost = leads.filter(l => l.status === 'Lost').length;
  
  // Calculate new leads this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = leads.filter(lead => 
    new Date(lead.createdAt) > oneWeekAgo
  ).length;

  return [
    {
      title: 'TotalLeads',
      value: totalLeads,
      icon: '👥',
      color: theme.palette.primary.main,
      bgColor: `${theme.palette.primary.main}15`
    },
    {
      title: 'NewThisWeek',
      value: newThisWeek,
      icon: '🆕', 
      color: theme.palette.secondary.main,
      bgColor: `${theme.palette.secondary.main}15`
    },
    {
      title: 'Converted',
      value: converted,
      icon: '✅', 
      color: theme.palette.success.main,
      bgColor: `${theme.palette.success.main}15`
    },
    {
      title: 'Pending',
      value: pending,
      icon: '⏳',
      color: theme.palette.warning.main,
      bgColor: `${theme.palette.warning.main}15`
    },
    {
      title: 'Lost',
      value: lost,
      icon: '❌',
      color: theme.palette.error.main,
      bgColor: `${theme.palette.error.main}15`
    }
  ];
};

export const getLeadDistribution = (leads) => {
  if (!leads || !leads.length) return [];
  
  // Sum leads by source
  const sourceCounts = leads.reduce((acc, lead) => {
    const source = lead.source || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  // Convert to chart data with summed counts
  return Object.entries(sourceCounts).map(([name, count]) => ({
    name: `${name}: ${count}`,
    value: count
  }));
};

export const getStatusAnalysis = (leads) => {
  if (!leads || !leads.length) return [];
  
  // Group by status and count
  const statusCounts = leads.reduce((acc, lead) => {
    const status = lead.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Convert to array and sort by count (descending)
  return Object.entries(statusCounts)
    .map(([status, count]) => ({ 
      status, 
      count,
      percentage: Math.round((count / leads.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);
};

export const getSalesByCategory = (deals) => {
  if (!deals || !deals.length) return [];
  
  const categoryData = deals.reduce((acc, deal) => {
    const category = deal.category || 'Other';
    const amount = deal.amount || 0;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  return Object.entries(categoryData)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / 
        Object.values(categoryData).reduce((a, b) => a + b, 0)) * 100)
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const getMonthlySalesTrends = (deals) => {
  if (!deals || !deals.length) return [];
  
  const monthlyData = deals.reduce((acc, deal) => {
    const date = new Date(deal.closeDate || deal.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    const amount = deal.amount || 0;
    acc[month] = (acc[month] || 0) + amount;
    return acc;
  }, {});

  return Object.entries(monthlyData)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => new Date(`01 ${a.month} 2000`) - new Date(`01 ${b.month} 2000`));
};
