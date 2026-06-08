"use client";

import ReactMarkdown from "react-markdown";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart, Heart, Truck, Shield, ChevronRight,
  Plus, Minus, Check, Package, Leaf,
} from "lucide-react";
import { getProductBySlug, getProductsByCategory } from "@/lib/db";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useUserAuth } from "@/components/providers/UserAuthProvider";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import StarRating from "@/components/ui/StarRating";
import LoginPrompt from "@/components/ui/LoginPrompt";
import type { Product } from "@/lib/types";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct]     = useState<Product | null | undefined>(undefined);
  const [related, setRelated]     = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity]   = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded]         = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMsg, setLoginMsg]   = useState("");
  // track which action triggered the login prompt so we can retry after sign-in
  const [pendingAction, setPendingAction] = useState<"cart" | "wishlist" | null>(null);

  const { addToCart, isInCart, getQuantityInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user }                      = useUserAuth();

  useEffect(() => {
    setProduct(undefined);
    setRelated([]);
    setSelectedImage(0);
    getProductBySlug(slug).then((p) => {
      setProduct(p);
      if (p) {
        getProductsByCategory(p.categorySlug).then((all) =>
          setRelated(all.filter((x) => x.id !== p.id).slice(0, 4))
        );
      }
    });
  }, [slug]);

  /* ── loading ── */
  if (product === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-pulse">🍃</div>
          <p>Loading product…</p>
        </div>
      </div>
    );
  }

  /* ── not found ── */
  if (product === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🍃</div>
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Product not found</h1>
        <Link href="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const images     = product.images?.length ? product.images : [product.image];
  const inCart     = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);
  const inCartQty  = getQuantityInCart(product.id);
  const maxQty     = product.stockCount;
  const atLimit    = inCartQty + quantity > maxQty;

  const handleAddToCart = () => {
    if (!user) {
      setLoginMsg("Sign in to add items to your cart.");
      setPendingAction("cart");
      setShowLogin(true);
      return;
    }
    const { capped } = addToCart(product, quantity);
    if (!capped) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWishlist = () => {
    if (!user) {
      setLoginMsg("Sign in to save items to your wishlist.");
      setPendingAction("wishlist");
      setShowLogin(true);
      return;
    }
    toggleWishlist(product);
  };

  const handleLoginSuccess = () => {
    if (pendingAction === "cart") {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else if (pendingAction === "wishlist") {
      toggleWishlist(product);
    }
    setPendingAction(null);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 py-8">
      {showLogin && (
        <LoginPrompt
          message={loginMsg}
          onClose={() => { setShowLogin(false); setPendingAction(null); }}
          onSuccess={handleLoginSuccess}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-maroon-800 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-maroon-800 transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-maroon-800 transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-card">
              <Image src={images[selectedImage]} alt={product.name} fill className="object-cover" priority />
              {product.discount && (
                <span className="absolute top-4 left-4 bg-maroon-800 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${selectedImage === i ? "border-maroon-800" : "border-gray-200 dark:border-gray-700"}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start gap-3 mb-2">
              <Link href={`/shop?category=${product.categorySlug}`} className="text-sm text-gold-600 dark:text-gold-400 hover:underline font-medium">
                {product.category}
              </Link>
              {product.isBestSeller && <span className="bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 text-xs font-semibold px-2 py-0.5 rounded-full">Best Seller</span>}
              {product.isNew && <span className="bg-leaf-100 dark:bg-leaf-900/30 text-leaf-700 dark:text-leaf-400 text-xs font-semibold px-2 py-0.5 rounded-full">New</span>}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{product.name}</h1>
            {product.nameTamil && <p className="text-sm text-gray-400 font-tamil mb-3">{product.nameTamil}</p>}

            <StarRating rating={product.rating} size="md" showValue className="mb-1" />
            <p className="text-sm text-gray-500 mb-4">{product.reviewCount} reviews</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-maroon-800 dark:text-gold-400">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="bg-maroon-100 dark:bg-maroon-900/30 text-maroon-800 dark:text-maroon-300 text-sm font-bold px-2 py-0.5 rounded-full">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {product.weight && <p className="text-sm text-gray-500 mb-2">Weight: <strong>{product.weight}</strong></p>}
            {product.shortDescription && (
              <p className="text-sm text-gold-700 dark:text-gold-400 font-medium mb-4">{product.shortDescription}</p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-semibold min-w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(quantity + 1, Math.max(1, maxQty - inCartQty)))}
                  disabled={quantity >= maxQty - inCartQty}
                  className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-400">{maxQty} in stock</span>
            </div>

            {/* Stock limit message */}
            {inCartQty > 0 && inCartQty >= maxQty && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-5 flex items-center gap-1">
                ⚠ You already have {inCartQty} (in your cart) — that&apos;s the maximum available.
              </p>
            )}
            {inCartQty > 0 && inCartQty < maxQty && (
              <p className="text-xs text-gray-400 mb-5">
                {inCartQty} already in cart · {maxQty - inCartQty} more available
              </p>
            )}
            {inCartQty === 0 && <div className="mb-5" />}

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!product.inStock || inCartQty >= maxQty}
                className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  added || inCart ? "bg-leaf-600 text-white"
                  : !product.inStock || inCartQty >= maxQty ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-maroon-800 hover:bg-maroon-700 text-white"
                }`}
              >
                {!product.inStock ? "Out of Stock"
                  : inCartQty >= maxQty ? "Max Stock Reached"
                  : added || inCart ? <><Check className="w-5 h-5" /> Added to Cart</>
                  : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                }
              </motion.button>
              <button
                onClick={handleWishlist}
                className={`p-4 rounded-xl border-2 transition-all ${inWishlist ? "border-maroon-800 bg-maroon-50 dark:bg-maroon-900/20 text-maroon-800" : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-maroon-800 hover:text-maroon-800"}`}
                aria-label="Toggle wishlist"
              >
                <Heart className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>

            {product.inStock && (
              <Link href="/checkout" className="btn-gold w-full justify-center mb-6 block text-center">Buy Now</Link>
            )}

            {/* Assurances */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck,   text: "Free delivery above ₹999" },
                { icon: Shield,  text: "Secure payment" },
                { icon: Package, text: "Hygienic packaging" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center text-center gap-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <Icon className="w-5 h-5 text-maroon-800 dark:text-gold-400" />
                  <span className="text-xs text-gray-500">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card p-6 mb-12">
          <div className="flex gap-1 mb-6 border-b border-gray-100 dark:border-gray-700">
            {["description", "ingredients", "nutritional", "storage"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-semibold capitalize rounded-t-lg transition-colors -mb-px ${
                  activeTab === tab
                    ? "bg-white dark:bg-gray-800 text-maroon-800 dark:text-gold-400 border border-gray-100 dark:border-gray-700 border-b-white dark:border-b-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "nutritional" ? "Nutritional Info" : tab === "storage" ? "Storage" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="prose prose-gray dark:prose-invert max-w-none
              prose-headings:font-display prose-headings:text-gray-800 dark:prose-headings:text-gray-100
              prose-h2:text-xl prose-h3:text-lg prose-h2:mt-6 prose-h3:mt-4
              prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-li:text-gray-600 dark:prose-li:text-gray-300
              prose-strong:text-gray-800 dark:prose-strong:text-gray-100
              prose-a:text-maroon-800 dark:prose-a:text-gold-400">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          )}

          {activeTab === "ingredients" && product.ingredients && (
            <ul className="flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <li key={ing} className="bg-leaf-50 dark:bg-leaf-900/20 text-leaf-700 dark:text-leaf-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> {ing}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "nutritional" && product.nutritionalInfo && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.nutritionalInfo).map(([key, val]) => (
                    <tr key={key} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <td className="py-2.5 font-medium text-gray-700 dark:text-gray-300 pr-8">{key}</td>
                      <td className="py-2.5 text-gray-500">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "storage" && product.storageInstructions && (
            <div className="prose prose-gray dark:prose-invert max-w-none
              prose-p:text-gray-600 dark:prose-p:text-gray-300
              prose-li:text-gray-600 dark:prose-li:text-gray-300
              prose-strong:text-gray-800 dark:prose-strong:text-gray-100">
              <ReactMarkdown>{product.storageInstructions}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
