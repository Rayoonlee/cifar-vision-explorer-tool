
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SecurityReport } from '@/types/network';
import { FileText, Download, Calendar, BarChart } from 'lucide-react';

export const SecurityReports: React.FC = () => {
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const mockReports: SecurityReport[] = [
    {
      id: 'RPT-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      type: 'vulnerability_scan',
      summary: 'Weekly vulnerability assessment completed',
      findings: { critical: 2, high: 5, medium: 8, low: 12 },
      hosts: [],
      vulnerabilities: [],
      recommendations: [
        'Update SSH service on 192.168.1.100',
        'Apply security patches to web server',
        'Disable unused network services'
      ]
    },
    {
      id: 'RPT-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      type: 'network_scan',
      summary: 'Network discovery and port scan report',
      findings: { critical: 0, high: 2, medium: 4, low: 6 },
      hosts: [],
      vulnerabilities: [],
      recommendations: [
        'Close unnecessary open ports',
        'Implement network segmentation',
        'Monitor unusual traffic patterns'
      ]
    },
    {
      id: 'RPT-003',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
      type: 'traffic_analysis',
      summary: 'Monthly traffic analysis and anomaly detection',
      findings: { critical: 1, high: 3, medium: 7, low: 15 },
      hosts: [],
      vulnerabilities: [],
      recommendations: [
        'Investigate suspicious traffic patterns',
        'Update firewall rules',
        'Enhance monitoring coverage'
      ]
    }
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newReport: SecurityReport = {
      id: `RPT-${String(reports.length + 4).padStart(3, '0')}`,
      timestamp: new Date(),
      type: 'compliance',
      summary: 'Security compliance assessment report',
      findings: { critical: 1, high: 2, medium: 5, low: 8 },
      hosts: [],
      vulnerabilities: [],
      recommendations: [
        'Address critical security findings',
        'Update security policies',
        'Conduct security awareness training'
      ]
    };
    
    setReports([newReport, ...reports]);
    setIsGenerating(false);
  };

  React.useEffect(() => {
    setReports(mockReports);
  }, []);

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case 'vulnerability_scan':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Vulnerability</Badge>;
      case 'network_scan':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Network</Badge>;
      case 'traffic_analysis':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Traffic</Badge>;
      case 'log_analysis':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Logs</Badge>;
      case 'compliance':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Compliance</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  const downloadReport = (reportId: string) => {
    // Simulate report download
    console.log(`Downloading report ${reportId}`);
    // In a real implementation, this would generate and download a PDF/CSV file
  };

  const getTotalFindings = (findings: SecurityReport['findings']) => {
    return findings.critical + findings.high + findings.medium + findings.low;
  };

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Security Report Generator
          </CardTitle>
          <CardDescription>Generate comprehensive security assessment reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={generateReport}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            {isGenerating ? 'Generating Report...' : 'Generate New Report'}
          </Button>

          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Compiling security data and generating report...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Statistics */}
      {reports.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">
                  {reports.reduce((sum, r) => sum + r.findings.critical, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reports.reduce((sum, r) => sum + r.findings.high, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Findings</p>
                <p className="text-2xl font-bold">
                  {reports.reduce((sum, r) => sum + getTotalFindings(r.findings), 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports List */}
      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Security Reports ({reports.length})</CardTitle>
            <CardDescription>Generated security assessment reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Findings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono">{report.id}</TableCell>
                    <TableCell>{getReportTypeBadge(report.type)}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {report.timestamp.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">{report.summary}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {report.findings.critical > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {report.findings.critical} Critical
                          </Badge>
                        )}
                        {report.findings.high > 0 && (
                          <Badge variant="destructive" className="bg-orange-100 text-orange-800 text-xs">
                            {report.findings.high} High
                          </Badge>
                        )}
                        {report.findings.medium > 0 && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                            {report.findings.medium} Medium
                          </Badge>
                        )}
                        {report.findings.low > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {report.findings.low} Low
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report.id)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Report Details */}
      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Report Recommendations</CardTitle>
            <CardDescription>Key recommendations from the most recent security assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {reports[0].recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
