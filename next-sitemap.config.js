/** Buyer-intent SEO landings — explicit entries so they always ship in sitemap after build */
const SEO_LANDING_PATHS = [
  "/free-templates",
  "/free-templates/downloads",
  "/custom",
  "/study-guides",
  "/nclex-bundle",
  "/botox-marketing-templates",
  "/med-spa-marketing-templates",
  "/weight-loss-marketing-templates",
  "/iv-therapy-marketing-templates",
  "/botox-instagram-templates",
  "/med-spa-consent-forms",
  "/weight-loss-intake-forms",
  "/iv-therapy-intake-form",
  "/med-spa-marketing-ideas",
  "/how-to-get-more-med-spa-clients",
  "/glp1-marketing-strategy",
  "/aesthetic-clinic-marketing",
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
