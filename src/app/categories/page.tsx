import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/db";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = { title: "All Categories" };

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="All Categories"
          titleTamil="அனைத்து வகைகளும்"
          subtitle="Explore our complete range of authentic Tamil Nadu food categories"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`}
              className="group card overflow-hidden hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color ?? "from-gray-800 to-gray-600"} opacity-60`} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-maroon-800 dark:group-hover:text-gold-400 transition-colors">{cat.name}</h3>
                {cat.nameTamil && <p className="text-xs text-gray-400 font-tamil">{cat.nameTamil}</p>}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{cat.productCount} products</span>
                  <ArrowRight className="w-4 h-4 text-maroon-800 dark:text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
