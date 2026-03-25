import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export",
  /** GitHub Pages is served under /interactive-maps; dev uses site root so / works locally */
  ...(!isDev && { basePath: "/interactive-maps" }),
  images: {
    unoptimized: true,
  },
  transpilePackages: ["mapbox-gl"],
};

export default nextConfig;
