import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Noto_Serif_Tamil } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { WishlistProvider } from "@/components/providers/WishlistProvider";
import { UserAuthProvider } from "@/components/providers/UserAuthProvider";
import ShellWrapper from "@/components/layout/ShellWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const notoSerifTamil = Noto_Serif_Tamil({
  subsets: ["tamil"],
  variable: "--font-noto-serif-tamil",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Amma's Akshayam – Pure Tamil Nadu Tradition, Endless Goodness",
    template: "%s | Amma's Akshayam",
  },
  description:
    "Authentic Tamil Nadu homemade foods, organic groceries, traditional snacks, pickles, millet products, spices and healthy kitchen essentials delivered to your doorstep.",
  keywords: [
    "Tamil Nadu food",
    "homemade snacks",
    "organic grocery",
    "traditional pickles",
    "millet products",
    "murukku",
    "Amma's Akshayam",
    "South Indian food online",
  ],
  authors: [{ name: "Amma's Akshayam" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ammasakshayam.com",
    siteName: "Amma's Akshayam",
    title: "Amma's Akshayam – Pure Tamil Nadu Tradition",
    description:
      "Authentic Tamil Nadu homemade foods delivered to your doorstep.",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amma's Akshayam",
    description: "Authentic Tamil Nadu homemade foods",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8E7" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${notoSerifTamil.variable}`}
    >
      <body className="bg-cream dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          <UserAuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ShellWrapper>{children}</ShellWrapper>
              </WishlistProvider>
            </CartProvider>
          </UserAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
