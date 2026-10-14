'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import GoogleLocationPicker from '@/components/ui/GoogleLocationPicker';
import {
  Store,
  Clock,
  Truck,
  MapPin,
  Phone,
  Upload,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Instagram,
  Sparkles,
  Star,
  Sliders,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  const [operatingHours, setOperatingHours] = useState<Record<string, { open: boolean; start: string; end: string }>>({
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

      const { data } = await supabase
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/banner_${Date.now()}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setBannerUrl(publicUrl);
      toast.success('Store banner uploaded!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to upload banner.');
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

    const serializedAddress = bannerUrl ? `${address} ||| ${bannerUrl}` : address;

    const { error } = await supabase.from('shopkeeper').upsert({
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
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    if (error) {
      toast.error('Failed to save store details.');
    } else {
      toast.success('Store details successfully updated!');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading store profile...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-36 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Storefront Setup</h1>
        <p className="text-sm text-slate-500 mt-1">Configure your public store details, banner branding, delivery radius, and open hours.</p>
      </div>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12">
        {/* Left Column: Previews & Visuals */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Live Store Preview Card */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 overflow-hidden space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600" /> Live Store Preview
              </h2>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${
                isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                {isOpen ? 'Open Now' : 'Closed'}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden relative aspect-[21/9] bg-slate-100">
              <img
                alt="Shop Banner"
                className="w-full h-full object-cover"
                src={bannerUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider mb-1 inline-block">
                  Verified Local Store
                </span>
                <p className="text-xl font-black leading-tight drop-shadow-sm truncate">{shopName || 'Your Store'}</p>
                <p className="text-xs text-white/80 truncate mt-0.5">{tagline || 'Fast neighborhood deliveries'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-800 ml-0.5">4.9</span>
                  <span className="text-slate-400">(Verified)</span>
                </div>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block">
                  {category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">Store Status:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isOpen}
                    onChange={(e) => setIsOpen(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>
            </div>
          </section>

          {/* Banner Image Uploader */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" /> Storefront Banner
            </h3>
            <input
              type="file"
              id="banner-upload"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <label
              htmlFor="banner-upload"
              className={`border-2 border-dashed border-slate-200 rounded-2xl aspect-[3/1] flex flex-col items-center justify-center bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-colors cursor-pointer group p-4 ${
                uploadingPhoto ? 'opacity-50' : ''
              }`}
            >
              {uploadingPhoto ? (
                <span className="text-emerald-700 font-bold text-sm">Uploading banner...</span>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 transition-all mb-2" />
                  <p className="text-xs font-bold text-slate-700">Click or Drag to Upload Banner</p>
                  <p className="text-[10px] text-slate-400 mt-1">Recommended: 1200 x 400px (JPG/PNG)</p>
                </>
              )}
            </label>
          </section>
        </div>

        {/* Right Column: Forms & Settings */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* General Information */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-600" /> Basic Store Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Store Name</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-medium bg-white"
                >
                  <option>Grocery</option>
                  <option>Dairy & Eggs</option>
                  <option>Fresh Produce</option>
                  <option>Snacks & Munchies</option>
                  <option>Electronics</option>
                  <option>Stationery</option>
                  <option>Medicine</option>
                  <option>Home Needs</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Tagline / Short Pitch</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Pure organic milk and fresh veggies daily"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Store Address</label>
                <button
                  type="button"
                  onClick={() => setShowMapplsPicker(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Locate on GPS
                </button>
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Phone Number</label>
                <div className="flex">
                  <span className="px-3 flex items-center border border-r-0 border-slate-200 rounded-l-xl bg-slate-50 text-slate-600 text-xs font-bold">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-r-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">WhatsApp Business</label>
                <div className="flex">
                  <span className="px-3 flex items-center border border-r-0 border-slate-200 rounded-l-xl bg-slate-50 text-slate-600 text-xs font-bold">+91</span>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-r-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Logistics & Delivery Radius */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" /> Delivery & Ordering Rules
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Delivery Radius</label>
                <span className="text-sm text-emerald-700 font-black">{deliveryRadius} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={deliveryRadius}
                onChange={(e) => setDeliveryRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Min Order (₹)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Estimated ETA (mins)</label>
                <input
                  type="number"
                  value={etaMins}
                  onChange={(e) => setEtaMins(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Delivery Fee (₹)</label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-medium"
                />
              </div>
            </div>
          </section>

          {/* Operating Hours */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> Store Operating Schedule
            </h3>

            <div className="divide-y divide-slate-100">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex flex-wrap items-center justify-between gap-4 py-2.5 text-xs">
                  <div className="flex items-center gap-3 w-32">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={operatingHours[day]?.open}
                        onChange={(e) =>
                          setOperatingHours((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], open: e.target.checked },
                          }))
                        }
                      />
                      <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600" />
                    </label>
                    <span className="font-bold text-slate-800">{day}</span>
                  </div>

                  {!operatingHours[day]?.open ? (
                    <span className="text-slate-400 font-medium italic">Closed for orders</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={operatingHours[day]?.start}
                        onChange={(e) =>
                          setOperatingHours((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], start: e.target.value },
                          }))
                        }
                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-medium"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="time"
                        value={operatingHours[day]?.end}
                        onChange={(e) =>
                          setOperatingHours((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], end: e.target.value },
                          }))
                        }
                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-medium"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Floating Save Changes Bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-slate-200/80 p-4 z-40 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full max-w-4xl h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving changes...' : 'Save Store Details'}
        </motion.button>
      </div>

      <GoogleLocationPicker
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
