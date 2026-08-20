# Project Curse image provenance registry

This registry supplements `ASSET_POLICY.md`. It records project-added derivatives without changing or replacing protected source records.

| Asset | Class | Used by | Source and handling | Required public label |
|---|---|---|---|---|
| `derived/great-black-forest_reconstructed-v1.png` | RECONSTRUCTED | `Great_Black_Forest_Region` | Generated for this project from the Great Black Forest setting brief; no user original existed for this scene. The image is additive and does not replace protected Cults or Immortality media. | `복원 추정본` |
| `derived/dead-zone-pilgrimage_reconstructed-v1.png` | RECONSTRUCTED | `Dead_Zone_Pilgrimage` | Generated for this project from the Dead Zone pilgrimage brief; no user original existed for this scene. The image is additive and does not replace protected Cults or Immortality media. | `복원 추정본` |

Generation mode: built-in image generation. Creation date: 2026-08-16. Both images intentionally contain no logos, watermarks, readable text, or direct depictions of protected archive originals.

Originals under `assets/resources/` and `assets/resources/archive-enex/` retain their existing provenance. Do not infer RECONSTRUCTED status for those files from this registry.

## Visual evidence comparison links

| Evidence ID | Primary asset | Class | Comparison | Relationship |
|---|---|---|---|---|
| `VEA-GBF-R01` | `derived/great-black-forest_reconstructed-v1.png` | RECONSTRUCTED | Not registered | Original source image is currently missing |
| `VEA-DZ-R01` | `derived/dead-zone-pilgrimage_reconstructed-v1.png` | RECONSTRUCTED | Not registered | Original source image is currently missing |
| `VEA-FER-CLS-A` | `8bb53a89c3baf48d8e3ac2b180f80d0b.webp` | UNVERIFIED | `archive-enex/feral-classification/114223e8cf8c8ea96c6d4ffca6cae2ce.webp` | Duplicate source check |
| `VEA-FER-CLS-B` | `archive-enex/feral-classification/114223e8cf8c8ea96c6d4ffca6cae2ce.webp` | ORIGINAL | `8bb53a89c3baf48d8e3ac2b180f80d0b.webp` | Duplicate source check |
| `VEA-FER-241HS` | `archive-enex/feral-classification/image-241hs-angel-presence.png` | ORIGINAL | `83d311da1ab7310a567c6023f6151e6c.webp` | Source frame to protected legacy crop |

Comparison links do not authorize deletion or replacement. They only expose both preserved files in the Visual Evidence Archive viewer so that a later source review can decide which copy should be displayed by default.

## Faction mark interface assets

The following SVG files are code-authored INTERFACE assets. They are visual identity masters for the intelligence interface, not photographed evidence and not reconstructions of protected archive imagery. Legacy WebP marks remain available as fallbacks and historical design references.

| Asset | Class | Faction | Handling |
|---|---|---|---|
| `../faction_marks/sid.svg` | INTERFACE | S.I.D | New double-lens evidence frame; legacy eagle WebP retained |
| `../faction_marks/syndicate.svg` | INTERFACE | S.O.N | New broken-containment common mark; legacy skull WebP retained |
| `../faction_marks/ushinoda.svg` | INTERFACE | Ushinoda | Field-reconstructed common ritual geometry; not presented as a verified official seal |
| `../faction_marks/haimun.svg` | INTERFACE | P.O.H | New covert logistics code; legacy fist WebP retained |

Design and authentication metadata are owned by `assets/js/data/faction-mark-registry.js`. These marks may be used in faction dossiers, maps and timelines, but their interface role must not be relabeled as ORIGINAL evidence.

## Responsive delivery derivatives

`responsive/` contains 40 WebP delivery copies generated on 2026-08-17 from 20 high-cost PNG or JPEG files. Each source has a 480px candidate and either a 960px candidate or a no-upscale candidate at its native width. The measured source set was 14.40 MiB; the complete responsive set is approximately 0.55 MiB.

These files do not replace, reclassify, or authorize removal of their sources. `assets/js/data/media-manifest.js` is the delivery relationship registry. Archive cards, document figures, and cinematic frames may use these candidates; the Visual Evidence Archive requests the preserved source file for original inspection and comparison.
