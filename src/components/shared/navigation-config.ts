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
    comingSoon?: boolean;
    marketingOnly?: boolean; // Only show on marketing site
    appOnly?: boolean; // Only show in app
  }[];
}

export const getNavigationConfig = (mode: 'marketing' | 'app' = 'app'): NavigationItem[] => {
  const baseNavigation: NavigationItem[] = [
    {
      label: "Home",
      href: "/",
      hasDropdown: false
    },
    {
      label: "Sacred Vault",
      href: "/vault",
      hasDropdown: true,
      dropdownItems: [
        { label: "Sacred Vault", href: "/vault", icon: "🏰" },
        { label: "Personal Documents Vault", href: "/vault/personal-documents", icon: "📄" },
        { label: "Rich Health Timeline", href: "/rich-health-timeline", icon: "📅" },
        { label: "Family Health Tree", href: "/vault/family-tree", icon: "🌳" },
        { label: "Provider Data Sharing", href: "/vault/provider-portal", icon: "🔐" },
        { label: "Interactive Lab Decoder", href: "/lab-decoder", icon: "🔍" },
        { label: "AI Health Insights", href: "/vault/ai-insights", icon: "🧠", comingSoon: true }
      ]
    },
    {
      label: "Family Health Tree",
      href: "/vault/family-tree",
      hasDropdown: false
    },
    {
      label: "AI Concierge",
      href: "/ai-concierge",
      hasDropdown: true,
      dropdownItems: [
        { label: "AI Concierge", href: "/ai-concierge", icon: "🤖" },
        { label: "Chat with Expert Mascots", href: "/chat", icon: "💬" }
      ]
    },
    {
      label: "Health Tools",
      href: "/hormone-tracker",
      hasDropdown: true,
      dropdownItems: [
        { label: "Family Health Hub", href: "/vault", icon: "🌳" },
        { label: "Hormone Tracker", href: "/hormone-tracker", icon: "🌸" },
        { label: "Health Decoder", href: "/vault/decoder", icon: "🏥" },
        { label: "Life Changing Diagnosis", href: "/vault/priority", icon: "🛡️" }
      ]
    },
    {
      label: "Blueprint",
      href: "/blueprint",
      hasDropdown: true,
      dropdownItems: [
        { label: "My Blueprint", href: "/blueprint", icon: "📋" },
        { label: "Treatment Plans", href: "/blueprint", icon: "💊" },
        { label: "Recommendations", href: "/blueprint", icon: "💡" }
      ]
    },
    {
      label: "Providers",
      href: "/provider-packet-interactive",
      hasDropdown: true,
      dropdownItems: [
        { label: "Provider Packet", href: "/provider-packet-interactive", icon: "📋" },
        { label: "Provider Resources", href: "/provider-packet-interactive", icon: "📚" }
      ]
    }
  ];

  // Filter navigation items based on mode
  return baseNavigation.map(item => ({
    ...item,
    dropdownItems: item.dropdownItems?.filter(dropdownItem => {
      if (mode === 'marketing' && dropdownItem.appOnly) return false;
      if (mode === 'app' && dropdownItem.marketingOnly) return false;
      return true;
    })
  }));
};