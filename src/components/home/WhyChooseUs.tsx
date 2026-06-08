"use client";

import { motion } from "framer-motion";
import {
  Heart,
  BookOpen,
  Leaf,
  Package,
  Truck,
  Users,
  Star,
  Award,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const features = [
  {
    icon: Heart,
    title: "Homemade Quality",
    titleTamil: "வீட்டு தரம்",
    desc: "Every product is made with the same love and care as your grandmother's kitchen.",
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    icon: BookOpen,
    title: "Traditional Recipes",
    titleTamil: "பாரம்பரிய சமையல்",
    desc: "Recipes preserved and passed down through generations of Tamil families.",
    color: "text-maroon-800",
    bg: "bg-maroon-50 dark:bg-maroon-900/20",
  },
  {
    icon: Leaf,
    title: "Natural Ingredients",
    titleTamil: "இயற்கை பொருட்கள்",
    desc: "100% natural, no artificial preservatives, colors, or flavor enhancers.",
    color: "text-leaf-600",
    bg: "bg-leaf-50 dark:bg-leaf-900/20",
  },
  {
    icon: Package,
    title: "Hygienic Packaging",
    titleTamil: "சுகாதார பேக்கேஜிங்",
    desc: "Sealed with care in food-grade packaging to preserve freshness and flavor.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    titleTamil: "விரைவு டெலிவரி",
    desc: "Delivered fresh within 2–5 business days across all 38 Tamil Nadu districts.",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    icon: Users,
    title: "Trusted by Families",
    titleTamil: "குடும்பங்களால் நம்பப்படுகிறது",
    desc: "Over 10,000 happy families trust Amma's Akshayam for their daily needs.",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    icon: Star,
    title: "Tamil Nadu Heritage",
    titleTamil: "தமிழ்நாடு பாரம்பரியம்",
    desc: "Proudly celebrating the rich culinary heritage of Tamil Nadu since 2018.",
    color: "text-gold-600",
    bg: "bg-gold-50 dark:bg-gold-900/20",
  },
  {
    icon: Award,
    title: "Quality Certified",
    titleTamil: "தர சான்றிதழ்",
    desc: "FSSAI certified, ISO standards compliant — quality you can trust completely.",
    color: "text-teal-500",
    bg: "bg-teal-50 dark:bg-teal-900/20",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Why Choose Amma's Akshayam?"
          titleTamil="எங்களை ஏன் தேர்வு செய்ய வேண்டும்?"
          subtitle="We bring you the authentic taste of Tamil Nadu with uncompromising quality"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="group p-5 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-maroon-200 dark:hover:border-maroon-800 transition-all duration-300 hover:shadow-card text-center"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
              >
                <feat.icon className={`w-7 h-7 ${feat.color}`} />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                {feat.title}
              </h3>
              <p className="text-xs text-gray-400 font-tamil mb-2">
                {feat.titleTamil}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
