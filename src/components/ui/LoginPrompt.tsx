"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useUserAuth } from "@/components/providers/UserAuthProvider";

interface LoginPromptProps {
  onClose: () => void;
  onSuccess?: () => void;
  message?: string;
}

export default function LoginPrompt({
  onClose,
  onSuccess,
  message = "Please sign in to continue.",
}: LoginPromptProps) {
  const { signIn } = useUserAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    onSuccess?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="login-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        key="login-modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
          {/* Header */}
          <div className="bg-gradient-to-br from-maroon-900 to-maroon-800 px-6 py-5 relative kolam-bg">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo_round.png" alt="Amma's Akshayam" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-white text-sm">Amma&apos;s Akshayam</span>
            </div>
            <h2 className="font-display text-xl font-bold text-white">Sign In Required</h2>
            <p className="text-cream/70 text-xs mt-1">{message}</p>
          </div>

          {/* Form */}
          <div className="px-6 py-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl px-3 py-2.5 mb-4">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                  className="input-field pl-9 text-sm"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="input-field pl-9 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-maroon-800 hover:bg-maroon-700 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                  : "Sign In"
                }
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-4">
              No account?{" "}
              <a href="/login" className="text-maroon-800 dark:text-gold-400 font-semibold hover:underline">
                Create one free
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
