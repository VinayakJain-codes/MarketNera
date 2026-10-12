'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import LeafletLocationPicker from '@/components/ui/LeafletLocationPicker';
import {
  User,
  Store,
  Bell,
  Shield,
  MapPin,
  Save,
  KeyRound,
  AlertTriangle,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'shop' | 'notifications' | 'security'>('profile');
  const [showMapplsPicker, setShowMapplsPicker] = useState(false);

  // Profile State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Shop State
  const [shopName, setShopName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [shopPhoto, setShopPhoto] = useState('');

  // Notification State
  const [notifSound, setNotifSound] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifLowStock, setNotifLowStock] = useState(true);
  const [notifDaily, setNotifDaily] = useState(false);

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setEmail(session.user.email || '');
      setFullName(session.user.user_metadata?.full_name || '');

      const { data } = await supabase
        .from('shopkeeper')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (data) {
        setPhone(data.phone || '');
        setShopName(data.shop_name || '');
        setTagline(data.tagline || '');
        setCategory(data.category || 'Grocery');
        const addressParts = (data.address || '').split(' ||| ');
        setAddress(addressParts[0]);
        setShopPhoto(addressParts[1] || '');
        setNotifSound(data.notif_new_order_sound ?? true);
        setNotifEmail(data.notif_new_order_email ?? true);
        setNotifLowStock(data.notif_low_stock_email ?? true);
        setNotifDaily(data.notif_daily_summary ?? false);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      await supabase.from('shopkeeper').update({
        phone: phone,
      }).eq('user_id', session.user.id);
      toast.success('Profile updated successfully!');
    }
    setSaving(false);
  };

  const handleSaveShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const serializedAddress = shopPhoto ? `${address} ||| ${shopPhoto}` : address;
      await supabase.from('shopkeeper').update({
        shop_name: shopName,
        tagline: tagline,
        category: category,
        address: serializedAddress,
      }).eq('user_id', session.user.id);
      toast.success('Store details saved!');
    }
    setSaving(false);
  };

  const handleToggleNotification = async (field: string, value: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('shopkeeper').update({
        [field]: value,
      }).eq('user_id', session.user.id);
      toast.success('Preferences updated!');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading settings...
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'shop' as const, label: 'Store Details', icon: Store },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security & Access', icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Merchant Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure your merchant profile, storefront details, and account preferences.</p>
      </div>

      {/* Tabs Navigation */}
      <nav className="flex gap-2 border-b border-slate-200/80 pb-px overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-3xl font-black shadow-md shadow-emerald-600/20">
                {fullName ? fullName.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-lg font-bold text-slate-900">{fullName || 'Merchant Account'}</h3>
                <p className="text-xs text-slate-500">{email}</p>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 mt-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Merchant
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email Address</label>
                <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium">
                  {email}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-8 py-3 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8">
            <form onSubmit={handleSaveShop} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Store Name</label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Tagline / Slogan</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Fresh Groceries & Dairy Daily"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Primary Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium bg-white"
                    >
                      <option>Grocery</option>
                      <option>Fashion</option>
                      <option>Electronics</option>
                      <option>Home</option>
                      <option>Stationery</option>
                      <option>Medicine</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Full Store Address</label>
                      <button
                        type="button"
                        onClick={() => setShowMapplsPicker(true)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Locate on GPS Map
                      </button>
                    </div>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, landmark, pin code..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                      rows={5}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Store Details'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Alert & Sound Preferences</h3>
            <div className="divide-y divide-slate-100">
              <NotificationToggle
                title="New Order Sound"
                desc="Play a notification chime when an incoming order arrives"
                checked={notifSound}
                onChange={(v) => { setNotifSound(v); handleToggleNotification('notif_new_order_sound', v); }}
              />
              <NotificationToggle
                title="New Order Email Alerts"
                desc="Receive immediate order summary emails for every purchase"
                checked={notifEmail}
                onChange={(v) => { setNotifEmail(v); handleToggleNotification('notif_new_order_email', v); }}
              />
              <NotificationToggle
                title="Low Stock Alert"
                desc="Notify whenever inventory counts fall below safe levels"
                checked={notifLowStock}
                onChange={(v) => { setNotifLowStock(v); handleToggleNotification('notif_low_stock_email', v); }}
              />
              <NotificationToggle
                title="Daily Business Digest"
                desc="Receive a daily summary of revenue, customer traffic, and top sales"
                checked={notifDaily}
                onChange={(v) => { setNotifDaily(v); handleToggleNotification('notif_daily_summary', v); }}
              />
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 text-slate-900">
                <KeyRound className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold">Change Password</h3>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-5 max-w-xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-rose-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600" /> Danger Zone
                  </h3>
                  <p className="text-rose-700 text-xs">
                    Deleting your merchant account will permanently erase your storefront, listed catalog, and order history.
                  </p>
                </div>
                <button
                  onClick={() => alert('Please contact support to delete your merchant account.')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm text-sm active:scale-95 transition-all whitespace-nowrap flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <LeafletLocationPicker
        isOpen={showMapplsPicker}
        onClose={() => setShowMapplsPicker(false)}
        onLocationSelected={(loc) => {
          setShowMapplsPicker(false);
          setAddress(loc.addressLine);
        }}
      />
    </div>
  );
}

function NotificationToggle({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 transition-colors">
      <div className="pr-4">
        <p className="font-bold text-slate-900 text-sm">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
      </label>
    </div>
  );
}
