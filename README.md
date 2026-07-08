# Project Curse U.A.C Server — MapPatch 5.15.2au — OrderRestore_ContentSafe

Current package: MapPatch 5.15.2au — OrderRestore_ContentSafe

Base: MapPatch 5.15.2ap RuntimeFix_MetadataClean.

This patch deliberately rebases from 5.15.2ap instead of continuing the 5.15.2aq layout edits. The 2aq centered record-media layout is not included because it caused missing images and text-only centered record pages.

## Applied fixes

- Removed the left-bottom SOUND control panel from the main frame.
- Removed the duplicate floating sidebar menu button and kept one systembar menu button.
- Removed the topbar CURRENT / document-title block.
- Added a safer AppShell override for desktop and mobile:
  - desktop: sidebar pushes the content when open;
  - mobile: sidebar opens as an overlay drawer;
  - archive cards remain inside the parent panel.
- Blocked sidebar/menu-group/menu-link clicks from advancing Cults_871104 or Immortality_860201 sequences.
- Blocked side-menu click cues and menu/drawer/page/radio UI sound calls.
- Rebuilt menu ambient handling as screen-state based audio:
  - general pages may use menu ambient;
  - record detail and record sequence states stop menu ambient;
  - record-specific BGM/static layers are kept separate.
- Replaced audio assets:
  - menu ambient: `assets/audio/pc5152am_menu_old_computer.mp3`
  - F.H.C record BGM: `assets/audio/pc5152h_cult_sequence_bgm.mp3`
  - F.H.C fallback/marker BGM: `assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3`
  - F.H.C radio static layer: `assets/audio/pc5152an_cult_radio_static_layer.mp3`

## Not included

- No new image-top/text-bottom record template.
- No map rebuild.
- No relation mobile card conversion.
- No change to the original F.H.C / Immortality record text flow from 5.15.2ap.

## Manual check targets

1. Open main page and verify only one menu button appears in the topbar.
2. Verify no SOUND panel appears in the sidebar or bottom-left area.
3. Open/close sidebar several times. Menu BGM should not duck or restart from the menu action itself.
4. Enter `F.H.C 극비 보안 문서`. Menu ambient should stop; F.H.C BGM/static should be the only record audio layers.
5. Enter `불멸을 향해`. Menu ambient should stop and sidebar/menu clicks should not advance the sequence.
6. Return to archive list. General menu ambient may resume after a user gesture.
7. Check archive cards at desktop and mobile widths. Cards should not overflow outside the archive panel.
8. Check F.H.C / Immortality pages. Images should remain visible in the original 5.15.2ap layout.


## MapPatch 5.15.2au — OrderRestore_ContentSafe
- Restores F.H.C / Immortality native document pages from 5.15.2ar.
- Keeps 5.15.2as sequence viewer, but discards 5.15.2at content-order rewrite.
- Sets visible archive era to 1980~2010.

## MapPatch 5.15.2av — EvidenceStageScale_TypographyPass

Visual-only sequence overlay pass. F.H.C evidence pages now show large evidence images with compact report text on PC, and stack image/text on mobile. Content order and restored 5.15.2au setting text are unchanged.

