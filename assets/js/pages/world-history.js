(() => {
  const root = document.getElementById('history');
  if (!root) return;

  root.classList.add('pc-world-history');
  root.innerHTML = `
    <header class="pc-world-history-head">
      <div class="label">세계 기록 / 복구 연표</div>
      <h2>세계 사건 연표</h2>
      <p>1975년의 공간 개척 실험부터 위버멘시 프로젝트 폐기까지. 이후의 전투는 아직 종결되지 않았다.</p>
    </header>
    <div class="pc-world-history-range">1975–2006 / ONGOING</div>
    <section class="pc-world-history-list" aria-label="세계 사건 연표">
      <details class="pc-world-history-entry">
        <summary><time>1975.09.12</time><strong>아마리온 설립</strong><small>공간 개척과 자원 독점을 목표로 한 미국 연구기업.</small></summary>
        <div class="pc-world-history-entry-copy"><p>아마리온은 인구 증가와 자원 고갈에 대응한다는 명분 아래 저근접 자기 왜곡 시스템을 개발했다. 이 계획은 새로운 공간으로 이어지는 입구를 만들어 접근권과 자원을 독점하려는 사업이었다.</p><p>당시 이 계획은 재난 대비와 자원 개발 사업으로 설명됐으며, 이상현상을 의도적으로 만들려는 시도라는 사실은 외부에 알려지지 않았다. 아마리온의 연구 인력과 자금은 이후 F.H.C의 초기 기반으로 넘어간다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>1975년 이후</time><strong>왜곡 시스템 실행</strong><small>우시노다교 관련 이상현상의 초기 흔적.</small></summary>
        <div class="pc-world-history-entry-copy"><p>프로젝트 실행 이후 우시노다교와 연결된 것으로 보이는 이상현상과 활동 흔적이 나타났다. 기술 실행과 교단의 출현 사이의 인과는 확인되지 않았으나, 정부 내부에서는 두 사건을 함께 감시하기 시작했다.</p><p>초기 보고는 실종, 생체 변질, 통신 장애, 설명할 수 없는 종교 집회처럼 서로 다른 사건으로 흩어져 있었다. 당시에는 하나의 위협으로 묶이지 않았지만, 이후 기록은 이 시기를 리버스 이전의 전조로 재분류한다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>1982.03.22</time><strong>F.H.C 설립</strong><small>아마리온의 연구 기반을 잇는 새로운 기업.</small></summary>
        <div class="pc-world-history-entry-copy"><p>F.H.C는 정부와 기술 연구 계약을 체결하며 공식적인 보호와 영향력을 확보했다. 아마리온 시절의 공간 연구 자료와 인력은 이 기업의 기반으로 이어졌다.</p><p>대외적으로 F.H.C는 기술·연구 기업으로 자리 잡았지만, 내부에는 공간 연구와 이상현상 자료를 다룰 수 있는 비공개 인력이 남아 있었다. 정부 계약은 이후 의혹이 제기될 때마다 F.H.C가 연구를 지속할 수 있게 하는 방패가 된다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>1982년 이후</time><strong>비밀 U.A.C 감시망</strong><small>아이반 레스작이 만든 비공개 감시 체계.</small></summary>
        <div class="pc-world-history-entry-copy"><p>아이반 레스작은 F.H.C와 우시노다교의 연결을 감시하기 위해 U.A.C 전신 조직을 세웠다. 그의 비인가 작전과 기억 소실 의혹, 작전지 인근의 검은 타르 목격담은 미확인 기록으로 남았다.</p><p>초기 조직의 목적은 구조나 봉쇄가 아니라 감시와 기록이었다. 구성원, 자금 출처, 작전 권한은 대부분 확인되지 않았고, 레스작 자신과 접촉했던 인물들조차 그의 존재를 정확히 기억하지 못했다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>1986.07.25</time><strong>「불멸을 향하여」 작전</strong><small>피의 호수에 대한 F.H.C의 본격 개입.</small></summary>
        <div class="pc-world-history-entry-copy"><p>F.H.C는 독일 본토 ██ 지역의 피의 호수에 개입해 잔류물과 조사원의 사체까지 연구 대상으로 삼았다. U.A.C는 이 사건을 통해 F.H.C가 교단의 힘을 활용 가능한 자원으로 본다고 확신했다.</p><p>이후 N.H.C 전신 인원은 F.H.C 시설과 교단 거점을 비인가 방식으로 저지하기 시작했지만, 우시노다교의 침투는 이미 여러 국가와 기관으로 퍼지고 있었다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>1989.08.23</time><strong>도쿄 지부 기록</strong><small>F.H.C 교육기관 내부의 이상 징후 확인.</small></summary>
        <div class="pc-world-history-entry-copy"><p>사쿠마 유타의 기록에서 <em>Basic Of Blood Path</em>와 <em>Basic Of Flesh Path</em>가 교육되고, 인간으로 위장한 괴이의 피해 사례가 나타난 사실이 확인됐다. 여러 기관 소속 인원의 비정상적 사망에도 각국 정부는 이를 연결된 사건으로 다루지 않았다.</p><p>이 기록은 우시노다교가 외부에서 침입하는 세력이 아니라, 교육·연구·행정 체계 안에 자리를 잡고 있음을 보여줬다. F.H.C는 해당 교재와 사망 사례의 연관성을 부인했고, 관련 자료는 오랫동안 분산 보관됐다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>1993.11.02</time><strong>U.A.C 공식 설립</strong><small>비밀 감시망이 초국가 대응 기관으로 공개됨.</small></summary>
        <div class="pc-world-history-entry-copy"><p>갑작스러운 설립 선언은 각국의 반발을 불렀지만, 레스작이 미리 포섭한 정부 내부 인물들이 혼란을 잠재웠다. U.A.C는 이름에 국제연합을 사용하지만 UN 산하기관은 아니며, 각국의 협력과 자체 정보망으로 움직이는 독립기관으로 공개됐다. 같은 시기 S.I.D와 N.H.C가 각국에 설치되며 공식 대응 체계가 만들어졌다.</p><p>F.H.C의 리버스 피해와 불법 납치, 우시노다교의 위험도 세상에 알려지기 시작했다. F.H.C는 TAD를 설립해 내부 정화와 대응을 수행하는 기업처럼 보이려 했다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>1993년 이후</time><strong>S.O.N 형성</strong><small>반 U.A.C 국가 세력과 F.H.C 지원망의 결집.</small></summary>
        <div class="pc-world-history-entry-copy"><p>U.A.C에 반감을 가진 일부 국가 세력과 F.H.C의 비밀 지원망은 S.O.N(Shadow Of Nemesis)을 형성했다. 이들은 우시노다교를 맹신하는 집단이 아니라, 교단의 힘과 혼란을 이용해 세계 질서를 바꾸려는 세력이었다.</p><p>초기 S.O.N은 국가의 비밀 지원, 기업 자금, 이탈 인력, 암시장 물류를 하나의 느슨한 연결망으로 묶었다. F.H.C는 이들이 독자 세력처럼 움직일 수 있게 시설과 연결 경로를 제공하면서도, 공식적으로는 직접 관계를 부정했다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>1995.03.20</time><strong>도쿄 지하철 사건 비공개 개입</strong><small>N.H.C와 S.O.N의 첫 현장 교전.</small></summary>
        <div class="pc-world-history-entry-copy"><p>우시노다교가 도쿄 지하철에서 이상현상을 일으키려 하자 N.H.C가 개입했다. 작전 중 S.O.N 인원과 교전이 발생했고, 피해 확산은 완전히 막지 못했다.</p><p>N.H.C의 개입과 S.O.N의 존재는 공식 조사에서 지워졌다. 이 사건은 도심 테러와 리버스, 교단 활동을 더 이상 분리해서 다룰 수 없다는 판단을 남겼고, 도시권 대응 체계 확대의 직접적인 계기가 된다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>1997.01.27</time><strong>리버스·괴이 분류</strong><small>이상현상과 비인간 개체의 공식 명명.</small></summary>
        <div class="pc-world-history-entry-copy"><p>U.A.C는 반복되는 이상현상을 리버스(Rebirth), 그 과정에서 나타나는 비인간 개체를 괴이(Feral)로 분류했다. 키무라 쿄의 「괴이」는 이후 타락 유형을 정리하는 초기 기준 문서가 된다.</p><p>키무라 쿄는 사쿠마 유타와 함께 피해 사례를 기록했던 인물이다. 보고서는 괴이를 단순한 적대 개체가 아니라, 인간 위장·타락·빙의·현상 잔류처럼 서로 다른 양상을 보이는 존재로 다루기 시작했다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>1999.07.12</time><strong>위버멘시 프로젝트</strong><small>교단의 권능을 재현하려 한 U.A.C 비공개 실험.</small></summary>
        <div class="pc-world-history-entry-copy"><p>리버스가 잦아지고 정부 내부의 침투가 지속되자 U.A.C는 방랑자를 회수하고, 인위적 타락과 그림자 빙의를 재현하는 불법 인체실험을 승인했다. 수감자와 신원 불명 인원은 실험체로 소모됐고, 결과는 특수 장비와 전력 개발 자료로 축적됐다.</p><p>방랑자는 리버스 생존 뒤 감각이 비정상적으로 발달한 인물, 사망자의 영혼 형태 괴이가 주변에 남은 인물, 부분 타락을 견딘 인물, 엘드리치 빙의 뒤 자아를 유지한 인물을 포괄했다. U.A.C는 이들을 보호 대상이 아니라 교단의 힘을 재현할 자원으로 다뤘다.</p><p>프로젝트 내부에서는 정화 대상 선정과 기억 삭제, 강제 빙의 실험이 병행됐다. 이 시기의 기록은 U.A.C가 교단을 막기 위해 교단의 방식을 모방하기 시작한 분기점으로 남는다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>2001.07.21</time><strong>N.H.C·S.I.D 독립 개편</strong><small>U.A.C의 정부 개입과 세대교체에 대비한 분리.</small></summary>
        <div class="pc-world-history-entry-copy"><p>N.H.C와 S.I.D는 독자 지휘 체계를 가진 기관으로 재편됐다. U.A.C는 법적 접근권, 통행, 정보, 자산을 지원하고, N.H.C는 군사 대응을, S.I.D는 도시 감시·수사와 P.O.H 추적을 맡는다.</p><p>개편의 이유는 U.A.C가 각국 정부의 인사·예산·정치 개입을 피할 수 없게 됐기 때문이다. 두 기관은 형식상 독립했지만, U.A.C 지원 없이는 국제 작전과 정보 접근을 유지할 수 없는 관계로 남았다.</p><p>N.H.C 일부 비공개 편제는 정화(Purge) 작전을 수행하며 오염 의심 지역을 사고와 테러로 위장해 제거했다. 이 작전은 훗날 조직 내부의 불신과 이탈을 낳는 직접적인 원인이 된다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>2002.02.20</time><strong>지상군 리버스 대응 협력</strong><small>N.H.C 기술과 각국 지상군의 공동 대응 체계.</small></summary>
        <div class="pc-world-history-entry-copy"><p>N.H.C 연구 부서는 방호 장비와 특수 탄약, 현장 제압 장비를 개발해 협력국 지상군과 연계했다. 북한·베트남·쿠바 등 공산권 국가와 일부 강대국은 U.A.C의 영향력 확대를 경계해 독자 대응을 선택했다.</p><p>협력권 밖에서 리버스가 발생하면 F.H.C TAD의 무력 대응부대가 현장에 투입됐다. 다수의 현장 인원은 F.H.C와 우시노다교의 연결을 알지 못했다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>2003.02.05</time><strong>도심 리버스 차단망</strong><small>C.A.P-17과 C.I. 스캐너의 보급.</small></summary>
        <div class="pc-world-history-entry-copy"><p>U.A.C는 C.A.P-17 크로노 앵커 파일런과 C.I. 스캐너를 주요 도심과 공안·군사 거점에 배치했다. 이 장비는 리버스 자체를 막기보다, 발생 뒤 피해가 도시 전체로 퍼지는 범위를 제한하기 위한 인프라였다.</p><p>도시권의 공안 기관, 정규군, N.H.C, S.I.D는 같은 탐지·봉쇄 정보를 공유하게 됐다. 차단망이 충분히 설치되지 않은 외곽 지역과 비협력국은 계속 취약 지대로 남았고, F.H.C TAD는 그 공백에서 영향력을 확대했다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>2005.01.21</time><strong>애시 크루 등장</strong><small>리버스 직후의 현장에 투입되는 민간 기반 조직.</small></summary>
        <div class="pc-world-history-entry-copy"><p>비비안 산체스가 설립한 애시 크루는 N.H.C 산하에 편성됐고, 그 아래 A.R.F와 C.P.D가 조직됐다. 이들은 리버스 이후에도 남는 현장과 생존자 문제를 다루기 위해 활동했다.</p><p>비비안 산체스는 리버스 피해자이자 생존자였다. 애시 크루는 군사 작전이 끝난 뒤에도 시신, 장비, 잔류물, 대피하지 못한 생존자가 남는다는 사실을 전제로 만들어진 조직이었다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>2005.09.01</time><strong>레드울프 부대 이탈</strong><small>웨이드 밀렌과 특수부대원의 S.O.N 합류.</small></summary>
        <div class="pc-world-history-entry-copy"><p>웨이드 밀렌은 특권층 출신이었지만 실제 역경을 겪기 위해 군에 입대해 사관학교를 졸업했다. 초기 파견지에서 리버스를 겪은 뒤 N.H.C에 합류했고, 전투 경험과 판단력으로 레드울프 부대를 이끌었다.</p><p>그는 민간 지역 대량 제거, 도시 전력 차단, 불법 인체실험, 구조된 생존자의 처분을 반복해서 목격하며 U.A.C에 대한 신뢰를 잃었다. 레드울프 부대는 작전 중 이탈해 S.O.N에 합류했고, 내부 전술을 아는 이탈 전력이 됐다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>2006.08.20</time><strong>위버멘시 미국 지부 습격</strong><small>방랑자 10명 구출과 연구자료 유출.</small></summary>
        <div class="pc-world-history-entry-copy"><p>레드울프를 포함한 S.O.N 전력은 위버멘시 프로젝트 미국 지부를 습격해 방랑자 10명과 연구자료 일부를 확보했다. 신원이 확인된 실험 대상자의 자료가 드러나며 U.A.C는 큰 타격을 입었고, 위버멘시 프로젝트의 공식 폐기를 선언했다.</p><p>그러나 U.A.C는 실험의 전체 규모와 피해 기록을 봉인·삭제하며 책임을 숨기려 했다.</p></div>
      </details>
      <details class="pc-world-history-entry">
        <summary><time>2006년 이후</time><strong>종결되지 않은 전쟁</strong><small>기록은 멈췄지만, 리버스와 전투는 계속된다.</small></summary>
        <div class="pc-world-history-entry-copy"><p>N.H.C와 S.I.D는 각지에서 봉쇄와 수사를 계속하고, F.H.C와 TAD는 영향력을 유지한다. S.O.N은 이탈 전력을 흡수하며 U.A.C 체제에 맞서고, 우시노다교는 여전히 여러 사회 내부에서 활동하고 있다.</p><p>구출된 방랑자 10명과 사라진 연구자료의 행방, F.H.C와 우시노다교의 실제 연결, U.A.C가 숨긴 실험의 전체 규모는 확인되지 않았다. 이 기록은 결말이 아니라, 현재까지 이어지는 충돌의 가장 최근 기준점이다.</p></div>
      </details>
    </section>`;

  const extendedRecord = {
    '아마리온 설립': [
      '아마리온을 세운 인물은 훗날 F.H.C를 설립한다. 그는 새로운 공간을 인류 공동의 피난처가 아니라 인구 배분과 자원 공급을 통제할 수 있는 독점 사업권으로 판단했다.',
      '저근접 자기 왜곡 시스템의 세부 원리와 실험 인원은 공개되지 않았다. 실험 뒤 아마리온의 대외 활동은 급격히 줄었지만, 장비와 연구자료가 폐기됐다는 기록도 남아 있지 않다.'
    ],
    '왜곡 시스템 실행': [
      '현장 보고는 실종, 생체 변질, 통신 장애, 기억 누락처럼 서로 다른 사건으로 처리됐다. 지역 기관들은 산업재해나 범죄로 종결했고, 사건 사이의 공통점은 오랫동안 확인되지 않았다.',
      '후대의 U.A.C 분석은 우시노다교의 활동 증가 시점이 왜곡 시스템 실행 이후와 겹친다는 점을 표시했다. 다만 실험이 교단을 불러낸 것인지, 이미 존재하던 통로를 열어 준 것인지는 판정되지 않았다.'
    ],
    'F.H.C 설립': [
      '정부와 체결한 연구 계약은 F.H.C가 시설과 인력을 합법적으로 확장할 수 있게 했다. 이후 설립된 교육기관과 설비기관 역시 이 계약 관계를 바탕으로 각국에 진입했다.',
      'F.H.C는 아마리온과의 연속성을 공식적으로 설명하지 않았다. 그러나 공간 연구에 참여했던 인력과 자료가 사라지지 않고 내부 연구망으로 이동했다는 정황이 반복해서 확인된다.'
    ],
    '비밀 U.A.C 감시망': [
      '레스작이 냉전기에 참여했던 작전들은 대부분 정부의 공식 승인을 받지 않았다. 함께 복무했던 동료와 지인들은 그를 기억하지 못했으며, 강제적인 기억 삭제가 사용됐을 가능성이 제기됐다.',
      '유일하게 남은 현장 증언은 검은 타르 형태의 물질이 숲의 동식물을 뒤덮었다는 내용이다. 이 현상이 레스작의 능력인지, 우시노다교의 개입인지, 별개의 리버스였는지는 확인되지 않았다.'
    ],
    '「불멸을 향하여」 작전': [
      '작전의 목적은 민간인 구조나 현장 봉쇄가 아니었다. F.H.C는 피의 호수와 의식 흔적을 조사하고, 투입 조사원의 사체까지 회수해 결과물의 활용 가능성을 검토했다.',
      '작전 이후 F.H.C 내부와 정부 기관에서 우시노다교의 영향이 동시에 확인됐다. U.A.C는 신원과 소속이 남지 않는 인원들을 모아 N.H.C 전신 전력을 구성하고, 교단 거점에 대한 공격을 테러 사건으로 위장했다.'
    ],
    '도쿄 지부 기록': [
      '교육기관 안에서는 인간으로 위장한 괴이와 접촉한 학생, 신체 일부가 변형된 피해자, 설명할 수 없는 사망자가 이어졌다. 교재는 일반적인 교육자료처럼 배포돼 외부 검열을 피했다.',
      '사쿠마 유타의 기록은 정부가 위험을 몰랐던 것이 아니라, 이미 F.H.C와 교단의 영향 아래 움직이지 않았을 가능성을 제기했다. 이 판단은 U.A.C가 공개 기관으로 전환되는 근거 중 하나가 된다.'
    ],
    'U.A.C 공식 설립': [
      '각국 정부는 독자적인 정보망과 군사조직을 가진 초국가 기관의 등장을 주권 침해로 받아들였다. 설립 반대가 우세했지만 레스작이 미리 포섭한 정부 인사들이 의사결정과 여론을 뒤집었다.',
      '포섭된 인물들의 신원은 공개되지 않았다. 일부 내부 기록은 이들도 레스작과 비슷한 비정상적 능력이나 기억 개입 수단을 가진 인물일 가능성을 남겨 두고 있다.'
    ],
    'S.O.N 형성': [
      'S.O.N을 지원한 세력에는 우시노다의 힘에 심취한 인물뿐 아니라 기술·군사·정치적 이용 가치를 본 국가와 기업도 포함됐다. 이들의 공통점은 U.A.C 중심의 질서를 받아들이지 않았다는 것이다.',
      'S.O.N은 교단의 하위 조직으로 움직이지 않았다. 필요할 때는 우시노다교와 협력했지만, 궁극적인 목적은 그 힘을 이용해 세계의 권력 구조 자체를 바꾸는 데 있었다.'
    ],
    '도쿄 지하철 사건 비공개 개입': [
      'N.H.C는 우시노다교가 현장에서 리버스를 유발하려 한다는 정보를 받고 비공개로 투입됐다. 그러나 작전 구역에서 S.O.N 전력과 교전하면서 봉쇄와 민간인 보호가 동시에 무너졌다.',
      '공식 조사에는 N.H.C와 S.O.N의 존재가 남지 않았다. U.A.C 내부에서는 도심 테러, 교단 의식, 비국가 무장세력이 하나의 사건에서 결합할 수 있다는 최초의 대규모 사례로 분류됐다.'
    ],
    '리버스·괴이 분류': [
      '리버스는 공간·생체·정신·혈성 변화를 포함하는 현상 전체를 가리키며, 괴이는 그 현상에서 출현하거나 인간 사회에 위장한 개체를 뜻한다. 두 용어를 분리하면서 현상과 개체에 서로 다른 대응 절차를 적용할 수 있게 됐다.',
      '키무라 쿄는 사쿠마 유타와 함께 괴이 피해자를 기록했던 인물이다. 그가 작성한 원본은 인간 위장형, 타락형, 빙의형과 같은 사례를 하나의 분류 체계 안에서 비교하려 한 최초의 시도였다.'
    ],
    '위버멘시 프로젝트': [
      'U.A.C는 사형수와 중범죄자뿐 아니라 신원 불명의 납치 피해자와 암거래로 확보한 인원까지 실험체로 사용했다. 대상의 기억은 강제로 삭제됐고, 실패·성공·이례 사례가 모두 별도의 자료로 축적됐다.',
      '포획한 빙의형 괴이인 그림자를 격리실에 투입해 실험체와 신체 소유권을 두고 싸우게 하는 실험도 진행됐다. 연구 결과는 고화력 생체 병기급 요원, 특수 탄약, 현장 제압 장비를 만드는 데 사용됐다.'
    ],
    'N.H.C·S.I.D 독립 개편': [
      '분리는 U.A.C와의 단절이 아니라 지휘권의 분산이었다. 정부가 U.A.C의 지도부와 예산에 개입하더라도 현장 군사조직과 수사망이 동시에 정지하지 않도록 설계됐다.',
      '두 기관은 U.A.C의 법적 권한과 국제 정보망을 계속 사용했지만, 작전 승인과 인력 운용에서는 더 넓은 자율권을 확보했다. 그 결과 효율은 높아졌으나 비공개 작전에 대한 외부 통제는 더욱 어려워졌다.'
    ],
    '지상군 리버스 대응 협력': [
      '협력국의 지상군은 N.H.C 연구기관이 개발한 탄약과 방어장비를 지급받고, S.I.D가 확보한 현장 정보와 중요 인력의 지원을 받았다. 리버스 발생 시 별도의 외교 절차 없이 합동 대응할 수 있는 연결망도 만들어졌다.',
      '협약을 거부한 국가들은 N.H.C 장비를 모방하거나 자체 공안·군사 기술을 개발했다. 그 지역에는 F.H.C TAD의 무력부대가 대신 진입했고, 부대원 다수는 자신들이 교단과 연결된 기업을 위해 움직인다는 사실을 알지 못했다.'
    ],
    '도심 리버스 차단망': [
      'C.A.P-17은 현상이 확장되는 범위를 고정하고, C.I. 스캐너는 공안·군사기관이 초기 이상 징후를 탐지하도록 지원했다. 두 장치는 단독 병기가 아니라 도시 봉쇄망을 구성하는 기반시설로 운용됐다.',
      '장비가 설치된 도시는 리버스 발생 직후 검문·대피·군사 투입을 하나의 절차로 연결할 수 있었다. 반대로 차단망 밖의 외곽 지역은 현상이 확인될 때까지 피해가 확산되는 공백지대로 남았다.'
    ],
    '애시 크루 등장': [
      '애시 크루는 처음부터 군사조직으로 만들어진 것이 아니었다. 정규기관이 철수하거나 접근하지 못한 현장에서 활동하던 민간 인력들이 비비안 산체스를 중심으로 결집한 조직이었다.',
      'N.H.C 산하에 들어간 뒤 A.R.F와 C.P.D가 그 아래에 편성됐다. 군사적 승패보다 리버스 직후의 현장과 남겨진 사람을 다룬다는 점에서 기존 N.H.C 부대와 다른 위치를 차지했다.'
    ],
    '레드울프 부대 이탈': [
      '웨이드 밀렌은 초기 파견지에서 리버스와 교단 전력을 직접 상대하며 자신의 전투·지휘 능력을 확인했다. 이후 N.H.C에서 반복적으로 공로를 세웠고 레드울프의 지휘권을 얻었다.',
      '하지만 동료들이 소모품처럼 죽고 자신이 구출한 사람들이 실험 대상이나 정화 대상으로 처분되는 상황이 이어졌다. 이탈은 순간적인 명령 불복종이 아니라, 오랫동안 축적된 불신과 증오가 작전 중 폭발한 결과였다.'
    ],
    '위버멘시 미국 지부 습격': [
      '회수된 자료에는 실험 대상자의 실제 신원과 납치 경로, 기억 삭제 기록이 포함돼 있었다. 일부 정보가 외부에 폭로되면서 U.A.C는 위버멘시가 단순한 방랑자 보호 연구였다는 주장을 유지할 수 없게 됐다.',
      '프로젝트 폐기로 인공적인 고화력 생체 병기 요원을 생산하는 계획은 중단됐다. 그러나 시설 폐쇄와 동시에 자료 삭제가 진행되면서 불법 인체실험의 전체 규모와 책임자는 끝내 공개되지 않았다.'
    ],
    '종결되지 않은 전쟁': [
      'U.A.C는 손상된 권위를 유지한 채 국제 조율을 계속하고, N.H.C와 S.I.D는 각자의 방식으로 현장을 통제한다. F.H.C는 TAD를 앞세워 대응 세력의 외형을 유지하면서 비협력국과 기업권에서 영향력을 넓힌다.',
      'S.O.N과 레드울프는 U.A.C 체제에 맞서고, 우시노다교는 정부·기업·교육기관 내부에 남아 있다. 어느 세력도 전쟁을 끝낼 만큼 우세하지 않으며, 리버스는 여전히 새로운 지역에서 발생한다.'
    ]
  };

  const entries = [...root.querySelectorAll('.pc-world-history-entry')];
  entries.forEach((entry) => {
    const title = entry.querySelector('summary strong')?.textContent.trim();
    const copy = entry.querySelector('.pc-world-history-entry-copy');
    (extendedRecord[title] || []).forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      copy?.appendChild(p);
    });
  });

  const recordIds = [
    '1975-09-12-amarion', '1975-distortion-system', '1982-03-22-fhc',
    '1982-uac-watch', '1986-07-25-immortality', '1989-08-23-tokyo',
    '1993-11-02-uac', '1993-syndicate', '1995-03-20-tokyo-subway',
    '1997-01-27-classification', '1999-07-12-ubermensch',
    '2001-07-21-independence', '2002-02-20-ground-forces',
    '2003-02-05-city-barrier', '2005-01-21-ash-crew',
    '2005-09-01-red-wolf', '2006-08-20-ubermensch-raid', '2006-ongoing'
  ];
  const records = entries.map((entry, index) => ({
    id: recordIds[index],
    date: entry.querySelector('time')?.textContent.trim() || '',
    title: entry.querySelector('summary strong')?.textContent.trim() || '',
    summary: entry.querySelector('summary small')?.textContent.trim() || '',
    paragraphs: [...entry.querySelectorAll('.pc-world-history-entry-copy p')]
      .map((p) => p.textContent.trim())
      .filter(Boolean)
  }));

  const head = root.querySelector('.pc-world-history-head');
  const range = root.querySelector('.pc-world-history-range');
  const indexView = root.querySelector('.pc-world-history-list');
  indexView.classList.add('pc-world-history-index');
  indexView.replaceChildren();

  records.forEach((record, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pc-world-history-index-row';
    button.dataset.historyRecord = record.id;
    button.setAttribute('aria-label', `${record.date} ${record.title} 열람`);

    const time = document.createElement('time');
    time.textContent = record.date;
    const title = document.createElement('strong');
    title.textContent = record.title;
    const summary = document.createElement('small');
    summary.textContent = record.summary;
    const arrow = document.createElement('i');
    arrow.textContent = '→';
    arrow.setAttribute('aria-hidden', 'true');

    button.append(time, title, summary, arrow);
    button.addEventListener('click', () => openRecord(index, 'push'));
    indexView.appendChild(button);
  });

  const detailView = document.createElement('article');
  detailView.className = 'pc-world-history-detail';
  detailView.hidden = true;
  detailView.innerHTML = `
    <button type="button" class="pc-world-history-back">← 세계 사건 연표</button>
    <header class="pc-world-history-detail-head">
      <div class="label" data-history-record-label></div>
      <time data-history-record-date></time>
      <h2 data-history-record-title></h2>
      <p data-history-record-summary></p>
    </header>
    <div class="pc-world-history-detail-body" data-history-record-body></div>
    <nav class="pc-world-history-detail-nav" aria-label="사건 기록 이동">
      <button type="button" data-history-prev>← 이전 사건</button>
      <button type="button" data-history-index>연표로 돌아가기</button>
      <button type="button" data-history-next>다음 사건 →</button>
    </nav>`;
  root.appendChild(detailView);

  const originalDocumentTitle = document.title;
  let activeIndex = -1;

  function resetScroll() {
    const content = document.querySelector('.uac-shell-content');
    if (content) content.scrollTop = 0;
    try { window.scrollTo(0, 0); } catch (_error) {}
  }

  function showIndex() {
    activeIndex = -1;
    root.classList.remove('pc-world-history-detail-mode');
    if (head) head.hidden = false;
    if (range) range.hidden = false;
    indexView.hidden = false;
    detailView.hidden = true;
    document.title = originalDocumentTitle;
    resetScroll();
  }

  function openRecord(index, stateMode) {
    const record = records[index];
    if (!record) return showIndex();
    activeIndex = index;
    root.classList.add('pc-world-history-detail-mode');
    if (head) head.hidden = true;
    if (range) range.hidden = true;
    indexView.hidden = true;
    detailView.hidden = false;

    detailView.querySelector('[data-history-record-label]').textContent =
      `EVENT RECORD / ${String(index + 1).padStart(2, '0')}`;
    detailView.querySelector('[data-history-record-date]').textContent = record.date;
    detailView.querySelector('[data-history-record-title]').textContent = record.title;
    detailView.querySelector('[data-history-record-summary]').textContent = record.summary;

    const body = detailView.querySelector('[data-history-record-body]');
    body.replaceChildren();
    record.paragraphs.forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      body.appendChild(p);
    });

    const previous = detailView.querySelector('[data-history-prev]');
    const next = detailView.querySelector('[data-history-next]');
    previous.disabled = index === 0;
    next.disabled = index === records.length - 1;
    document.title = `${record.title} | U.A.C 기록 단말기`;
    if (stateMode === 'push') {
      history.pushState({ pcWorldHistoryRecord: record.id }, '', '#history');
    } else if (stateMode === 'replace') {
      history.replaceState({ pcWorldHistoryRecord: record.id }, '', '#history');
    }
    resetScroll();
  }

  function returnToIndex(useBrowserHistory) {
    if (useBrowserHistory && history.state?.pcWorldHistoryRecord) {
      history.back();
      return;
    }
    history.replaceState(null, '', '#history');
    showIndex();
  }

  detailView.querySelector('.pc-world-history-back')
    .addEventListener('click', () => returnToIndex(true));
  detailView.querySelector('[data-history-index]')
    .addEventListener('click', () => returnToIndex(true));
  detailView.querySelector('[data-history-prev]').addEventListener('click', () => {
    if (activeIndex > 0) openRecord(activeIndex - 1, 'replace');
  });
  detailView.querySelector('[data-history-next]').addEventListener('click', () => {
    if (activeIndex < records.length - 1) openRecord(activeIndex + 1, 'replace');
  });

  window.addEventListener('popstate', (event) => {
    const id = event.state?.pcWorldHistoryRecord;
    const index = records.findIndex((record) => record.id === id);
    if (index >= 0) openRecord(index, false);
    else showIndex();
  });

  document.addEventListener('click', (event) => {
    const historyLink = event.target.closest?.('.side-menu a[data-target="history"]');
    if (historyLink) setTimeout(showIndex, 0);
  });

  const restoredIndex = records.findIndex(
    (record) => record.id === history.state?.pcWorldHistoryRecord
  );
  if (restoredIndex >= 0) openRecord(restoredIndex, false);
  else showIndex();
})();
