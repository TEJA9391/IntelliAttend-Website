import type {
  ReportKPIData, MonthlyTrendData, ReportDistributionData,
  DepartmentPerformanceData, ReportTimelineEntry, ExportStatsData,
  ReportHistoryEntry,
} from '../types/reports';

export const reportKPIData: ReportKPIData[] = [
  {
    title: 'Total Reports',
    value: 1247,
    change: 12.5,
    sparkline: [680, 750, 820, 910, 1020, 1150, 1247],
    icon: 'file-text',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Avg Attendance',
    value: 84.7,
    suffix: '%',
    change: 2.3,
    sparkline: [78.5, 79.8, 80.9, 82.1, 83.0, 83.9, 84.7],
    icon: 'percent',
    color: '#22C55E',
    gradient: 'from-green-500 to-green-600',
  },
  {
    title: 'Most Active Dept',
    value: 89,
    suffix: '%',
    change: 4.1,
    sparkline: [82, 83, 85, 86, 87, 88, 89],
    icon: 'building-2',
    color: '#A855F7',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Data Accuracy',
    value: 99.2,
    suffix: '%',
    change: 0.3,
    sparkline: [98.5, 98.7, 98.8, 99.0, 99.0, 99.1, 99.2],
    icon: 'shield-check',
    color: '#14D8C4',
    gradient: 'from-teal-400 to-teal-500',
  },
];

export const monthlyTrendData: MonthlyTrendData[] = [
  { month: 'Jan', attendance: 78.5, reports: 145, accuracy: 98.2 },
  { month: 'Feb', attendance: 79.8, reports: 162, accuracy: 98.5 },
  { month: 'Mar', attendance: 80.9, reports: 178, accuracy: 98.7 },
  { month: 'Apr', attendance: 82.1, reports: 195, accuracy: 99.0 },
  { month: 'May', attendance: 83.0, reports: 210, accuracy: 99.0 },
  { month: 'Jun', attendance: 83.9, reports: 188, accuracy: 99.1 },
  { month: 'Jul', attendance: 84.7, reports: 169, accuracy: 99.2 },
];

export const reportDistributionData: ReportDistributionData[] = [
  { name: 'Attendance', value: 42, color: '#22C55E' },
  { name: 'Analytics', value: 25, color: '#3B82F6' },
  { name: 'Defaulter', value: 18, color: '#EF4444' },
  { name: 'Eligibility', value: 15, color: '#F97316' },
];

export const departmentPerformanceData: DepartmentPerformanceData[] = [
  { name: 'Computer Science', percentage: 89, color: '#3B82F6', reports: 312, trend: 5.2 },
  { name: 'AI & Machine Learning', percentage: 86, color: '#14D8C4', reports: 248, trend: 3.8 },
  { name: 'Electronics & Communication', percentage: 82, color: '#A855F7', reports: 198, trend: 1.5 },
  { name: 'Electrical & Electronics', percentage: 78, color: '#F97316', reports: 176, trend: -0.8 },
  { name: 'MBA', percentage: 91, color: '#22C55E', reports: 142, trend: 6.1 },
];

export const reportTimelineData: ReportTimelineEntry[] = [
  { id: 1, title: 'Weekly Attendance Summary', type: 'attendance', generatedBy: 'System', time: '2 min ago', status: 'completed', avatar: 'SY' },
  { id: 2, title: 'CS Dept Analytics', type: 'analytics', generatedBy: 'Dr. Sharma', time: '15 min ago', status: 'completed', avatar: 'DS' },
  { id: 3, title: 'Defaulter List - June', type: 'defaulter', generatedBy: 'Prof. Kumar', time: '1 hr ago', status: 'processing', avatar: 'PK' },
  { id: 4, title: 'Eligibility Report Q2', type: 'eligibility', generatedBy: 'System', time: '3 hr ago', status: 'completed', avatar: 'SY' },
  { id: 5, title: 'ML Dept Monthly Report', type: 'analytics', generatedBy: 'Dr. Patel', time: '5 hr ago', status: 'scheduled', avatar: 'DP' },
];

export const exportStatsData: ExportStatsData[] = [
  { label: 'PDF Exports', value: 486, color: '#EF4444', icon: 'file-type' },
  { label: 'CSV Downloads', value: 312, color: '#22C55E', icon: 'table-2' },
  { label: 'Excel Reports', value: 198, color: '#3B82F6', icon: 'sheet' },
  { label: 'Shared Reports', value: 251, color: '#A855F7', icon: 'share-2' },
];

export const reportHistoryData: ReportHistoryEntry[] = [
  { id: 1, reportName: 'Weekly Attendance Summary', type: 'attendance', generatedBy: 'System Auto', department: 'All Departments', date: 'Jul 17, 2026', status: 'completed', records: 2847 },
  { id: 2, reportName: 'CS Department Analytics', type: 'analytics', generatedBy: 'Dr. Priya Sharma', department: 'Computer Science', date: 'Jul 17, 2026', status: 'completed', records: 620 },
  { id: 3, reportName: 'June Defaulter List', type: 'defaulter', generatedBy: 'Prof. Rajesh Kumar', department: 'AI & ML', date: 'Jul 16, 2026', status: 'processing', records: 480 },
  { id: 4, reportName: 'Q2 Eligibility Report', type: 'eligibility', generatedBy: 'System Auto', department: 'All Departments', date: 'Jul 16, 2026', status: 'completed', records: 2847 },
  { id: 5, reportName: 'ECE Attendance Breakdown', type: 'attendance', generatedBy: 'Dr. Meera Patel', department: 'ECE', date: 'Jul 15, 2026', status: 'completed', records: 510 },
  { id: 6, reportName: 'Monthly Faculty Review', type: 'analytics', generatedBy: 'Admin Office', department: 'All Departments', date: 'Jul 15, 2026', status: 'failed', records: 2847 },
  { id: 7, reportName: 'MBA Performance Report', type: 'analytics', generatedBy: 'System Auto', department: 'MBA', date: 'Jul 14, 2026', status: 'completed', records: 350 },
  { id: 8, reportName: 'EEE Defaulter Analysis', type: 'defaulter', generatedBy: 'Prof. Anil Reddy', department: 'EEE', date: 'Jul 14, 2026', status: 'scheduled', records: 440 },
];
