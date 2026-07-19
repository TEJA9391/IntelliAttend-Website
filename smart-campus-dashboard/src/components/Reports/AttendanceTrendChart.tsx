import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import type { MonthlyTrendData } from '../../types/reports';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-lg border border-border-light">
      <p className="text-[12px] font-semibold text-text-primary mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-[11.5px] mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-secondary">{p.name}:</span>
          <span className="font-semibold text-text-primary">
            {p.name === 'Attendance' ? `${p.value}%` : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const filters = ['This Month', 'Last 3 Months', 'Last 6 Months', 'This Year'];

export default function AttendanceTrendChart({ data }: { data: MonthlyTrendData[] }) {
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl border border-border-light p-6"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-text-primary">Attendance Trend Analysis</h3>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-[10px] font-semibold text-green-600">
              <TrendingUp size={10} />
              LIVE
            </span>
          </div>
          <p className="text-[12px] text-text-muted mt-0.5">Monthly attendance and report generation trends</p>
        </div>
        <div className="flex items-center gap-1.5">
          {filters.map((f, i) => (
            <button
              key={f}
              onClick={() => setActiveFilter(i)}
              className={`px-3 py-1.5 rounded-xl text-[11.5px] font-medium transition-all cursor-pointer ${
                activeFilter === i
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-muted text-text-secondary hover:bg-border-light'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradAttendance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14D8C4" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#14D8C4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradReports" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(20,216,196,0.3)', strokeWidth: 1 }} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          />
          <Area
            type="monotone"
            dataKey="attendance"
            stroke="#14D8C4"
            strokeWidth={2.5}
            fill="url(#gradAttendance)"
            name="Attendance"
            dot={{ r: 4, fill: '#14D8C4', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#14D8C4', stroke: '#fff', strokeWidth: 2 }}
            animationDuration={1500}
          />
          <Area
            type="monotone"
            dataKey="reports"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#gradReports)"
            name="Reports Generated"
            dot={{ r: 3, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
            animationDuration={1500}
            animationBegin={300}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border-light">
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-text-muted" />
          <span className="text-[11px] text-text-muted">Data updated every 30 minutes</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-muted">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          <span className="text-[11px] text-text-secondary font-medium">Synced</span>
        </div>
      </div>
    </motion.div>
  );
}
