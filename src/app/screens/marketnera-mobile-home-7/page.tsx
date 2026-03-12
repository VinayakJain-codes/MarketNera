export default function Screen() {
  return (
    <>
      
<div className="max-w-[480px] mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-xl relative pb-24">
{/* Header &amp; Search */}
<header className="sticky top-0 z-50 bg-white dark:bg-slate-900 px-4 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-2">
<div className="text-primary">
<span className="material-symbols-outlined text-3xl">location_on</span>
</div>
<div>
<div className="flex items-center gap-1">
<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivering to</span>
<span className="material-symbols-outlined text-xs">expand_more</span>
</div>
<p className="text-sm font-semibold truncate max-w-[180px]">Indiranagar, Bengaluru, 560038</p>
</div>
</div>
<div className="flex gap-3">
<button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
<span className="material-symbols-outlined">notifications</span>
</button>
<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
<img alt="Profile" className="w-full h-full object-cover" data-alt="User profile avatar smiling person" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy06Lzzlu6hJ9eoai2Tn83vZVcHB2zyZVYp-mUGfRvg8bDaPjYmTnJV-mXhPvt1ASHhUxSKlMOytpFace3GUoBdFRAr2HQlR-R-QB6fvG5evHk5XOZwpFmWZlIy0pAPAtT_Eh2KanJwpXeourQ91V1m0AcWpSsr2QLjMq0JfHJCbJ4X3xQMxJuag41DKQUjV_jp4SGYlMWCig9ozuvlnHQfIGPmaCaGrar4DTb09EhJMLV_tq-hSzoCj2IykQLFN6fx-P-c_ruKchd"/>
</div>
</div>
</div>
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
<span className="material-symbols-outlined text-xl">search</span>
</div>
<input className="block w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary shadow-sm" placeholder="Search for 'Amul Milk', 'Batter', 'Soap'..." type="text"/>
<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
<span className="material-symbols-outlined text-xl">mic</span>
</div>
</div>
</header>
{/* Categories Scrolling */}
<div className="px-4 py-4">
<div className="flex gap-3 overflow-x-auto no-scrollbar">
<div className="flex flex-col items-center gap-2 min-w-[72px]">
<div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-orange-100 dark:border-orange-800/30">
<span className="material-symbols-outlined text-orange-500 text-3xl">grocery</span>
</div>
<span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Grocery</span>
</div>
<div className="flex flex-col items-center gap-2 min-w-[72px]">
<div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/30">
<span className="material-symbols-outlined text-blue-500 text-3xl">devices</span>
</div>
<span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Electronics</span>
</div>
<div className="flex flex-col items-center gap-2 min-w-[72px]">
<div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center border border-red-100 dark:border-red-800/30">
<span className="material-symbols-outlined text-red-500 text-3xl">medication</span>
</div>
<span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Medicine</span>
</div>
<div className="flex flex-col items-center gap-2 min-w-[72px]">
<div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center border border-purple-100 dark:border-purple-800/30">
<span className="material-symbols-outlined text-purple-500 text-3xl">edit_note</span>
</div>
<span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Stationery</span>
</div>
<div className="flex flex-col items-center gap-2 min-w-[72px]">
<div className="w-16 h-16 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center border border-yellow-100 dark:border-yellow-800/30">
<span className="material-symbols-outlined text-yellow-600 text-3xl">bakery_dining</span>
</div>
<span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Snacks</span>
</div>
</div>
</div>
{/* Featured Banners */}
<div className="px-4 py-2">
<div className="w-full h-36 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 p-6 flex justify-between items-center relative overflow-hidden">
<div className="z-10">
<h3 className="text-white text-xl font-bold leading-tight">Fresh Grocery<br/>at Your Doorstep</h3>
<p className="text-orange-100 text-xs mt-1">Get 20% off on your first order</p>
<button className="mt-3 px-4 py-1.5 bg-white text-orange-600 rounded-lg text-xs font-bold shadow-lg">ORDER NOW</button>
</div>
<div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20">
<span className="material-symbols-outlined text-[120px] text-white">shopping_basket</span>
</div>
</div>
</div>
{/* Nearby Shops Section */}
<section className="mt-6">
<div className="flex justify-between items-center px-4 mb-4">
<h2 className="text-lg font-bold">Nearby Shops</h2>
<a className="text-primary text-sm font-semibold" href="#">View All</a>
</div>
<div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2">
{/* Shop Card 1 */}
<div className="min-w-[240px] bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 overflow-hidden">
<div className="h-24 bg-slate-200 relative">
<img alt="Shop" className="w-full h-full object-cover" data-alt="A clean local general store interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFMu7vl9CnuwRjpE3LvE1P7-ZA5JvoEdyS7sjMezpXgWJR-3IVrzOTERpi0uudqkEslpatleU29FLRxrpFonlBT2XREID-QwVvY_0jVrvGvfjFJbJCfmwyIzIBMpRY-Wd3gwHxlno27-kS9y0QEM1PcUmQrOj5-3urLImhdpuqkVFvpv54Fdic5MyrPzcf_y6zvaxF8Gr1Jyr4q5qrC14J7cL4iTHm_M0i_012vROmhaaDaF9pKF9KJaqtSOqDflLdfGUxXcuQeKib"/>
<div className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded flex items-center gap-1">
<span className="material-symbols-outlined text-[12px] fill-1">verified</span> VERIFIED
                        </div>
</div>
<div className="p-3">
<h4 className="font-bold text-sm">Krishna Supermarket</h4>
<p className="text-xs text-slate-500 mt-0.5">0.8 km • 15-20 mins</p>
<div className="flex items-center gap-1 mt-2">
<span className="material-symbols-outlined text-yellow-400 text-sm fill-1">star</span>
<span className="text-xs font-bold">4.2</span>
<span className="text-[10px] text-slate-400">(500+)</span>
</div>
</div>
</div>
{/* Shop Card 2 */}
<div className="min-w-[240px] bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 overflow-hidden">
<div className="h-24 bg-slate-200 relative">
<img alt="Shop" className="w-full h-full object-cover" data-alt="Local vegetable and fruit market stall" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvts04zORgQUIB0YSMCwiEvec-z2_Yj309_yLN2N9V2yzZWBhRgf05de-2jQDCwCOfAL49W89XuNb1aqS5CdkZ_5s8X-bpVDfv7glnKfhLoQo0Xl08Blg1S3j1N3N15Igo9ifC8gqX9XiQaVqTjoUF2IyX2f2srZNJ25FiUji2r1avMu8v2cbAQhJjRLfFQL7BQ0S0_KZpn3AmZRJVwGOsNaMXkykgaudFPoIhvUqfEJ546GZdQ0VK-kE_H-rqRVQzjIfT-E8DcxcF"/>
<div className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded flex items-center gap-1">
<span className="material-symbols-outlined text-[12px] fill-1">verified</span> VERIFIED
                        </div>
</div>
<div className="p-3">
<h4 className="font-bold text-sm">Fresh Organic Hub</h4>
<p className="text-xs text-slate-500 mt-0.5">1.2 km • 25-30 mins</p>
<div className="flex items-center gap-1 mt-2">
<span className="material-symbols-outlined text-yellow-400 text-sm fill-1">star</span>
<span className="text-xs font-bold">4.8</span>
<span className="text-[10px] text-slate-400">(1k+)</span>
</div>
</div>
</div>
</div>
</section>
{/* Product Grid Section */}
<section className="mt-8 px-4">
<div className="flex justify-between items-center mb-4">
<h2 className="text-lg font-bold">Daily Essentials</h2>
<div className="flex gap-2">
<button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold rounded-full border border-slate-200 dark:border-slate-700">Sort</button>
<button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold rounded-full border border-slate-200 dark:border-slate-700">Filter</button>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
{/* Product Card 1 */}
<div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
<div className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden mb-3">
<img alt="Product" className="w-full h-full object-contain" data-alt="Fresh carton of full cream milk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU9ah0czt07YQW_D6WDx3hHHyT8rOWof3IK6yQEUPoNTFW04VQURXt3ODsIl6qaam1kCxgHdiP1QZmZZouWJZbbBrVFOsK6LhbzZRushFzNM9oIPhz7RnQg2fFy7v5KinsAsLDt-OxeAexU6kwHuL8Ukz9oFhZ5OnnW5vUmcupy0VK1I_i_hr31Kg5FjRZrgwyFzGMlVWcxUtZ7-lrcjjyfWeqchZiD41LcM129YAwskgIS8YLg4CfIX12sCtCGd3oh79zs4MCYZbS"/>
</div>
<div className="flex-grow">
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dairy &amp; Eggs</p>
<h5 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 mt-0.5 leading-snug">Fresh Full Cream Milk 500ml</h5>
<p className="text-[10px] text-primary font-medium mt-1">Krishna Supermarket</p>
</div>
<div className="flex items-center justify-between mt-3">
<div className="flex flex-col">
<span className="text-sm font-bold">₹32</span>
<span className="text-[10px] text-slate-400 line-through">₹35</span>
</div>
<button className="flex items-center gap-1 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-colors">
<span className="material-symbols-outlined text-sm">add</span> ADD
                        </button>
</div>
</div>
{/* Product Card 2 */}
<div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
<div className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden mb-3">
<img alt="Product" className="w-full h-full object-contain" data-alt="Loaf of sliced white sandwich bread" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG7Qj4LiMdju3e5M5KUvYwxkWjJAPZk-wC8Lx79JiOecd9RV_eb-OFumsYcBmPdyk4phizc5346cKtGn38P17lyFLNgB3vx7nfBmWfIp862JxSn8D_-CkjMWHzz7tsfarProIogelYUz2jn6zl9NaGW_4A8IXUmIfzpsJyMXUQ6DAz885OyGSxMFY4a_4-qG_CaM2yWCEDCw4DoRj_8TLdlHNPmRKhBWA3U9sP060AkaowLlaisALorHHqoXfbdUUgBMgIYEqemRuL"/>
</div>
<div className="flex-grow">
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Bakery</p>
<h5 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 mt-0.5 leading-snug">Premium Sliced Sandwich Bread 400g</h5>
<p className="text-[10px] text-primary font-medium mt-1">Fresh Organic Hub</p>
</div>
<div className="flex items-center justify-between mt-3">
<div className="flex flex-col">
<span className="text-sm font-bold">₹45</span>
<span className="text-[10px] text-slate-400 line-through">₹50</span>
</div>
<button className="flex items-center gap-1 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-colors">
<span className="material-symbols-outlined text-sm">add</span> ADD
                        </button>
</div>
</div>
{/* Product Card 3 */}
<div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
<div className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden mb-3">
<img alt="Product" className="w-full h-full object-contain" data-alt="Fresh yellow bananas on table" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO_jZ8UuAYEwQH7blCyefyoqj8DGmhDiDqMLe1ZvqmUWEUa5H1TOMqmqgv9DjjcS2pBUDC9KCHrY5JaFO7GAFM_M7SawY-p1SgonvP0xAgsIvQLC-Wk4PdeRaEr-nlErLa2o_lnWCq5oNWXmm670NB25HYL7Tu_-4F6ApExz70XXELZ_h3XVLEKbmGSwwE4v71nFFLwJ1FZYvM7h-lP8Kw7VwiAqMaj3d3ZaM6dpCRuQk7G31i4P4Upe2h83r-0ed1FWy8dyZ1Vi28"/>
</div>
<div className="flex-grow">
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fruits &amp; Veggies</p>
<h5 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 mt-0.5 leading-snug">Banana Robusta - 6 Units</h5>
<p className="text-[10px] text-primary font-medium mt-1">Fruit Market Pro</p>
</div>
<div className="flex items-center justify-between mt-3">
<div className="flex flex-col">
<span className="text-sm font-bold">₹28</span>
<span className="text-[10px] text-slate-400 line-through">₹40</span>
</div>
<button className="flex items-center gap-1 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-colors">
<span className="material-symbols-outlined text-sm">add</span> ADD
                        </button>
</div>
</div>
{/* Product Card 4 */}
<div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
<div className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden mb-3">
<img alt="Product" className="w-full h-full object-contain" data-alt="Bowl of various Indian snacks and spices" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbpLV9hcNIG_E1jYB0bQlJ6ESs4d2807CZ88727tp9DUZJDmTHrQpUCfjadfnpxIRvNS9dH9XSBwvpz7yMZ70VNUz2JvgSMNgA0ijSMyV-EUrBKW9EPX1sjGQxojIXPKWXljlsH4vwXmVN3ht-KATjdK2SFY9S08YekSBt9oJj0NN7dY5q5cHfed9ombdHtoHFU-GxA0HVTZ8PP5pEzHxa_T67kiO39Ek-kRRCYeOGBUtRD_qtU8puteXuQMPxag2AL4lQb8oy7jvm"/>
</div>
<div className="flex-grow">
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Snacks</p>
<h5 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 mt-0.5 leading-snug">Spicy Masala Peanut 150g</h5>
<p className="text-[10px] text-primary font-medium mt-1">Snack Corner</p>
</div>
<div className="flex items-center justify-between mt-3">
<div className="flex flex-col">
<span className="text-sm font-bold">₹65</span>
<span className="text-[10px] text-slate-400 line-through">₹75</span>
</div>
<button className="flex items-center gap-1 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-colors">
<span className="material-symbols-outlined text-sm">add</span> ADD
                        </button>
</div>
</div>
</div>
</section>
{/* Bottom Navigation */}
<nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex items-center justify-around py-3 z-50">
<a className="flex flex-col items-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined fill-1">home</span>
<span className="text-[10px] font-bold">Home</span>
</a>
<a className="flex flex-col items-center gap-1 text-slate-400" href="#">
<span className="material-symbols-outlined">storefront</span>
<span className="text-[10px] font-medium">Shops</span>
</a>
<div className="relative -mt-8">
<button className="w-14 h-14 bg-primary text-slate-900 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900">
<span className="material-symbols-outlined text-3xl">shopping_cart</span>
<div className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">2</div>
</button>
</div>
<a className="flex flex-col items-center gap-1 text-slate-400" href="#">
<span className="material-symbols-outlined">receipt_long</span>
<span className="text-[10px] font-medium">Orders</span>
</a>
<a className="flex flex-col items-center gap-1 text-slate-400" href="#">
<span className="material-symbols-outlined">person</span>
<span className="text-[10px] font-medium">Profile</span>
</a>
</nav>
</div>

```
    </>
  );
}
