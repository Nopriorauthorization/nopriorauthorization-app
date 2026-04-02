/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://nopriorauthorization.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/admin/*", "/api/*", "/delivery/*", "/canva/*", "/etsy/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/delivery", "/canva", "/etsy"],
      },
    ],
  },
};
