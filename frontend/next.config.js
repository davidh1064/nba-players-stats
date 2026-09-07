/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // `images.domains` is deprecated and removed in Next.js 16.
    // `remotePatterns` is the supported form and is stricter: it pins the
    // protocol as well as the host. Same allowlist as before.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.nba.com",
      },
    ],
  },
};

module.exports = nextConfig;
