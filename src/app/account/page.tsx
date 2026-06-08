"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Package, Heart, MapPin, CreditCard,
  Bell, RotateCcw, LogOut, ChevronRight, Loader2, Copy, Check,
} from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useUserAuth } from "@/components/providers/UserAuthProvider";
import { getOrdersByUser } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";

const navItems = [
  { id: "profile",       icon: User,       label: "Profile" },
  { id: "orders",        icon: Package,    label: "Order History" },
  { id: "wishlist",      icon: Heart,      label: "Wishlist" },
  { id: "addresses",     icon: MapPin,     label: "Address Book" },
  { id: "payments",      icon: CreditCard, label: "Saved Payments" },
  { id: "notifications", icon: Bell,       label: "Notifications" },
  { id: "returns",       icon: RotateCcw,  label: "Returns & Refunds" },
];

const statusColors: Record<string, string> = {
  Delivered:           "bg-leaf-100 dark:bg-leaf-900/20 text-leaf-700 dark:text-leaf-400",
  "In Transit":        "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
  Processing:          "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
  Dispatched:          "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
  "Out for Delivery":  "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400",
  Cancelled:           "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400",
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [copied, setCopied]       = useState(false);
  const [orders, setOrders]       = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { items: wishlistItems }  = useWishlist();
  const { user, loading, signOut } = useUserAuth();

  // Load orders once user is known (needed for profile count + orders tab)
  useEffect(() => {
    if (user && orders.length === 0 && !ordersLoading) {
      setOrdersLoading(true);
      getOrdersByUser(user.id)
        .then(setOrders)
        .finally(() => setOrdersLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const copyUserId = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-maroon-800 dark:text-gold-400 animate-spin" />
      </div>
    );
  }

  /* ── Not logged in ── */
  if (!user) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-10 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 rounded-full bg-maroon-50 dark:bg-maroon-900/20 flex items-center justify-center mx-auto mb-5">
            <User className="w-10 h-10 text-maroon-800 dark:text-gold-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            My Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            You haven&apos;t signed in yet. Please log in to view your profile, orders, wishlist, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login?redirect=/account" className="btn-primary">
              Sign In
            </Link>
            <Link href="/login?redirect=/account" className="btn-secondary">
              Create Account
            </Link>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400">
              By signing in, you can track orders, save products to wishlist, and get exclusive offers.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Logged in ── */
  const displayName = (user.user_metadata?.full_name as string | undefined)
    ?? user.email?.split("@")[0]
    ?? "User";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const memberSince = new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-maroon-800 dark:text-gold-400 mb-8">
          My Account
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="card p-4 h-fit">
            <div className="flex items-center gap-3 p-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-maroon-800 to-gold-500 text-white flex items-center justify-center text-base font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {displayName}
                </div>
                <div className="text-xs text-gray-400 truncate">{user.email}</div>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === id
                      ? "bg-maroon-800 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile */}
              {activeTab === "profile" && (
                <div className="card p-6">
                  <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-6">
                    Profile Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { label: "Full Name",    value: displayName },
                      { label: "Email",        value: user.email ?? "—" },
                      { label: "Member Since", value: memberSince },
                      { label: "Total Orders", value: ordersLoading ? "…" : String(orders.length) || "0" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-gray-400 mb-1">{label}</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{value}</p>
                      </div>
                    ))}

                    {/* User ID with copy */}
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-400 mb-1">User ID</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 dark:text-gray-100 font-mono text-sm">
                          {user.id}
                        </p>
                        <button
                          onClick={copyUserId}
                          title="Copy User ID"
                          className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${
                            copied
                              ? "bg-leaf-100 dark:bg-leaf-900/20 text-leaf-600"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-maroon-50 dark:hover:bg-gray-600 hover:text-maroon-800 dark:hover:text-gold-400"
                          }`}
                        >
                          {copied
                            ? <Check className="w-3.5 h-3.5" />
                            : <Copy className="w-3.5 h-3.5" />
                          }
                        </button>
                        {copied && (
                          <span className="text-xs text-leaf-600 dark:text-leaf-400 font-medium">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders */}
              {activeTab === "orders" && (
                <div className="card p-6">
                  <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-5">
                    Order History
                  </h2>
                  {ordersLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-6 h-6 text-maroon-800 dark:text-gold-400 animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No orders yet</p>
                      <Link href="/shop" className="btn-primary mt-4 inline-flex">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-maroon-200 dark:hover:border-maroon-800 transition-colors">
                          <div>
                            <p className="font-semibold text-sm text-maroon-800 dark:text-gold-400">{order.orderNumber}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                              {order.status}
                            </span>
                            <span className="font-bold text-gray-800 dark:text-gray-100">{formatPrice(order.total)}</span>
                            <Link href={`/track-order?order=${order.orderNumber}&mobile=${order.customerMobile}`} className="text-xs text-maroon-800 dark:text-gold-400 flex items-center gap-1 hover:underline">
                              Track <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist */}
              {activeTab === "wishlist" && (
                <div className="card p-6">
                  <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-5">
                    My Wishlist ({wishlistItems.length})
                  </h2>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No items saved yet</p>
                      <Link href="/shop" className="btn-primary mt-4 inline-flex">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {wishlistItems.map((p) => (
                        <Link key={p.id} href={`/product/${p.slug}`} className="flex gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-maroon-200 dark:hover:border-maroon-800 transition-colors">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.category}</p>
                            <p className="text-sm font-bold text-maroon-800 dark:text-gold-400 mt-1">{formatPrice(p.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses */}
              {activeTab === "addresses" && (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Address Book</h2>
                    <button className="btn-primary text-sm px-4 py-2">+ Add Address</button>
                  </div>
                  <div className="text-center py-10 text-gray-400">
                    <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No saved addresses yet</p>
                  </div>
                </div>
              )}

              {(activeTab === "payments" || activeTab === "notifications" || activeTab === "returns") && (
                <div className="card p-10 text-center text-gray-400">
                  <div className="text-4xl mb-3">🔧</div>
                  <p className="font-medium capitalize">{activeTab}</p>
                  <p className="text-sm mt-1">Coming soon</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
