import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ScanResult } from './mockApi';

const systemTypeLabels: Record<string, string> = {
  smart_port: 'Smart Port Infrastructure',
  ship_network: 'Ship IT Network',
  logistics_system: 'Logistics / Port Management',
};

export async function generatePdfReport(scanResult: ScanResult): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor: [number, number, number] = [31, 55, 96]; // Navy blue
  const accentColor: [number, number, number] = [212, 175, 55]; // Gold
  const dangerColor: [number, number, number] = [220, 53, 69]; // Red
  const warningColor: [number, number, number] = [255, 193, 7]; // Yellow
  const successColor: [number, number, number] = [40, 167, 69]; // Green
  
  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CYBER RISK ASSESSMENT REPORT', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Smart Port Defence System', pageWidth / 2, 30, { align: 'center' });
  
  // Classification Banner
  doc.setFillColor(...accentColor);
  doc.rect(0, 45, pageWidth, 8, 'F');
  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CLASSIFIED - AUTHORIZED PERSONNEL ONLY', pageWidth / 2, 51, { align: 'center' });
  
  // Report Info
  let yPos = 65;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  
  const infoData = [
    ['Scan ID:', scanResult.scan_id],
    ['Target:', scanResult.target],
    ['System Type:', systemTypeLabels[scanResult.system_type] || scanResult.system_type],
    ['Date & Time:', new Date(scanResult.timestamp).toLocaleString()],
    ['Scan Duration:', `${scanResult.scan_duration.toFixed(2)} seconds`],
  ];
  
  doc.setFont('helvetica', 'bold');
  infoData.forEach(([label, value]) => {
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), 70, yPos);
    doc.setFont('helvetica', 'bold');
    yPos += 7;
  });
  
  // Risk Score Box
  yPos += 5;
  const riskLevel = scanResult.risk_level;
  const riskColor = (riskLevel === 'high' || riskLevel === 'critical')
    ? dangerColor
    : riskLevel === 'medium'
    ? warningColor
    : successColor;
  
  doc.setFillColor(...riskColor);
  doc.roundedRect(20, yPos, pageWidth - 40, 25, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RISK ASSESSMENT', pageWidth / 2, yPos + 10, { align: 'center' });
  doc.setFontSize(12);
  doc.text(
    `Score: ${scanResult.risk_score}/100 | Level: ${scanResult.risk_level.toUpperCase()}`,
    pageWidth / 2,
    yPos + 19,
    { align: 'center' }
  );
  
  yPos += 35;
  
  // Summary Stats
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const summaryText = [
    `Total Security Checks Performed: ${scanResult.summary.total_checks}`,
    `Passed Checks: ${scanResult.summary.passed_checks}`,
    `Failed Checks: ${scanResult.summary.failed_checks}`,
    `Warnings: ${scanResult.summary.warnings}`,
    `Open Ports Detected: ${scanResult.open_ports.length}`,
    `Vulnerabilities Found: ${scanResult.vulnerabilities.length}`,
  ];
  
  summaryText.forEach((text) => {
    doc.text('• ' + text, 25, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // Vulnerabilities Table
  if (scanResult.vulnerabilities.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Vulnerability Findings', 20, yPos);
    yPos += 5;
    
    const vulnData = scanResult.vulnerabilities.map((vuln, index) => [
      String(index + 1),
      vuln.name,
      vuln.severity.toUpperCase(),
      vuln.category || 'General',
      vuln.recommendation.substring(0, 50) + (vuln.recommendation.length > 50 ? '...' : ''),
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Finding', 'Severity', 'Category', 'Recommendation']],
      body: vulnData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 35 },
        4: { cellWidth: 60 },
      },
      margin: { left: 20, right: 20 },
      didParseCell: (data) => {
        if (data.column.index === 2 && data.section === 'body') {
          const severity = data.cell.raw?.toString().toLowerCase();
          if (severity === 'critical' || severity === 'high') {
            data.cell.styles.textColor = dangerColor;
            data.cell.styles.fontStyle = 'bold';
          } else if (severity === 'medium') {
            data.cell.styles.textColor = [200, 150, 0];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
    });
  }
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer bar
    doc.setFillColor(...primaryColor);
    doc.rect(0, doc.internal.pageSize.getHeight() - 15, pageWidth, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Smart Port Cyber Risk Assessment Tool | Generated: ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    );
  }
  
  // Generate filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const sanitizedTarget = scanResult.target.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `report_${scanResult.system_type}_${sanitizedTarget}_${timestamp}.pdf`;
  
  // Save the PDF
  doc.save(filename);
}
