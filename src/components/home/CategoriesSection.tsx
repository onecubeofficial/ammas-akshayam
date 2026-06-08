"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Category } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export default function CategoriesSection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Shop by Category"
          titleTamil="வகையின் படி வாங்கவும்"
          subtitle="Explore our wide range of authentic Tamil Nadu food categories"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group block relative rounded-2xl overflow-hidden aspect-square shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70 group-hover:opacity-80 transition-opacity`}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-3 text-white text-center">
                  <h3 className="font-semibold text-xs sm:text-sm leading-tight">
                    {cat.name}
                  </h3>
                  {cat.nameTamil && (
                    <p className="text-[10px] text-white/80 font-tamil mt-0.5 hidden sm:block">
                      {cat.nameTamil}
                    </p>
                  )}
                  <p className="text-[10px] text-white/70 mt-1">
                    {cat.productCount} products
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/categories" className="btn-secondary">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
