
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),

  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
      src: path.resolve(__dirname, "src"),
    };
    return config;
  },

  images: {
    // Acepta hosts remotos (sirve para http y https)
    domains: [
      "books.googleusercontent.com",
      "books.google.com",
      "via.placeholder.com",
    ],
  },
};

export default nextConfig;
