'use client';

import { motion } from 'framer-motion';
import { DollarSign, Users, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MetricCard {
  label: string;
  value: string;
  numericValue: number;
  change: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

function AnimatedNumber({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  const formatted = target >= 1000 ? count.toLocaleString() : count.toString();
  return <span>{prefix}{formatted}{suffix}</span>;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring' as const, bounce: 0.35 } },
};

interface MetricsCardsProps {
  totalRevenue?: number;
  activeCustomers?: number;
  totalOrders?: number;
  conversionRate?: number;
  revenueChange?: number;
  customerChange?: number;
  orderChange?: number;
  conversionChange?: number;
}

export default function MetricsCards({
  totalRevenue = 0,
  activeCustomers = 0,
  totalOrders = 0,
  conversionRate = 0,
  revenueChange = 0,
  customerChange = 0,
  orderChange = 0,
  conversionChange = 0,
}: MetricsCardsProps) {
  const cards: MetricCard[] = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      numericValue: totalRevenue,
      change: revenueChange,
      icon: DollarSign,
      color: 'var(--brand-green)',
      bgColor: 'rgba(34, 197, 94, 0.12)',
    },
    {
      label: 'Active Customers',
      value: activeCustomers.toLocaleString(),
      numericValue: activeCustomers,
      change: customerChange,
      icon: Users,
      color: 'var(--brand-orange)',
      bgColor: 'rgba(249, 115, 22, 0.12)',
    },
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      numericValue: totalOrders,
      change: orderChange,
      icon: ShoppingCart,
      color: 'var(--brand-green-light)',
      bgColor: 'rgba(74, 222, 128, 0.12)',
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      numericValue: conversionRate,
      change: conversionChange,
      icon: TrendingUp,
      color: 'var(--brand-orange-light)',
      bgColor: 'rgba(251, 146, 60, 0.12)',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          variants={item}
          whileHover={{ scale: 1.03, transition: { type: 'spring', bounce: 0.4 } }}
          className="dash-glass p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[var(--dash-text-muted)]">{card.label}</span>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: card.bgColor }}
            >
              <card.icon className="h-5 w-5" style={{ color: card.color }} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--dash-text)]">
            {card.label === 'Total Revenue' && <AnimatedNumber target={card.numericValue} prefix="₹" />}
            {card.label === 'Conversion Rate' && <AnimatedNumber target={card.numericValue} suffix="%" />}
            {card.label !== 'Total Revenue' && card.label !== 'Conversion Rate' && <AnimatedNumber target={card.numericValue} />}
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            {card.change >= 0 ? (
              <span className="flex items-center text-[var(--brand-green)]">
                <ArrowUpRight className="h-3 w-3" /> +{card.change}%
              </span>
            ) : (
              <span className="flex items-center text-red-400">
                <ArrowDownRight className="h-3 w-3" /> {card.change}%
              </span>
            )}
            <span className="text-[var(--dash-text-muted)]">vs last month</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
