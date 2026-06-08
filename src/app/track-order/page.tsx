"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Search, CheckCircle, Truck, MapPin, Clock, Loader2, AlertCircle } from "lucide-react";
import { getOrderByNumberAndMobile } from "@/lib/db";
import type { Order } from "@/lib/types";

const STEPS = [
  "Processing",
  "Packed & Dispatched",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

function stepIndex(status: string) {
  const i = STEPS.indexOf(status);
  return i === -1 ? 0 : i;
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("order") ?? "");
  const [mobile,  setMobile]  = useState(searchParams.get("mobile") ?? "");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  // Auto-track if query params provided (coming from account page)
  useEffect(() => {
    const o = searchParams.get("order");
    const m = searchParams.get("mobile");
    if (o && m) {
      setOrderId(o);
      setMobile(m);
      track(o, m);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const track = async (oid = orderId, mob = mobile) => {
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    const result = await getOrderByNumberAndMobile(oid.trim(), mob.trim());
    setLoading(false);
    if (!result) { setNotFound(true); return; }
    setOrder(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track();
  };

  const current = order ? stepIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <Package className="w-12 h-12 text-maroon-800 dark:text-gold-400 mx-auto mb-3" />
          <h1 className="font-display text-3xl font-bold text-maroon-800 dark:text-gold-400 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-500">Enter your order ID and registered mobile number</p>
        </div>

        {/* Search form */}
        <div className="card p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order ID *
              </label>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. AMM-2026-ABC123"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mobile Number *
              </label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number used at checkout"
                className="input-field"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Tracking…</>
                : <><Search className="w-4 h-4" /> Track Order</>
              }
            </button>
          </form>
        </div>

        {/* Not found */}
        {notFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 flex items-center gap-4 text-red-600 dark:text-red-400"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Order not found</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Please check your Order ID and mobile number and try again.
              </p>
            </div>
          </motion.div>
        )}

        {/* Tracking result */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            {/* Order info */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-400 mb-1">Order ID</p>
                <p className="font-bold text-maroon-800 dark:text-gold-400">{order.orderNumber}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {order.items.map((i) => i.name).join(", ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Order Date</p>
                <p className="font-bold text-gray-700 dark:text-gray-300">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className="text-sm font-bold text-maroon-800 dark:text-gold-400 mt-1">
                  Total: ₹{order.total}
                </p>
              </div>
            </div>

            {/* Status banner */}
            <div className={`border rounded-xl p-4 flex items-center gap-3 mb-8 ${
              order.status === "Delivered"
                ? "bg-leaf-50 dark:bg-leaf-900/20 border-leaf-200 dark:border-leaf-800"
                : order.status === "Cancelled"
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            }`}>
              <Truck className={`w-6 h-6 flex-shrink-0 ${
                order.status === "Delivered" ? "text-leaf-600"
                : order.status === "Cancelled" ? "text-red-600"
                : "text-blue-600"
              }`} />
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{order.status}</p>
                {order.status === "Delivered" && (
                  <p className="text-sm text-leaf-600 dark:text-leaf-400">Your order has been delivered!</p>
                )}
                {order.status === "Out for Delivery" && (
                  <p className="text-sm text-blue-600 dark:text-blue-400">Your order will be delivered today!</p>
                )}
                {order.status === "In Transit" && (
                  <p className="text-sm text-blue-600 dark:text-blue-400">Your order is on its way.</p>
                )}
              </div>
            </div>

            {/* Timeline */}
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-5">Tracking Timeline</h3>
            <div className="space-y-1">
              {STEPS.map((step, i) => {
                const done = i <= current;
                return (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        done ? "bg-leaf-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                      }`}>
                        {done ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`w-0.5 h-10 mt-1 ${done ? "bg-leaf-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className={`font-medium ${done ? "text-gray-800 dark:text-gray-100" : "text-gray-400"}`}>
                        {step}
                      </p>
                      {i === 0 && done && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery address */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-start gap-3">
              <MapPin className="w-5 h-5 text-maroon-800 dark:text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Address</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {order.address}, {order.district}, {order.state} – {order.pin}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
