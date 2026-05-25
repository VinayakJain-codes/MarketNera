'use client';

import { useState } from 'react';

export default function CalendarPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Calendar & Planning</h1>
                    <p className="text-slate-500">Manage orders and shop schedule</p>
                </div>
                <button className="bg-[#F97316] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-[#F97316]/20 hover:bg-[#e06612] transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">event_busy</span>
                    Mark Closed Day
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(148,163,184,0.1)] p-6 min-h-[600px] flex items-center justify-center">
                    <div className="text-center text-slate-400">
                        <span className="material-symbols-outlined text-6xl mb-4 opacity-50">calendar_month</span>
                        <p className="font-medium text-lg text-slate-500">Calendar Component Loading...</p>
                        <p className="text-sm mt-1">Full calendar view will be connected here.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(148,163,184,0.1)] p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#F97316]">upcoming</span>
                            Upcoming Deliveries
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl border-l-4 border-l-[#F97316]">
                                <div className="font-bold text-slate-900 text-sm">Order #ORD-8832</div>
                                <div className="text-xs text-slate-500 mt-1">Tomorrow, 10:00 AM</div>
                            </div>
                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl border-l-4 border-l-[#F97316]">
                                <div className="font-bold text-slate-900 text-sm">Order #ORD-7199</div>
                                <div className="text-xs text-slate-500 mt-1">Tomorrow, 02:30 PM</div>
                            </div>
                            <div className="text-center text-sm font-semibold text-[#F97316] cursor-pointer mt-2 hover:underline">
                                View all upcoming
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(148,163,184,0.1)] p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#13ec5b]">event_available</span>
                            Shop Closures
                        </h3>
                        <div className="text-sm text-slate-500 text-center py-6">
                            No upcoming closures scheduled.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
