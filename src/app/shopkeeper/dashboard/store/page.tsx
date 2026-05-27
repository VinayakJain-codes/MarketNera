'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import MapplsLocationPicker from '@/components/ui/MapplsLocationPicker';

export default function StoreSetupPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shopName, setShopName] = useState('Green Grocery');
  const [category, setCategory] = useState('Grocery');
  const [tagline, setTagline] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [deliveryRadius, setDeliveryRadius] = useState(10);
  const [minOrder, setMinOrder] = useState(250);
  const [etaMins, setEtaMins] = useState(45);
  const [deliveryFee, setDeliveryFee] = useState(30);
  const [instagram, setInstagram] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showMapplsPicker, setShowMapplsPicker] = useState(false);
  const [operatingHours, setOperatingHours] = useState<Record<string, { open: boolean, start: string, end: string }>>({
    Monday: { open: true, start: '09:00', end: '21:00' },
    Tuesday: { open: true, start: '09:00', end: '21:00' },
    Wednesday: { open: true, start: '09:00', end: '21:00' },
    Thursday: { open: true, start: '09:00', end: '21:00' },
    Friday: { open: true, start: '09:00', end: '21:00' },
    Saturday: { open: true, start: '09:00', end: '21:00' },
    Sunday: { open: false, start: '09:00', end: '21:00' },
  });

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data, error } = await supabase
        .from('shopkeeper')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (data) {
        setShopName(data.shop_name || '');
        setCategory(data.category || 'Grocery');
        setPhone(data.phone || '');
        setTagline(data.tagline || '');
        setIsOpen(data.is_open ?? true);
        setDeliveryRadius(data.delivery_radius_km || 10);
        setMinOrder(data.min_order_amount || 0);
        setEtaMins(data.delivery_time_minutes || 45);
        setDeliveryFee(data.delivery_fee || 0);
        setWhatsapp(data.whatsapp || '');
        setInstagram(data.instagram || '');
        
        if (data.operating_hours && Object.keys(data.operating_hours).length > 0) {
           setOperatingHours(data.operating_hours);
        }
        
        // Handle legacy address-based photo url
        const addressParts = (data.address || '').split(' ||| ');
        setAddress(addressParts[0]);
        setBannerUrl(data.banner_url || addressParts[1] || '');
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!file || !userId) return;

    setUploadingPhoto(true);
    try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}/banner_${Date.now()}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
            .from("product-images")
            .upload(fileName, file);

        if (uploadErr) throw uploadErr;

        const { data: { publicUrl } } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);

        setBannerUrl(publicUrl);
    } catch (err: any) {
        console.error(err);
        alert("Failed to upload photo.");
    } finally {
        setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setSaving(false);
      return;
    }

    // Preserve legacy address format if needed, though we now have banner_url
    const serializedAddress = bannerUrl ? `${address} ||| ${bannerUrl}` : address;

    await supabase.from('shopkeeper').upsert({
      user_id: session.user.id,
      shop_name: shopName,
      category,
      tagline,
      address: serializedAddress,
      phone,
      is_open: isOpen,
      delivery_radius_km: deliveryRadius,
      min_order_amount: minOrder,
      delivery_time_minutes: etaMins,
      delivery_fee: deliveryFee,
      whatsapp,
      instagram,
      banner_url: bannerUrl,
      operating_hours: operatingHours,
      updated_at: new Date().toISOString()
    });

    setSaving(false);
    alert('Store details saved!');
  };

  if (loading) {
    return <div className="p-8 text-[var(--dash-text)]">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 flex flex-col gap-6 lg:grid lg:grid-cols-12 text-[#0b1c30]">
      {/* Left Column: Previews & Visuals */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Live Store Preview Card */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(148,163,184,0.1)] border border-[#eff4ff] overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#9d4300]">Live Store Preview</h2>
            <div className="flex items-center gap-2 bg-[#38fd69]/20 px-3 py-1 rounded-full border border-[#38fd69]">
              <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-[#006e25]' : 'bg-red-500'}`}></span>
              <span className={`text-xs font-semibold ${isOpen ? 'text-[#007126]' : 'text-red-700'}`}>
                {isOpen ? 'Live' : 'Closed'}
              </span>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden mb-4 relative aspect-[21/9]">
            <img 
              alt="Shop Banner" 
              className="w-full h-full object-cover" 
              src={bannerUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <span className="bg-[#f97316] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider mb-1 inline-block">Top Rated</span>
              <p className="text-2xl font-semibold leading-tight">{shopName || 'Your Store'}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[#FFD700] text-sm">★</span>
                <span className="text-[#FFD700] text-sm">★</span>
                <span className="text-[#FFD700] text-sm">★</span>
                <span className="text-[#FFD700] text-sm">★</span>
                <span className="text-[#FFD700] text-sm opacity-50">★</span>
                <span className="text-xs ml-1 text-[#584237]">4.5 (1.2k)</span>
              </div>
              <span className="bg-[#dce9ff] text-[#584237] text-xs px-3 py-1 rounded-full">{category}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isOpen}
                  onChange={(e) => setIsOpen(e.target.checked)}
                />
                <div className="w-11 h-6 bg-[#d3e4fe] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006e25]"></div>
              </label>
              <span className={`text-xs font-bold ${isOpen ? 'text-[#006e25]' : 'text-red-500'}`}>{isOpen ? 'Open' : 'Closed'}</span>
            </div>
          </div>
        </section>

        {/* Banner Image Uploader */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(148,163,184,0.1)] border border-[#eff4ff]">
          <h3 className="text-xl font-semibold text-[#9d4300] mb-4">Banner Image</h3>
          <input 
             type="file" 
             id="banner-upload" 
             className="hidden" 
             accept="image/*"
             onChange={handlePhotoUpload} 
          />
          <label htmlFor="banner-upload" className={`border-2 border-dashed border-[#e0c0b1] rounded-xl aspect-[3/1] flex flex-col items-center justify-center bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer group ${uploadingPhoto ? 'opacity-50' : ''}`}>
            {uploadingPhoto ? (
               <span className="text-[#8c7164] font-medium text-lg">Uploading...</span>
            ) : (
               <>
                 <span className="text-[#8c7164] text-4xl mb-2 group-hover:scale-110 transition-transform">+</span>
                 <p className="text-sm font-medium text-[#584237]">Click or Drag to Upload</p>
                 <p className="text-[10px] text-[#8c7164] mt-1 uppercase tracking-widest">Recommended: 1200 x 400px</p>
               </>
            )}
          </label>
        </section>
      </div>

      {/* Right Column: Forms & Settings */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Store Info Form */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(148,163,184,0.1)] border border-[#eff4ff]">
          <h3 className="text-xl font-semibold text-[#9d4300] mb-6 flex items-center gap-2">
            Store Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#584237]">Store Name</label>
              <input 
                type="text" 
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-[#e0c0b1] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#584237]">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-[#e0c0b1] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all bg-white"
              >
                <option value="Grocery">Grocery</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Stationery">Stationery</option>
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Home">Home</option>
              </select>
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-medium text-[#584237]">Tagline</label>
              <input 
                type="text" 
                placeholder="Freshly picked for your family"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-[#e0c0b1] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all" 
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#584237]">Full Address</label>
                <button
                    type="button"
                    onClick={() => setShowMapplsPicker(true)}
                    className="text-xs font-bold text-[#f97316] hover:text-[#9d4300] transition-colors flex items-center gap-1 bg-[#fff5eb] px-2 py-1 rounded-md"
                >
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    Locate on Map
                </button>
              </div>
              <textarea 
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-4 rounded-lg border border-[#e0c0b1] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#584237]">Phone Number</label>
              <div className="flex">
                <span className="h-12 px-3 flex items-center border border-r-0 border-[#e0c0b1] rounded-l-lg bg-[#e5eeff] text-[#584237] text-sm">+91</span>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 px-4 rounded-r-lg border border-[#e0c0b1] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#584237]">WhatsApp Business</label>
              <div className="flex">
                <span className="h-12 px-3 flex items-center border border-r-0 border-[#e0c0b1] rounded-l-lg bg-[#e5eeff] text-[#584237] text-sm">+91</span>
                <input 
                  type="tel" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full h-12 px-4 rounded-r-lg border border-[#e0c0b1] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Operating Hours Grid */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(148,163,184,0.1)] border border-[#eff4ff]">
          <h3 className="text-xl font-semibold text-[#9d4300] mb-6 flex items-center gap-2">
            Operating Hours
          </h3>
          <div className="flex flex-col gap-3">
            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl hover:bg-[#eff4ff] transition-colors group">
                  <div className="flex items-center gap-3 w-32">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                         type="checkbox" 
                         className="sr-only peer" 
                         checked={operatingHours[day]?.open} 
                         onChange={(e) => setOperatingHours(prev => ({ ...prev, [day]: { ...prev[day], open: e.target.checked } }))}
                      />
                      <div className="w-9 h-5 bg-[#d3e4fe] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006e25]"></div>
                    </label>
                    <span className="text-sm font-bold">{day}</span>
                  </div>
                  {!operatingHours[day]?.open ? (
                    <div className="flex items-center gap-2 flex-grow justify-end md:justify-start opacity-40">
                      <span className="text-sm text-[#ba1a1a] italic">Closed for Business</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-grow justify-end md:justify-start">
                      <input 
                         type="time" 
                         value={operatingHours[day]?.start} 
                         onChange={(e) => setOperatingHours(prev => ({ ...prev, [day]: { ...prev[day], start: e.target.value } }))}
                         className="px-2 py-1 rounded border border-[#e0c0b1] bg-white text-sm" 
                      />
                      <span className="text-[#584237]">to</span>
                      <input 
                         type="time" 
                         value={operatingHours[day]?.end} 
                         onChange={(e) => setOperatingHours(prev => ({ ...prev, [day]: { ...prev[day], end: e.target.value } }))}
                         className="px-2 py-1 rounded border border-[#e0c0b1] bg-white text-sm" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery Settings */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(148,163,184,0.1)] border border-[#eff4ff]">
          <h3 className="text-xl font-semibold text-[#9d4300] mb-6 flex items-center gap-2">
            Logistics & Delivery
          </h3>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-[#584237]">Delivery Radius</label>
                <span className="text-sm text-[#f97316] font-bold"><span>{deliveryRadius}</span> km</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={deliveryRadius}
                onChange={(e) => setDeliveryRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-[#d3e4fe] rounded-lg appearance-none cursor-pointer accent-[#f97316]" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#584237]">Min Order ₹</label>
                <input 
                  type="number" 
                  value={minOrder}
                  onChange={(e) => setMinOrder(parseInt(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-lg border border-[#e0c0b1] focus:border-[#f97316] outline-none" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#584237]">ETA (mins)</label>
                <input 
                  type="number" 
                  value={etaMins}
                  onChange={(e) => setEtaMins(parseInt(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-lg border border-[#e0c0b1] focus:border-[#f97316] outline-none" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#584237]">Delivery Fee ₹</label>
                <input 
                  type="number" 
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-lg border border-[#e0c0b1] focus:border-[#f97316] outline-none" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(148,163,184,0.1)] border border-[#eff4ff]">
          <h3 className="text-xl font-semibold text-[#9d4300] mb-6 flex items-center gap-2">
            Connect Channels
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[#e0c0b1] focus-within:border-[#f97316] transition-all">
              <span className="text-xl text-[#E1306C] w-8 h-8 flex items-center justify-center font-bold">IG</span>
              <div className="flex-grow">
                <label className="text-[10px] uppercase font-bold text-[#584237] tracking-wider">Instagram Username</label>
                <input 
                  type="text" 
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full border-none p-0 focus:ring-0 text-sm outline-none" 
                  placeholder="@yourstore"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/80 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 md:p-6 z-[55] flex justify-center border-t border-[#e5eeff]">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="bg-[#f97316] text-white w-full max-w-4xl h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#f97316]/20 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      <MapplsLocationPicker
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
