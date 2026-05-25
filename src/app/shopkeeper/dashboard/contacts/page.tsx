'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
                        last_order_at: order.created_at
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

    const filteredCustomers = customers.filter(c => 
        c.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getLoyaltyBadge = (orders: number) => {
        if (orders >= 10) return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800"><span className="material-symbols-outlined text-[14px]">stars</span> Gold</span>;
        if (orders >= 3) return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700"><span className="material-symbols-outlined text-[14px]">stars</span> Silver</span>;
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700"><span className="material-symbols-outlined text-[14px]">stars</span> Bronze</span>;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Customers</h1>
                    <p className="text-slate-500">Manage your customer relationships</p>
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input 
                        type="text" 
                        placeholder="Search customers..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#F97316] outline-none text-sm w-64 shadow-sm" 
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(148,163,184,0.1)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lifetime Spent</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Order</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Loyalty Tier</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading customers...</td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No customers found.</td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer, idx) => (
                                    <tr key={customer.customer_id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#F97316]/10 flex items-center justify-center text-[#F97316] font-bold">
                                                    {customer.customer_name.charAt(9)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{customer.customer_name}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono">{customer.customer_id.substring(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">{customer.total_orders}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-black text-slate-900">₹{customer.total_spent.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(customer.last_order_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getLoyaltyBadge(customer.total_orders)}
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
