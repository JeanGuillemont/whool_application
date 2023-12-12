/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
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

module.exports = nextConfig;
