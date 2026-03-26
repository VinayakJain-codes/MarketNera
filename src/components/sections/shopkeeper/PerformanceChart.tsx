"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", sales: 4000, fulfillment: 94 },
  { name: "Tue", sales: 3000, fulfillment: 88 },
  { name: "Wed", sales: 2000, fulfillment: 98 },
  { name: "Thu", sales: 2780, fulfillment: 92 },
  { name: "Fri", sales: 1890, fulfillment: 85 },
  { name: "Sat", sales: 2390, fulfillment: 96 },
  { name: "Sun", sales: 3490, fulfillment: 99 },
];

export default function PerformanceChart() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5 flex flex-col h-full w-full">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Sales & Fulfillment Performance</h3>
      </div>
      <div className="p-6 flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
            <YAxis yAxisId="left" orientation="left" stroke="#FF9933" axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#138808" axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar yAxisId="left" dataKey="sales" name="Sales ($)" fill="#FF9933" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="fulfillment" name="Fulfillment (%)" fill="#138808" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
