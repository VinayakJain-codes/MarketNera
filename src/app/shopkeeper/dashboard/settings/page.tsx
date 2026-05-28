'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import LeafletLocationPicker from '@/components/ui/LeafletLocationPicker';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
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
      
      const { data, error } = await supabase
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
      // Update name in Auth metadata
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      // Update phone in shopkeeper profile
      await supabase.from('shopkeeper').update({
        phone: phone,
      }).eq('user_id', session.user.id);
      alert('Profile updated!');
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
      alert('Shop details updated!');
    }
    setSaving(false);
  };

  const handleToggleNotification = async (field: string, value: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('shopkeeper').update({
        [field]: value
      }).eq('user_id', session.user.id);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      alert(error.message);
    } else {
      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  if (loading) {
    return <div className="p-8 text-[var(--dash-text)]">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 bg-[#f8f9ff] min-h-screen text-[#0b1c30]">
      <h2 className="text-3xl font-semibold mb-6 text-[#0b1c30]">Merchant Settings</h2>
      
      {/* Tabs Navigation */}
      <nav className="flex border-b border-[#e0c0b1] mb-6 overflow-x-auto no-scrollbar">
        <button 
          className={`px-6 py-4 text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === 'profile' ? 'border-[#F97316] text-[#9d4300] font-medium' : 'border-transparent text-[#584237] hover:text-[#9d4300]'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`px-6 py-4 text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === 'shop' ? 'border-[#F97316] text-[#9d4300] font-medium' : 'border-transparent text-[#584237] hover:text-[#9d4300]'}`}
          onClick={() => setActiveTab('shop')}
        >
          Shop
        </button>
        <button 
          className={`px-6 py-4 text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === 'notifications' ? 'border-[#F97316] text-[#9d4300] font-medium' : 'border-transparent text-[#584237] hover:text-[#9d4300]'}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          className={`px-6 py-4 text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === 'security' ? 'border-[#F97316] text-[#9d4300] font-medium' : 'border-transparent text-[#584237] hover:text-[#9d4300]'}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </nav>

      <div className="mt-4">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.1)] p-6 md:p-8">
            <div className="flex flex-col items-center md:items-start mb-8">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-[#e5eeff] border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-4xl text-[#9d4300] font-bold">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'M'}
                </div>
              </div>
              <p className="mt-4 text-xs text-[#584237]">Recommended: Square image, max 2MB</p>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-[#584237] mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#e0c0b1] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#584237] mb-2">Email Address</label>
                <div className="flex items-center justify-between px-4 py-3 bg-[#eff4ff] rounded-lg border border-[#e0c0b1]">
                  <span className="text-[#0b1c30]">{email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#584237] mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#e0c0b1] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all" 
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-[#f97316] text-white text-sm font-medium px-8 py-3 rounded-full hover:shadow-lg active:scale-95 transition-all w-full md:w-auto disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.1)] p-6 md:p-8">
            <form onSubmit={handleSaveShop} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#584237] mb-2">Shop Name</label>
                    <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#e0c0b1] outline-none focus:border-[#f97316]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#584237] mb-2">Tagline</label>
                    <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#e0c0b1] outline-none focus:border-[#f97316]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#584237] mb-2">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#e0c0b1] outline-none focus:border-[#f97316] bg-white">
                      <option>Grocery</option>
                      <option>Fashion</option>
                      <option>Electronics</option>
                      <option>Home</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-[#584237]">Full Address</label>
                        <button
                            type="button"
                            onClick={() => setShowMapplsPicker(true)}
                            className="text-xs font-bold text-[#f97316] hover:text-[#9d4300] transition-colors flex items-center gap-1 bg-[#fff5eb] px-2 py-1 rounded-md"
                        >
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            Locate on Map
                        </button>
                    </div>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#e0c0b1] outline-none focus:border-[#f97316]" rows={6}></textarea>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={saving} className="bg-[#13EC5B] text-white font-medium px-8 py-3 rounded-full hover:shadow-lg active:scale-95 transition-all disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Shop Details'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.1)] p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6">Alert Preferences</h3>
            <div className="space-y-2">
              <NotificationToggle 
                title="New Order Sound" 
                desc="Play a chime when a customer places an order" 
                checked={notifSound} 
                onChange={(v) => { setNotifSound(v); handleToggleNotification('notif_new_order_sound', v); }} 
              />
              <NotificationToggle 
                title="New Order Email" 
                desc="Receive a detailed confirmation for every order" 
                checked={notifEmail} 
                onChange={(v) => { setNotifEmail(v); handleToggleNotification('notif_new_order_email', v); }} 
              />
              <NotificationToggle 
                title="Low Stock Alert" 
                desc="Notify when items fall below threshold" 
                checked={notifLowStock} 
                onChange={(v) => { setNotifLowStock(v); handleToggleNotification('notif_low_stock_email', v); }} 
              />
              <NotificationToggle 
                title="Daily Summary Email" 
                desc="Daily digest of sales and store traffic" 
                checked={notifDaily} 
                onChange={(v) => { setNotifDaily(v); handleToggleNotification('notif_daily_summary', v); }} 
              />
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.1)] p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-6">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-[#584237] mb-2">Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#e0c0b1] outline-none focus:border-[#f97316]" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#584237] mb-2">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#e0c0b1] outline-none focus:border-[#f97316]" required minLength={6} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#584237] mb-2">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#e0c0b1] outline-none focus:border-[#f97316]" required minLength={6} />
                  </div>
                </div>
                <button type="submit" disabled={saving} className="bg-[#f97316] text-white font-medium px-8 py-3 rounded-full hover:shadow-lg active:scale-95 transition-all disabled:opacity-50">
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
            
            <div className="bg-[#ba1a1a]/5 border border-[#ba1a1a]/20 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#ba1a1a] mb-1">Danger Zone</h3>
                  <p className="text-[#584237] text-sm">Deleting your account is permanent and cannot be undone. All your shop data and order history will be wiped.</p>
                </div>
                <button className="bg-[#ba1a1a] text-white font-medium px-6 py-3 rounded-full hover:shadow-lg active:scale-95 transition-all whitespace-nowrap">
                  Delete Account
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

function NotificationToggle({ title, desc, checked, onChange }: { title: string, desc: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-[#eff4ff] rounded-xl transition-colors">
      <div>
        <p className="font-bold text-[#0b1c30]">{title}</p>
        <p className="text-sm text-[#584237]">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-11 h-6 bg-[#d3e4fe] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f97316]"></div>
      </label>
    </div>
  );
}
