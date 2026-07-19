import { motion } from 'framer-motion';
import type { DepartmentData } from '../../types/dashboard';

export default function DepartmentStats({ data }: { data: DepartmentData[] }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-2xl border border-border-light p-6"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <h3 className="text-[15px] font-semibold text-text-primary mb-1">Department Attendance</h3>
      <p className="text-[12px] text-text-muted mb-5">Performance by department</p>

      <div className="space-y-4">
        {data.map((dept, i) => (
          <motion.div
            key={dept.name}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-text-primary font-medium">{dept.name}</span>
                <span className="text-[11px] text-text-muted">({dept.students})</span>
              </div>
              <span className="text-[13px] font-bold" style={{ color: dept.color }}>
                {dept.percentage}%
              </span>
            </div>
            <div className="h-2.5 bg-surface-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dept.percentage}%` }}
                transition={{ duration: 1, delay: 0.7 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${dept.color}CC, ${dept.color})` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
