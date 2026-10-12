'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Search,
  Award,
  Star,
  ShoppingBag,
  Calendar,
} from 'lucide-react';

type CustomerStat = {
  customer_id: string;
  customer_name: string;
  total_orders: number;
  total_spent: number;
  last_order_at: string;
};

export default function ContactsPage() {
  const [customers, setCustomers] = useState<CustomerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const shopkeeperId = sessionData.session?.user?.id;

      if (!shopkeeperId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          customer_id, 
          total_amount, 
          created_at,
          customer_profiles (
            full_name
          )
        `)
        .eq('shopkeeper_id', shopkeeperId);

      if (data && !error) {
        const statsMap = new Map<string, CustomerStat>();
        data.forEach((order: any) => {
          const existing = statsMap.get(order.customer_id) || {
            customer_id: order.customer_id,
            customer_name: order.customer_profiles?.full_name || `Customer ${order.customer_id.substring(0, 4)}`,
            total_orders: 0,
            total_spent: 0,
            last_order_at: order.created_at,
          };

          existing.total_orders += 1;
          existing.total_spent += Number(order.total_amount);
          if (new Date(order.created_at) > new Date(existing.last_order_at)) {
            existing.last_order_at = order.created_at;
          }
          statsMap.set(order.customer_id, existing);
        });

        setCustomers(Array.from(statsMap.values()).sort((a, b) => b.total_spent - a.total_spent));
      }
      setLoading(false);
    }
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLoyaltyBadge = (orders: number) => {
    if (orders >= 10)
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> VIP Gold
        </span>
      );
    if (orders >= 3)
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <Award className="w-3 h-3 text-slate-500" /> Silver
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <Users className="w-3 h-3 text-emerald-600" /> Repeat Local
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Customer Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Review neighborhood shoppers, repeat frequency, and lifetime order values.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-xs w-64 shadow-sm bg-white font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lifetime Spend</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Order</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Loyalty Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Loading customer roster...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No matching customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.customer_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-black">
                          {customer.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{customer.customer_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {customer.customer_id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700 text-sm">
                      {customer.total_orders} orders
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-black text-slate-900 text-sm">
                      ₹{customer.total_spent.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {new Date(customer.last_order_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getLoyaltyBadge(customer.total_orders)}</td>
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
