'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Search,
  Download,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Filter,
  Check,
  XCircle,
  Clock,
} from 'lucide-react';

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
    refunds: 0,
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
      const { data } = await supabase
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
        const enrichedOrders: Order[] = data.map((order: any) => ({
          ...order,
          customer_name:
            order.customer_profiles?.full_name ||
            `Customer #${order.customer_id.substring(0, 4)}`,
        }));

        setOrders(enrichedOrders);

        let upiCard = 0;
        let cod = 0;
        let failed = 0;
        let refundsAmount = 0;

        enrichedOrders.forEach((order) => {
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
          refunds: refundsAmount,
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodBadge = (method: string) => {
    if (method === 'razorpay') {
      return (
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-bold inline-flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          <span>Online Pay</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
        Prepaid
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Paid</span>
          </span>
        );
      case 'failed':
        return (
          <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200/60 rounded-full text-xs font-bold inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-500" />
            <span>Failed</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full text-xs font-bold inline-flex items-center gap-1">
            <RotateCcw className="w-3 h-3 text-amber-600" />
            <span>Refunded</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod =
      methodFilter === 'All Methods' ||
      (methodFilter === 'Online' && order.payment_method === 'razorpay') ||
      (methodFilter === 'COD' && order.payment_method === 'cod');

    return matchesSearch && matchesMethod;
  });

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen text-slate-900 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Payments &amp; Settlements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            100% digital transactions, prepaid order settlement logs, and refund status
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between min-h-[130px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Digital Volume
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900">
              ₹{stats.upiCardCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <span className="text-[11px] font-bold text-emerald-700">100% UPI &amp; Cards</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between min-h-[130px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Settlement Schedule
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900">Daily T+1</h3>
            <span className="text-[11px] font-bold text-blue-600">Automated Direct Bank Node</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between min-h-[130px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Failed Attempts
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900">{stats.failedPayments}</h3>
            <span className="text-[11px] font-bold text-slate-400">Customer checkout retries</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between min-h-[130px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Refunds Processed
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900">
              ₹{stats.refunds.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Customer cancel settlements</span>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search order ID or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-emerald-600 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 pr-9 py-2 text-xs font-bold text-slate-700 focus:border-emerald-600 outline-none cursor-pointer"
              >
                <option>All Methods</option>
                <option>Online</option>
              </select>
              <Filter className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>

            <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-50/70 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Loading payments...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No payment records match your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ₹{Number(order.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">{getMethodBadge(order.payment_method)}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.payment_status)}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
