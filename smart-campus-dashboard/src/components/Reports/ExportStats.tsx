import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Table2, Sheet, Share2, type LucideIcon } from 'lucide-react';
import type { ExportStatsData } from '../../types/reports';

const iconMap: Record<string, LucideIcon> = {
  'file-type': FileText,
  'table-2': Table2,
  'sheet': Sheet,
  'share-2': Share2,
};

function AnimatedNumber({ target, duration = 1.2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - start) / (duration * 1000);
      if (elapsed >= 1) {
        setCount(target);
        return;
      }
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setCount(Math.floor(target * eased));
      ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function ExportStats({ data }: { data: ExportStatsData[] }) {
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
          <h3 className="text-[15px] font-semibold text-text-primary">Export Statistics</h3>
          <p className="text-[12px] text-text-muted mt-0.5">Report download and sharing metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {data.map((stat, i) => {
          const Icon = iconMap[stat.icon] || FileText;
          return (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.75 + i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className="rounded-xl p-4 border border-border-light hover:border-border transition-all cursor-default"
              style={{ background: `${stat.color}06` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}15` }}
                >
                  <Icon size={16} className={`text-[${stat.color}]`} style={{ color: stat.color } as React.CSSProperties} />
                </div>
              </div>
              <p className="text-[11px] text-text-secondary font-medium mb-0.5">{stat.label}</p>
              <p className="text-lg font-bold text-text-primary">
                <AnimatedNumber target={stat.value} />
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border-light">
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] text-text-muted">Total exports this month</span>
          <span className="text-[13px] font-bold text-primary">
            <AnimatedNumber target={data.reduce((a, b) => a + b.value, 0)} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
