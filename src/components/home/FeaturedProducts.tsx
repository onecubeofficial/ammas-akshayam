"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/lib/types";

const tabs = ["All", "Best Sellers", "New Arrivals", "Offers"];

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState("All");

  if (products.length === 0) return null;

  const filtered = products
    .filter((p) => {
      if (activeTab === "Best Sellers") return p.isBestSeller;
      if (activeTab === "New Arrivals") return p.isNew;
      if (activeTab === "Offers") return (p.discount ?? 0) > 15;
      return p.isFeatured;
    })
    .slice(0, 8);

  return (
    <section className="py-16 bg-cream dark:bg-gray-950 kolam-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured Products"
          titleTamil="சிறப்பு பொருட்கள்"
          subtitle="Handpicked authentic products from Amma's kitchen"
        />

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-maroon-800 text-white shadow-premium"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-maroon-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link href="/shop" className="btn-primary">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
