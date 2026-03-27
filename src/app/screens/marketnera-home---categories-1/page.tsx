import Logo from "@/components/layout/Logo";

export default function Screen() {
  return (
    <>
      
<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
<header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 px-6 py-4 lg:px-20 bg-white/80 dark:bg-navy/80 backdrop-blur-md sticky top-0 z-50">
<div className="flex items-center gap-3">
<Logo />
</div>
<div className="flex flex-1 justify-end items-center gap-8">
<nav className="hidden md:flex items-center gap-10">
<a className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#">Home</a>
<a className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#">Features</a>
<a className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#">Partners</a>
</nav>
<div className="flex items-center gap-4">
<button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-full h-10 px-5 bg-navy text-white text-sm font-bold tracking-wide hover:bg-slate-800 transition-all dark:bg-slate-700 dark:hover:bg-slate-600">
<span>Sign In</span>
</button>
</div>
</div>
</header>
<main className="flex-1">
<section className="bg-white dark:bg-navy py-12 lg:py-24 px-6 lg:px-20">
<div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
<div className="w-full lg:w-1/2 flex flex-col gap-8">
<div className="flex flex-col gap-6">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-primary text-xs font-bold uppercase tracking-widest w-fit">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
                            The Future of Local Commerce
                        </div>
<h1 className="text-navy dark:text-white text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                            Shopping Local, <span className="text-primary">Digitally</span>.
                        </h1>
<p className="text-slate-600 dark:text-slate-400 text-lg lg:text-xl font-medium leading-relaxed max-w-xl">
                            Empowering neighborhood shops with a premium digital storefront. Support your community while enjoying the convenience of modern online shopping.
                        </p>
</div>
<div className="flex flex-wrap gap-4">
<button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-primary text-white text-lg font-bold shadow-xl shadow-primary/30 hover:bg-orange-600 transition-all hover:scale-105">
<span>Get Started</span>
</button>
<button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-full h-14 px-8 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white text-lg font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
<span>Learn More</span>
</button>
</div>
</div>
<div className="w-full lg:w-1/2 relative">
<div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
<div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
<div className="relative aspect-[4/5] lg:aspect-square w-full bg-center bg-no-repeat bg-cover rounded-3xl shadow-2xl overflow-hidden border-8 border-white dark:border-slate-800" data-alt="Local shopkeeper using the Marketnera app in a vibrant store" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1C-bsXfzER13g0lNgxU9LH6PzBrzB3OordTZ5ezDdqUEK0CyigSCUKPvJ_TnKcGwCoY23qCTNcIBjC82IALOssvAw-QKXXk50S0Pndl8NKI1p5J4OQxx6e3xc5l7yKjnOi7RGTLtHtH44D6Bi946B_BcAaHgmeRA-E6oX0Z7hXnYHojdwSidHZbcbxpRQUUY-XzWWBtPiOJ2Nf9yQFvjh5op3XVn1nj5EzSP20YQRzj5QitlKKGpdj0TJplWdfstGvJl43MnFpqUI")'}}>
<div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent"></div>
</div>
</div>
</div>
</section>
<section className="border-y border-slate-100 dark:border-slate-800 py-10 bg-slate-50/50 dark:bg-navy/50">
<div className="max-w-7xl mx-auto px-6">
<p className="text-center text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mb-8">Trusted by 500+ local partners</p>
<div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
<div className="flex items-center gap-2 font-black text-2xl text-slate-700 dark:text-slate-400">
<span className="material-symbols-outlined text-primary">eco</span> GREENERY
                    </div>
<div className="flex items-center gap-2 font-black text-2xl text-slate-700 dark:text-slate-400">
<span className="material-symbols-outlined text-primary">restaurant</span> BISTRO
                    </div>
<div className="flex items-center gap-2 font-black text-2xl text-slate-700 dark:text-slate-400">
<span className="material-symbols-outlined text-primary">fitness_center</span> FORZA
                    </div>
<div className="flex items-center gap-2 font-black text-2xl text-slate-700 dark:text-slate-400">
<span className="material-symbols-outlined text-primary">apparel</span> VELVET
                    </div>
<div className="flex items-center gap-2 font-black text-2xl text-slate-700 dark:text-slate-400">
<span className="material-symbols-outlined text-primary">oven_gen</span> ARTISAN
                    </div>
</div>
</div>
</section>
<section className="py-24 px-6 lg:px-20 bg-white dark:bg-background-dark">
<div className="max-w-7xl mx-auto">
<div className="text-center mb-16">
<h2 className="text-navy dark:text-white text-4xl font-black mb-4">How it Works</h2>
<p className="text-slate-500 dark:text-slate-400 text-lg">Your bridge to local commerce in 3 simple steps</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
<div className="flex flex-col items-center text-center gap-6">
<div className="w-20 h-20 rounded-2xl bg-orange-100 dark:bg-orange-900/20 text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-4xl">search_insights</span>
</div>
<h3 className="text-2xl font-bold dark:text-white">Browse</h3>
<p className="text-slate-600 dark:text-slate-400">Discover fresh produce and premium goods from vetted local shops near you.</p>
</div>
<div className="flex flex-col items-center text-center gap-6">
<div className="w-20 h-20 rounded-2xl bg-orange-100 dark:bg-orange-900/20 text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-4xl">shopping_cart_checkout</span>
</div>
<h3 className="text-2xl font-bold dark:text-white">Order</h3>
<p className="text-slate-600 dark:text-slate-400">Seamless checkout with instant notifications and real-time order tracking.</p>
</div>
<div className="flex flex-col items-center text-center gap-6">
<div className="w-20 h-20 rounded-2xl bg-orange-100 dark:bg-orange-900/20 text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-4xl">volunteer_activism</span>
</div>
<h3 className="text-2xl font-bold dark:text-white">Support Local</h3>
<p className="text-slate-600 dark:text-slate-400">Your purchase directly supports the livelihood of small business owners in your community.</p>
</div>
</div>
</div>
</section>
<section className="px-6 lg:px-20 py-24 bg-slate-50 dark:bg-navy/30 overflow-hidden">
<div className="max-w-7xl mx-auto">
<div className="flex items-center justify-between mb-12">
<div>
<h2 className="text-navy dark:text-white text-4xl font-black tracking-tight">Shop by Category</h2>
<p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Explore hand-picked items from top-rated merchants</p>
</div>
<div className="flex gap-2">
<button className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
<div className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 -mx-4 px-4 snap-x">
<div className="group relative flex-none w-[320px] snap-start">
<div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800">
<div className="relative aspect-[4/5] bg-center bg-cover overflow-hidden" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB202VitgXwM5sug7nubqMb527DL-dIHGvv9AC0lH00KRaAXJcXWmd-LCu-Uq7PaqoBDzOjp5uEouJT4TPqrvTHVLUh4NZclqj7bG5n0LsbrarQO-JyR_ZwTlock5IXPZztxzYshZxP7EXx0UxqjTuhXXuiTorwkfE1U_7U8t9geqvNfujBXADy-UXfBijY6mYf87rfcPeiiMYvwefFTG5tb5TGmYLMsp4FqA14nAzxciPJGwcybq4kY6Gnf36s63tNDXJKxps3WpJr")'}}>
<div className="absolute inset-0 bg-navy/90 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-center p-8 text-white z-20">
<h5 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">Best Sellers</h5>
<ul className="flex flex-col gap-3 text-sm">
<li className="flex justify-between border-b border-white/10 pb-2"><span>Organic Avocado</span> <span>₹4.99</span></li>
<li className="flex justify-between border-b border-white/10 pb-2"><span>Farm Fresh Eggs</span> <span>₹6.50</span></li>
<li className="flex justify-between border-b border-white/10 pb-2"><span>Sourdough Bread</span> <span>₹5.20</span></li>
</ul>
<button className="mt-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-orange-600 transition-colors">Shop Now</button>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
<div className="absolute bottom-6 left-6 text-white z-10">
<h4 className="text-2xl font-black">Grocery</h4>
<p className="text-white/80 text-sm">Fresh from the farm</p>
</div>
</div>
</div>
</div>
<div className="group relative flex-none w-[320px] snap-start">
<div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800">
<div className="relative aspect-[4/5] bg-center bg-cover overflow-hidden" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCGM9zvnVC9KjdnKycBiTAt2QfxbSSVixDtfZ1veXOuVduKbt8aQHYnyThgGTuUHh3SyX_oYygroHx72es__uEg0iESDUXJH2hLtRygchHzoAuBJ8NOEM4v4LLWVrPtCC5ADIpo0VbX_NNK7IoegYB94uWNlRXwyo6xKaHPbTn8LuVSyJ3-99yxx57v211X0MVpYYcoHWYeQabXfWTzVywndLN9tFaDjAYq3igrpzPSiz7HUr-s6VK_gzNelkCdn1VGnNFOhEtBe-q7")'}}>
<div className="absolute inset-0 bg-navy/90 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-center p-8 text-white z-20">
<h5 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">Best Sellers</h5>
<ul className="flex flex-col gap-3 text-sm">
<li className="flex justify-between border-b border-white/10 pb-2"><span>Pro Yoga Mat</span> <span>₹29.99</span></li>
<li className="flex justify-between border-b border-white/10 pb-2"><span>Steel Kettlebell</span> <span>₹45.00</span></li>
<li className="flex justify-between border-b border-white/10 pb-2"><span>Grip Tape</span> <span>₹12.00</span></li>
</ul>
<button className="mt-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-orange-600 transition-colors">Shop Now</button>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
<div className="absolute bottom-6 left-6 text-white z-10">
<h4 className="text-2xl font-black">Sports</h4>
<p className="text-white/80 text-sm">Performance gear</p>
</div>
</div>
</div>
</div>
<div className="group relative flex-none w-[320px] snap-start">
<div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800">
<div className="relative aspect-[4/5] bg-center bg-cover overflow-hidden" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB6xF3Bvm-HBxfSsrTR5BfbBsBJshaKi9U70XsuxunBWtvc2Yn-I4BiCgxn3WFeaZyexbhQC5HvpqMH4y1kgLlMjyoG7K3wfc9vrPGMvAuAWSc53YaWncme87gffx1ztDBNjYPJQQ7tYHPz8FWMD-QHhB4DxTau6pyiyb7XPajjCHx-iZWgt7q17GDeb8Dsi3PFydweoEUVxSv8uGAI3psp_7xbC9lCu7Y-3Rzyy970P1iJ2gbpQ3qatnobJr-vdYz87q1KiNxxGXPs")'}}>
<div className="absolute inset-0 bg-navy/90 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-center p-8 text-white z-20">
<h5 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">Best Sellers</h5>
<ul className="flex flex-col gap-3 text-sm">
<li className="flex justify-between border-b border-white/10 pb-2"><span>Ceramic Pan</span> <span>₹38.00</span></li>
<li className="flex justify-between border-b border-white/10 pb-2"><span>Knife Set (5pc)</span> <span>₹89.00</span></li>
<li className="flex justify-between border-b border-white/10 pb-2"><span>Spice Jar Kit</span> <span>₹24.99</span></li>
</ul>
<button className="mt-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-orange-600 transition-colors">Shop Now</button>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
<div className="absolute bottom-6 left-6 text-white z-10">
<h4 className="text-2xl font-black">Kitchen</h4>
<p className="text-white/80 text-sm">Culinary essentials</p>
</div>
</div>
</div>
</div>
<div className="group relative flex-none w-[320px] snap-start">
<div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800">
<div className="relative aspect-[4/5] bg-center bg-cover overflow-hidden" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBiqsLOYBU7z7eH1MLEYIL93EK4DKEHEunr9o7FO91myhxtKAUhMERs01vKDfk_l6bKhlEv4wQbGFaHClt5e-vfMzfv0dMg1xBHlnoMxmW9L2t1wEz3Jy0i2mtICygx98YKcBn3NJCaQXhFDFBjXZbvyd3gzOg2DJlPku3eBkmJtj-3CDpVzI-0BwyizIV17AH-Ju2vMY2SsrL0DkDc433SF6pjcR3pqdrqpCBZPRYrYQE1BPs1W3DnRDfvDHL2F9jBPoM9bTsHa-zk")'}}>
<div className="absolute inset-0 bg-navy/90 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-center p-8 text-white z-20">
<h5 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">Best Sellers</h5>
<ul className="flex flex-col gap-3 text-sm">
<li className="flex justify-between border-b border-white/10 pb-2"><span>Cotton T-Shirt</span> <span>₹19.99</span></li>
<li className="flex justify-between border-b border-white/10 pb-2"><span>Denim Jacket</span> <span>₹65.00</span></li>
<li className="flex justify-between border-b border-white/10 pb-2"><span>Silk Scarf</span> <span>₹34.00</span></li>
</ul>
<button className="mt-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-orange-600 transition-colors">Shop Now</button>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
<div className="absolute bottom-6 left-6 text-white z-10">
<h4 className="text-2xl font-black">Wardrobe</h4>
<p className="text-white/80 text-sm">Local boutique finds</p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<section className="bg-navy text-white py-24 px-6 lg:px-20 relative overflow-hidden">
<div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
<div className="max-w-4xl mx-auto text-center flex flex-col gap-10 relative z-10">
<h2 className="text-4xl lg:text-6xl font-black tracking-tight">Ready to take your local shop to the world?</h2>
<p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">Join 5,000+ merchants who are redefining what it means to be a local business.</p>
<div className="flex flex-col sm:flex-row gap-6 justify-center">
<button className="bg-primary text-white h-16 px-12 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-primary/20 hover:scale-105">Join Marketnera</button>
<button className="bg-white/5 border border-white/20 h-16 px-12 rounded-full font-bold text-lg hover:bg-white/10 transition-all">Talk to an Expert</button>
</div>
</div>
</section>
</main>
<footer className="bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 px-6 lg:px-20 py-20">
<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
<div className="flex flex-col gap-6">
<div className="flex items-center gap-2 text-navy dark:text-white font-black text-2xl">
<Logo />
                </div>
<p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Modernizing the local shopping experience through technology and community-first solutions.</p>
<div className="flex gap-4">
<a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-navy dark:text-white hover:bg-primary hover:text-white transition-all" href="#">
<span className="material-symbols-outlined text-xl">share</span>
</a>
<a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-navy dark:text-white hover:bg-primary hover:text-white transition-all" href="#">
<span className="material-symbols-outlined text-xl">camera</span>
</a>
</div>
</div>
<div className="flex flex-col gap-6">
<h5 className="font-bold text-navy dark:text-white uppercase tracking-widest text-xs">Solutions</h5>
<nav className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
<a className="hover:text-primary transition-colors font-medium" href="#">Online Storefront</a>
<a className="hover:text-primary transition-colors font-medium" href="#">Inventory Sync</a>
<a className="hover:text-primary transition-colors font-medium" href="#">Delivery Network</a>
<a className="hover:text-primary transition-colors font-medium" href="#">Point of Sale</a>
</nav>
</div>
<div className="flex flex-col gap-6">
<h5 className="font-bold text-navy dark:text-white uppercase tracking-widest text-xs">Company</h5>
<nav className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
<a className="hover:text-primary transition-colors font-medium" href="#">About Our Mission</a>
<a className="hover:text-primary transition-colors font-medium" href="#">Shopkeeper Stories</a>
<a className="hover:text-primary transition-colors font-medium" href="#">Careers</a>
<a className="hover:text-primary transition-colors font-medium" href="#">Sustainability</a>
</nav>
</div>
<div className="flex flex-col gap-6">
<h5 className="font-bold text-navy dark:text-white uppercase tracking-widest text-xs">Newsletter</h5>
<p className="text-xs text-slate-500">Get tips on growing your local business.</p>
<div className="flex gap-2">
<input className="bg-slate-50 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary" placeholder="Email address" type="email"/>
<button className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
<span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
</div>
<div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:row justify-between items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
<p>© 2026 Marketnera Global Inc. Shopping Local, Digitally.</p>
<div className="flex gap-8">
<a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
<a className="hover:text-primary transition-colors" href="#">Cookie Policy</a>
</div>
</div>
</footer>
</div>
</div>


    </>
  );
}
