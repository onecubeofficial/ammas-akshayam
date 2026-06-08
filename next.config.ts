import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow any HTTPS host — images come from arbitrary URLs entered by admin
      },
    ],
  },
};

export default nextConfig;
