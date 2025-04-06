/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Optional: Keep if you want strict mode
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '', // Keep empty for default ports (80/443)
        pathname: '/images/**', // Allow images from any Sanity project/dataset
      },
    ],
  },
};

module.exports = nextConfig; 