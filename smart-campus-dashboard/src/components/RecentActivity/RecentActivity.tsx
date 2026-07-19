import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { ActivityEntry } from '../../types/dashboard';

const statusConfig = {
  present: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Present' },
  absent: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Absent' },
  late: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Late' },
  leave: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Leave' },
};

const avatarGradients = [
  'from-blue-400 to-blue-500',
  'from-teal-400 to-teal-500',
  'from-purple-400 to-purple-500',
  'from-orange-400 to-orange-500',
  'from-pink-400 to-pink-500',
  'from-cyan-400 to-cyan-500',
];

export default function RecentActivity({ data }: { data: ActivityEntry[] }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.75 }}
      className="bg-white rounded-2xl border border-border-light p-6"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary">Recent Attendance Activity</h3>
          <p className="text-[12px] text-text-muted mt-0.5">Latest attendance records across all classes</p>
        </div>
        <button className="flex items-center gap-1 text-[12px] text-primary font-medium hover:text-primary-dark transition-colors cursor-pointer">
          View All <ArrowRight size={13} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-light">
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider pb-3 pr-4">Student</th>
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider pb-3 pr-4">Subject</th>
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider pb-3 pr-4">Faculty</th>
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider pb-3 pr-4">Status</th>
              <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider pb-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, i) => {
              const status = statusConfig[entry.status];
              return (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.85 + i * 0.05 }}
                  className="border-b border-border-light last:border-0 hover:bg-surface-dim transition-colors"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center shrink-0`}>
                        <span className="text-white font-semibold text-[10px]">{entry.avatar}</span>
                      </div>
                      <span className="text-[13px] font-medium text-text-primary">{entry.student}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[12.5px] text-text-secondary">{entry.subject}</td>
                  <td className="py-3 pr-4 text-[12.5px] text-text-secondary">{entry.faculty}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 text-right text-[12px] text-text-muted font-mono">{entry.time}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
