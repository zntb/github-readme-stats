import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Allow GitHub avatar images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  // Required: allow Next.js to bundle ESM packages used in route handlers
  // (axios, emoji-name-map, github-username-regex, word-wrap)
  serverExternalPackages: [],

  // Transpile our src/ ESM modules so Next.js can bundle them
  transpilePackages: ["src"],

  // Webpack: ensure JSON imports work for languageColors.json
  webpack(config) {
    return config;
  },

  // Turbopack configuration (required in Next.js 16+ when using webpack config)
  turbopack: {},

  // Redirect / → /url-builder
  async redirects() {
    return [
      {
        source: "/",
        destination: "/url-builder",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
