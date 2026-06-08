import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/db";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Loading products…
        </div>
      }
    >
      <ShopClient products={products} categories={categories} />
    </Suspense>
  );
}
