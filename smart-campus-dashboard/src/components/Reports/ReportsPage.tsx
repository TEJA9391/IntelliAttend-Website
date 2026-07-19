import { motion } from 'framer-motion';
import ReportKPICard from './ReportKPICard';
import AttendanceTrendChart from './AttendanceTrendChart';
import ReportDistribution from './ReportDistribution';
import DepartmentPerformance from './DepartmentPerformance';
import ReportTimeline from './ReportTimeline';
import ExportStats from './ExportStats';
import ReportHistory from './ReportHistory';
import {
  reportKPIData, monthlyTrendData, reportDistributionData,
  departmentPerformanceData, reportTimelineData, exportStatsData,
  reportHistoryData,
} from '../../data/reportsData';

export default function ReportsPage() {
  return (
    <div className="p-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-text-primary">Reports & Analytics</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          Comprehensive attendance analytics, department insights, and report management.
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:xl:grid-cols-4 gap-5 mb-6">
        {reportKPIData.map((data, i) => (
          <ReportKPICard key={data.title} data={data} index={i} />
        ))}
      </div>

      {/* Trend Chart + Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="xl:col-span-2">
          <AttendanceTrendChart data={monthlyTrendData} />
        </div>
        <div>
          <ReportDistribution data={reportDistributionData} />
        </div>
      </div>

      {/* Department Performance */}
      <div className="mb-6">
        <DepartmentPerformance data={departmentPerformanceData} />
      </div>

      {/* Timeline + Export Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <ReportTimeline data={reportTimelineData} />
        <ExportStats data={exportStatsData} />
      </div>

      {/* Report History Table */}
      <ReportHistory data={reportHistoryData} />
    </div>
  );
}
