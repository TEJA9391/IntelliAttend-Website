import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, GraduationCap, Users, CalendarCheck,
  BarChart3, Megaphone, Bell, Settings, User, ChevronLeft, ChevronRight,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, BookOpen, GraduationCap, Users, CalendarCheck,
  BarChart3, Megaphone, Bell, Settings, User,
};

interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
}

export default function Sidebar({ items, activePage, onNavigate }: {
  items: NavItem[];
  activePage: string;
  onNavigate: (page: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const activeIndex = items.findIndex((item) => item.label === activePage);
  const setActiveIndex = (i: number) => onNavigate(items[i].label);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-border z-40 flex flex-col"
      style={{ boxShadow: '1px 0 8px rgba(0,0,0,0.02)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border-light shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-teal flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">SC</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-semibold text-[15px] text-text-primary whitespace-nowrap">
                Smart Campus
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {items.map((item, i) => {
          const Icon = iconMap[item.icon];
          const isActive = i === activeIndex;
          return (
            <motion.button
              key={item.label}
              onClick={() => setActiveIndex(i)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5
                transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                }
              `}
            >
              {Icon && <Icon size={20} className={isActive ? 'text-primary' : ''} />}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[13.5px] whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="border-t border-border-light p-3 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-muted transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center shrink-0">
            <span className="text-white font-semibold text-xs">AU</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[13px] font-medium text-text-primary truncate">Admin User</p>
                <p className="text-[11px] text-text-muted truncate">admin@smartcampus.edu</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center hover:bg-surface-muted transition-colors z-50 shadow-sm cursor-pointer"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
