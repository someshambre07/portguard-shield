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

// Comprehensive vulnerability database - 30+ scan types per system
const vulnerabilityTemplates: Record<SystemType, Vulnerability[]> = {
  smart_port: [
    // Network Security (1-6)
    {
      id: 'SP001',
      name: 'FTP Service Detected',
      description: 'Unencrypted FTP service running on port 21. Credentials transmitted in plaintext.',
      severity: 'high',
      port: 21,
      service: 'FTP',
      recommendation: 'Replace FTP with SFTP or FTPS. Disable anonymous access.',
    },
    {
      id: 'SP002',
      name: 'Telnet Service Active',
      description: 'Telnet service detected on port 23. Unencrypted remote access protocol.',
      severity: 'critical',
      port: 23,
      service: 'Telnet',
      recommendation: 'Disable Telnet immediately. Use SSH for remote access.',
    },
    {
      id: 'SP003',
      name: 'Open DNS Resolver',
      description: 'DNS service accepting queries from external networks. Risk of DNS amplification attacks.',
      severity: 'medium',
      port: 53,
      service: 'DNS',
      recommendation: 'Configure DNS to only respond to internal queries.',
    },
    {
      id: 'SP004',
      name: 'SNMP v1/v2 Enabled',
      description: 'Legacy SNMP versions with weak authentication detected.',
      severity: 'high',
      port: 161,
      service: 'SNMP',
      recommendation: 'Upgrade to SNMPv3 with authentication and encryption.',
    },
    {
      id: 'SP005',
      name: 'SMB Service Exposed',
      description: 'Windows file sharing ports open to external network.',
      severity: 'critical',
      port: 445,
      service: 'SMB',
      recommendation: 'Block SMB ports at perimeter firewall. Use VPN for remote access.',
    },
    {
      id: 'SP006',
      name: 'RDP Service Exposed',
      description: 'Remote Desktop Protocol accessible from external network.',
      severity: 'critical',
      port: 3389,
      service: 'RDP',
      recommendation: 'Disable direct RDP access. Implement VPN or jump server.',
    },
    // Industrial Control Systems (7-12)
    {
      id: 'SP007',
      name: 'SCADA Modbus Port Exposed',
      description: 'Industrial control system port 502 (Modbus) accessible from network.',
      severity: 'critical',
      port: 502,
      service: 'Modbus',
      recommendation: 'Implement network segmentation. Use VPN for SCADA access.',
    },
    {
      id: 'SP008',
      name: 'OPC UA Without Authentication',
      description: 'OPC Unified Architecture service running without proper authentication.',
      severity: 'high',
      port: 4840,
      service: 'OPC-UA',
      recommendation: 'Enable certificate-based authentication for OPC UA.',
    },
    {
      id: 'SP009',
      name: 'DNP3 Protocol Unprotected',
      description: 'DNP3 SCADA protocol communication without encryption.',
      severity: 'high',
      port: 20000,
      service: 'DNP3',
      recommendation: 'Implement DNP3 Secure Authentication or use VPN.',
    },
    {
      id: 'SP010',
      name: 'BACnet Port Open',
      description: 'Building automation protocol accessible without authentication.',
      severity: 'medium',
      port: 47808,
      service: 'BACnet',
      recommendation: 'Segment BACnet network from IT infrastructure.',
    },
    {
      id: 'SP011',
      name: 'EtherNet/IP Exposed',
      description: 'Industrial Ethernet protocol accessible from untrusted networks.',
      severity: 'high',
      port: 44818,
      service: 'EtherNet/IP',
      recommendation: 'Implement industrial firewall with deep packet inspection.',
    },
    {
      id: 'SP012',
      name: 'PLC Programming Port Open',
      description: 'Programmable Logic Controller programming interface accessible.',
      severity: 'critical',
      port: 102,
      service: 'S7comm',
      recommendation: 'Restrict PLC access to engineering workstations only.',
    },
    // Web Security (13-18)
    {
      id: 'SP013',
      name: 'Missing HSTS Header',
      description: 'HTTP Strict Transport Security header not configured.',
      severity: 'medium',
      recommendation: 'Enable HSTS with max-age of at least 31536000 seconds.',
    },
    {
      id: 'SP014',
      name: 'Missing Content-Security-Policy',
      description: 'No CSP header configured. Risk of XSS attacks.',
      severity: 'medium',
      recommendation: 'Implement strict Content-Security-Policy header.',
    },
    {
      id: 'SP015',
      name: 'Missing X-Frame-Options',
      description: 'Clickjacking protection not enabled.',
      severity: 'low',
      recommendation: 'Add X-Frame-Options: DENY or SAMEORIGIN header.',
    },
    {
      id: 'SP016',
      name: 'Server Version Disclosure',
      description: 'Web server revealing version information in headers.',
      severity: 'low',
      recommendation: 'Configure server to hide version information.',
    },
    {
      id: 'SP017',
      name: 'Directory Listing Enabled',
      description: 'Web server exposing directory contents.',
      severity: 'medium',
      recommendation: 'Disable directory listing in web server configuration.',
    },
    {
      id: 'SP018',
      name: 'Insecure Cookie Configuration',
      description: 'Session cookies missing Secure and HttpOnly flags.',
      severity: 'medium',
      recommendation: 'Set Secure, HttpOnly, and SameSite flags on all cookies.',
    },
    // SSL/TLS Security (19-24)
    {
      id: 'SP019',
      name: 'Outdated SSL/TLS Protocol',
      description: 'Server supports TLS 1.0 and TLS 1.1 which are deprecated.',
      severity: 'medium',
      recommendation: 'Disable TLS 1.0 and 1.1. Enable only TLS 1.2 and 1.3.',
    },
    {
      id: 'SP020',
      name: 'Weak Cipher Suites',
      description: 'Server accepts weak cipher suites including RC4 and 3DES.',
      severity: 'high',
      recommendation: 'Configure server to use only strong cipher suites.',
    },
    {
      id: 'SP021',
      name: 'SSL Certificate Expiring',
      description: 'SSL certificate expires within 30 days.',
      severity: 'medium',
      recommendation: 'Renew SSL certificate before expiration.',
    },
    {
      id: 'SP022',
      name: 'Self-Signed Certificate',
      description: 'Using self-signed certificate instead of CA-issued.',
      severity: 'low',
      recommendation: 'Obtain certificate from trusted Certificate Authority.',
    },
    {
      id: 'SP023',
      name: 'Missing OCSP Stapling',
      description: 'OCSP stapling not enabled for certificate validation.',
      severity: 'low',
      recommendation: 'Enable OCSP stapling for improved performance and privacy.',
    },
    {
      id: 'SP024',
      name: 'Vulnerable to POODLE Attack',
      description: 'SSLv3 protocol enabled, vulnerable to POODLE attack.',
      severity: 'high',
      recommendation: 'Disable SSLv3 protocol immediately.',
    },
    // Authentication & Access (25-30)
    {
      id: 'SP025',
      name: 'Default Credentials Detected',
      description: 'System responding to common default username/password combinations.',
      severity: 'critical',
      recommendation: 'Change all default credentials immediately.',
    },
    {
      id: 'SP026',
      name: 'No Account Lockout Policy',
      description: 'System allows unlimited login attempts.',
      severity: 'high',
      recommendation: 'Implement account lockout after 5 failed attempts.',
    },
    {
      id: 'SP027',
      name: 'Missing Multi-Factor Auth',
      description: 'Administrative interfaces accessible with single-factor authentication.',
      severity: 'medium',
      recommendation: 'Implement MFA for all administrative access.',
    },
    {
      id: 'SP028',
      name: 'Exposed Admin Panel',
      description: 'Administrative interface accessible from public network.',
      severity: 'high',
      recommendation: 'Restrict admin panel to internal network or VPN.',
    },
    {
      id: 'SP029',
      name: 'Session Timeout Too Long',
      description: 'User sessions remain active for extended periods.',
      severity: 'low',
      recommendation: 'Reduce session timeout to 15-30 minutes.',
    },
    {
      id: 'SP030',
      name: 'Insecure Password Storage',
      description: 'Password hashing using weak algorithms detected.',
      severity: 'high',
      recommendation: 'Use bcrypt, scrypt, or Argon2 for password hashing.',
    },
  ],
  ship_network: [
    // Maritime Navigation Systems (1-8)
    {
      id: 'SN001',
      name: 'NMEA Network Exposed',
      description: 'Navigation system data port accessible without authentication.',
      severity: 'high',
      port: 10110,
      service: 'NMEA',
      recommendation: 'Implement access control lists and network segmentation.',
    },
    {
      id: 'SN002',
      name: 'AIS Transponder Misconfiguration',
      description: 'AIS system transmitting excessive vessel information.',
      severity: 'medium',
      recommendation: 'Review AIS configuration per IMO guidelines.',
    },
    {
      id: 'SN003',
      name: 'ECDIS Vulnerable Version',
      description: 'Electronic Chart Display running outdated software.',
      severity: 'high',
      recommendation: 'Update ECDIS to latest manufacturer version.',
    },
    {
      id: 'SN004',
      name: 'GPS Spoofing Vulnerability',
      description: 'GPS receiver lacks anti-spoofing protection.',
      severity: 'critical',
      recommendation: 'Install GPS authentication modules and multi-source positioning.',
    },
    {
      id: 'SN005',
      name: 'Radar System Network Access',
      description: 'Radar interface accessible from crew network.',
      severity: 'medium',
      recommendation: 'Isolate navigation systems from general IT network.',
    },
    {
      id: 'SN006',
      name: 'Gyrocompass Remote Access',
      description: 'Gyrocompass calibration interface exposed to network.',
      severity: 'medium',
      port: 8080,
      service: 'HTTP',
      recommendation: 'Disable remote calibration or restrict to maintenance VLAN.',
    },
    {
      id: 'SN007',
      name: 'Autopilot System Unprotected',
      description: 'Autopilot control commands can be sent without authentication.',
      severity: 'critical',
      recommendation: 'Implement command authentication and physical override.',
    },
    {
      id: 'SN008',
      name: 'Voyage Data Recorder Access',
      description: 'VDR data accessible from network without encryption.',
      severity: 'medium',
      recommendation: 'Encrypt VDR communications and restrict access.',
    },
    // Communication Systems (9-16)
    {
      id: 'SN009',
      name: 'Satellite Link Unencrypted',
      description: 'VSAT communication not using end-to-end encryption.',
      severity: 'high',
      recommendation: 'Implement VPN tunnel for all satellite communications.',
    },
    {
      id: 'SN010',
      name: 'GMDSS System Exposed',
      description: 'Global Maritime Distress System accessible remotely.',
      severity: 'critical',
      recommendation: 'Physically isolate GMDSS from data networks.',
    },
    {
      id: 'SN011',
      name: 'Inmarsat Terminal Vulnerability',
      description: 'Satellite terminal running firmware with known vulnerabilities.',
      severity: 'high',
      recommendation: 'Update Inmarsat terminal firmware to latest version.',
    },
    {
      id: 'SN012',
      name: 'VoIP System Misconfigured',
      description: 'Ship VoIP system allowing unauthorized external calls.',
      severity: 'medium',
      port: 5060,
      service: 'SIP',
      recommendation: 'Configure SIP firewall rules and authentication.',
    },
    {
      id: 'SN013',
      name: 'NAVTEX Receiver Network Access',
      description: 'NAVTEX system connected to ship network without protection.',
      severity: 'low',
      recommendation: 'Segment NAVTEX from crew and cargo networks.',
    },
    {
      id: 'SN014',
      name: 'SSB Radio Interface Exposed',
      description: 'Single Sideband radio control interface accessible.',
      severity: 'medium',
      recommendation: 'Restrict radio control to bridge network only.',
    },
    {
      id: 'SN015',
      name: 'Fleet Management System Weak Auth',
      description: 'Fleet tracking system using weak credentials.',
      severity: 'high',
      recommendation: 'Implement strong authentication for fleet management.',
    },
    {
      id: 'SN016',
      name: 'Crew WiFi Bridged to OT',
      description: 'Crew WiFi network has connectivity to operational technology.',
      severity: 'critical',
      recommendation: 'Implement strict network segmentation between IT and OT.',
    },
    // Engine Room & Control Systems (17-24)
    {
      id: 'SN017',
      name: 'Engine Control System Exposed',
      description: 'Main engine control accessible from bridge network.',
      severity: 'high',
      port: 502,
      service: 'Modbus',
      recommendation: 'Segment engine control network with industrial firewall.',
    },
    {
      id: 'SN018',
      name: 'Ballast Control Vulnerability',
      description: 'Ballast water management system lacks authentication.',
      severity: 'high',
      recommendation: 'Implement access control for ballast operations.',
    },
    {
      id: 'SN019',
      name: 'Power Management Exposed',
      description: 'Ship power management system accessible remotely.',
      severity: 'critical',
      recommendation: 'Isolate power management from external networks.',
    },
    {
      id: 'SN020',
      name: 'HVAC System Network Access',
      description: 'Climate control system connected to general network.',
      severity: 'low',
      recommendation: 'Segment HVAC controls from crew network.',
    },
    {
      id: 'SN021',
      name: 'Bilge Alarm System Unprotected',
      description: 'Bilge monitoring system lacks integrity protection.',
      severity: 'medium',
      recommendation: 'Implement authenticated alarm messaging.',
    },
    {
      id: 'SN022',
      name: 'Fire Detection Panel Networked',
      description: 'Fire safety system connected to IT infrastructure.',
      severity: 'high',
      recommendation: 'Ensure fire systems are isolated with redundant connectivity.',
    },
    {
      id: 'SN023',
      name: 'Fuel Management System Access',
      description: 'Fuel monitoring and transfer controls accessible.',
      severity: 'medium',
      recommendation: 'Restrict fuel system access to authorized personnel.',
    },
    {
      id: 'SN024',
      name: 'Propulsion Control Weakness',
      description: 'Propulsion system control using unencrypted protocols.',
      severity: 'critical',
      recommendation: 'Upgrade to encrypted control protocols.',
    },
    // General Security (25-30)
    {
      id: 'SN025',
      name: 'Missing Security Patches',
      description: 'Operating systems missing critical security updates.',
      severity: 'high',
      recommendation: 'Establish regular patching schedule during port calls.',
    },
    {
      id: 'SN026',
      name: 'No Intrusion Detection',
      description: 'Ship network lacks intrusion detection system.',
      severity: 'medium',
      recommendation: 'Deploy maritime-certified IDS solution.',
    },
    {
      id: 'SN027',
      name: 'USB Port Unrestricted',
      description: 'USB ports on bridge systems not controlled.',
      severity: 'medium',
      recommendation: 'Implement USB device control policies.',
    },
    {
      id: 'SN028',
      name: 'No Network Logging',
      description: 'Network traffic not being logged for forensics.',
      severity: 'medium',
      recommendation: 'Implement centralized logging for all network activity.',
    },
    {
      id: 'SN029',
      name: 'Backup Systems Unencrypted',
      description: 'System backups stored without encryption.',
      severity: 'medium',
      recommendation: 'Encrypt all backup data and secure backup media.',
    },
    {
      id: 'SN030',
      name: 'No Cyber Incident Response Plan',
      description: 'Vessel lacks documented cyber incident response procedures.',
      severity: 'medium',
      recommendation: 'Develop and test cyber incident response plan.',
    },
  ],
  logistics_system: [
    // Database Security (1-6)
    {
      id: 'LS001',
      name: 'Database Port Exposed',
      description: 'MySQL/PostgreSQL port accessible from external network.',
      severity: 'critical',
      port: 3306,
      service: 'MySQL',
      recommendation: 'Restrict database access to application servers only.',
    },
    {
      id: 'LS002',
      name: 'MongoDB Without Auth',
      description: 'MongoDB instance running without authentication.',
      severity: 'critical',
      port: 27017,
      service: 'MongoDB',
      recommendation: 'Enable MongoDB authentication immediately.',
    },
    {
      id: 'LS003',
      name: 'Redis Exposed',
      description: 'Redis cache server accessible without password.',
      severity: 'high',
      port: 6379,
      service: 'Redis',
      recommendation: 'Configure Redis password and bind to localhost.',
    },
    {
      id: 'LS004',
      name: 'Elasticsearch Unprotected',
      description: 'Elasticsearch cluster accessible without authentication.',
      severity: 'critical',
      port: 9200,
      service: 'Elasticsearch',
      recommendation: 'Enable X-Pack security or search guard.',
    },
    {
      id: 'LS005',
      name: 'SQL Injection Vulnerable',
      description: 'Application endpoints vulnerable to SQL injection.',
      severity: 'critical',
      recommendation: 'Use parameterized queries and input validation.',
    },
    {
      id: 'LS006',
      name: 'Database Backup Exposed',
      description: 'Database backup files accessible via web server.',
      severity: 'critical',
      recommendation: 'Move backup files outside web root and restrict access.',
    },
    // API Security (7-12)
    {
      id: 'LS007',
      name: 'API Without Authentication',
      description: 'REST API endpoints accessible without authentication.',
      severity: 'high',
      recommendation: 'Implement OAuth 2.0 or API key authentication.',
    },
    {
      id: 'LS008',
      name: 'Missing Rate Limiting',
      description: 'API endpoints lack rate limiting, vulnerable to abuse.',
      severity: 'medium',
      recommendation: 'Implement rate limiting on all API endpoints.',
    },
    {
      id: 'LS009',
      name: 'API Keys in URL',
      description: 'API keys being passed in URL query parameters.',
      severity: 'high',
      recommendation: 'Pass API keys in headers, not URL parameters.',
    },
    {
      id: 'LS010',
      name: 'Missing Input Validation',
      description: 'API endpoints not validating input data types.',
      severity: 'medium',
      recommendation: 'Implement strict input validation and sanitization.',
    },
    {
      id: 'LS011',
      name: 'CORS Misconfiguration',
      description: 'CORS policy allows requests from any origin.',
      severity: 'medium',
      recommendation: 'Restrict CORS to specific trusted domains.',
    },
    {
      id: 'LS012',
      name: 'API Documentation Exposed',
      description: 'Swagger/OpenAPI documentation accessible publicly.',
      severity: 'low',
      recommendation: 'Restrict API documentation to internal network.',
    },
    // Authentication (13-18)
    {
      id: 'LS013',
      name: 'Weak Password Policy',
      description: 'System allows passwords shorter than 12 characters.',
      severity: 'medium',
      recommendation: 'Enforce minimum 12 character passwords with complexity.',
    },
    {
      id: 'LS014',
      name: 'Missing MFA Option',
      description: 'Multi-factor authentication not available for users.',
      severity: 'medium',
      recommendation: 'Implement TOTP or SMS-based MFA.',
    },
    {
      id: 'LS015',
      name: 'JWT Token Not Expiring',
      description: 'JWT tokens have no expiration or very long lifetime.',
      severity: 'high',
      recommendation: 'Set JWT expiration to 15-60 minutes with refresh tokens.',
    },
    {
      id: 'LS016',
      name: 'Password Reset Vulnerability',
      description: 'Password reset tokens not expiring properly.',
      severity: 'high',
      recommendation: 'Expire reset tokens after 15 minutes.',
    },
    {
      id: 'LS017',
      name: 'Session Fixation',
      description: 'Session ID not regenerated after login.',
      severity: 'high',
      recommendation: 'Regenerate session ID upon authentication.',
    },
    {
      id: 'LS018',
      name: 'Insecure Remember Me',
      description: 'Remember me functionality using predictable tokens.',
      severity: 'medium',
      recommendation: 'Use cryptographically secure random tokens.',
    },
    // Infrastructure (19-24)
    {
      id: 'LS019',
      name: 'Docker API Exposed',
      description: 'Docker daemon API accessible without authentication.',
      severity: 'critical',
      port: 2375,
      service: 'Docker',
      recommendation: 'Enable TLS and authentication for Docker API.',
    },
    {
      id: 'LS020',
      name: 'Kubernetes Dashboard Exposed',
      description: 'K8s dashboard accessible from external network.',
      severity: 'critical',
      port: 8443,
      service: 'K8s',
      recommendation: 'Restrict dashboard to internal network with RBAC.',
    },
    {
      id: 'LS021',
      name: 'SSH Using Password',
      description: 'SSH server accepting password authentication.',
      severity: 'medium',
      port: 22,
      service: 'SSH',
      recommendation: 'Disable password auth, use key-based only.',
    },
    {
      id: 'LS022',
      name: 'Outdated Container Images',
      description: 'Container images contain known vulnerabilities.',
      severity: 'high',
      recommendation: 'Update base images and scan regularly.',
    },
    {
      id: 'LS023',
      name: 'Secrets in Environment',
      description: 'Sensitive data stored in environment variables.',
      severity: 'medium',
      recommendation: 'Use secrets management solution like Vault.',
    },
    {
      id: 'LS024',
      name: 'Logging Sensitive Data',
      description: 'Application logs containing sensitive information.',
      severity: 'high',
      recommendation: 'Implement log scrubbing and data masking.',
    },
    // Supply Chain & Tracking (25-30)
    {
      id: 'LS025',
      name: 'Container Tracking Unencrypted',
      description: 'Container tracking data transmitted without encryption.',
      severity: 'high',
      recommendation: 'Implement TLS for all tracking communications.',
    },
    {
      id: 'LS026',
      name: 'EDI Connection Insecure',
      description: 'Electronic Data Interchange using deprecated protocols.',
      severity: 'medium',
      recommendation: 'Upgrade to AS4 or secure SFTP for EDI.',
    },
    {
      id: 'LS027',
      name: 'RFID System Vulnerable',
      description: 'RFID readers using unencrypted communication.',
      severity: 'medium',
      recommendation: 'Implement encrypted RFID protocols.',
    },
    {
      id: 'LS028',
      name: 'Customs System Integration Weak',
      description: 'Customs API integration using weak authentication.',
      severity: 'high',
      recommendation: 'Implement certificate-based mutual TLS.',
    },
    {
      id: 'LS029',
      name: 'Booking System SQL Injection',
      description: 'Cargo booking system vulnerable to injection attacks.',
      severity: 'critical',
      recommendation: 'Use ORM and parameterized queries.',
    },
    {
      id: 'LS030',
      name: 'Manifest Data Unprotected',
      description: 'Shipping manifest accessible without authorization.',
      severity: 'high',
      recommendation: 'Implement role-based access control for manifests.',
    },
  ],
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random subset of vulnerabilities (8-15 findings per scan)
function getRandomVulnerabilities(systemType: SystemType): Vulnerability[] {
  const templates = vulnerabilityTemplates[systemType];
  const minCount = 8;
  const maxCount = 15;
  const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, templates.length));
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
  
  // Expanded scan phases - 15 phases for comprehensive scanning
  const phases = [
    'Initializing scan engine...',
    'Performing DNS resolution...',
    'Executing port discovery (1-1024)...',
    'Scanning high ports (1025-65535)...',
    'Identifying running services...',
    'Checking security headers...',
    'Analyzing SSL/TLS configuration...',
    'Testing cipher suites...',
    'Evaluating authentication mechanisms...',
    'Scanning for SCADA/ICS protocols...',
    'Checking industrial control ports...',
    'Analyzing network segmentation...',
    'Detecting misconfigurations...',
    'Evaluating access controls...',
    'Generating risk assessment...',
  ];
  
  for (let i = 0; i < phases.length; i++) {
    onProgress?.(phases[i], ((i + 1) / phases.length) * 100);
    await delay(400 + Math.random() * 300);
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
  
  // Total checks = 30 security checks per system type
  const totalChecks = 30;
  
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
      total_checks: totalChecks,
      passed_checks: totalChecks - vulnerabilities.length,
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
