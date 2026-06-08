"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Save, Plus, Trash2, ChevronDown, ChevronUp,
  PackagePlus, Pencil, Upload, Link2, Loader2, CheckCircle2,
} from "lucide-react";
import type { Product } from "@/lib/types";
import type { Category } from "@/lib/types";
import { uploadProductImage } from "@/lib/db";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────
   Props
───────────────────────────────────────── */
interface ProductEditDrawerProps {
  /** Pass an existing product to edit, or null to add a new one. */
  product: Product | null;
  mode: "edit" | "add";
  categories: Category[];
  onClose: () => void;
  onSave: (product: Product) => void;
}

/* ─────────────────────────────────────────
   Blank template for "Add" mode
───────────────────────────────────────── */
const BLANK: Product = {
  id: "",
  name: "",
  nameTamil: "",
  slug: "",
  category: "",
  categorySlug: "",
  price: 0,
  originalPrice: undefined,
  discount: undefined,
  rating: 0,
  reviewCount: 0,
  image: "",
  images: [],
  description: "",
  shortDescription: "",
  ingredients: [],
  nutritionalInfo: {},
  storageInstructions: "",
  weight: "",
  isNew: false,
  isBestSeller: false,
  isFeatured: false,
  inStock: true,
  stockCount: 0,
  isVisible: true,
  tags: [],
};

/* ─────────────────────────────────────────
   Tiny shared UI helpers
───────────────────────────────────────── */
function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-maroon-800 dark:focus:ring-gold-500 transition-all",
        className
      )}
    />
  );
}

function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-maroon-800 dark:focus:ring-gold-500 transition-all resize-none",
        className
      )}
    />
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
  required,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  required?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="flex items-center gap-2">
          {title}
          {required && (
            <span className="text-[10px] font-medium text-maroon-600 bg-maroon-50 dark:bg-maroon-900/30 px-1.5 py-0.5 rounded-full">
              Required
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main drawer component
───────────────────────────────────────── */
export default function ProductEditDrawer({
  product,
  mode,
  categories,
  onClose,
  onSave,
}: ProductEditDrawerProps) {
  const isAdd = mode === "add";

  const [form, setForm] = useState<Product>(BLANK);
  const [newIngredient, setNewIngredient] = useState("");
  const [newNutriKey, setNewNutriKey] = useState("");
  const [newNutriVal, setNewNutriVal] = useState("");
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({});

  // image tab: "url" | "upload"
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const [uploadDragging, setUploadDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    setUploadSuccess(false);
    const url = await uploadProductImage(file);
    setUploading(false);
    if (url) {
      // Supabase Storage upload succeeded — store the public URL
      set("image", url);
      setErrors((prev) => ({ ...prev, image: undefined }));
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } else {
      // Storage upload failed (likely no auth session yet).
      // Warn and do NOT store base64 — it bloats the DB.
      setErrors((prev) => ({
        ...prev,
        image: "Upload failed: admin must be signed in to upload files. Use the URL tab instead, or configure Supabase Auth.",
      }));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  /* ── seed form ── */
  useEffect(() => {
    if (isAdd) {
      const firstCat = categories[0];
      setForm({
        ...BLANK,
        id: `prod-${Date.now()}`,
        category: firstCat?.name ?? "",
        categorySlug: firstCat?.slug ?? "",
      });
    } else if (product) {
      setForm(JSON.parse(JSON.stringify(product)));
    }
    setSaved(false);
    setErrors({});
    setNewIngredient("");
    setNewNutriKey("");
    setNewNutriVal("");
    setImageTab("url");
    setUploadSuccess(false);
  }, [product, mode, isAdd, categories]);

  /* ── open check ── */
  const isOpen = isAdd || product !== null;

  /* ── generic setter ── */
  const set = (key: keyof Product, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* ── auto-slug from name (add mode only) ── */
  const handleNameChange = (val: string) => {
    set("name", val);
    if (isAdd) {
      set(
        "slug",
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  /* ── validation ── */
  const validate = () => {
    const e: Partial<Record<keyof Product, string>> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.image.trim()) e.image = "Image URL is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.price <= 0) e.price = "Price must be greater than 0";
    return e;
  };

  /* ── save ── */
  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    // sync inStock with stockCount
    const final = { ...form, inStock: form.stockCount > 0 };
    onSave(final);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  };

  /* ── ingredients ── */
  const addIngredient = () => {
    const v = newIngredient.trim();
    if (!v) return;
    set("ingredients", [...(form.ingredients ?? []), v]);
    setNewIngredient("");
  };
  const removeIngredient = (i: number) =>
    set("ingredients", (form.ingredients ?? []).filter((_, idx) => idx !== i));

  /* ── nutritional info ── */
  const addNutri = () => {
    const k = newNutriKey.trim();
    const v = newNutriVal.trim();
    if (!k || !v) return;
    set("nutritionalInfo", { ...(form.nutritionalInfo ?? {}), [k]: v });
    setNewNutriKey("");
    setNewNutriVal("");
  };
  const removeNutri = (key: string) => {
    const copy = { ...(form.nutritionalInfo ?? {}) };
    delete copy[key];
    set("nutritionalInfo", copy);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center",
                    isAdd
                      ? "bg-leaf-100 dark:bg-leaf-900/30"
                      : "bg-gold-100 dark:bg-gold-900/30"
                  )}
                >
                  {isAdd ? (
                    <PackagePlus
                      className="w-5 h-5 text-leaf-600 dark:text-leaf-400"
                    />
                  ) : (
                    <Pencil className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                  )}
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-gray-800 dark:text-gray-100">
                    {isAdd ? "Add New Product" : "Edit Product"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                    {isAdd
                      ? "Fill in the details below to create a new product"
                      : form.name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

              {/* Progress hint for add mode */}
              {isAdd && (
                <div className="bg-leaf-50 dark:bg-leaf-900/20 border border-leaf-200 dark:border-leaf-800 rounded-xl px-4 py-3 text-sm text-leaf-700 dark:text-leaf-300 flex items-start gap-2">
                  <span className="text-base">💡</span>
                  <span>
                    Fill in <strong>Basic Info</strong>, <strong>Price & Stock</strong>,
                    and <strong>Image</strong> at minimum. Other sections are optional.
                  </span>
                </div>
              )}

              {/* ── Basic Info ── */}
              <Section title="Basic Information" required>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Product Name *" className="col-span-2">
                    <Input
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Organic Turmeric Powder"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </Field>

                  {isAdd && (
                    <Field label="URL Slug" className="col-span-2" hint="Auto-generated from name. Edit if needed.">
                      <Input
                        value={form.slug}
                        onChange={(e) => set("slug", e.target.value)}
                        placeholder="organic-turmeric-powder"
                      />
                    </Field>
                  )}

                  <Field label="Tamil Name">
                    <Input
                      value={form.nameTamil ?? ""}
                      onChange={(e) => set("nameTamil", e.target.value)}
                      placeholder="தமிழ் பெயர்"
                    />
                  </Field>

                  <Field label="Category *">
                    <select
                      value={form.categorySlug}
                      onChange={(e) => {
                        const cat = categories.find((c) => c.slug === e.target.value);
                        if (cat) {
                          set("categorySlug", cat.slug);
                          set("category", cat.name);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Weight / Size">
                    <Input
                      value={form.weight ?? ""}
                      onChange={(e) => set("weight", e.target.value)}
                      placeholder="e.g. 500g, 1L, 250ml"
                    />
                  </Field>

                  <Field label="Tags" hint="Comma-separated">
                    <Input
                      value={(form.tags ?? []).join(", ")}
                      onChange={(e) =>
                        set(
                          "tags",
                          e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder="organic, spicy, traditional"
                    />
                  </Field>
                </div>

                <Field label="Short Description" hint="One-liner shown on product cards">
                  <Input
                    value={form.shortDescription ?? ""}
                    onChange={(e) => set("shortDescription", e.target.value)}
                    placeholder="e.g. Pure Erode turmeric, high curcumin"
                  />
                </Field>

                <Field label="Full Description *">
                  <Textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Detailed product description shown on the product page…"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                  )}
                </Field>
              </Section>

              {/* ── Pricing & Inventory ── */}
              <Section title="Pricing & Inventory" required>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Original / MRP (₹)" hint="Strike-through price">
                    <Input
                      type="number"
                      min={0}
                      value={form.originalPrice ?? ""}
                      onChange={(e) => {
                        const mrp = e.target.value ? Number(e.target.value) : undefined;
                        setForm((prev) => {
                          const disc = prev.discount;
                          // If discount is already set, recalc selling price from new MRP
                          const price = mrp && disc
                            ? Math.round(mrp * (1 - disc / 100))
                            : prev.price;
                          return { ...prev, originalPrice: mrp, price };
                        });
                        setErrors((prev) => ({ ...prev, originalPrice: undefined, price: undefined }));
                      }}
                      placeholder="0"
                    />
                  </Field>

                  <Field label="Discount (%)" hint="Updates selling price automatically">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={form.discount ?? ""}
                      onChange={(e) => {
                        const disc = e.target.value ? Number(e.target.value) : undefined;
                        setForm((prev) => {
                          // Recalc selling price from MRP × (1 - disc%)
                          const price = prev.originalPrice && disc
                            ? Math.round(prev.originalPrice * (1 - disc / 100))
                            : prev.price;
                          return { ...prev, discount: disc, price };
                        });
                        setErrors((prev) => ({ ...prev, discount: undefined, price: undefined }));
                      }}
                      placeholder="0"
                    />
                  </Field>

                  <Field label="Selling Price (₹) *" hint="Updates discount % automatically">
                    <Input
                      type="number"
                      min={0}
                      value={form.price || ""}
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        setForm((prev) => {
                          // Recalc discount % from MRP and new selling price
                          const disc = prev.originalPrice && prev.originalPrice > 0 && price > 0
                            ? Math.round(((prev.originalPrice - price) / prev.originalPrice) * 100)
                            : prev.discount;
                          return { ...prev, price, discount: disc };
                        });
                        setErrors((prev) => ({ ...prev, price: undefined, discount: undefined }));
                      }}
                      placeholder="0"
                    />
                    {errors.price && (
                      <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                    )}
                  </Field>

                  {/* Live price summary */}
                  {form.originalPrice && form.price ? (
                    <div className="flex flex-col justify-center gap-0.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Preview</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-maroon-800 dark:text-gold-400">₹{form.price}</span>
                        <span className="text-xs text-gray-400 line-through">₹{form.originalPrice}</span>
                        {form.discount ? (
                          <span className="text-xs font-bold text-leaf-600 bg-leaf-50 dark:bg-leaf-900/20 px-1.5 py-0.5 rounded-full">
                            -{form.discount}%
                          </span>
                        ) : null}
                      </div>
                      <span className="text-[11px] text-gray-400">
                        Save ₹{form.originalPrice - form.price}
                      </span>
                    </div>
                  ) : (
                    <div /> // keep grid aligned
                  )}

                  <Field label="Stock Count" className="col-span-2 sm:col-span-1">
                    <Input
                      type="number"
                      min={0}
                      value={form.stockCount ?? 0}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        set("stockCount", n);
                        set("inStock", n > 0);
                      }}
                      placeholder="0"
                    />
                  </Field>
                </div>

                {/* Live stock badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Stock status:</span>
                  {form.stockCount === 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                      Out of Stock
                    </span>
                  ) : form.stockCount <= 20 ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
                      Low Stock — {form.stockCount} left
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-leaf-100 dark:bg-leaf-900/20 text-leaf-700 dark:text-leaf-400">
                      In Stock — {form.stockCount} units
                    </span>
                  )}
                </div>
              </Section>

              {/* ── Image ── */}
              <Section title="Product Image" required>
                {/* Tab switcher */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 w-fit">
                  {(["url", "upload"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setImageTab(tab)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors",
                        imageTab === tab
                          ? "bg-maroon-800 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                      )}
                    >
                      {tab === "url" ? (
                        <><Link2 className="w-3.5 h-3.5" /> URL</>
                      ) : (
                        <><Upload className="w-3.5 h-3.5" /> Upload File</>
                      )}
                    </button>
                  ))}
                </div>

                {/* URL tab */}
                {imageTab === "url" && (
                  <Field
                    label="Image URL *"
                    hint="Paste a direct public image URL (Unsplash, CDN, etc.)"
                  >
                    <Input
                      value={form.image.startsWith("data:") ? "" : form.image}
                      onChange={(e) => set("image", e.target.value)}
                      placeholder="https://images.unsplash.com/…"
                    />
                    {errors.image && (
                      <p className="text-xs text-red-500 mt-1">{errors.image}</p>
                    )}
                  </Field>
                )}

                {/* Upload tab */}
                {imageTab === "upload" && (
                  <div className="space-y-3">
                    {/* hidden real input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />

                    {/* Drop zone */}
                    <div
                      onClick={() => !uploading && fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setUploadDragging(true); }}
                      onDragLeave={() => setUploadDragging(false)}
                      onDrop={handleDrop}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-all",
                        uploading ? "cursor-wait opacity-60 border-gold-400 bg-gold-50 dark:bg-gold-900/10" :
                        uploadSuccess ? "cursor-default border-leaf-500 bg-leaf-50 dark:bg-leaf-900/20" :
                        uploadDragging ? "cursor-copy border-maroon-800 bg-maroon-50 dark:bg-maroon-900/20" :
                        "cursor-pointer border-gray-200 dark:border-gray-600 hover:border-maroon-800/50 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                          <p className="text-sm font-medium text-gold-600 dark:text-gold-400">Uploading to Supabase Storage…</p>
                        </>
                      ) : uploadSuccess ? (
                        <>
                          <CheckCircle2 className="w-8 h-8 text-leaf-600" />
                          <p className="text-sm font-medium text-leaf-700 dark:text-leaf-300">Upload successful!</p>
                          <p className="text-xs text-gray-400">Click to replace</p>
                        </>
                      ) : (
                        <>
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", uploadDragging ? "bg-maroon-100 dark:bg-maroon-900/30" : "bg-gray-100 dark:bg-gray-700")}>
                            <Upload className={cn("w-6 h-6 transition-colors", uploadDragging ? "text-maroon-800" : "text-gray-400")} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {uploadDragging ? "Drop to upload" : "Click or drag & drop"}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP — up to 5 MB</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Uploaded to <span className="text-maroon-800 dark:text-gold-400 font-medium">Supabase Storage</span> → URL saved in DB
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Browse button */}
                    <button
                      type="button"
                      onClick={() => !uploading && fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-wait transition-colors"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading ? "Uploading…" : "Browse Files"}
                    </button>

                    {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
                  </div>
                )}

                {/* Preview — always visible once an image is set */}
                {form.image && (
                  <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
                      onError={(e) => ((e.target as HTMLImageElement).src = "https://placehold.co/200x200?text=Bad+URL")}
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Preview</p>
                      {form.image.startsWith("data:") ? (
                        <p className="text-[11px] text-red-500">
                          ⚠ Base64 detected — please remove and re-upload after signing in.
                        </p>
                      ) : form.image.includes("supabase") ? (
                        <p className="text-[11px] text-leaf-600 dark:text-leaf-400 truncate">
                          ✅ Stored in Supabase Storage
                        </p>
                      ) : (
                        <p className="text-[11px] text-gray-400 truncate">{form.image}</p>
                      )}
                      <button
                        type="button"
                        onClick={() => set("image", "")}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3 h-3" /> Remove image
                      </button>
                    </div>
                  </div>
                )}
              </Section>

              {/* ── Labels & Visibility ── */}
              <Section title="Labels & Visibility" defaultOpen={isAdd}>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      ["isNew", "🆕 Mark as New"],
                      ["isBestSeller", "🏆 Best Seller"],
                      ["isFeatured", "⭐ Featured on Homepage"],
                      ["inStock", "✅ In Stock"],
                    ] as [keyof Product, string][]
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!!form[key]}
                        onChange={(e) => set(key, e.target.checked)}
                        className="w-4 h-4 rounded accent-maroon-800"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </Section>

              {/* ── Ingredients ── */}
              <Section title="Ingredients" defaultOpen={false}>
                <div className="flex flex-wrap gap-2 mb-3 min-h-8">
                  {(form.ingredients ?? []).length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No ingredients added yet</p>
                  ) : (
                    (form.ingredients ?? []).map((ing, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 bg-leaf-50 dark:bg-leaf-900/20 text-leaf-700 dark:text-leaf-300 text-xs px-2.5 py-1 rounded-full"
                      >
                        {ing}
                        <button
                          type="button"
                          onClick={() => removeIngredient(i)}
                          className="ml-0.5 text-leaf-500 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addIngredient())
                    }
                    placeholder="Type ingredient and press Enter or +"
                  />
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="flex-shrink-0 p-2 bg-maroon-800 hover:bg-maroon-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </Section>

              {/* ── Nutritional Info ── */}
              <Section title="Nutritional Information" defaultOpen={false}>
                <div className="space-y-2 mb-3">
                  {Object.keys(form.nutritionalInfo ?? {}).length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No nutritional info added yet</p>
                  ) : (
                    Object.entries(form.nutritionalInfo ?? {}).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 flex-shrink-0">
                          {k}
                        </span>
                        <span className="text-sm text-gray-500 flex-1">{v}</span>
                        <button
                          type="button"
                          onClick={() => removeNutri(k)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newNutriKey}
                    onChange={(e) => setNewNutriKey(e.target.value)}
                    placeholder="Nutrient (e.g. Protein)"
                    className="flex-1"
                  />
                  <Input
                    value={newNutriVal}
                    onChange={(e) => setNewNutriVal(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addNutri())
                    }
                    placeholder="Value (e.g. 12g / 100g)"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={addNutri}
                    className="flex-shrink-0 p-2 bg-maroon-800 hover:bg-maroon-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </Section>

              {/* ── Storage & Extra ── */}
              <Section title="Storage & Additional Info" defaultOpen={false}>
                <Field label="Storage Instructions">
                  <Textarea
                    rows={2}
                    value={form.storageInstructions ?? ""}
                    onChange={(e) => set("storageInstructions", e.target.value)}
                    placeholder="e.g. Store in a cool, dry place. Use within 6 months of manufacture."
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Rating (0–5)" hint="Displayed as star rating">
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={form.rating}
                      onChange={(e) => set("rating", Number(e.target.value))}
                      placeholder="4.5"
                    />
                  </Field>

                  <Field label="Review Count" hint="Number shown under stars">
                    <Input
                      type="number"
                      min={0}
                      value={form.reviewCount}
                      onChange={(e) => set("reviewCount", Number(e.target.value))}
                      placeholder="0"
                    />
                  </Field>
                </div>
              </Section>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
              {/* Required fields hint */}
              <p className="text-[11px] text-gray-400 hidden sm:block">
                * Required fields
              </p>
              <div className="flex gap-3 ml-auto">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
                    saved
                      ? "bg-leaf-600 text-white"
                      : isAdd
                      ? "bg-leaf-700 hover:bg-leaf-600 text-white"
                      : "bg-maroon-800 hover:bg-maroon-700 text-white shadow-premium hover:shadow-lg"
                  )}
                >
                  {isAdd ? <PackagePlus className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved!" : isAdd ? "Add Product" : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
