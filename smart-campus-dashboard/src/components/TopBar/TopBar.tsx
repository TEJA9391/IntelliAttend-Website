import { motion } from 'framer-motion';
import { Search, Bell, MessageSquare, Download, Calendar } from 'lucide-react';

export default function TopBar() {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="h-16 bg-white/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 sticky top-0 z-30"
    >
      {/* Left: Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search students, courses, faculty..."
            className="w-full pl-9 pr-4 py-2 bg-surface-muted rounded-xl border-0 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Date */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-muted text-[12.5px] text-text-secondary">
          <Calendar size={14} className="text-primary" />
          <span>{dateStr}</span>
        </div>

        {/* Notification */}
        <button className="relative p-2.5 rounded-xl hover:bg-surface-muted transition-colors group cursor-pointer">
          <Bell size={18} className="text-text-secondary group-hover:text-text-primary transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full ring-2 ring-white" />
        </button>

        {/* Messages */}
        <button className="p-2.5 rounded-xl hover:bg-surface-muted transition-colors group cursor-pointer">
          <MessageSquare size={18} className="text-text-secondary group-hover:text-text-primary transition-colors" />
        </button>

        {/* Export */}
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-[13px] font-medium hover:bg-primary-dark transition-all shadow-sm hover:shadow-md cursor-pointer">
          <Download size={15} />
          <span className="hidden sm:inline">Export Report</span>
        </button>

        {/* Avatar */}
        <div className="ml-1 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
          <span className="text-white font-semibold text-xs">AU</span>
        </div>
      </div>
    </motion.header>
  );
}
