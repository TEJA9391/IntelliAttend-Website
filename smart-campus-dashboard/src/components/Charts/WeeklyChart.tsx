import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Filter } from 'lucide-react';
import type { WeeklyData } from '../../types/dashboard';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-lg border border-border-light">
      <p className="text-[12px] font-semibold text-text-primary mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-[11.5px] mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-secondary capitalize">{p.name}:</span>
          <span className="font-semibold text-text-primary">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function WeeklyChart({ data }: { data: WeeklyData[] }) {
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
          <h3 className="text-[15px] font-semibold text-text-primary">Weekly Attendance</h3>
          <p className="text-[12px] text-text-muted mt-0.5">Student attendance breakdown by day</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-muted text-[12px] text-text-secondary hover:bg-border-light transition-colors cursor-pointer">
          <Filter size={13} />
          <span>This Week</span>
        </button>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(20,216,196,0.04)' }} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          />
          <Bar dataKey="present" fill="#22C55E" radius={[6, 6, 0, 0]} name="Present" />
          <Bar dataKey="absent" fill="#EF4444" radius={[6, 6, 0, 0]} name="Absent" />
          <Bar dataKey="late" fill="#F97316" radius={[6, 6, 0, 0]} name="Late" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
