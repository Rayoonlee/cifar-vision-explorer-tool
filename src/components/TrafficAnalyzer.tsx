
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { NetworkPacket } from '@/types/network';
import { Activity, Play, Square, AlertTriangle, TrendingUp } from 'lucide-react';

export const TrafficAnalyzer: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [packets, setPackets] = useState<NetworkPacket[]>([]);
  const [stats, setStats] = useState({
    totalPackets: 0,
    suspiciousPackets: 0,
    topProtocol: 'TCP',
    averageSize: 0
  });

  const generateMockPacket = (): NetworkPacket => {
    const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH'];
    const ips = ['192.168.1.100', '192.168.1.1', '10.0.0.1', '8.8.8.8', '1.1.1.1', '172.16.0.1'];
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const sourceIp = ips[Math.floor(Math.random() * ips.length)];
    const destinationIp = ips[Math.floor(Math.random() * ips.length)];
    const suspicious = Math.random() < 0.1; // 10% chance of suspicious activity

    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      sourceIp,
      destinationIp,
      sourcePort: Math.floor(Math.random() * 65535),
      destinationPort: Math.floor(Math.random() * 65535),
      protocol,
      size: Math.floor(Math.random() * 1500) + 64,
      flags: suspicious ? ['SYN', 'FIN'] : ['ACK'],
      suspicious,
      anomalyScore: suspicious ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3
    };
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCapturing) {
      interval = setInterval(() => {
        const newPacket = generateMockPacket();
        setPackets(prev => [newPacket, ...prev.slice(0, 99)]); // Keep last 100 packets
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCapturing]);

  useEffect(() => {
    const suspiciousCount = packets.filter(p => p.suspicious).length;
    const averageSize = packets.length > 0 ? 
      packets.reduce((sum, p) => sum + p.size, 0) / packets.length : 0;
    
    const protocolCounts = packets.reduce((acc, p) => {
      acc[p.protocol] = (acc[p.protocol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topProtocol = Object.entries(protocolCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'TCP';

    setStats({
      totalPackets: packets.length,
      suspiciousPackets: suspiciousCount,
      topProtocol,
      averageSize: Math.round(averageSize)
    });
  }, [packets]);

  const startCapture = () => {
    setIsCapturing(true);
    setPackets([]);
  };

  const stopCapture = () => {
    setIsCapturing(false);
  };

  const getSuspiciousBadge = (suspicious: boolean, anomalyScore?: number) => {
    if (suspicious) {
      return <Badge variant="destructive">Suspicious</Badge>;
    }
    if (anomalyScore && anomalyScore > 0.7) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Anomaly</Badge>;
    }
    return <Badge variant="outline">Normal</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Traffic Capture Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Network Traffic Analyzer
          </CardTitle>
          <CardDescription>Capture and analyze network packets in real-time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={startCapture}
              disabled={isCapturing}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Capture
            </Button>
            <Button
              variant="outline"
              onClick={stopCapture}
              disabled={!isCapturing}
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop Capture
            </Button>
          </div>
          
          {isCapturing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Capturing network traffic...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Traffic Statistics */}
      {packets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Packets</p>
                  <p className="text-2xl font-bold">{stats.totalPackets}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Suspicious</p>
                  <p className="text-2xl font-bold text-red-600">{stats.suspiciousPackets}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Protocol</p>
                  <p className="text-2xl font-bold">{stats.topProtocol}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Size</p>
                  <p className="text-2xl font-bold">{stats.averageSize}B</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Packet List */}
      {packets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Live Packet Capture ({packets.length})</CardTitle>
            <CardDescription>Real-time network packet analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Anomaly Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packets.slice(0, 20).map((packet) => (
                  <TableRow key={packet.id} className={packet.suspicious ? 'bg-red-50' : ''}>
                    <TableCell className="font-mono text-sm">
                      {packet.timestamp.toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {packet.sourceIp}:{packet.sourcePort}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {packet.destinationIp}:{packet.destinationPort}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{packet.protocol}</Badge>
                    </TableCell>
                    <TableCell>{packet.size}B</TableCell>
                    <TableCell>
                      {getSuspiciousBadge(packet.suspicious, packet.anomalyScore)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{(packet.anomalyScore || 0).toFixed(2)}</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              (packet.anomalyScore || 0) > 0.7 ? 'bg-red-500' : 
                              (packet.anomalyScore || 0) > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(packet.anomalyScore || 0) * 100}%` }}
                          />
                        </div>
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
