"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Check,
} from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-maroon-900 to-maroon-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 kolam-bg opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <span className="text-gold-400 font-tamil text-lg block mb-2">தொடர்பு கொள்ளுங்கள்</span>
          <h1 className="font-display text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-cream/80">
            We&apos;d love to hear from you. Reach out anytime!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              {
                icon: Phone,
                title: "Phone",
                lines: ["+91 98765 43210", "+91 91234 56789"],
                color: "text-blue-500",
                bg: "bg-blue-50 dark:bg-blue-900/20",
              },
              {
                icon: Mail,
                title: "Email",
                lines: ["hello@ammasakshayam.com", "orders@ammasakshayam.com"],
                color: "text-maroon-800",
                bg: "bg-maroon-50 dark:bg-maroon-900/20",
              },
              {
                icon: MapPin,
                title: "Address",
                lines: ["123 Anna Nagar", "Chennai – 600040, Tamil Nadu"],
                color: "text-gold-600",
                bg: "bg-gold-50 dark:bg-gold-900/20",
              },
              {
                icon: Clock,
                title: "Business Hours",
                lines: ["Mon–Sat: 9:00 AM – 7:00 PM", "Sun: 10:00 AM – 4:00 PM"],
                color: "text-leaf-600",
                bg: "bg-leaf-50 dark:bg-leaf-900/20",
              },
            ].map(({ icon: Icon, title, lines, color, bg }) => (
              <div key={title} className="card p-5 flex gap-4">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {title}
                  </h3>
                  {lines.map((l) => (
                    <p key={l} className="text-sm text-gray-500">{l}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white rounded-2xl p-4 hover:bg-[#1fbd5a] transition-colors shadow-md"
            >
              <MessageCircle className="w-6 h-6" fill="white" />
              <div>
                <div className="font-semibold">Chat on WhatsApp</div>
                <div className="text-sm text-white/80">Instant support</div>
              </div>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Send Us a Message
              </h2>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-leaf-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-leaf-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-500">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email *
                      </label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject *
                      </label>
                      <select name="subject" value={form.subject} onChange={handleChange} required className="input-field">
                        <option value="">Select subject</option>
                        <option>Order Enquiry</option>
                        <option>Product Query</option>
                        <option>Delivery Issue</option>
                        <option>Return/Refund</option>
                        <option>Wholesale/Bulk</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message *
                    </label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="How can we help you?" className="input-field resize-none" />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Map */}
            <div className="mt-6 rounded-2xl overflow-hidden shadow-card h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MapPin className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm">Google Maps Integration</p>
                <p className="text-xs">123 Anna Nagar, Chennai, Tamil Nadu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
