/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  trailingSlash: false,
  // Allow dynamic rendering for pages that need server features
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

module.exports = nextConfig;
