import { motion } from 'framer-motion';
import { Award, BookOpen } from 'lucide-react';
import type { FacultyData } from '../../types/dashboard';

const avatarGradients = [
  'from-blue-500 to-blue-600',
  'from-teal-400 to-teal-500',
  'from-purple-500 to-purple-600',
  'from-orange-400 to-orange-500',
];

export default function FacultyPerformance({ data }: { data: FacultyData[] }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.65 }}
      className="bg-white rounded-2xl border border-border-light p-6"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary">Faculty Performance</h3>
          <p className="text-[12px] text-text-muted mt-0.5">Top performing faculty this month</p>
        </div>
        <Award size={18} className="text-accent-orange" />
      </div>

      <div className="space-y-3">
        {data.map((faculty, i) => (
          <motion.div
            key={faculty.name}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.75 + i * 0.08 }}
            whileHover={{ backgroundColor: '#F8FAFC' }}
            className="flex items-center gap-3 p-3 rounded-xl transition-colors"
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradients[i]} flex items-center justify-center shrink-0`}>
              <span className="text-white font-semibold text-xs">{faculty.avatar}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-text-primary truncate">{faculty.name}</p>
              <p className="text-[11px] text-text-muted">{faculty.department}</p>
            </div>

            {/* Stats */}
            <div className="text-right shrink-0">
              <p className="text-[14px] font-bold text-primary">{faculty.attendance}%</p>
              <div className="flex items-center gap-1 text-text-muted justify-end">
                <BookOpen size={10} />
                <span className="text-[10px]">{faculty.classes} classes</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
