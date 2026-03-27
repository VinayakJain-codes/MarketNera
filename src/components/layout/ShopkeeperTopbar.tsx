'use client';

import { motion } from 'framer-motion';
import { Search, Bell, Download, ChevronDown, User } from 'lucide-react';

interface TopbarProps {
  title?: string;
  description?: string;
}

export default function ShopkeeperTopbar({ 
  title = "Dashboard Overview", 
  description = "Manage your store operations, orders, and performance." 
}: TopbarProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="flex items-center justify-between border-b border-[var(--dash-card-border)] bg-[var(--dash-bg)] px-6 py-4"
    >
      {/* Left: Title */}
      <div>
        <h1 className="text-xl font-bold text-[var(--dash-text)]">{title}</h1>
        <p className="text-sm text-[var(--dash-text-muted)]">{description}</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] px-3 py-2 text-sm text-[var(--dash-text-muted)]">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-[var(--dash-text)] placeholder:text-[var(--dash-text-muted)] w-40"
          />
        </div>

        {/* Date Range */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] px-3 py-2 text-sm text-[var(--dash-text-muted)]">
          <span>{dateStr}</span>
          <ChevronDown className="h-3 w-3" />
        </div>

        {/* Export */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex items-center gap-2 rounded-xl bg-[var(--brand-green)] px-4 py-2 text-sm font-medium text-white"
        >
          <Download className="h-4 w-4" />
          Export
        </motion.button>

        {/* Notification */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] text-[var(--dash-text-muted)] hover:text-[var(--brand-orange)] transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--brand-orange)]" />
        </motion.button>

        {/* Avatar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-orange)] text-white font-bold text-sm"
        >
          <User className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.header>
  );
}
