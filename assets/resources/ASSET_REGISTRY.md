# Project Curse image provenance registry

This registry supplements `ASSET_POLICY.md`. It records project-added derivatives without changing or replacing protected source records.

## 5.42 release-audit integration

The complete published media inventory is generated in `assets/js/data/media-provenance-data.js` from the repository file set and `MEDIA_PROVENANCE_OVERRIDES.json`. The generated ledger is rebuilt whenever a public asset is added; the current count is reported by the public media-audit channel.

Evidence provenance and release permission are separate. An `ORIGINAL` Archive ENEX source remains `SOURCE_REVIEW` until its public redistribution scope is documented. Existing audio and video files remain `LICENSE_REVIEW`; their filenames and prior use do not establish authorship or permission. The public archive audit reports this open state instead of presenting registration as clearance.

| Asset | Class | Used by | Source and handling | Required public label |
|---|---|---|---|---|
| `derived/great-black-forest_reconstructed-v1.png` | RECONSTRUCTED | `Great_Black_Forest_Region` | Generated for this project from the Great Black Forest setting brief; no user original existed for this scene. The image is additive and does not replace protected Cults or Immortality media. | `복원 추정본` |
| `derived/dead-zone-pilgrimage_reconstructed-v1.png` | RECONSTRUCTED | `Dead_Zone_Pilgrimage` | Generated for this project from the Dead Zone pilgrimage brief; no user original existed for this scene. The image is additive and does not replace protected Cults or Immortality media. | `복원 추정본` |
| `derived/project-curse-world-keyart-concept-v1.png` | RECONSTRUCTED | Terminal home | Editorial orientation key art combining the Great Black Forest and Dead Zone channels. It is not an event image or map source. | `편집 키아트 / 사건 원본 아님` |
| `derived/great-black-forest-unlit-fortress-bell-concept-v1.png` | RECONSTRUCTED | `Great_Black_Forest_Region` | Interpretive reconstruction combining separate witness descriptions of a covered bell and an unlit fortress. | `해석 재구성 / 특정 성채 원본 아님` |
| `derived/checkpoint-07-five-thermal-concept-v1.png` | RECONSTRUCTED | `Dead_Zone_Pilgrimage` | Interpretive reconstruction of the four-returners/five-signatures discrepancy. The fifth signature is not identified. | `해석 재구성 / 신호 정체 미확정` |
| `derived/broken-crown-erased-commander-concept-v1.png` | RECONSTRUCTED | `Operation_Broken_Crown` | Symbolic reconstruction of an erased commander identity and conflicting order copies. | `해석 재구성 / 명령 진위 미확정` |
| `derived/first-apostle-three-traces-reconstruction-concept-v1.png` | RECONSTRUCTED | First Apostle dossier | Three reported power traces composited into one analytical figure. It does not establish appearance, identity or a single entity. | `분석 재구성 / 대상 미확정` |
| `derived/joint-response-unit-unlisted-eleventh-group-concept-v1.png` | RECONSTRUCTED | `2006-12-31-aftermath` | Visualizes the discrepancy between ten listed personnel, recovery cases and an unlisted eleventh place. It is not a recovered group photograph. | `분석 재구성 / 실제 단체사진 아님` |
| `derived/nhc-young-soldiers-forward-base-group-photo-concept-v1.png` | RECONSTRUCTED | N.H.C faction dossier | Combines separate forward-base personnel and daily-life records into one analytical scene. It does not establish faces, unit composition or sleeve insignia. | `인원 재구성 / 실제 단체사진 아님` |

Generation mode: built-in image generation. Creation dates: 2026-08-16 and 2026-08-23. The images intentionally contain no logos, watermarks, readable text, or direct depictions of protected archive originals.

Originals under `assets/resources/` and `assets/resources/archive-enex/` retain their existing provenance. Do not infer RECONSTRUCTED status for those files from this registry.

## Visual evidence comparison links

| Evidence ID | Primary asset | Class | Comparison | Relationship |
|---|---|---|---|---|
| `VEA-GBF-R01` | `derived/great-black-forest_reconstructed-v1.png` | RECONSTRUCTED | Not registered | Original source image is currently missing |
| `VEA-DZ-R01` | `derived/dead-zone-pilgrimage_reconstructed-v1.png` | RECONSTRUCTED | Not registered | Original source image is currently missing |
| `VEA-PC-KEY-01` | `derived/project-curse-world-keyart-concept-v1.png` | RECONSTRUCTED | Not registered | Editorial orientation only; no event source claimed |
| `VEA-GBF-BELL-01` | `derived/great-black-forest-unlit-fortress-bell-concept-v1.png` | RECONSTRUCTED | Not registered | Witness accounts merged; no single scene source |
| `VEA-DZ-CP07-01` | `derived/checkpoint-07-five-thermal-concept-v1.png` | RECONSTRUCTED | Not registered | Fifth signature identity remains unresolved |
| `VEA-BC-CMD-01` | `derived/broken-crown-erased-commander-concept-v1.png` | RECONSTRUCTED | Not registered | Commander appearance and order origin remain unresolved |
| `VEA-AP1-TRACE-01` | `derived/first-apostle-three-traces-reconstruction-concept-v1.png` | RECONSTRUCTED | Not registered | Subject identity and single-entity status remain unresolved |
| `VEA-JRU-11-01` | `derived/joint-response-unit-unlisted-eleventh-group-concept-v1.png` | RECONSTRUCTED | Not registered | Personnel-count discrepancy only; no original group photo |
| `VEA-NHC-FB-01` | `derived/nhc-young-soldiers-forward-base-group-photo-concept-v1.png` | RECONSTRUCTED | Not registered | Personnel identities, unit roster and insignia remain unresolved |
| `VEA-FER-CLS-A` | `8bb53a89c3baf48d8e3ac2b180f80d0b.webp` | UNVERIFIED | `archive-enex/feral-classification/114223e8cf8c8ea96c6d4ffca6cae2ce.webp` | Duplicate source check |
| `VEA-FER-CLS-B` | `archive-enex/feral-classification/114223e8cf8c8ea96c6d4ffca6cae2ce.webp` | ORIGINAL | `8bb53a89c3baf48d8e3ac2b180f80d0b.webp` | Duplicate source check |
| `VEA-FER-241HS` | `archive-enex/feral-classification/image-241hs-angel-presence.png` | ORIGINAL | `83d311da1ab7310a567c6023f6151e6c.webp` | Source frame to protected legacy crop |

Comparison links do not authorize deletion or replacement. They only expose both preserved files in the Visual Evidence Archive viewer so that a later source review can decide which copy should be displayed by default.

## Faction mark interface assets

The following SVG files are code-authored INTERFACE assets. They are visual identity masters for the intelligence interface, not photographed evidence and not reconstructions of protected archive imagery. Legacy WebP marks remain available as fallbacks and historical design references.

| Asset | Class | Faction | Handling |
|---|---|---|---|
| `../faction_marks/uac.svg` | INTERFACE | U.A.C | Simplified containment seal; legacy ornate WebP retained |
| `../faction_marks/nhc.svg` | INTERFACE | N.H.C | Unified field-response patch; legacy circular WebP retained |
| `../faction_marks/sid.svg` | INTERFACE | S.I.D | New double-lens evidence frame; legacy eagle WebP retained |
| `../faction_marks/fhc.svg` | INTERFACE | F.H.C | Internal research-division lens; legacy occult-eye WebP retained |
| `../faction_marks/syndicate.svg` | INTERFACE | S.O.N | New broken-containment common mark; legacy skull WebP retained |
| `../faction_marks/ushinoda.svg` | INTERFACE | Ushinoda | Field-reconstructed common ritual geometry; not presented as a verified official seal |
| `../faction_marks/haimun.svg` | INTERFACE | P.O.H | New covert logistics code; legacy fist WebP retained |
| `../faction_marks/ashcrew.svg` | INTERFACE | Ash Crew | Simplified recovery tag and ember patch; legacy textured WebP retained |
| `../faction_marks/arf.svg` | INTERFACE | A.R.F | Retrieval frame and contaminated-core patch; legacy tactical WebP retained |
| `../faction_marks/cpd.svg` | INTERFACE | C.P.D | Civilian gate and triage-route patch; legacy checkpoint WebP retained |
| `../faction_marks/amarion.svg` | INTERFACE | Amarion | Restored spatial-coordinate corporate master; legacy geometric WebP retained |

Design and authentication metadata are owned by `assets/js/data/faction-mark-registry.js`. These marks may be used in faction dossiers, maps and timelines, but their interface role must not be relabeled as ORIGINAL evidence.

## Responsive delivery derivatives

`responsive/` contains 42 WebP delivery copies generated from 21 high-cost PNG or JPEG files. Each source has a 480px candidate and either a 960px candidate or a no-upscale candidate at its native width. The 2026-08-23 additions include 480px and 960px delivery copies for the terminal orientation key art; the preserved PNG remains the source.

These files do not replace, reclassify, or authorize removal of their sources. `assets/js/data/media-manifest.js` is the delivery relationship registry. Archive cards, document figures, and cinematic frames may use these candidates; the Visual Evidence Archive requests the preserved source file for original inspection and comparison.
