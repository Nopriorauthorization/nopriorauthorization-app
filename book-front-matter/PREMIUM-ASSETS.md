# Premium visuals — production spec

## Path pattern (required)

Place final art next to your chapter HTML (same folder layout you use today):

```text
chapters/assets/chapter-NN/visual-SLOT.png
chapters/assets/chapter-NN/visual-SLOT.jpg
```

- **`NN`** = chapter number, **two digits** (`01` … `24`).
- **`SLOT`** = same string as `data-slot` on the placeholder, or `auto-01`, `auto-02`, … for heuristic blocks.

Examples:

- `assets/chapter-01/visual-skin-layers.png`
- `assets/chapter-06/visual-auto-01.jpg`

## Manual slot in HTML

```html
<div
  class="hg-visual-slot"
  data-slot="skin-layers"
  data-ratio="16:10"
  data-bleed="contained"
></div>
```

| Attribute | Purpose |
|-----------|---------|
| `data-slot` | Becomes filename segment `visual-{slot}.png`. |
| `data-ratio` | Shown on placeholder for designers (e.g. `3:2`, `16:10`). |
| `data-bleed` | `contained` (default) = keep type/logos inside safe margins; `full` = edge-to-edge art (see below). |

## Dimensions & resolution

| Output | Recommended source | Notes |
|--------|-------------------|--------|
| Letter body width | **2400–2550 px** wide minimum for photo/illustration | ~300 DPI across ~8" content. |
| Aspect | **3:2** or **16:10** for horizontal strips | Matches placeholder hints; taller art can use vertical crop. |
| SVG / vector | Prefer **embedded SVG** or high-res PNG export | Crisp at print. |

## Bleed modes (CSS classes)

| Class | Use when |
|-------|----------|
| `hg-visual-spread--bleed-contained` | Default. Art sits inside the text column; **safe for captions** and UI overlay. |
| `hg-visual-spread--bleed-full` | True edge-to-edge within chapter; **avoid** small type near trim; running headers may overlap top unless you keep a clear band. |

Set via `data-bleed="contained"` or `data-bleed="full"` on `.hg-visual-slot`.

## Naming convention

`visual-{slot}.{ext}` where `{slot}` matches `data-slot`, or heuristic `visual-auto-01`, etc.

## Print quality checklist

- Export **sRGB**, embedded profile optional but consistent.
- Avoid **tiny text inside raster art** (illegible in print).
- Prefer **flat or soft** glows; extreme outer glows may clip at PDF raster bounds.
