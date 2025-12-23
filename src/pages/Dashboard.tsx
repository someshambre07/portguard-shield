import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScan } from '@/context/ScanContext';
import { RiskGauge } from '@/components/RiskGauge';
import { VulnerabilityTable } from '@/components/VulnerabilityTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend 
} from 'recharts';
import { 
  Shield, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  ArrowRight,
  Download
} from 'lucide-react';
import { performScan, generateMitigationReport, type ScanResult } from '@/lib/mockApi';

// Demo data for when there's no scan result
const generateDemoData = (): ScanResult => ({
  scan_id: 'DEMO-001',
  target: 'demo.smartport.gov.in',
  system_type: 'smart_port',
  timestamp: new Date().toISOString(),
  risk_score: 65,
  risk_level: 'medium',
  open_ports: [22, 80, 443, 21, 502],
  vulnerabilities: [
    {
      id: 'V001',
      name: 'FTP Service Detected',
      description: 'Unencrypted FTP service running on port 21.',
      severity: 'high',
      port: 21,
      service: 'FTP',
      recommendation: 'Replace FTP with SFTP.',
    },
    {
      id: 'V002',
      name: 'Missing HSTS Header',
      description: 'HTTP Strict Transport Security header not configured.',
      severity: 'medium',
      recommendation: 'Enable HSTS header.',
    },
    {
      id: 'V003',
      name: 'SCADA Port Exposed',
      description: 'Industrial control system port 502 accessible.',
      severity: 'critical',
      port: 502,
      service: 'Modbus',
      recommendation: 'Implement network segmentation.',
    },
  ],
  scan_duration: 5.2,
  summary: {
    total_checks: 15,
    passed_checks: 12,
    failed_checks: 2,
    warnings: 1,
  },
});

export default function Dashboard() {
  const { scanResult } = useScan();
  const [data, setData] = useState<ScanResult | null>(null);

  useEffect(() => {
    if (scanResult) {
      setData(scanResult);
    } else {
      // Use demo data when no scan has been performed
      setData(generateDemoData());
    }
  }, [scanResult]);

  if (!data) {
    return (
      <div className="container py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  const severityData = [
    { name: 'Critical', value: data.vulnerabilities.filter(v => v.severity === 'critical').length, color: 'hsl(0, 84%, 60%)' },
    { name: 'High', value: data.vulnerabilities.filter(v => v.severity === 'high').length, color: 'hsl(0, 63%, 40%)' },
    { name: 'Medium', value: data.vulnerabilities.filter(v => v.severity === 'medium').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'Low', value: data.vulnerabilities.filter(v => v.severity === 'low').length, color: 'hsl(210, 20%, 60%)' },
  ].filter(d => d.value > 0);

  const summaryData = [
    { name: 'Passed', value: data.summary.passed_checks, fill: 'hsl(168, 76%, 36%)' },
    { name: 'Failed', value: data.summary.failed_checks, fill: 'hsl(0, 84%, 60%)' },
    { name: 'Warnings', value: data.summary.warnings, fill: 'hsl(38, 92%, 50%)' },
  ];

  const isDemo = data.scan_id === 'DEMO-001';

  return (
    <div className="container py-8 space-y-8">
      {/* Demo Banner */}
      {isDemo && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm">
              Viewing <strong>sample data</strong>. Run a scan to see real results.
            </span>
          </div>
          <Button asChild size="sm">
            <Link to="/scan">
              Start Scan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Risk Assessment Dashboard</h1>
          <p className="text-muted-foreground">
            Target: <span className="font-mono">{data.target}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Scan completed in {data.scan_duration.toFixed(1)}s</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score Card */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Overall Risk Score</CardTitle>
            <CardDescription>
              Based on {data.summary.total_checks} security checks
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <RiskGauge score={data.risk_score} level={data.risk_level} size="lg" />
            
            {/* Quick stats */}
            <div className="w-full grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-success">{data.summary.passed_checks}</p>
                <p className="text-xs text-muted-foreground">Passed</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-destructive">{data.summary.failed_checks}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-warning">{data.summary.warnings}</p>
                <p className="text-xs text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Open Ports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.open_ports.map((port) => (
                <Badge key={port} variant="secondary" className="font-mono">
                  {port}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">System Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Server className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium capitalize">
                  {data.system_type.replace('_', ' ')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Scan ID: {data.scan_id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Check Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summaryData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={60} />
                  <Tooltip />
                  <Bar dataKey="value" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vulnerabilities Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Detected Vulnerabilities
          </CardTitle>
          <CardDescription>
            {data.vulnerabilities.length} issues found during the assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VulnerabilityTable vulnerabilities={data.vulnerabilities} />
        </CardContent>
      </Card>

      {/* Report Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">Generate Detailed Report</p>
                <p className="text-sm text-muted-foreground">
                  AI-powered mitigation recommendations
                </p>
              </div>
            </div>
            <Link to="/report">
              <Button className="gap-2">
                <Download className="w-4 h-4" />
                View Full Report
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
