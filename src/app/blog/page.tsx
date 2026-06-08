import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/db";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Blog – Recipes, Health & Tamil Food Culture",
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  // Build category filter list from actual posts
  const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category).filter(Boolean))).sort()];

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-maroon-900 to-maroon-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 kolam-bg opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <span className="text-gold-400 font-tamil text-lg block mb-2">வலைப்பதிவு</span>
          <h1 className="font-display text-4xl font-bold mb-3">Kitchen Stories & Recipes</h1>
          <p className="text-cream/80 max-w-xl mx-auto">
            Discover traditional Tamil Nadu recipes, health benefits of ancient grains, festival food traditions, and organic living tips.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader title="Latest Articles" titleTamil="சமீபத்திய கட்டுரைகள்" />

        {/* Category filters — derived from real post data */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button key={cat} className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-maroon-800 hover:text-white hover:border-maroon-800 transition-colors">
              {cat}
            </button>
          ))}
        </div>

        {blogPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📝</div>
            <p>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            <div className="mb-12">
              <Link href={`/blog/${blogPosts[0].slug}`} className="group card block overflow-hidden lg:flex gap-0">
                <div className="relative aspect-video lg:aspect-auto lg:w-1/2 overflow-hidden">
                  <Image src={blogPosts[0].image} alt={blogPosts[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 bg-maroon-800 text-white text-sm font-bold px-3 py-1.5 rounded-full">Featured</span>
                </div>
                <div className="p-8 lg:w-1/2 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-gold-600 dark:text-gold-400 bg-gold-50 dark:bg-gold-900/20 px-3 py-1 rounded-full inline-block mb-3">
                    {blogPosts[0].category}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-maroon-800 dark:group-hover:text-gold-400 transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(blogPosts[0].date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{blogPosts[0].readTime} min read</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.slice(1).map((post) => (
                <article key={post.id} className="card group overflow-hidden">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-maroon-800 text-white text-xs font-semibold px-2 py-1 rounded-full">{post.category}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime} min</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-maroon-800 dark:group-hover:text-gold-400 transition-colors">{post.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                      <span className="text-sm font-semibold text-maroon-800 dark:text-gold-400 flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ArrowRight className="w-3.5 h-3.5" /></span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
