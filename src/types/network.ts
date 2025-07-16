
export interface NetworkHost {
  ip: string;
  hostname?: string;
  status: 'up' | 'down' | 'unknown';
  responseTime?: number;
  lastSeen: Date;
  openPorts: Port[];
}

export interface Port {
  number: number;
  protocol: 'tcp' | 'udp';
  state: 'open' | 'closed' | 'filtered';
  service?: string;
  version?: string;
  banner?: string;
}

export interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  cve?: string;
  affectedService?: string;
  solution?: string;
  host: string;
  port?: number;
}

export interface NetworkPacket {
  id: string;
  timestamp: Date;
  sourceIp: string;
  destinationIp: string;
  sourcePort?: number;
  destinationPort?: number;
  protocol: string;
  size: number;
  flags?: string[];
  suspicious: boolean;
  anomalyScore?: number;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  source: string;
  level: 'emergency' | 'alert' | 'critical' | 'error' | 'warning' | 'notice' | 'info' | 'debug';
  message: string;
  category: 'firewall' | 'router' | 'ids' | 'ips' | 'authentication' | 'network';
  sourceIp?: string;
  destinationIp?: string;
  action?: 'allow' | 'deny' | 'drop' | 'reject';
}

export interface ThreatIntelligence {
  ip?: string;
  domain?: string;
  type: 'malware' | 'phishing' | 'botnet' | 'spam' | 'suspicious';
  confidence: number;
  source: string;
  firstSeen: Date;
  lastSeen: Date;
  description?: string;
}

export interface SecurityReport {
  id: string;
  timestamp: Date;
  type: 'network_scan' | 'vulnerability_scan' | 'traffic_analysis' | 'log_analysis' | 'compliance';
  summary: string;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  hosts: NetworkHost[];
  vulnerabilities: Vulnerability[];
  recommendations: string[];
}

export interface ScanConfig {
  targetRange: string;
  ports?: string;
  timeout: number;
  aggressive: boolean;
  serviceDetection: boolean;
  osDetection: boolean;
}
