// Project Curse 5.15.2cv — direct-entry cinematic record runtime.
// Clarifies ordinary UI audio, reduces global TV/VHS feel, rebases side content,
// and adds a click-gated damaged-record sequence only for Cults_871104.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5152h-audio-sidecontent-terminal-sequence');
    document.body.classList.add('pc5152as-recordsequence-stageviewer');
    document.body.classList.add('pc5152ay-reference-rollback-religionfix');
    document.body.classList.add('pc5152az-immortality-fieldbriefing-pass');
    document.body.classList.add('pc5152ba-titleimg-mobile-sequencefix');
    document.body.classList.add('pc5152bb-stage-template-responsivefix');

    const IMMORTALITY_RECORD='Immortality_860201';
    const FERALS_RECORD='Ferals_860722';
    const SAKUMA_RECORD='Sakuma_Tape_991028';
    const cinematicRegistry=window.ProjectCurseCinematicRegistry;
    const SEQUENCE_RECORDS=new Set(cinematicRegistry?.ids?.()||[]);
    const state = {
      overlay:null,
      pageIndex:0,
      canAdvance:false,
      timer:null,
      bgm:null,
      cut:null,
      frame:null,
      activeRecord:null,
      nativeShow: window.ProjectCurseShowInternalRecord || null,
      finishing:false,
      lineTimer:null,
      lineEls:[],
      nextLineIndex:0,
      currentLineDelay:2500,
      pages:null,
      bgmSrc:'',
      endingPlayed:false,
      endingPlaying:false,
      immortalityStep:null,
      photoClick:null,
      sakumaProjector:null,
      sakumaBirthdayCue:null,
      specialMediaActive:false,
      dialogCue:null,
      intrusionCue:null,
      reportCue:null,
      pursuitCue:null,
      latePulse:null,
      latePulseTimer:null,
      latePulseActive:false,
      mutationAppliedPage:-1,
      autoTimer:null,
      autoPaused:false,
      autoDelay:0,
      runId:0
    };

    const pages = [
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

    const immortalityPages = window.ProjectCurseImmortalityStoryboard || [];

    window.ProjectCurseLegacyCinematicSources=Object.freeze({
      cults:pages,
      immortality:immortalityPages
    });

    function getActivePages(){
      return state.pages || pages;
    }

    function getSequenceConfig(){
      return cinematicRegistry?.get?.(state.activeRecord)||null;
    }


    function prefix(){
      const p=location.pathname;
      if(p.includes('/docs/'))return '../../';
      if(p.includes('/archive/'))return '../';
      return '';
    }

    function ensureSpecialAudio(){
      const pre=prefix();
      const cfg=getSequenceConfig();
      if(cfg.bgm){
        const bgmPath=pre+cfg.bgm;
        if(!state.bgm || state.bgmSrc!==bgmPath){
          try{ if(state.bgm){ state.bgm.pause(); state.bgm.currentTime=0; } }catch(e){}
          state.bgm = new Audio(bgmPath);
          state.bgm.loop = true;
          state.bgmSrc = bgmPath;
        }
        state.bgm.volume = Number(cfg.bgmVolume||.78);
      }else{
        try{ if(state.bgm){ state.bgm.pause(); state.bgm.currentTime=0; } }catch(e){}
        state.bgm = null;
        state.bgmSrc = '';
      }
      if(!state.internalStep){
        state.internalStep = new Audio(pre+'assets/audio/pc5152p_internal_projector_vhs_step.wav');
        state.internalStep.volume = .58;
      }
      if(!state.immortalityStep){
        state.immortalityStep = new Audio(pre+'assets/audio/pc5152s_immortality_page_black_beep_51_55.mp3');
        state.immortalityStep.volume = .0;
      }
      if(!state.photoClick){
        state.photoClick = new Audio(pre+'assets/audio/pc5152v_field_photo_click_42s.mp3');
        state.photoClick.volume = .58;
      }
      if(!state.sakumaProjector){
        state.sakumaProjector = new Audio(pre+'assets/audio/pc5152cf_sakuma_projector_advance.mp3');
        state.sakumaProjector.volume = .40;
      }
      if(cfg.birthdayAudio && !state.sakumaBirthdayCue){
        state.sakumaBirthdayCue = new Audio(pre+cfg.birthdayAudio);
        state.sakumaBirthdayCue.volume = .72;
      }
      if(!state.dialogCue){
        state.dialogCue = new Audio(pre+'assets/audio/pc5152v_comm_line_cue_73_74.mp3');
        state.dialogCue.volume = .42;
      }
      if(!state.intrusionCue){
        state.intrusionCue = new Audio(pre+'assets/audio/pc5152db_immortality_intrusion_voice.mp3');
        state.intrusionCue.volume = .78;
      }
      if(!state.reportCue){
        state.reportCue = new Audio(pre+'assets/audio/pc5152db_immortality_report_progress.mp3');
        state.reportCue.volume = .78;
      }
      if(!state.pursuitCue){
        state.pursuitCue = new Audio(pre+'assets/audio/pc5152dd_immortality_pursuit_range.mp3');
        state.pursuitCue.volume = .76;
        state.pursuitCue.loop = true;
      }
      if(!state.latePulse){
        state.latePulse = new Audio(pre+'assets/audio/pc5152x_late_log_beep_195s.mp3');
        state.latePulse.volume = .0;
      }
      if(!state.frame){
        state.frame = new Audio(pre+'assets/audio/pc5152h_frame_pop.wav');
        state.frame.volume = .0;
      }
    }

    function playLocal(a){
      if(!a) return;
      try{ a.currentTime=0; a.play().catch(()=>{}); }catch(e){}
    }

    function stopImmortalityLatePulse(){
      if(state.latePulseTimer){
        clearInterval(state.latePulseTimer);
        state.latePulseTimer=null;
      }
      state.latePulseActive=false;
      try{ if(state.latePulse){ state.latePulse.pause(); state.latePulse.currentTime=0; } }catch(e){}
    }

    function updateImmortalityLatePulse(page){
      if(state.activeRecord!==IMMORTALITY_RECORD || !page || !page.latePulse){
        stopImmortalityLatePulse();
        return;
      }
      if(state.latePulseActive) return;
      state.latePulseActive=true;
      setTimeout(()=>{ if(state.latePulseActive) playLocal(state.latePulse); }, 250);
      state.latePulseTimer=setInterval(()=>{ playLocal(state.latePulse); }, 2000);
    }

    function escSeq(v){
      return String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    function highlightFeralTerms(safeText){
      if(state.activeRecord!==FERALS_RECORD) return safeText;
      const classes={
        Ferals:'ferals','괴이':'ferals',Pure:'pure','순수형':'pure',Unpure:'unpure','불순형':'unpure',
        Superiors:'superiors','상위체':'superiors',Celestials:'celestials',Odious:'odious',
        Unusuals:'unusuals','이례체':'unusuals',Artificial:'artificial','인공형':'artificial','인공':'artificial',
        Hybrid:'hybrid','혼합형':'hybrid','혼합':'hybrid'
      };
      return String(safeText).replace(/Ferals|괴이|Unpure|불순형|Pure|순수형|Superiors|상위체|Celestials|Odious|Unusuals|이례체|Artificial|인공형|인공|Hybrid|혼합형|혼합/g,term=>'<span class="pc5152cf-feral-term pc5152cf-feral-term-'+classes[term]+'">'+term+'</span>');
    }

    function highlightImmortalityNames(text){
      return String(text)
        .replace(/(마렌 예거트|요나스 밀로|예거트|밀로)/g,'<span class="pc5152v-name-blue">$1</span>')
        .replace(/(본부)/g,'<span class="pc5152v-name-mint">$1</span>');
    }

    function isDialogueLike(line){
      const s=String(line||'');
      return /^〔[^〕]+〕\s*:/.test(s) || s.includes('우리가 전부 미안해');
    }

    function formatImmortalityLine(line,i,page,storyIndex=i){
      const raw=String(line||'');
      const safe=escSeq(raw);
      const dialog=isDialogueLike(raw);
      const m=raw.match(/^〔([^〕]+)〕\s*:\s*(.*)$/);
      let cls='pc5152k-seq-line pc5152v-red-line';
      let attrs=' data-line="'+i+'" data-story-line="'+storyIndex+'"';
      if(dialog) attrs+=' data-dialog="1"';
      if(m){
        const speaker=m[1];
        const body=highlightImmortalityNames(escSeq(m[2]||''));
        let scls='pc5152v-speaker-red';
        if(/예거트|밀로/.test(speaker)) scls='pc5152v-speaker-blue';
        else if(/본부/.test(speaker)) scls='pc5152v-speaker-mint';
        else if(/#|%|\$|\?/.test(speaker)) scls='pc5152v-speaker-corrupt';
        return '<span class="'+cls+' pc5152v-dialog-line"'+attrs+'><b class="'+scls+'">〔'+escSeq(speaker)+'〕:</b><em>'+body+'</em></span>';
      }
      if(dialog){
        return '<span class="'+cls+' pc5152v-dialog-line pc5152v-unauthorized-line"'+attrs+'>'+highlightImmortalityNames(safe)+'</span>';
      }
      return '<span class="'+cls+'"'+attrs+'>'+highlightImmortalityNames(safe)+'</span>';
    }

    function buildSequenceLines(page){
      return (page.lines||[]).map((line,i)=>{
        if(state.activeRecord===IMMORTALITY_RECORD) return formatImmortalityLine(line,i,page);
        return '<span class="pc5152k-seq-line" data-line="'+i+'">'+highlightFeralTerms(escSeq(line))+'</span>';
      }).join('');
    }

    function buildRedLogBlock(page,lines){
      const header=page.hideLogHeader?'':'<span class="pc5152k-seq-line pc5152v-log-header" data-line="0"><b>LOG '+escSeq(page.logTime||page.title||'--:--')+'</b><em>'+escSeq(page.logTitle||page.subtitle||'FIELD LOG')+'</em></span>';
      const offset=page.hideLogHeader?0:1;
      const shifted=(page.lines||[]).map((line,i)=>formatImmortalityLine(line,i+offset,page,i)).join('');
      return '<div class="pc5152v-red-log">'+header+shifted+'</div>';
    }

    function buildPhotoLargeBlock(page,lines){
      const code=escSeq(page.imageCode || page.subtitle || 'IMG---');
      const time=escSeq(page.logTime || page.title || '');
      const cap=escSeq(page.photoCaption || page.frame || 'FIELD IMAGE');
      const img='<figure class="pc5152v-large-photo pc5152k-seq-line" data-line="0" data-photo="1"><img src="'+prefix()+page.image+'" alt="'+cap+'"/><figcaption><div class="pc5152ba-photo-idline"><b>'+code+'</b>'+(time?'<span>'+time+'</span>':'')+'</div>'+(cap?'<em>'+cap+'</em>':'')+'</figcaption></figure>';
      const shifted=(page.lines||[]).map((line,i)=>formatImmortalityLine(line,i+1,page,i)).join('');
      const postFlash=Array.isArray(page.postFlashLines)&&page.postFlashLines.length
        ?'<div class="pc5152cz-post-flash" data-seq-postflash>'+page.postFlashLines.map(line=>'<span>'+escSeq(line)+'</span>').join('')+'</div>'
        :'';
      return '<div class="pc5152v-photo-page">'+img+'<div class="pc5152v-photo-lines pc5152k-seq-lines">'+shifted+postFlash+'</div></div>';
    }


    function buildEvidenceReportHtml(list, redAlert, delayed){
      const reportList=Array.isArray(list)?list:[];
      const report=reportList.filter(v=>String(v||'').trim()).map((line)=>'<p>'+highlightFeralTerms(escSeq(line))+'</p>').join('');
      const alert=redAlert?'<p class="pc5152ay-red-alert '+(delayed?'pc5152ay-delayed-alert':'')+'" data-evidence-alert>'+escSeq(redAlert)+'</p>':'';
      return report+alert;
    }

    function buildEvidenceCenterBlock(page){
      const pfx=prefix();
      const title=escSeq(page.title||'기록');
      const subtitle=escSeq(page.subtitle||'');
      const imageCode=escSeq(page.imageCode||page.frame||page.code||'IMG-0000');
      const caption=escSeq(page.caption||'');
      const imgAlt=escSeq((page.title||'증거 이미지')+' 회수 이미지');
      const reportList=Array.isArray(page.report)?page.report:(Array.isArray(page.lines)?page.lines:[]);
      const report=buildEvidenceReportHtml(reportList, page.redAlert, !!page.alertDelay);
      return '<div class="pc5152ax-evidence-center pc5152k-seq-line" data-line="0">'
        +'<figure class="pc5152ax-evidence-card"><img src="'+pfx+page.image+'" alt="'+imgAlt+'"/></figure>'
        +'<div class="pc5152ba-evidence-titleline"><b data-evidence-code>'+imageCode+'</b><span data-evidence-title>'+title+'</span></div>'
        +(subtitle?'<small class="pc5152ba-evidence-subtitle">'+subtitle+'</small>':'')
        +(caption?'<em class="pc5152ba-evidence-caption" data-evidence-caption>'+highlightFeralTerms(caption)+'</em>':'<em class="pc5152ba-evidence-caption" data-evidence-caption></em>')
        +'<div class="pc5152ax-evidence-report" data-evidence-report>'+report+'</div>'
        +'</div>';
    }

    function buildVictimSlideBlock(page){
      const title=escSeq(page.title||'피해자');
      const subtitle=escSeq(page.subtitle||'');
      const imageCode=escSeq(page.code||page.frame||'VICTIM FILE');
      const reportList=Array.isArray(page.lines)?page.lines:[];
      const report=reportList.filter(v=>String(v||'').trim()).map(line=>'<p>'+highlightFeralTerms(escSeq(line))+'</p>').join('');
      return '<article class="pc5152cf-victim-slide pc5152k-seq-line" data-line="0">'
        +(page.hideIdentity?'':'<header><b>'+title+'</b>'+(subtitle?'<span>['+subtitle+']</span>':'')+'</header>')
        +'<figure><img src="'+prefix()+page.image+'" alt="'+title+' 피해 현장 기록"/></figure>'
        +'<div class="pc5152cf-victim-report">'+report+'</div>'
        +'<small>'+imageCode+'</small>'
        +'</article>';
    }

    function buildClassificationChartBlock(page){
      const caption=escSeq(page.caption||'SIMPLIFIED CLASSIFICATION OF CORRUPTED LIFEFORMS');
      const credit=escSeq(page.credit||'U.A.C FIELD COPY');
      return '<figure class="pc5152cf-classification-chart pc5152k-seq-line" data-line="0">'
        +'<img src="'+prefix()+page.image+'" alt="괴이 단순화 분류 구조"/>'
        +'<figcaption><b>'+caption+'</b><small>'+credit+'</small></figcaption>'
        +'</figure>';
    }

    function applyEvidenceMutation(page, bodyEl){
      if(!page || !page.mutation || !bodyEl) return false;
      const card=bodyEl.querySelector('.pc5152ax-evidence-center');
      const code=bodyEl.querySelector('[data-evidence-code]');
      const title=bodyEl.querySelector('[data-evidence-title]');
      const cap=bodyEl.querySelector('[data-evidence-caption]');
      const report=bodyEl.querySelector('[data-evidence-report]');
      if(card) card.classList.add('pc5152ay-mutating-now','pc5152ba-click-mutated');
      if(code && page.mutation.imageCode) code.textContent=page.mutation.imageCode;
      if(title && page.mutation.title) title.textContent=page.mutation.title;
      if(cap && page.mutation.caption) cap.textContent=page.mutation.caption;
      if(report) report.innerHTML=buildEvidenceReportHtml(page.mutation.report||[], page.mutation.redAlert, false);
      state.revealTimers.push(setTimeout(()=>{ if(card) card.classList.remove('pc5152ay-mutating-now'); }, 560));
      return true;
    }

    function runEvidencePostReveal(page, bodyEl, runId){
      if(!page || !bodyEl) return 0;
      let hold=0;
      if(page.alertDelay && page.redAlert){
        hold=Math.max(hold, Number(page.alertDelay||0)+650);
        state.revealTimers.push(setTimeout(()=>{
          if(runId!==state.runId) return;
          const alert=bodyEl.querySelector('[data-evidence-alert]');
          if(alert) alert.classList.add('visible');
        }, Number(page.alertDelay||900)));
      }
      return hold;
    }


    function stopSequenceAudio(){
      stopImmortalityLatePulse();
      try{
        if(state.bgm){
          state.bgm.pause();
          state.bgm.currentTime=0;
        }
        if(state.photoClick){ state.photoClick.pause(); state.photoClick.currentTime=0; }
        if(state.sakumaProjector){ state.sakumaProjector.onended=null; state.sakumaProjector.pause(); state.sakumaProjector.currentTime=0; }
        if(state.sakumaBirthdayCue){ state.sakumaBirthdayCue.onended=null; state.sakumaBirthdayCue.pause(); state.sakumaBirthdayCue.currentTime=0; }
        if(state.dialogCue){ state.dialogCue.pause(); state.dialogCue.currentTime=0; }
        if(state.intrusionCue){ state.intrusionCue.pause(); state.intrusionCue.currentTime=0; }
        if(state.reportCue){ state.reportCue.onended=null; state.reportCue.pause(); state.reportCue.currentTime=0; }
        if(state.pursuitCue){ state.pursuitCue.pause(); state.pursuitCue.currentTime=0; }
      }catch(e){}
    }

    function silenceMenuAmbientDuringSequence(){
      const bus=window.ProjectCurseAudio;
      if(!bus) return;
      try{ if(typeof bus.setContext==='function') bus.setContext('cinematic'); }catch(e){}
      try{ if(typeof bus.stopMenuAmbient==='function') bus.stopMenuAmbient(); }catch(e){}
      try{
        const ambient=bus.audio&&bus.audio.ambient;
        if(ambient){ ambient.pause(); ambient.currentTime=0; }
      }catch(e){}
    }


    function hardResetSequenceRuntime(){
      state.runId=(state.runId||0)+1;
      clearSequenceTimers();
      stopSequenceAudio();
      state.pageIndex=0;
      state.canAdvance=false;
      state.transitioning=false;
      state.finishing=false;
      state.endingPlayed=false;
      state.endingPlaying=false;
      state.lineEls=[];
      state.nextLineIndex=0;
      state.mutationAppliedPage=-1;
      state.specialMediaActive=false;
      state.autoPaused=false;
      state.autoDelay=0;
      const el=state.overlay;
      if(el){
        ['.pc5152h-seq-video','.pc5152m-transition-video','.pc5152q-ending-video'].forEach(sel=>{
          const v=el.querySelector(sel);
          if(v){ try{ v.onended=null; v.pause(); v.currentTime=0; }catch(e){} }
        });
        const fig=el.querySelector('[data-seq-figure]');
        const img=el.querySelector('[data-seq-image]');
        if(img) img.removeAttribute('src');
        if(fig) fig.hidden=true;
        el.classList.remove('show','intro-mode','pages-mode','input-ready','frame-ready','page-reveal','black-transition','major-transition','normal-transition','video-transition','ending-mode','sakuma-bridge-mode','pc5152q-immortality-mode','pc5152h-cult-mode','pc5152u-people-page','pc5152v-photo-large-page','pc5152v-red-log-page','pc5152db-postflash-page');
        el.className=el.className.replace(/\bpc5152as-layout-[^\s]+/g,'').replace(/\s{2,}/g,' ').trim();
        el.removeAttribute('data-pc5152as-layout');
        el.removeAttribute('data-pc5152as-group');
        el.setAttribute('aria-hidden','true');
        const body=el.querySelector('[data-seq-body]');
        if(body) body.innerHTML='';
        const panel=el.querySelector('.pc5152h-seq-panel');
        if(panel) panel.hidden=false;
      }
      document.body.classList.remove('pc5152h-sequence-open','pc5152i-sequence-intro-playing','pc5133-case-file-open','pc5152q-immortality-sequence','pc5152h-cult-source-sequence');
    }

    function ensureOverlay(){
      if(state.overlay) return state.overlay;
      const pre=prefix();
      const el=document.createElement('div');
      el.className='pc5152h-cult-sequence';
      el.setAttribute('aria-hidden','true');
      el.innerHTML=[
        '<video class="pc5152h-seq-video" playsinline preload="auto" src="'+pre+'assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4"></video>',
        '<video class="pc5152m-transition-video" playsinline preload="auto" src="'+pre+'assets/video/pc5152m_vhs_transition_18_21_sound.mp4"></video>',
        '<video class="pc5152q-ending-video" playsinline preload="auto"></video>',
        '<video class="pc5152an-vhs-overlay-video" muted playsinline loop preload="auto" src="'+pre+'assets/video/pc5152am_cult_trace_vhs_noise.mp4"></video>',
        '<div class="pc5152h-seq-black"></div>',
        '<div class="pc5152h-seq-scan"></div>',
        '<button class="pc5152x-seq-return" type="button">돌아가기</button>',
        '<div class="pc5152h-seq-panel">',
          '<div class="pc5152h-seq-meta"><span data-seq-code></span><b data-seq-source>F.H.C / LOCAL COPY</b></div>',
          '<div class="pc5152h-seq-body">',
            '<div class="pc5152h-seq-text">',
              '<h2 data-seq-title></h2>',
              '<div class="pc5152k-seq-linebox" data-seq-body></div>',
            '</div>',
            '<figure class="pc5152h-seq-frame" data-seq-figure>',
              '<img data-seq-image alt="손상 기록 프레임"/>',
              '<figcaption data-seq-frame></figcaption>',
            '</figure>',
          '</div>',
          '<div class="pc5152h-seq-footer">',
            '<span data-seq-status>SIGNAL READING...</span>',
            '<small data-seq-counter></small>',
          '</div>',
        '</div>',
        '<div class="pc-cinematic-controls" data-seq-controls>',
          '<div class="pc-cinematic-progress" aria-hidden="true"><i data-seq-progress></i></div>',
          '<div class="pc-cinematic-actions">',
            '<button type="button" data-seq-action="previous" aria-label="이전 장면">‹ 이전</button>',
            '<button type="button" data-seq-action="toggle" aria-label="재생 또는 일시정지"><span data-seq-play-label>일시정지</span></button>',
            '<button type="button" data-seq-action="next" aria-label="다음 장면">다음 ›</button>',
            '<button type="button" data-seq-action="restart" aria-label="처음부터 보기">처음부터</button>',
          '</div>',
        '</div>'
      ].join('');
      document.body.appendChild(el);
      state.overlay=el;
      return el;
    }

    function clearSequenceTimers(){
      clearTimeout(state.timer);
      clearTimeout(state.lineTimer);
      clearTimeout(state.autoTimer);
      state.autoTimer=null;
      const overlay=state.overlay;
      if(overlay){
        overlay.classList.remove('pc-cinematic-counting');
        const progress=overlay.querySelector('[data-seq-progress]');
        if(progress){ progress.style.animationDuration='0ms'; progress.style.transform='scaleX(0)'; }
      }
      if(state.revealTimers && state.revealTimers.length){
        state.revealTimers.forEach(t=>clearTimeout(t));
      }
      state.revealTimers=[];
      state.lineEls=[];
      state.nextLineIndex=0;
    }


    function isInternalProjectorTransition(current,next){
      return !!(current && next && current.group===next.group && ['cult','blood','feral_system','ferals','superiors','artificial','hybrid','doctrine'].includes(current.group));
    }

    function isVideoMajorTransition(current,next){
      if(state.activeRecord===IMMORTALITY_RECORD){
        return false;
      }
      // One rule owns every non-Immortality chapter boundary. This prevents a
      // newly added chapter pair from silently falling back to a blank hold.
      return !!(current&&next&&current.group!==next.group&&getSequenceConfig()?.transitionVideo);
    }

    function beginBlackTransition(nextIndex){
      const el=ensureOverlay();
      const activePages=getActivePages();
      const current=activePages[state.pageIndex] || {};
      const next=activePages[nextIndex] || {};
      const videoMajor=isVideoMajorTransition(current,next);
      const cfg=getSequenceConfig();
      const hold=videoMajor ? Number(cfg.transitionFallback||3750) : (state.activeRecord===IMMORTALITY_RECORD ? 950 : 760);
      state.canAdvance=false;
      state.transitioning=true;
      clearSequenceTimers();
      el.classList.remove('input-ready','frame-ready','page-reveal');
      el.classList.add('black-transition');
      el.classList.toggle('major-transition', !!videoMajor);
      el.classList.toggle('video-transition', !!videoMajor);
      el.classList.toggle('normal-transition', !videoMajor);
      const immortalityBlack = state.activeRecord===IMMORTALITY_RECORD && !videoMajor;
      el.querySelector('[data-seq-code]').textContent=videoMajor?'VHS INSERT / RECORD FACE SWITCH':(immortalityBlack?'F.H.C BLACK NOISE / PAGE STEP':'TRACKING CUT / PAGE STEP');
      el.querySelector('[data-seq-title]').textContent='';
      el.querySelector('[data-seq-body]').innerHTML='';
      el.querySelector('[data-seq-frame]').textContent=videoMajor?'VIDEO INSERT 18-21 / SOUND ON':(immortalityBlack?'BLACK SIGNAL / BEEP 51-55':'VHS BLACK / HOLD');
      el.querySelector('[data-seq-counter]').textContent='';
      const source=el.querySelector('[data-seq-source]');
      if(source && immortalityBlack) source.textContent=cfg.sourceLabel||'F.H.C / RECOVERED SOURCE';
      const fig=el.querySelector('[data-seq-figure]');
      if(fig) fig.hidden=true;
      const status=el.querySelector('[data-seq-status]');
      status.textContent=videoMajor?'VHS INSERT PLAYBACK':(immortalityBlack?'BLACK NOISE / AUDIO PULSE':'NOISE HOLD / PAGE RECOVER');

      if(videoMajor){
        const tv=el.querySelector('.pc5152m-transition-video');
        let moved=false;
        const finish=()=>{
          if(moved) return;
          moved=true;
          clearTimeout(state.timer);
          try{ tv.pause(); tv.currentTime=0; }catch(e){}
          try{ if(state.bgm && !state.bgm.paused) state.bgm.volume=Number(cfg.bgmVolume||.78); }catch(e){}
          state.transitioning=false;
          el.classList.remove('black-transition','major-transition','normal-transition','video-transition');
          state.pageIndex=nextIndex;
          renderPage();
        };
        try{
          if(state.bgm && !state.bgm.paused) state.bgm.volume=.30;
          tv.loop=false;
          tv.muted=false;
          tv.volume=Number(cfg.transitionVolume||.78);
          if(tv.getAttribute('src')!==prefix()+cfg.transitionVideo){ tv.src=prefix()+cfg.transitionVideo; }
          tv.currentTime=0;
          tv.onended=finish;
          const playPromise=tv.play();
          if(playPromise && playPromise.catch) playPromise.catch(()=>setTimeout(finish, hold));
        }catch(e){
          setTimeout(finish, hold);
        }
        state.timer=setTimeout(finish, hold+320);
        return;
      }

      // Immortality pages use only a noisy black hold plus the 51s-55s beep cue.
      // Cult/blood internal subpages keep the VHS-treated slide projector cue.
      if(state.activeRecord===IMMORTALITY_RECORD){
        try{ if(state.bgm && !state.bgm.paused) state.bgm.volume=.62; }catch(e){}
        playLocal(state.immortalityStep);
      }else if(isInternalProjectorTransition(current,next)){
        playLocal(state.internalStep);
      }
      const runId=state.runId;
      state.timer=setTimeout(()=>{
        if(runId!==state.runId) return;
        try{ if(state.activeRecord===IMMORTALITY_RECORD && state.bgm && !state.bgm.paused) state.bgm.volume=Number(cfg.bgmVolume||.86); }catch(e){}
        state.transitioning=false;
        el.classList.remove('black-transition','major-transition','normal-transition','video-transition');
        state.pageIndex=nextIndex;
        renderPage();
      }, hold);
    }

    function automaticPageDelay(){
      const page=getActivePages()[state.pageIndex]||{};
      if(page.hold) return Number(page.hold);
      if(state.activeRecord===IMMORTALITY_RECORD){
        if(page.layout==='photoLarge') return 6200;
        if(page.layout==='peoplePair') return 5800;
        if(page.layout==='redLog') return 4700;
        return page.image?5900:5000;
      }
      if(page.mutation && state.mutationAppliedPage!==state.pageIndex) return 5600;
      if(page.layout==='classificationChart') return 4800;
      if(page.layout==='warningNotice') return 5400;
      if(page.layout==='evidenceCenter') return 5900;
      if(page.layout==='victimSlide') return 6800;
      if(page.layout==='twoColumn') return 6500;
      if(page.layout==='warningCard') return 6200;
      return page.group==='system'?3600:5200;
    }

    function syncCinematicControls(){
      const el=state.overlay;
      if(!el) return;
      const label=el.querySelector('[data-seq-play-label]');
      if(label) label.textContent=state.autoPaused?'재생':'일시정지';
      el.classList.toggle('pc-cinematic-paused',!!state.autoPaused);
      const previous=el.querySelector('[data-seq-action="previous"]');
      if(previous) previous.disabled=state.pageIndex<=0||!el.classList.contains('pages-mode');
    }

    function scheduleAutomaticAdvance(customDelay){
      clearTimeout(state.autoTimer);
      state.autoTimer=null;
      const el=ensureOverlay();
      el.classList.remove('pc-cinematic-counting');
      if(state.autoPaused||!state.canAdvance||!el.classList.contains('pages-mode')){ syncCinematicControls(); return; }
      const delay=Number(customDelay||automaticPageDelay());
      state.autoDelay=delay;
      const progress=el.querySelector('[data-seq-progress]');
      if(progress){
        progress.style.animationDuration=delay+'ms';
        progress.style.transform='scaleX(0)';
        void progress.offsetWidth;
      }
      requestAnimationFrame(()=>el.classList.add('pc-cinematic-counting'));
      const runId=state.runId;
      state.autoTimer=setTimeout(()=>{
        if(runId!==state.runId||state.autoPaused) return;
        el.classList.remove('pc-cinematic-counting');
        advanceSequence();
      },delay);
      syncCinematicControls();
    }

    function setSequenceInputAvailable(){
      const el=ensureOverlay();
      const status=el.querySelector('[data-seq-status]');
      state.canAdvance=true;
      el.classList.add('input-ready');
      if(status) status.innerHTML=state.autoPaused?'PLAYBACK PAUSED <em>재생을 선택하십시오</em>':'AUTO PLAY <em>다음 기록면 대기</em>';
      scheduleAutomaticAdvance();
    }

    function scheduleNextSequenceLine(delay){
      clearTimeout(state.lineTimer);
      const runId=state.runId;
      state.lineTimer=setTimeout(()=>{ if(runId===state.runId) revealNextSequenceLine(false); }, Number(delay||2500));
    }

    function runImmortalityPostFlash(page){
      if(state.activeRecord!==IMMORTALITY_RECORD || !Array.isArray(page?.postFlashLines) || !page.postFlashLines.length) return false;
      const el=ensureOverlay();
      const flash=el.querySelector('[data-seq-postflash]');
      if(!flash) return false;
      const runId=state.runId;
      state.canAdvance=false;
      state.transitioning=true;
      const status=el.querySelector('[data-seq-status]');
      if(status) status.textContent='UNAUTHORIZED TEXT RECOVERED...';
      state.revealTimers.push(setTimeout(()=>{
        if(runId!==state.runId) return;
        const lineStack=flash.closest('.pc5152k-seq-lines');
        if(lineStack){
          lineStack.classList.add('pc5152da-postflash-replacement');
          lineStack.querySelectorAll(':scope > .pc5152k-seq-line').forEach(line=>{
            line.remove();
          });
        }
        playLocal(state.intrusionCue);
        flash.classList.add('visible');
        state.revealTimers.push(setTimeout(()=>{
          if(runId!==state.runId) return;
          try{ if(state.intrusionCue){ state.intrusionCue.pause(); state.intrusionCue.currentTime=0; } }catch(e){}
          state.transitioning=false;
          state.canAdvance=true;
          advanceSequence();
        },Number(page.postFlashHold||1150)));
      },Number(page.postFlashDelay||900)));
      return true;
    }

    function runImmortalityReportAudio(page){
      if(state.activeRecord!==IMMORTALITY_RECORD || !page?.reportAudio || !state.reportCue) return false;
      const el=ensureOverlay();
      const audio=state.reportCue;
      const runId=state.runId;
      let completed=false;
      state.canAdvance=false;
      state.transitioning=true;
      const status=el.querySelector('[data-seq-status]');
      if(status) status.textContent='REPORTING...';
      const complete=()=>{
        if(completed || runId!==state.runId) return;
        completed=true;
        try{ audio.onended=null; audio.pause(); audio.currentTime=0; }catch(e){}
        state.transitioning=false;
        state.canAdvance=true;
        advanceSequence();
      };
      try{
        audio.currentTime=0;
        audio.onended=complete;
        const playPromise=audio.play();
        if(playPromise&&playPromise.catch) playPromise.catch(()=>{});
      }catch(e){}
      state.revealTimers.push(setTimeout(complete,3400));
      return true;
    }

    function syncImmortalityRangeAudio(page){
      const audio=state.pursuitCue;
      if(!audio) return;
      const inPursuitRange=state.activeRecord===IMMORTALITY_RECORD && page?.rangeAudio==='latePursuit';
      try{
        if(inPursuitRange){
          audio.loop=true;
          if(!page.rangeAudioStart && audio.paused) audio.play().catch(()=>{});
        }else{
          audio.pause();
          audio.currentTime=0;
        }
      }catch(e){}
    }

    function revealNextSequenceLine(manual){
      if(state.transitioning) return false;
      const el=ensureOverlay();
      if(el.classList.contains('intro-mode') || document.body.classList.contains('pc5152i-sequence-intro-playing')) return false;
      const lines=state.lineEls || [];
      if(!lines.length){
        setSequenceInputAvailable();
        return false;
      }
      if(state.nextLineIndex >= lines.length){
        setSequenceInputAvailable();
        return false;
      }
      const lineIndex=state.nextLineIndex;
      const lineEl=lines[lineIndex];
      if(lineEl){
        lineEl.classList.add('visible');
        const page=getActivePages()[state.pageIndex]||{};
        if(state.activeRecord===IMMORTALITY_RECORD && page.rangeAudioStart && lineIndex===0 && state.pursuitCue){
          try{
            state.pursuitCue.currentTime=0;
            state.pursuitCue.play().catch(()=>{});
          }catch(e){}
        }
        if(state.activeRecord===IMMORTALITY_RECORD && lineEl.dataset && lineEl.dataset.dialog==='1'){
          playLocal(state.dialogCue);
        }
        const mutation=page.lineMutation;
        if(state.activeRecord===IMMORTALITY_RECORD && mutation && lineEl.dataset.photo!=='1' && Number(mutation.index)===Number(lineEl.dataset.storyLine)){
          const runId=state.runId;
          state.revealTimers.push(setTimeout(()=>{
            if(runId!==state.runId || !lineEl.isConnected) return;
            lineEl.innerHTML=highlightImmortalityNames(escSeq(mutation.to||''));
            lineEl.classList.add('pc5152cz-line-mutated');
          },Number(mutation.delay||700)));
        }
      }
      state.nextLineIndex += 1;
      if(state.nextLineIndex >= lines.length){
        clearTimeout(state.lineTimer);
        const page=getActivePages()[state.pageIndex]||{};
        if(!runImmortalityPostFlash(page) && !runImmortalityReportAudio(page)) setSequenceInputAvailable();
      }else{
        const nextDelay=(state.activeRecord===IMMORTALITY_RECORD && lineEl && lineEl.dataset && lineEl.dataset.dialog==='1') ? 3600 : (state.currentLineDelay || 2500);
        scheduleNextSequenceLine(nextDelay);
      }
      return true;
    }

    function runSakumaBirthdaySequence(page,runId){
      if(state.activeRecord!==SAKUMA_RECORD || page.specialSequence!=='sakumaBirthday') return false;
      const el=ensureOverlay();
      const cfg=getSequenceConfig();
      const projector=state.sakumaProjector;
      const cue=state.sakumaBirthdayCue;
      const bridge=el.querySelector('.pc5152q-ending-video');
      state.canAdvance=false;
      state.transitioning=true;
      state.specialMediaActive=true;
      clearTimeout(state.autoTimer);
      state.autoTimer=null;
      el.classList.remove('pc-cinematic-counting','input-ready');
      try{ if(state.bgm) state.bgm.volume=.025; }catch(e){}

      let projectorDone=false;
      let cueDone=false;
      let bridgeDone=false;
      const showSearchStatus=()=>{
        if(bridgeDone || runId!==state.runId) return;
        bridgeDone=true;
        try{ bridge.onended=null; bridge.pause(); bridge.currentTime=0; }catch(e){}
        el.classList.remove('sakuma-bridge-mode','ending-mode');
        el.classList.add('pages-mode');
        state.specialMediaActive=false;
        state.transitioning=false;
        try{
          if(state.bgm){
            state.bgm.volume=Number(cfg.bgmVolume||.16);
            if(state.bgm.paused) state.bgm.play().catch(()=>{});
          }
        }catch(e){}
        state.pageIndex=Math.min(state.pageIndex+1,getActivePages().length-1);
        renderPage();
      };
      const playBridge=()=>{
        if(cueDone || runId!==state.runId) return;
        cueDone=true;
        try{ if(cue){ cue.onended=null; cue.pause(); cue.currentTime=0; } }catch(e){}
        el.classList.remove('pages-mode','input-ready','frame-ready','page-reveal');
        el.classList.add('show','sakuma-bridge-mode');
        try{
          if(!bridge) throw new Error('bridge video missing');
          if(bridge.getAttribute('src')!==prefix()+cfg.birthdayVideo) bridge.src=prefix()+cfg.birthdayVideo;
          bridge.loop=false;
          bridge.muted=false;
          bridge.volume=.82;
          bridge.currentTime=0;
          bridge.onended=showSearchStatus;
          const played=bridge.play();
          if(played&&played.catch) played.catch(()=>setTimeout(showSearchStatus,500));
        }catch(e){ setTimeout(showSearchStatus,500); }
        state.revealTimers.push(setTimeout(showSearchStatus,2300));
      };
      const playBirthdayCue=()=>{
        if(projectorDone || runId!==state.runId) return;
        projectorDone=true;
        try{ if(projector){ projector.onended=null; projector.pause(); projector.currentTime=0; } }catch(e){}
        try{
          if(!cue) throw new Error('birthday cue missing');
          cue.currentTime=0;
          cue.onended=playBridge;
          const played=cue.play();
          if(played&&played.catch) played.catch(()=>setTimeout(playBridge,500));
        }catch(e){ setTimeout(playBridge,500); }
        state.revealTimers.push(setTimeout(playBridge,6800));
      };
      try{
        if(!projector) throw new Error('projector cue missing');
        projector.currentTime=0;
        projector.onended=playBirthdayCue;
        const played=projector.play();
        if(played&&played.catch) played.catch(()=>setTimeout(playBirthdayCue,250));
      }catch(e){ setTimeout(playBirthdayCue,250); }
      state.revealTimers.push(setTimeout(playBirthdayCue,2300));
      return true;
    }

    const CINEMATIC_MEDIA_SELECTOR=[
      '.pc5152h-seq-frame img',
      '.pc5152ax-evidence-card img',
      '.pc5152cf-victim-slide figure img',
      '.pc5152v-large-photo img',
      '.pc5152cf-classification-chart img'
    ].join(',');
    const CINEMATIC_FRAME_SELECTOR=[
      '.pc5152h-seq-frame',
      '.pc5152ax-evidence-card',
      '.pc5152cf-victim-slide figure',
      '.pc5152v-large-photo',
      '.pc5152cf-classification-chart'
    ].join(',');

    function clearCinematicMediaFit(root){
      const scope=root||document;
      scope.querySelectorAll?.('.pc-cinematic-frame-fitted').forEach(frame=>{
        frame.classList.remove('pc-cinematic-frame-fitted');
        frame.style.removeProperty('--pc-media-width');
        frame.style.removeProperty('--pc-media-height');
      });
      scope.querySelectorAll?.('.pc-cinematic-media-fitted').forEach(image=>image.classList.remove('pc-cinematic-media-fitted'));
    }

    function fitCinematicImage(image){
      if(!image || !image.naturalWidth || !image.naturalHeight) return;
      const frame=image.closest(CINEMATIC_FRAME_SELECTOR);
      if(!frame) return;
      const ratio=image.naturalWidth/image.naturalHeight;
      const maxWidth=Math.min(Math.max(320,(window.innerWidth||1280)*.84),1180);
      const maxHeight=Math.min(Math.max(260,(window.innerHeight||720)*.56),640);
      let width=maxWidth;
      let height=width/ratio;
      if(height>maxHeight){ height=maxHeight; width=height*ratio; }
      frame.style.setProperty('--pc-media-width',Math.max(1,Math.round(width))+'px');
      frame.style.setProperty('--pc-media-height',Math.max(1,Math.round(height))+'px');
      frame.classList.add('pc-cinematic-frame-fitted');
      image.classList.add('pc-cinematic-media-fitted');
    }

    function fitCinematicImages(root){
      const scope=root||document;
      scope.querySelectorAll?.(CINEMATIC_MEDIA_SELECTOR).forEach(image=>{
        if(!image.dataset.pcCinematicFitBound){
          image.dataset.pcCinematicFitBound='1';
          image.addEventListener('load',()=>fitCinematicImage(image));
        }
        if(image.complete && image.naturalWidth) fitCinematicImage(image);
      });
    }

    function renderPage(){
      const el=ensureOverlay();
      const activePages=getActivePages();
      const cfg=getSequenceConfig();
      const page=activePages[state.pageIndex] || activePages[0];
      syncImmortalityRangeAudio(page);
      state.canAdvance=false;
      state.transitioning=false;
      clearSequenceTimers();
      clearCinematicMediaFit(el);
      el.classList.remove('input-ready','frame-ready','page-reveal','black-transition','major-transition','normal-transition');
      el.className = el.className.replace(/\bpc5152as-layout-[^\s]+/g,'').replace(/\s{2,}/g,' ').trim();
      const stageLayout = (function(){
        if(state.activeRecord===IMMORTALITY_RECORD){
          if(page.layout==='photoLarge') return 'field-photo';
          if(page.layout==='redLog') return 'terminal-log';
          if(page.layout==='peoplePair') return 'personnel';
          return page.image ? 'field-brief' : 'terminal-brief';
        }
        if(page.layout==='warningCard') return 'warning-card';
        if(page.layout==='warningNotice') return 'warning-notice';
        if(page.layout==='classificationChart') return 'classification-chart';
        if(page.layout==='evidenceCenter') return 'evidence-center';
        if(page.layout==='victimSlide') return 'victim-slide';
        if(page.layout==='evidencePhoto') return 'evidence-photo';
        if(page.layout==='twoColumn') return 'two-column';
        if(page.group==='system') return 'warning-title';
        if(page.group==='warning') return 'warning-card';
        if(page.group==='return') return 'end-card';
        if(page.image && /MASKED FORM|BLOOD LAKE|SUPPRESSED ENTITY/.test(String(page.code||''))) return 'evidence-photo';
        if(page.image) return 'two-column';
        return 'brief-text';
      })();
      el.dataset.pc5152asLayout = stageLayout;
      el.dataset.pc5152asGroup = page.group || '';
      el.classList.add('pc5152as-layout-'+stageLayout);
      void el.offsetWidth;
      el.classList.add('page-reveal');
      el.classList.toggle('pc5152u-people-page', page.layout==='peoplePair');
      el.classList.toggle('pc5152v-photo-large-page', page.layout==='photoLarge');
      el.classList.toggle('pc5152v-red-log-page', page.layout==='redLog');
      el.classList.toggle('pc5152db-postflash-page', Array.isArray(page.postFlashLines)&&page.postFlashLines.length>0);
      el.querySelector('[data-seq-code]').textContent=page.code;
      const source=el.querySelector('[data-seq-source]');
      if(source) source.textContent=cfg.sourceLabel||'F.H.C / LOCAL COPY';
      const sequenceTitle=el.querySelector('[data-seq-title]');
      const visibleTitle=(page.hideTitle || page.layout==='redLog' || page.layout==='evidenceCenter' || page.layout==='victimSlide' || page.layout==='photoLarge' || page.layout==='classificationChart')?'':String(page.title||'');
      if(sequenceTitle){
        if(state.activeRecord===FERALS_RECORD) sequenceTitle.innerHTML=highlightFeralTerms(escSeq(visibleTitle));
        else sequenceTitle.textContent=visibleTitle;
      }
      const bodyEl=el.querySelector('[data-seq-body]');
      const lines=buildSequenceLines(page);
      if(page.layout==='peoplePair' && Array.isArray(page.people)){
        const people=page.people.map((person)=>'<figure class="pc5152u-person-card is-visible"><img src="'+prefix()+person.image+'" alt="'+escSeq(person.name)+'"/><figcaption class="pc5152w-person-caption"><b class="pc5152v-name-blue">'+escSeq(person.name)+'</b><span>'+escSeq(person.role)+'</span></figcaption></figure>').join('');
        bodyEl.innerHTML='<h3 class="pc5152k-seq-subtitle">'+escSeq(page.subtitle||'')+'</h3><div class="pc5152u-people-pair">'+people+'</div>';
      }else if(page.layout==='photoLarge' && page.image){
        bodyEl.innerHTML=buildPhotoLargeBlock(page,lines);
      }else if(page.layout==='classificationChart' && page.image){
        bodyEl.innerHTML=buildClassificationChartBlock(page);
      }else if(page.layout==='evidenceCenter' && page.image){
        bodyEl.innerHTML=buildEvidenceCenterBlock(page);
      }else if(page.layout==='victimSlide' && page.image){
        bodyEl.innerHTML=buildVictimSlideBlock(page);
      }else if(page.layout==='redLog'){
        bodyEl.innerHTML=buildRedLogBlock(page,lines);
      }else{
        const postFlash=Array.isArray(page.postFlashLines)&&page.postFlashLines.length
          ?'<div class="pc5152cz-post-flash" data-seq-postflash>'+page.postFlashLines.map(line=>'<span>'+escSeq(line)+'</span>').join('')+'</div>'
          :'';
        bodyEl.innerHTML=(page.subtitle?'<h3 class="pc5152k-seq-subtitle">'+highlightFeralTerms(escSeq(page.subtitle))+'</h3>':'')+'<div class="pc5152k-seq-lines pc5152v-default-red-lines">'+lines+postFlash+'</div>';
      }
      el.querySelector('[data-seq-frame]').textContent=page.frame;
      el.querySelector('[data-seq-counter]').textContent=String(state.pageIndex+1).padStart(2,'0')+' / '+String(activePages.length).padStart(2,'0');
      const img=el.querySelector('[data-seq-image]');
      const fig=el.querySelector('[data-seq-figure]');
      if(page.layout==='peoplePair' || page.layout==='photoLarge' || page.layout==='evidenceCenter' || page.layout==='victimSlide' || page.layout==='classificationChart'){
        img.removeAttribute('src');
        fig.hidden=true;
        state.revealTimers.push(setTimeout(()=>{ 
          el.classList.add('frame-ready'); 
          if(state.activeRecord===IMMORTALITY_RECORD && page.photoSfx) playLocal(state.photoClick);
          if(state.activeRecord===SAKUMA_RECORD && page.photoSfx && !page.specialSequence) playLocal(state.sakumaProjector);
        }, 650));
      }else if(page.image){
        img.src=prefix()+page.image;
        fig.hidden=false;
        state.revealTimers.push(setTimeout(()=>{ 
          el.classList.add('frame-ready'); 
          if(state.activeRecord===IMMORTALITY_RECORD && page.photoSfx) playLocal(state.photoClick);
        }, 900));
      }else{
        img.removeAttribute('src');
        fig.hidden=true;
      }
      fitCinematicImages(el);
      const status=el.querySelector('[data-seq-status]');
      status.textContent='SIGNAL READING...';
      state.lineEls=[...bodyEl.querySelectorAll('.pc5152k-seq-line')];
      state.nextLineIndex=0;
      state.currentLineDelay=Number(page.lineDelay||2500);
      state.mutationAppliedPage=-1;
      updateImmortalityLatePulse(page);
      if(state.lineEls.length){
        if(state.activeRecord!==IMMORTALITY_RECORD){
          const runId=state.runId;
          state.revealTimers.push(setTimeout(()=>{
            if(runId!==state.runId) return;
            state.lineEls.forEach(line=>line.classList.add('visible'));
            state.nextLineIndex=state.lineEls.length;
            if(runSakumaBirthdaySequence(page,runId)) return;
            const postHold=runEvidencePostReveal(page, bodyEl, runId);
            if(postHold>0){
              state.revealTimers.push(setTimeout(()=>{ if(runId===state.runId) setSequenceInputAvailable(); }, postHold));
            }else{
              setSequenceInputAvailable();
            }
          }, Number(page.blockDelay||(page.layout==='victimSlide'?650:220))));
        }else{
          scheduleNextSequenceLine(Number(page.firstLineDelay||(page.layout==='photoLarge'?420:650)));
        }
      }else{
        const runId=state.runId;
        state.timer=setTimeout(()=>{ if(runId===state.runId) setSequenceInputAvailable(); }, 900);
      }
    }

    function startSequence(recordId){
      if(!SEQUENCE_RECORDS.has(recordId)) return false;
      document.body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open');
      const shellMenu=document.querySelector('.pc5152an-menu');
      if(shellMenu){
        shellMenu.textContent='☰';
        shellMenu.setAttribute('aria-expanded','false');
        shellMenu.setAttribute('aria-label','사이드 메뉴 열기');
      }
      silenceMenuAmbientDuringSequence();
      hardResetSequenceRuntime();
      state.activeRecord=recordId;
      state.pages=cinematicRegistry?.pages?.(recordId)||[];
      if(!state.pages.length) return false;
      state.pageIndex=0;
      state.finishing=false;
      state.endingPlayed=false;
      state.endingPlaying=false;
      state.canAdvance=false;
      state.autoPaused=false;
      ensureSpecialAudio();
      const cfg=getSequenceConfig();
      const runId=state.runId;
      const launchSequence=()=>{
        if(runId!==state.runId) return;
        const el=ensureOverlay();
        const video=el.querySelector('.pc5152h-seq-video');
        const tv=el.querySelector('.pc5152m-transition-video');
        const endingVideo=el.querySelector('.pc5152q-ending-video');
        const panel=el.querySelector('.pc5152h-seq-panel');
        if(panel) panel.hidden=true;
        document.body.classList.remove('pc5152q-immortality-sequence','pc5152h-cult-source-sequence');
        document.body.classList.add('pc5152h-sequence-open','pc5152i-sequence-intro-playing',cfg.bodyClass||'pc5152h-cult-source-sequence');
        silenceMenuAmbientDuringSequence();
        el.classList.remove('pc5152q-immortality-mode','pc5152h-cult-mode','ending-mode');
        el.classList.add(cfg.key==='immortality'?'pc5152q-immortality-mode':'pc5152h-cult-mode');
        if(video && video.getAttribute('src')!==prefix()+cfg.introVideo){ video.src=prefix()+cfg.introVideo; video.load(); }
        if(tv && tv.getAttribute('src')!==prefix()+cfg.transitionVideo){ tv.src=prefix()+cfg.transitionVideo; }
        if(endingVideo && cfg.endingVideo && endingVideo.getAttribute('src')!==prefix()+cfg.endingVideo){ endingVideo.src=prefix()+cfg.endingVideo; }
        if(recordId!==SAKUMA_RECORD && cfg.bgm && state.bgm){
          try{
            state.bgm.currentTime=0;
            state.bgm.volume=Number(cfg.bgmVolume||.54);
            state.bgm.play().catch(()=>{});
          }catch(e){}
        }
        el.setAttribute('aria-hidden','false');
        el.classList.add('show','intro-mode');
        el.classList.remove('pages-mode','input-ready','frame-ready','page-reveal');
        el.querySelector('[data-seq-code]').textContent='DAMAGED SIGNAL / PLAYBACK';
        el.querySelector('[data-seq-title]').textContent='';
        el.querySelector('[data-seq-body]').textContent='';
        el.querySelector('[data-seq-frame]').textContent='';
        el.querySelector('[data-seq-counter]').textContent='';
        el.querySelector('[data-seq-status]').textContent='VIDEO SIGNAL PLAYBACK...';
        const fig=el.querySelector('[data-seq-figure]');
        if(fig) fig.hidden=true;

        let moved=false;
        const beginSequencePages=()=>{
          if(runId!==state.runId) return;
          if(moved) return;
          moved=true;
          clearTimeout(state.timer);
          try{ video.pause(); video.currentTime=0; }catch(e){}
        try{ if(tv){ tv.pause(); tv.currentTime=0; } }catch(e){}
        try{ if(endingVideo){ endingVideo.pause(); endingVideo.currentTime=0; } }catch(e){}
          el.classList.remove('intro-mode','input-ready','frame-ready','page-reveal');
          el.classList.add('pages-mode');
          if(panel) panel.hidden=false;
          document.body.classList.remove('pc5152i-sequence-intro-playing');
          try{
            if(cfg.bgm && state.bgm){
              state.bgm.volume=Number(cfg.bgmVolume||.78);
              if(state.bgm.paused) state.bgm.play().catch(()=>{});
            }
          }catch(e){}
          renderPage();
        };

        try{
          video.loop=false;
          video.muted=false;
          video.volume=Number(cfg.introVolume||.68);
          video.currentTime=0;
          video.onended=beginSequencePages;
          const playPromise=video.play();
          if(playPromise && playPromise.catch) playPromise.catch(()=>{
            if(runId!==state.runId) return;
            try{
              video.muted=true;
              video.volume=0;
              const mutedRetry=video.play();
              if(mutedRetry&&mutedRetry.catch) mutedRetry.catch(()=>{});
            }catch(e){}
          });
        }catch(e){
          setTimeout(()=>{ if(runId===state.runId) beginSequencePages(); },900);
        }
        // Safety fallback for browsers that do not fire ended.
        const introDuration=Number(cfg.introDuration||0);
        state.timer=setTimeout(()=>{ if(runId===state.runId) beginSequencePages(); },introDuration>0?introDuration:Number(cfg.introFallback||10450));
      };
      launchSequence();
      return true;
    }

    function openRecordBodyDirect(recordId){
      const archiveViewer=document.getElementById('archiveRecordViewer');
      const archiveListWrap=document.getElementById('archiveListWrap');
      if(!archiveViewer) return;
      const selected=archiveViewer.querySelector('.record-detail[data-record="'+recordId.replace(/"/g,'\\"')+'"]');
      if(!selected){
        if(state.nativeShow) state.nativeShow(recordId);
        return;
      }
      if(archiveListWrap){
        archiveListWrap.classList.add('is-hidden');
        archiveListWrap.querySelectorAll('details').forEach(d=>d.open=true);
      }
      archiveViewer.hidden=false;
      archiveViewer.querySelectorAll('.record-detail').forEach(el=>{el.hidden=true;});
      selected.hidden=false;
      document.body.classList.add('pc5133-case-file-open','pc5152h-sidecontent-rebased');
      const c=document.querySelector('.uac-shell-content');
      if(c) c.scrollTop=0;
      try{ playCue('open',200); }catch(e){}
    }

    function finishSequence(skipEnding){
      if(state.finishing) return;
      const cfg=getSequenceConfig();
      const el=state.overlay;
      if(!skipEnding && cfg.endingVideo && !state.endingPlayed && el){
        state.endingPlayed=true;
        state.endingPlaying=true;
        state.canAdvance=false;
        state.transitioning=true;
        clearSequenceTimers();
        stopSequenceAudio();
        const ending=el.querySelector('.pc5152q-ending-video');
        el.classList.remove('input-ready','frame-ready','page-reveal','intro-mode','pages-mode','black-transition','major-transition','normal-transition','video-transition');
        el.classList.add('show','ending-mode');
        el.setAttribute('aria-hidden','false');
        el.querySelector('[data-seq-code]').textContent='F.H.C END MARK / PLAYBACK';
        el.querySelector('[data-seq-title]').textContent='';
        el.querySelector('[data-seq-body]').innerHTML='';
        el.querySelector('[data-seq-frame]').textContent='WAY TO THE ETERNITY';
        el.querySelector('[data-seq-counter]').textContent='';
        const source=el.querySelector('[data-seq-source]');
        if(source) source.textContent=cfg.sourceLabel||'F.H.C / RECOVERED SOURCE';
        const fig=el.querySelector('[data-seq-figure]');
        if(fig) fig.hidden=true;
        el.querySelector('[data-seq-status]').textContent='F.H.C ENDING MARKER';
        let ended=false;
        const complete=()=>{
          if(ended) return;
          ended=true;
          clearTimeout(state.timer);
          state.endingPlaying=false;
          state.transitioning=false;
          try{ ending.pause(); ending.currentTime=0; }catch(e){}
          finishSequence(true);
        };
        try{
          if(ending.getAttribute('src')!==prefix()+cfg.endingVideo) ending.src=prefix()+cfg.endingVideo;
          ending.loop=false;
          ending.muted=false;
          ending.volume=.82;
          ending.currentTime=0;
          ending.onended=complete;
          const playPromise=ending.play();
          if(playPromise && playPromise.catch) playPromise.catch(()=>setTimeout(complete,900));
        }catch(e){
          setTimeout(complete,900);
        }
        state.timer=setTimeout(complete,17000);
        return;
      }
      state.finishing=true;
      clearSequenceTimers();
      stopSequenceAudio();
      if(el){
        const video=el.querySelector('.pc5152h-seq-video');
        const tv=el.querySelector('.pc5152m-transition-video');
        const ending=el.querySelector('.pc5152q-ending-video');
        try{ video.onended=null; video.pause(); video.currentTime=0; }catch(e){}
        try{ tv.onended=null; tv.pause(); tv.currentTime=0; }catch(e){}
        try{ ending.onended=null; ending.pause(); ending.currentTime=0; }catch(e){}
        try{ if(state.immortalityStep){ state.immortalityStep.pause(); state.immortalityStep.currentTime=0; } }catch(e){}
        el.classList.remove('show','input-ready','frame-ready','page-reveal','intro-mode','pages-mode','ending-mode','sakuma-bridge-mode','pc5152q-immortality-mode','pc5152h-cult-mode','pc5152u-people-page','pc5152v-photo-large-page','pc5152v-red-log-page','pc5152db-postflash-page');
        el.className = el.className.replace(/\bpc5152as-layout-[^\s]+/g,'').replace(/\s{2,}/g,' ').trim();
        el.removeAttribute('data-pc5152as-layout');
        el.removeAttribute('data-pc5152as-group');
        el.setAttribute('aria-hidden','true');
      }
      document.body.classList.remove('pc5152h-sequence-open','pc5152i-sequence-intro-playing','pc5133-case-file-open','pc5152q-immortality-sequence','pc5152h-cult-source-sequence');
      try{ window.ProjectCurseAudio?.syncAudioState?.(); }catch(e){}
      const archiveViewer=document.getElementById('archiveRecordViewer');
      const archiveListWrap=document.getElementById('archiveListWrap');
      if(archiveViewer){
        archiveViewer.hidden=true;
        archiveViewer.querySelectorAll('.record-detail').forEach(el=>{el.hidden=true;});
      }
      if(archiveListWrap){
        archiveListWrap.classList.remove('is-hidden');
        archiveListWrap.querySelectorAll('details').forEach(d=>d.open=true);
      }
      const c=document.querySelector('.uac-shell-content');
      if(c) c.scrollTop=0;
      state.activeRecord=null;
      state.pages=null;
      state.pageIndex=0;
      state.canAdvance=false;
      state.transitioning=false;
      state.finishing=false;
      state.endingPlaying=false;
      state.endingPlayed=false;
      state.specialMediaActive=false;
      state.lineEls=[];
      state.nextLineIndex=0;
      state.autoPaused=false;
      state.autoDelay=0;
      state.runId=(state.runId||0)+1;
      try{  }catch(e){}
    }

    function advanceSequence(){
      const el=state.overlay;
      if(el && (el.classList.contains('intro-mode') || el.classList.contains('ending-mode') || document.body.classList.contains('pc5152i-sequence-intro-playing'))) return;
      if(state.transitioning) return;
      clearTimeout(state.autoTimer);
      state.autoTimer=null;
      if(el) el.classList.remove('pc-cinematic-counting');
      if(!state.canAdvance){
        revealNextSequenceLine(true);
        return;
      }
      const currentPage=getActivePages()[state.pageIndex] || null;
      if(state.activeRecord!=='Immortality_860201' && currentPage && currentPage.mutation && state.mutationAppliedPage!==state.pageIndex){
        const bodyEl=el ? el.querySelector('[data-seq-body]') : null;
        if(applyEvidenceMutation(currentPage, bodyEl)){
          state.mutationAppliedPage=state.pageIndex;
          state.canAdvance=true;
          scheduleAutomaticAdvance(5600);
          return;
        }
      }
      if(state.pageIndex < getActivePages().length-1){
        if(state.activeRecord===IMMORTALITY_RECORD){
          state.canAdvance=false;
          state.pageIndex += 1;
          renderPage();
        }else{
          beginBlackTransition(state.pageIndex + 1);
        }
      }else{
        finishSequence();
      }
    }

    function previousSequence(){
      const el=state.overlay;
      if(!el||!el.classList.contains('pages-mode')||state.transitioning||state.pageIndex<=0) return;
      clearSequenceTimers();
      state.pageIndex-=1;
      state.mutationAppliedPage=-1;
      renderPage();
    }

    function toggleSequencePlayback(){
      const el=state.overlay;
      if(!el||!el.classList.contains('pages-mode')) return;
      state.autoPaused=!state.autoPaused;
      if(state.autoPaused){
        clearTimeout(state.autoTimer);
        clearTimeout(state.lineTimer);
        state.autoTimer=null;
        state.lineTimer=null;
        el.classList.remove('pc-cinematic-counting');
        const status=el.querySelector('[data-seq-status]');
        if(status) status.innerHTML='PLAYBACK PAUSED <em>수동 탐색 가능</em>';
      }else if(state.nextLineIndex<(state.lineEls||[]).length){
        scheduleNextSequenceLine(220);
      }else if(state.canAdvance){
        const status=el.querySelector('[data-seq-status]');
        if(status) status.innerHTML='AUTO PLAY <em>다음 기록면 대기</em>';
        scheduleAutomaticAdvance();
      }
      syncCinematicControls();
    }

    function restartSequence(){
      const recordId=state.activeRecord;
      if(recordId) startSequence(recordId);
    }

    function handleSequenceAction(action){
      if(action==='previous') previousSequence();
      else if(action==='toggle') toggleSequencePlayback();
      else if(action==='next') advanceSequence();
      else if(action==='restart') restartSequence();
    }

    function getRecordIdFromEventTarget(target){
      const btn=target.closest && target.closest('.open-record[data-record]');
      if(btn && btn.closest && btn.closest('#archiveListWrap .doc-card')) return btn.dataset.record;
      return null;
    }

    document.addEventListener('click', function(e){
      const action=e.target.closest&&e.target.closest('[data-seq-action]');
      if(state.overlay&&state.overlay.classList.contains('show')&&action){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
        handleSequenceAction(action.dataset.seqAction);
        return;
      }
      if(state.overlay && state.overlay.classList.contains('show') && e.target.closest && e.target.closest('.pc5152x-seq-return')){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        finishSequence(true);
        return;
      }
      if(state.overlay && state.overlay.classList.contains('show')){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        advanceSequence();
        return;
      }
      const id=getRecordIdFromEventTarget(e.target);
      if(SEQUENCE_RECORDS.has(id)){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        startSequence(id);
      }
    }, true);

    
    document.addEventListener('touchend', function(e){
      const action=e.target.closest&&e.target.closest('[data-seq-action]');
      if(state.overlay&&state.overlay.classList.contains('show')&&action){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
        handleSequenceAction(action.dataset.seqAction);
        return;
      }
      if(state.overlay && state.overlay.classList.contains('show') && e.target.closest && e.target.closest('.pc5152x-seq-return')){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        finishSequence(true);
        return;
      }
      if(state.overlay && state.overlay.classList.contains('show')){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        advanceSequence();
      }
    }, {capture:true, passive:false});

    document.addEventListener('keydown', function(e){
      if(!(state.overlay && state.overlay.classList.contains('show'))) return;
      if(e.target.closest&&e.target.closest('[data-seq-action]')) return;
      if(e.key==='ArrowLeft'){e.preventDefault();previousSequence();return;}
      if(e.key==='ArrowRight'){e.preventDefault();advanceSequence();return;}
      if(e.key==='p'||e.key==='P'){e.preventDefault();toggleSequencePlayback();return;}
      if(e.key==='r'||e.key==='R'){e.preventDefault();restartSequence();return;}
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        advanceSequence();
      }
    }, true);

    let cinematicResizeFrame=0;
    window.addEventListener('resize',()=>{
      cancelAnimationFrame(cinematicResizeFrame);
      cinematicResizeFrame=requestAnimationFrame(()=>{
        if(state.overlay?.classList.contains('show')) fitCinematicImages(state.overlay);
      });
    },{passive:true});

    document.addEventListener('click', function(e){
      if(e.target.closest && e.target.closest('.record-back')){
        stopSequenceAudio();
        document.body.classList.remove('pc5152h-sequence-open','pc5152i-sequence-intro-playing');
      }
    }, true);

    if(state.nativeShow){
      window.ProjectCurseShowInternalRecord=function(id){
        if(SEQUENCE_RECORDS.has(id)) return startSequence(id);
        return state.nativeShow(id);
      };
    }

    function markSideContent(){
      document.querySelectorAll('.content-page, .record-detail, .archive-record-viewer').forEach(el=>el.classList.add('pc5152h-terminal-doc'));
      const viewer=document.getElementById('archiveRecordViewer');
      if(viewer) viewer.classList.add('pc5152h-record-viewer');
      const cultCard=[...document.querySelectorAll('.doc-card')].find(card=>{
        const b=card.querySelector('.open-record[data-record="Cults_871104"]');
        return !!b;
      });
      if(cultCard){
        cultCard.classList.add('pc5152h-sequence-card');
        if(!cultCard.querySelector('.pc5152h-seq-chip')){
          const chip=document.createElement('span');
          chip.className='pc5152h-seq-chip';
          chip.textContent='SEQUENCE ATTACHED';
          (cultCard.querySelector('.status-row')||cultCard).appendChild(chip);
        }
      }
    }

    markSideContent();
    [160,520,1200,2400].forEach(t=>setTimeout(markSideContent,t));

    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152h:'AudioClarity SideContent TerminalNoise RecordSequence',
      audioMode:'clearer terminal contact + special cult sequence bgm only inside sequence',
      recordSequence:'Cults_871104 + Ferals_860722 + Immortality_860201; timed input gate; click advances after INPUT AVAILABLE',
      noiseMode:'global terminal noise reduced; VHS/video overlay isolated to sequence'
    });
    window.ProjectCurseRecordCinematic={
      version:'5.15.2cl',
      start:startSequence,
      previous:previousSequence,
      next:advanceSequence,
      toggle:toggleSequencePlayback,
      restart:restartSequence
    };
  });
})();

// Cult recording radio-static layer. This belongs to the cinematic runtime,
// never to the site shell or navigation audio.
(function(){
  'use strict';
  const ready=(fn)=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',fn,{once:true})
    : fn();
  ready(function(){
    const path=location.pathname||'';
    const prefix=path.includes('/docs/')?'../../':path.includes('/archive/')?'../':'';
    const layer=new Audio(prefix+'assets/audio/pc5152an_cult_radio_static_layer.mp3');
    layer.loop=true;
    layer.preload='metadata';
    const sync=()=>{
      const active=document.body.classList.contains('pc5152h-cult-source-sequence')
        && !document.body.classList.contains('pc5152q-immortality-sequence');
      layer.volume=window.innerWidth<=899?.10:.17;
      if(active&&window.ProjectCurseAudio?.isOn?.()!==false){
        if(layer.paused) layer.play().catch(()=>{});
      }else{
        try{layer.pause();layer.currentTime=0;}catch(_e){}
      }
    };
    new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
    window.addEventListener('resize',sync,{passive:true});
    sync();
  });
})();
