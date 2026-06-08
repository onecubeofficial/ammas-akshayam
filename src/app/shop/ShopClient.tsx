"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search, SlidersHorizontal, Grid3X3, LayoutList, X, ChevronDown,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import type { Product, Category } from "@/lib/types";

interface Props {
  products: Product[];
  categories: Category[];
}

export default function ShopClient({ products, categories }: Props) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const filterParam  = searchParams.get("filter")   ?? "";

  const [search, setSearch]               = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange]       = useState([0, 1000]);
  const [minRating, setMinRating]         = useState(0);
  const [sortBy, setSortBy]               = useState("featured");
  const [view, setView]                   = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen]     = useState(false);
  const [inStockOnly, setInStockOnly]     = useState(false);

  const filtered = useMemo(() => {
    let r = [...products];
    if (filterParam === "new")        r = r.filter((p) => p.isNew);
    if (filterParam === "bestseller") r = r.filter((p) => p.isBestSeller);
    if (filterParam === "offers")     r = r.filter((p) => (p.discount ?? 0) > 0);
    if (search)          r = r.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory) r = r.filter((p) => p.categorySlug === selectedCategory);
    r = r.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0)  r = r.filter((p) => p.rating >= minRating);
    if (inStockOnly)    r = r.filter((p) => p.inStock);
    if (sortBy === "price-asc")  r.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") r.sort((a, b) => b.price - a.price);
    if (sortBy === "rating")     r.sort((a, b) => b.rating - a.rating);
    if (sortBy === "newest")     r.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return r;
  }, [products, search, selectedCategory, priceRange, minRating, sortBy, inStockOnly, filterParam]);

  const pageTitle =
    filterParam === "new"        ? "New Arrivals"   :
    filterParam === "bestseller" ? "Best Sellers"   :
    filterParam === "offers"     ? "Special Offers" :
    selectedCategory ? categories.find((c) => c.slug === selectedCategory)?.name ?? "Shop"
    : "All Products";

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-maroon-800 dark:text-gold-400 mb-2">
            {pageTitle}
          </h1>
          <p className="text-gray-500">{filtered.length} products found</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field pl-9 text-sm" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
          </div>
          <div className="relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field pr-8 appearance-none text-sm min-w-40 cursor-pointer">
              <option value="featured">Featured</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${filtersOpen ? "bg-maroon-800 text-white border-maroon-800" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"}`}>
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button onClick={() => setView("grid")} className={`p-3 ${view === "grid" ? "bg-maroon-800 text-white" : "text-gray-500"}`} aria-label="Grid"><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-3 ${view === "list" ? "bg-maroon-800 text-white" : "text-gray-500"}`} aria-label="List"><LayoutList className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          {filtersOpen && (
            <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-60 flex-shrink-0 space-y-6">
              <div className="card p-5">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="category" checked={!selectedCategory} onChange={() => setSelectedCategory("")} className="accent-maroon-800" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" checked={selectedCategory === cat.slug} onChange={() => setSelectedCategory(cat.slug)} className="accent-maroon-800" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {[[0,200],[200,400],[400,600],[600,1000]].map(([min,max]) => (
                    <label key={`${min}-${max}`} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="price" checked={priceRange[0]===min && priceRange[1]===max} onChange={() => setPriceRange([min,max])} className="accent-maroon-800" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">₹{min} – ₹{max}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Min Rating</h3>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="rating" checked={minRating===r} onChange={() => setMinRating(r)} className="accent-maroon-800" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{r === 0 ? "All" : `${r}+ ⭐`}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-maroon-800 w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">In Stock Only</span>
                </label>
              </div>

              <button onClick={() => { setSelectedCategory(""); setPriceRange([0,1000]); setMinRating(0); setInStockOnly(false); }} className="w-full btn-secondary text-sm">
                Clear All Filters
              </button>
            </motion.aside>
          )}

          {/* Products grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm mt-1">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <motion.div layout className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "flex flex-col gap-4"}>
                {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
