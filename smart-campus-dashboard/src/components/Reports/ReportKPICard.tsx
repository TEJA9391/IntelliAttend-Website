import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, FileText, Percent, Building2, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { ReportKPIData } from '../../types/reports';

const iconMap: Record<string, LucideIcon> = {
  'file-text': FileText,
  'percent': Percent,
  'building-2': Building2,
  'shield-check': ShieldCheck,
};

function AnimatedCounter({ target, suffix, duration = 1.5 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    const animate = (now: number) => {
      const elapsed = (now - start) / (duration * 1000);
      if (elapsed >= 1) {
        setCount(target);
        return;
      }
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setCount(isFloat ? parseFloat((target * eased).toFixed(1)) : Math.floor(target * eased));
      ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);

  const formatted = isFinite(count)
    ? (count % 1 !== 0 ? count.toFixed(1) : count.toLocaleString())
    : target;

  return <>{formatted}{suffix || ''}</>;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`rkpi-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function ReportKPICard({ data, index }: { data: ReportKPIData; index: number }) {
  const Icon = iconMap[data.icon] || FileText;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
      className="bg-white rounded-2xl p-5 border border-border-light relative overflow-hidden group cursor-default"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.06] blur-2xl transition-transform duration-500 group-hover:scale-150"
        style={{ background: data.color }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${data.color}15` }}
        >
          <Icon size={20} className={`text-[${data.color}]`} style={{ color: data.color } as React.CSSProperties} />
        </div>
        <Sparkline data={data.sparkline} color={data.color} />
      </div>

      <p className="text-[12.5px] text-text-secondary font-medium mb-1">{data.title}</p>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-text-primary tracking-tight">
          <AnimatedCounter target={data.value} suffix={data.suffix} />
        </span>

        <div className="flex items-center gap-0.5 text-[11.5px] font-semibold mb-0.5 text-accent-green">
          <TrendingUp size={13} />
          <span>+{data.change}%</span>
        </div>
      </div>

      <p className="text-[11px] text-text-muted mt-1">vs last month</p>
    </motion.div>
  );
}
