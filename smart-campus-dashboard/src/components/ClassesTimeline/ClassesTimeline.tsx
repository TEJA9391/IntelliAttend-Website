import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { ClassSchedule } from '../../types/dashboard';

const typeColors = {
  lecture: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
  lab: { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-500' },
  tutorial: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
};

export default function ClassesTimeline({ data }: { data: ClassSchedule[] }) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-2xl border border-border-light p-6"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <h3 className="text-[15px] font-semibold text-text-primary mb-1">Today&apos;s Classes</h3>
      <p className="text-[12px] text-text-muted mb-5">{data.length} scheduled today</p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-border-light" />

        <div className="space-y-1">
          {data.map((cls, i) => {
            const [h, m] = cls.time.split(':').map(Number);
            const isPast = currentHour > h || (currentHour === h && currentMin >= m);
            const isCurrent = currentHour === h && !isPast;
            const colors = typeColors[cls.type];

            return (
              <motion.div
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                className="flex items-start gap-3 py-2.5 relative"
              >
                {/* Timeline dot */}
                <div className={`relative z-10 w-[10px] h-[10px] mt-2 rounded-full border-[3px] ${
                  isCurrent
                    ? 'border-primary bg-white ring-2 ring-primary/20'
                    : isPast
                      ? 'border-text-muted bg-surface-muted'
                      : 'border-primary bg-white'
                }`} />

                {/* Time */}
                <div className="w-14 shrink-0 pt-0.5">
                  <span className={`text-[12.5px] font-mono font-semibold ${
                    isCurrent ? 'text-primary' : isPast ? 'text-text-muted' : 'text-text-primary'
                  }`}>
                    {cls.time}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 rounded-xl px-3.5 py-2.5 bg-surface-dim hover:bg-surface-muted transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[13px] font-medium ${isPast ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                      {cls.subject}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md ${colors.bg} ${colors.text}`}>
                      {cls.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-text-muted">
                    <MapPin size={11} />
                    <span className="text-[11px]">{cls.room}</span>
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
