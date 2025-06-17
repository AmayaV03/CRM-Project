// reportService.js
// Handles API/data logic for dashboard analytics, metrics, and export

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


/**
 * getDashboardMetrics
 * Fetches metrics for the dashboard (mock implementation)
 */
export async function getDashboardMetrics() {
  // Replace with real API call
  return {
    totalLeads: 120,
    newThisWeek: 12,
    converted: 30,
    lost: 8,
    conversionRate: 25,
    performance: [
      { name: 'Alice', value: 15 },
      { name: 'Bob', value: 10 },
      { name: 'Carol', value: 5 },
    ],
    leadStatus: [
      { name: 'Open', value: 60 },
      { name: 'Contacted', value: 30 },
      { name: 'Converted', value: 20 },
      { name: 'Lost', value: 10 },
    ],
    leadSource: [
      { name: 'Web', value: 40 },
      { name: 'Referral', value: 30 },
      { name: 'Event', value: 25 },
      { name: 'Other', value: 25 },
    ],
  };
}

/**
 * exportDashboardData
 * Exports dashboard data as PDF
 */
export async function exportDashboardData(data) {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });

    // Title Page
    doc.setFontSize(24);
    doc.text('CRM Analytics Report', 105, 30, { align: 'center' });

    doc.setFontSize(16);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 45, { align: 'center' });

    // Key Metrics Table
    doc.setFontSize(12);
    autoTable(doc, {
      head: [['Metric', 'Value']],
      body: data.metrics.map(metric => [
        metric.title,
        metric.value
      ]),
      startY: 60,
      theme: 'grid'
    });

    // Lead Status Chart
    if (data.statusAnalysis) {
      doc.addPage();
      doc.setFontSize(18);
      doc.text('Lead Status Distribution', 20, 20);
      
      autoTable(doc, {
        head: [['Status', 'Count']],
        body: data.statusAnalysis.map(status => [
          status.status,
          status.count
        ]),
        startY: 30,
        theme: 'striped'
      });
    }

    // Save the PDF using blob URL
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `crm-report-${new Date().toISOString().slice(0,10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(pdfUrl);
    
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

/**
 * exportReportData
 * Exports report data as PDF
 */
export async function exportReportData(reportData) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm'
    });

    // Report Title
    doc.setFontSize(20);
    doc.text(reportData.title || 'CRM Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

    // Report Content
    let yPosition = 40;
    
    // Add sections dynamically
    reportData.sections.forEach(section => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Section Header
      doc.setFontSize(16);
      doc.text(section.title, 20, yPosition);
      yPosition += 10;
      
      // Section Content (table if array, text if string)
      if (Array.isArray(section.content)) {
        autoTable(doc, {
          head: [Object.keys(section.content[0])],
          body: section.content.map(item => Object.values(item)),
          startY: yPosition,
          theme: 'grid'
        });
        yPosition = doc.lastAutoTable.finalY + 10;
      } else {
        doc.setFontSize(12);
        const textLines = doc.splitTextToSize(section.content, 170);
        doc.text(textLines, 20, yPosition);
        yPosition += textLines.length * 7;
      }
    });

    // Save the PDF using blob URL
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `crm-${reportData.title?.toLowerCase().replace(/\s+/g, '-') || 'report'}-${new Date().toISOString().slice(0,10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(pdfUrl);
    
    return true;
  } catch (error) {
    console.error('Report export failed:', error);
    return false;
  }
}