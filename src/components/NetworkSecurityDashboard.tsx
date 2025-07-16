
import { useState } from "react";
import { Shield, Search, Activity, FileText, BarChart3, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkScanner } from "./NetworkScanner";
import { VulnerabilityScanner } from "./VulnerabilityScanner";
import { TrafficAnalyzer } from "./TrafficAnalyzer";
import { LogAnalyzer } from "./LogAnalyzer";
import { SecurityReports } from "./SecurityReports";
import { CNNTraining } from "./CNNTraining";

export function NetworkSecurityDashboard() {
  const [activeTab, setActiveTab] = useState("scanner");
  const [activeScans, setActiveScans] = useState(0);
  const [vulnerabilityCount, setVulnerabilityCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);

  const handleScanUpdate = (count: number) => {
    setActiveScans(count);
  };

  const handleVulnerabilityUpdate = (count: number) => {
    setVulnerabilityCount(count);
  };

  const handleAlertUpdate = (count: number) => {
    setAlertCount(count);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Security Analytics Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive network security auditing, vulnerability assessment, and CIFAR-10 CNN training platform
        </p>
      </div>

      {/* Quick Stats */}
      {(activeScans > 0 || vulnerabilityCount > 0 || alertCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Scans</p>
                  <p className="text-2xl font-bold">{activeScans}</p>
                </div>
                <Search className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vulnerabilities</p>
                  <p className="text-2xl font-bold text-red-600">{vulnerabilityCount}</p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Alerts</p>
                  <p className="text-2xl font-bold text-orange-600">{alertCount}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Network Scanner
          </TabsTrigger>
          <TabsTrigger value="vulnerability" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Vulnerability Scanner
          </TabsTrigger>
          <TabsTrigger value="traffic" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Traffic Analyzer
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Log Analyzer
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Security Reports
          </TabsTrigger>
          <TabsTrigger value="cnn" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            CNN Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner">
          <NetworkScanner onScanUpdate={handleScanUpdate} />
        </TabsContent>

        <TabsContent value="vulnerability">
          <VulnerabilityScanner onVulnerabilityUpdate={handleVulnerabilityUpdate} />
        </TabsContent>

        <TabsContent value="traffic">
          <TrafficAnalyzer />
        </TabsContent>

        <TabsContent value="logs">
          <LogAnalyzer onAlertUpdate={handleAlertUpdate} />
        </TabsContent>

        <TabsContent value="reports">
          <SecurityReports />
        </TabsContent>

        <TabsContent value="cnn">
          <CNNTraining />
        </TabsContent>
      </Tabs>
    </div>
  );
}
