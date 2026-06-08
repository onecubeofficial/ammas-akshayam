"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, Users, FileText,
  BarChart2, Settings, Bell, LogOut, TrendingUp, TrendingDown,
  Star, Plus, Edit, Trash2, Eye, EyeOff, ChevronRight, Tag,
  AlertTriangle, X, Calendar, Clock,
} from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct, toggleProductVisibility, getAllOrders, getOrderStats, getCategories, createCategory, updateCategory, deleteCategory, getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/db";
import { signOut } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import type { Product, Order, Category, BlogPost } from "@/lib/types";
import ProductEditDrawer from "@/components/admin/ProductEditDrawer";
import CategoryEditDrawer from "@/components/admin/CategoryEditDrawer";
import BlogEditDrawer from "@/components/admin/BlogEditDrawer";

const navItems = [
  { id: "dashboard",  icon: LayoutDashboard, label: "Dashboard" },
  { id: "products",   icon: Package,         label: "Products" },
  { id: "categories", icon: Tag,             label: "Categories" },
  { id: "blog",       icon: FileText,        label: "Blog Posts" },
  { id: "orders",     icon: ShoppingBag,     label: "Orders" },
  { id: "customers",  icon: Users,           label: "Customers" },
  { id: "analytics",  icon: BarChart2,       label: "Analytics" },
  { id: "settings",   icon: Settings,        label: "Settings" },
];

const statusColors: Record<string, string> = {
  Delivered:          "bg-leaf-100 dark:bg-leaf-900/20 text-leaf-700 dark:text-leaf-400",
  "In Transit":       "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
  Processing:         "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
  "Packed & Dispatched": "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
  "Out for Delivery": "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400",
  Cancelled:          "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
};

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab]         = useState("dashboard");
  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [productList, setProductList]     = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [drawerMode, setDrawerMode]       = useState<"edit" | "add">("edit");
  const [recentOrders, setRecentOrders]   = useState<Order[]>([]);
  const [dashStats, setDashStats]         = useState<{
    totalRevenue: number; totalOrders: number; totalCustomers: number; avgOrderValue: number;
  } | null>(null);
  const [loadingDash, setLoadingDash]     = useState(true);

  // ── Category state ──
  const [categoryList, setCategoryList]         = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [editingCategory, setEditingCategory]   = useState<Category | null>(null);
  const [catDrawerMode, setCatDrawerMode]       = useState<"edit" | "add">("edit");
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // ── Blog state ──
  const [blogList, setBlogList]           = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog]     = useState(true);
  const [editingPost, setEditingPost]     = useState<BlogPost | null>(null);
  const [blogDrawerMode, setBlogDrawerMode] = useState<"edit" | "add">("edit");
  const [deletingPost, setDeletingPost]   = useState<BlogPost | null>(null);

  // ── Load all data on mount ──
  useEffect(() => {
    getProducts()
      .then(setProductList)
      .finally(() => setLoadingProducts(false));
    getCategories()
      .then(setCategoryList)
      .finally(() => setLoadingCategories(false));
    getBlogPosts()
      .then(setBlogList)
      .finally(() => setLoadingBlog(false));
    Promise.all([getOrderStats(), getAllOrders(5)]).then(([stats, orders]) => {
      setDashStats(stats);
      setRecentOrders(orders);
      setLoadingDash(false);
    });
  }, []);

  const openAdd  = () => { setEditingProduct(null); setDrawerMode("add"); };
  const openEdit = (p: Product) => { setEditingProduct(p); setDrawerMode("edit"); };
  const closeDrawer = () => { setEditingProduct(null); setDrawerMode("edit"); };

  const openCatAdd  = () => { setEditingCategory(null); setCatDrawerMode("add"); };
  const openCatEdit = (c: Category) => { setEditingCategory(c); setCatDrawerMode("edit"); };
  const closeCatDrawer = () => { setEditingCategory(null); setCatDrawerMode("edit"); };

  const handleCatSave = async (cat: Category) => {
    if (catDrawerMode === "add") {
      const created = await createCategory(cat);
      if (created) setCategoryList((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      const saved = await updateCategory(cat);
      if (saved) setCategoryList((prev) => prev.map((c) => c.id === saved.id ? saved : c));
    }
  };

  const handleCatDelete = async (id: string) => {
    const ok = await deleteCategory(id);
    if (ok) setCategoryList((prev) => prev.filter((c) => c.id !== id));
    setDeletingCategory(null);
  };

  const openBlogAdd  = () => { setEditingPost(null); setBlogDrawerMode("add"); };
  const openBlogEdit = (p: BlogPost) => { setEditingPost(p); setBlogDrawerMode("edit"); };
  const closeBlogDrawer = () => { setEditingPost(null); setBlogDrawerMode("edit"); };

  const handleBlogSave = async (post: BlogPost) => {
    if (blogDrawerMode === "add") {
      const created = await createBlogPost(post);
      if (created) setBlogList((prev) => [created, ...prev]);
    } else {
      const saved = await updateBlogPost(post);
      if (saved) setBlogList((prev) => prev.map((p) => p.id === saved.id ? saved : p));
    }
  };

  const handleBlogDelete = async (id: string) => {
    const ok = await deleteBlogPost(id);
    if (ok) setBlogList((prev) => prev.filter((p) => p.id !== id));
    setDeletingPost(null);
  };

  const handleSave = async (updated: Product) => {
    if (drawerMode === "add") {
      const created = await createProduct(updated);
      if (created) setProductList((prev) => [created, ...prev]);
    } else {
      const saved = await updateProduct(updated);
      if (saved) setProductList((prev) => prev.map((p) => p.id === saved.id ? saved : p));
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteProduct(id);
    if (ok) setProductList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleVisibility = async (p: Product) => {
    const newVal = !p.isVisible;
    const ok = await toggleProductVisibility(p.id, newVal);
    if (ok) setProductList((prev) =>
      prev.map((x) => x.id === p.id ? { ...x, isVisible: newVal } : x)
    );
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Edit / Add Drawer */}
      <ProductEditDrawer
        product={editingProduct}
        mode={drawerMode}
        categories={categoryList}
        onClose={closeDrawer}
        onSave={handleSave}
      />
      {/* Category Drawer */}
      <CategoryEditDrawer
        category={editingCategory}
        mode={catDrawerMode}
        onClose={closeCatDrawer}
        onSave={handleCatSave}
      />

      {/* Blog Drawer */}
      <BlogEditDrawer
        post={editingPost}
        mode={blogDrawerMode}
        onClose={closeBlogDrawer}
        onSave={handleBlogSave}
      />

      {/* Blog Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeletingPost(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-start justify-between p-5 pb-0">
                  <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <button onClick={() => setDeletingPost(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-5 pt-3 pb-5">
                  <h3 className="font-display font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">Delete Blog Post?</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    You are about to permanently delete{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">&quot;{deletingPost.title}&quot;</span>.
                    This cannot be undone.
                  </p>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    {deletingPost.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={deletingPost.image} alt="" className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{deletingPost.title}</p>
                      <p className="text-xs text-gray-400">{deletingPost.category} · {deletingPost.readTime} min read</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 px-5 pb-5">
                  <button onClick={() => setDeletingPost(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => handleBlogDelete(deletingPost.id)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deletingCategory && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeletingCategory(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between p-5 pb-0">
                  <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <button
                    onClick={() => setDeletingCategory(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-5 pt-3 pb-5">
                  <h3 className="font-display font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">
                    Delete Category?
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    You are about to delete{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      &quot;{deletingCategory.name}&quot;
                    </span>
                    .
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Products in this category will <strong>not</strong> be deleted, but they may appear uncategorised in the shop.
                  </p>

                  {/* Category preview strip */}
                  <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    {deletingCategory.image && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={deletingCategory.image}
                        alt={deletingCategory.name}
                        className="w-12 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {deletingCategory.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{deletingCategory.slug}</p>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full flex-shrink-0">
                      {deletingCategory.productCount} products
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-5 pb-5">
                  <button
                    onClick={() => setDeletingCategory(null)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCatDelete(deletingCategory.id)}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 bg-gray-900 dark:bg-gray-950 border-r border-gray-800 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo_round.png" alt="Amma's Akshayam" className="w-full h-full object-cover" />
            </div>
            {sidebarOpen && (
              <div>
                <div className="text-white font-bold text-sm">Admin</div>
                <div className="text-gray-400 text-xs">Amma&apos;s Akshayam</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-maroon-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ☰
            </button>
            <h1 className="font-semibold text-gray-800 dark:text-gray-100 capitalize">
              {activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-maroon-800 text-white flex items-center justify-center text-sm font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Stats */}
                {loadingDash ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card animate-pulse h-24" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Total Revenue",    value: `₹${(dashStats?.totalRevenue ?? 0).toLocaleString("en-IN")}`, icon: TrendingUp,  positive: true },
                      { label: "Total Orders",     value: String(dashStats?.totalOrders ?? 0),                          icon: ShoppingBag, positive: true },
                      { label: "Total Customers",  value: String(dashStats?.totalCustomers ?? 0),                       icon: Users,       positive: true },
                      { label: "Avg. Order Value", value: `₹${(dashStats?.avgOrderValue ?? 0).toLocaleString("en-IN")}`, icon: TrendingDown, positive: true },
                    ].map(({ label, value, positive, icon: Icon }) => (
                      <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs text-gray-500">{label}</p>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${positive ? "bg-leaf-50 dark:bg-leaf-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                            <Icon className={`w-4 h-4 ${positive ? "text-leaf-600" : "text-red-500"}`} />
                          </div>
                        </div>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">Recent Orders</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-xs text-maroon-800 dark:text-gold-400 flex items-center gap-1">
                      View All <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    {recentOrders.length === 0 ? (
                      <p className="text-center text-sm text-gray-400 py-8">No orders yet</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            {["Order ID", "Customer", "Amount", "Status", "Date"].map((h) => (
                              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                              <td className="px-5 py-3 font-medium text-maroon-800 dark:text-gold-400">{order.orderNumber}</td>
                              <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{order.customerName}</td>
                              <td className="px-5 py-3 font-semibold">{formatPrice(order.total)}</td>
                              <td className="px-5 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {activeTab === "products" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                    All Products ({productList.length})
                  </h2>
                  <button onClick={openAdd} className="btn-primary text-sm px-4 py-2">
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden">
                  {loadingProducts ? (
                    <div className="flex items-center justify-center py-16 text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-3 animate-pulse">🍃</div>
                        <p className="text-sm">Loading products…</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            {["Product", "Category", "Price", "Stock", "Rating", "Actions"].map((h) => (
                              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {productList.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                  <div>
                                    <span className="font-medium text-gray-800 dark:text-gray-100 max-w-36 truncate block">{p.name}</span>
                                    {!p.isVisible && (
                                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                                        Hidden
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-gray-500">{p.category}</td>
                              <td className="px-5 py-3 font-semibold text-maroon-800 dark:text-gold-400">{formatPrice(p.price)}</td>
                              <td className="px-5 py-3">
                                {p.stockCount === 0 ? (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">Out of Stock</span>
                                ) : (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stockCount <= 20 ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400" : "bg-leaf-100 dark:bg-leaf-900/20 text-leaf-700 dark:text-leaf-400"}`}>
                                    {p.stockCount} in stock
                                  </span>
                                )}
                              </td>
                              <td className="px-5 py-3">
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />{p.rating}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleToggleVisibility(p)}
                                    title={p.isVisible ? "Hide from shop" : "Show in shop"}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      p.isVisible
                                        ? "text-leaf-600 hover:bg-leaf-50 dark:hover:bg-leaf-900/20"
                                        : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                  >
                                    {p.isVisible
                                      ? <Eye className="w-3.5 h-3.5" />
                                      : <EyeOff className="w-3.5 h-3.5" />
                                    }
                                  </button>
                                  <button onClick={() => openEdit(p)} className="p-1.5 text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-lg" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ANALYTICS */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "This Month Revenue", value: "₹1,24,500", color: "bg-maroon-800" },
                    { label: "New Orders", value: "342", color: "bg-gold-500" },
                    { label: "New Customers", value: "89", color: "bg-leaf-600" },
                    { label: "Return Rate", value: "2.4%", color: "bg-blue-500" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`${color} text-white rounded-2xl p-5`}>
                      <p className="text-white/80 text-xs mb-1">{label}</p>
                      <p className="text-2xl font-bold">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Revenue chart placeholder */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-5">Revenue Overview</h3>
                  <div className="flex items-end gap-2 h-32">
                    {[60, 80, 45, 95, 75, 100, 85, 90, 70, 88, 92, 78].map((h, i) => (
                      <div key={i} className="flex-1 flex items-end">
                        <div
                          className="w-full rounded-t-lg bg-maroon-800 dark:bg-gold-500 opacity-80 hover:opacity-100 transition-opacity"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => <span key={m}>{m}</span>)}
                  </div>
                </div>

                {/* Top products */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Top Products</h3>
                  <div className="space-y-3">
                    {productList.slice(0, 5).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <span className="w-6 text-xs font-bold text-gray-400">#{i+1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-48">{p.name}</span>
                            <span className="text-gray-500">{p.reviewCount} sold</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-maroon-800 to-gold-500 rounded-full"
                              style={{ width: `${(p.reviewCount / 700) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORIES */}
            {activeTab === "categories" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                    All Categories ({categoryList.length})
                  </h2>
                  <button onClick={openCatAdd} className="btn-primary text-sm px-4 py-2">
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>

                {loadingCategories ? (
                  <div className="flex items-center justify-center py-16 text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-3 animate-pulse">🏷️</div>
                      <p className="text-sm">Loading categories…</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {categoryList.map((cat) => (
                      <div
                        key={cat.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden group"
                      >
                        {/* Image banner */}
                        <div className={`relative h-28 bg-gradient-to-br ${cat.color ?? "from-maroon-800 to-gold-500"} overflow-hidden`}>
                          {cat.image && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                            />
                          )}
                          {/* Product count badge */}
                          <span className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {cat.productCount} products
                          </span>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <div className="mb-0.5">
                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{cat.name}</p>
                            {cat.nameTamil && (
                              <p className="text-xs text-gray-400 font-tamil">{cat.nameTamil}</p>
                            )}
                            <p className="text-xs text-gray-400 font-mono mt-1">{cat.slug}</p>
                          </div>

                          {/* Color swatch */}
                          <div className="flex items-center gap-2 mt-2 mb-3">
                            <span className={`w-4 h-4 rounded bg-gradient-to-br flex-shrink-0 ${cat.color ?? "from-maroon-800 to-gold-500"}`} />
                            <span className="text-[11px] text-gray-400 truncate">{cat.color}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => openCatEdit(cat)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gold-700 dark:text-gold-400 bg-gold-50 dark:bg-gold-900/20 hover:bg-gold-100 dark:hover:bg-gold-900/30 rounded-xl transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => setDeletingCategory(cat)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BLOG POSTS */}
            {activeTab === "blog" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                    Blog Posts ({blogList.length})
                  </h2>
                  <button onClick={openBlogAdd} className="btn-primary text-sm px-4 py-2">
                    <Plus className="w-4 h-4" /> New Post
                  </button>
                </div>

                {loadingBlog ? (
                  <div className="flex items-center justify-center py-16 text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-3 animate-pulse">📝</div>
                      <p className="text-sm">Loading posts…</p>
                    </div>
                  </div>
                ) : blogList.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-card text-gray-400">
                    <div className="text-5xl mb-3">📝</div>
                    <p className="font-medium">No blog posts yet</p>
                    <button onClick={openBlogAdd} className="btn-primary mt-4">Write First Post</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blogList.map((post) => (
                      <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden flex gap-0 group">
                        {/* Cover thumbnail */}
                        <div className="relative w-32 sm:w-44 flex-shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.image || "https://placehold.co/180x120?text=No+Image"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-semibold text-gold-700 dark:text-gold-400 bg-gold-50 dark:bg-gold-900/20 px-2 py-0.5 rounded-full">
                                {post.category}
                              </span>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />{post.readTime} min read
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm line-clamp-1 mb-1">{post.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs text-gray-400">By {post.author}</span>
                            {post.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {post.tags.slice(0, 3).map((t) => (
                                  <span key={t} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 px-1.5 py-0.5 rounded-full">#{t}</span>
                                ))}
                              </div>
                            )}
                            <div className="ml-auto flex gap-2">
                              <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="View post"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </a>
                              <button onClick={() => openBlogEdit(post)} className="p-1.5 text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-lg transition-colors" title="Edit">
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setDeletingPost(post)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(activeTab === "orders" || activeTab === "customers" || activeTab === "settings") && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-card">
                <div className="text-5xl mb-4">🔧</div>
                <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-100 mb-2 capitalize">
                  {activeTab} Management
                </h3>
                <p className="text-gray-500">This section is under active development</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
