# MapPatch 5.15.2ak — MobileLayoutPass_RelationRecordFix

## Goal
Stabilize mobile page layouts after the sidebar router hotfix and remove PC-layout overlap artifacts from mobile views.

## Changes
- Added a global mobile layout pass for all active side-menu pages.
- Split the relation page into mobile-safe reading order: title, graph, focus/legend, connection log.
- Hid redundant relation side panels on mobile to prevent graph/text overlap.
- Reduced mobile world timeline card density and excessive vertical spacing.
- Reduced mobile faction page title/list spacing and converted faction tiles into compact row items.
- Reworked archive cards on mobile so text and buttons remain inside card boundaries.
- Tightened record detail mobile spacing and removed old document sidebar on phone-width record pages.
- Added hard section scroll resets and inert state for inactive panels to prevent black/partial-number transition artifacts.
- Preserved Immortality internal cues and all existing record content.

## Responsiveness
- PC 4K/FHD behavior is preserved.
- Mobile behavior targets normal phones, S24 Ultra, and WebView-style browser chrome.
