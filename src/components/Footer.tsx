import { Shield, AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8">
        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border mb-6">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Disclaimer</p>
            <p>
              This tool is designed for <strong>educational and assessment purposes only</strong>. 
              No exploitation, intrusive testing, or unauthorized access is performed. 
              All checks are non-aggressive and aligned with ethical cybersecurity practices.
            </p>
          </div>
        </div>

        {/* Footer content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Smart Port Cyber Risk Assessment Tool</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Aligned with Indian Navy & IMO Guidelines</span>
            <span className="hidden md:inline">•</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
