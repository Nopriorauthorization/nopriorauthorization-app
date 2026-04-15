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
  async redirects() {
    return [
      {
        source: "/micro250",
        destination: "/micro270",
        permanent: true,
      },
      {
        source: "/micro250/:path*",
        destination: "/micro270/:path*",
        permanent: true,
      },
      {
        source: "/api/micro250/chapters",
        destination: "/api/micro270/chapters",
        permanent: false,
      },
      {
        source: "/book",
        destination: "/informed-beauty-guide",
        permanent: false,
      },
      {
        source: "/shop/informed-beauty-guide",
        destination: "/informed-beauty-guide",
        permanent: false,
      },
    ];
  },
  // Allow dynamic rendering for pages that need server features
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

module.exports = nextConfig;
