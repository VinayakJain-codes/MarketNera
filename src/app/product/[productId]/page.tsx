"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";
import { addToCart, getCartCount, getGuestCart, addGuestCartItem } from "@/lib/services/cart";
import { toggleWishlist, getWishlist } from "@/lib/services/wishlist";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import Footer from "@/components/layout/Footer";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingBag,
  Store,
  Clock,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Package,
  Star,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [shop, setShop] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data: prodData, error: prodErr } = await supabase
          .from("shopkeeper_products")
          .select("*, product_media(*)")
          .eq("id", productId)
          .single();

        if (prodErr || !prodData) {
          console.error("Error fetching product:", prodErr);
          setLoading(false);
          return;
        }

        setProduct(prodData);
        setMedia(prodData.product_media || []);

        const { data: shopData } = await supabase
          .from("shopkeeper")
          .select("*")
          .eq("user_id", prodData.shop_id)
          .single();

        setShop(shopData);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    if (user) {
      getCartCount(user.id).then(setCartCount);

      getWishlist(user.id).then((items) => {
        setIsWishlisted(items.some((i) => i.product_id === product.id));
      });

      supabase
        .from("cart_items")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .then(({ data }) => {
          if (data && data.length > 0) setIsAdded(true);
        });
    } else {
      const guestCart = getGuestCart();
      const total = guestCart.reduce((acc, i) => acc + (i.quantity || 1), 0);
      setCartCount(total);
      if (guestCart.some((i) => i.id === product.id)) {
        setIsAdded(true);
      }
    }
  }, [user, product]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (isAdded) {
      router.push(ROUTES.CUSTOMER_CART);
      return;
    }

    setIsAdded(true);
    if (user) {
      const result = await addToCart(user.id, product.id, product.shop_id);
      if (result.success) {
        setCartCount((c) => c + quantity);
        toast.success(`${product.name} added to cart!`);
      } else {
        setIsAdded(false);
        toast.error("Could not add to cart.");
      }
    } else {
      addGuestCartItem({
        id: product.id,
        name: product.name,
        price: product.sale_price ?? product.price,
        shopId: product.shop_id,
        quantity: quantity,
        unit: product.unit_type,
        image: media[0]?.media_url,
      });
      setCartCount((c) => c + quantity);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!isAdded) {
      if (user) {
        await addToCart(user.id, product.id, product.shop_id);
      } else {
        addGuestCartItem({
          id: product.id,
          name: product.name,
          price: product.sale_price ?? product.price,
          shopId: product.shop_id,
          quantity: quantity,
          unit: product.unit_type,
          image: media[0]?.media_url,
        });
      }
    }
    router.push(ROUTES.CUSTOMER_CART);
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      router.push(ROUTES.LOGIN_CUSTOMER);
      return;
    }

    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    const { error } = await toggleWishlist(user.id, product.id);
    if (error) {
      setIsWishlisted(!nextState);
      toast.error(error);
    } else {
      toast.success(nextState ? "Added to Wishlist!" : "Removed from Wishlist!");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <CustomerNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-semibold">Loading product details...</p>
        </div>
        <Footer />
        <CustomerBottomNav />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <CustomerNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Package className="w-16 h-16 text-slate-300 mb-4" />
          <h1 className="text-2xl font-black text-slate-900 mb-2">Product Not Found</h1>
          <p className="text-slate-500 text-sm max-w-md mb-6">
            The item you are looking for might have been unlisted or removed by the merchant.
          </p>
          <button
            onClick={() => router.push(ROUTES.CUSTOMER_SHOPS)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all text-sm"
          >
            Explore Nearby Shops
          </button>
        </div>
        <Footer />
        <CustomerBottomNav />
      </div>
    );
  }

  const currentImg = media[activeMediaIndex]?.media_url || media[0]?.media_url;
  const discountPct =
    product.sale_price && product.sale_price < product.price
      ? Math.round((1 - product.sale_price / product.price) * 100)
      : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-16">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6 flex-wrap">
          <Link href={ROUTES.CUSTOMER_DASHBOARD} className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href={ROUTES.CUSTOMER_SHOPS} className="hover:text-emerald-600 transition-colors">
            Shops
          </Link>
          {shop && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <Link href={`/shop/${shop.user_id}`} className="hover:text-emerald-600 transition-colors">
                {shop.shop_name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Visual Media Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative bg-white rounded-3xl border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden aspect-square shadow-sm">
              {currentImg ? (
                <Image
                  alt={product.name}
                  src={currentImg}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center rounded-2xl text-slate-400">
                  <Package className="w-20 h-20 mb-2 opacity-50" />
                  <span className="text-xs font-semibold uppercase tracking-wider">No Image Preview</span>
                </div>
              )}

              {discountPct && (
                <div className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md shadow-emerald-600/20 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Save {discountPct}%
                </div>
              )}

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  aria-label="Share product"
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToggleWishlist}
                  aria-label="Wishlist product"
                  className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm flex items-center justify-center transition-all ${
                    isWishlisted ? "text-rose-500 border-rose-200 bg-rose-50/50" : "text-slate-400 hover:text-rose-500"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {media.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {media.map((m, idx) => (
                  <button
                    key={m.id || idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 bg-white p-1 transition-all ${
                      activeMediaIndex === idx
                        ? "border-emerald-600 ring-2 ring-emerald-600/20"
                        : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={m.media_url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 flex flex-col items-center text-center">
                <Clock className="w-5 h-5 text-emerald-600 mb-1.5" />
                <span className="text-[11px] font-bold text-slate-800">10-15 Min Delivery</span>
                <span className="text-[10px] text-slate-400">Direct from store</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 flex flex-col items-center text-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1.5" />
                <span className="text-[11px] font-bold text-slate-800">100% Authentic</span>
                <span className="text-[10px] text-slate-400">Verified seller</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 flex flex-col items-center text-center">
                <Truck className="w-5 h-5 text-emerald-600 mb-1.5" />
                <span className="text-[11px] font-bold text-slate-800">Live Tracking</span>
                <span className="text-[10px] text-slate-400">On every order</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing, Merchant & Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header Block */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {product.category || "General"}
                </span>
                {product.stock_quantity > 0 ? (
                  <span className="bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                  </span>
                ) : (
                  <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Low / Limited Stock
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {product.unit_type && (
                <p className="text-sm font-medium text-slate-500">Unit / Pack: {product.unit_type}</p>
              )}
            </div>

            {/* Price Showcase Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  ₹{product.sale_price ?? product.price}
                </span>
                {product.sale_price && product.sale_price < product.price && (
                  <span className="text-lg text-slate-400 line-through font-bold">
                    ₹{product.price}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-medium ml-auto">Inclusive of all local taxes</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                    isAdded
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-white text-emerald-700 border-2 border-emerald-600 hover:bg-emerald-50 active:scale-[0.98]"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isAdded ? "Added to Cart ✓" : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Buy Now & Deliver
                </button>
              </div>
            </div>

            {/* Verified Merchant Profile Box */}
            {shop && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fulfilled By</span>
                  <Link
                    href={`/shop/${shop.user_id}`}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    Visit Store <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex items-center gap-3.5 pt-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black shrink-0">
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-slate-900 text-base truncate">{shop.shop_name}</h3>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {shop.address ? shop.address.split(" ||| ")[0] : "Local Merchant, Nearby"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Product Description */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">About This Item</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description ||
                  `Fresh and high-quality ${product.name.toLowerCase()} sourced directly from your verified neighborhood seller.`}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CustomerBottomNav />
    </div>
  );
}
