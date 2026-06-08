"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [ready, setReady] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Check session on first load
    getAdminSession().then((session) => {
      if (!session && !isLoginPage) {
        router.replace("/admin/login");
      } else {
        setReady(true);
      }
    });

    // Listen for auth state changes (logout from another tab, token expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT" && !isLoginPage) {
          router.replace("/admin/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [isLoginPage, router]);

  // Login page renders immediately without auth check
  if (isLoginPage) return <>{children}</>;

  // Dashboard waits for session check
  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Verifying session…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
