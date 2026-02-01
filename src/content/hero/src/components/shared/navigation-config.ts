export interface NavigationItem {
  label: string;
  href: string;
}

export function getNavigationConfig(mode: "marketing" | "app" = "marketing"): NavigationItem[] {
  const baseItems: NavigationItem[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Vault", href: "/vault" },
    { label: "Aesthetics", href: "/aesthetics" },
    { label: "Weight Management", href: "/weight-management" },
    { label: "Hormones & Peptides", href: "/hormones" },
    { label: "Experts", href: "/experts" },
    { label: "Chat", href: "/chat" },
  ];

  if (mode === "app") {
    return baseItems;
  }

  return baseItems;
}
