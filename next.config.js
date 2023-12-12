/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "remote-image.decentralized-content.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
