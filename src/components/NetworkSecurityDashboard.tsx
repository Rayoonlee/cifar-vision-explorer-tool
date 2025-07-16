
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NetworkScanner } from './NetworkScanner';
import { VulnerabilityScanner } from './VulnerabilityScanner';
import { TrafficAnalyzer } from './TrafficAnalyzer';
import { LogAnalyzer } from './LogAnalyzer';
import { SecurityReports } from './SecurityReports';
import { Shield, Network, Bug, Activity, FileText, AlertTriangle } from 'lucide-react';

export const NetworkSecurityDashboard = () => {
  const [activeScans, setActiveScans] = useState(0);
  const [totalVulnerabilities, setTotalVulnerabilities] = useState(0);
  const [criticalAlerts, setCriticalAlerts] = useState(0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Network Security Auditor</h1>
            <p className="text-muted-foreground">Comprehensive network security scanning and analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeScans}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVulnerabilities}</div>
              <p className="text-xs text-muted-foreground">Total found</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{criticalAlerts}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Status</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">Overall status</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="scanner" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="scanner">Network Scanner</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
            <TabsTrigger value="logs">Log Analysis</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="scanner">
            <NetworkScanner onScanUpdate={(count) => setActiveScans(count)} />
          </TabsContent>

          <TabsContent value="vulnerabilities">
            <VulnerabilityScanner onVulnerabilityUpdate={(count) => setTotalVulnerabilities(count)} />
          </TabsContent>

          <TabsContent value="traffic">
            <TrafficAnalyzer />
          </TabsContent>

          <TabsContent value="logs">
            <LogAnalyzer onAlertUpdate={(count) => setCriticalAlerts(count)} />
          </TabsContent>

          <TabsContent value="reports">
            <SecurityReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
