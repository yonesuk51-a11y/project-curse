# MANUAL CHECK — MapPatch 5.15.2ad

Check on PC:
1. Boot completes, then the side-menu toggle appears.
2. Toggle opens/closes the side menu.
3. No mobile MENU button/backdrop appears.
4. Main menu has no persistent scanline/noise/VHS drift overlay.
5. Side-menu button clicks play one aligned cue, not stacked sounds.
6. Faction mark buttons appear as compact rows, not overlapping cards.
7. Archive thumbnails are not shown in the list.
8. Only Cults_871104 and Immortality_860201 have working `기록 열람` buttons.
9. Clicking archive card titles/descriptions does not open records.
10. Sealed records remain disabled and direct docs still show access-denied stubs.

Validation:
- Run `node --check assets/js/main.js`.
- Run ZIP integrity test.
