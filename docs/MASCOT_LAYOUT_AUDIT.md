# Mascot Layout Consistency Audit

**Date:** January 27, 2026  
**Branch:** `cursor/mascot-layout-consistency-audit-440a`  
**Status:** ✅ IMPLEMENTED

## Executive Summary

This audit identified all pages where mascots appear, documented the layout patterns in use, pinpointed inconsistencies, and recommended a canonical layout component for standardization.

### Implementation Complete

The following changes have been implemented:

1. **Created `MascotDomainShell`** - Canonical mascot layout component at `src/components/mascots/MascotDomainShell.tsx`
2. **Fixed color theming** - Static `MASCOT_THEMES` map replaces broken dynamic Tailwind classes
3. **Consolidated mascot data** - Single source of truth at `src/lib/mascots.ts`
4. **Refactored all domain pages** - `/aesthetics`, `/weight-management`, `/hormones`, `/family-health`, `/vault/lab-decoder`
5. **Standardized chat navigation** - All pages use `/chat?mascot=X&source=Y` format
6. **Deleted obsolete files** - Removed `VaultStyleMascotSection.tsx` and root-level `mascots.ts`

---

## 1. Pages Where Mascots Appear

### 1.1 Primary Mascot Domain Pages

| Page | Route | Mascot(s) | Layout Pattern |
|------|-------|-----------|----------------|
| Mascots Overview | `/mascots` | All (Beau-Tox, Peppi, Filla-Grace, Harmony) | Custom grid with video cards |
| Aesthetics | `/aesthetics` | Beau-Tox, Filla-Grace | Custom dual-card side-by-side |
| Weight Management | `/weight-management` | Slim-T | Custom hero (video left, text right) |
| Hormones & Peptides | `/hormones` | Harmony, Peppi | `VaultStyleMascotSection` ✓ |
| Family Health | `/family-health` | Root | `VaultStyleMascotSection` ✓ |
| Lab Decoder | `/vault/lab-decoder` | Decode | `VaultStyleMascotSection` ✓ |
| Family Tree | `/vault/family-tree` | Root | `InteractiveRoot` (full-page app) |
| Treatment Decoder | `/vault/decoder` | (Decode implied) | Tool interface (no mascot hero) |

### 1.2 Listing/Grid Pages

| Page | Route | Mascots | Layout Pattern |
|------|-------|---------|----------------|
| Homepage | `/` | All (via teaser) | `SpecialistsTeaser` component |
| Experts Dashboard | `/(dashboard)/experts` | All | Grid of `Card` components |

### 1.3 Supporting Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `VaultStyleMascotSection` | `src/content/hero/src/components/mascots/` | Full-featured mascot hero section |
| `MascotCard` | `src/components/mascots/` | Individual mascot card with video |
| `MascotDomainCard` | `src/content/hero/src/components/mascots/` | Domain-specific mascot card |
| `SpecialistsTeaser` | `src/components/mascots/` | Homepage teaser grid |
| `MascotsSection` | `src/components/home/` | Full mascots grid section |

---

## 2. Layout Pattern Analysis

### 2.1 Pattern A: VaultStyleMascotSection (Used by 3 pages)

**Files using this pattern:**
- `/src/app/family-health/page.tsx`
- `/src/app/hormones/page.tsx`
- `/src/app/vault/lab-decoder/page.tsx`

**Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Gradient Background Container]                              │
│ ┌──────────────────────────┐ ┌────────────────────────────┐ │
│ │ LEFT COLUMN              │ │ RIGHT COLUMN               │ │
│ │ - Icon + Name + Tagline  │ │ - Mascot Image             │ │
│ │ - Description            │ │ - Domain Badge             │ │
│ │ - 4 Feature Cards        │ │ - Decorative Elements      │ │
│ │ - Action Buttons         │ └────────────────────────────┘ │
│ │ - CTA Link               │                                │
│ └──────────────────────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

**Props:**
- `mascotId`, `displayName`, `tagline`, `description`
- `imageSrc`, `videoSrc`, `chatPersona`
- `features[]` (icon, title, description)
- `ctaText`, `ctaHref`, `source`
- `primaryColor`, `secondaryColor`, `accentColor`

### 2.2 Pattern B: Custom Dual-Card Layout (Used by 1 page)

**File:** `/src/app/aesthetics/page.tsx`

**Structure:**
```
┌──────────────────────────────────────────────────────────────┐
│ [Page Header - Title + Description]                           │
│ ┌────────────────────────┐  ┌────────────────────────────┐   │
│ │ BEAU-TOX CARD          │  │ FILLA-GRACE CARD           │   │
│ │ - Video with controls  │  │ - Video with controls      │   │
│ │ - Status text          │  │ - Status text              │   │
│ │ - Learn button         │  │ - Learn button             │   │
│ │ - Ask button           │  │ - Ask button               │   │
│ └────────────────────────┘  └────────────────────────────┘   │
│ [Tab-based Education Section]                                 │
│ [Safety Callout]                                              │
│ [CTA Section]                                                 │
└──────────────────────────────────────────────────────────────┘
```

### 2.3 Pattern C: Hero Split Layout (Used by 1 page)

**File:** `/src/app/weight-management/page.tsx`

**Structure:**
```
┌──────────────────────────────────────────────────────────────┐
│ ┌────────────────────────┐  ┌────────────────────────────┐   │
│ │ VIDEO COLUMN           │  │ TEXT COLUMN                │   │
│ │ - Video element        │  │ - Title                    │   │
│ │ - Play/Stop controls   │  │ - Description paragraphs   │   │
│ │ - Mute button          │  │ - CTA Buttons              │   │
│ │ - Status text          │  │                            │   │
│ └────────────────────────┘  └────────────────────────────┘   │
│ [Tab-based Content Section]                                   │
│ [Safety Callout]                                              │
│ [CTA Section]                                                 │
└──────────────────────────────────────────────────────────────┘
```

### 2.4 Pattern D: Grid Overview (Used by 1 page)

**File:** `/src/app/mascots/page.tsx`

**Structure:**
```
┌──────────────────────────────────────────────────────────────┐
│ [Header with navigation]                                      │
│ [Hero Section with title + CTA]                               │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐                 │
│ │ Card 1     │ │ Card 2     │ │ Card 3     │                 │
│ │ - Video    │ │ - Video    │ │ - Video    │   ...           │
│ │ - Info     │ │ - Info     │ │ - Info     │                 │
│ │ - Buttons  │ │ - Buttons  │ │ - Buttons  │                 │
│ └────────────┘ └────────────┘ └────────────┘                 │
│ [CTA Section]                                                 │
│ [Modal for Detail View]                                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Identified Inconsistencies

### 3.1 Structural Inconsistencies

| Issue | Impact | Pages Affected |
|-------|--------|----------------|
| Different hero layouts per domain | Confusing UX, harder maintenance | All domain pages |
| Video placement varies (hidden vs visible) | Inconsistent interaction patterns | All pages with video |
| Feature cards vs tabs vs lists | Different content organization | All domain pages |
| CTA button placement varies | Unpredictable user flow | All pages |

### 3.2 Video Handling Inconsistencies

| Approach | Pages |
|----------|-------|
| Hidden video with audio playback | `/hormones`, `/family-health`, `/vault/lab-decoder` |
| Visible video with overlay play button | `/mascots` |
| Visible video with separate controls | `/aesthetics`, `/weight-management` |
| Modal video player | `/vault/family-tree` (InteractiveRoot) |

### 3.3 Navigation Parameter Inconsistencies

| Pattern | Usage |
|---------|-------|
| `/chat?persona=X&source=Y` | VaultStyleMascotSection, MascotDomainCard |
| `/chat?mascot=X` | MascotsSection, Experts page |
| `localStorage + redirect` | `/mascots` page |

### 3.4 Data Source Duplication

| File | Location | Issue |
|------|----------|-------|
| `mascots.ts` | `/workspace/mascots.ts` | Root level, includes lab-decoder & root |
| `mascots.ts` | `/workspace/src/lib/mascots.ts` | Lib folder, missing lab-decoder & root |
| Inline definitions | Various pages | Mascot data duplicated in page components |

### 3.5 Color Theming Problems

**Issue:** `VaultStyleMascotSection` uses dynamic Tailwind classes that won't work:
```tsx
// THIS DOESN'T WORK - Tailwind purges dynamic classes
className={`from-${primaryColor}-500 via-${secondaryColor}-500`}
```

**Result:** Colors don't render correctly because Tailwind CSS purges unused classes at build time.

---

## 4. Gold Standard Recommendation

### 4.1 Recommended Component: VaultStyleMascotSection

**Location:** `src/content/hero/src/components/mascots/VaultStyleMascotSection.tsx`

**Why this is the best candidate:**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Flexibility | ✅ | Props cover all mascot variations |
| Video Integration | ✅ | Uses mediaController, supports play/stop |
| Feature Display | ✅ | 4-feature grid with icons |
| CTA Pattern | ✅ | Learn + Ask + Link buttons |
| Responsive | ✅ | Grid → Stack on mobile |
| Animations | ✅ | Framer Motion integration |
| Accessibility | ⚠️ | Needs ARIA improvements |

### 4.2 Required Fixes for Gold Standard

Before using as canonical layout, fix these issues:

#### Fix 1: Replace Dynamic Tailwind Classes
```tsx
// BEFORE (broken)
className={`from-${primaryColor}-500`}

// AFTER (working - use variant maps)
const colorVariants = {
  emerald: 'from-emerald-500 via-emerald-600 to-teal-500',
  blue: 'from-blue-500 via-indigo-500 to-purple-500',
  red: 'from-red-500 via-orange-500 to-amber-500',
  pink: 'from-pink-500 via-rose-500 to-purple-500',
  // ... one per mascot
};
```

#### Fix 2: Derive Colors from MascotId
```tsx
// Create mascot-specific color mapping
const MASCOT_COLORS: Record<MascotId, ColorConfig> = {
  'root': { primary: 'emerald', secondary: 'green', accent: 'teal' },
  'decode': { primary: 'blue', secondary: 'indigo', accent: 'purple' },
  'slim-t': { primary: 'red', secondary: 'orange', accent: 'amber' },
  'beau-tox': { primary: 'pink', secondary: 'rose', accent: 'fuchsia' },
  'filla-grace': { primary: 'pink', secondary: 'purple', accent: 'violet' },
  'harmony': { primary: 'purple', secondary: 'violet', accent: 'indigo' },
  'peppi': { primary: 'cyan', secondary: 'blue', accent: 'teal' },
};
```

#### Fix 3: Add Visible Video Option
```tsx
// Add prop for video visibility
showVideo?: boolean; // default: false (hidden)
videoPoster?: string;
```

#### Fix 4: Standardize Chat Navigation
```tsx
// Use consistent parameter pattern
const onAsk = () => {
  router.push(`/chat?mascot=${mascotId}&source=${source || mascotId}`);
};
```

#### Fix 5: Move to Proper Location
```
CURRENT:  src/content/hero/src/components/mascots/VaultStyleMascotSection.tsx
PROPOSED: src/components/mascots/MascotHeroSection.tsx
```

---

## 5. Refactoring Plan

### Phase 1: Prepare Canonical Component

1. Copy `VaultStyleMascotSection` → `src/components/mascots/MascotHeroSection.tsx`
2. Fix color theming with variant maps
3. Add `showVideo` prop for visible video mode
4. Standardize navigation parameters
5. Update prop interface (remove color props, add variants)

### Phase 2: Refactor Domain Pages

| Page | Current | Action |
|------|---------|--------|
| `/family-health` | VaultStyleMascotSection | Update import path, remove color props |
| `/hormones` | VaultStyleMascotSection | Update import path, remove color props |
| `/vault/lab-decoder` | VaultStyleMascotSection | Update import path, remove color props |
| `/aesthetics` | Custom dual layout | Refactor to 2x MascotHeroSection |
| `/weight-management` | Custom hero | Refactor to MascotHeroSection with `showVideo: true` |
| `/mascots` | Custom grid | Keep as overview, but use MascotCard consistently |

### Phase 3: Consolidate Data

1. Merge `/mascots.ts` and `/src/lib/mascots.ts`
2. Add missing mascots (lab-decoder, root) to lib version
3. Delete root-level file
4. Update all imports

### Phase 4: Test & Verify

1. Visual regression testing on all mascot pages
2. Verify video playback on all pages
3. Verify chat navigation works consistently
4. Check mobile responsiveness

---

## 6. Component Specification: MascotHeroSection

### Proposed Props Interface

```typescript
interface MascotHeroSectionProps {
  // Required
  mascotId: MascotId;
  displayName: string;
  tagline: string;
  description: string;
  
  // Media
  imageSrc: string;
  videoSrc?: string;
  videoPoster?: string;
  showVideo?: boolean; // default: false
  
  // Features (max 4)
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  
  // Navigation
  ctaText: string;
  ctaHref: string;
  source?: string;
  
  // Optional
  chatPersona?: string; // defaults to mascotId
  className?: string;
}
```

### Color Variants (Auto-derived from mascotId)

```typescript
const MASCOT_THEMES = {
  'root': {
    gradient: 'from-emerald-500/10 via-green-500/5 to-teal-500/10',
    border: 'border-emerald-500/30',
    button: 'from-emerald-500 to-green-500',
    accent: 'text-emerald-400',
  },
  'decode': {
    gradient: 'from-blue-500/10 via-indigo-500/5 to-purple-500/10',
    border: 'border-blue-500/30',
    button: 'from-blue-500 to-indigo-500',
    accent: 'text-blue-400',
  },
  // ... etc
};
```

---

## 7. Files to Modify

### New Files
- `src/components/mascots/MascotHeroSection.tsx` (canonical component)
- `src/components/mascots/mascot-themes.ts` (color variants)

### Modified Files
- `src/app/family-health/page.tsx`
- `src/app/hormones/page.tsx`
- `src/app/vault/lab-decoder/page.tsx`
- `src/app/aesthetics/page.tsx`
- `src/app/weight-management/page.tsx`
- `src/lib/mascots.ts` (consolidate data)

### Deleted Files (after migration)
- `/mascots.ts` (root level duplicate)
- `src/content/hero/src/components/mascots/VaultStyleMascotSection.tsx` (moved)

---

## 8. Summary

**Current State:** 5+ different mascot layout patterns across 8+ pages, with duplicated data sources and broken color theming.

**Target State:** 1 canonical `MascotHeroSection` component used consistently across all mascot domain pages, with auto-derived theming and consolidated mascot data.

**Estimated Impact:**
- ~50% reduction in mascot-related code
- Consistent UX across all mascot pages
- Easier maintenance and feature additions
- Proper Tailwind CSS compatibility

---

*This audit was generated to support the standardization of mascot layouts across the No Prior Authorization platform.*
