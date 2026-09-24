// 교단 대본은 옛 기록 영상의 원문이다. archive 검사에서 문장·순서·시각을 대조한다.
(function(root){
  'use strict';
  const cults = [
      {
            "group": "warning",
            "code": "CLASSIFIED MATERIAL / WARNING",
            "title": "WARNING",
            "subtitle": "F.H.C / ANTICORRUPTION DIVISION",
            "image": "",
            "frame": "RESTRICTED DOCUMENT / AUTHORIZED ACCESS",
            "layout": "warningNotice",
            "lineDelay": 900,
            "lines": [
                  "F.H.C 부대의 사기 저하와 전반적인 작전 효율 악화로 인해, 타락 및 교단 침투자에 대한 처리는 반부패부서가 전담한다.",
                  "이하 문서는 기밀 정보를 포함한다. 단독으로 또는 승인된 인원과 함께 열람할 것.",
                  "문의 사항이 있을 경우 타카무라 또는 야나미에게 직접 연락할 것."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 01 / CULT TRACE",
            "title": "타락교",
            "subtitle": "Corrupted Cult",
            "image": "assets/resources/archive-enex/cults/image-57-corrupted-cult.png",
            "frame": "CULT TRACE / RECOVERED",
            "layout": "twoColumn",
            "lineDelay": 900,
            "lines": [
                  "타락교는 암흑기에 흩어진 종파들이 이어져 형성된 오염 신앙 계열로 추정된다.",
                  "역대 지도층은 확인되지 않았으며, 현대에는 여러 국가에 침투해 사회 내부를 잠식한다.",
                  "저주와 신체 변형을 축복으로 받아들이고, 불멸성을 신앙의 증거로 삼는다.",
                  "개별 신자 하나하나가 실질적 위협이 되며, 일반 사회 내부에 비밀 조직 형태로 남아 있다."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 02 / ID FAILED",
            "title": "신원불명의 신자",
            "subtitle": "Unidentified Believer",
            "image": "assets/resources/86ed1a163d79930b0874dbd5eb93adf2.webp",
            "frame": "IMAGE-860722 / UNIDENTIFIED BELIEVER",
            "imageCode": "IMG-860722",
            "layout": "evidenceCenter",
            "caption": "일반인 위장 가능 · 인육 섭취 후 형태 안정 사례 보고",
            "lineDelay": 900,
            "report": [
                  "신원불명의 신자는 현장에서 가장 흔히 확인되는 타락교 하위 신자 유형이다. 겉으로는 인간과 비슷하지만 신체 내부와 행동 패턴은 이미 오염 단계에 들어간 경우가 많다.",
                  "신선한 살을 섭취한 뒤 일시적으로 형태가 안정되는 사례가 보고되었다. 소규모 집단 행동과 은밀한 접근을 우선 경계해야 한다."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 03 / MASKED FORM",
            "title": "가면을 쓴 존재",
            "subtitle": "Masked Entity",
            "image": "assets/resources/b20abfee553be1cf8a7f818a2bd84f23.webp",
            "frame": "IMAGE-860723 / MASKED ENTITY",
            "imageCode": "IMG-860723",
            "layout": "evidenceCenter",
            "caption": "의식장 중심부 출현 · 정신 오염 반응 동반",
            "lineDelay": 900,
            "report": [
                  "가면을 쓴 존재는 타락교 의식장 주변에서 반복적으로 포착되는 특수 개체다. 야생 동물 기반 변형체로 추정되며, 일부 신자들은 이를 성물처럼 보호한다.",
                  "직접 교전보다 정신 오염과 추적 실패가 먼저 발생한다. 의식장 중심부에서 발견될 경우 즉시 봉쇄 등급을 올려야 한다."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 04 / CORRUPTION PROCESS",
            "title": "타락의 과정 및 형태",
            "subtitle": "Corruption Process",
            "image": "assets/resources/646468c8e709d197314f9d40e286986b.webp",
            "frame": "IMAGE-0923 / CORRUPTION PROCESS",
            "imageCode": "IMG-0923",
            "layout": "evidenceCenter",
            "caption": "살의 길 반복 사용 · 신체 형성물 · 자가포식 위험",
            "lineDelay": 900,
            "alertDelay": 950,
            "redAlert": "자가포식으로 이어질 수 있음",
            "report": [
                  "살의 길을 반복적으로 사용하면 늦거나 빠르게 침묵성 타락이 시작된다. 몸 곳곳에 새로운 기관과 형성물이 자라나며, 날카로운 치아를 가진 구강 구조와 감각 기관이 동반되는 경우가 많다.",
                  "이 과정은 비현실감과 인격 소실을 함께 일으킨다. 심한 경우 피해자는 자신의 신체를 먹어 치우는 자가포식 단계로 넘어간다."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 05 / SILENT CORRUPTION",
            "title": "침묵성 타락",
            "subtitle": "Silent Corruption",
            "image": "assets/resources/pc5152ay_silent_corruption.png",
            "frame": "IMAGE-1293A / SILENT CORRUPTION",
            "imageCode": "IMG-1293A",
            "layout": "evidenceCenter",
            "caption": "빙의 없음 · 내부 오염 성장 · 잠복성 변형",
            "lineDelay": 900,
            "report": [
                  "침묵성 타락은 빙의 없이 피해자 내부에서 오염이 자라나는 사례를 뜻한다. 초기에는 정상 상태처럼 보이지만, 통증과 무기력, 이상 조직 성장이 뒤늦게 드러난다.",
                  "학교와 주거지 내부 사례가 증가하고 있다. 발견이 늦을수록 회복 가능성은 급격히 낮아진다."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 06 / HYBRIDIZATION",
            "title": "융합성 타락",
            "subtitle": "Hybridized Corruption",
            "image": "assets/resources/pc5152ay_hybrid_corruption.png",
            "frame": "IMAGE-1293B / HYBRIDIZED CORRUPTION",
            "imageCode": "IMG-1293B",
            "layout": "evidenceCenter",
            "caption": "교단 의식 개입 · 피해자 내부 통합 · 혼성화",
            "lineDelay": 900,
            "mutation": {
                  "mode": "click",
                  "delay": 1450,
                  "readyDelay": 2900,
                  "imageCode": "IMG-1293C",
                  "title": "융합성 타락 / 변조됨",
                  "caption": "공공 안내문 위장 · 행동 통제성 문장 삽입",
                  "redAlert": "당신의 행동에 책임을 지십시오",
                  "report": [
                        "일부 기록은 정상적인 설명문처럼 시작하다가 교단식 안내문으로 순간 변조된다. 아이들을 감시하라, 학생들은 이미 어른이다, 인증된 교단과만 접촉하라는 식의 문장이 대표적이다.",
                        "이 유형은 정보 오염 또는 의식성 간섭 흔적으로 분류한다. 기록면 자체를 2차 오염원으로 취급해야 한다."
                  ]
            },
            "report": [
                  "일반적인 타락은 대개 되돌릴 수 없으며 피해자를 타락 생명체로 전환한다. 그러나 일부 교단은 의식을 통해 타락을 피해자 내부에 통합시키는 융합 과정을 강제로 유도한다.",
                  "인간 자아와 타락 조직이 동시에 남아 있을 수 있다. 외형 일부만 변형되어 발견이 늦어지는 경우가 많다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 07 / BLOOD TRACE",
            "title": "혈교",
            "subtitle": "Blood Cult",
            "image": "assets/resources/8668a15590e2ae00b18d68db57a85c95.webp",
            "frame": "BLOOD TRACE / RECOVERED",
            "layout": "twoColumn",
            "lineDelay": 900,
            "lines": [
                  "혈교는 오래된 혈액 의식 전통에서 갈라져 나온 분파이며, 타락체 자체보다 피의 의미와 경로를 중시한다.",
                  "피를 생명 유지 물질이 아니라 문, 무기, 경로, 저장소를 여는 매개체로 취급한다.",
                  "피의 길 자체가 즉시 타락을 유발하지는 않지만, 과도한 사용은 대량 출혈과 탈수로 이어진다.",
                  "현장에서는 의식적 사혈, 혈액 무기화, 이동 경로 조작을 우선 감시한다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 08 / ROUTE CONTROL",
            "title": "혈액 이동 경로 조정",
            "subtitle": "Blood Route Control",
            "image": "assets/resources/89eeb37859d35d979b1d217e11f5148f.webp",
            "frame": "IMAGE-880614 / BLOOD ROUTE CONTROL",
            "imageCode": "IMG-880614",
            "layout": "evidenceCenter",
            "caption": "혈류 조정 · 응고 방어막 · 혈액 무기 형성",
            "lineDelay": 900,
            "report": [
                  "혈액 사용자들은 체내와 외부 혈액의 이동 경로를 조정해 전투 흐름을 바꾼다. 출혈 제어와 응고 조작이 동시에 가능하며, 방어막과 즉석 무기 형성에 응용된다.",
                  "장기전일수록 사용자 체력 소모가 커진다. 혈액 손실이 누적되면 조작 정확도가 떨어지고 급성 탈수 증상이 뒤따른다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 09 / BLOOD WEAPON",
            "title": "혈무의 제작 과정",
            "subtitle": "혈무 Creation",
            "image": "assets/resources/5a2db6abec6308c441b2b430a3da59c2.webp",
            "frame": "IMAGE-880615 / BLOOD WEAPON FORM",
            "imageCode": "IMG-880615",
            "layout": "evidenceCenter",
            "caption": "근접 무기 기반 · 피의 의식 고정 · 타락 조직 억제",
            "lineDelay": 900,
            "report": [
                  "혈무는 기존 근접 무기에 혈액을 덮고, 피의 의식으로 고정해 만든 의식성 병기다.",
                  "완성된 혈무는 일반 무기보다 오래 버티며, 타락 조직을 절단하고 재생을 늦추는 데 사용된다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 10 / BLOOD LAKE",
            "title": "피의 호수를 거니는 자들",
            "subtitle": "Walking Through the Lake of Blood",
            "image": "assets/resources/1ab6ba9fba9b6b8b9493045c7bf4836d.webp",
            "frame": "IMAGE-880616 / BLOOD LAKE WALKER",
            "imageCode": "IMG-880616",
            "layout": "evidenceCenter",
            "caption": "혈액 웅덩이 내부 이동 · 매복 가능 · 단순 혈흔 아님",
            "lineDelay": 900,
            "report": [
                  "혈액 웅덩이는 저장소이자 이동 경로로 사용된다. 혈교 신자는 수면 아래에 숨어 이동하거나 매복할 수 있다.",
                  "현장 인원은 이를 단순 혈흔으로 판단해서는 안 된다. 접근 전 고열 장비와 밀폐 회수 절차를 준비해야 한다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 11 / RESERVOIR",
            "title": "혈액 저장소",
            "subtitle": "Blood Reservoir",
            "image": "assets/resources/458cf4194ba894dce7e907244d2fd1f0.webp",
            "frame": "IMAGE-880617 / BLOOD RESERVOIR",
            "imageCode": "IMG-880617",
            "layout": "evidenceCenter",
            "caption": "대량 혈액 저장 · 의식 보급원 · 개봉 전 오염 수치 확인",
            "lineDelay": 900,
            "report": [
                  "대량의 혈액이 내부에 저장되어 있으며, 혈교 사용자들은 이를 전투 중 회복 수단이나 의식 보급원으로 사용한다.",
                  "직접 접촉은 금지된다. 개봉 전 오염 수치 확인과 밀폐 반출 절차가 필요하다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 12 / SUPPRESSED ENTITY",
            "title": "제압된 타락체",
            "subtitle": "Suppressed Corrupted Entity",
            "image": "assets/resources/7af3eeca599cebbf7235e0a1368f2517.webp",
            "frame": "IMAGE-880618 / SUPPRESSED ENTITY",
            "imageCode": "IMG-880618",
            "layout": "evidenceCenter",
            "caption": "혈무 절단 · 화염 소각 · 혈액 경로 봉쇄",
            "lineDelay": 900,
            "report": [
                  "혈무와 화염을 병행한 제압은 타락체의 재생과 변형을 억제하는 데 효과적이다.",
                  "절단 후 즉시 소각하거나 혈액 경로를 봉쇄해야 재생 반응을 안정적으로 차단할 수 있다. 봉인구와 회수 절차는 반드시 병행한다."
            ]
      },
      {
            "group": "return",
            "code": "SEQUENCE END / RETURN",
            "title": "기록보관소 복귀",
            "subtitle": "Archive List Ready",
            "image": "",
            "frame": "ARCHIVE LIST / READY",
            "lineDelay": 900,
            "lines": [
                  "손상 영상 첨부 확인이 끝났습니다.",
                  "화면 선택 시 기록보관소 목록으로 복귀합니다."
            ]
      }
];
  root.ProjectCurseLegacyCinematicSources=Object.freeze({cults,
    media: Object.freeze({
      noise: 'assets/video/pc5152am_cult_trace_vhs_noise.mp4',
      radio: 'assets/audio/pc5152an_cult_radio_static_layer.mp3',
      mount: 'assets/audio/pc5152f_record_mount_soft.wav',
      blackBeep: 'assets/audio/pc5152s_immortality_page_black_beep_51_55.mp3'
    }),
    cues: Object.freeze({
      step:'assets/audio/pc5152p_internal_projector_vhs_step.wav',
      photo:'assets/audio/pc5152v_field_photo_click_42s.mp3',
      projector:'assets/audio/pc5152cf_sakuma_projector_advance.mp3',
      dialog:'assets/audio/pc5152v_comm_line_cue_73_74.mp3',
      intrusion:'assets/audio/pc5152db_immortality_intrusion_voice.mp3',
      report:'assets/audio/pc5152db_immortality_report_progress.mp3',
      pursuit:'assets/audio/pc5152dd_immortality_pursuit_range.mp3'
    }),
    get immortality(){return root.ProjectCurseImmortalityStoryboard || [];}
  });
})(window);
