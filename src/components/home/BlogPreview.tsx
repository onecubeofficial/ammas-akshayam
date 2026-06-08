"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import type { BlogPost } from "@/lib/types";

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const displayPosts = posts.slice(0, 3);
  if (displayPosts.length === 0) return null;

  return (
    <section className="py-16 bg-cream dark:bg-gray-950 kolam-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="From Our Kitchen Blog"
          titleTamil="எங்கள் சமையலறை வலைப்பதிவிலிருந்து"
          subtitle="Recipes, health tips, and stories from Tamil Nadu's food culture"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card group overflow-hidden"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-maroon-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime} min read
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base leading-snug mb-2 group-hover:text-maroon-800 dark:group-hover:text-gold-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  <span className="text-sm font-semibold text-maroon-800 dark:text-gold-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/blog" className="btn-secondary">
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
