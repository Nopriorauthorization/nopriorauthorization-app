# Premium control matrix (quick reference)

## Modes

| Mode | Cinematic first `.ch-h2` | Keyword heuristic placeholders | Manual `.hg-visual-slot` | Danielle stamp | JSON finale block |
|------|----------------------------|--------------------------------|---------------------------|----------------|-------------------|
| **`HG_PREMIUM=off`** | — | — | — | — | — |
| **`HG_PREMIUM=light`** (default) | Part openers **1, 5, 9, 13, 15, 19** only (`part`) | **Off by default** (markers-only unless body sets `heuristic` — then max **2**) | Filled when premium on & `data-premium-visuals` not `off` | On (unless `data-premium-stamp="off"`) | On (unless `data-premium-finale="off"`) |
| **`HG_PREMIUM=full`** | Same default `part` | **On** unless body says `markers` / `off` — max **3** keyword inserts | Same as light | Same | Same |

## Body attributes — what each disables or overrides

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-premium` | `off` | **Disables entire premium pass** for this file (wins over env). |
| | `light` / `full` | Sets **chapter mode** for merges below (overrides `HG_PREMIUM` for this file). |
| `data-premium-cinematic` | `off` | No cinematic styling on any first `.ch-h2`. |
| | `part` | Cinematic first H2 on Part openers only (same six chapters as default). |
| | `all` | Cinematic first H2 on **every** chapter. |
| `data-premium-visuals` | `off` | No placeholder fills: **no** manual slot shells, **no** heuristics. |
| | `markers` | **Only** empty `.hg-visual-slot` → placeholders (no keyword heuristics). |
| | `heuristic` | Slots + keyword-based inserts (subject to mode cap). |
| `data-premium-stamp` | `off` | No auto “From Danielle” stamp after contra/ask. |
| `data-premium-stamp-variant` | `0` / `1` / `2` | **Ribbon** / **minimal** / **inset** Danielle stamp (when stamp on). |
| `data-premium-finale` | `off` | No closing `hg-chapter-finale` block from JSON. |

## Precedence (env vs body)

1. **`HG_PREMIUM=off`** → premium inactive for **all** chapters (body cannot re-enable).
2. Else **`data-premium="off"`** on `<body>` → inactive for **that** chapter only.
3. Else **chapter mode** = `data-premium` (`light` / `full`) if set, otherwise **`HG_PREMIUM`** (`light` / `full`).
4. **Cinematic / visuals / stamp / finale** use explicit `data-premium-*` when present; otherwise defaults from mode (see table above: light → markers-only visuals; full → heuristic allowed).

## Typography note

Chapter PDFs also receive **`print-luxury-typography.css`** (body column: ~11.25pt, tuned line height). See **PREMIUM-CONTROL.md** for build flags.
