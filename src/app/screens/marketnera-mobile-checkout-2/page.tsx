export default function Screen() {
  return (
    <>
      
<div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
{/* Navigation Header */}
<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-4 md:px-10 py-3 bg-white dark:bg-slate-900">
<div className="flex items-center gap-4">
<div className="text-primary">
<svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
</svg>
</div>
<h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">Marketnera</h2>
</div>
<div className="flex items-center gap-4">
<button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-slate-900 dark:text-slate-100">
<span className="material-symbols-outlined">shopping_bag</span>
</button>
<div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary" data-alt="User profile circular avatar photo" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvT9h252I4IpGdUwk8CZfoglIPnmosQKuzUEbF5qfJP9ZB6VzgX6PPkXUjQHW9rQE0JQ8Dz3pZyJy-jfUP6BkohSmjr6-OxxsNoWYmuCDqYi65I1NaDO7apiu85KtzrrCaESTvxIsW4M6CK8mmkDuO66Spay1Sp2CUdEEFKqZOOJpPHliw_k8EjMZgsPpTn-p1yVe-KL66cZ9oTnza7vc-k_Wl2PffSr8GqQPPdJXyuo00hEhtlfzItv-Lc0l7zwPTYExAAM9kWSzz")'}}></div>
</div>
</header>
<main className="flex flex-1 justify-center py-8 px-4">
<div className="layout-content-container flex flex-col max-w-[600px] flex-1 gap-6">
{/* Page Title */}
<div className="flex flex-col gap-1">
<h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">Checkout</h1>
<p className="text-slate-500 dark:text-slate-400 text-sm">Almost there! Review your cart and provide delivery details.</p>
</div>
{/* Cart Items Section */}
<div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-primary/5">
<h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">shopping_cart</span>
                            Your Items
                        </h2>
{/* Item 1 */}
<div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
<div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16" data-alt="Fresh organic yellow alphonso mangoes" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-WdwNFOcq2YJjwstjiV8SmDE9lEt6Q9xlFxBpkeupOtcLi-Tnjd8jqJ6p9GY4BlXF0uwF1kCSqpBmHEtASWAA-MufJGw-y6j6ddQxjyUVIS4BddsgcfeUPku1wbxbDlFMrX2B0jIvMtVnQNnqHHu2zddgNBELAGMKKclDjK7OgEiw8CwflL3EX2q4RE1KMn1r6qG529eZrQlb9GAHJEPO-KNBOsvekUyF1I64lJ0_7670CWpbJ4yqtPDHPvkEPWO_ZN4ehVgWoByx")'}}></div>
<div className="flex flex-1 flex-col justify-center">
<p className="text-slate-900 dark:text-slate-100 text-base font-semibold leading-tight">Organic Alphonso Mangoes</p>
<p className="text-orange-500 text-sm font-medium">₹499 per kg</p>
</div>
<div className="flex items-center gap-3 bg-primary/5 p-1 rounded-full">
<button className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-primary border border-primary/20 shadow-sm">
<span className="material-symbols-outlined text-sm">remove</span>
</button>
<span className="text-slate-900 dark:text-slate-100 font-bold w-4 text-center">2</span>
<button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md">
<span className="material-symbols-outlined text-sm">add</span>
</button>
</div>
</div>
{/* Item 2 */}
<div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
<div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16" data-alt="Bag of premium long grain basmati rice" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXKIwF51hFoAGvtnjYa5-J6OoXqp-Sj_T9pbKcVj32uxPUOvCqUh4KjGwCBYK86zVSBLxTXM1Jqhf7wljJNlloGPRdP1DBUEMAZSxChsSgP6_Xvp9XLRetWq9_GvFxNDh1dSfBdm5QGxoacRFGXJWDN9gnF7S-c_rMaPGuNYzJo0jeSsDQGBFDCV45ILs6n1f8EMmLUtmZka69lLzwNgDOBSbTGgYeAj5W8fgYx8KQSq6a4iBwVUV3oSvqZKQgK3Zy0IldlMnjJQAl")'}}></div>
<div className="flex flex-1 flex-col justify-center">
<p className="text-slate-900 dark:text-slate-100 text-base font-semibold leading-tight">Basmati Rice - 5kg</p>
<p className="text-orange-500 text-sm font-medium">₹850</p>
</div>
<div className="flex items-center gap-3 bg-primary/5 p-1 rounded-full">
<button className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-primary border border-primary/20 shadow-sm">
<span className="material-symbols-outlined text-sm">remove</span>
</button>
<span className="text-slate-900 dark:text-slate-100 font-bold w-4 text-center">1</span>
<button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md">
<span className="material-symbols-outlined text-sm">add</span>
</button>
</div>
</div>
</div>
{/* Delivery Address Section */}
<div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/5">
<h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">location_on</span>
                            Delivery Address
                        </h2>
<div className="grid grid-cols-1 gap-4">
<div className="flex flex-col gap-1">
<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
<input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary" placeholder="e.g. Rahul Sharma" type="text"/>
</div>
<div className="flex flex-col gap-1">
<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Street Address</label>
<input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary" placeholder="House No, Street, Area" type="text"/>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="flex flex-col gap-1">
<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
<input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary" placeholder="Mumbai" type="text"/>
</div>
<div className="flex flex-col gap-1">
<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pincode</label>
<input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary" placeholder="400001" type="text"/>
</div>
</div>
</div>
</div>
{/* Order Summary */}
<div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/5">
<h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-4">Summary</h2>
<div className="flex flex-col gap-3">
<div className="flex justify-between text-slate-600 dark:text-slate-400">
<span>Subtotal</span>
<span className="font-medium">₹1,848</span>
</div>
<div className="flex justify-between text-slate-600 dark:text-slate-400">
<span>Delivery Fee</span>
<span className="text-primary font-medium">FREE</span>
</div>
<div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
<div className="flex justify-between text-slate-900 dark:text-slate-100 text-xl font-black">
<span>Total</span>
<span>₹1,848</span>
</div>
<div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 p-3 rounded-lg text-sm mt-2">
<span className="material-symbols-outlined">payments</span>
<span>Payment Method: <strong>Cash on Delivery (COD)</strong></span>
</div>
</div>
</div>
{/* Final Action */}
<div className="mt-4 mb-10">
<button className="w-full bg-primary hover:bg-primary/90 text-slate-900 py-5 rounded-xl text-lg font-black tracking-tight shadow-lg shadow-primary/20 flex items-center justify-center gap-3">
                            Place Order (COD)
                            <span className="material-symbols-outlined">arrow_forward</span>
</button>
<p className="text-center text-slate-400 text-xs mt-4 uppercase tracking-widest font-bold">Secure checkout by Marketnera</p>
</div>
</div>
</main>
</div>
</div>

    </>
  );
}
