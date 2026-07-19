export interface ReportKPIData {
  title: string;
  value: number;
  suffix?: string;
  change: number;
  sparkline: number[];
  icon: string;
  color: string;
  gradient: string;
}

export interface MonthlyTrendData {
  month: string;
  attendance: number;
  reports: number;
  accuracy: number;
}

export interface ReportDistributionData {
  name: string;
  value: number;
  color: string;
}

export interface DepartmentPerformanceData {
  name: string;
  percentage: number;
  color: string;
  reports: number;
  trend: number;
}

export interface ReportTimelineEntry {
  id: number;
  title: string;
  type: 'attendance' | 'analytics' | 'defaulter' | 'eligibility';
  generatedBy: string;
  time: string;
  status: 'completed' | 'processing' | 'scheduled';
  avatar: string;
}

export interface ExportStatsData {
  label: string;
  value: number;
  color: string;
  icon: string;
}

export interface ReportHistoryEntry {
  id: number;
  reportName: string;
  type: 'attendance' | 'analytics' | 'defaulter' | 'eligibility' | 'custom';
  generatedBy: string;
  department: string;
  date: string;
  status: 'completed' | 'processing' | 'failed' | 'scheduled';
  records: number;
}
