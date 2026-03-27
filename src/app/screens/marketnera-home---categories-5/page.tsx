import Logo from "@/components/layout/Logo";

export default function Screen() {
  return (
    <>
      
<div className="relative flex flex-col min-h-screen">
<header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 lg:px-20 bg-white/80 dark:bg-navy/80 backdrop-blur-md sticky top-0 z-50">
<div className="flex items-center gap-3 shrink-0">
<Logo />
</div>
<div className="flex-1 max-w-xl mx-8 relative">
<div className="relative group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-700 transition-all text-sm" placeholder="Search for groceries, local shops..." type="text" value="Fresh"/>
</div>
</div>
<div className="flex items-center gap-6 shrink-0">
<nav className="hidden xl:flex items-center gap-8">
<a className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">Deals</a>
<a className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors flex items-center gap-1" href="#">
                    Shop by Store <span className="material-symbols-outlined text-[18px]">storefront</span>
</a>
<a className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">Stores</a>
</nav>
<div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-6 ml-2">
<button className="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
<span className="material-symbols-outlined">person</span>
</button>
<button className="bg-navy dark:bg-slate-700 text-white px-6 h-10 rounded-full text-sm font-bold hover:bg-slate-800 transition-all">Sign In</button>
</div>
</div>
</header>
<div className="flex flex-1 max-w-[1600px] mx-auto w-full">
<aside className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 p-8 hidden lg:block sticky top-20 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
<div className="space-y-10">
<div>
<h3 className="text-xs font-black uppercase tracking-widest text-navy dark:text-white mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-pink-500 fill-1">favorite</span>
                        Favorite Shops
                    </h3>
<div className="space-y-4">
<a className="flex items-center justify-between group" href="#">
<div className="flex items-center gap-3">
<div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">GM</div>
<span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">Greenery Market</span>
</div>
<span className="material-symbols-outlined text-pink-500 text-lg fill-1">favorite</span>
</a>
<a className="flex items-center justify-between group" href="#">
<div className="flex items-center gap-3">
<div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">SO</div>
<span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">Sunshine Organics</span>
</div>
<span className="material-symbols-outlined text-pink-500 text-lg fill-1">favorite</span>
</a>
</div>
</div>
<div>
<h3 className="text-xs font-black uppercase tracking-widest text-navy dark:text-white mb-6">Categories</h3>
<div className="space-y-3">
<label className="flex items-center gap-3 cursor-pointer group">
<input className="rounded border-slate-300 text-primary focus:ring-primary h-5 w-5" type="checkbox"/>
<span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">Vegetables</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input defaultChecked className="rounded border-slate-300 text-primary focus:ring-primary h-5 w-5" type="checkbox"/>
<span className="text-sm font-bold text-primary">Dairy &amp; Eggs</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="rounded border-slate-300 text-primary focus:ring-primary h-5 w-5" type="checkbox"/>
<span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">Bakery</span>
</label>
</div>
</div>
<div>
<h3 className="text-xs font-black uppercase tracking-widest text-navy dark:text-white mb-6">Price Range</h3>
<input className="w-full accent-primary mb-4" max="100" min="0" type="range"/>
<div className="flex justify-between text-xs font-bold text-slate-400">
<span>₹0</span>
<span>₹100+</span>
</div>
</div>
<div>
<h3 className="text-xs font-black uppercase tracking-widest text-navy dark:text-white mb-6">Other Shops</h3>
<div className="space-y-3">
<label className="flex items-center gap-3 cursor-pointer">
<input className="text-primary focus:ring-primary h-5 w-5" name="shop" type="radio"/>
<span className="text-sm font-medium text-slate-600 dark:text-slate-400">Artisan Bakery</span>
</label>
<label className="flex items-center gap-3 cursor-pointer">
<input className="text-primary focus:ring-primary h-5 w-5" name="shop" type="radio"/>
<span className="text-sm font-medium text-slate-600 dark:text-slate-400">Dairy Depot</span>
</label>
</div>
</div>
</div>
</aside>
<main className="flex-1 p-8">
<div className="flex items-center justify-between mb-8">
<div>
<h1 className="text-3xl font-black text-navy dark:text-white">Shop by Favorite Local Stores</h1>
<p className="text-slate-500 text-sm mt-1">Discover items from the shopkeepers you know and trust.</p>
</div>
<div className="flex items-center gap-2">
<span className="text-sm text-slate-500 font-medium">Sort by:</span>
<select className="border-none bg-white dark:bg-slate-800 rounded-lg text-sm font-bold py-2 px-4 pr-10 focus:ring-2 focus:ring-primary shadow-sm">
<option>Recommended</option>
<option>My Favorites First</option>
<option>Price: Low to High</option>
<option>Price: High to Low</option>
</select>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
<div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
<div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-slate-50">
<img alt="Organic Avocado" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB202VitgXwM5sug7nubqMb527DL-dIHGvv9AC0lH00KRaAXJcXWmd-LCu-Uq7PaqoBDzOjp5uEouJT4TPqrvTHVLUh4NZclqj7bG5n0LsbrarQO-JyR_ZwTlock5IXPZztxzYshZxP7EXx0UxqjTuhXXuiTorwkfE1U_7U8t9geqvNfujBXADy-UXfBijY6mYf87rfcPeiiMYvwefFTG5tb5TGmYLMsp4FqA14nAzxciPJGwcybq4kY6Gnf36s63tNDXJKxps3WpJr"/>
<button className="absolute top-4 right-4 size-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-pink-500 hover:scale-110 transition-transform shadow-sm">
<span className="material-symbols-outlined text-xl fill-1">favorite</span>
</button>
</div>
<div className="px-2">
<div className="flex justify-between items-start mb-1">
<h4 className="font-bold text-navy dark:text-white text-lg leading-tight">Organic Hass Avocado</h4>
<span className="text-primary font-black text-xl">₹4.99</span>
</div>
<div className="flex flex-col gap-2 mb-4">
<span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-fit">2 Units</span>
<div className="flex items-center justify-between">
<a className="flex items-center gap-2 group/shop" href="#">
<div className="size-6 rounded-full bg-orange-100 flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-orange-600">storefront</span>
</div>
<span className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline decoration-2 underline-offset-2">Sunshine Organics</span>
</a>
<button className="flex items-center gap-1 px-2 py-1 rounded-full border border-pink-100 text-pink-500 text-[10px] font-bold bg-pink-50 hover:bg-pink-100 transition-colors">
<span className="material-symbols-outlined text-sm fill-1">favorite</span>
                                    Following
                                </button>
</div>
</div>
<button className="w-full bg-primary text-white h-12 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-primary/20">
<span className="material-symbols-outlined">shopping_basket</span>
                            Add to Cart
                        </button>
</div>
</div>
<div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
<div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-slate-50">
<img alt="Fresh Milk" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiqsLOYBU7z7eH1MLEYIL93EK4DKEHEunr9o7FO91myhxtKAUhMERs01vKDfk_l6bKhlEv4wQbGFaHClt5e-vfMzfv0dMg1xBHlnoMxmW9L2t1wEz3Jy0i2mtICygx98YKcBn3NJCaQXhFDFBjXZbvyd3gzOg2DJlPku3eBkmJtj-3CDpVzI-0BwyizIV17AH-Ju2vMY2SsrL0DkDc433SF6pjcR3pqdrqpCBZPRYrYQE1BPs1W3DnRDfvDHL2F9jBPoM9bTsHa-zk"/>
<button className="absolute top-4 right-4 size-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-pink-500 transition-colors shadow-sm">
<span className="material-symbols-outlined text-xl">favorite</span>
</button>
</div>
<div className="px-2">
<div className="flex justify-between items-start mb-1">
<h4 className="font-bold text-navy dark:text-white text-lg leading-tight">Farm Fresh Whole Milk</h4>
<span className="text-primary font-black text-xl">₹5.50</span>
</div>
<div className="flex flex-col gap-2 mb-4">
<span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-fit">1 Gallon</span>
<div className="flex items-center justify-between">
<a className="flex items-center gap-2 group/shop" href="#">
<div className="size-6 rounded-full bg-blue-100 flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-blue-600">storefront</span>
</div>
<span className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline decoration-2 underline-offset-2">Dairy Depot</span>
</a>
<button className="flex items-center gap-1 px-2 py-1 rounded-full border border-slate-200 text-slate-500 text-[10px] font-bold hover:bg-slate-50 transition-colors">
<span className="material-symbols-outlined text-sm">favorite</span>
                                    Follow
                                </button>
</div>
</div>
<button className="w-full bg-primary text-white h-12 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-primary/20">
<span className="material-symbols-outlined">shopping_basket</span>
                            Add to Cart
                        </button>
</div>
</div>
<div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
<div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-slate-50">
<img alt="Sourdough Bread" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGM9zvnVC9KjdnKycBiTAt2QfxbSSVixDtfZ1veXOuVduKbt8aQHYnyThgGTuUHh3SyX_oYygroHx72es__uEg0iESDUXJH2hLtRygchHzoAuBJ8NOEM4v4LLWVrPtCC5ADIpo0VbX_NNK7IoegYB94uWNlRXwyo6xKaHPbTn8LuVSyJ3-99yxx57v211X0MVpYYcoHWYeQabXfWTzVywndLN9tFaDjAYq3igrpzPSiz7HUr-s6VK_gzNelkCdn1VGnNFOhEtBe-q7"/>
<button className="absolute top-4 right-4 size-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-pink-500 transition-colors shadow-sm">
<span className="material-symbols-outlined text-xl">favorite</span>
</button>
</div>
<div className="px-2">
<div className="flex justify-between items-start mb-1">
<h4 className="font-bold text-navy dark:text-white text-lg leading-tight">Artisan Sourdough</h4>
<span className="text-primary font-black text-xl">₹6.20</span>
</div>
<div className="flex flex-col gap-2 mb-4">
<span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-fit">450g</span>
<div className="flex items-center justify-between">
<a className="flex items-center gap-2 group/shop" href="#">
<div className="size-6 rounded-full bg-amber-100 flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-amber-600">storefront</span>
</div>
<span className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline decoration-2 underline-offset-2">The Hearth Bake</span>
</a>
<button className="flex items-center gap-1 px-2 py-1 rounded-full border border-slate-200 text-slate-500 text-[10px] font-bold hover:bg-slate-50 transition-colors">
<span className="material-symbols-outlined text-sm">favorite</span>
                                    Follow
                                </button>
</div>
</div>
<button className="w-full bg-primary text-white h-12 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-primary/20">
<span className="material-symbols-outlined">shopping_basket</span>
                            Add to Cart
                        </button>
</div>
</div>
<div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
<div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-slate-50">
<img alt="Vine Tomatoes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6xF3Bvm-HBxfSsrTR5BfbBsBJshaKi9U70XsuxunBWtvc2Yn-I4BiCgxn3WFeaZyexbhQC5HvpqMH4y1kgLlMjyoG7K3wfc9vrPGMvAuAWSc53YaWncme87gffx1ztDBNjYPJQQ7tYHPz8FWMD-QHhB4DxTau6pyiyb7XPajjCHx-iZWgt7q17GDeb8Dsi3PFydweoEUVxSv8uGAI3psp_7xbC9lCu7Y-3Rzyy970P1iJ2gbpQ3qatnobJr-vdYz87q1KiNxxGXPs"/>
<button className="absolute top-4 right-4 size-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-pink-500 hover:scale-110 transition-transform shadow-sm">
<span className="material-symbols-outlined text-xl fill-1">favorite</span>
</button>
</div>
<div className="px-2">
<div className="flex justify-between items-start mb-1">
<h4 className="font-bold text-navy dark:text-white text-lg leading-tight">Organic Vine Tomatoes</h4>
<span className="text-primary font-black text-xl">₹3.95</span>
</div>
<div className="flex flex-col gap-2 mb-4">
<span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-fit">500g Pack</span>
<div className="flex items-center justify-between">
<a className="flex items-center gap-2 group/shop" href="#">
<div className="size-6 rounded-full bg-green-100 flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-green-600">storefront</span>
</div>
<span className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline decoration-2 underline-offset-2">Greenery Market</span>
</a>
<button className="flex items-center gap-1 px-2 py-1 rounded-full border border-pink-100 text-pink-500 text-[10px] font-bold bg-pink-50 hover:bg-pink-100 transition-colors">
<span className="material-symbols-outlined text-sm fill-1">favorite</span>
                                    Following
                                </button>
</div>
</div>
<button className="w-full bg-primary text-white h-12 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-primary/20">
<span className="material-symbols-outlined">shopping_basket</span>
                            Add to Cart
                        </button>
</div>
</div>
<div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm opacity-60">
<div className="aspect-square rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 mb-4 animate-pulse"></div>
<div className="h-6 w-3/4 bg-slate-100 dark:bg-slate-800 rounded mb-2 animate-pulse"></div>
<div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
</div>
</div>
</main>
</div>
<button className="fixed bottom-8 right-8 size-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[60] group">
<div className="relative">
<span className="material-symbols-outlined text-3xl">shopping_cart</span>
<span className="absolute -top-2 -right-2 bg-navy text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-background-light dark:ring-background-dark">
                    3
            </span>
</div>
<div className="absolute right-full mr-4 bg-navy text-white text-xs font-bold py-2 px-4 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                3 items: ₹16.69
        </div>
</button>
<footer className="bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 px-6 lg:px-20 py-12 mt-auto">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div className="flex items-center gap-2 text-navy dark:text-white font-black text-xl">
<Logo />
                </div>
<div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
<a className="hover:text-primary" href="#">Help Center</a>
<a className="hover:text-primary" href="#">Store Locator</a>
<a className="hover:text-primary" href="#">Sell on Marketnera</a>
</div>
<p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">© 2026 Marketnera. Support Local Shopkeepers.</p>
</div>
</footer>
</div>


    </>
  );
}
