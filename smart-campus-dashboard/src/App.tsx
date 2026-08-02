import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import KPICard from './components/KPICards/KPICard';
import WeeklyChart from './components/Charts/WeeklyChart';
import DistributionChart from './components/Charts/DistributionChart';
import DepartmentStats from './components/DepartmentStats/DepartmentStats';
import ClassesTimeline from './components/ClassesTimeline/ClassesTimeline';
import FacultyPerformance from './components/FacultyPerformance/FacultyPerformance';
import RecentActivity from './components/RecentActivity/RecentActivity';
import ReportsPage from './components/Reports/ReportsPage';
import {
  kpiData, weeklyData, attendanceDistribution, departmentData,
  todayClasses, facultyPerformance, recentActivity, navItems,
} from './data/dashboardData';

function DashboardPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          Welcome back! Here&apos;s what&apos;s happening on campus today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:xl:grid-cols-4 gap-5 mb-6">
        {kpiData.map((data, i) => (
          <KPICard key={data.title} data={data} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="xl:col-span-2">
          <WeeklyChart data={weeklyData} />
        </div>
        <div>
          <DistributionChart data={attendanceDistribution} />
        </div>
      </div>

      <div className="mb-6">
        <DepartmentStats data={departmentData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-5 mb-6">
        <ClassesTimeline data={todayClasses} />
        <FacultyPerformance data={facultyPerformance} />
      </div>

      <RecentActivity data={recentActivity} />
    </>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  return (
    <div className="min-h-screen bg-surface-dim">
      <Sidebar items={navItems} activePage={activePage} onNavigate={setActivePage} />

      <div className="ml-[260px] transition-all duration-300">
        <TopBar />

        <main>
          {activePage === 'Dashboard' && <DashboardPage />}
          {activePage === 'Reports' && <ReportsPage />}
          {activePage !== 'Dashboard' && activePage !== 'Reports' && (
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-primary">{activePage}</h1>
                <p className="text-[13px] text-text-secondary mt-0.5">
                  This page is under development.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-border-light p-12 flex flex-col items-center justify-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-3xl">🚧</span>
                </div>
                <p className="text-[15px] font-semibold text-text-primary mb-1">Coming Soon</p>
                <p className="text-[13px] text-text-muted">The {activePage} page is currently being built.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
