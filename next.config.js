const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fabric-color-images.s3.eu-central-1.amazonaws.com'
      }
    ]
  }
};

module.exports = withNextIntl(nextConfig);
