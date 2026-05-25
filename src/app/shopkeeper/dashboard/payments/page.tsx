'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

type Order = {
  id: string;
  total_amount: number;
  payment_method: string;
  payment_status: 'paid' | 'failed' | 'refunded' | 'pending';
  created_at: string;
  customer_id: string;
  customer_name: string;
};

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('All Methods');
  
  const [stats, setStats] = useState({
    upiCardCollected: 0,
    codCollected: 0,
    failedPayments: 0,
    refunds: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          payment_method,
          payment_status,
          created_at,
          customer_id,
          customer_profiles (
            full_name
          )
        `)
        .eq('shopkeeper_id', userId)
        .order('created_at', { ascending: false });

      if (data) {
        // Fetch user profiles to get names (In a real app, this would be a join if we had a profiles table)
        // Now we can use the real customer name from the profile!
        const enrichedOrders: Order[] = data.map((order: any, index) => ({
          ...order,
          customer_name: order.customer_profiles?.full_name || `Customer ${order.customer_id.substring(0, 4)}`,
        }));

        setOrders(enrichedOrders);

        // Calculate Stats
        let upiCard = 0;
        let cod = 0;
        let failed = 0;
        let refundsAmount = 0;

        enrichedOrders.forEach(order => {
          const amount = Number(order.total_amount);
          
          if (order.payment_status === 'failed') {
             failed++;
          } else if (order.payment_status === 'refunded') {
             refundsAmount += amount;
          } else if (order.payment_status === 'paid') {
             if (order.payment_method === 'razorpay') {
                upiCard += amount;
             } else if (order.payment_method === 'cod') {
                cod += amount;
             }
          }
        });

        setStats({
          upiCardCollected: upiCard,
          codCollected: cod,
          failedPayments: failed,
          refunds: refundsAmount
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodBadge = (method: string) => {
    if (method === 'razorpay') {
      return <span className="px-3 py-1 bg-[#00a2f4]/10 text-[#006398] rounded-full text-xs font-semibold">Online</span>;
    }
    return <span className="px-3 py-1 bg-[#f97316]/10 text-[#9d4300] rounded-full text-xs font-semibold">COD</span>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-3 py-1 bg-[#38fd69]/20 text-[#007126] rounded-full text-xs font-semibold flex items-center w-fit gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#007126]"></span> Paid
          </span>
        );
      case 'failed':
        return (
          <span className="px-3 py-1 bg-[#ffdad6] text-[#ba1a1a] rounded-full text-xs font-semibold flex items-center w-fit gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span> Failed
          </span>
        );
      case 'refunded':
        return (
          <span className="px-3 py-1 bg-[#e0c0b1]/50 text-[#584237] rounded-full text-xs font-semibold flex items-center w-fit gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#584237]"></span> Refunded
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-[#eff4ff] text-[#584237] rounded-full text-xs font-semibold flex items-center w-fit gap-1">
            Pending
          </span>
        );
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === 'All Methods' || 
                          (methodFilter === 'Online' && order.payment_method === 'razorpay') ||
                          (methodFilter === 'COD' && order.payment_method === 'cod');
    
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="p-4 md:p-6 bg-[#f8f9ff] text-[#0b1c30] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#f97316]">Payments Transaction Log</h1>
      </div>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30 flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-[#584237]">UPI/Card Collected</p>
              <span className="w-10 h-10 bg-[#f97316]/10 text-[#f97316] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-[#0b1c30]">₹{stats.upiCardCollected.toLocaleString('en-IN')}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30 flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-[#584237]">COD Collected</p>
              <span className="w-10 h-10 bg-[#00a2f4]/10 text-[#006398] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-[#0b1c30]">₹{stats.codCollected.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30 flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-[#584237]">Failed Payments</p>
              <span className="w-10 h-10 bg-[#ba1a1a]/10 text-[#ba1a1a] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-[#0b1c30]">{stats.failedPayments}</h3>
              {stats.failedPayments > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 flex-1 bg-[#eff4ff] rounded-full overflow-hidden">
                    <div className="bg-[#ba1a1a] h-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-[#ba1a1a]">Needs Attention</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30 flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-[#584237]">Refunds Issued</p>
              <span className="w-10 h-10 bg-[#584237]/10 text-[#584237] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>undo</span>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-[#0b1c30]">₹{stats.refunds.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-[#e0c0b1]/30 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-6 border-b border-[#e0c0b1]/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-[300px]">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#584237] text-[20px]">search</span>
                <input 
                  type="text"
                  placeholder="Search order ID or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#eff4ff] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#f97316] transition-all outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="appearance-none bg-[#eff4ff] border-none rounded-lg px-4 pr-10 py-2 text-sm font-medium focus:ring-2 focus:ring-[#f97316] cursor-pointer"
                >
                  <option>All Methods</option>
                  <option>Online</option>
                  <option>COD</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#584237]">filter_list</span>
              </div>
              <button className="flex items-center gap-2 bg-[#f97316] text-white font-bold px-5 py-2 rounded-lg text-sm hover:brightness-105 transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">download</span> Export
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[#eff4ff]/50 border-b border-[#e0c0b1]/20">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-[#584237] uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#584237] uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#584237] uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#584237] uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#584237] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#584237] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0c0b1]/10">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-[#584237]">Loading payments...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-[#584237]">No payment records found.</td></tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="group hover:bg-[#eff4ff]/30 transition-all cursor-pointer">
                      <td className="px-6 py-4 text-sm text-[#f97316] font-bold">
                        #{order.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#f97316]/20 flex items-center justify-center text-[#f97316] font-bold text-xs">
                            {order.customer_name.charAt(0)}
                          </div>
                          <span className="text-sm text-[#0b1c30]">{order.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#0b1c30]">
                        ₹{Number(order.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        {getMethodBadge(order.payment_method)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.payment_status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#584237]">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="material-symbols-outlined text-[#e0c0b1] group-hover:text-[#f97316] transition-colors">chevron_right</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
