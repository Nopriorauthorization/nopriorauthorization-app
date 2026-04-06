/**
 * HTML that must stay in public/forms/ (marketing embeds, free tools).
 * Everything else lives in delivery-assets/forms/ and is served only via token
 * (buyers) or admin API (internal).
 */
export const FREE_PUBLIC_FORM_PATHS = [
  "/forms/NPA-Digital-Audit.html",
  "/forms/NPA-Pro-Membership.html",
  "/forms/NPA-Ebook-Collection.html",
  "/forms/NPA-Contact-About.html",
  "/forms/NPA-Free-Treatment-Guide-Cheat-Sheet.html",
] as const;

export const FREE_PUBLIC_FORM_SET = new Set<string>(FREE_PUBLIC_FORM_PATHS);
