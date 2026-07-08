# CHANGELOG — MapPatch 5.15.2ap

## RuntimeFix_MetadataClean

- Fixed a runtime error candidate in the relation network selector.
  - Removed the incomplete `window.ProjectCurseAudio.` access before `root.dataset.pc5152agInit`.
  - The previous fragment could be interpreted as `window.ProjectCurseAudio.root.dataset...` and fail when `ProjectCurseAudio.root` is undefined.
- Preserved silent menu/relation-node behavior.
- Updated README metadata from mixed 5.15.2am/5.15.2an/5.15.2ao references to 5.15.2ap.
- Updated the future patch pointer to start from 5.15.2ap.

## Non-goals

- No map module restoration.
- No layout redesign.
- No archive/content rewrite.
- No audio asset replacement.
