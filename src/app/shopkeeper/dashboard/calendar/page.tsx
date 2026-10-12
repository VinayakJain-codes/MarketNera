'use client';

import { useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  Plus,
  AlertCircle,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CalendarPage() {
  const [markedClosed, setMarkedClosed] = useState(false);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Schedule & Deliveries</h1>
          <p className="text-sm text-slate-500 mt-1">Manage store calendar, scheduled customer dispatches, and holiday closures.</p>
        </div>
        <button
          onClick={() => {
            setMarkedClosed(!markedClosed);
            toast.success(markedClosed ? 'Store reopened for bookings' : 'Store marked closed for today');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            markedClosed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <CalendarDays className="w-4 h-4 text-emerald-600" />
          {markedClosed ? 'Reopen Store' : 'Schedule Closure Day'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 min-h-[500px] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Weekly Delivery Heatmap</h2>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Active Schedule
            </span>
          </div>

          <div className="grid grid-cols-7 gap-3 py-8 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{day}</span>
                <span className={`text-xl font-black ${i < 5 ? 'text-slate-900' : 'text-emerald-600'}`}>{12 + i}</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {i % 2 === 0 ? '18 Orders' : '24 Orders'}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> Normal operating hours: 09:00 AM – 09:00 PM
            </span>
            <span className="text-emerald-700 font-semibold">Standard ETA: 15 mins</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" /> Upcoming Scheduled Dispatches
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl border-l-4 border-l-emerald-600">
                <div className="font-bold text-slate-900 text-xs">Order #ORD-8832 (Grocery Basket)</div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Today, 04:30 PM • 3 items
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl border-l-4 border-l-emerald-600">
                <div className="font-bold text-slate-900 text-xs">Order #ORD-7199 (Dairy & Bread)</div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Today, 06:15 PM • 2 items
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Holiday / Closed Days
            </h3>
            <div className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No store closures scheduled. Store is open for all regular business hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
