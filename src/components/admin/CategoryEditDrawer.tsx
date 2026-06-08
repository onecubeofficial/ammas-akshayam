"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Save, FolderPlus, Pencil, Upload, Link2,
  Loader2, CheckCircle2,
} from "lucide-react";
import type { Category } from "@/lib/types";
import { uploadProductImage } from "@/lib/db";
import { cn } from "@/lib/utils";

interface CategoryEditDrawerProps {
  category: Category | null;
  mode: "edit" | "add";
  onClose: () => void;
  onSave: (category: Category) => void;
}

const GRADIENT_PRESETS = [
  { label: "Maroon → Gold",   value: "from-maroon-800 to-gold-500" },
  { label: "Maroon → Dark",   value: "from-maroon-800 to-maroon-600" },
  { label: "Gold",            value: "from-gold-600 to-gold-400" },
  { label: "Leaf",            value: "from-leaf-700 to-leaf-500" },
  { label: "Leaf → Gold",     value: "from-leaf-600 to-gold-400" },
  { label: "Orange → Yellow", value: "from-orange-700 to-yellow-500" },
  { label: "Amber",           value: "from-amber-700 to-amber-400" },
  { label: "Pink → Rose",     value: "from-pink-700 to-rose-400" },
  { label: "Teal → Emerald",  value: "from-teal-700 to-emerald-400" },
  { label: "Green → Lime",    value: "from-green-800 to-lime-500" },
];

const BLANK: Category = {
  id: "",
  name: "",
  nameTamil: "",
  slug: "",
  image: "",
  productCount: 0,
  color: "from-maroon-800 to-gold-500",
};

/* ── Shared tiny helpers ── */
function Field({ label, hint, children, className }: {
  label: string; hint?: string; children: React.ReactNode; className?: string;
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

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
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

/* ── Main drawer ── */
export default function CategoryEditDrawer({ category, mode, onClose, onSave }: CategoryEditDrawerProps) {
  const isAdd = mode === "add";
  const isOpen = isAdd || category !== null;

  const [form, setForm]       = useState<Category>(BLANK);
  const [errors, setErrors]   = useState<Partial<Record<keyof Category, string>>>({});
  const [saved, setSaved]     = useState(false);
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const [uploading, setUploading]       = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadDragging, setUploadDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* seed form */
  useEffect(() => {
    if (isAdd) {
      setForm({ ...BLANK, id: `cat-${Date.now()}` });
    } else if (category) {
      setForm(JSON.parse(JSON.stringify(category)));
    }
    setSaved(false);
    setErrors({});
    setImageTab("url");
    setUploadSuccess(false);
  }, [category, mode, isAdd]);

  const set = (key: keyof Category, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* auto-slug */
  const handleNameChange = (val: string) => {
    set("name", val);
    if (isAdd) {
      set("slug", val.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""));
    }
  };

  /* image upload */
  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    setUploadSuccess(false);
    const url = await uploadProductImage(file);
    setUploading(false);
    if (url) {
      set("image", url);
      setErrors((prev) => ({ ...prev, image: undefined }));
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } else {
      setErrors((prev) => ({
        ...prev,
        image: "Upload failed. Admin must be signed in. Use the URL tab instead.",
      }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  /* validation */
  const validate = () => {
    const e: Partial<Record<keyof Category, string>> = {};
    if (!form.name.trim())  e.name  = "Category name is required";
    if (!form.slug.trim())  e.slug  = "Slug is required";
    if (!form.image.trim()) e.image = "Image is required";
    return e;
  };

  /* save */
  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 700);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  isAdd ? "bg-leaf-100 dark:bg-leaf-900/30" : "bg-gold-100 dark:bg-gold-900/30"
                )}>
                  {isAdd
                    ? <FolderPlus className="w-5 h-5 text-leaf-600 dark:text-leaf-400" />
                    : <Pencil className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                  }
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-gray-800 dark:text-gray-100">
                    {isAdd ? "Add Category" : "Edit Category"}
                  </h2>
                  <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                    {isAdd ? "Create a new product category" : form.name}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Basic info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Basic Information
                </h3>

                <Field label="Category Name *">
                  <Input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Traditional Snacks"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="URL Slug *" hint={isAdd ? "Auto-generated. Edit if needed." : "Changing slug may break links."}>
                    <Input
                      value={form.slug}
                      onChange={(e) => set("slug", e.target.value)}
                      placeholder="traditional-snacks"
                    />
                    {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                  </Field>

                  <Field label="Tamil Name">
                    <Input
                      value={form.nameTamil ?? ""}
                      onChange={(e) => set("nameTamil", e.target.value)}
                      placeholder="பாரம்பரிய தின்பண்டங்கள்"
                    />
                  </Field>
                </div>
              </div>

              {/* Image */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Category Image *
                </h3>

                {/* Tab */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 w-fit">
                  {(["url", "upload"] as const).map((tab) => (
                    <button
                      key={tab} type="button" onClick={() => setImageTab(tab)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors",
                        imageTab === tab
                          ? "bg-maroon-800 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600"
                      )}
                    >
                      {tab === "url" ? <><Link2 className="w-3.5 h-3.5" /> URL</> : <><Upload className="w-3.5 h-3.5" /> Upload</>}
                    </button>
                  ))}
                </div>

                {imageTab === "url" && (
                  <Field label="Image URL *" hint="Paste a direct public image URL">
                    <Input
                      value={form.image}
                      onChange={(e) => set("image", e.target.value)}
                      placeholder="https://images.unsplash.com/…"
                    />
                    {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
                  </Field>
                )}

                {imageTab === "upload" && (
                  <div className="space-y-3">
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
                    <div
                      onClick={() => !uploading && fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setUploadDragging(true); }}
                      onDragLeave={() => setUploadDragging(false)}
                      onDrop={handleDrop}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer",
                        uploading ? "opacity-60 border-gold-400 bg-gold-50 dark:bg-gold-900/10 cursor-wait" :
                        uploadSuccess ? "border-leaf-500 bg-leaf-50 dark:bg-leaf-900/20" :
                        uploadDragging ? "border-maroon-800 bg-maroon-50 dark:bg-maroon-900/20 cursor-copy" :
                        "border-gray-200 dark:border-gray-600 hover:border-maroon-800/50 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      {uploading ? (
                        <><Loader2 className="w-7 h-7 text-gold-500 animate-spin" /><p className="text-sm font-medium text-gold-600">Uploading…</p></>
                      ) : uploadSuccess ? (
                        <><CheckCircle2 className="w-7 h-7 text-leaf-600" /><p className="text-sm font-medium text-leaf-700 dark:text-leaf-300">Upload successful!</p></>
                      ) : (
                        <><Upload className="w-7 h-7 text-gray-400" /><p className="text-sm font-medium text-gray-600 dark:text-gray-300">{uploadDragging ? "Drop to upload" : "Click or drag & drop"}</p><p className="text-xs text-gray-400">JPG, PNG, WebP</p></>
                      )}
                    </div>
                    {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
                  </div>
                )}

                {/* Preview */}
                {form.image && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image} alt="Preview"
                      className="w-20 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
                      onError={(e) => ((e.target as HTMLImageElement).src = "https://placehold.co/200x120?text=Bad+URL")}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Preview</p>
                      <p className="text-[11px] text-gray-400 truncate">{form.image}</p>
                      <button type="button" onClick={() => set("image", "")} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1 transition-colors">
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card gradient */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Card Gradient Color
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {GRADIENT_PRESETS.map((g) => (
                    <button
                      key={g.value} type="button"
                      onClick={() => set("color", g.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all",
                        form.color === g.value
                          ? "border-maroon-800 dark:border-gold-400 bg-maroon-50 dark:bg-maroon-900/20 text-maroon-800 dark:text-gold-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                      )}
                    >
                      <span className={`w-5 h-5 rounded-md bg-gradient-to-br flex-shrink-0 ${g.value}`} />
                      {g.label}
                    </button>
                  ))}
                </div>
                <Field label="Custom gradient class" hint='e.g. "from-purple-700 to-blue-400" — uses Tailwind CSS'>
                  <Input
                    value={form.color ?? ""}
                    onChange={(e) => set("color", e.target.value)}
                    placeholder="from-maroon-800 to-gold-500"
                  />
                </Field>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
              <button
                type="button" onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button" onClick={handleSave}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                  saved
                    ? "bg-leaf-500 text-white"
                    : "bg-maroon-800 hover:bg-maroon-700 text-white"
                )}
              >
                {saved
                  ? <><CheckCircle2 className="w-4 h-4" /> Saved!</>
                  : <><Save className="w-4 h-4" /> {isAdd ? "Create Category" : "Save Changes"}</>
                }
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
