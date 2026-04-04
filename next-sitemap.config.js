/** Buyer-intent SEO landings — explicit entries so they always ship in sitemap after build */
const SEO_LANDING_PATHS = [
  "/botox-marketing-templates",
  "/med-spa-marketing-templates",
  "/weight-loss-marketing-templates",
  "/iv-therapy-marketing-templates",
];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://nopriorauthorization.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/admin/*", "/api/*", "/delivery/*", "/canva/*", "/etsy/*"],
  additionalPaths: async (config) => {
    const out = [];
    for (const loc of SEO_LANDING_PATHS) {
      const entry = await config.transform(config, loc);
      out.push({ ...entry, changefreq: "weekly", priority: 0.85 });
    }
    return out;
  },
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
