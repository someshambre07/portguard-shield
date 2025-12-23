import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanProgress } from '@/components/ScanProgress';
import { useScan } from '@/context/ScanContext';
import { performScan, type SystemType } from '@/lib/mockApi';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle, Server, Ship, Package } from 'lucide-react';

const systemTypes = [
  {
    value: 'smart_port',
    label: 'Smart Port Infrastructure',
    icon: Server,
    description: 'Port automation, IoT sensors, SCADA systems',
  },
  {
    value: 'ship_network',
    label: 'Ship IT Network',
    icon: Ship,
    description: 'Navigation systems, AIS, satellite communications',
  },
  {
    value: 'logistics_system',
    label: 'Logistics / Port Management',
    icon: Package,
    description: 'Cargo tracking, database systems, APIs',
  },
];

export default function Scan() {
  const navigate = useNavigate();
  const { setScanResult, setIsScanning } = useScan();
  const { toast } = useToast();
  
  const [target, setTarget] = useState('');
  const [systemType, setSystemType] = useState<SystemType | ''>('');
  const [scanning, setScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState('');
  const [scanPercent, setScanPercent] = useState(0);

  const validateInput = (): boolean => {
    if (!target.trim()) {
      toast({
        title: 'Target Required',
        description: 'Please enter an IP address or domain.',
        variant: 'destructive',
      });
      return false;
    }
    
    if (!systemType) {
      toast({
        title: 'System Type Required',
        description: 'Please select a system type to scan.',
        variant: 'destructive',
      });
      return false;
    }
    
    // Basic IP/domain validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    
    if (!ipRegex.test(target) && !domainRegex.test(target)) {
      toast({
        title: 'Invalid Target',
        description: 'Please enter a valid IP address or domain name.',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  };

  const handleScan = async () => {
    if (!validateInput()) return;
    
    setScanning(true);
    setIsScanning(true);
    
    try {
      const result = await performScan(
        target,
        systemType as SystemType,
        (phase, percent) => {
          setScanPhase(phase);
          setScanPercent(percent);
        }
      );
      
      setScanResult(result);
      
      toast({
        title: 'Scan Complete',
        description: `Risk level: ${result.risk_level.toUpperCase()} (Score: ${result.risk_score}/100)`,
      });
      
      // Brief delay before navigation
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      toast({
        title: 'Scan Failed',
        description: 'An error occurred during the scan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  if (scanning) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-lg space-y-8 p-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Scanning {target}</h1>
            <p className="text-muted-foreground">
              Performing non-intrusive security assessment...
            </p>
          </div>
          <ScanProgress
            phase={scanPhase}
            percent={scanPercent}
            isComplete={scanPercent >= 100}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Cyber Risk Scan</h1>
          <p className="text-muted-foreground">
            Enter your target system details to begin a non-intrusive security assessment.
          </p>
        </div>

        {/* Disclaimer Banner */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-warning">Educational Use Only</p>
            <p className="text-muted-foreground">
              This tool performs safe, non-intrusive checks only. No exploitation or 
              aggressive scanning will be performed.
            </p>
          </div>
        </div>

        {/* Scan Form */}
        <Card>
          <CardHeader>
            <CardTitle>Target Configuration</CardTitle>
            <CardDescription>
              Specify the target and system type for assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Target Input */}
            <div className="space-y-2">
              <Label htmlFor="target">Target IP or Domain</Label>
              <Input
                id="target"
                placeholder="e.g., 192.168.1.1 or example.port.gov.in"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the IP address or domain of the system to assess
              </p>
            </div>

            {/* System Type Selection */}
            <div className="space-y-2">
              <Label>System Type</Label>
              <Select
                value={systemType}
                onValueChange={(value) => setSystemType(value as SystemType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select system type..." />
                </SelectTrigger>
                <SelectContent>
                  {systemTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Selected type description */}
              {systemType && (
                <p className="text-xs text-muted-foreground">
                  {systemTypes.find((t) => t.value === systemType)?.description}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleScan}
              disabled={!target || !systemType}
            >
              <Shield className="w-4 h-4 mr-2" />
              Initiate Security Scan
            </Button>
          </CardContent>
        </Card>

        {/* What We Check */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What We Check</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              {[
                'Open port discovery (limited)',
                'Insecure services detection',
                'HTTP security headers',
                'SSL/TLS configuration',
                'Basic misconfigurations',
                'Protocol security',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
