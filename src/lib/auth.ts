import { supabase } from "./supabase";

const ADMIN_EMAIL = "saranyaamohankumar@gmail.com";

export async function signInAdmin(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  if (email.toLowerCase() !== ADMIN_EMAIL) {
    return { error: "Access denied. This panel is for admins only." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { error: null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  if (session.user.email?.toLowerCase() !== ADMIN_EMAIL) return null;
  return session;
}
