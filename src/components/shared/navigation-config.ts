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
      label: "Nursing Study",
      href: "/micro270",
      icon: "🧫",
      color: "text-teal-400",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Complete Microbiology ($79)",
          href: "/shop/micro270-complete-microbiology",
          icon: "✅",
          description: "PDF + hub + printables + unlimited AI cram — one checkout",
          color: "text-emerald-300",
        },
        {
          label: "Micro270 Study Hub",
          href: "/micro270",
          icon: "🧫",
          description: "1,000 questions · 20 chapters · free preview",
          color: "text-teal-400",
        },
        {
          label: "A&P Study Hub",
          href: "/nursing-study/anatomy",
          icon: "🫀",
          description: "Cheat sheets · quizzes · flashcards · logged-in",
          color: "text-pink-400",
        },
        {
          label: "AI Cram Tool",
          href: "/micro270/cram",
          icon: "🤖",
          description: "Paste your notes → get 15 exam questions",
          color: "text-indigo-400",
        },
        {
          label: "Buy Micro270 Bank",
          href: "/shop/micro270-question-bank",
          icon: "🛒",
          description: "$47 · bank only (no PDF bundle)",
          color: "text-emerald-400",
        },
        {
          label: "Chapter cheat sheets ($9.99)",
          href: "/shop/micro270-chapter-cheat-sheets",
          icon: "📄",
          description: "Printable all-chapter pack · upgrade to bank anytime",
          color: "text-amber-300",
        },
        {
          label: "NCLEX Study Bundle",
          href: "/study-guides",
          icon: "📋",
          description: "8 HTML cheat sheets · $49",
          color: "text-sky-400",
        },
      ],
    },
    {
      label: "Ebooks",
      href: "/ebooks",
      icon: "📚",
      color: "text-rose-400",
    },
    {
      label: "Free resources",
      href: "/shop/resources",
      icon: "✨",
      color: MASCOT_COLORS.fillaGrace,
    },
    {
      label: "Shop",
      href: "/shop",
      icon: "🛍️",
      color: MASCOT_COLORS.fillaGrace,
    },
    {
      label: "Etsy shop",
      href: "/etsy",
      icon: "🧵",
      color: "text-orange-300",
    },
    {
      label: "Custom build",
      href: "/custom",
      icon: "📐",
      color: "text-rose-400",
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
