import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enforce strict React mode for catching common bugs
  reactStrictMode: true,

  // Image optimization — domains will be expanded as IPFS/Pinata is added in Phase 5
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
    ],
  },

  // Security headers applied to every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // Redirect naked root to landing — extends as auth/dashboard routes are added
  async redirects() {
    return [];
  },
};

export default nextConfig;
