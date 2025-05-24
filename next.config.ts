import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: "loose",
  },
  /* config options here */
  images: {
    loader: "default",
    remotePatterns: [
      {
        hostname: "7yzrxbvb5k.ufs.sh",
        port: "",
        protocol: "https",
      },
    ],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
