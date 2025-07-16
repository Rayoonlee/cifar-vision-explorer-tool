
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { NetworkHost, Port, ScanConfig } from '@/types/network';
import { Play, Square, RefreshCw, Network } from 'lucide-react';

interface NetworkScannerProps {
  onScanUpdate: (activeScans: number) => void;
}

export const NetworkScanner: React.FC<NetworkScannerProps> = ({ onScanUpdate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hosts, setHosts] = useState<NetworkHost[]>([]);
  const [config, setConfig] = useState<ScanConfig>({
    targetRange: '192.168.1.0/24',
    ports: '22,80,443,3389',
    timeout: 1000,
    aggressive: false,
    serviceDetection: true,
    osDetection: false
  });

  const mockHosts: NetworkHost[] = [
    {
      ip: '192.168.1.1',
      hostname: 'router.local',
      status: 'up',
      responseTime: 2,
      lastSeen: new Date(),
      openPorts: [
        { number: 80, protocol: 'tcp', state: 'open', service: 'http' },
        { number: 443, protocol: 'tcp', state: 'open', service: 'https' }
      ]
    },
    {
      ip: '192.168.1.100',
      hostname: 'workstation-01',
      status: 'up',
      responseTime: 5,
      lastSeen: new Date(),
      openPorts: [
        { number: 22, protocol: 'tcp', state: 'open', service: 'ssh' },
        { number: 3389, protocol: 'tcp', state: 'open', service: 'rdp' }
      ]
    },
    {
      ip: '192.168.1.150',
      status: 'up',
      responseTime: 12,
      lastSeen: new Date(),
      openPorts: [
        { number: 80, protocol: 'tcp', state: 'open', service: 'http' }
      ]
    }
  ];

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    onScanUpdate(1);

    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
    }

    setHosts(mockHosts);
    setIsScanning(false);
    onScanUpdate(0);
  };

  const stopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    onScanUpdate(0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'up':
        return <Badge variant="default" className="bg-green-100 text-green-800">Up</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Scan Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Scanner Configuration
          </CardTitle>
          <CardDescription>Configure network scanning parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-range">Target Range</Label>
              <Input
                id="target-range"
                value={config.targetRange}
                onChange={(e) => setConfig({ ...config, targetRange: e.target.value })}
                placeholder="192.168.1.0/24"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ports">Ports to Scan</Label>
              <Input
                id="ports"
                value={config.ports}
                onChange={(e) => setConfig({ ...config, ports: e.target.value })}
                placeholder="22,80,443,3389"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={startScan}
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              {isScanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </Button>
            {isScanning && (
              <Button variant="outline" onClick={stopScan} className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Stop Scan
              </Button>
            )}
          </div>

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scanning progress</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Results */}
      {hosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Discovered Hosts ({hosts.length})</CardTitle>
            <CardDescription>Network hosts and their open ports</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Hostname</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Open Ports</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hosts.map((host) => (
                  <TableRow key={host.ip}>
                    <TableCell className="font-mono">{host.ip}</TableCell>
                    <TableCell>{host.hostname || '-'}</TableCell>
                    <TableCell>{getStatusBadge(host.status)}</TableCell>
                    <TableCell>{host.responseTime ? `${host.responseTime}ms` : '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {host.openPorts.map((port) => (
                          <Badge key={`${port.number}-${port.protocol}`} variant="outline" className="text-xs">
                            {port.number}/{port.protocol}
                            {port.service && ` (${port.service})`}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
