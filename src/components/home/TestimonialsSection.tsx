"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import StarRating from "@/components/ui/StarRating";
import type { Review } from "@/lib/types";

export default function TestimonialsSection({ reviews }: { reviews: Review[] }) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % reviews.length);
  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length);

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 bg-cream dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Our Customers Say"
          titleTamil="வாடிக்கையாளர் கருத்துகள்"
          subtitle="Trusted by thousands of families across Tamil Nadu"
        />

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="card p-8 sm:p-10 text-center"
            >
              <Quote className="w-10 h-10 text-gold-400 mx-auto mb-4 opacity-60" />
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-6 italic">
                &ldquo;{reviews[current].review}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gold-400">
                  {reviews[current].avatar ? (
                    <Image
                      src={reviews[current].avatar!}
                      alt={reviews[current].name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-maroon-100 flex items-center justify-center text-maroon-800 font-bold">
                      {reviews[current].name[0]}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-800 dark:text-gray-100">
                    {reviews[current].name}
                    {reviews[current].verified && (
                      <span className="ml-2 text-xs text-leaf-600 font-normal">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {reviews[current].location}
                  </div>
                  <StarRating
                    rating={reviews[current].rating}
                    size="sm"
                    className="mt-1"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 hover:text-maroon-800 hover:shadow-lg transition-all"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 hover:text-maroon-800 hover:shadow-lg transition-all"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${
                i === current
                  ? "w-6 h-2 bg-maroon-800"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        {/* Grid of mini reviews */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {reviews.slice(0, 3).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  {review.avatar ? (
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-maroon-100 flex items-center justify-center text-maroon-800 text-sm font-bold">
                      {review.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                    {review.name}
                  </div>
                  <div className="text-xs text-gray-500">{review.location}</div>
                </div>
              </div>
              <StarRating rating={review.rating} size="sm" className="mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                {review.review}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
