// Mock API Service - Simulates FastAPI backend responses
// Ready to swap with real backend: just replace these functions with fetch calls

export type SystemType = 'smart_port' | 'ship_network' | 'logistics_system';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Vulnerability {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  port?: number;
  service?: string;
  recommendation: string;
}

export interface ScanResult {
  scan_id: string;
  target: string;
  system_type: SystemType;
  timestamp: string;
  risk_score: number;
  risk_level: RiskLevel;
  open_ports: number[];
  vulnerabilities: Vulnerability[];
  scan_duration: number;
  summary: {
    total_checks: number;
    passed_checks: number;
    failed_checks: number;
    warnings: number;
  };
}

// Simulated vulnerability database based on system type
const vulnerabilityTemplates: Record<SystemType, Vulnerability[]> = {
  smart_port: [
    {
      id: 'V001',
      name: 'FTP Service Detected',
      description: 'Unencrypted FTP service running on port 21. Credentials transmitted in plaintext.',
      severity: 'high',
      port: 21,
      service: 'FTP',
      recommendation: 'Replace FTP with SFTP or FTPS. Disable anonymous access.',
    },
    {
      id: 'V002',
      name: 'Missing HSTS Header',
      description: 'HTTP Strict Transport Security header not configured.',
      severity: 'medium',
      recommendation: 'Enable HSTS with max-age of at least 31536000 seconds.',
    },
    {
      id: 'V003',
      name: 'Telnet Service Active',
      description: 'Telnet service detected on port 23. Unencrypted remote access.',
      severity: 'critical',
      port: 23,
      service: 'Telnet',
      recommendation: 'Disable Telnet immediately. Use SSH for remote access.',
    },
    {
      id: 'V004',
      name: 'Outdated SSL/TLS',
      description: 'Server supports TLS 1.0 and TLS 1.1 which are deprecated.',
      severity: 'medium',
      recommendation: 'Disable TLS 1.0 and 1.1. Enable only TLS 1.2 and 1.3.',
    },
    {
      id: 'V005',
      name: 'SCADA Port Exposed',
      description: 'Industrial control system port 502 (Modbus) accessible from network.',
      severity: 'critical',
      port: 502,
      service: 'Modbus',
      recommendation: 'Implement network segmentation. Use VPN for SCADA access.',
    },
  ],
  ship_network: [
    {
      id: 'V006',
      name: 'NMEA Network Exposed',
      description: 'Navigation system data port accessible without authentication.',
      severity: 'high',
      port: 10110,
      service: 'NMEA',
      recommendation: 'Implement access control lists and network segmentation.',
    },
    {
      id: 'V007',
      name: 'AIS Transponder Misconfiguration',
      description: 'AIS system transmitting excessive vessel information.',
      severity: 'medium',
      recommendation: 'Review AIS configuration per IMO guidelines.',
    },
    {
      id: 'V008',
      name: 'Satellite Link Unencrypted',
      description: 'VSAT communication not using end-to-end encryption.',
      severity: 'high',
      recommendation: 'Implement VPN tunnel for all satellite communications.',
    },
  ],
  logistics_system: [
    {
      id: 'V009',
      name: 'Database Port Exposed',
      description: 'MySQL/PostgreSQL port accessible from external network.',
      severity: 'critical',
      port: 3306,
      service: 'MySQL',
      recommendation: 'Restrict database access to application servers only.',
    },
    {
      id: 'V010',
      name: 'Weak Password Policy',
      description: 'System allows passwords shorter than 12 characters.',
      severity: 'medium',
      recommendation: 'Enforce minimum 12 character passwords with complexity.',
    },
    {
      id: 'V011',
      name: 'Missing Rate Limiting',
      description: 'API endpoints lack rate limiting, vulnerable to brute force.',
      severity: 'medium',
      recommendation: 'Implement rate limiting on all authentication endpoints.',
    },
  ],
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random subset of vulnerabilities
function getRandomVulnerabilities(systemType: SystemType): Vulnerability[] {
  const templates = vulnerabilityTemplates[systemType];
  const count = Math.floor(Math.random() * templates.length) + 1;
  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Calculate risk score based on vulnerabilities
function calculateRiskScore(vulnerabilities: Vulnerability[]): number {
  const severityWeights = {
    low: 5,
    medium: 15,
    high: 25,
    critical: 35,
  };
  
  let score = 0;
  vulnerabilities.forEach(v => {
    score += severityWeights[v.severity];
  });
  
  // Cap at 100
  return Math.min(100, Math.max(0, score));
}

// Determine risk level from score
function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return 'low';
  if (score <= 60) return 'medium';
  return 'high';
}

// Generate unique scan ID
function generateScanId(): string {
  return `SCAN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Main scan function - simulates API call to /scan endpoint
export async function performScan(
  target: string,
  systemType: SystemType,
  onProgress?: (phase: string, percent: number) => void
): Promise<ScanResult> {
  const startTime = Date.now();
  
  // Simulate scan phases
  const phases = [
    'Initializing scan engine...',
    'Performing port discovery...',
    'Checking security headers...',
    'Analyzing SSL/TLS configuration...',
    'Evaluating service configurations...',
    'Generating risk assessment...',
  ];
  
  for (let i = 0; i < phases.length; i++) {
    onProgress?.(phases[i], ((i + 1) / phases.length) * 100);
    await delay(800 + Math.random() * 400);
  }
  
  const vulnerabilities = getRandomVulnerabilities(systemType);
  const riskScore = calculateRiskScore(vulnerabilities);
  const riskLevel = getRiskLevel(riskScore);
  
  // Generate common port list based on findings
  const basePorts = [22, 80, 443];
  const vulnPorts = vulnerabilities
    .filter(v => v.port)
    .map(v => v.port as number);
  
  const openPorts = [...new Set([...basePorts, ...vulnPorts])].sort((a, b) => a - b);
  
  const result: ScanResult = {
    scan_id: generateScanId(),
    target,
    system_type: systemType,
    timestamp: new Date().toISOString(),
    risk_score: riskScore,
    risk_level: riskLevel,
    open_ports: openPorts,
    vulnerabilities,
    scan_duration: (Date.now() - startTime) / 1000,
    summary: {
      total_checks: 15,
      passed_checks: 15 - vulnerabilities.length,
      failed_checks: vulnerabilities.filter(v => v.severity === 'critical' || v.severity === 'high').length,
      warnings: vulnerabilities.filter(v => v.severity === 'medium' || v.severity === 'low').length,
    },
  };
  
  return result;
}

// AI-generated recommendations based on findings
export function generateMitigationReport(result: ScanResult): string {
  const criticalCount = result.vulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = result.vulnerabilities.filter(v => v.severity === 'high').length;
  
  let report = `## Executive Summary\n\n`;
  report += `A comprehensive cyber risk assessment was conducted on **${result.target}** `;
  report += `(${result.system_type.replace('_', ' ').toUpperCase()}) on ${new Date(result.timestamp).toLocaleDateString()}.\n\n`;
  
  report += `### Risk Assessment: ${result.risk_level.toUpperCase()} (Score: ${result.risk_score}/100)\n\n`;
  
  if (criticalCount > 0 || highCount > 0) {
    report += `⚠️ **Immediate Action Required**: ${criticalCount} critical and ${highCount} high severity issues detected.\n\n`;
  }
  
  report += `## Key Findings\n\n`;
  result.vulnerabilities.forEach((v, i) => {
    report += `### ${i + 1}. ${v.name}\n`;
    report += `- **Severity**: ${v.severity.toUpperCase()}\n`;
    report += `- **Description**: ${v.description}\n`;
    report += `- **Recommendation**: ${v.recommendation}\n\n`;
  });
  
  report += `## Compliance Considerations\n\n`;
  report += `This assessment aligns with:\n`;
  report += `- Indian Navy Cybersecurity Guidelines\n`;
  report += `- NCIIPC Critical Infrastructure Protection Framework\n`;
  report += `- IMO Maritime Cyber Risk Management Guidelines\n\n`;
  
  report += `---\n\n`;
  report += `*Disclaimer: This is an assessment-only report. No exploitation or intrusive testing was performed. `;
  report += `Findings are based on non-intrusive security checks suitable for educational and preventive purposes.*`;
  
  return report;
}
