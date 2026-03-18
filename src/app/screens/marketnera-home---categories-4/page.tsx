import Logo from "@/components/layout/Logo";

export default function Screen() {
  return (
    <>
      
<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 py-4 lg:px-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
<div className="flex items-center gap-3">
<Logo />
</div>
<div className="flex flex-1 justify-end items-center gap-8">
<nav className="hidden md:flex items-center gap-10">
<a className="text-slate-700 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#">Home</a>
<a className="text-slate-700 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#">Features</a>
<a className="text-slate-700 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#">Pricing</a>
</nav>
<div className="flex items-center gap-4">
<button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-slate-950 text-sm font-bold tracking-wide hover:opacity-90 transition-all">
<span>Sign In</span>
</button>
<div className="hidden sm:block bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20" data-alt="User profile avatar placeholder" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDUd7MKcS02OkqcX0Z79R9aXqVAZSobUkkQvYxxBtthC3QzG3DAlg0oSNrgXWOrR3r4WodCpYNYCCJ9EAj2syZxBYRmILuOmFY0K3W73VJnHLy4tHz-pcssDFiSnyoIIDKuDCOuWJ-BiUf6GWPEXo5a5cCwYnGK1JG17y5XAxrnoMxkqas1dP2XYb4yeo9wyT1zi2ua0iwFAekF0vBoxGgJBUssSBlN0c1aDaX9J33AY_pbbaxiKLl_hcZg8P6Nu4gqsWj7trX3xc1X")'}}></div>
</div>
</div>
</header>
<main className="flex-1">
<section className="@container px-6 lg:px-20 py-12 lg:py-20">
<div className="flex flex-col gap-10 @[864px]:flex-row @[864px]:items-center">
<div className="flex flex-col gap-8 @[864px]:w-1/2">
<div className="flex flex-col gap-4">
<span className="text-primary font-bold tracking-widest text-xs uppercase">Digital Transformation</span>
<h1 className="text-slate-900 dark:text-slate-100 text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                                    Empowering Local Shopkeepers in the Digital Age
                                </h1>
<p className="text-slate-600 dark:text-slate-400 text-lg lg:text-xl font-normal max-w-lg">
                                    Help your local business compete and thrive online with modern tools for inventory, delivery, and marketing.
                                </p>
</div>
<div className="flex flex-wrap gap-4">
<button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-slate-950 text-base font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
<span>Get Started</span>
</button>
<button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 border-2 border-primary text-primary text-base font-bold hover:bg-primary/5 transition-colors">
<span>Watch Demo</span>
</button>
</div>
</div>
<div className="w-full @[864px]:w-1/2">
<div className="aspect-video w-full bg-center bg-no-repeat bg-cover rounded-2xl shadow-2xl" data-alt="A local vegetable vendor in a clean modern market setting" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1C-bsXfzER13g0lNgxU9LH6PzBrzB3OordTZ5ezDdqUEK0CyigSCUKPvJ_TnKcGwCoY23qCTNcIBjC82IALOssvAw-QKXXk50S0Pndl8NKI1p5J4OQxx6e3xc5l7yKjnOi7RGTLtHtH44D6Bi946B_BcAaHgmeRA-E6oX0Z7hXnYHojdwSidHZbcbxpRQUUY-XzWWBtPiOJ2Nf9yQFvjh5op3XVn1nj5EzSP20YQRzj5QitlKKGpdj0TJplWdfstGvJl43MnFpqUI")'}}></div>
</div>
</div>
</section>
<section className="bg-primary/5 py-20 px-6 lg:px-20">
<div className="max-w-[1200px] mx-auto">
<div className="flex flex-col gap-4 mb-12 text-center items-center">
<h2 className="text-slate-900 dark:text-slate-100 text-3xl lg:text-4xl font-bold tracking-tight">
                                Why Marketnera?
                            </h2>
<p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                                Our platform is meticulously designed to bridge the gap between physical storefronts and the digital marketplace.
                            </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="flex flex-col gap-6 rounded-2xl border border-primary/10 bg-white dark:bg-background-dark p-8 shadow-sm hover:shadow-md transition-shadow">
<div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
<span className="material-symbols-outlined text-3xl">trending_up</span>
</div>
<div className="flex flex-col gap-2">
<h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Increase Sales</h3>
<p className="text-slate-600 dark:text-slate-400 leading-relaxed">Leverage powerful SEO and marketing tools to grow your daily revenue automatically.</p>
</div>
</div>
<div className="flex flex-col gap-6 rounded-2xl border border-primary/10 bg-white dark:bg-background-dark p-8 shadow-sm hover:shadow-md transition-shadow">
<div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
<span className="material-symbols-outlined text-3xl">groups</span>
</div>
<div className="flex flex-col gap-2">
<h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Reach More Customers</h3>
<p className="text-slate-600 dark:text-slate-400 leading-relaxed">Connect with shoppers in your neighborhood and across the city through our mobile app.</p>
</div>
</div>
<div className="flex flex-col gap-6 rounded-2xl border border-primary/10 bg-white dark:bg-background-dark p-8 shadow-sm hover:shadow-md transition-shadow">
<div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
<span className="material-symbols-outlined text-3xl">inventory_2</span>
</div>
<div className="flex flex-col gap-2">
<h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Smart Management</h3>
<p className="text-slate-600 dark:text-slate-400 leading-relaxed">Manage your inventory, orders, and delivery fleet through a seamless dashboard.</p>
</div>
</div>
</div>
</div>
</section>
<section className="px-6 lg:px-20 py-20">
<div className="max-w-[1200px] mx-auto">
<div className="flex items-end justify-between mb-10">
<div className="flex flex-col gap-2">
<h2 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight">Browse by Category</h2>
<p className="text-slate-600 dark:text-slate-400">Discover top-selling items from local partners</p>
</div>
<a className="text-primary font-bold flex items-center gap-1 hover:underline" href="#">
                                View All Categories <span className="material-symbols-outlined">chevron_right</span>
</a>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="group flex flex-col gap-4 bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-2">
<div className="relative w-full aspect-square bg-center bg-cover overflow-hidden" data-alt="Fresh grocery produce organized in wooden crates" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB202VitgXwM5sug7nubqMb527DL-dIHGvv9AC0lH00KRaAXJcXWmd-LCu-Uq7PaqoBDzOjp5uEouJT4TPqrvTHVLUh4NZclqj7bG5n0LsbrarQO-JyR_ZwTlock5IXPZztxzYshZxP7EXx0UxqjTuhXXuiTorwkfE1U_7U8t9geqvNfujBXADy-UXfBijY6mYf87rfcPeiiMYvwefFTG5tb5TGmYLMsp4FqA14nAzxciPJGwcybq4kY6Gnf36s63tNDXJKxps3WpJr")'}}>
<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6">
<span className="bg-primary text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded w-fit mb-2">New Arrival</span>
</div>
</div>
<div className="p-6 pt-2 flex flex-col gap-4">
<div>
<h4 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Grocery</h4>
<p className="text-slate-500 dark:text-slate-400 text-sm">Fresh organic essentials daily</p>
</div>
<button className="w-full py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-slate-950 transition-colors flex items-center justify-center gap-2">
                                        Browse Items <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
<div className="group flex flex-col gap-4 bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-2">
<div className="relative w-full aspect-square bg-center bg-cover overflow-hidden" data-alt="High quality sports equipment including sneakers and dumbbells" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCGM9zvnVC9KjdnKycBiTAt2QfxbSSVixDtfZ1veXOuVduKbt8aQHYnyThgGTuUHh3SyX_oYygroHx72es__uEg0iESDUXJH2hLtRygchHzoAuBJ8NOEM4v4LLWVrPtCC5ADIpo0VbX_NNK7IoegYB94uWNlRXwyo6xKaHPbTn8LuVSyJ3-99yxx57v211X0MVpYYcoHWYeQabXfWTzVywndLN9tFaDjAYq3igrpzPSiz7HUr-s6VK_gzNelkCdn1VGnNFOhEtBe-q7")'}}>
<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6"></div>
</div>
<div className="p-6 pt-2 flex flex-col gap-4">
<div>
<h4 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Sports</h4>
<p className="text-slate-500 dark:text-slate-400 text-sm">Professional gear &amp; apparel</p>
</div>
<button className="w-full py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-slate-950 transition-colors flex items-center justify-center gap-2">
                                        Browse Items <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
<div className="group flex flex-col gap-4 bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-2">
<div className="relative w-full aspect-square bg-center bg-cover overflow-hidden" data-alt="Modern kitchen utensils and cookware on a marble counter" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB6xF3Bvm-HBxfSsrTR5BfbBsBJshaKi9U70XsuxunBWtvc2Yn-I4BiCgxn3WFeaZyexbhQC5HvpqMH4y1kgLlMjyoG7K3wfc9vrPGMvAuAWSc53YaWncme87gffx1ztDBNjYPJQQ7tYHPz8FWMD-QHhB4DxTau6pyiyb7XPajjCHx-iZWgt7q17GDeb8Dsi3PFydweoEUVxSv8uGAI3psp_7xbC9lCu7Y-3Rzyy970P1iJ2gbpQ3qatnobJr-vdYz87q1KiNxxGXPs")'}}>
<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6"></div>
</div>
<div className="p-6 pt-2 flex flex-col gap-4">
<div>
<h4 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Kitchen Items</h4>
<p className="text-slate-500 dark:text-slate-400 text-sm">Modern cooking tools</p>
</div>
<button className="w-full py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-slate-950 transition-colors flex items-center justify-center gap-2">
                                        Browse Items <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
<div className="group flex flex-col gap-4 bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-2">
<div className="relative w-full aspect-square bg-center bg-cover overflow-hidden" data-alt="Stylish clothing hanging on a wooden rack" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBiqsLOYBU7z7eH1MLEYIL93EK4DKEHEunr9o7FO91myhxtKAUhMERs01vKDfk_l6bKhlEv4wQbGFaHClt5e-vfMzfv0dMg1xBHlnoMxmW9L2t1wEz3Jy0i2mtICygx98YKcBn3NJCaQXhFDFBjXZbvyd3gzOg2DJlPku3eBkmJtj-3CDpVzI-0BwyizIV17AH-Ju2vMY2SsrL0DkDc433SF6pjcR3pqdrqpCBZPRYrYQE1BPs1W3DnRDfvDHL2F9jBPoM9bTsHa-zk")'}}>
<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6"></div>
</div>
<div className="p-6 pt-2 flex flex-col gap-4">
<div>
<h4 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Wardrobe</h4>
<p className="text-slate-500 dark:text-slate-400 text-sm">The latest fashion trends</p>
</div>
<button className="w-full py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-slate-950 transition-colors flex items-center justify-center gap-2">
                                        Browse Items <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
</section>
<section className="bg-background-dark text-slate-100 py-20 px-6 lg:px-20 text-center">
<div className="max-w-[800px] mx-auto flex flex-col gap-8">
<h2 className="text-3xl lg:text-5xl font-black">Ready to scale your shop?</h2>
<p className="text-slate-400 text-lg lg:text-xl">Join over 5,000+ local shopkeepers who have transformed their business with Marketnera.</p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
<button className="bg-primary text-slate-950 h-14 px-10 rounded-xl font-bold text-lg hover:scale-105 transition-transform">Get Started Now</button>
<button className="bg-white/10 h-14 px-10 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors">Contact Sales</button>
</div>
</div>
</section>
</main>
<footer className="bg-background-light dark:bg-background-dark border-t border-primary/10 px-6 lg:px-20 py-12">
<div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
<div className="flex flex-col gap-4">
<div className="flex items-center gap-2 text-primary font-bold text-xl">
<Logo />
                        </div>
<p className="text-slate-500 dark:text-slate-400 text-sm">Modernizing local commerce since 2024.</p>
</div>
<div className="flex flex-col gap-4">
<h5 className="font-bold">Platform</h5>
<nav className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
<a className="hover:text-primary transition-colors" href="#">Features</a>
<a className="hover:text-primary transition-colors" href="#">Marketplace</a>
<a className="hover:text-primary transition-colors" href="#">Delivery</a>
</nav>
</div>
<div className="flex flex-col gap-4">
<h5 className="font-bold">Company</h5>
<nav className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
<a className="hover:text-primary transition-colors" href="#">About Us</a>
<a className="hover:text-primary transition-colors" href="#">Success Stories</a>
<a className="hover:text-primary transition-colors" href="#">Careers</a>
</nav>
</div>
<div className="flex flex-col gap-4">
<h5 className="font-bold">Support</h5>
<nav className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
<a className="hover:text-primary transition-colors" href="#">Help Center</a>
<a className="hover:text-primary transition-colors" href="#">API Docs</a>
<a className="hover:text-primary transition-colors" href="#">Privacy</a>
</nav>
</div>
</div>
<div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 uppercase tracking-widest">
<p>© 2026 Marketnera Inc. All rights reserved.</p>
<div className="flex gap-6">
<a className="hover:text-primary transition-colors" href="#">Twitter</a>
<a className="hover:text-primary transition-colors" href="#">LinkedIn</a>
<a className="hover:text-primary transition-colors" href="#">Instagram</a>
</div>
</div>
</footer>
</div>
</div>

    </>
  );
}
