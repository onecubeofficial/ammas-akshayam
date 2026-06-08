import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestSellerCarousel from "@/components/home/BestSellerCarousel";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogPreview from "@/components/home/BlogPreview";
import {
  getFeaturedProducts,
  getBestSellers,
  getCategories,
  getReviews,
  getBlogPosts,
} from "@/lib/db";

export const metadata: Metadata = {
  title: "Amma's Akshayam – Authentic Tamil Nadu Food Delivered",
  description:
    "Shop traditional homemade Tamil Nadu foods, organic groceries, pickles, snacks, millet products, and spices. Free delivery above ₹999.",
};

export default async function HomePage() {
  const [featured, bestSellers, cats, reviews, posts] = await Promise.all([
    getFeaturedProducts(),
    getBestSellers(),
    getCategories(),
    getReviews(),
    getBlogPosts(),
  ]);

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={cats} />
      <FeaturedProducts products={featured} />
      <BestSellerCarousel products={bestSellers} />
      <WhyChooseUs />
      <TestimonialsSection reviews={reviews} />
      <BlogPreview posts={posts} />
    </>
  );
}
