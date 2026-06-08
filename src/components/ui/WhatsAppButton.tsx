"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.a
      href="https://wa.me/919876543210?text=Hello%20Amma%27s%20Akshayam!%20I%20would%20like%20to%20enquire%20about%20your%20products."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 260 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1fbd5a] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-colors"
    >
      <MessageCircle className="w-7 h-7" fill="white" />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </motion.a>
  );
}
