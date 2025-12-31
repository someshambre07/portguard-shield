import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  History, 
  Download, 
  ArrowLeft, 
  Shield, 
  Loader2,
  FileText,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { generatePdfReport } from '@/lib/pdfGenerator';

interface ScanReport {
  id: string;
  target: string;
  system_type: string;
  risk_score: number;
  risk_level: string;
  vulnerabilities: unknown;
  scan_data: unknown;
  created_at: string;
}

const systemTypeLabels: Record<string, string> = {
  smart_port: 'Smart Port Infrastructure',
  ship_network: 'Ship IT Network',
  logistics_system: 'Logistics / Port Management',
};

export default function ScanHistory() {
  const [reports, setReports] = useState<ScanReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('scan_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load scan history.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownload = async (report: ScanReport) => {
    setDownloadingId(report.id);
    
    try {
      // Reconstruct scan result from stored data
      const scanResult = {
        scan_id: report.id,
        target: report.target,
        system_type: report.system_type as any,
        timestamp: report.created_at,
        risk_score: report.risk_score,
        risk_level: report.risk_level as any,
        vulnerabilities: (Array.isArray(report.vulnerabilities) ? report.vulnerabilities : []) as any[],
        open_ports: ((report.scan_data as any)?.open_ports || []) as number[],
        scan_duration: ((report.scan_data as any)?.scan_duration || 0) as number,
      summary: ((report.scan_data as any)?.summary || {
        total_checks: 70,
        passed_checks: 0,
        failed_checks: 0,
        warnings: 0,
      }) as any,
      };

      await generatePdfReport(scanResult);
      
      toast({
        title: 'Download Complete',
        description: 'Report has been downloaded successfully.',
      });
    } catch (error: any) {
      console.error('Error downloading report:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to generate PDF report.',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-destructive/80 text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <Button variant="outline" onClick={fetchReports} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Title Card */}
      <Card className="mb-8">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center gap-3 mb-2">
            <History className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Scan History</CardTitle>
              <CardDescription>Previous Security Assessment Reports</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary">Admin Access Only</p>
              <p className="text-muted-foreground">
                This section contains classified security assessment data. 
                Access is restricted to authorized personnel.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Assessment Reports
          </CardTitle>
          <CardDescription>
            {reports.length} report{reports.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <p className="font-medium">No Reports Found</p>
                <p className="text-sm text-muted-foreground">
                  No security assessments have been performed yet.
                </p>
              </div>
              <Link to="/scan">
                <Button>
                  <Shield className="w-4 h-4 mr-2" />
                  Start New Scan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>System Type</TableHead>
                    <TableHead className="text-center">Risk Score</TableHead>
                    <TableHead className="text-center">Risk Level</TableHead>
                    <TableHead className="text-center">Vulnerabilities</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(report.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {report.target}
                      </TableCell>
                      <TableCell>
                        {systemTypeLabels[report.system_type] || report.system_type}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {report.risk_score}/100
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getRiskBadgeColor(report.risk_level)}>
                          {report.risk_level.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {Array.isArray(report.vulnerabilities) ? report.vulnerabilities.length : 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(report)}
                          disabled={downloadingId === report.id}
                        >
                          {downloadingId === report.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              PDF
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
