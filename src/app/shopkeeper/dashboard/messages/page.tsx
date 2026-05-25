'use client';

export default function MessagesPage() {
    return (
        <div className="h-[calc(100vh-6rem)] w-full max-w-7xl mx-auto pt-6 px-6 pb-2 flex gap-6">
            {/* Conversations List */}
            <div className="w-80 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(148,163,184,0.1)] flex flex-col overflow-hidden shrink-0">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="text-xl font-black text-slate-900 mb-4">Messages</h2>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#F97316] outline-none text-sm transition-colors" />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {/* Active Chat */}
                    <div className="p-4 flex items-start gap-3 cursor-pointer bg-[#F97316]/5 border-l-4 border-l-[#F97316]">
                        <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[#F97316]/20 flex items-center justify-center font-bold text-[#F97316]">JS</div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#13ec5b] border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="font-bold text-slate-900 truncate">John Smith</h4>
                                <span className="text-[10px] font-bold text-[#F97316]">10:42 AM</span>
                            </div>
                            <p className="text-xs text-slate-700 font-medium truncate">Thanks, I'll be waiting!</p>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            1
                        </div>
                    </div>

                    {/* Read Chat */}
                    <div className="p-4 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors border-l-4 border-l-transparent">
                        <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 overflow-hidden relative">
                            <div className="absolute inset-0 bg-slate-200 flex items-center justify-center font-bold text-slate-600">MP</div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="font-bold text-slate-900 truncate">Meera Patel</h4>
                                <span className="text-[10px] font-medium text-slate-400">Yesterday</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">Can you replace the milk?</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(148,163,184,0.1)] flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#F97316]/10 flex items-center justify-center font-bold text-[#F97316]">
                            JS
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">John Smith</h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#13ec5b]"></span>
                                Online
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                            Order #8832
                        </span>
                        <button className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
                    <div className="flex justify-center">
                        <span className="px-3 py-1 bg-slate-200 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Today
                        </span>
                    </div>

                    {/* Customer Message */}
                    <div className="flex justify-start">
                        <div className="max-w-[70%] bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                            <p className="text-sm text-slate-700">Hi, is my order dispatched yet? I need it before 12 PM if possible.</p>
                            <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">10:40 AM</span>
                        </div>
                    </div>

                    {/* Shopkeeper Message */}
                    <div className="flex justify-end">
                        <div className="max-w-[70%] bg-[#13ec5b]/10 border border-[#13ec5b]/20 p-4 rounded-2xl rounded-tr-sm shadow-sm">
                            <p className="text-sm text-slate-900 font-medium">Hello John! Yes, it has just been packed and the delivery partner is on the way. You should receive it in 15 minutes.</p>
                            <span className="text-[10px] text-[#13ec5b]/80 block mt-1.5 font-bold text-right flex items-center justify-end gap-1">
                                10:41 AM <span className="material-symbols-outlined text-[14px]">done_all</span>
                            </span>
                        </div>
                    </div>

                    {/* Customer Message */}
                    <div className="flex justify-start">
                        <div className="max-w-[70%] bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                            <p className="text-sm text-slate-700">Thanks, I'll be waiting!</p>
                            <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">10:42 AM</span>
                        </div>
                    </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="flex gap-2 mb-3 px-2 overflow-x-auto pb-1 hide-scrollbar">
                        <button className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100 hover:bg-orange-100 transition-colors whitespace-nowrap">
                            Order is ready
                        </button>
                        <button className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100 hover:bg-orange-100 transition-colors whitespace-nowrap">
                            Out of stock
                        </button>
                        <button className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100 hover:bg-orange-100 transition-colors whitespace-nowrap">
                            Dispatching now
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 transition-colors flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">attach_file</span>
                        </button>
                        <input type="text" placeholder="Type a message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm focus:bg-white focus:border-[#F97316] outline-none transition-colors" />
                        <button className="w-12 h-12 rounded-full bg-[#F97316] text-white hover:bg-[#e06612] transition-colors flex items-center justify-center shrink-0 shadow-md shadow-[#F97316]/30 hover:scale-105 active:scale-95">
                            <span className="material-symbols-outlined ml-1">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
