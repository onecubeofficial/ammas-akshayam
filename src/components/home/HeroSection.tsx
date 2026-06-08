"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Truck,
  Shield,
  Leaf,
  Award,
  ChevronRight,
  Star,
} from "lucide-react";

const features = [
  { icon: Truck, text: "Free Delivery above ₹999" },
  { icon: Leaf, text: "Fresh Homemade Products" },
  { icon: Shield, text: "Secure Payments" },
  { icon: Award, text: "Tamil Nadu Specialties" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700 dark:from-gray-950 dark:via-maroon-950 dark:to-gray-900" />

      {/* Kolam pattern overlay */}
      <div className="absolute inset-0 kolam-bg opacity-30" />

      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-leaf-500/10 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-gold-400/5 blur-2xl" />

      {/* Decorative banana leaf SVG */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 600 800" className="w-full h-full">
          <path
            d="M600 0 Q400 200 450 400 Q500 600 300 800 L600 800 Z"
            fill="#4E7D3A"
          />
          <path
            d="M600 0 Q500 150 520 350 Q540 550 400 800 L600 800 Z"
            fill="#D4A017"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 text-gold-300 rounded-full px-4 py-2 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="font-tamil mr-1">அம்மாவின் அட்சயம்</span> — Pure Tradition
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-shadow"
            >
              Authentic Tamil Nadu{" "}
              <span className="text-gold-400">Goodness</span>
              <br />
              Delivered to Your{" "}
              <span className="text-leaf-400">Doorstep</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-cream/80 text-lg mt-4 mb-8 leading-relaxed"
            >
              Handcrafted with Love, Inspired by Tradition, Trusted by
              Families. Experience the warmth of Amma&apos;s kitchen in every
              bite.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-4 bg-gold-500 hover:bg-gold-400 text-white font-bold rounded-full text-base transition-all duration-300 shadow-gold hover:shadow-lg hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-7 py-4 border-2 border-white/40 hover:border-white/80 text-white font-bold rounded-full text-base transition-all duration-300 hover:bg-white/10"
              >
                Explore Categories
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6"
            >
              {[
                { value: "10K+", label: "Happy Families" },
                { value: "200+", label: "Products" },
                { value: "32", label: "Districts Served" },
                { value: "100%", label: "Natural" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-display font-bold text-gold-400">
                    {value}
                  </div>
                  <div className="text-xs text-cream/60">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right – Product showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* ── Central logo circle ── */}
            <div className="relative w-80 h-80">
              {/* Outermost slow-spin gradient ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, #D4A01700, #D4A017, #4E7D3A, #D4A01700)",
                  padding: "3px",
                  borderRadius: "9999px",
                }}
              >
                <div className="w-full h-full rounded-full bg-maroon-900" />
              </motion.div>

              {/* Counter-spin dashed ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="absolute inset-3 rounded-full border-2 border-dashed border-gold-400/30"
              />

              {/* Solid inner circle + logo */}
              <div className="absolute inset-6 rounded-full overflow-hidden shadow-2xl border-2 border-gold-500/50 bg-gradient-to-br from-maroon-800 to-maroon-950">
                <Image
                  src="/images/logo_round.png"
                  alt="Amma's Akshayam"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Glow behind circle */}
              <div className="absolute inset-0 rounded-full blur-2xl bg-gold-500/15 -z-10" />
            </div>

            {/* ── Floating card: Mango Pickle ── */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-2 -left-10 bg-white/12 backdrop-blur-lg border border-white/25 rounded-2xl px-4 py-3 text-white shadow-xl w-44"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-2xl leading-none">🫙</span>
                <div>
                  <div className="text-xs font-bold leading-tight">Mango Pickle</div>
                  <div className="text-gold-300 font-extrabold text-sm">₹189</div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-2.5 h-2.5 fill-gold-400 text-gold-400" />
                ))}
                <span className="text-white/50 text-[10px] ml-1">4.9</span>
              </div>
            </motion.div>

            {/* ── Floating card: Best Seller badge ── */}
            <motion.div
              animate={{ y: [-4, 8, -4] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-20 -right-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl px-4 py-3 text-white shadow-gold w-36"
            >
              <div className="text-xl mb-1">✨</div>
              <div className="font-bold text-sm leading-tight">Best Seller</div>
              <div className="text-white/80 text-xs mt-0.5">Murukku</div>
            </motion.div>

            {/* ── Floating card: Kambu Health Mix ── */}
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-6 bg-white/12 backdrop-blur-lg border border-white/25 rounded-2xl px-4 py-3 text-white shadow-xl w-44"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-2xl leading-none">🥣</span>
                <div>
                  <div className="text-xs font-bold leading-tight">Kambu Health Mix</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gold-300 font-extrabold text-sm">₹249</span>
                    <span className="line-through text-white/40 text-xs">₹349</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-leaf-300 font-semibold">🌿 100% Natural</div>
            </motion.div>

            {/* ── Small ping dot ornaments ── */}
            <span className="absolute top-1/2 -left-3 w-3 h-3 rounded-full bg-gold-400/60 animate-ping" />
            <span className="absolute bottom-12 left-8 w-2 h-2 rounded-full bg-leaf-400/60 animate-ping" style={{ animationDelay: "0.8s" }} />
          </motion.div>
        </div>
      </div>

      {/* Features bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-cream/90 text-sm"
              >
                <Icon className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
