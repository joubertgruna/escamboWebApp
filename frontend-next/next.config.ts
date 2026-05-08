import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "escambowebapp-production.up.railway.app",
      },
    ],
  },
};

export default nextConfig;
