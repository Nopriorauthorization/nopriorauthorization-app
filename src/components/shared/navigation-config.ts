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

export const getNavigationConfig = (mode: 'marketing' | 'app' = 'app'): NavigationItem[] => {
  return [
    {
      label: "Home",
      href: "/",
      icon: "🏠",
    },
    {
      label: "Hormones & Peptides",
      href: "/hormones",
      icon: "🧬",
      color: MASCOT_COLORS.harmony,
    },
    {
      label: "Aesthetics",
      href: "/aesthetics",
      icon: "✨",
      color: MASCOT_COLORS.beauTox,
    },
    {
      label: "Weight Management",
      href: "/weight-management",
      icon: "⚖️",
      color: MASCOT_COLORS.slimT,
    },
    {
      label: "Lab Decoder",
      href: "/vault/lab-decoder",
      icon: "🔬",
      color: MASCOT_COLORS.decode,
    },
    {
      label: "Medication Decoder",
      href: "/vault/medications",
      icon: "💊",
      color: MASCOT_COLORS.harmony,
    },
    {
      label: "Family Health",
      href: "/family-health",
      icon: "🌳",
      color: MASCOT_COLORS.root,
    },
    {
      label: "Sacred Vault",
      href: "/vault",
      icon: "🏰",
      color: MASCOT_COLORS.vault,
      hasDropdown: true,
      dropdownItems: [
        { 
          label: "Vault Dashboard", 
          href: "/vault/dashboard", 
          icon: "📊",
          color: MASCOT_COLORS.vault,
          description: "Your health command center"
        },
        { 
          label: "Documents", 
          href: "/vault/documents", 
          icon: "📄",
          color: MASCOT_COLORS.vault,
          description: "All your health records"
        },
        { 
          label: "Personal Vault", 
          href: "/vault/personal-documents", 
          icon: "🔐",
          color: MASCOT_COLORS.vault,
          description: "IDs, insurance, birth certificates"
        },
        { 
          label: "Lab Results", 
          href: "/vault/labs", 
          icon: "🧪",
          color: MASCOT_COLORS.decode,
          description: "All your lab work in one place"
        },
        { 
          label: "Medication Decoder", 
          href: "/vault/medications", 
          icon: "💊",
          color: MASCOT_COLORS.harmony,
          description: "Understand your medications safely"
        },
        { 
          label: "Family Tree", 
          href: "/vault/family-tree", 
          icon: "🌳",
          color: MASCOT_COLORS.root,
          description: "Your family health history"
        },
        { 
          label: "Health Tools", 
          href: "/vault/tools", 
          icon: "🛠️",
          color: MASCOT_COLORS.blueprint,
          description: "Calculators and trackers"
        },
        { 
          label: "Trusted Circle", 
          href: "/vault/trusted-circle", 
          icon: "👥",
          color: "text-green-400",
          description: "Share with family & providers"
        },
      ]
    },
    {
      label: "Blueprint",
      href: "/blueprint",
      icon: "📋",
      color: MASCOT_COLORS.blueprint,
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
