"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Banknote,
  Building2,
  ChevronRight,
  Check,
  Lock,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useUserAuth } from "@/components/providers/UserAuthProvider";
import { createOrder } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

type PaymentMethod =
  | "upi"
  | "googlePay"
  | "phonePe"
  | "paytm"
  | "card"
  | "netbanking"
  | "cod";

const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useUserAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [ordered, setOrdered] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    name: "", mobile: "", email: "", address: "",
    state: "Tamil Nadu", district: "", pin: "",
  });

  const shippingFee = totalPrice >= 999 ? 0 : 60;
  const finalTotal = totalPrice + shippingFee;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    const order = await createOrder({
      userId: user?.id,
      customerName:   form.name,
      customerMobile: form.mobile,
      customerEmail:  form.email,
      address:        form.address,
      state:          form.state,
      district:       form.district,
      pin:            form.pin,
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        name:      product.name,
        image:     product.image,
        price:     product.price,
        quantity,
      })),
      subtotal:      totalPrice,
      shippingFee,
      total:         finalTotal,
      paymentMethod,
    });
    setPlacing(false);
    if (order) {
      setOrderNumber(order.orderNumber);
      setOrdered(true);
      clearCart();
    }
  };

  if (ordered) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card p-10 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-leaf-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-leaf-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 mb-2">
            Your order has been placed and will be delivered soon.
          </p>
          <p className="text-sm text-gold-600 font-semibold mb-6">
            Order ID: {orderNumber}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/track-order" className="btn-primary">
              Track Order
            </Link>
            <Link href="/shop" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/cart" className="text-gray-400 hover:text-maroon-800">Cart</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-maroon-800 dark:text-gold-400 font-semibold">Checkout</span>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Details */}
              <div className="card p-6">
                <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-5">
                  Delivery Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                      pattern="[6-9][0-9]{9}"
                      placeholder="10-digit mobile number"
                      className="input-field"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                      className="input-field"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="House no, street, area..."
                      className="input-field resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      {indianStates.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      District *
                    </label>
                    <input
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      required
                      placeholder="District"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      PIN Code *
                    </label>
                    <input
                      name="pin"
                      value={form.pin}
                      onChange={handleChange}
                      required
                      pattern="[1-9][0-9]{5}"
                      placeholder="6-digit PIN"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="card p-6">
                <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-leaf-600" /> Payment Method
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { id: "upi", icon: Smartphone, label: "UPI" },
                      { id: "googlePay", icon: Smartphone, label: "Google Pay" },
                      { id: "phonePe", icon: Smartphone, label: "PhonePe" },
                      { id: "paytm", icon: Smartphone, label: "Paytm" },
                      { id: "card", icon: CreditCard, label: "Credit/Debit Card" },
                      { id: "netbanking", icon: Building2, label: "Net Banking" },
                      { id: "cod", icon: Banknote, label: "Cash on Delivery" },
                    ] as { id: PaymentMethod; icon: React.ElementType; label: string }[]
                  ).map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                        paymentMethod === id
                          ? "border-maroon-800 bg-maroon-50 dark:bg-maroon-900/20 text-maroon-800 dark:text-maroon-300"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="card p-5 sticky top-24">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Order Summary ({items.length} items)
                </h3>
                <div className="space-y-3 max-h-52 overflow-y-auto mb-4">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-2 text-sm">
                      <span className="flex-1 text-gray-600 dark:text-gray-400 truncate">
                        {product.name} ×{quantity}
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 flex-shrink-0">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className={shippingFee === 0 ? "text-leaf-600" : ""}>
                      {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-gray-100 dark:border-gray-700 pt-2">
                    <span>Total</span>
                    <span className="text-maroon-800 dark:text-gold-400">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
                <button type="submit" disabled={placing} className="btn-primary w-full justify-center mt-5 text-base">
                  {placing ? "Placing Order…" : <>Place Order <ChevronRight className="w-4 h-4" /></>}
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  🔒 All transactions are encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
