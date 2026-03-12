export default function Screen() {
  return (
    <>
      
<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
<header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 backdrop-blur-md dark:bg-background-dark/80">
<div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-20">
<div className="flex items-center gap-2">
<div className="text-primary flex h-8 w-8 items-center justify-center">
<svg className="h-full w-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
</svg>
</div>
<span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Marketnera</span>
</div>
<nav className="hidden items-center gap-8 md:flex">
<a className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary" href="#">Home</a>
<a className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary" href="#">Features</a>
<a className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary" href="#">Pricing</a>
</nav>
<div className="flex items-center gap-4">
<button className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-bold text-slate-950 transition-all hover:opacity-90">
                Sign In
            </button>
<div className="hidden h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20 bg-cover bg-center sm:block" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDUd7MKcS02OkqcX0Z79R9aXqVAZSobUkkQvYxxBtthC3QzG3DAlg0oSNrgXWOrR3r4WodCpYNYCCJ9EAj2syZxBYRmILuOmFY0K3W73VJnHLy4tHz-pcssDFiSnyoIIDKuDCOuWJ-BiUf6GWPEXo5a5cCwYnGK1JG17y5XAxrnoMxkqas1dP2XYb4yeo9wyT1zi2ua0iwFAekF0vBoxGgJBUssSBlN0c1aDaX9J33AY_pbbaxiKLl_hcZg8P6Nu4gqsWj7trX3xc1X")'}}></div>
</div>
</div>
</header>
<main className="flex-1">
<section className="relative overflow-hidden py-16 lg:py-24">
<div className="container mx-auto px-6 lg:px-20">
<div className="grid gap-12 lg:grid-cols-2 lg:items-center">
<div className="flex flex-col space-y-8">
<div className="space-y-4">
<span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary">Digital Transformation</span>
<h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-slate-100 lg:text-7xl">
                        Empowering Local Shopkeepers in the Digital Age
                    </h1>
<p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 lg:text-xl">
                        Help your local business compete and thrive online with modern tools for inventory, delivery, and marketing.
                    </p>
</div>
<div className="flex flex-wrap gap-4">
<button className="inline-flex h-14 min-w-[180px] items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-slate-950 shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                        Get Started
                    </button>
<button className="inline-flex h-14 min-w-[180px] items-center justify-center rounded-xl border-2 border-primary px-8 text-base font-bold text-primary transition-colors hover:bg-primary/5">
                        Watch Demo
                    </button>
</div>
</div>
<div className="relative">
<div className="aspect-video w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-900/5">
<div className="h-full w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1C-bsXfzER13g0lNgxU9LH6PzBrzB3OordTZ5ezDdqUEK0CyigSCUKPvJ_TnKcGwCoY23qCTNcIBjC82IALOssvAw-QKXXk50S0Pndl8NKI1p5J4OQxx6e3xc5l7yKjnOi7RGTLtHtH44D6Bi946B_BcAaHgmeRA-E6oX0Z7hXnYHojdwSidHZbcbxpRQUUY-XzWWBtPiOJ2Nf9yQFvjh5op3XVn1nj5EzSP20YQRzj5QitlKKGpdj0TJplWdfstGvJl43MnFpqUI")'}}></div>
</div>
<div className="absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-2xl bg-primary/20 blur-2xl lg:block"></div>
<div className="absolute -right-6 -top-6 hidden h-32 w-32 rounded-full bg-primary/10 blur-3xl lg:block"></div>
</div>
</div>
</div>
</section>
<section className="bg-primary/5 py-24">
<div className="container mx-auto px-6 lg:px-20">
<div className="mb-16 flex flex-col items-center text-center">
<h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 lg:text-4xl">Why Marketnera?</h2>
<p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Our platform is meticulously designed to bridge the gap between physical storefronts and the digital marketplace.
            </p>
</div>
<div className="grid gap-8 md:grid-cols-3">
<div className="group relative flex flex-col space-y-6 rounded-2xl border border-primary/10 bg-white p-8 transition-all hover:shadow-xl dark:bg-slate-900">
<div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-slate-950">
<span className="material-symbols-outlined text-3xl">trending_up</span>
</div>
<div className="space-y-2">
<h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Increase Sales</h3>
<p className="leading-relaxed text-slate-600 dark:text-slate-400">Leverage powerful SEO and marketing tools to grow your daily revenue automatically.</p>
</div>
</div>
<div className="group relative flex flex-col space-y-6 rounded-2xl border border-primary/10 bg-white p-8 transition-all hover:shadow-xl dark:bg-slate-900">
<div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-slate-950">
<span className="material-symbols-outlined text-3xl">groups</span>
</div>
<div className="space-y-2">
<h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Reach More Customers</h3>
<p className="leading-relaxed text-slate-600 dark:text-slate-400">Connect with shoppers in your neighborhood and across the city through our mobile app.</p>
</div>
</div>
<div className="group relative flex flex-col space-y-6 rounded-2xl border border-primary/10 bg-white p-8 transition-all hover:shadow-xl dark:bg-slate-900">
<div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-slate-950">
<span className="material-symbols-outlined text-3xl">inventory_2</span>
</div>
<div className="space-y-2">
<h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Smart Management</h3>
<p className="leading-relaxed text-slate-600 dark:text-slate-400">Manage your inventory, orders, and delivery fleet through a seamless dashboard.</p>
</div>
</div>
</div>
</div>
</section>
<section className="py-24">
<div className="container mx-auto px-6 lg:px-20">
<div className="mb-12 flex flex-wrap items-end justify-between gap-4">
<div className="space-y-2">
<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Browse by Category</h2>
<p className="text-slate-600 dark:text-slate-400">Discover top-selling items from local partners</p>
</div>
<a className="group flex items-center font-bold text-primary hover:underline" href="#">
                View All Categories 
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
</a>
</div>
<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
<div className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-slate-900 dark:border-slate-800">
<div className="relative aspect-square overflow-hidden">
<img alt="Grocery" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB202VitgXwM5sug7nubqMb527DL-dIHGvv9AC0lH00KRaAXJcXWmd-LCu-Uq7PaqoBDzOjp5uEouJT4TPqrvTHVLUh4NZclqj7bG5n0LsbrarQO-JyR_ZwTlock5IXPZztxzYshZxP7EXx0UxqjTuhXXuiTorwkfE1U_7U8t9geqvNfujBXADy-UXfBijY6mYf87rfcPeiiMYvwefFTG5tb5TGmYLMsp4FqA14nAzxciPJGwcybq4kY6Gnf36s63tNDXJKxps3WpJr"/>
<div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
<span className="absolute bottom-4 left-4 rounded bg-primary px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950">New Arrival</span>
</div>
<div className="flex flex-1 flex-col p-6">
<div className="mb-6 flex-1">
<h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Grocery</h4>
<p className="text-sm text-slate-500 dark:text-slate-400">Fresh organic essentials daily</p>
</div>
<button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-slate-950">
                        Browse Items <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
<div className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-slate-900 dark:border-slate-800">
<div className="relative aspect-square overflow-hidden">
<img alt="Sports" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGM9zvnVC9KjdnKycBiTAt2QfxbSSVixDtfZ1veXOuVduKbt8aQHYnyThgGTuUHh3SyX_oYygroHx72es__uEg0iESDUXJH2hLtRygchHzoAuBJ8NOEM4v4LLWVrPtCC5ADIpo0VbX_NNK7IoegYB94uWNlRXwyo6xKaHPbTn8LuVSyJ3-99yxx57v211X0MVpYYcoHWYeQabXfWTzVywndLN9tFaDjAYq3igrpzPSiz7HUr-s6VK_gzNelkCdn1VGnNFOhEtBe-q7"/>
<div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
</div>
<div className="flex flex-1 flex-col p-6">
<div className="mb-6 flex-1">
<h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sports</h4>
<p className="text-sm text-slate-500 dark:text-slate-400">Professional gear &amp; apparel</p>
</div>
<button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-slate-950">
                        Browse Items <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
<div className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-slate-900 dark:border-slate-800">
<div className="relative aspect-square overflow-hidden">
<img alt="Kitchen Items" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6xF3Bvm-HBxfSsrTR5BfbBsBJshaKi9U70XsuxunBWtvc2Yn-I4BiCgxn3WFeaZyexbhQC5HvpqMH4y1kgLlMjyoG7K3wfc9vrPGMvAuAWSc53YaWncme87gffx1ztDBNjYPJQQ7tYHPz8FWMD-QHhB4DxTau6pyiyb7XPajjCHx-iZWgt7q17GDeb8Dsi3PFydweoEUVxSv8uGAI3psp_7xbC9lCu7Y-3Rzyy970P1iJ2gbpQ3qatnobJr-vdYz87q1KiNxxGXPs"/>
<div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
</div>
<div className="flex flex-1 flex-col p-6">
<div className="mb-6 flex-1">
<h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Kitchen Items</h4>
<p className="text-sm text-slate-500 dark:text-slate-400">Modern cooking tools</p>
</div>
<button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-slate-950">
                        Browse Items <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
<div className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-slate-900 dark:border-slate-800">
<div className="relative aspect-square overflow-hidden">
<img alt="Wardrobe" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiqsLOYBU7z7eH1MLEYIL93EK4DKEHEunr9o7FO91myhxtKAUhMERs01vKDfk_l6bKhlEv4wQbGFaHClt5e-vfMzfv0dMg1xBHlnoMxmW9L2t1wEz3Jy0i2mtICygx98YKcBn3NJCaQXhFDFBjXZbvyd3gzOg2DJlPku3eBkmJtj-3CDpVzI-0BwyizIV17AH-Ju2vMY2SsrL0DkDc433SF6pjcR3pqdrqpCBZPRYrYQE1BPs1W3DnRDfvDHL2F9jBPoM9bTsHa-zk"/>
<div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
</div>
<div className="flex flex-1 flex-col p-6">
<div className="mb-6 flex-1">
<h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Wardrobe</h4>
<p className="text-sm text-slate-500 dark:text-slate-400">The latest fashion trends</p>
</div>
<button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-slate-950">
                        Browse Items <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
</section>
<section className="relative bg-background-dark py-24 text-slate-100">
<div className="container mx-auto px-6 lg:px-20">
<div className="flex flex-col items-center text-center">
<div className="mb-10 space-y-4">
<h2 className="text-4xl font-black lg:text-6xl">Ready to scale your shop?</h2>
<p className="mx-auto max-w-2xl text-lg text-slate-400 lg:text-xl">
                    Join over 5,000+ local shopkeepers who have transformed their business with Marketnera.
                </p>
</div>
<div className="flex flex-col gap-4 sm:flex-row">
<button className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-xl bg-primary px-10 text-lg font-bold text-slate-950 transition-all hover:scale-105">
                    Get Started Now
                </button>
<button className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-xl bg-white/10 px-10 text-lg font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                    Contact Sales
                </button>
</div>
</div>
</div>
<div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
<div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]"></div>
<div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-[100px]"></div>
</div>
</section>
</main>
<footer className="border-t border-primary/10 bg-background-light py-16 dark:bg-background-dark">
<div className="container mx-auto px-6 lg:px-20">
<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
<div className="space-y-6">
<div className="flex items-center gap-2 text-2xl font-bold text-primary">
<span className="material-symbols-outlined text-3xl">shopping_bag</span>
<span>Marketnera</span>
</div>
<p className="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Modernizing local commerce since 2024. Bridging the gap between local shops and the digital future.
                </p>
</div>
<div className="space-y-6">
<h5 className="text-sm font-bold uppercase tracking-widest">Platform</h5>
<nav className="flex flex-col space-y-3">
<a className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">Features</a>
<a className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">Marketplace</a>
<a className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">Delivery</a>
</nav>
</div>
<div className="space-y-6">
<h5 className="text-sm font-bold uppercase tracking-widest">Company</h5>
<nav className="flex flex-col space-y-3">
<a className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">About Us</a>
<a className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">Success Stories</a>
<a className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">Careers</a>
</nav>
</div>
<div className="space-y-6">
<h5 className="text-sm font-bold uppercase tracking-widest">Support</h5>
<nav className="flex flex-col space-y-3">
<a className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">Help Center</a>
<a className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">API Docs</a>
<a className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">Privacy</a>
</nav>
</div>
</div>
<div className="mt-16 border-t border-primary/10 pt-8">
<div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
<p className="text-xs tracking-wide text-slate-500 dark:text-slate-400">© 2024 Marketnera Inc. All rights reserved.</p>
<div className="flex gap-8">
<a className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">Twitter</a>
<a className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">LinkedIn</a>
<a className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-primary dark:text-slate-400" href="#">Instagram</a>
</div>
</div>
</div>
</div>
</footer>
</div>
</div>

    </>
  );
}
