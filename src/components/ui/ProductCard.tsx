"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useUserAuth } from "@/components/providers/UserAuthProvider";
import { cn } from "@/lib/utils";
import LoginPrompt from "./LoginPrompt";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [adding, setAdding]         = useState(false);
  const [showLogin, setShowLogin]   = useState(false);
  const [loginMsg, setLoginMsg]     = useState("");

  const { addToCart, isInCart }         = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user }                        = useUserAuth();
  const router                          = useRouter();

  const inCart     = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setLoginMsg("Sign in to add items to your cart.");
      setShowLogin(true);
      return;
    }
    if (inCart) return;
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setLoginMsg("Sign in to save items to your wishlist.");
      setShowLogin(true);
      return;
    }
    toggleWishlist(product);
  };

  // After login succeeds in the modal, retry the action
  const handleLoginSuccess = () => {
    if (loginMsg.includes("cart")) {
      addToCart(product);
      setAdding(true);
      setTimeout(() => setAdding(false), 1500);
    } else {
      toggleWishlist(product);
    }
  };

  return (
    <>
      {showLogin && (
        <LoginPrompt
          message={loginMsg}
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className={cn("card group relative overflow-hidden", className)}
      >
        <Link href={`/product/${product.slug}`} className="block">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
            {!imageError ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">🫙</div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

            {/* Badges */}
            {product.discount && <span className="badge-discount">-{product.discount}%</span>}
            {product.isNew && <span className="badge-new">New</span>}
            {product.isBestSeller && !product.isNew && (
              <span className="absolute bottom-3 left-3 bg-gold-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">Best Seller</span>
            )}

            {/* Hover actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors",
                  inWishlist ? "bg-maroon-800 text-white" : "bg-white text-gray-600 hover:bg-maroon-50 hover:text-maroon-800"
                )}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.preventDefault(); router.push(`/product/${product.slug}`); }}
                className="w-8 h-8 rounded-full bg-white text-gray-600 hover:bg-gold-50 hover:text-gold-600 flex items-center justify-center shadow-md transition-colors"
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-gold-600 dark:text-gold-400 font-medium mb-1">{product.category}</p>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-maroon-800 dark:group-hover:text-gold-400 transition-colors">
              {product.name}
            </h3>
            {product.nameTamil && (
              <p className="text-xs text-gray-400 font-tamil mb-2">{product.nameTamil}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-3 h-3", i < Math.floor(product.rating) ? "text-gold-500 fill-gold-500" : "text-gray-200 fill-gray-200")} />
                ))}
              </div>
              <span className="text-xs text-gray-500">{product.rating} ({product.reviewCount})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base font-bold text-maroon-800 dark:text-gold-400">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {product.weight && <span className="text-xs text-gray-400 ml-auto">{product.weight}</span>}
            </div>

            {/* Add to cart */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={cn(
                "w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200",
                !product.inStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : inCart || adding
                  ? "bg-leaf-500 text-white"
                  : "bg-maroon-800 text-white hover:bg-maroon-700 active:scale-95"
              )}
            >
              {!product.inStock ? "Out of Stock"
                : inCart || adding ? <><Check className="w-4 h-4" />Added to Cart</>
                : <><ShoppingCart className="w-4 h-4" />Add to Cart</>
              }
            </motion.button>
          </div>
        </Link>
      </motion.div>
    </>
  );
}
