// Single source of truth for navigation structure
// This config is used by both marketing and app surfaces

export interface NavigationItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: {
    label: string;
    href: string;
    icon: string;
  }[];
}

export const getNavigationConfig = (mode: 'marketing' | 'app' = 'app'): NavigationItem[] => {
  return [
    {
      label: "Home",
      href: "/",
      hasDropdown: false
    },
    {
      label: "How It Works",
      href: "/how-it-works",
      hasDropdown: false
    },
    {
      label: "Aesthetics",
      href: "/aesthetics",
      hasDropdown: false
    },
    {
      label: "Weight Management",
      href: "/weight-management",
      hasDropdown: false
    },
    {
      label: "Labs",
      href: "/lab-decoder",
      hasDropdown: false
    },
    {
      label: "Family Tree",
      href: "/vault/family-tree",
      hasDropdown: false
    },
    {
      label: "Blueprint",
      href: "/blueprint",
      hasDropdown: false
    },
    {
      label: "Sacred Vault",
      href: "/vault",
      hasDropdown: true,
      dropdownItems: [
        { label: "Vault Overview", href: "/vault", icon: "🏰" },
        { label: "Your Blueprint", href: "/blueprint", icon: "📋" },
        { label: "Family Health Tree", href: "/vault/family-tree", icon: "🌳" }
      ]
    },
    {
      label: "Pricing",
      href: "/pricing",
      hasDropdown: false
    }
  ];
};