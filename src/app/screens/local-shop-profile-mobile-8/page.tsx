export default function Screen() {
  return (
    <>
      
<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
{/* Top Navigation Bar */}
<header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-4 md:px-10 py-3">
<div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
<div className="flex items-center gap-6">
<div className="flex items-center gap-2 text-primary">
<span className="material-symbols-outlined text-3xl">storefront</span>
<h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">Marketnera</h2>
</div>
<nav className="hidden md:flex items-center gap-6">
<a className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="#">Home</a>
<a className="text-primary text-sm font-semibold" href="#">Shops</a>
<a className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="#">Categories</a>
</nav>
</div>
<div className="flex flex-1 justify-end items-center gap-4">
<div className="relative hidden sm:block w-full max-w-xs">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">search</span>
<input className="w-full bg-primary/5 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50" placeholder="Search products in this shop..."/>
</div>
<button className="p-2 hover:bg-primary/10 rounded-full transition-colors">
<span className="material-symbols-outlined">shopping_cart</span>
</button>
<div className="size-9 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
<img alt="Profile" data-alt="User profile circular avatar image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM1GgqG8XTpx5POQaAX7f77ILXOhl36ir_jU-gf7k3wP6w3RhhGQmZTFq0QK21QFkUNHTU0S89IDL6Wc1AngRL3UsJ0kOakQffDztzAZeSIOChYIcspcE5Md7PRGzwaZy5_cYueTkDwSZPciie3q4QvExRdcdD2TuVxi98RdO6xGsjiR3GPTzVY4U3A5_YxMOaeIsMifJQLb6nZaAGokqaJL7YJjkIUfD5ZmZzKB5JQ5mrbTE0wmfU-l3wcaVYJnRn3L8AR5w0jern"/>
</div>
</div>
</div>
</header>
<main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
{/* Breadcrumbs */}
<div className="flex items-center gap-2 mb-6 text-sm">
<a className="text-primary hover:underline" href="#">Home</a>
<span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
<a className="text-primary hover:underline" href="#">Local Shops</a>
<span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
<span className="text-slate-500">Gupta General Store</span>
</div>
{/* Shop Header Profile Section */}
<div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
<div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
<div className="flex gap-5 items-center">
<div className="size-24 md:size-32 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-primary/20">
<img className="w-full h-full object-cover" data-alt="Traditional Indian general store front with shelves" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZNxX0mpwQ419ttNPQbkMEr_SMcf8cXs3Ei7pmBepbNz8Msho6XDbkiRJv0XZ6Cs5L_f_a1yZ6Mv8fhn2jYie3DSxdu3qtlba3_T97UaCvnT76W1lG2enNDHIlP71YTBEhalF1VSyLZWjaWTo1z0lhkVllKLgiTpXzllXanmXD6D4reJegqbwplGHcxmKq4PLj8nYuYEaqo9qg6157tzcxbo3C611obBeHQj4m4mse6Y4oE-18QOK4Ww0ZK1QVn_hWW824b4mC1P3j"/>
</div>
<div className="flex flex-col gap-1">
<div className="flex items-center gap-2">
<h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Gupta General Store</h1>
<span className="material-symbols-outlined text-primary text-xl">verified</span>
</div>
<p className="text-slate-600 dark:text-slate-400 font-medium">General Merchant &amp; Daily Essentials</p>
<div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-sm text-primary">location_on</span> Sector 45, Gurgaon
                            </span>
<span className="flex items-center gap-1 text-primary font-semibold">
<span className="material-symbols-outlined text-sm">schedule</span> Open until 9:00 PM
                            </span>
</div>
<div className="flex items-center gap-1 mt-2">
<span className="material-symbols-outlined text-orange-400 fill-current">star</span>
<span className="material-symbols-outlined text-orange-400 fill-current">star</span>
<span className="material-symbols-outlined text-orange-400 fill-current">star</span>
<span className="material-symbols-outlined text-orange-400 fill-current">star</span>
<span className="material-symbols-outlined text-slate-300">star</span>
<span className="text-xs ml-1 text-slate-400">(120 reviews)</span>
</div>
</div>
</div>
<div className="flex w-full md:w-auto gap-3">
<button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-lg transition-all border border-slate-200 dark:border-slate-700">
<span className="material-symbols-outlined">call</span>
                        Call
                    </button>
<button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-slate-900 font-bold rounded-lg shadow-lg shadow-primary/20 transition-all">
<span className="material-symbols-outlined">chat</span>
                        WhatsApp
                    </button>
</div>
</div>
</div>
{/* Categories and Products */}
<div className="flex flex-col gap-6">
<div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
<div className="flex gap-8">
<a className="pb-4 border-b-2 border-primary text-primary font-bold whitespace-nowrap" href="#">All Products</a>
<a className="pb-4 border-b-2 border-transparent text-slate-500 hover:text-primary transition-colors whitespace-nowrap" href="#">Groceries</a>
<a className="pb-4 border-b-2 border-transparent text-slate-500 hover:text-primary transition-colors whitespace-nowrap" href="#">Personal Care</a>
<a className="pb-4 border-b-2 border-transparent text-slate-500 hover:text-primary transition-colors whitespace-nowrap" href="#">Snacks</a>
<a className="pb-4 border-b-2 border-transparent text-slate-500 hover:text-primary transition-colors whitespace-nowrap" href="#">Beverages</a>
</div>
</div>
{/* Product Grid */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
{/* Product Card 1 */}
<div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col group hover:shadow-md transition-shadow">
<div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform" data-alt="Fresh red organic tomatoes on a wooden table" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAejNkCqFfMUFxYhtieU5c56uqI9zaqkjEOlunleYXx0F8LgJmctvIkvXbg6RSqbl1KmbBY4kPJ4D2S6aCqQ-R-8XFI2xid24p_Dub0KN1smmLTTwnZh5EnuoWG_5TGELX4bUGfHgSmW0rI_Kt224sTm0lcqKLCQVviA-ADvS9ndjEmiHDlo2c6W6f4kpH8o6lEvUbRask6dSG5Y3ZQ5G4q4blU8mvprx5lnGKeZyYjeGUeru436CMlni0waSYq4xQA9CUCwQ5SEvMp"/>
<span className="absolute top-2 right-2 bg-primary/90 text-slate-900 text-[10px] font-bold px-2 py-1 rounded">FRESH</span>
</div>
<div className="p-4 flex flex-col flex-1">
<h3 className="text-slate-900 dark:text-white font-semibold text-sm md:text-base mb-1">Organic Red Tomatoes</h3>
<p className="text-slate-400 text-xs mb-3">1 kg</p>
<div className="mt-auto flex items-center justify-between">
<span className="text-slate-900 dark:text-white font-bold text-lg">₹40</span>
<button className="bg-primary/10 hover:bg-primary text-primary hover:text-slate-900 p-2 rounded-lg transition-colors flex items-center justify-center">
<span className="material-symbols-outlined text-xl">add</span>
</button>
</div>
</div>
</div>
{/* Product Card 2 */}
<div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col group hover:shadow-md transition-shadow">
<div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform" data-alt="Bottle of fresh full cream milk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6fDuNMN9UrWWbSnsXxUqSkCZWJftwIOWoSsZKAJ6APgIyLDfeYYd6B9t1V5SgRDOhNMeq-_a6LCGGeJr6VwChuiD-G8cyZO6HbGQ9f5CLsIGs8TvJKpuw4_mz5hDVlYobRLRyvRCxN7b8xVM4e0mnaP9uK4ca7rlAoPAh6o8QQmdkuxdhnZRnIHjQN4bjcpJ_YtK6_Lo-R3HmMTzicZJ8rdtXBsHThK2v67FqMT_oRhAM-a3N-vLS1JNRXM5R0fYGAUEdtPCbrvz1"/>
</div>
<div className="p-4 flex flex-col flex-1">
<h3 className="text-slate-900 dark:text-white font-semibold text-sm md:text-base mb-1">Full Cream Milk</h3>
<p className="text-slate-400 text-xs mb-3">500 ml</p>
<div className="mt-auto flex items-center justify-between">
<span className="text-slate-900 dark:text-white font-bold text-lg">₹33</span>
<button className="bg-primary/10 hover:bg-primary text-primary hover:text-slate-900 p-2 rounded-lg transition-colors flex items-center justify-center">
<span className="material-symbols-outlined text-xl">add</span>
</button>
</div>
</div>
</div>
{/* Product Card 3 */}
<div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col group hover:shadow-md transition-shadow">
<div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform" data-alt="Premium long grain basmati rice in a bowl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfq0_dq0nD-9C6-JBkQv3Ul1S6rAcCx52VLqdhL5J7r00CWdd94OjcF0WebBVMJ5rZCdYz6sPqBl4zXkK44eOAJWsJ4mH-LZWR9NvvOJ0--bLiNOe5qbDj_0VeloySKhKc5LCzHuaI-fW2CH-VO0qOsLB5DzcnpQ2xjHdZ9eO_qnd-cmsNWb6zYhcbJk4WQGGVD16aYWNZRFsP4Dy2NPmR6lfM0yF_7IlSUu9am02Nvf_HzMl2_HJimU0ux6mMLMayJebbc3zOeOvf"/>
<span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">10% OFF</span>
</div>
<div className="p-4 flex flex-col flex-1">
<h3 className="text-slate-900 dark:text-white font-semibold text-sm md:text-base mb-1">Premium Basmati Rice</h3>
<p className="text-slate-400 text-xs mb-3">5 kg</p>
<div className="mt-auto flex items-center justify-between">
<div>
<span className="text-slate-900 dark:text-white font-bold text-lg">₹450</span>
<span className="text-slate-400 line-through text-xs ml-1">₹500</span>
</div>
<button className="bg-primary/10 hover:bg-primary text-primary hover:text-slate-900 p-2 rounded-lg transition-colors flex items-center justify-center">
<span className="material-symbols-outlined text-xl">add</span>
</button>
</div>
</div>
</div>
{/* Product Card 4 */}
<div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col group hover:shadow-md transition-shadow">
<div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform" data-alt="Variety of Indian snack packets on display" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhZDTK8JcfbLUOXbf9gRbeFGzMg3FfoEoEjMworM5l-P2zgToglRgZ18jXZB2pO157w6tfTx8G0Mz3JPrVbEl6zsVNT4poD2UDmp22Q9jpGIAIAPJXzBzVaVZSJ5RoNrk2hesBWZUukDwJtnu1Y9REDuoFm8KeOXY6amd8fs0lSL3dsqYu4tYGt0SsGAcKCwcwwMevoZFvHxsD496CD8W41UqR75cswUQKnuzNftD5YqcH6GBjfvlJU5--UPjjp9UA-brJMHFyxCIT"/>
</div>
<div className="p-4 flex flex-col flex-1">
<h3 className="text-slate-900 dark:text-white font-semibold text-sm md:text-base mb-1">Spicy Potato Chips</h3>
<p className="text-slate-400 text-xs mb-3">80g</p>
<div className="mt-auto flex items-center justify-between">
<span className="text-slate-900 dark:text-white font-bold text-lg">₹20</span>
<button className="bg-primary/10 hover:bg-primary text-primary hover:text-slate-900 p-2 rounded-lg transition-colors flex items-center justify-center">
<span className="material-symbols-outlined text-xl">add</span>
</button>
</div>
</div>
</div>
{/* Product Card 5 */}
<div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col group hover:shadow-md transition-shadow">
<div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform" data-alt="Pack of brown table eggs in a carton" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGgO3QlfUqXb5IhNuWs7dbe619QFm9H9dNo8b501lm00UUi8cdR9BPl9IBizsqDyQo6svYA97ZErJ5TyxU3NBNes472vP08PUEP9ERACm6vXu5JnGkXeMSiLVfAc_Z6XCkydYv97Sb8EQ6-4Lxo_fFDO6YGp2bDPaWw_Rk83WOtbZ3A3RjsteO3lt2sYLSDRinMeRCnFrK0_2T04mh4NyCgXWBnWrkGaDg1apLE4xU20ma3HF7m_X-ZcHScjNke7q6xkTiRvhrcz1d"/>
</div>
<div className="p-4 flex flex-col flex-1">
<h3 className="text-slate-900 dark:text-white font-semibold text-sm md:text-base mb-1">Farm Fresh Eggs</h3>
<p className="text-slate-400 text-xs mb-3">6 Units</p>
<div className="mt-auto flex items-center justify-between">
<span className="text-slate-900 dark:text-white font-bold text-lg">₹48</span>
<button className="bg-primary/10 hover:bg-primary text-primary hover:text-slate-900 p-2 rounded-lg transition-colors flex items-center justify-center">
<span className="material-symbols-outlined text-xl">add</span>
</button>
</div>
</div>
</div>
{/* Product Card 6 */}
<div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col group hover:shadow-md transition-shadow">
<div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform" data-alt="Organic sunflower cooking oil bottle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK6TLiIVAJB6MignO7xWjBbYR7Q2mJ92jqV8iYyo_vAtM9kJTDzcAg5-zlICOfLPvif4GRmFimfDv6rD_3NhfiRZ9qI6eEji_b7sy9Cx4snXTKcX1PU1NRqX-cWTiRp-0PNHJN_FgAFVtXQgv1r_hPGDM_d7aEvWldPa0DN5FiFB5_gAKoPbCYnXCIiU6JlVp9URDq_0Niqxn8DS9VNi1VObvlBAn_6XHBr38McFrgH6CiHbM8DY9Jw3Mr5AMC1o8y5MzqIpAi9dpC"/>
</div>
<div className="p-4 flex flex-col flex-1">
<h3 className="text-slate-900 dark:text-white font-semibold text-sm md:text-base mb-1">Sunflower Oil</h3>
<p className="text-slate-400 text-xs mb-3">1 Litre</p>
<div className="mt-auto flex items-center justify-between">
<span className="text-slate-900 dark:text-white font-bold text-lg">₹165</span>
<button className="bg-primary/10 hover:bg-primary text-primary hover:text-slate-900 p-2 rounded-lg transition-colors flex items-center justify-center">
<span className="material-symbols-outlined text-xl">add</span>
</button>
</div>
</div>
</div>
</div>
</div>
{/* Store Map Section */}
<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="flex flex-col gap-4">
<h2 className="text-xl font-bold text-slate-900 dark:text-white">Store Location</h2>
<div className="w-full h-64 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700">
<img className="w-full h-full object-cover opacity-60 grayscale" data-alt="A clean map layout showing city streets" data-location="Gurgaon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzTGnDtGQplMXKiwZpdB_37A66O2yat-6Xu1SZsCK78vS3UA2-7ccdSJZwEuSgXYd276q498pxU7kpLsDBE4iWEGSem694T-3A6GH8J0jcpt9WMEH0eyfMMuTcs5PeczkGmaxXZgpAxX3q4l-sszhlXIxfppZQVIOu_Y2H8JMxPchd3uoKQWFZl6IUTjRntlk6FfJUOEMV2ab3TWxhBpYP8wUmm6PlPdhK9t0ESFwZ9YN1KHNxTzgXWa0nmvsSLfU7O_psAYgUbZgj"/>
<div className="absolute inset-0 flex items-center justify-center">
<div className="flex flex-col items-center">
<span className="material-symbols-outlined text-4xl text-primary animate-bounce">location_on</span>
<div className="bg-white dark:bg-slate-900 px-3 py-1 rounded-full shadow-lg border border-primary/20 text-xs font-bold">Gupta Store</div>
</div>
</div>
</div>
</div>
<div className="flex flex-col gap-4">
<h2 className="text-xl font-bold text-slate-900 dark:text-white">Store Info &amp; Timing</h2>
<div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex-1">
<ul className="space-y-4">
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary">schedule</span>
<div>
<p className="text-sm font-bold text-slate-900 dark:text-white">Opening Hours</p>
<p className="text-sm text-slate-500">Mon - Sat: 8:00 AM - 9:00 PM</p>
<p className="text-sm text-slate-500">Sun: 9:00 AM - 6:00 PM</p>
</div>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary">delivery_dining</span>
<div>
<p className="text-sm font-bold text-slate-900 dark:text-white">Delivery Available</p>
<p className="text-sm text-slate-500">Free delivery within 2km for orders above ₹500</p>
</div>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary">payments</span>
<div>
<p className="text-sm font-bold text-slate-900 dark:text-white">Payment Options</p>
<p className="text-sm text-slate-500">Cash, UPI (PhonePe, GPay), Cards</p>
</div>
</li>
</ul>
</div>
</div>
</div>
</main>
{/* Mobile Navigation Bottom Bar (For Mobile App Context) */}
<div className="md:hidden sticky bottom-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center">
<button className="flex flex-col items-center gap-1 text-primary">
<span className="material-symbols-outlined">storefront</span>
<span className="text-[10px] font-bold">Shop</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-400">
<span className="material-symbols-outlined">search</span>
<span className="text-[10px]">Search</span>
</button>
<div className="relative -top-8 bg-primary p-4 rounded-full shadow-xl shadow-primary/40 text-slate-900">
<span className="material-symbols-outlined text-3xl">shopping_cart</span>
<span className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] size-5 flex items-center justify-center rounded-full border-2 border-primary font-bold">0</span>
</div>
<button className="flex flex-col items-center gap-1 text-slate-400">
<span className="material-symbols-outlined">receipt_long</span>
<span className="text-[10px]">Orders</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-400">
<span className="material-symbols-outlined">person</span>
<span className="text-[10px]">Profile</span>
</button>
</div>
</div>

    </>
  );
}
