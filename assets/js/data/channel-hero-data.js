// Project Curse 6 — 채널 대표 그림. 2026-09-25 사용자 결정(화면별 대표 그림).
// 화면 머리(PCApp.screenHead) 뒤에 어둡게 깔리는 장식 그림이다. 이미 채택·편입된 그림만 쓴다(ASSET_POLICY.md).
// 장식이므로 대체 텍스트를 비우고 화면 낭독기에서 숨긴다. 같은 그림의 증거 설명은 원래 기록에 있다.
// position은 넓게 자를 때 남길 곳(CSS object-position).
(function (root) {
  'use strict';

  root.ProjectCurseChannelHeroes = Object.freeze({
    'map-room': Object.freeze({ src: 'assets/resources/derived/dead-zone-silent-interior-map-termination-concept-v1.png', position: '50% 58%' }),
    history: Object.freeze({ src: 'assets/resources/derived/angel-descent-red-sky-concept-v1.png', position: '50% 28%' }),
    'faction-info': Object.freeze({ src: 'assets/resources/derived/ushinoda-basement-rite-concept-v1.png', position: '50% 55%' }),
    'archive-entry': Object.freeze({ src: 'assets/resources/derived/sakuma-tape-institution-entry-concept-v1.png', position: '50% 48%' }),
    personnel: Object.freeze({ src: 'assets/resources/derived/nhc-young-soldiers-forward-base-group-photo-concept-v1.png', position: '50% 34%' }),
    'field-manual': Object.freeze({ src: 'assets/resources/derived/nhc-close-quarters-stairwell-concept-v1.png', position: '64% 42%' })
  });
})(window);
