import type { NextConfig } from "next";

// Parse Supabase URL if it exists
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const url = new URL(supabaseUrl);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*",
        protocol: "https",
        port: "",
        pathname: "/**",
      },
      {
        hostname: "qrcode.io.vn",
        protocol: "https",
        port: "",
        pathname: "/api/generate/**",
      },
      // {
      //   hostname: url.hostname,
      //   protocol: url.protocol.replace(":", "") as "http" | "https",
      //   port: url.port,
      //   pathname: "/**",
      // },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/webhook-payment",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
