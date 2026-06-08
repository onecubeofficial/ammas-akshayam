"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  Truck,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/utils";

const COUPONS: Record<string, number> = {
  AMMA10: 10,
  WELCOME20: 20,
  TAMILFOOD: 15,
};

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  const discount = appliedCoupon ? COUPONS[appliedCoupon] : 0;
  const discountAmount = (totalPrice * discount) / 100;
  const shippingFee = totalPrice >= 999 ? 0 : 60;
  const finalTotal = totalPrice - discountAmount + shippingFee;

  const applyCoupon = () => {
    if (COUPONS[coupon.toUpperCase()]) {
      setAppliedCoupon(coupon.toUpperCase());
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-950 flex flex-col items-center justify-center gap-4 py-20">
        <ShoppingCart className="w-20 h-20 text-gray-200" />
        <h1 className="text-2xl font-display font-bold text-gray-700 dark:text-gray-300">
          Your cart is empty
        </h1>
        <p className="text-gray-500">
          Add some delicious Tamil Nadu goodies!
        </p>
        <Link href="/shop" className="btn-primary">
          <ShoppingBag className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-maroon-800 dark:text-gold-400 mb-8">
          Shopping Cart ({totalItems} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(({ product, quantity }) => (
                <motion.div
                  key={product.id}
                  layout
                  exit={{ opacity: 0, height: 0 }}
                  className="card p-4 flex gap-4"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-semibold text-gray-800 dark:text-gray-100 text-sm hover:text-maroon-800 dark:hover:text-gold-400 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-gray-500">{product.category}</p>
                        {product.weight && (
                          <p className="text-xs text-gray-400">{product.weight}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold min-w-8 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stockCount}
                          title={quantity >= product.stockCount ? `Max ${product.stockCount} available` : undefined}
                          className="px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-maroon-800 dark:text-gold-400">
                          {formatPrice(product.price * quantity)}
                        </div>
                        {quantity > 1 && (
                          <div className="text-xs text-gray-400">
                            {formatPrice(product.price)} each
                          </div>
                        )}
                        {quantity >= product.stockCount && (
                          <div className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                            Max stock reached
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              href="/shop"
              className="flex items-center gap-2 text-sm text-maroon-800 dark:text-gold-400 font-medium hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gold-500" /> Apply Coupon
              </h3>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  placeholder="Enter code"
                  className="input-field flex-1 text-sm"
                />
                <button onClick={applyCoupon} className="btn-primary px-4 text-sm">
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-xs mt-1">{couponError}</p>
              )}
              {appliedCoupon && (
                <p className="text-leaf-600 text-xs mt-1">
                  ✅ {appliedCoupon} applied — {discount}% off!
                </p>
              )}
              <div className="mt-3 text-xs text-gray-400">
                Try: AMMA10, WELCOME20, TAMILFOOD
              </div>
            </div>

            {/* Summary */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-leaf-600 dark:text-leaf-400">
                    <span>Discount ({discount}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Shipping
                  </span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-leaf-600">Free</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                {totalPrice < 999 && (
                  <p className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                    Add {formatPrice(999 - totalPrice)} more for free delivery!
                  </p>
                )}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-maroon-800 dark:text-gold-400">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full justify-center mt-5 block text-center">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                <span>🔒 Secure Checkout</span>
                <span>•</span>
                <span>UPI | Cards | COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
