/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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

module.exports = { nextConfig, output: "export" };
