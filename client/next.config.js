/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  images: {
    domains: [],
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: false, // Required to fix: https://nextjs.org/docs/messages/failed-loading-swc
};
