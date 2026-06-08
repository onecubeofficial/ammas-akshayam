"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, AlertCircle,
  Loader2, CheckCircle2, ArrowLeft, Leaf,
  Star, ShieldCheck, Truck, Gift,
} from "lucide-react";
import { useUserAuth } from "@/components/providers/UserAuthProvider";

/* ─── left-panel trust badges ─── */
const perks = [
  { icon: ShieldCheck, text: "Secure & encrypted login" },
  { icon: Truck,       text: "Track all your orders" },
  { icon: Star,        text: "Exclusive member offers" },
  { icon: Gift,        text: "Earn loyalty rewards" },
];

/* ─── reusable field wrapper ─── */
function Field({
  label, icon: Icon, type, value, onChange, placeholder, autoComplete, minLength, toggle, show, onToggle,
}: {
  label: string; icon: React.ElementType; type: string; value: string;
  onChange: (v: string) => void; placeholder: string; autoComplete?: string;
  minLength?: number; toggle?: boolean; show?: boolean; onToggle?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative group">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-maroon-800 dark:group-focus-within:text-gold-400 transition-colors" />
        <input
          type={toggle ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          minLength={minLength}
          className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-maroon-800/40 dark:focus:ring-gold-500/40 focus:border-maroon-800 dark:focus:border-gold-500 transition-all"
        />
        {toggle && (
          <button type="button" onClick={onToggle}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") ?? "/account";
  const { user, loading, signIn, signUp } = useUserAuth();

  const [tab, setTab]           = useState<"login" | "signup">("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  useEffect(() => {
    if (!loading && user) router.replace(redirect);
  }, [user, loading, router, redirect]);

  const switchTab = (t: "login" | "signup") => {
    setTab(t); setError(""); setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    if (tab === "login") {
      const { error: err } = await signIn(email, password);
      if (err) setError(err); else router.replace(redirect);
    } else {
      if (!fullName.trim()) { setError("Please enter your full name."); setSubmitting(false); return; }
      const { error: err } = await signUp(email, password, fullName);
      if (err) setError(err);
      else setSuccess("Account created! Check your email to confirm, then sign in.");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-950">
      <Loader2 className="w-8 h-8 text-maroon-800 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-cream dark:bg-gray-950">

      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col relative overflow-hidden">
        {/* Rich gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-800" />
        <div className="absolute inset-0 kolam-bg opacity-15" />

        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-leaf-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-maroon-700/30 blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-10 py-10">
          {/* Logo */}
 
          {/* Hero text */}
          <div className="my-auto">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gold-300 text-sm font-medium uppercase tracking-widest mb-3">
                {tab === "login" ? "Welcome back" : "Join us today"}
              </p>
              <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
                {tab === "login"
                  ? "Your favourite\nTamil flavours\nawait you."
                  : "Authentic Tamil\nNadu goodness\ndelivered fresh."}
              </h2>
              <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
                {tab === "login"
                  ? "Sign in to track orders, manage your wishlist, and get exclusive member-only offers."
                  : "Create a free account and join thousands of families who trust Amma's Akshayam."}
              </p>
            </motion.div>

            {/* Perks */}
            <div className="mt-8 space-y-3">
              {perks.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gold-300" />
                  </div>
                  <span className="text-sm text-cream/70">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <div className="mt-auto pt-10">
            <blockquote className="border-l-2 border-gold-500/50 pl-4">
              <p className="text-cream/50 text-xs italic leading-relaxed">
                &ldquo;From Amma&apos;s Kitchen to Your Home –<br />
                Pure Tradition, Endless Goodness.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-8 overflow-y-auto">
        {/* Back link (mobile only) */}
        <Link
          href="/"
          className="lg:hidden self-start flex items-center gap-1.5 text-sm text-gray-500 hover:text-maroon-800 dark:hover:text-gold-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="w-full max-w-md">
          {/* Heading */}
          <motion.div
            key={tab + "-heading"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7"
          >
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {tab === "login" ? "Sign in to your account" : "Create a free account"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {tab === "login"
                ? "Enter your credentials to continue"
                : "Fill in the details below to get started"}
            </p>
          </motion.div>

          {/* Tab pills */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-7">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? "bg-white dark:bg-gray-700 text-maroon-800 dark:text-gold-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-5"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2.5 bg-leaf-50 dark:bg-leaf-900/20 border border-leaf-200 dark:border-leaf-800 text-leaf-700 dark:text-leaf-300 text-sm rounded-xl px-4 py-3 mb-5"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {tab === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Field
                    label="Full Name" icon={User} type="text"
                    value={fullName} onChange={setFullName}
                    placeholder="Your full name" autoComplete="name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Field
              label="Email Address" icon={Mail} type="email"
              value={email} onChange={setEmail}
              placeholder="you@example.com" autoComplete="email"
            />

            <Field
              label="Password" icon={Lock} type="password"
              value={password} onChange={setPassword}
              placeholder={tab === "signup" ? "Min. 6 characters" : "Your password"}
              autoComplete={tab === "login" ? "current-password" : "new-password"}
              minLength={6} toggle show={showPass} onToggle={() => setShowPass(!showPass)}
            />

            {tab === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-maroon-800 dark:text-gold-400 hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-1 bg-maroon-800 hover:bg-maroon-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-premium hover:shadow-lg text-sm"
            >
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> {tab === "login" ? "Signing in…" : "Creating account…"}</>
                : tab === "login" ? "Sign In" : "Create Account"
              }
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Switch tab */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {tab === "login" ? (
              <>New to Amma&apos;s Akshayam?{" "}
                <button onClick={() => switchTab("signup")} className="text-maroon-800 dark:text-gold-400 font-semibold hover:underline">
                  Create free account
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => switchTab("login")} className="text-maroon-800 dark:text-gold-400 font-semibold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>

          {/* Terms */}
          {tab === "signup" && (
            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="underline hover:text-maroon-800 dark:hover:text-gold-400">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline hover:text-maroon-800 dark:hover:text-gold-400">Privacy Policy</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-950">
        <Loader2 className="w-8 h-8 text-maroon-800 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
