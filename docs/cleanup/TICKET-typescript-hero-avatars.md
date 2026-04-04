# Cleanup ticket: TypeScript syntax errors in hero avatar content

## Scope (do not mix with funnel / shop work)

Fix parse errors only in:

- `src/content/hero/avatar-intros.ts`
- `src/content/hero/LandingPage.tsx`

These files currently break `tsc --noEmit` and should be repaired in a dedicated PR.

## Problems observed

### `avatar-intros.ts`

- The **Beau-Tox** object is not closed before the next avatar entry: after `objectPosition: "50% 20%",` the next line opens `{` for **Grace** without `},`.
- The **Grace** block appears corrupted: duplicate `id: "f-ill"` keys and merged structure (lines ~53–60+).

**Fix direction:** Close the Beau-Tox object with `},`, then define a single valid `AvatarIntro` for Filla-Grace / `f-ill` with one `id`, `introParts`, `poster`, etc.

### `LandingPage.tsx`

- The **Beau-Tox** mascot object in the `mascots` array is missing the closing `},` before the next `{`.
- The **Filla-Grace** entry is duplicated (two consecutive objects with overlapping fields).

**Fix direction:** Restore valid array syntax: one closed object per mascot, no duplicate `filla-grace` blocks.

## Acceptance criteria

- `npx tsc --noEmit` passes with no errors in these two files (or full project if other errors are resolved separately).
- No behavioral change to funnel, checkout, or shop routes unless hero is actually used on a shipping page (verify callers before changing copy).

## Out of scope

- Growth System / membership funnel
- `growth-funnel.config.ts`, shop catalog, analytics

## Estimate

Small (syntax + dedupe); add regression check if any page imports these modules.
