# NPA audience IA — dataLayer → GTM → GA4

All events push to `window.dataLayer` as objects: `{ event: "<name>", ...parameters }`.

**GTM setup (summary):**

1. Create a **Custom Event** trigger per row below (Event name = `event` value).
2. Tag type: **Google Analytics: GA4 Event** (or GA4 Configuration + Event).
3. Map parameters to GA4 custom dimensions / event params (create in GA4 Admin → Custom definitions → Custom dimensions, **Event-scoped**).
4. **Naming:** Code still sends `source` for path entry (URL param). Duplicate **`entry_source`** is sent with the same value so GTM can map a single GA4 param (e.g. `entry_source`) without renaming in multiple tags.

---

## Event catalog

### `npa_path_entered`

| Field | Value |
|--------|--------|
| **Trigger** | Page load on `/for-students` or `/for-providers` (client `useEffect`, once). |
| **Parameters** | `audience`: `student` \| `provider`; `source` & **`entry_source`**: `home_strip` \| `nav` \| `shop_lane`; **`experiment_variant`** (optional): e.g. `h_a_ss_b_sp_a` when user arrived via homepage strip A/B (see below). |
| **GA4 mapping** | Event: `npa_path_entered`. Params: `audience`, `entry_source` (map from `entry_source`), optional `experiment_variant`. |
| **Notes** | After push, URL is cleaned via `history.replaceState` (query `source` removed). `experiment_variant` comes from `sessionStorage` set on homepage strip CTA click. |

### `npa_path_first_engagement`

| Field | Value |
|--------|--------|
| **Trigger** | First **meaningful** click on `/for-students` or `/for-providers` (one per page load). |
| **Parameters** | `audience`; `action`; optional **`experiment_variant`** (same session as path entry when applicable). |
| **GA4 mapping** | Event: `npa_path_first_engagement`. Params: `audience`, `engagement_action` (from `action`), optional `experiment_variant`. |
| **Student `action` values** | `micro270_hub`, `shop`, `anatomy_hub`, `cram`, `study_guides`, `micro270_marketing`, `resource`, `cross_provider_lane` |
| **Provider `action` values** | `growth_system`, `peek_inside`, `shop_home`, `book`, `shop_families`, `shop_link`, `cheat_sheets`, `audit`, `cross_student_lane`, `other` |

### `npa_audience_home_strip_click`

| Field | Value |
|--------|--------|
| **Trigger** | Click primary CTA on homepage audience strip. |
| **Parameters** | `audience`, `destination`, **`experiment_variant`** (e.g. `h_b_ss_a_sp_b`), **`strip_headline_variant`**, **`strip_cta_student_variant`**, **`strip_cta_provider_variant`** (`a` \| `b` each). |
| **GA4 mapping** | Event: `npa_audience_home_strip_click`. Params: `audience`, `link_url`, `experiment_variant`, optional granular strip params. |

### Homepage strip A/B (`experiment_variant`)

Persisted in **`localStorage`** (per key: headline, student CTA, provider CTA). Compact id:

`h_<a|b>_ss_<a|b>_sp_<a|b>`

Example: `h_a_ss_b_sp_a` = control headline, variant B student CTA, control provider CTA.

**Internal (do not regress without re-reading this):** The homepage audience strip is **client-only** (`dynamic(..., { ssr: false })` on the home page) so the server never emits default control copy. Assignment is **initialized in `<head>`** before paint (`getHomeStripAbInitScript()` from `src/lib/experiments/home-strip-ab.ts`, inlined in `src/app/layout.tsx`); it mirrors the same `localStorage` keys and randomization as `pickAb` and sets `window.__NPA_HOME_STRIP_VARIANTS__`. The strip’s first client render uses `readHomeStripVariants()`, which prefers that object—so **`experiment_variant` on `npa_audience_home_strip_click` is stable on first render** (no flash of control copy before assignment). **`npa_path_entered`** still gets optional `experiment_variant` from **`sessionStorage`** after a strip CTA click (unchanged contract).

**Tradeoff / future cleanup:** The head init runs on **every route** (minimal work; keys are global). Keeping it site-wide is intentional for now so `/` always sees assignment before the strip hydrates. If we later want strip keys untouched until the user visits the homepage, scope the script to a home-only layout or equivalent—**no code change needed for measurement today.**

### `npa_audience_shop_lane_click`

| Field | Value |
|--------|--------|
| **Trigger** | Click student or provider link in `/shop` lane strip. |
| **Parameters** | `audience`, `destination` (includes `?source=shop_lane`). |
| **GA4 mapping** | Event: `npa_audience_shop_lane_click`. Params: `audience`, `link_url`. |

### `npa_micro270_hub_click`

| Field | Value |
|--------|--------|
| **Trigger** | Click through to `/micro270/hub` where instrumented. |
| **Parameters** | `source`: e.g. `for-students-hero-primary`. |
| **GA4 mapping** | Event: `npa_micro270_hub_click`. Param: `click_context` (from `source`). |

### `npa_shop_click`

| Field | Value |
|--------|--------|
| **Trigger** | Click any instrumented link to `/shop` or shop product paths. |
| **Parameters** | `source`, `path`. |
| **GA4 mapping** | Event: `npa_shop_click`. Params: `click_context`, `item_path`. |

### `npa_book_click`

| Field | Value |
|--------|--------|
| **Trigger** | Click Hello Gorgeous / patient-ed card on `/for-providers`. |
| **Parameters** | `source`. |
| **GA4 mapping** | Event: `npa_book_click`. Param: `click_context`. |

---

## GA4 Exploration (funnel)

**Suggested funnel steps (custom events):**

1. `npa_path_entered`
2. `npa_path_first_engagement`
3. `npa_micro270_hub_click` **OR** `npa_shop_click` (use segment or two explorations by audience)

**Breakdown dimensions:** `audience`, `entry_source`, `experiment_variant`, `engagement_action` (on step 2+).

**CTR / strip test:** Compare `npa_audience_home_strip_click` by `experiment_variant` and by `strip_headline_variant` / CTA variants; join to downstream `npa_path_entered` via session or BigQuery if needed.

---

## Optional: GA4 custom dimensions (Event-scoped)

| Dimension name | Parameter |
|----------------|-----------|
| NPA Audience | `audience` |
| NPA Entry Source | `entry_source` |
| NPA Experiment Variant | `experiment_variant` |
| NPA Engagement Action | `action` |
| NPA Strip Headline Variant | `strip_headline_variant` |

---

## Validation checklist

- [ ] Strip click sets `sessionStorage` and path entry includes matching `experiment_variant`
- [ ] `entry_source` mirrors `source` on `npa_path_entered`
- [ ] `peek_inside` fires `npa_path_first_engagement` when that link is the first click on `/for-providers`
- [ ] GA4 Exploration: funnel with breakdown by `experiment_variant`

---

## Homepage strip A/B — manual QA

**Reset assignments (simulate first visit):** In DevTools → Application → Local Storage, remove the three keys `npa_ab_home_headline`, `npa_ab_home_cta_student`, `npa_ab_home_cta_provider` (or run `localStorage.removeItem` for each), then hard-reload `/`.

**Confirm head init ran:** In Elements, find `<script id="npa-home-strip-ab-init">`. In Console after load, `window.__NPA_HOME_STRIP_VARIANTS__` should be `{ headline, ctaStudent, ctaProvider }` with values `"a"` or `"b"`.

**Confirm UI matches storage:** Each `localStorage` value should match the same letter on `__NPA_HOME_STRIP_VARIANTS__`. Strip headline and both primary CTAs should match `HOME_STRIP_AB` in `src/config/site-audiences.config.ts` for those letters (no momentary control copy before switching).

**First visit vs returning:** After reset + load, three keys appear and persist. Reload without clearing: copy stays the same; `localStorage` is not re-randomized. Optional: land on another route first, then open `/`—assignment should still align with stored keys (init runs globally).
