/**
 * Database access layer — wraps Supabase calls and maps
 * snake_case DB columns ↔ camelCase TypeScript types.
 */
import { supabase } from "./supabase";
import type { Product, Category, Review, BlogPost, Order, OrderItem } from "./types";

// ─── Row types (what Supabase returns) ──────────────────────
type ProductRow = {
  id: string;
  name: string;
  name_tamil: string | null;
  slug: string;
  category: string;
  category_slug: string;
  price: number;
  original_price: number | null;
  discount: number | null;
  rating: number;
  review_count: number;
  image: string;
  images: string[] | null;
  description: string;
  short_description: string | null;
  ingredients: string[] | null;
  nutritional_info: Record<string, string> | null;
  storage_instructions: string | null;
  weight: string | null;
  is_new: boolean;
  is_best_seller: boolean;
  is_featured: boolean;
  in_stock: boolean;
  stock_count: number;
  is_visible: boolean;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

type CategoryRow = {
  id: string;
  name: string;
  name_tamil: string | null;
  slug: string;
  image: string;
  product_count: number;
  color: string | null;
};

type ReviewRow = {
  id: string;
  product_id: string | null;
  name: string;
  location: string;
  rating: number;
  review: string;
  date: string;
  avatar: string | null;
  verified: boolean;
};

type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  read_time: number;
  tags: string[] | null;
};

// ─── Mappers ────────────────────────────────────────────────
function mapProduct(r: ProductRow): Product {
  return {
    id: r.id,
    name: r.name,
    nameTamil: r.name_tamil ?? undefined,
    slug: r.slug,
    category: r.category,
    categorySlug: r.category_slug,
    price: r.price,
    originalPrice: r.original_price ?? undefined,
    discount: r.discount ?? undefined,
    rating: r.rating,
    reviewCount: r.review_count,
    image: r.image,
    images: r.images ?? [],
    description: r.description,
    shortDescription: r.short_description ?? undefined,
    ingredients: r.ingredients ?? [],
    nutritionalInfo: r.nutritional_info ?? {},
    storageInstructions: r.storage_instructions ?? undefined,
    weight: r.weight ?? undefined,
    isNew: r.is_new,
    isBestSeller: r.is_best_seller,
    isFeatured: r.is_featured,
    inStock: r.in_stock,
    stockCount: r.stock_count,
    isVisible: r.is_visible,
    tags: r.tags ?? [],
  };
}

function mapCategory(r: CategoryRow): Category {
  return {
    id: r.id,
    name: r.name,
    nameTamil: r.name_tamil ?? undefined,
    slug: r.slug,
    image: r.image,
    productCount: r.product_count,
    color: r.color ?? undefined,
  };
}

function mapReview(r: ReviewRow): Review {
  return {
    id: r.id,
    productId: r.product_id ?? undefined,
    name: r.name,
    location: r.location,
    rating: r.rating,
    review: r.review,
    date: r.date,
    avatar: r.avatar ?? undefined,
    verified: r.verified,
  };
}

function mapBlogPost(r: BlogPostRow): BlogPost {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: r.content,
    image: r.image,
    author: r.author,
    date: r.date,
    category: r.category,
    readTime: r.read_time,
    tags: r.tags ?? [],
  };
}

// ─── Product helpers ────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_visible", true)
    .order("created_at", { ascending: false });
  if (error) { console.error("getProducts:", error.message); return []; }
  return (data as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) { console.error("getProductBySlug:", error.message); return null; }
  return mapProduct(data as ProductRow);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });
  if (error) { console.error("getFeaturedProducts:", error.message); return []; }
  return (data as ProductRow[]).map(mapProduct);
}

export async function getBestSellers(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_best_seller", true)
    .eq("is_visible", true)
    .order("review_count", { ascending: false });
  if (error) { console.error("getBestSellers:", error.message); return []; }
  return (data as ProductRow[]).map(mapProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", categorySlug)
    .order("created_at", { ascending: false });
  if (error) { console.error("getProductsByCategory:", error.message); return []; }
  return (data as ProductRow[]).map(mapProduct);
}

// ─── Admin write operations ──────────────────────────────────
function toRow(p: Product) {
  return {
    id: p.id,
    name: p.name,
    name_tamil: p.nameTamil ?? null,
    slug: p.slug,
    category: p.category,
    category_slug: p.categorySlug,
    price: p.price,
    original_price: p.originalPrice ?? null,
    discount: p.discount ?? null,
    rating: p.rating,
    review_count: p.reviewCount,
    image: p.image,
    images: p.images ?? [],
    description: p.description,
    short_description: p.shortDescription ?? null,
    ingredients: p.ingredients ?? [],
    nutritional_info: p.nutritionalInfo ?? {},
    storage_instructions: p.storageInstructions ?? null,
    weight: p.weight ?? null,
    is_new: p.isNew ?? false,
    is_best_seller: p.isBestSeller ?? false,
    is_featured: p.isFeatured ?? false,
    in_stock: p.inStock,
    stock_count: p.stockCount,
    is_visible: p.isVisible,
    tags: p.tags ?? [],
  };
}

export async function createProduct(product: Product): Promise<Product | null> {
  // strip the temp id — let DB generate a uuid
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = toRow(product);
  const { data, error } = await supabase
    .from("products")
    .insert(rest)
    .select()
    .single();
  if (error) { console.error("createProduct:", error.message); return null; }
  return mapProduct(data as ProductRow);
}

export async function updateProduct(product: Product): Promise<Product | null> {
  const { id, ...rest } = toRow(product);
  const { data, error } = await supabase
    .from("products")
    .update(rest)
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error("updateProduct:", error.message); return null; }
  return mapProduct(data as ProductRow);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) { console.error("deleteProduct:", error.message); return false; }
  return true;
}

export async function toggleProductVisibility(id: string, visible: boolean): Promise<boolean> {
  const { error } = await supabase
    .from("products")
    .update({ is_visible: visible })
    .eq("id", id);
  if (error) { console.error("toggleProductVisibility:", error.message); return false; }
  return true;
}

// ─── Storage – image upload ──────────────────────────────────
/**
 * Upload a File to Supabase Storage (product-images bucket).
 *
 * READ  → public (anyone can view product images via URL)
 * WRITE → authenticated only (admin must be signed in)
 *
 * Returns the public URL on success, null on failure.
 * Caller should fall back to URL input if null is returned.
 */
export async function uploadProductImage(file: File): Promise<string | null> {
  // Check if there is an active session (admin must be logged in)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.warn(
      "uploadProductImage: No authenticated session. " +
      "Admin must be signed in to upload images. " +
      "Wire up Supabase Auth for the admin panel."
    );
    return null;
  }

  const ext  = file.name.split(".").pop() ?? "jpg";
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) { console.error("uploadProductImage:", error.message); return null; }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  return data.publicUrl;
}
export async function getCategories(): Promise<Category[]> {
  // Fetch categories and a live per-slug product count in parallel
  const [catResult, prodResult] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase
      .from("products")
      .select("category_slug")
      .eq("is_visible", true),
  ]);

  if (catResult.error) {
    console.error("getCategories:", catResult.error.message);
    return [];
  }

  // Build a count map: { "traditional-snacks": 5, ... }
  const countMap: Record<string, number> = {};
  if (!prodResult.error && prodResult.data) {
    for (const row of prodResult.data as { category_slug: string }[]) {
      countMap[row.category_slug] = (countMap[row.category_slug] ?? 0) + 1;
    }
  }

  return (catResult.data as CategoryRow[]).map((r) => ({
    ...mapCategory(r),
    productCount: countMap[r.slug] ?? 0,
  }));
}

// ─── Category write operations ──────────────────────────────
function toCategoryRow(c: Category) {
  return {
    id:            c.id,
    name:          c.name,
    name_tamil:    c.nameTamil ?? null,
    slug:          c.slug,
    image:         c.image,
    product_count: c.productCount,
    color:         c.color ?? null,
  };
}

export async function createCategory(category: Category): Promise<Category | null> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = toCategoryRow(category);
  const { data, error } = await supabase
    .from("categories")
    .insert(rest)
    .select()
    .single();
  if (error) { console.error("createCategory:", error.message); return null; }
  return mapCategory(data as CategoryRow);
}

export async function updateCategory(category: Category): Promise<Category | null> {
  const { id, ...rest } = toCategoryRow(category);
  const { data, error } = await supabase
    .from("categories")
    .update(rest)
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error("updateCategory:", error.message); return null; }
  return mapCategory(data as CategoryRow);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) { console.error("deleteCategory:", error.message); return false; }
  return true;
}

// ─── Reviews ────────────────────────────────────────────────
export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("date", { ascending: false });
  if (error) { console.error("getReviews:", error.message); return []; }
  return (data as ReviewRow[]).map(mapReview);
}

// ─── Blog posts ──────────────────────────────────────────────
export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });
  if (error) { console.error("getBlogPosts:", error.message); return []; }
  return (data as BlogPostRow[]).map(mapBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) { console.error("getBlogPostBySlug:", error.message); return null; }
  return mapBlogPost(data as BlogPostRow);
}

// ─── Blog write operations ───────────────────────────────────
function toBlogRow(p: BlogPost) {
  return {
    id:        p.id,
    title:     p.title,
    slug:      p.slug,
    excerpt:   p.excerpt,
    content:   p.content,
    image:     p.image,
    author:    p.author,
    date:      p.date,
    category:  p.category,
    read_time: p.readTime,
    tags:      p.tags ?? [],
  };
}

export async function createBlogPost(post: BlogPost): Promise<BlogPost | null> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = toBlogRow(post);
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(rest)
    .select()
    .single();
  if (error) { console.error("createBlogPost:", error.message); return null; }
  return mapBlogPost(data as BlogPostRow);
}

export async function updateBlogPost(post: BlogPost): Promise<BlogPost | null> {
  const { id, ...rest } = toBlogRow(post);
  const { data, error } = await supabase
    .from("blog_posts")
    .update(rest)
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error("updateBlogPost:", error.message); return null; }
  return mapBlogPost(data as BlogPostRow);
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) { console.error("deleteBlogPost:", error.message); return false; }
  return true;
}

// ─── Orders ─────────────────────────────────────────────────
type OrderRow = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_mobile: string;
  customer_email: string;
  address: string;
  state: string;
  district: string;
  pin: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
};

function mapOrder(r: OrderRow): Order {
  return {
    id: r.id,
    orderNumber: r.order_number,
    userId: r.user_id ?? undefined,
    customerName: r.customer_name,
    customerMobile: r.customer_mobile,
    customerEmail: r.customer_email,
    address: r.address,
    state: r.state,
    district: r.district,
    pin: r.pin,
    items: r.items,
    subtotal: r.subtotal,
    shippingFee: r.shipping_fee,
    total: r.total,
    paymentMethod: r.payment_method,
    status: r.status,
    createdAt: r.created_at,
  };
}

/** Generate a readable order number like AMM-2026-AB3F */
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `AMM-${year}-${rand}`;
}

export type CreateOrderPayload = {
  userId?: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  address: string;
  state: string;
  district: string;
  pin: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
};

export async function createOrder(payload: CreateOrderPayload): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_number:    generateOrderNumber(),
      user_id:         payload.userId ?? null,
      customer_name:   payload.customerName,
      customer_mobile: payload.customerMobile,
      customer_email:  payload.customerEmail,
      address:         payload.address,
      state:           payload.state,
      district:        payload.district,
      pin:             payload.pin,
      items:           payload.items,
      subtotal:        payload.subtotal,
      shipping_fee:    payload.shippingFee,
      total:           payload.total,
      payment_method:  payload.paymentMethod,
      status:          "Processing",
    })
    .select()
    .single();
  if (error) { console.error("createOrder:", error.message); return null; }
  return mapOrder(data as OrderRow);
}

/** Fetch all orders for a logged-in user */
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) { console.error("getOrdersByUser:", error.message); return []; }
  return (data as OrderRow[]).map(mapOrder);
}

/** Guest / track-order lookup by order_number + mobile */
export async function getOrderByNumberAndMobile(
  orderNumber: string,
  mobile: string
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .eq("customer_mobile", mobile)
    .single();
  if (error) { console.error("getOrderByNumberAndMobile:", error.message); return null; }
  return mapOrder(data as OrderRow);
}

/** Admin: fetch all orders with pagination */
export async function getAllOrders(limit = 20, offset = 0): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) { console.error("getAllOrders:", error.message); return []; }
  return (data as OrderRow[]).map(mapOrder);
}

/** Admin: aggregate stats — total revenue, order count, unique customers */
export async function getOrderStats(): Promise<{
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
}> {
  const { data, error } = await supabase
    .from("orders")
    .select("total, customer_email");
  if (error) { console.error("getOrderStats:", error.message); return { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, avgOrderValue: 0 }; }
  const rows = data as { total: number; customer_email: string }[];
  const totalRevenue  = rows.reduce((s, r) => s + r.total, 0);
  const totalOrders   = rows.length;
  const totalCustomers = new Set(rows.map((r) => r.customer_email)).size;
  const avgOrderValue  = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  return { totalRevenue, totalOrders, totalCustomers, avgOrderValue };
}

/** Admin: update order status */
export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) { console.error("updateOrderStatus:", error.message); return false; }
  return true;
}

// ─── Subscriptions ──────────────────────────────────────────
export async function checkSubscription(email: string): Promise<boolean> {
  const { data } = await supabase
    .from("subscriptions")
    .select("id, is_active")
    .eq("email", email)
    .eq("is_active", true)
    .single();
  return !!data;
}

export async function subscribeNewsletter(
  userId: string,
  email: string,
  name?: string
): Promise<{ success: boolean; alreadySubscribed: boolean }> {
  // Check if already subscribed
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id, is_active")
    .eq("email", email)
    .single();

  if (existing) {
    // Re-activate if previously unsubscribed
    if (!existing.is_active) {
      await supabase
        .from("subscriptions")
        .update({ is_active: true })
        .eq("id", existing.id);
    }
    return { success: true, alreadySubscribed: true };
  }

  const { error } = await supabase
    .from("subscriptions")
    .insert({ user_id: userId, email, name: name ?? null });

  if (error) { console.error("subscribeNewsletter:", error.message); return { success: false, alreadySubscribed: false }; }
  return { success: true, alreadySubscribed: false };
}
