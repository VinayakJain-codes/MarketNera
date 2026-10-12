'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Wallet,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Building2,
  Download,
  Search,
  ArrowUpRight,
  Edit2,
  Info,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Payout = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  bank_account_last4: string;
  created_at: string;
};

// Configurable Platform Fee
const PLATFORM_FEE_PERCENT = 15;
const MERCHANT_EARNINGS_PERCENT = 100 - PLATFORM_FEE_PERCENT;

export default function PayoutsPage() {
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState({
    available: 0,
    pending: 0,
    totalEarned: 0,
  });

  // Dynamic Bank Account State
  const [bankAccount, setBankAccount] = useState<{ name: string; last4: string } | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const pieData = [
    { name: 'Merchant Earnings', value: MERCHANT_EARNINGS_PERCENT, color: '#059669' },
    { name: 'Platform Fee', value: PLATFORM_FEE_PERCENT, color: '#cbd5e1' },
  ];

  useEffect(() => {
    fetchPayouts();
    const savedBank = localStorage.getItem('shopkeeper_bank');
    if (savedBank) {
      try {
        setBankAccount(JSON.parse(savedBank));
      } catch (e) {}
    }
  }, []);

  const fetchPayouts = async () => {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const uid = session?.session?.user?.id;

    if (!uid) {
      setLoading(false);
      return;
    }
    setUserId(uid);

    try {
      // Fetch payout history
      const { data: payoutData } = await supabase
        .from('payouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (payoutData) {
        setPayouts(payoutData);
      }

      // Fetch orders to calculate total earned and pending
      const { data: orderData } = await supabase
        .from('orders')
        .select('total_amount, status, payment_status')
        .eq('shopkeeper_id', uid);

      if (orderData) {
        let totalEarned = 0;
        let pending = 0;
        let available = 0;

        orderData.forEach((order) => {
          if (order.payment_status === 'paid') {
            totalEarned += Number(order.total_amount);

            // Calculate earnings post-fee
            const earnings = Number(order.total_amount) * (MERCHANT_EARNINGS_PERCENT / 100);

            if (order.status === 'delivered') {
              available += earnings;
            } else {
              pending += earnings;
            }
          }
        });

        // Subtract already paid/processing payouts from available
        if (payoutData) {
          payoutData.forEach((p) => {
            if (p.status === 'paid' || p.status === 'processing' || p.status === 'pending') {
              available -= Number(p.amount);
            }
          });
        }

        setStats({
          available: Math.max(0, available),
          pending,
          totalEarned: totalEarned * (MERCHANT_EARNINGS_PERCENT / 100),
        });
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    if (!userId || stats.available <= 0) return;
    if (!bankAccount) {
      toast.error('Please add your bank account first.');
      return;
    }
    setIsRequesting(true);

    try {
      const amountToWithdraw = stats.available;

      const { data, error } = await supabase
        .from('payouts')
        .insert({
          amount: amountToWithdraw,
          status: 'pending',
          bank_account_last4: bankAccount.last4,
        })
        .select()
        .single();

      if (data) {
        setPayouts([data, ...payouts]);
        setStats((prev) => ({
          ...prev,
          available: 0,
        }));
        toast.success(`Successfully requested payout of ₹${amountToWithdraw.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
      }
    } catch (err) {
      console.error('Payout request failed:', err);
      toast.error('Failed to request payout.');
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
          </span>
        );
      case 'processing':
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" /> Processing
          </span>
        );
      case 'pending':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Scheduled
          </span>
        );
      case 'failed':
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200/80 px-2.5 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Failed
          </span>
        );
      default:
        return null;
    }
  };

  const filteredPayouts = payouts.filter((p) =>
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Payouts & Earnings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage merchant settlements, bank transfers, and earnings history.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search settlements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:border-emerald-500 outline-none w-56 shadow-sm"
            />
          </div>

          <button
            onClick={() => toast.success('Exporting CSV...')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: KPI cards & History Table */}
        <div className="flex-1 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Balance</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-emerald-600">
                    ₹{stats.available.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalEarned > 0 ? (stats.available / stats.totalEarned) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Balance</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{stats.pending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Settled upon order delivery
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Lifetime Earned</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{stats.totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <p className="text-xs text-emerald-700 flex items-center gap-1 font-bold mt-4">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Merchant Account
              </p>
            </div>
          </div>

          {/* Payout History Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Settlement Transactions</h3>
                <p className="text-xs text-slate-500">History of all withdrawals transferred to your bank account.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">Loading settlements...</td>
                    </tr>
                  ) : filteredPayouts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                        No settlement history found yet.
                      </td>
                    </tr>
                  ) : (
                    filteredPayouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-xs font-medium text-slate-600">
                          {new Date(payout.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-slate-900">
                          ₹{payout.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-500">
                          •••• {payout.bank_account_last4}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(payout.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Bank Info, Action & Breakdown */}
        <div className="w-full lg:w-80 space-y-6 shrink-0">
          {/* Bank Account Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Linked Bank Account</h4>
                <p className="text-[11px] text-slate-400">Primary destination for payouts</p>
              </div>
              <button
                onClick={() => {
                  const newBank = prompt('Enter new bank name:', bankAccount?.name || '');
                  const newLast4 = prompt('Enter last 4 digits:', bankAccount?.last4 || '');
                  if (newBank && newLast4) {
                    const newAcc = { name: newBank, last4: newLast4 };
                    setBankAccount(newAcc);
                    localStorage.setItem('shopkeeper_bank', JSON.stringify(newAcc));
                    toast.success('Bank details saved!');
                  }
                }}
                className="w-8 h-8 rounded-lg border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 flex items-center justify-center text-slate-500 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                {bankAccount ? (
                  <>
                    <p className="text-xs font-bold text-slate-900">{bankAccount.name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">•••• {bankAccount.last4}</p>
                  </>
                ) : (
                  <p className="text-xs font-medium text-rose-600">No bank account linked</p>
                )}
              </div>
            </div>
          </div>

          {/* Request Payout Action */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
            <button
              onClick={handleRequestPayout}
              disabled={stats.available <= 0 || isRequesting}
              className={`w-full font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all shadow-md ${
                stats.available > 0 && !isRequesting
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              {isRequesting ? 'Processing...' : 'Request Instant Payout'}
            </button>

            <div className="flex items-start gap-2 text-slate-500 text-xs">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                {stats.available > 0
                  ? `₹${stats.available.toLocaleString('en-IN', { minimumFractionDigits: 2 })} is eligible for instant withdrawal directly to your linked account.`
                  : 'Payout balance accumulates from completed customer deliveries.'}
              </p>
            </div>
          </div>

          {/* Revenue Split Donut Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Revenue Settlement Model</h4>

            <div className="relative w-40 h-40 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-slate-400">Net Earn</span>
                <span className="text-xl font-black text-emerald-600">{MERCHANT_EARNINGS_PERCENT}%</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
                  <span className="font-medium text-slate-600">Merchant Take-home</span>
                </div>
                <span className="font-bold text-slate-900">{MERCHANT_EARNINGS_PERCENT}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-slate-300 rounded-full" />
                  <span className="font-medium text-slate-600">Platform Handling</span>
                </div>
                <span className="font-bold text-slate-900">{PLATFORM_FEE_PERCENT}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
