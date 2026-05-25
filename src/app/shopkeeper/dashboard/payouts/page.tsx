'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
    totalEarned: 0
  });
  
  // Dynamic Bank Account State
  const [bankAccount, setBankAccount] = useState<{name: string, last4: string} | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const pieData = [
    { name: 'Merchant Earnings', value: MERCHANT_EARNINGS_PERCENT, color: '#f97316' },
    { name: 'Platform Fee', value: PLATFORM_FEE_PERCENT, color: '#e0c0b1' }
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

        orderData.forEach(order => {
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
          payoutData.forEach(p => {
             if (p.status === 'paid' || p.status === 'processing' || p.status === 'pending') {
                available -= Number(p.amount);
             }
          });
        }

        setStats({
          available: Math.max(0, available),
          pending,
          totalEarned: totalEarned * (MERCHANT_EARNINGS_PERCENT / 100)
        });
      }
    } catch (error) {
      console.error("Error fetching payouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    if (!userId || stats.available <= 0) return;
    if (!bankAccount) {
      alert("Please add a bank account first.");
      return;
    }
    setIsRequesting(true);
    
    try {
      const amountToWithdraw = stats.available;
      
      const { data, error } = await supabase.from('payouts').insert({
        amount: amountToWithdraw,
        status: 'pending',
        bank_account_last4: bankAccount.last4
      }).select().single();
      
      if (data) {
        setPayouts([data, ...payouts]);
        setStats(prev => ({
          ...prev,
          available: 0
        }));
        alert(`Successfully requested payout of ₹${amountToWithdraw.toLocaleString('en-IN', {minimumFractionDigits: 2})}`);
      }
    } catch (err) {
      console.error("Payout request failed:", err);
      alert("Failed to request payout. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="bg-[#38fd69]/20 text-[#007126] px-3 py-1 rounded-full text-xs font-semibold flex items-center w-fit gap-1">
            <span className="w-2 h-2 bg-[#007126] rounded-full"></span> Completed
          </span>
        );
      case 'processing':
        return (
          <span className="bg-[#00a2f4]/10 text-[#006398] px-3 py-1 rounded-full text-xs font-semibold flex items-center w-fit gap-1">
            <span className="w-2 h-2 bg-[#006398] rounded-full"></span> Processing
          </span>
        );
      case 'pending':
        return (
          <span className="bg-[#f97316]/10 text-[#9d4300] px-3 py-1 rounded-full text-xs font-semibold flex items-center w-fit gap-1">
            <span className="w-2 h-2 bg-[#9d4300] rounded-full animate-pulse"></span> Scheduled
          </span>
        );
      case 'failed':
        return (
          <span className="bg-[#ffdad6] text-[#ba1a1a] px-3 py-1 rounded-full text-xs font-semibold flex items-center w-fit gap-1">
            <span className="w-2 h-2 bg-[#ba1a1a] rounded-full"></span> Failed
          </span>
        );
      default:
        return null;
    }
  };

  const availablePercentage = stats.totalEarned > 0 ? (stats.available / stats.totalEarned) * 100 : 0;

  return (
    <div className="p-4 md:p-6 bg-[#f8f9ff] text-[#0b1c30] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-[#f97316]">Payouts & Earnings</h1>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <input 
              type="text" 
              placeholder="Search payouts..." 
              className="bg-[#eff4ff] border-none rounded-full py-2 pl-10 pr-4 text-[#0b1c30] focus:ring-2 focus:ring-[#f97316] w-64"
            />
            <span className="material-symbols-outlined absolute left-3 top-2 text-[#584237]">search</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30 flex flex-col gap-2">
              <span className="text-sm font-medium text-[#584237]">Available Balance</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#f97316]">
                  ₹{stats.available.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#eff4ff] rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#f97316] rounded-full transition-all duration-500" style={{ width: `${availablePercentage}%` }}></div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30 flex flex-col gap-2">
              <span className="text-sm font-medium text-[#584237]">Pending Balance</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#0b1c30]">
                  ₹{stats.pending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-[#584237]">Expected settlement in 3 days</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30 flex flex-col gap-2">
              <span className="text-sm font-medium text-[#584237]">Total Earned</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#0b1c30]">
                  ₹{stats.totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-[#006e25] flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-sm">verified_user</span> Lifetime Merchant
              </p>
            </div>
          </div>

          {/* Payout History Table */}
          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30 overflow-hidden">
            <div className="p-6 border-b border-[#e0c0b1]/20 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-[#0b1c30]">Payout History</h3>
              <button className="flex items-center gap-1 text-[#f97316] text-sm hover:underline">
                <span className="material-symbols-outlined text-[18px]">download</span> Export CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#eff4ff]/50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-[#584237] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#584237] uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#584237] uppercase tracking-wider">Account</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#584237] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0c0b1]/20">
                  {loading ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-[#584237]">Loading payouts...</td></tr>
                  ) : payouts.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-[#584237]">No payout history yet.</td></tr>
                  ) : (
                    payouts.map(payout => (
                      <tr key={payout.id} className="hover:bg-[#eff4ff]/30 transition-colors">
                        <td className="px-6 py-4 text-base text-[#0b1c30]">
                          {new Date(payout.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-base font-bold text-[#0b1c30]">
                          ₹{Number(payout.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-base text-[#584237]">
                          {payout.bank_account_last4 ? `Bank ending in ${payout.bank_account_last4}` : 'N/A'}
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

        {/* Right Secondary Panel */}
        <aside className="w-full lg:w-80 space-y-6">
          {/* Bank Account Card */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-semibold text-[#0b1c30]">Bank Account</h4>
                <p className="text-xs text-[#584237]">Primary payout destination</p>
              </div>
              <button 
                onClick={() => {
                   const newBank = prompt("Enter new bank name:", bankAccount?.name || '');
                   const newLast4 = prompt("Enter last 4 digits:", bankAccount?.last4 || '');
                   if (newBank && newLast4) {
                      const newAcc = { name: newBank, last4: newLast4 };
                      setBankAccount(newAcc);
                      localStorage.setItem('shopkeeper_bank', JSON.stringify(newAcc));
                   }
                }}
                className="text-[#f97316] hover:bg-[#f97316]/10 p-2 rounded-lg transition-colors border border-[#f97316]"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
            <div className="flex items-center gap-4 bg-[#eff4ff] p-4 rounded-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[#f97316]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              </div>
              <div>
                {bankAccount ? (
                  <>
                    <p className="text-sm font-bold text-[#0b1c30]">{bankAccount.name}</p>
                    <p className="text-base text-[#584237]">•••• {bankAccount.last4}</p>
                  </>
                ) : (
                  <p className="text-sm font-medium text-[#ba1a1a]">No bank account added</p>
                )}
              </div>
            </div>
          </div>

          {/* Request Payout Action */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30 flex flex-col gap-4">
            <button 
              onClick={handleRequestPayout}
              disabled={stats.available <= 0 || isRequesting}
              className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                stats.available > 0 && !isRequesting 
                  ? 'bg-[#f97316] text-white hover:brightness-105 active:scale-95 shadow-md cursor-pointer' 
                  : 'bg-[#f97316]/50 text-white cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined">payments</span> 
              {isRequesting ? 'Processing...' : 'Request Payout'}
            </button>
            <div className="flex items-start gap-2 text-[#584237]">
              <span className="material-symbols-outlined text-[18px] text-[#006398]">info</span>
              <p className="text-xs leading-relaxed">
                {stats.available > 0 
                  ? `You have ₹${stats.available.toLocaleString('en-IN', {minimumFractionDigits: 2})} available for withdrawal. Withdrawals are processed instantly.`
                  : `You have no available funds to withdraw. Your next automatic transfer is scheduled for Monday.`}
              </p>
            </div>
          </div>

          {/* Revenue Split Donut Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30">
            <h4 className="text-xl font-semibold text-[#0b1c30] mb-6">Revenue Breakdown</h4>
            
            <div className="relative w-48 h-48 mx-auto mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-[#584237]">Earnings</span>
                <span className="text-2xl font-bold text-[#f97316]">{MERCHANT_EARNINGS_PERCENT}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#f97316] rounded-full"></span>
                  <span className="text-sm font-medium text-[#584237]">Merchant Earnings</span>
                </div>
                <span className="text-sm font-bold text-[#0b1c30]">{MERCHANT_EARNINGS_PERCENT}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e0c0b1] rounded-full"></span>
                  <span className="text-sm font-medium text-[#584237]">Platform Fee</span>
                </div>
                <span className="text-sm font-bold text-[#0b1c30]">{PLATFORM_FEE_PERCENT}%</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
