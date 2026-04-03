// =============================================================================
// NAVIGATION CONFIGURATION - Single Source of Truth
// Color-coordinated with mascot themes for visual consistency
// =============================================================================

export interface DropdownItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
  color?: string; // Tailwind color class for the icon
  comingSoon?: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  color?: string; // Mascot-coordinated color
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

// Mascot color coordination mapping
const MASCOT_COLORS = {
  decode: "text-blue-400",      // Lab Decoder - Blue
  root: "text-emerald-400",     // Family Health - Green
  harmony: "text-purple-400",   // Women's Hormones - Purple
  peppi: "text-cyan-400",       // Men's Hormones/Peptides - Cyan
  slimT: "text-orange-400",     // Weight Management - Orange
  beauTox: "text-amber-400",    // Aesthetics (Botox) - Amber
  fillaGrace: "text-pink-400",  // Aesthetics (Fillers) - Pink
  vault: "text-indigo-400",     // Sacred Vault - Indigo
  blueprint: "text-violet-400", // Blueprint - Violet
};

export const getNavigationConfig = (_mode: 'marketing' | 'app' = 'app'): NavigationItem[] => {
  return [
    {
      label: "Home",
      href: "/",
      icon: "🏠",
    },
    {
      label: "Free Audit",
      href: "/audit",
      icon: "📊",
      color: "text-emerald-400",
    },
    {
      label: "Playbooks",
      href: "/shop#start-here",
      icon: "📕",
      color: "text-amber-400",
    },
    {
      label: "Cheat Sheets",
      href: "/cheat-sheets",
      icon: "📋",
      color: "text-cyan-400",
    },
    {
      label: "Ebooks",
      href: "/ebooks",
      icon: "📚",
      color: "text-rose-400",
    },
    {
      label: "Shop",
      href: "/shop",
      icon: "🛍️",
      color: MASCOT_COLORS.fillaGrace,
    },
    {
      label: "Membership",
      href: "/membership",
      icon: "⭐",
      color: "text-yellow-400",
    },
    {
      label: "About",
      href: "/about",
      icon: "👩‍⚕️",
    },
    {
      label: "Contact",
      href: "/contact",
      icon: "📬",
    },
  ];
};

// Get color for a specific mascot/domain
export const getMascotColor = (mascotId: string): string => {
  const colorMap: Record<string, string> = {
    decode: MASCOT_COLORS.decode,
    root: MASCOT_COLORS.root,
    harmony: MASCOT_COLORS.harmony,
    peppi: MASCOT_COLORS.peppi,
    "slim-t": MASCOT_COLORS.slimT,
    "beau-tox": MASCOT_COLORS.beauTox,
    "filla-grace": MASCOT_COLORS.fillaGrace,
  };
  return colorMap[mascotId] || "text-pink-400";
};
