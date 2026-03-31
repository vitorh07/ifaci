import path from "path";
import type { NextConfig } from "next";

const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
} as NextConfig;

export default nextConfig;
