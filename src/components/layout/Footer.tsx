"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  LogIn,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserAuth } from "@/components/providers/UserAuthProvider";
import { subscribeNewsletter, checkSubscription } from "@/lib/db";
import LoginPrompt from "@/components/ui/LoginPrompt";

const footerLinks = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "Best Sellers", href: "/shop?filter=bestseller" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
  customerSupport: [
    { label: "Contact Us", href: "/contact" },
    { label: "Track Order", href: "/track-order" },
    { label: "My Account", href: "/account" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "FAQ", href: "/faq" },
  ],
  categories: [
    { label: "Traditional Snacks", href: "/shop?category=traditional-snacks" },
    { label: "Pickles", href: "/shop?category=pickles" },
    { label: "Millet Products", href: "/shop?category=millet-products" },
    { label: "Spices & Masalas", href: "/shop?category=spices-masalas" },
    { label: "Organic Groceries", href: "/shop?category=organic-groceries" },
    { label: "Sweets", href: "/shop?category=sweets" },
    { label: "Festival Specials", href: "/shop?category=festival-specials" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
};

export default function Footer() {
  const { user } = useUserAuth();
  const [subscribed, setSubscribed]   = useState(false);
  const [alreadySub, setAlreadySub]   = useState(false);
  const [loading, setLoading]         = useState(false);
  const [showLogin, setShowLogin]     = useState(false);
  const [checkDone, setCheckDone]     = useState(false);

  // When a logged-in user loads the footer, check if they're already subscribed
  useEffect(() => {
    if (user?.email) {
      checkSubscription(user.email).then((isSubscribed) => {
        if (isSubscribed) setAlreadySub(true);
        setCheckDone(true);
      });
    } else {
      setCheckDone(true);
    }
  }, [user]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setShowLogin(true); return; }
    setLoading(true);
    const name = (user.user_metadata?.full_name as string | undefined) ?? undefined;
    const { success, alreadySubscribed } = await subscribeNewsletter(user.id, user.email!, name);
    setLoading(false);
    if (success) {
      setSubscribed(true);
      setAlreadySub(true); // triggers banner hide after the thank-you flash
    }
  };

  const handleLoginSuccess = async () => {
    // user state updates via auth provider; trigger subscribe after a tick
    setTimeout(() => {
      const form = document.getElementById("newsletter-form") as HTMLFormElement | null;
      form?.requestSubmit();
    }, 300);
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-16">
      {showLogin && (
        <LoginPrompt
          message="Sign in to subscribe to our newsletter."
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* Newsletter Banner — hidden if already subscribed */}
      {checkDone && !alreadySub && (
      <div className="bg-gradient-to-r from-maroon-800 via-maroon-700 to-gold-600 py-12 kolam-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-display font-bold text-white">
                Subscribe to Amma&apos;s Kitchen Newsletter
              </h3>
              <p className="text-cream/80 mt-1">
                Get recipes, health tips, and exclusive offers delivered to your inbox
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-6 py-3 text-white font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                Thank you for subscribing!
              </div>
            ) : !user ? (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-maroon-800 font-semibold rounded-full hover:bg-cream transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign in to Subscribe
              </button>
            ) : (
              <form id="newsletter-form" onSubmit={handleSubscribe} className="flex items-center gap-3">
                <div className="bg-white/20 border border-white/30 rounded-full px-5 py-3 text-white text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 opacity-70" />
                  <span className="opacity-90">{user.email}</span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 bg-white text-maroon-800 font-semibold rounded-full hover:bg-cream transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Subscribing…</>
                    : <><Send className="w-4 h-4" /> Subscribe</>
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Separator */}
      <div className="border-t border-gray-700" />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo_round.png" alt="Amma's Akshayam" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-display font-bold text-lg text-white">
                  Amma&apos;s Akshayam
                </div>
                <div className="text-xs text-gold-400 font-tamil">
                  அம்மாவின் அட்சயம்
                </div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              From Amma&apos;s Kitchen to Your Home – Pure Tradition, Endless
              Goodness. We bring authentic Tamil Nadu flavors, crafted with
              love and time-honoured recipes.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>hello@ammasakshayam.com</span>
              </div>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>123 Anna Nagar, Chennai – 600040, Tamil Nadu</span>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Youtube, href: "#", label: "YouTube" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-maroon-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support + Policies (Categories removed) */}
          <div>
            <h4 className="font-semibold text-white mb-4">Customer Support</h4>
            <ul className="space-y-2">
              {footerLinks.customerSupport.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold text-white mt-6 mb-4">Policies</h4>
            <ul className="space-y-2">
              {footerLinks.policies.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © 2026 Amma&apos;s Akshayam. Preserving Tamil Tradition, One
            Product at a Time.
          </p>
          <div className="flex items-center gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/120px-Paytm_Logo_%28standalone%29.svg.png"
              alt="Paytm"
              className="h-5 opacity-60 hover:opacity-100 transition-opacity"
            />
            <span className="text-xs text-gray-600">UPI | Cards | COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
