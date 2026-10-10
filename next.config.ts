import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/shops/dashboard",
        destination: "/shopkeeper/dashboard",
        permanent: false,
      },
      {
        source: "/shops/marketnera.com",
        destination: "/shops",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
