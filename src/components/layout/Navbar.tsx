"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  User,
  ChevronDown,
  Package,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useUserAuth } from "@/components/providers/UserAuthProvider";
import { getCategories } from "@/lib/db";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const staticNavLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", children: [] as { label: string; href: string }[] },
  { label: "Categories", href: "/categories", children: [] as { label: string; href: string }[] },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { theme, setTheme } = useTheme();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user } = useUserAuth();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    // Load categories from DB once
    getCategories().then(setCategories);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Build nav links with live category data
  const navLinks = [
    { label: "Home", href: "/", children: undefined },
    {
      label: "Shop",
      href: "/shop",
      children: [
        { label: "All Products",  href: "/shop" },
        { label: "New Arrivals",  href: "/shop?filter=new" },
        { label: "Best Sellers",  href: "/shop?filter=bestseller" },
        { label: "Offers",        href: "/shop?filter=offers" },
      ],
    },
    {
      label: "Categories",
      href: "/categories",
      children: categories.length
        ? categories.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` }))
        : staticNavLinks[2].children, // empty placeholder while loading
    },
    { label: "About Us", href: "/about",  children: undefined },
    { label: "Blog",     href: "/blog",   children: undefined },
    { label: "Contact",  href: "/contact", children: undefined },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-maroon-800 text-cream text-xs py-2 text-center kolam-bg">
        <span className="font-tamil mr-2">அம்மாவின் அட்சயம்</span>
        <span>🚚 Free Delivery above ₹999 | 📞 +91 98765 43210 | 🌿 100% Natural Products</span>
      </div>

      {/* Main navbar */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass shadow-md border-b border-gold-200/30 dark:border-gray-700/30"
            : "bg-cream dark:bg-gray-900"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-gold flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo_round.png" alt="Amma's Akshayam" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-display font-bold text-lg leading-tight text-maroon-800 dark:text-gold-400 group-hover:text-maroon-700 transition-colors">
                  Amma&apos;s Akshayam
                </div>
                <div className="text-xs text-gold-600 dark:text-gold-500 hidden sm:block font-tamil">
                  அம்மாவின் அட்சயம்
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <li
                  key={link.label}
                  className="relative"
                  onMouseEnter={() =>
                    link.children && setActiveDropdown(link.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-maroon-800 dark:hover:text-gold-400 rounded-lg hover:bg-maroon-50 dark:hover:bg-gray-800 transition-all"
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </Link>
                  {link.children && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-maroon-50 dark:hover:bg-gray-700 hover:text-maroon-800 dark:hover:text-gold-400 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                  className="p-2 rounded-full hover:bg-maroon-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-maroon-800 dark:hover:text-gold-400 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Wishlist – only when logged in */}
              {user && (
                <Link
                  href="/wishlist"
                  className="relative p-2 rounded-full hover:bg-maroon-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-maroon-800 dark:hover:text-gold-400 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-maroon-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart – only when logged in */}
              {user && (
                <Link
                  href="/cart"
                  className="relative p-2 rounded-full hover:bg-maroon-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-maroon-800 dark:hover:text-gold-400 transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </Link>
              )}

              {/* Track Order */}
              <Link
                href="/track-order"
                className="hidden sm:flex p-2 rounded-full hover:bg-maroon-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-maroon-800 dark:hover:text-gold-400 transition-colors"
                aria-label="Track Order"
              >
                <Package className="w-5 h-5" />
              </Link>

              {/* Account */}
              <Link
                href={user ? "/account" : "/login"}
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:ring-2 hover:ring-maroon-800 dark:hover:ring-gold-400 transition-all overflow-hidden"
                aria-label="My Account"
              >
                {user ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-maroon-800 to-gold-500 flex items-center justify-center text-white text-xs font-bold">
                    {((user.user_metadata?.full_name as string | undefined) ?? user.email ?? "U")
                      .split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                ) : (
                  <div className="p-2 text-gray-600 dark:text-gray-300 hover:text-maroon-800 dark:hover:text-gold-400">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-maroon-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for murukku, pickles, spices..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-gray-100 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-maroon-50 dark:hover:bg-gray-800 hover:text-maroon-800 dark:hover:text-gold-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 border-l-2 border-gold-200 dark:border-gray-700 pl-3 mt-1 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-maroon-800 dark:hover:text-gold-400 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Link href="/account" className="flex-1 btn-primary text-center text-sm">
                    <User className="w-4 h-4" /> My Account
                  </Link>
                  <Link href="/track-order" className="flex-1 btn-secondary text-center text-sm">
                    <Package className="w-4 h-4" /> Track Order
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
