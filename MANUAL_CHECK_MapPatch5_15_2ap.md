# MANUAL CHECK — MapPatch 5.15.2ap

## Required checks

1. Open `index.html` directly or through the static host.
2. Confirm the boot loader clears normally.
3. Open the archive/faction relation area.
4. Click several relation nodes.
5. Confirm the selected node, status line, link chips, and relation rows update without console errors.
6. Confirm no unwanted click sound plays from relation node selection.
7. Confirm the KST top system frame remains visible.
8. Confirm archive cards still open only through the intended public/open buttons.

## Expected console state

- No `Cannot read properties of undefined (reading 'dataset')` error from `ProjectCurseAudio.root.dataset`.
- No repeated boot-loop or full DOM observer loop symptoms.
