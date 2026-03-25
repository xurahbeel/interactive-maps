import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/interactive-maps',
  images: {
    unoptimized: true,
  },
  transpilePackages: ["mapbox-gl"],
};

export default nextConfig;
