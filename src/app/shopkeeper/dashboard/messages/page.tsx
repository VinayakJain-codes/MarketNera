'use client';

import { useState } from 'react';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  CheckCheck,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'customer',
      text: 'Hi, is my order dispatched yet? I need it before 12 PM if possible.',
      time: '10:40 AM',
    },
    {
      id: 2,
      sender: 'shopkeeper',
      text: 'Hello John! Yes, it has just been packed and the delivery partner is on the way. You should receive it in 15 minutes.',
      time: '10:41 AM',
    },
    {
      id: 3,
      sender: 'customer',
      text: "Thanks, I'll be waiting!",
      time: '10:42 AM',
    },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'shopkeeper',
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'shopkeeper',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-5rem)] w-full max-w-7xl mx-auto p-4 md:p-6 flex gap-6">
      {/* Conversations List */}
      <div className="w-80 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-black text-slate-900">Customer Messages</h2>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chat threads..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-xs font-medium transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {/* Active Chat */}
          <div className="p-4 flex items-start gap-3 cursor-pointer bg-emerald-50/60 border-l-4 border-l-emerald-600">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 shrink-0 flex items-center justify-center font-black text-emerald-700 text-sm relative">
              JS
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h4 className="font-bold text-slate-900 text-xs truncate">John Smith</h4>
                <span className="text-[10px] font-bold text-emerald-700">10:42 AM</span>
              </div>
              <p className="text-xs text-slate-600 font-medium truncate">Thanks, I'll be waiting!</p>
            </div>
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center shrink-0">
              1
            </span>
          </div>

          {/* Read Chat */}
          <div className="p-4 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors border-l-4 border-l-transparent">
            <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center font-bold text-slate-500 text-sm">
              MP
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h4 className="font-bold text-slate-900 text-xs truncate">Meera Patel</h4>
                <span className="text-[10px] font-medium text-slate-400">Yesterday</span>
              </div>
              <p className="text-xs text-slate-500 truncate">Can you replace the milk?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-sm">
              JS
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">John Smith</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active on Marketnera
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
              Order #8832
            </span>
            <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors flex items-center justify-center">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
          <div className="flex justify-center">
            <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Today
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.sender === 'shopkeeper';
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-tr-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                  }`}
                >
                  <p className="leading-relaxed font-medium">{m.text}</p>
                  <span
                    className={`text-[10px] block mt-1 font-medium ${
                      isMe ? 'text-white/80 text-right flex items-center justify-end gap-1' : 'text-slate-400'
                    }`}
                  >
                    {m.time} {isMe && <CheckCheck className="w-3 h-3 inline" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-slate-100 space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['Order is packed & ready', 'Dispatching via rider now', 'Item out of stock'].map((quick) => (
              <button
                key={quick}
                onClick={() => handleQuickReply(quick)}
                className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors whitespace-nowrap"
              >
                {quick}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.success('Media attachment dialog opened')}
              className="w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors flex items-center justify-center shrink-0 border border-slate-200"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Type message to customer..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:border-emerald-500 outline-none transition-colors"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
