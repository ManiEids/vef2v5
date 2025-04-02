// F: Next.js stilling
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.datocms-assets.com', pathname: '**' },
    ],
    domains: ['www.datocms-assets.com'],
  },
};
module.exports = nextConfig;
