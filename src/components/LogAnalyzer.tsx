
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LogEntry } from '@/types/network';
import { FileText, Search, AlertTriangle, Shield, Router } from 'lucide-react';

interface LogAnalyzerProps {
  onAlertUpdate: (alertCount: number) => void;
}

export const LogAnalyzer: React.FC<LogAnalyzerProps> = ({ onAlertUpdate }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      source: 'firewall-01',
      level: 'critical',
      message: 'Multiple failed login attempts from 192.168.1.200',
      category: 'authentication',
      sourceIp: '192.168.1.200',
      action: 'deny'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      source: 'ids-sensor-01',
      level: 'alert',
      message: 'Possible SQL injection attempt detected',
      category: 'ids',
      sourceIp: '203.0.113.45',
      destinationIp: '192.168.1.150',
      action: 'drop'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      source: 'router-core',
      level: 'warning',
      message: 'High bandwidth utilization detected on interface eth0',
      category: 'network',
      action: 'allow'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      source: 'firewall-01',
      level: 'error',
      message: 'Port scan detected from external IP',
      category: 'firewall',
      sourceIp: '198.51.100.25',
      action: 'deny'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      source: 'ips-01',
      level: 'critical',
      message: 'Malware signature detected in network traffic',
      category: 'ips',
      sourceIp: '192.168.1.175',
      action: 'drop'
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      source: 'auth-server',
      level: 'info',
      message: 'User admin successfully logged in',
      category: 'authentication',
      sourceIp: '192.168.1.100',
      action: 'allow'
    }
  ];

  useEffect(() => {
    const criticalAlerts = logs.filter(log => 
      log.level === 'critical' || log.level === 'alert' || log.level === 'error'
    ).length;
    onAlertUpdate(criticalAlerts);
  }, [logs, onAlertUpdate]);

  useEffect(() => {
    const filtered = logs.filter(log =>
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sourceIp?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  }, [logs, searchTerm]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate log analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLogs(mockLogs);
    setIsAnalyzing(false);
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'emergency':
      case 'alert':
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'error':
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800">Error</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Info</Badge>;
      case 'debug':
        return <Badge variant="outline">Debug</Badge>;
      default:
        return <Badge variant="outline">Notice</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'firewall':
        return <Shield className="h-4 w-4" />;
      case 'router':
        return <Router className="h-4 w-4" />;
      case 'ids':
      case 'ips':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const logStats = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Log Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Security Log Analyzer
          </CardTitle>
          <CardDescription>Analyze network device logs for security events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={startAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {isAnalyzing ? 'Analyzing Logs...' : 'Start Log Analysis'}
          </Button>

          {logs.length > 0 && (
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Statistics */}
      {logs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{logStats.critical || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-orange-600">{logStats.error || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{logStats.warning || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Info</p>
                <p className="text-2xl font-bold text-blue-600">{logStats.info || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Log Entries */}
      {filteredLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Security Log Entries ({filteredLogs.length})</CardTitle>
            <CardDescription>Network security events and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Source IP</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className={
                    log.level === 'critical' || log.level === 'alert' ? 'bg-red-50' :
                    log.level === 'error' ? 'bg-orange-50' :
                    log.level === 'warning' ? 'bg-yellow-50' : ''
                  }>
                    <TableCell className="font-mono text-sm">
                      {log.timestamp.toLocaleString()}
                    </TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell>{getLevelBadge(log.level)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(log.category)}
                        <span className="capitalize">{log.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">{log.message}</TableCell>
                    <TableCell className="font-mono">{log.sourceIp || '-'}</TableCell>
                    <TableCell>
                      {log.action && (
                        <Badge 
                          variant={log.action === 'allow' ? 'outline' : 'destructive'}
                          className={log.action === 'allow' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {log.action}
                        </Badge>
                      )}
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
