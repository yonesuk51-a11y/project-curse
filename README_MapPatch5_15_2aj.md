# MapPatch 5.15.2aj — MobileSidebarRouter_WidthHotfix

Purpose: hard-fix the mobile side-menu touch routing and remove the leftover sidebar grid column that made mobile pages look too narrow.

Applied:
- Sidebar is now an independent fixed overlay and no longer reserves a layout column.
- Mobile side-menu links are routed at capture phase so older listeners/overlays cannot swallow taps.
- Side-menu groups can still expand/collapse; menu item selection auto-closes on mobile.
- Backdrop/dim/overlay layers are inert and cannot block menu items.
- Mobile content uses full available viewport width rather than a narrow PC column.
- Archive cards keep public open buttons inside their boxes; only the button opens Cults_871104 and Immortality_860201.
- Existing silent-menu policy and main BGM/Immortality cue preservation remain unchanged.

No M.CORP content, color palette, or setting material has been imported. The external screenshots were used only as a layout behavior reference.
