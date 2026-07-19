import { motion } from 'framer-motion';
import { Clock, BarChart3, AlertTriangle, GraduationCap } from 'lucide-react';
import type { ReportTimelineEntry } from '../../types/reports';

const typeConfig = {
  attendance: { bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-500', icon: Clock },
  analytics: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500', icon: BarChart3 },
  defaulter: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500', icon: AlertTriangle },
  eligibility: { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500', icon: GraduationCap },
};

const statusConfig = {
  completed: { bg: 'bg-green-50', text: 'text-green-700', label: 'Done' },
  processing: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Processing' },
  scheduled: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Scheduled' },
};

export default function ReportTimeline({ data }: { data: ReportTimelineEntry[] }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-2xl border border-border-light p-6"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <h3 className="text-[15px] font-semibold text-text-primary mb-1">Report Generation Timeline</h3>
      <p className="text-[12px] text-text-muted mb-5">Recent report generation activity</p>

      <div className="relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-border-light" />

        <div className="space-y-1">
          {data.map((entry, i) => {
            const typeInfo = typeConfig[entry.type];
            const status = statusConfig[entry.status];
            const Icon = typeInfo.icon;

            return (
              <motion.div
                key={entry.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                className="flex items-start gap-3 py-2.5 relative"
              >
                <div className={`relative z-10 w-[10px] h-[10px] mt-2 rounded-full border-[3px] ${
                  entry.status === 'processing'
                    ? 'border-blue-500 bg-white ring-2 ring-blue-500/20'
                    : entry.status === 'completed'
                      ? 'border-green-500 bg-white'
                      : 'border-amber-400 bg-white'
                }`} />

                <div className="w-14 shrink-0 pt-0.5">
                  <span className="text-[12.5px] font-mono font-semibold text-text-primary">
                    {entry.time}
                  </span>
                </div>

                <div className="flex-1 rounded-xl px-3.5 py-2.5 bg-surface-dim hover:bg-surface-muted transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={12} className={typeInfo.text} />
                    <span className="text-[13px] font-medium text-text-primary">
                      {entry.title}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${typeInfo.bg} ${typeInfo.text}`}>
                      {entry.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-[7px]">{entry.avatar}</span>
                      </div>
                      <span className="text-[11px] text-text-muted">{entry.generatedBy}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
