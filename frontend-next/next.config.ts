import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
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
