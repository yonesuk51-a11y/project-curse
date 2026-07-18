# 5.15.2bz1 EquipmentTaxonomy QAConsistencyHotfix

- Fixed `checkEquipmentTaxonomy()` incorrectly requiring the legacy Equipment Codex DOM after that page was intentionally removed by the InterfaceReset pass.
- The six taxonomy categories are now validated against the active archive records; legacy codex categories are checked only when that UI is actually mounted.
- Added `codexState` to the taxonomy report: `removed-by-interface-reset`, `not-mounted`, or `rendered`.
- `equipmentCategoryCount` now reports the number of confirmed archive taxonomy records rather than a hard-coded required count.
- Hidden archive record bodies are inspected with `textContent`, so failure/withdrawal/recovery/disposal terminology is audited reliably.
- `screenSweep()` now aggregates supplemental equipment/originality errors and warnings into the main summary.
- `sweepReportText()` now forces its headline status to match the actual returned QA object.
