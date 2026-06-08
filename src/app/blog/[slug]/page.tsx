import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/db";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  return { title: post?.title ?? "Blog Post", description: post?.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
  ]);

  if (!post) notFound();

  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-maroon-800 dark:hover:text-gold-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <article className="card overflow-hidden">
          <div className="relative aspect-video overflow-hidden">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
            <div className="absolute top-4 left-4">
              <span className="bg-maroon-800 text-white text-sm font-semibold px-3 py-1.5 rounded-full">{post.category}</span>
            </div>
          </div>

          <div className="p-8">
            <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime} min read</span>
              <span>By {post.author}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">{post.excerpt}</p>
            <div className="prose prose-gray dark:prose-invert max-w-none
              prose-headings:font-display prose-headings:text-gray-800 dark:prose-headings:text-gray-100
              prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
              prose-h2:mt-8 prose-h3:mt-6
              prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-li:text-gray-600 dark:prose-li:text-gray-300
              prose-ul:list-disc prose-ol:list-decimal
              prose-strong:text-gray-800 dark:prose-strong:text-gray-100
              prose-a:text-maroon-800 dark:prose-a:text-gold-400 prose-a:no-underline hover:prose-a:underline
              prose-hr:border-gray-200 dark:prose-hr:border-gray-700">
              {post.content ? (
                <ReactMarkdown>{post.content}</ReactMarkdown>
              ) : (
                <>
                  <p>Tamil Nadu&apos;s culinary heritage is one of the richest in all of India. With a history spanning over 2,000 years, the food culture of this state is deeply intertwined with its traditions, festivals, and way of life.</p>
                  <p>At Amma&apos;s Akshayam, we believe that food is not just sustenance — it is culture, memory, and love. Our mission is to preserve these age-old recipes and make them accessible to families across India and beyond.</p>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="section-title mb-5">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="card group overflow-hidden block">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-gold-600 dark:text-gold-400 font-medium">{p.category}</span>
                    <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mt-1 line-clamp-2 group-hover:text-maroon-800 dark:group-hover:text-gold-400 transition-colors">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
