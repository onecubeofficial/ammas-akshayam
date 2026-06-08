"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-950 flex flex-col items-center justify-center gap-4 py-20">
        <Heart className="w-20 h-20 text-gray-200" />
        <h1 className="text-2xl font-display font-bold text-gray-700 dark:text-gray-300">
          Your wishlist is empty
        </h1>
        <p className="text-gray-500">Save products you love to your wishlist</p>
        <Link href="/shop" className="btn-primary">
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-maroon-800 dark:text-gold-400">
            My Wishlist ({items.length})
          </h1>
          <Link href="/shop" className="text-sm text-gray-500 hover:text-maroon-800 dark:hover:text-gold-400 transition-colors">
            Continue Shopping
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
                className="card p-4 group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 shadow opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gold-600 dark:text-gold-400">{product.category}</p>
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 hover:text-maroon-800 dark:hover:text-gold-400 transition-colors mt-0.5 mb-1">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-maroon-800 dark:text-gold-400">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    isInCart(product.id)
                      ? "bg-leaf-500 text-white"
                      : "bg-maroon-800 hover:bg-maroon-700 text-white"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isInCart(product.id) ? "In Cart" : "Add to Cart"}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
