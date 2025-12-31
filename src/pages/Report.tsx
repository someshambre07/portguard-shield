import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScan } from '@/context/ScanContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateMitigationReport, type ScanResult } from '@/lib/mockApi';
import { generatePdfReport } from '@/lib/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Printer,
  Loader2
} from 'lucide-react';

// Demo data
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
      category: 'Remote Access & Management',
    },
    {
      id: 'V002',
      name: 'Missing HSTS Header',
      description: 'HTTP Strict Transport Security header not configured.',
      severity: 'medium',
      recommendation: 'Enable HSTS header.',
      category: 'Web & Application Security',
    },
    {
      id: 'V003',
      name: 'SCADA Port Exposed',
      description: 'Industrial control system port 502 accessible.',
      severity: 'critical',
      port: 502,
      service: 'Modbus',
      recommendation: 'Implement network segmentation.',
      category: 'IoT/OT Maritime Systems',
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

export default function Report() {
  const { scanResult } = useScan();
  const { toast } = useToast();
  const [data, setData] = useState<ScanResult | null>(null);
  const [report, setReport] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const result = scanResult || generateDemoData();
    setData(result);
    setReport(generateMitigationReport(result));
  }, [scanResult]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!data) return;
    setIsDownloading(true);
    try {
      await generatePdfReport(data);
      toast({
        title: 'Download Complete',
        description: 'Report has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to generate PDF report.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!data) {
    return (
      <div className="container py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  const isDemo = data.scan_id === 'DEMO-001';

  return (
    <div className="container py-8 max-w-4xl">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button className="gap-2" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PDF
          </Button>
        </div>
      </div>

      {/* Report Header */}
      <div className="print:block">
        <Card className="mb-8">
          <CardHeader className="text-center border-b">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-primary" />
              <div>
                <CardTitle className="text-2xl">Cyber Risk Assessment Report</CardTitle>
                <CardDescription>Smart Port Security Analysis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Target</p>
                <p className="font-mono font-medium">{data.target}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Scan ID</p>
                <p className="font-mono font-medium">{data.scan_id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(data.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Risk Level</p>
                <Badge
                  className={
                    data.risk_level === 'high'
                      ? 'bg-destructive'
                      : data.risk_level === 'medium'
                      ? 'bg-warning'
                      : 'bg-success'
                  }
                >
                  {data.risk_level.toUpperCase()} ({data.risk_score}/100)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Banner */}
        {isDemo && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 mb-8 print:hidden">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm">
              This is a <strong>sample report</strong>. Run a real scan for actual results.
            </span>
          </div>
        )}

        {/* AI Generated Report */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              AI-Generated Mitigation Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {report.split('\n').map((line, index) => {
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-xl font-bold mt-6 mb-3">
                      {line.replace('## ', '')}
                    </h2>
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-lg font-semibold mt-4 mb-2">
                      {line.replace('### ', '')}
                    </h3>
                  );
                }
                if (line.startsWith('- ')) {
                  return (
                    <li key={index} className="ml-4">
                      {line.replace('- ', '').split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </li>
                  );
                }
                if (line.startsWith('⚠️')) {
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive my-4"
                    >
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{line.replace('⚠️ ', '')}</span>
                    </div>
                  );
                }
                if (line.startsWith('---')) {
                  return <hr key={index} className="my-6" />;
                }
                if (line.startsWith('*Disclaimer')) {
                  return (
                    <p key={index} className="text-xs text-muted-foreground italic mt-6">
                      {line.replace(/\*/g, '')}
                    </p>
                  );
                }
                if (line.trim()) {
                  return (
                    <p key={index} className="my-2">
                      {line.split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.vulnerabilities.map((vuln, index) => (
                <div
                  key={vuln.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted"
                >
                  <div className="shrink-0 mt-1">
                    {vuln.severity === 'critical' || vuln.severity === 'high' ? (
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-warning" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{vuln.name}</span>
                      <Badge
                        variant="outline"
                        className={
                          vuln.severity === 'critical'
                            ? 'border-destructive text-destructive'
                            : vuln.severity === 'high'
                            ? 'border-destructive/70 text-destructive'
                            : 'border-warning text-warning'
                        }
                      >
                        {vuln.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {vuln.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground print:mt-16">
          <p>
            Generated by Smart Port Cyber Risk Assessment Tool
          </p>
          <p className="flex items-center justify-center gap-2 mt-2">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
