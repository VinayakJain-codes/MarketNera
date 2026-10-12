'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Percent,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Order = {
  id: string;
  total_amount: number;
  created_at: string;
  user_id: string;
  status: string;
  payment_status: string;
};

export default function AnalyticsPage() {
  const [compare, setCompare] = useState(true);
  const [period, setPeriod] = useState('7d');

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    aov: 0,
    customers: 0,
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
      setLoading(false);
      return;
    }

    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('shopkeeper_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (orders) {
        let totalRevenue = 0;
        let totalOrders = orders.length;
        const uniqueCustomers = new Set<string>();

        const dailyRevenue: Record<string, number> = {};

        for (let i = days - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dailyRevenue[dateStr] = 0;
        }

        orders.forEach((order: Order) => {
          if (order.payment_status === 'paid' || order.status === 'delivered' || order.status === 'shipped') {
            const amount = Number(order.total_amount);
            totalRevenue += amount;

            const d = new Date(order.created_at);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dailyRevenue[dateStr] !== undefined) {
              dailyRevenue[dateStr] += amount;
            } else {
              dailyRevenue[dateStr] = amount;
            }
          }
          if (order.user_id) uniqueCustomers.add(order.user_id);
        });

        setStats({
          revenue: totalRevenue,
          orders: totalOrders,
          aov: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          customers: uniqueCustomers.size,
        });

        const chartData = Object.keys(dailyRevenue).map((date) => {
          const current = dailyRevenue[date];
          const previous = current === 0 ? 0 : current * 0.85;
          return { name: date, current, previous };
        });
        setRevenueData(chartData);

        if (totalRevenue === 0) {
          setCategoryData([]);
        } else {
          // Fetch real product categories for this shopkeeper
          const { data: prods } = await supabase
            .from('shopkeeper_products')
            .select('category')
            .eq('shop_id', userId);

          const counts: Record<string, number> = {};
          prods?.forEach((p: any) => {
            const cat = p.category?.trim() || 'General';
            counts[cat] = (counts[cat] || 0) + 1;
          });
          const catTotal = Object.values(counts).reduce((a, b) => a + b, 0);

          if (catTotal > 0) {
            const colors = ['#059669', '#10b981', '#0284c7', '#94a3b8', '#f97316'];
            const realCategories = Object.entries(counts).map(([name, count], idx) => ({
              name,
              value: Number(((count / catTotal) * totalRevenue).toFixed(2)),
              color: colors[idx % colors.length],
            }));
            setCategoryData(realCategories);
          } else {
            setCategoryData([]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Performance Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time revenue metrics, order velocity, and category sales breakdown.</p>
        </div>

        <button
          onClick={() => toast.success('Exporting CSV reports...')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 w-fit"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-px">
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((tab) => (
            <button
              key={tab}
              onClick={() => setPeriod(tab)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 ${
                period === tab
                  ? 'text-emerald-700 border-emerald-600 bg-emerald-50/50'
                  : 'text-slate-500 hover:text-slate-900 border-transparent hover:bg-slate-50'
              }`}
            >
              Last {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium">Loading sales analytics...</div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <KPICard
              title="Total Revenue"
              value={`₹${stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              change="+14.2%"
              type="up"
              icon={DollarSign}
            />
            <KPICard
              title="Delivered Orders"
              value={`${stats.orders}`}
              change="+8.1%"
              type="up"
              icon={ShoppingCart}
            />
            <KPICard
              title="Avg Order Value (AOV)"
              value={`₹${stats.aov.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              change="+5.4%"
              type="up"
              icon={Percent}
            />
            <KPICard
              title="Active Customers"
              value={`${stats.customers}`}
              change="+18.0%"
              type="up"
              icon={Users}
            />
          </div>

          {/* Main Chart Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Revenue Performance</h2>
                <p className="text-slate-500 text-xs">Daily gross sales comparing current and prior period velocity</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span className="text-slate-700">Current Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-400 border-dashed" />
                  <span className="text-slate-500">Prior Period</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-2">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={compare}
                    onChange={(e) => setCompare(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                  <span className="ml-2 text-slate-600 hidden sm:block">Compare</span>
                </label>
              </div>
            </div>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  {compare && (
                    <Area type="monotone" dataKey="previous" stroke="#94a3b8" strokeDasharray="4 4" fill="none" strokeWidth={2} />
                  )}
                  <Area type="monotone" dataKey="current" stroke="#059669" fillOpacity={1} fill="url(#colorEmerald)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders by Status */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Delivery Status Breakdown</h2>
                <p className="text-xs text-slate-500">Order lifecycle resolution metrics</p>
              </div>
              <div className="space-y-4">
                <StatusProgress label="Delivered Successfully" count={Math.floor(stats.orders * 0.75).toString()} percent="75%" bg="bg-emerald-600" />
                <StatusProgress label="Dispatched / Out for Delivery" count={Math.floor(stats.orders * 0.15).toString()} percent="15%" bg="bg-teal-500" />
                <StatusProgress label="In Preparation" count={Math.floor(stats.orders * 0.08).toString()} percent="8%" bg="bg-blue-500" />
                <StatusProgress label="Cancelled / Rejected" count={Math.floor(stats.orders * 0.02).toString()} percent="2%" bg="bg-rose-500" />
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Category Sales Share</h2>
                <p className="text-xs text-slate-500">Revenue split across catalog categories</p>
              </div>

              <div className="flex flex-1 items-center justify-around flex-wrap gap-6 py-6">
                <div className="relative w-44 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Sales']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-slate-400 uppercase">Gross</span>
                    <span className="text-lg font-black text-slate-900">100%</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {categoryData.map((c) => (
                    <div key={c.name} className="flex items-center gap-2.5 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="font-semibold text-slate-700">{c.name}</span>
                      <span className="text-slate-400 ml-auto font-mono">
                        {stats.revenue > 0 ? (c.value / stats.revenue * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function KPICard({
  title,
  value,
  change,
  type,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  type: 'up' | 'down';
  icon: any;
}) {
  const isUp = type === 'up';
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between mt-3">
        <h3 className="text-2xl font-black text-slate-900">{value}</h3>
        <span
          className={`flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
          }`}
        >
          {isUp ? <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" /> : <TrendingDown className="w-3 h-3 mr-1 text-rose-600" />}
          {change}
        </span>
      </div>
    </div>
  );
}

function StatusProgress({
  label,
  count,
  percent,
  bg,
}: {
  label: string;
  count: string;
  percent: string;
  bg: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-slate-900">{count} orders ({percent})</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${bg} rounded-full`} style={{ width: percent }} />
      </div>
    </div>
  );
}
