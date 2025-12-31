// Mock API Service - Simulates FastAPI backend responses
// Ready to swap with real backend: just replace these functions with fetch calls

export type SystemType = 'smart_port' | 'ship_network' | 'logistics_system';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Vulnerability {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  port?: number;
  service?: string;
  recommendation: string;
  category: string;
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

// 70 Unique Security Checks for Smart Port / Naval Infrastructure
const scanChecks: Vulnerability[] = [
  // 🔴 NETWORK & PERIMETER SECURITY CHECKS (1-10)
  {
    id: 'NPS001',
    name: 'Open Common Ports Check',
    description: 'Common service ports (21, 22, 23, 80, 443, 3389) found open and accessible from external networks.',
    severity: 'high',
    port: 22,
    service: 'Multiple',
    recommendation: 'Close unnecessary ports and implement firewall rules to restrict access.',
    category: 'Network & Perimeter Security',
  },
  {
    id: 'NPS002',
    name: 'Excessive Open Ports Exposure',
    description: 'More than 20 ports detected open on the target system, increasing attack surface.',
    severity: 'high',
    recommendation: 'Conduct port audit and close all non-essential services.',
    category: 'Network & Perimeter Security',
  },
  {
    id: 'NPS003',
    name: 'Insecure Service Port Detection (FTP/Telnet)',
    description: 'Legacy insecure services FTP (21) and Telnet (23) detected running on the system.',
    severity: 'critical',
    port: 21,
    service: 'FTP/Telnet',
    recommendation: 'Disable FTP and Telnet. Use SFTP and SSH as secure alternatives.',
    category: 'Network & Perimeter Security',
  },
  {
    id: 'NPS004',
    name: 'Unnecessary Service Exposure',
    description: 'Non-essential services exposed to network including print spooler, NetBIOS, and RPC.',
    severity: 'medium',
    recommendation: 'Disable unnecessary services and implement service hardening.',
    category: 'Network & Perimeter Security',
  },
  {
    id: 'NPS005',
    name: 'Port-to-Service Mismatch Check',
    description: 'Services running on non-standard ports detected, possible evasion technique.',
    severity: 'medium',
    recommendation: 'Investigate mismatched services and normalize port assignments.',
    category: 'Network & Perimeter Security',
  },
  {
    id: 'NPS006',
    name: 'Publicly Reachable Internal Services',
    description: 'Internal services (database, admin panels) accessible from public network.',
    severity: 'critical',
    port: 3306,
    service: 'MySQL',
    recommendation: 'Implement network segmentation and restrict internal services to private networks.',
    category: 'Network & Perimeter Security',
  },
  {
    id: 'NPS007',
    name: 'Network Segmentation Absence Check',
    description: 'No network segmentation detected between IT, OT, and guest networks.',
    severity: 'critical',
    recommendation: 'Implement VLANs and network zones with proper access controls.',
    category: 'Network & Perimeter Security',
  },
  {
    id: 'NPS008',
    name: 'Firewall Misconfiguration Indicator',
    description: 'Firewall rules allow broad access patterns including ANY-ANY rules detected.',
    severity: 'high',
    recommendation: 'Audit firewall rules and implement principle of least privilege.',
    category: 'Network & Perimeter Security',
  },
  {
    id: 'NPS009',
    name: 'ICMP Exposure Check',
    description: 'System responds to ICMP echo requests, enabling network reconnaissance.',
    severity: 'low',
    recommendation: 'Block ICMP at perimeter firewall for external interfaces.',
    category: 'Network & Perimeter Security',
  },
  {
    id: 'NPS010',
    name: 'Default Gateway Exposure Check',
    description: 'Network gateway management interface accessible from untrusted networks.',
    severity: 'high',
    port: 443,
    service: 'HTTPS',
    recommendation: 'Restrict gateway management to dedicated management VLAN.',
    category: 'Network & Perimeter Security',
  },

  // 🟠 REMOTE ACCESS & MANAGEMENT (11-18)
  {
    id: 'RAM001',
    name: 'Telnet Service Enabled Check',
    description: 'Telnet service active on port 23, transmitting credentials in plaintext.',
    severity: 'critical',
    port: 23,
    service: 'Telnet',
    recommendation: 'Disable Telnet immediately and migrate to SSH.',
    category: 'Remote Access & Management',
  },
  {
    id: 'RAM002',
    name: 'FTP Service Enabled Check',
    description: 'FTP service running without encryption, exposing file transfers.',
    severity: 'high',
    port: 21,
    service: 'FTP',
    recommendation: 'Replace FTP with SFTP or FTPS for secure file transfers.',
    category: 'Remote Access & Management',
  },
  {
    id: 'RAM003',
    name: 'SSH Weak Configuration Check',
    description: 'SSH service using weak ciphers, key exchange algorithms, or protocol version 1.',
    severity: 'high',
    port: 22,
    service: 'SSH',
    recommendation: 'Harden SSH configuration with strong ciphers and disable SSHv1.',
    category: 'Remote Access & Management',
  },
  {
    id: 'RAM004',
    name: 'Remote Management Port Exposure',
    description: 'Remote management ports (RDP 3389, VNC 5900) exposed to public network.',
    severity: 'critical',
    port: 3389,
    service: 'RDP',
    recommendation: 'Implement VPN or jump server for remote management access.',
    category: 'Remote Access & Management',
  },
  {
    id: 'RAM005',
    name: 'Legacy Remote Access Protocol Detection',
    description: 'Legacy protocols (rsh, rlogin, rexec) detected on the system.',
    severity: 'critical',
    port: 514,
    service: 'RSH',
    recommendation: 'Disable all legacy remote access protocols immediately.',
    category: 'Remote Access & Management',
  },
  {
    id: 'RAM006',
    name: 'Plaintext Authentication Service Detection',
    description: 'Services accepting plaintext authentication without TLS encryption.',
    severity: 'high',
    recommendation: 'Enforce TLS/SSL for all authentication services.',
    category: 'Remote Access & Management',
  },
  {
    id: 'RAM007',
    name: 'Multiple Remote Access Services Enabled',
    description: 'Multiple remote access methods active (SSH, RDP, VNC, TeamViewer).',
    severity: 'medium',
    recommendation: 'Standardize on single secure remote access solution.',
    category: 'Remote Access & Management',
  },
  {
    id: 'RAM008',
    name: 'Remote Admin Interface Exposure',
    description: 'Administrative web interfaces accessible without IP restrictions.',
    severity: 'high',
    port: 8443,
    service: 'HTTPS',
    recommendation: 'Restrict admin interfaces to whitelisted IP addresses.',
    category: 'Remote Access & Management',
  },

  // 🟡 WEB & APPLICATION SECURITY (19-29)
  {
    id: 'WAS001',
    name: 'Missing HTTP Security Headers',
    description: 'Critical HTTP security headers not configured on web applications.',
    severity: 'medium',
    recommendation: 'Implement all recommended HTTP security headers.',
    category: 'Web & Application Security',
  },
  {
    id: 'WAS002',
    name: 'Missing HSTS Header',
    description: 'HTTP Strict Transport Security header not configured.',
    severity: 'medium',
    recommendation: 'Enable HSTS with max-age of at least 31536000 seconds.',
    category: 'Web & Application Security',
  },
  {
    id: 'WAS003',
    name: 'Missing Content Security Policy',
    description: 'No Content-Security-Policy header, increasing XSS attack risk.',
    severity: 'medium',
    recommendation: 'Implement strict Content-Security-Policy header.',
    category: 'Web & Application Security',
  },
  {
    id: 'WAS004',
    name: 'Missing X-Frame-Options Header',
    description: 'Clickjacking protection not enabled via X-Frame-Options.',
    severity: 'low',
    recommendation: 'Add X-Frame-Options: DENY or SAMEORIGIN header.',
    category: 'Web & Application Security',
  },
  {
    id: 'WAS005',
    name: 'Missing X-Content-Type-Options',
    description: 'MIME type sniffing protection not enabled.',
    severity: 'low',
    recommendation: 'Add X-Content-Type-Options: nosniff header.',
    category: 'Web & Application Security',
  },
  {
    id: 'WAS006',
    name: 'HTTP Allowed Over HTTPS Systems',
    description: 'System allows unencrypted HTTP connections alongside HTTPS.',
    severity: 'medium',
    recommendation: 'Enforce HTTPS-only and redirect all HTTP to HTTPS.',
    category: 'Web & Application Security',
  },
  {
    id: 'WAS007',
    name: 'Insecure HTTP Methods Enabled',
    description: 'Dangerous HTTP methods (PUT, DELETE, TRACE) enabled on web server.',
    severity: 'medium',
    recommendation: 'Disable unnecessary HTTP methods in server configuration.',
    category: 'Web & Application Security',
  },
  {
    id: 'WAS008',
    name: 'Directory Listing Enabled Indicator',
    description: 'Web server exposing directory contents to unauthenticated users.',
    severity: 'medium',
    recommendation: 'Disable directory listing in web server configuration.',
    category: 'Web & Application Security',
  },
  {
    id: 'WAS009',
    name: 'Default Web Page Detected',
    description: 'Default installation page or sample content still present.',
    severity: 'low',
    recommendation: 'Remove default pages and deploy custom error pages.',
    category: 'Web & Application Security',
  },
  {
    id: 'WAS010',
    name: 'Server Banner Disclosure',
    description: 'Web server revealing software name and version in HTTP headers.',
    severity: 'low',
    recommendation: 'Configure server to suppress version information.',
    category: 'Web & Application Security',
  },
  {
    id: 'WAS011',
    name: 'Web Server Version Disclosure',
    description: 'Detailed web server version exposed in response headers.',
    severity: 'low',
    recommendation: 'Remove or obfuscate server version headers.',
    category: 'Web & Application Security',
  },

  // 🟢 TLS / CRYPTOGRAPHY & COMMUNICATION (30-40)
  {
    id: 'TLS001',
    name: 'HTTPS Not Enforced Check',
    description: 'HTTPS not enforced, allowing data transmission over unencrypted HTTP.',
    severity: 'high',
    recommendation: 'Implement mandatory HTTPS with proper redirects.',
    category: 'TLS & Cryptography',
  },
  {
    id: 'TLS002',
    name: 'SSL/TLS Not Configured',
    description: 'No SSL/TLS configuration found on public-facing services.',
    severity: 'critical',
    recommendation: 'Obtain and install valid SSL/TLS certificates.',
    category: 'TLS & Cryptography',
  },
  {
    id: 'TLS003',
    name: 'Weak TLS Protocol Support',
    description: 'Server supports deprecated TLS 1.0 and TLS 1.1 protocols.',
    severity: 'medium',
    recommendation: 'Disable TLS 1.0/1.1 and enforce TLS 1.2 or higher.',
    category: 'TLS & Cryptography',
  },
  {
    id: 'TLS004',
    name: 'Deprecated Cipher Suite Support',
    description: 'Server accepts weak cipher suites including RC4, 3DES, and NULL ciphers.',
    severity: 'high',
    recommendation: 'Configure server to use only strong modern cipher suites.',
    category: 'TLS & Cryptography',
  },
  {
    id: 'TLS005',
    name: 'Self-Signed Certificate Detection',
    description: 'Self-signed certificate in use instead of CA-issued certificate.',
    severity: 'medium',
    recommendation: 'Obtain certificate from trusted Certificate Authority.',
    category: 'TLS & Cryptography',
  },
  {
    id: 'TLS006',
    name: 'Certificate Expiry Check',
    description: 'SSL/TLS certificate expires within 30 days or already expired.',
    severity: 'high',
    recommendation: 'Renew SSL certificate before expiration date.',
    category: 'TLS & Cryptography',
  },
  {
    id: 'TLS007',
    name: 'Certificate CN Mismatch Check',
    description: 'Certificate Common Name does not match the server hostname.',
    severity: 'medium',
    recommendation: 'Obtain certificate with correct CN or SAN entries.',
    category: 'TLS & Cryptography',
  },
  {
    id: 'TLS008',
    name: 'Insecure Key Length Detection',
    description: 'RSA key length less than 2048 bits detected.',
    severity: 'high',
    recommendation: 'Use minimum 2048-bit RSA keys or 256-bit ECC keys.',
    category: 'TLS & Cryptography',
  },
  {
    id: 'TLS009',
    name: 'Mixed Content Detection',
    description: 'HTTPS pages loading resources over unencrypted HTTP.',
    severity: 'medium',
    recommendation: 'Ensure all resources are loaded over HTTPS.',
    category: 'TLS & Cryptography',
  },
  {
    id: 'TLS010',
    name: 'Plaintext Data Transmission Indicator',
    description: 'Sensitive data transmitted without encryption over the network.',
    severity: 'critical',
    recommendation: 'Implement end-to-end encryption for all sensitive data.',
    category: 'TLS & Cryptography',
  },

  // 🔵 AUTHENTICATION & ACCESS CONTROL (41-50)
  {
    id: 'AAC001',
    name: 'Default Credential Usage Indicator',
    description: 'System responding to default username/password combinations.',
    severity: 'critical',
    recommendation: 'Change all default credentials immediately.',
    category: 'Authentication & Access Control',
  },
  {
    id: 'AAC002',
    name: 'Weak Authentication Policy Indicator',
    description: 'Weak password policy allowing simple or short passwords.',
    severity: 'high',
    recommendation: 'Implement strong password policy with complexity requirements.',
    category: 'Authentication & Access Control',
  },
  {
    id: 'AAC003',
    name: 'Missing Account Lockout Policy Indicator',
    description: 'No account lockout after failed login attempts detected.',
    severity: 'high',
    recommendation: 'Implement account lockout after 5 failed attempts.',
    category: 'Authentication & Access Control',
  },
  {
    id: 'AAC004',
    name: 'Excessive Privilege Exposure Indicator',
    description: 'Users or services operating with excessive privileges.',
    severity: 'high',
    recommendation: 'Implement principle of least privilege across all accounts.',
    category: 'Authentication & Access Control',
  },
  {
    id: 'AAC005',
    name: 'Anonymous Access Enabled Check',
    description: 'Anonymous or unauthenticated access allowed to sensitive resources.',
    severity: 'high',
    recommendation: 'Disable anonymous access and require authentication.',
    category: 'Authentication & Access Control',
  },
  {
    id: 'AAC006',
    name: 'Guest Account Enabled Indicator',
    description: 'Guest or default accounts remain enabled on the system.',
    severity: 'medium',
    recommendation: 'Disable all guest and default accounts.',
    category: 'Authentication & Access Control',
  },
  {
    id: 'AAC007',
    name: 'Unrestricted API Access Indicator',
    description: 'APIs accessible without authentication or rate limiting.',
    severity: 'high',
    recommendation: 'Implement API authentication and rate limiting.',
    category: 'Authentication & Access Control',
  },
  {
    id: 'AAC008',
    name: 'Token-Based Authentication Absence',
    description: 'Session management using weak or predictable tokens.',
    severity: 'medium',
    recommendation: 'Implement secure token-based authentication (JWT, OAuth).',
    category: 'Authentication & Access Control',
  },
  {
    id: 'AAC009',
    name: 'Session Security Misconfiguration Indicator',
    description: 'Session cookies missing Secure, HttpOnly, or SameSite flags.',
    severity: 'medium',
    recommendation: 'Configure secure cookie attributes for all sessions.',
    category: 'Authentication & Access Control',
  },
  {
    id: 'AAC010',
    name: 'Missing Multi-Factor Authentication',
    description: 'Administrative interfaces lack multi-factor authentication.',
    severity: 'high',
    recommendation: 'Implement MFA for all administrative and privileged access.',
    category: 'Authentication & Access Control',
  },

  // 🟣 CONFIGURATION & HARDENING (51-59)
  {
    id: 'CFH001',
    name: 'Default Configuration Detected',
    description: 'System running with default configuration settings.',
    severity: 'medium',
    recommendation: 'Apply security hardening guidelines and customize configuration.',
    category: 'Configuration & Hardening',
  },
  {
    id: 'CFH002',
    name: 'Unpatched Service Version Indicator',
    description: 'Services running outdated versions with known vulnerabilities.',
    severity: 'critical',
    recommendation: 'Apply latest security patches and updates.',
    category: 'Configuration & Hardening',
  },
  {
    id: 'CFH003',
    name: 'Legacy Software Usage Indicator',
    description: 'End-of-life or unsupported software in use.',
    severity: 'high',
    recommendation: 'Upgrade to supported software versions.',
    category: 'Configuration & Hardening',
  },
  {
    id: 'CFH004',
    name: 'Debug Mode Enabled Indicator',
    description: 'Application or service running in debug mode in production.',
    severity: 'high',
    recommendation: 'Disable debug mode in production environments.',
    category: 'Configuration & Hardening',
  },
  {
    id: 'CFH005',
    name: 'Test Interface Exposure',
    description: 'Test or development interfaces accessible in production.',
    severity: 'medium',
    recommendation: 'Remove or disable all test interfaces in production.',
    category: 'Configuration & Hardening',
  },
  {
    id: 'CFH006',
    name: 'Backup File Exposure Indicator',
    description: 'Backup files (.bak, .old, .backup) accessible via web.',
    severity: 'medium',
    recommendation: 'Remove backup files from web-accessible directories.',
    category: 'Configuration & Hardening',
  },
  {
    id: 'CFH007',
    name: 'Error Handling Misconfiguration',
    description: 'Detailed error messages exposing system information.',
    severity: 'medium',
    recommendation: 'Implement custom error pages without technical details.',
    category: 'Configuration & Hardening',
  },
  {
    id: 'CFH008',
    name: 'Excessive Information Disclosure',
    description: 'System revealing sensitive technical information in responses.',
    severity: 'medium',
    recommendation: 'Review and minimize information exposed in responses.',
    category: 'Configuration & Hardening',
  },
  {
    id: 'CFH009',
    name: 'Logging & Monitoring Absence Indicator',
    description: 'Insufficient logging and monitoring capabilities detected.',
    severity: 'high',
    recommendation: 'Implement comprehensive logging and real-time monitoring.',
    category: 'Configuration & Hardening',
  },

  // ⚫ IoT / OT / MARITIME-SPECIFIC (60-67)
  {
    id: 'IOT001',
    name: 'IoT Device Exposure Indicator',
    description: 'IoT devices accessible from external network without protection.',
    severity: 'high',
    recommendation: 'Segment IoT devices and implement access controls.',
    category: 'IoT/OT Maritime Systems',
  },
  {
    id: 'IOT002',
    name: 'OT Protocol Exposure Indicator',
    description: 'Industrial protocols (Modbus, DNP3, OPC) accessible without protection.',
    severity: 'critical',
    port: 502,
    service: 'Modbus',
    recommendation: 'Implement industrial firewall with protocol-aware filtering.',
    category: 'IoT/OT Maritime Systems',
  },
  {
    id: 'IOT003',
    name: 'SCADA Interface Exposure Indicator',
    description: 'SCADA HMI or control interfaces accessible from IT network.',
    severity: 'critical',
    recommendation: 'Physically and logically isolate SCADA systems.',
    category: 'IoT/OT Maritime Systems',
  },
  {
    id: 'IOT004',
    name: 'Unauthenticated Device Communication',
    description: 'OT/IoT devices communicating without authentication.',
    severity: 'high',
    recommendation: 'Implement device authentication for all OT communications.',
    category: 'IoT/OT Maritime Systems',
  },
  {
    id: 'IOT005',
    name: 'Weak Device Identity Enforcement',
    description: 'Weak or absent device identity verification mechanisms.',
    severity: 'high',
    recommendation: 'Implement certificate-based device identity.',
    category: 'IoT/OT Maritime Systems',
  },
  {
    id: 'IOT006',
    name: 'Firmware Update Security Absence',
    description: 'Devices accepting unsigned firmware updates.',
    severity: 'high',
    recommendation: 'Implement secure boot and signed firmware validation.',
    category: 'IoT/OT Maritime Systems',
  },
  {
    id: 'IOT007',
    name: 'Insecure Device Management Interface',
    description: 'Device management interfaces using weak authentication.',
    severity: 'high',
    recommendation: 'Secure device management with strong authentication.',
    category: 'IoT/OT Maritime Systems',
  },
  {
    id: 'IOT008',
    name: 'Flat OT Network Indicator',
    description: 'No segmentation between OT zones and levels detected.',
    severity: 'critical',
    recommendation: 'Implement Purdue Model network segmentation.',
    category: 'IoT/OT Maritime Systems',
  },

  // 🔐 GOVERNANCE & DEFENCE-ALIGNED CHECKS (68-70)
  {
    id: 'GOV001',
    name: 'CERT-In Compliance Indicator',
    description: 'Non-compliance with CERT-In security guidelines detected.',
    severity: 'high',
    recommendation: 'Review and implement CERT-In security advisories.',
    category: 'Governance & Defence',
  },
  {
    id: 'GOV002',
    name: 'NIC Security Baseline Deviation',
    description: 'Deviation from NIC security baseline standards detected.',
    severity: 'medium',
    recommendation: 'Align systems with NIC security baseline requirements.',
    category: 'Governance & Defence',
  },
  {
    id: 'GOV003',
    name: 'Absence of Cyber Hygiene Controls',
    description: 'Basic cyber hygiene controls not implemented.',
    severity: 'medium',
    recommendation: 'Implement cyber hygiene best practices and regular audits.',
    category: 'Governance & Defence',
  },
  {
    id: 'GOV004',
    name: 'Incident Response Readiness Indicator',
    description: 'No documented incident response plan or procedures.',
    severity: 'high',
    recommendation: 'Develop and test cyber incident response plan.',
    category: 'Governance & Defence',
  },
  {
    id: 'GOV005',
    name: 'Defence-in-Depth Control Absence',
    description: 'Single layer of security without defence-in-depth strategy.',
    severity: 'high',
    recommendation: 'Implement multi-layer security controls and monitoring.',
    category: 'Governance & Defence',
  },
];

// Comprehensive scan phases - 70 unique checks
const scanPhases = [
  { phase: 'Network Discovery', checks: 'Mapping network topology and hosts...', duration: 800 },
  { phase: 'Open Common Ports Check', checks: 'Scanning standard service ports (21, 22, 23, 80, 443, 3389)...', duration: 600 },
  { phase: 'Excessive Ports Analysis', checks: 'Identifying excessive open port exposure...', duration: 500 },
  { phase: 'Insecure Service Detection', checks: 'Detecting FTP and Telnet services...', duration: 600 },
  { phase: 'Unnecessary Services Scan', checks: 'Finding non-essential exposed services...', duration: 500 },
  { phase: 'Port-Service Mapping', checks: 'Verifying port-to-service consistency...', duration: 400 },
  { phase: 'Internal Services Exposure', checks: 'Checking publicly reachable internal services...', duration: 600 },
  { phase: 'Network Segmentation Check', checks: 'Analyzing network segmentation architecture...', duration: 700 },
  { phase: 'Firewall Configuration Audit', checks: 'Reviewing firewall rules and policies...', duration: 800 },
  { phase: 'ICMP/Gateway Exposure', checks: 'Testing ICMP and gateway exposure...', duration: 400 },
  { phase: 'Remote Access Analysis', checks: 'Scanning Telnet, FTP, SSH configurations...', duration: 700 },
  { phase: 'Legacy Protocol Detection', checks: 'Detecting legacy remote access protocols...', duration: 500 },
  { phase: 'Admin Interface Discovery', checks: 'Finding exposed admin interfaces...', duration: 600 },
  { phase: 'HTTP Security Headers', checks: 'Checking HSTS, CSP, X-Frame-Options...', duration: 600 },
  { phase: 'Web Application Analysis', checks: 'Analyzing web security configurations...', duration: 700 },
  { phase: 'Directory/Banner Exposure', checks: 'Checking directory listing and server disclosure...', duration: 500 },
  { phase: 'TLS/SSL Protocol Check', checks: 'Testing SSL/TLS configurations...', duration: 800 },
  { phase: 'Certificate Validation', checks: 'Validating certificate chain and expiry...', duration: 600 },
  { phase: 'Cipher Suite Analysis', checks: 'Analyzing cipher suite strength...', duration: 500 },
  { phase: 'Encryption Key Assessment', checks: 'Checking encryption key lengths...', duration: 400 },
  { phase: 'Authentication Policy Check', checks: 'Reviewing authentication mechanisms...', duration: 700 },
  { phase: 'Default Credentials Test', checks: 'Testing for default credentials...', duration: 600 },
  { phase: 'Account Lockout Policy', checks: 'Verifying account lockout configurations...', duration: 400 },
  { phase: 'Privilege Analysis', checks: 'Analyzing privilege assignments...', duration: 500 },
  { phase: 'API Security Assessment', checks: 'Testing API authentication and rate limiting...', duration: 600 },
  { phase: 'Session Management Check', checks: 'Analyzing session security configurations...', duration: 500 },
  { phase: 'Configuration Baseline', checks: 'Comparing against security baselines...', duration: 700 },
  { phase: 'Patch Level Assessment', checks: 'Checking for unpatched vulnerabilities...', duration: 800 },
  { phase: 'Legacy Software Detection', checks: 'Identifying end-of-life software...', duration: 500 },
  { phase: 'Debug Mode Detection', checks: 'Checking for debug mode exposure...', duration: 400 },
  { phase: 'Test Interface Discovery', checks: 'Finding exposed test interfaces...', duration: 400 },
  { phase: 'Backup File Exposure', checks: 'Scanning for exposed backup files...', duration: 500 },
  { phase: 'Error Handling Review', checks: 'Analyzing error message disclosure...', duration: 400 },
  { phase: 'Logging/Monitoring Check', checks: 'Verifying logging and monitoring...', duration: 600 },
  { phase: 'IoT Device Discovery', checks: 'Identifying IoT devices on network...', duration: 700 },
  { phase: 'OT Protocol Analysis', checks: 'Scanning Modbus, DNP3, OPC protocols...', duration: 800 },
  { phase: 'SCADA Interface Check', checks: 'Testing SCADA HMI accessibility...', duration: 700 },
  { phase: 'Device Authentication', checks: 'Verifying OT device authentication...', duration: 600 },
  { phase: 'Firmware Security Check', checks: 'Analyzing firmware update security...', duration: 500 },
  { phase: 'OT Network Segmentation', checks: 'Reviewing OT network architecture...', duration: 600 },
  { phase: 'CERT-In Compliance', checks: 'Checking CERT-In guideline compliance...', duration: 700 },
  { phase: 'NIC Baseline Deviation', checks: 'Comparing against NIC security baseline...', duration: 600 },
  { phase: 'Cyber Hygiene Assessment', checks: 'Evaluating cyber hygiene controls...', duration: 500 },
  { phase: 'Incident Response Review', checks: 'Checking incident response readiness...', duration: 600 },
  { phase: 'Defence-in-Depth Analysis', checks: 'Evaluating multi-layer security controls...', duration: 700 },
  { phase: 'Final Risk Compilation', checks: 'Compiling risk assessment results...', duration: 400 },
];

// Helper function to get random vulnerabilities based on risk profile
function getRandomVulnerabilities(count: number): Vulnerability[] {
  const shuffled = [...scanChecks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Generate random open ports based on system type
function getRandomPorts(systemType: SystemType): number[] {
  const basePorts = [22, 80, 443]; // Common ports
  const additionalPorts: Record<SystemType, number[]> = {
    smart_port: [21, 23, 502, 102, 4840, 47808, 161, 3389, 8080, 1433, 5432],
    ship_network: [10110, 5060, 1883, 502, 8080, 8443, 161, 3389, 23, 21],
    logistics_system: [1433, 3306, 5432, 6379, 27017, 8080, 8443, 9200, 9300, 8161],
  };

  const systemPorts = additionalPorts[systemType];
  const selectedPorts = [...basePorts];

  // Add 3-7 random additional ports
  const numAdditional = Math.floor(Math.random() * 5) + 3;
  for (let i = 0; i < numAdditional; i++) {
    const randomPort = systemPorts[Math.floor(Math.random() * systemPorts.length)];
    if (!selectedPorts.includes(randomPort)) {
      selectedPorts.push(randomPort);
    }
  }

  return selectedPorts.sort((a, b) => a - b);
}

// Calculate risk score based on vulnerabilities
function calculateRiskScore(vulnerabilities: Vulnerability[]): number {
  if (vulnerabilities.length === 0) return 15;

  const severityWeights = {
    critical: 25,
    high: 15,
    medium: 8,
    low: 3,
  };

  let totalScore = 0;
  vulnerabilities.forEach((vuln) => {
    totalScore += severityWeights[vuln.severity];
  });

  // Normalize to 0-100 scale
  return Math.min(Math.max(totalScore, 15), 95);
}

// Determine risk level from score
function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

// Main scan function - simulates API call
export async function performScan(
  target: string,
  systemType: SystemType,
  onProgress?: (phase: string, progress: number, checks: string) => void
): Promise<ScanResult> {
  const totalPhases = scanPhases.length;

  // Simulate scanning through each phase
  for (let i = 0; i < totalPhases; i++) {
    const phase = scanPhases[i];
    const progress = Math.round(((i + 1) / totalPhases) * 100);

    if (onProgress) {
      onProgress(phase.phase, progress, phase.checks);
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, phase.duration));
  }

  // Generate results
  const numVulnerabilities = Math.floor(Math.random() * 10) + 8; // 8-17 vulnerabilities
  const vulnerabilities = getRandomVulnerabilities(numVulnerabilities);
  const openPorts = getRandomPorts(systemType);
  const riskScore = calculateRiskScore(vulnerabilities);
  const riskLevel = getRiskLevel(riskScore);

  const passedChecks = 70 - vulnerabilities.length;
  const warnings = Math.floor(vulnerabilities.filter((v) => v.severity === 'low' || v.severity === 'medium').length);
  const failedChecks = vulnerabilities.filter((v) => v.severity === 'high' || v.severity === 'critical').length;

  return {
    scan_id: `SCAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    target,
    system_type: systemType,
    timestamp: new Date().toISOString(),
    risk_score: riskScore,
    risk_level: riskLevel,
    open_ports: openPorts,
    vulnerabilities,
    scan_duration: Math.floor(Math.random() * 60) + 90, // 90-150 seconds
    summary: {
      total_checks: 70,
      passed_checks: passedChecks,
      failed_checks: failedChecks,
      warnings: warnings,
    },
  };
}

// Generate mitigation report
export function generateMitigationReport(scanResult: ScanResult): string {
  const { vulnerabilities, risk_score, risk_level, target, timestamp, summary } = scanResult;

  let report = `
================================================================================
       SMART PORT / NAVAL INFRASTRUCTURE SECURITY ASSESSMENT REPORT
================================================================================

Target System: ${target}
System Type: ${scanResult.system_type.replace('_', ' ').toUpperCase()}
Assessment Date: ${new Date(timestamp).toLocaleString()}
Report ID: ${scanResult.scan_id}

================================================================================
                           EXECUTIVE SUMMARY
================================================================================

Overall Risk Score: ${risk_score}/100
Risk Classification: ${risk_level.toUpperCase()}

Total Security Checks Performed: ${summary.total_checks}
├── Passed Checks: ${summary.passed_checks}
├── Failed Checks (High/Critical): ${summary.failed_checks}
└── Warnings (Low/Medium): ${summary.warnings}

================================================================================
                        DETAILED FINDINGS BY CATEGORY
================================================================================
`;

  // Group vulnerabilities by category
  const categories = [...new Set(vulnerabilities.map((v) => v.category))];

  categories.forEach((category) => {
    const categoryVulns = vulnerabilities.filter((v) => v.category === category);
    report += `\n--- ${category.toUpperCase()} ---\n\n`;

    categoryVulns.forEach((vuln, index) => {
      report += `[${vuln.severity.toUpperCase()}] ${vuln.name}
   ID: ${vuln.id}
   Description: ${vuln.description}
   ${vuln.port ? `Port: ${vuln.port}` : ''}
   ${vuln.service ? `Service: ${vuln.service}` : ''}
   Recommendation: ${vuln.recommendation}

`;
    });
  });

  report += `
================================================================================
                        COMPLIANCE ALIGNMENT
================================================================================

This assessment aligns with the following frameworks:
• CERT-In Security Guidelines
• NIC Security Baseline
• IEC 62443 (Industrial Automation)
• NIST Cybersecurity Framework
• IMO Maritime Cyber Risk Management Guidelines

================================================================================
                        REMEDIATION PRIORITY
================================================================================

IMMEDIATE (Within 24 Hours):
${vulnerabilities.filter((v) => v.severity === 'critical').map((v) => `• ${v.name}`).join('\n') || '• No critical issues found'}

HIGH PRIORITY (Within 7 Days):
${vulnerabilities.filter((v) => v.severity === 'high').map((v) => `• ${v.name}`).join('\n') || '• No high priority issues found'}

MEDIUM PRIORITY (Within 30 Days):
${vulnerabilities.filter((v) => v.severity === 'medium').map((v) => `• ${v.name}`).join('\n') || '• No medium priority issues found'}

LOW PRIORITY (Within 90 Days):
${vulnerabilities.filter((v) => v.severity === 'low').map((v) => `• ${v.name}`).join('\n') || '• No low priority issues found'}

================================================================================
                           END OF REPORT
================================================================================
`;

  return report;
}
