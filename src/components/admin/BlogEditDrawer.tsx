"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Save, FilePlus2, Pencil, Upload, Link2,
  Loader2, CheckCircle2, Plus, Trash2,
} from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { uploadProductImage } from "@/lib/db";
import { cn } from "@/lib/utils";

interface BlogEditDrawerProps {
  post: BlogPost | null;
  mode: "edit" | "add";
  onClose: () => void;
  onSave: (post: BlogPost) => void;
}

const BLANK: BlogPost = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  author: "Amma's Akshayam Team",
  date: new Date().toISOString().split("T")[0],
  category: "",
  readTime: 5,
  tags: [],
};

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

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
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

export default function BlogEditDrawer({ post, mode, onClose, onSave }: BlogEditDrawerProps) {
  const isAdd = mode === "add";
  const isOpen = isAdd || post !== null;

  const [form, setForm]   = useState<BlogPost>(BLANK);
  const [errors, setErrors] = useState<Partial<Record<keyof BlogPost, string>>>({});
  const [saved, setSaved] = useState(false);
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const [uploading, setUploading]           = useState(false);
  const [uploadSuccess, setUploadSuccess]   = useState(false);
  const [uploadDragging, setUploadDragging] = useState(false);
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdd) {
      setForm({ ...BLANK, id: `post-${Date.now()}`, date: new Date().toISOString().split("T")[0] });
    } else if (post) {
      setForm(JSON.parse(JSON.stringify(post)));
    }
    setSaved(false);
    setErrors({});
    setImageTab("url");
    setUploadSuccess(false);
    setNewTag("");
  }, [post, mode, isAdd]);

  const set = (key: keyof BlogPost, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleTitleChange = (val: string) => {
    set("title", val);
    if (isAdd) {
      set("slug", val.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""));
    }
  };

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
      setErrors((prev) => ({ ...prev, image: "Upload failed. Use URL tab instead." }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const addTag = () => {
    const t = newTag.trim().toLowerCase();
    if (!t || (form.tags ?? []).includes(t)) return;
    set("tags", [...(form.tags ?? []), t]);
    setNewTag("");
  };

  const removeTag = (t: string) => set("tags", (form.tags ?? []).filter((x) => x !== t));

  const validate = () => {
    const e: Partial<Record<keyof BlogPost, string>> = {};
    if (!form.title.trim())   e.title   = "Title is required";
    if (!form.slug.trim())    e.slug    = "Slug is required";
    if (!form.excerpt.trim()) e.excerpt = "Excerpt is required";
    if (!form.image.trim())   e.image   = "Cover image is required";
    return e;
  };

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
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  isAdd ? "bg-leaf-100 dark:bg-leaf-900/30" : "bg-gold-100 dark:bg-gold-900/30"
                )}>
                  {isAdd
                    ? <FilePlus2 className="w-5 h-5 text-leaf-600 dark:text-leaf-400" />
                    : <Pencil className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                  }
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-gray-800 dark:text-gray-100">
                    {isAdd ? "New Blog Post" : "Edit Blog Post"}
                  </h2>
                  <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                    {isAdd ? "Write a new article" : form.title}
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
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Basic Information</h3>

                <Field label="Title *">
                  <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. The Health Benefits of Kambu" />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="URL Slug *" hint={isAdd ? "Auto-generated from title" : "Changing breaks existing links"}>
                    <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="health-benefits-of-kambu" />
                    {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                  </Field>

                  <Field label="Category *">
                    <Input
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                      placeholder="e.g. Health Benefits, Festival Foods…"
                    />
                  </Field>

                  <Field label="Author">
                    <Input value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Author name" />
                  </Field>

                  <Field label="Publish Date">
                    <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
                  </Field>

                  <Field label="Read Time (minutes)">
                    <Input type="number" min={1} value={form.readTime} onChange={(e) => set("readTime", Number(e.target.value))} placeholder="5" />
                  </Field>
                </div>

                <Field label="Excerpt *" hint="Short summary shown on blog listing page">
                  <Textarea rows={3} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="A brief description of what this article is about…" />
                  {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>}
                </Field>
              </div>

              {/* Cover image */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cover Image *</h3>

                <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 w-fit">
                  {(["url", "upload"] as const).map((tab) => (
                    <button key={tab} type="button" onClick={() => setImageTab(tab)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors",
                        imageTab === tab ? "bg-maroon-800 text-white" : "bg-white dark:bg-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600"
                      )}
                    >
                      {tab === "url" ? <><Link2 className="w-3.5 h-3.5" /> URL</> : <><Upload className="w-3.5 h-3.5" /> Upload</>}
                    </button>
                  ))}
                </div>

                {imageTab === "url" && (
                  <Field label="Image URL *" hint="Paste a direct public image URL">
                    <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://images.unsplash.com/…" />
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
                        "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all",
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

                {form.image && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="Preview" className="w-24 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
                      onError={(e) => ((e.target as HTMLImageElement).src = "https://placehold.co/240x140?text=Bad+URL")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Preview</p>
                      <p className="text-[11px] text-gray-400 truncate">{form.image}</p>
                      <button type="button" onClick={() => set("image", "")} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1">
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Full content */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full Article Content</h3>
                <Field label="Content" hint="Supports line breaks. Leave empty to show only excerpt on article page.">
                  <Textarea
                    rows={12}
                    value={form.content}
                    onChange={(e) => set("content", e.target.value)}
                    placeholder="Write the full article here…&#10;&#10;You can use blank lines to separate paragraphs."
                  />
                </Field>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tags</h3>
                <div className="flex flex-wrap gap-2 min-h-8">
                  {(form.tags ?? []).length === 0
                    ? <p className="text-xs text-gray-400 italic">No tags added yet</p>
                    : (form.tags ?? []).map((t) => (
                      <span key={t} className="flex items-center gap-1 bg-maroon-50 dark:bg-maroon-900/20 text-maroon-800 dark:text-maroon-300 text-xs px-2.5 py-1 rounded-full">
                        #{t}
                        <button type="button" onClick={() => removeTag(t)} className="text-maroon-400 hover:text-red-500 transition-colors ml-0.5">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  }
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Add a tag and press Enter"
                    className="flex-1"
                  />
                  <button type="button" onClick={addTag}
                    className="px-3 py-2 bg-maroon-800 hover:bg-maroon-700 text-white rounded-lg text-sm transition-colors flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleSave}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                  saved ? "bg-leaf-500 text-white" : "bg-maroon-800 hover:bg-maroon-700 text-white"
                )}>
                {saved
                  ? <><CheckCircle2 className="w-4 h-4" /> Saved!</>
                  : <><Save className="w-4 h-4" /> {isAdd ? "Publish Post" : "Save Changes"}</>
                }
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
