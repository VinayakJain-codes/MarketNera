(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://immnfnpmkxtzfxsmcqjt.supabase.co") || '';
const supabaseKey = ("TURBOPACK compile-time value", "sb_publishable_c_rJobgZJDetyvLER7PQJA_hdQvxMBQ") || '';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/constants/routes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Application route path constants.
 * All internal navigation links must reference these values — never hardcode strings.
 */ __turbopack_context__.s([
    "ROUTES",
    ()=>ROUTES
]);
const ROUTES = {
    HOME: "/",
    FEATURES: "/#features",
    PRICING: "/#pricing",
    CATEGORIES: "/#categories",
    ABOUT: "/about",
    CAREERS: "/careers",
    SUCCESS_STORIES: "/success-stories",
    HELP_CENTER: "/help",
    API_DOCS: "/docs",
    PRIVACY: "/privacy",
    MARKETPLACE: "/marketplace",
    DELIVERY: "/delivery",
    REGISTER: "/register",
    SIGNUP_CUSTOMER: "/register/customer",
    LOGIN_CUSTOMER: "/login/customer",
    CUSTOMER_DASHBOARD: "/customer/dashboard",
    CUSTOMER_PROFILE: "/customer/profile"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/customer/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomerDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/routes.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
/* ── Static data for demo ── */ const categories = [
    {
        name: "Grocery",
        icon: "grocery",
        bg: "bg-orange-50",
        border: "border-orange-100",
        text: "text-orange-500"
    },
    {
        name: "Electronics",
        icon: "devices",
        bg: "bg-blue-50",
        border: "border-blue-100",
        text: "text-blue-500"
    },
    {
        name: "Medicine",
        icon: "medication",
        bg: "bg-red-50",
        border: "border-red-100",
        text: "text-red-500"
    },
    {
        name: "Stationery",
        icon: "edit_note",
        bg: "bg-purple-50",
        border: "border-purple-100",
        text: "text-purple-500"
    },
    {
        name: "Snacks",
        icon: "bakery_dining",
        bg: "bg-yellow-50",
        border: "border-yellow-100",
        text: "text-yellow-600"
    },
    {
        name: "Fashion",
        icon: "checkroom",
        bg: "bg-pink-50",
        border: "border-pink-100",
        text: "text-pink-500"
    },
    {
        name: "Home",
        icon: "chair",
        bg: "bg-teal-50",
        border: "border-teal-100",
        text: "text-teal-500"
    }
];
const nearbyShops = [
    {
        name: "Krishna Supermarket",
        distance: "0.8 km",
        time: "15-20 mins",
        rating: 4.2,
        reviews: "500+",
        verified: true,
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFMu7vl9CnuwRjpE3LvE1P7-ZA5JvoEdyS7sjMezpXgWJR-3IVrzOTERpi0uudqkEslpatleU29FLRxrpFonlBT2XREID-QwVvY_0jVrvGvfjFJbJCfmwyIzIBMpRY-Wd3gwHxlno27-kS9y0QEM1PcUmQrOj5-3urLImhdpuqkVFvpv54Fdic5MyrPzcf_y6zvaxF8Gr1Jyr4q5qrC14J7cL4iTHm_M0i_012vROmhaaDaF9pKF9KJaqtSOqDflLdfGUxXcuQeKib"
    },
    {
        name: "Fresh Organic Hub",
        distance: "1.2 km",
        time: "25-30 mins",
        rating: 4.8,
        reviews: "1k+",
        verified: true,
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvts04zORgQUIB0YSMCwiEvec-z2_Yj309_yLN2N9V2yzZWBhRgf05de-2jQDCwCOfAL49W89XuNb1aqS5CdkZ_5s8X-bpVDfv7glnKfhLoQo0Xl08Blg1S3j1N3N15Igo9ifC8gqX9XiQaVqTjoUF2IyX2f2srZNJ25FiUji2r1avMu8v2cbAQhJjRLfFQL7BQ0S0_KZpn3AmZRJVwGOsNaMXkykgaudFPoIhvUqfEJ546GZdQ0VK-kE_H-rqRVQzjIfT-E8DcxcF"
    },
    {
        name: "Daily Mart Express",
        distance: "2.0 km",
        time: "30-40 mins",
        rating: 4.5,
        reviews: "800+",
        verified: true,
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFMu7vl9CnuwRjpE3LvE1P7-ZA5JvoEdyS7sjMezpXgWJR-3IVrzOTERpi0uudqkEslpatleU29FLRxrpFonlBT2XREID-QwVvY_0jVrvGvfjFJbJCfmwyIzIBMpRY-Wd3gwHxlno27-kS9y0QEM1PcUmQrOj5-3urLImhdpuqkVFvpv54Fdic5MyrPzcf_y6zvaxF8Gr1Jyr4q5qrC14J7cL4iTHm_M0i_012vROmhaaDaF9pKF9KJaqtSOqDflLdfGUxXcuQeKib"
    }
];
const products = [
    {
        name: "Fresh Full Cream Milk 500ml",
        category: "Dairy & Eggs",
        shop: "Krishna Supermarket",
        price: 32,
        originalPrice: 35,
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDU9ah0czt07YQW_D6WDx3hHHyT8rOWof3IK6yQEUPoNTFW04VQURXt3ODsIl6qaam1kCxgHdiP1QZmZZouWJZbbBrVFOsK6LhbzZRushFzNM9oIPhz7RnQg2fFy7v5KinsAsLDt-OxeAexU6kwHuL8Ukz9oFhZ5OnnW5vUmcupy0VK1I_i_hr31Kg5FjRZrgwyFzGMlVWcxUtZ7-lrcjjyfWeqchZiD41LcM129YAwskgIS8YLg4CfIX12sCtCGd3oh79zs4MCYZbS"
    },
    {
        name: "Premium Sliced Sandwich Bread 400g",
        category: "Bakery",
        shop: "Fresh Organic Hub",
        price: 45,
        originalPrice: 50,
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG7Qj4LiMdju3e5M5KUvYwxkWjJAPZk-wC8Lx79JiOecd9RV_eb-OFumsYcBmPdyk4phizc5346cKtGn38P17lyFLNgB3vx7nfBmWfIp862JxSn8D_-CkjMWHzz7tsfarProIogelYUz2jn6zl9NaGW_4A8IXUmIfzpsJyMXUQ6DAz885OyGSxMFY4a_4-qG_CaM2yWCEDCw4DoRj_8TLdlHNPmRKhBWA3U9sP060AkaowLlaisALorHHqoXfbdUUgBMgIYEqemRuL"
    },
    {
        name: "Banana Robusta - 6 Units",
        category: "Fruits & Veggies",
        shop: "Fruit Market Pro",
        price: 28,
        originalPrice: 40,
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO_jZ8UuAYEwQH7blCyefyoqj8DGmhDiDqMLe1ZvqmUWEUa5H1TOMqmqgv9DjjcS2pBUDC9KCHrY5JaFO7GAFM_M7SawY-p1SgonvP0xAgsIvQLC-Wk4PdeRaEr-nlErLa2o_lnWCq5oNWXmm670NB25HYL7Tu_-4F6ApExz70XXELZ_h3XVLEKbmGSwwE4v71nFFLwJ1FZYvM7h-lP8Kw7VwiAqMaj3d3ZaM6dpCRuQk7G31i4P4Upe2h83r-0ed1FWy8dyZ1Vi28"
    },
    {
        name: "Spicy Masala Peanut 150g",
        category: "Snacks",
        shop: "Snack Corner",
        price: 65,
        originalPrice: 75,
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbpLV9hcNIG_E1jYB0bQlJ6ESs4d2807CZ88727tp9DUZJDmTHrQpUCfjadfnpxIRvNS9dH9XSBwvpz7yMZ70VNUz2JvgSMNgA0ijSMyV-EUrBKW9EPX1sjGQxojIXPKWXljlsH4vwXmVN3ht-KATjdK2SFY9S08YekSBt9oJj0NN7dY5q5cHfed9ombdHtoHFU-GxA0HVTZ8PP5pEzHxa_T67kiO39Ek-kRRCYeOGBUtRD_qtU8puteXuQMPxag2AL4lQb8oy7jvm"
    }
];
function CustomerDashboard() {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Detecting precise location...");
    const [showLocationModal, setShowLocationModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [addedItems, setAddedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomerDashboard.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession().then({
                "CustomerDashboard.useEffect": ({ data: { session } })=>{
                    setUser(session?.user ?? null);
                }
            }["CustomerDashboard.useEffect"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange({
                "CustomerDashboard.useEffect": (_event, session)=>{
                    setUser(session?.user ?? null);
                }
            }["CustomerDashboard.useEffect"]);
            // Auto-detect location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition({
                    "CustomerDashboard.useEffect": async (position)=>{
                        try {
                            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
                            const data = await res.json();
                            const addr = data.address;
                            const preciseParts = [
                                addr.house_number,
                                addr.road || addr.street || addr.pedestrian,
                                addr.suburb || addr.neighbourhood || addr.residential,
                                addr.city || addr.town || addr.village,
                                addr.postcode
                            ].filter(Boolean);
                            setLocation(preciseParts.length > 0 ? preciseParts.join(", ") : data.display_name.split(",").slice(0, 3).join(", "));
                        } catch  {
                            setLocation("Location unavailable");
                        }
                    }
                }["CustomerDashboard.useEffect"], {
                    "CustomerDashboard.useEffect": ()=>setLocation("Enable location access")
                }["CustomerDashboard.useEffect"]);
            }
        }
    }["CustomerDashboard.useEffect"], []);
    const metadata = user?.user_metadata || {};
    const fullName = metadata.full_name || metadata.name || user?.email?.split("@")[0] || "Guest";
    const avatarUrl = metadata.avatar_url;
    const initial = fullName.charAt(0).toUpperCase();
    const handleAdd = (index)=>{
        setAddedItems((prev)=>{
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };
    const handleLogout = async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        window.location.href = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].HOME;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-[480px] mx-auto bg-white min-h-screen shadow-xl relative pb-24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 pt-4 pb-2 border-b border-slate-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4 animate-fade-in-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowLocationModal(!showLocationModal),
                                className: "flex items-center gap-2 group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-primary",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "material-symbols-outlined text-3xl",
                                            children: "location_on"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                            lineNumber: 108,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 107,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest",
                                                        children: "Delivering to"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                        lineNumber: 112,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined text-xs text-slate-400 group-hover:rotate-180 transition-transform",
                                                        children: "expand_more"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 111,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-slate-800 truncate max-w-[180px]",
                                                children: location
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 119,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 110,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 103,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "material-symbols-outlined text-slate-600",
                                                children: "notifications"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 128,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 129,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 127,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].CUSTOMER_PROFILE,
                                        title: "My Profile",
                                        className: "w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary hover:scale-110 transition-all duration-300 shadow-sm",
                                        children: avatarUrl ? // eslint-disable-next-line @next/next/no-img-element
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: avatarUrl,
                                            alt: fullName,
                                            className: "w-full h-full object-cover",
                                            referrerPolicy: "no-referrer"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                            lineNumber: 138,
                                            columnNumber: 33
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm",
                                            children: initial
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                            lineNumber: 140,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 131,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 126,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                        lineNumber: 101,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative group animate-fade-in-up delay-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "material-symbols-outlined text-xl",
                                    children: "search"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 151,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 150,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "block w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:bg-white focus:shadow-lg placeholder-slate-400 outline-none transition-all duration-300",
                                placeholder: "Search for 'Amul Milk', 'Batter', 'Soap'...",
                                type: "text"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 153,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "material-symbols-outlined text-xl",
                                    children: "mic"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 159,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 158,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                        lineNumber: 149,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                lineNumber: 100,
                columnNumber: 13
            }, this),
            showLocationModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[60] flex items-end justify-center bg-black/30 backdrop-blur-sm animate-fade-in",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white w-full max-w-[480px] rounded-t-3xl p-6 pb-10 shadow-2xl animate-fade-in-up",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-slate-900",
                                    children: "Choose your location"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 169,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowLocationModal(false),
                                    className: "text-slate-400 hover:text-slate-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "material-symbols-outlined",
                                        children: "close"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 171,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 170,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                            lineNumber: 168,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                navigator.geolocation?.getCurrentPosition(async (pos)=>{
                                    try {
                                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
                                        const data = await res.json();
                                        const addr = data.address;
                                        const preciseParts = [
                                            addr.house_number,
                                            addr.road || addr.street || addr.pedestrian,
                                            addr.suburb || addr.neighbourhood || addr.residential,
                                            addr.city || addr.town || addr.village,
                                            addr.postcode
                                        ].filter(Boolean);
                                        setLocation(preciseParts.length > 0 ? preciseParts.join(", ") : data.display_name.split(",").slice(0, 3).join(", "));
                                    } catch  {
                                        setLocation("Location unavailable");
                                    }
                                });
                                setShowLocationModal(false);
                            },
                            className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "material-symbols-outlined",
                                    children: "my_location"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 204,
                                    columnNumber: 29
                                }, this),
                                "Use my current location"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                            lineNumber: 174,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Search for area, street name...",
                                className: "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary placeholder-slate-400",
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter") {
                                        setLocation(e.target.value);
                                        setShowLocationModal(false);
                                    }
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 208,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                            lineNumber: 207,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                    lineNumber: 167,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                lineNumber: 166,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-4 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3 overflow-x-auto no-scrollbar",
                    children: categories.map((cat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `flex flex-col items-center gap-2 min-w-[72px] animate-fade-in-up group`,
                            style: {
                                animationDelay: `${i * 0.07}s`
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-16 h-16 rounded-2xl ${cat.bg} flex items-center justify-center border ${cat.border} group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 shadow-sm`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `material-symbols-outlined ${cat.text} text-3xl`,
                                        children: cat.icon
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 234,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 233,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[11px] font-semibold text-slate-600",
                                    children: cat.name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 236,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, cat.name, true, {
                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                            lineNumber: 228,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                    lineNumber: 226,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                lineNumber: 225,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-2 animate-fade-in-up delay-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full h-36 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 p-6 flex justify-between items-center relative overflow-hidden shadow-lg shadow-orange-500/20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-white text-xl font-bold leading-tight",
                                    children: [
                                        "Fresh Grocery",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                            lineNumber: 247,
                                            columnNumber: 42
                                        }, this),
                                        "at Your Doorstep"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 246,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-white/80 text-xs mt-1",
                                    children: "Get 20% off on your first order"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 249,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "mt-3 px-5 py-2 bg-white text-orange-600 rounded-lg text-xs font-bold shadow-lg hover:scale-105 transition-transform",
                                    children: "ORDER NOW"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 250,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                            lineNumber: 245,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute -right-4 -bottom-4 w-32 h-32 opacity-20 animate-float",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "material-symbols-outlined text-[120px] text-white",
                                children: "shopping_basket"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 255,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                            lineNumber: 254,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                    lineNumber: 244,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                lineNumber: 243,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center px-4 mb-4 animate-fade-in-up delay-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-slate-900",
                                children: "Nearby Shops"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 263,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                className: "text-primary text-sm font-semibold hover:underline",
                                href: "#",
                                children: "View All"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 264,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                        lineNumber: 262,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2",
                        children: nearbyShops.map((shop, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-[240px] bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden animate-slide-in-right hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
                                style: {
                                    animationDelay: `${0.3 + i * 0.12}s`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-24 bg-slate-200 relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                alt: shop.name,
                                                className: "w-full h-full object-cover",
                                                src: shop.img
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 275,
                                                columnNumber: 33
                                            }, this),
                                            shop.verified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-2 right-2 px-2 py-0.5 bg-[#13ec5b] text-white text-[10px] font-bold rounded flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined text-[12px] fill-1",
                                                        children: "verified"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                        lineNumber: 278,
                                                        columnNumber: 41
                                                    }, this),
                                                    " VERIFIED"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 277,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 273,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-bold text-sm text-slate-800",
                                                children: shop.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 283,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-500 mt-0.5",
                                                children: [
                                                    shop.distance,
                                                    " • ",
                                                    shop.time
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 284,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1 mt-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined text-yellow-400 text-sm fill-1",
                                                        children: "star"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                        lineNumber: 286,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-slate-800",
                                                        children: shop.rating
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] text-slate-400",
                                                        children: [
                                                            "(",
                                                            shop.reviews,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                        lineNumber: 288,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 285,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 282,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, shop.name, true, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 268,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                        lineNumber: 266,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                lineNumber: 261,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-8 px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-4 animate-fade-in-up delay-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-slate-900",
                                children: "Daily Essentials"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 299,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "px-3 py-1 bg-slate-100 text-[11px] font-semibold rounded-full border border-slate-200 hover:bg-slate-200 transition-colors",
                                        children: "Sort"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 301,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "px-3 py-1 bg-slate-100 text-[11px] font-semibold rounded-full border border-slate-200 hover:bg-slate-200 transition-colors",
                                        children: "Filter"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 302,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 300,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                        lineNumber: 298,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-4",
                        children: products.map((product, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "group bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col animate-fade-in-up hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
                                style: {
                                    animationDelay: `${0.4 + i * 0.1}s`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            alt: product.name,
                                            className: "w-full h-full object-contain hover:scale-105 transition-transform duration-300",
                                            src: product.img
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                            lineNumber: 314,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 312,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-grow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] font-bold text-slate-400 uppercase tracking-tighter",
                                                children: product.category
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 317,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                className: "text-sm font-semibold text-slate-800 line-clamp-2 mt-0.5 leading-snug",
                                                children: product.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 318,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-primary font-medium mt-1",
                                                children: product.shop
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 319,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 316,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mt-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-bold text-slate-900",
                                                        children: [
                                                            "₹",
                                                            product.price
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                        lineNumber: 323,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] text-slate-400 line-through",
                                                        children: [
                                                            "₹",
                                                            product.originalPrice
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                        lineNumber: 324,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 322,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleAdd(i),
                                                className: `flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 ${addedItems.has(i) ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined text-sm",
                                                        children: addedItems.has(i) ? "check" : "add"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 37
                                                    }, this),
                                                    addedItems.has(i) ? "ADDED" : "ADD"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                                lineNumber: 326,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                        lineNumber: 321,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, product.name, true, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 307,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                        lineNumber: 305,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                lineNumber: 297,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] glass-nav border-t border-slate-100 flex items-center justify-around py-3 z-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: "flex flex-col items-center gap-1 text-primary",
                        href: "#",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "material-symbols-outlined fill-1",
                                children: "home"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 348,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-bold",
                                children: "Home"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 349,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                        lineNumber: 347,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: "flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors",
                        href: "#",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "material-symbols-outlined",
                                children: "storefront"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 352,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-medium",
                                children: "Shops"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 353,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                        lineNumber: 351,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative -mt-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "w-14 h-14 bg-[#13ec5b] text-slate-900 rounded-full flex items-center justify-center shadow-lg shadow-[#13ec5b]/30 border-4 border-white hover:scale-110 transition-transform active:scale-95",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "material-symbols-outlined text-3xl",
                                    children: "shopping_cart"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 357,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse-badge",
                                    children: addedItems.size
                                }, void 0, false, {
                                    fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                    lineNumber: 358,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/customer/dashboard/page.tsx",
                            lineNumber: 356,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                        lineNumber: 355,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: "flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors",
                        href: "#",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "material-symbols-outlined",
                                children: "receipt_long"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 364,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-medium",
                                children: "Orders"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 365,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                        lineNumber: 363,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: "flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors",
                        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].CUSTOMER_PROFILE,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "material-symbols-outlined",
                                children: "person"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 368,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-medium",
                                children: "Profile"
                            }, void 0, false, {
                                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                                lineNumber: 369,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/customer/dashboard/page.tsx",
                        lineNumber: 367,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/customer/dashboard/page.tsx",
                lineNumber: 346,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/customer/dashboard/page.tsx",
        lineNumber: 98,
        columnNumber: 9
    }, this);
}
_s(CustomerDashboard, "KK5p5gRtJs6MR+EtGCJYmp1+WaM=");
_c = CustomerDashboard;
var _c;
__turbopack_context__.k.register(_c, "CustomerDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_88da3ee8._.js.map