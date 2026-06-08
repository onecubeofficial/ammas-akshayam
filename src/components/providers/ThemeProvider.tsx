"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storageKey="ammas-akshayam-theme"
      scriptProps={{ "data-cfasync": "false" }}
    >
      {children}
    </NextThemesProvider>
  );
}
