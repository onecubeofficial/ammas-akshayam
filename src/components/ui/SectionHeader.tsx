"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  titleTamil?: string;
  center?: boolean;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  titleTamil,
  center = true,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-10",
        center && "text-center",
        className
      )}
    >
      {titleTamil && (
        <p className="text-sm text-gold-600 dark:text-gold-400 font-tamil font-medium mb-2">
          {titleTamil}
        </p>
      )}
      <h2 className="section-title">{title}</h2>
      <div className="flex items-center gap-3 mt-3 mb-4 justify-center">
        <div className="h-0.5 w-12 bg-gold-300 rounded-full" />
        <div className="w-2 h-2 rounded-full bg-gold-500" />
        <div className="h-0.5 w-20 bg-maroon-800 rounded-full" />
        <div className="w-2 h-2 rounded-full bg-gold-500" />
        <div className="h-0.5 w-12 bg-gold-300 rounded-full" />
      </div>
      {subtitle && (
        <p className="section-subtitle max-w-2xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  );
}
