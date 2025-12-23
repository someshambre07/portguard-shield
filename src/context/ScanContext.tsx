import { createContext, useContext, useState, ReactNode } from 'react';
import type { ScanResult } from '@/lib/mockApi';

interface ScanContextType {
  scanResult: ScanResult | null;
  setScanResult: (result: ScanResult | null) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  return (
    <ScanContext.Provider
      value={{
        scanResult,
        setScanResult,
        isScanning,
        setIsScanning,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
}
