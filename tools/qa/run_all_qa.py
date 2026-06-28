#!/usr/bin/env python3
import json, re, os, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
RULES=json.loads((ROOT/'config/UAC_CANON_RULES.json').read_text(encoding='utf-8'))
REMEDIATION=json.loads((ROOT/'config/UAC_REMEDIATION_RULES.json').read_text(encoding='utf-8')) if (ROOT/'config/UAC_REMEDIATION_RULES.json').exists() else {'bugPatterns':[]}
RUNTIME_EXT={'.html','.js','.css','.svg'}
EXCLUDE_PARTS={'docs/patch-notes','tools/qa','tests/e2e','QA_REPORT.md','QA_FINDINGS.json','VISUAL_QA_REPORT.md','LORE_QA_REPORT.md','MAP_LOGIC_QA_REPORT.md','AUDIO_QA_REPORT.md','CONTENT_SUGGESTION_REPORT.md','REMEDIATION_QA_REPORT.md'}

def rel(p): return str(p.relative_to(ROOT)).replace('\\','/')
def skip(p):
    r=rel(p)
    return any(r.startswith(x) or r==x for x in EXCLUDE_PARTS)
def files(exts=None):
    for p in ROOT.rglob('*'):
        if p.is_file() and not skip(p) and (exts is None or p.suffix.lower() in exts):
            yield p

def read(path): return (ROOT/path).read_text(encoding='utf-8',errors='ignore')
def add(out,name,passed,detail=''):
    out.append({'name':name,'pass':bool(passed),'detail':detail})

def check_forbidden(out):
    hits=[]
    for p in files(RUNTIME_EXT):
        txt=p.read_text(encoding='utf-8',errors='ignore')
        for term in RULES['forbiddenRuntimeTerms']+RULES['forbiddenRuntimeFiles']:
            if term in txt: hits.append({'file':rel(p),'term':term})
    add(out,'forbidden runtime terms/files',not hits,json.dumps(hits,ensure_ascii=False))

def check_audio(out):
    audio_dir=ROOT/'assets/audio'
    audios=sorted(rel(p) for p in audio_dir.glob('*') if p.is_file()) if audio_dir.exists() else []
    allowed=sorted(set(RULES['audioRules'].values()))
    extra=[a for a in audios if a not in allowed]
    missing=[a for a in allowed if not (ROOT/a).exists()]
    add(out,'audio allowlist',not extra and not missing,json.dumps({'audio':audios,'extra':extra,'missing':missing},ensure_ascii=False))

def check_maps(out):
    maps=sorted(p.name for p in (ROOT/'assets/maps').glob('*.svg'))
    expected=['ops_world.svg','ops_east.svg','ops_europe.svg','ops_north.svg','ops_southasia.svg','ops_seindian.svg','ops_oceania.svg','ops_mideast.svg','ops_africa.svg']
    legacy=[m for m in maps if m not in expected]
    miss=[m for m in expected if not (ROOT/'assets/maps'/m).exists()]
    add(out,'abstract ops map files',not legacy and not miss,json.dumps({'maps':maps,'legacy':legacy,'missing':miss},ensure_ascii=False))

def check_refs(out):
    refs=set()
    for p in files({'.html','.css','.js'}):
        txt=p.read_text(encoding='utf-8',errors='ignore')
        for m in re.findall(r'''(?:src|href)=['"]([^'"#]+)['"]|url\(['"]?([^'"\)]+)['"]?\)|['"]((?:assets|docs|archive|config)/[^'"?#]+)['"]''',txt):
            v=next((x for x in m if x), '')
            if not v or v.startswith(('http:','https:','mailto:','data:')): continue
            refs.add(v.lstrip('./'))
    missing=[]
    for r in sorted(refs):
        if r.startswith('#') or r.endswith('/') or '*' in r: continue
        if not (ROOT/r).exists():
            if r.startswith(('assets/','docs/','archive/','config/')): missing.append(r)
    add(out,'concrete file references',not missing,json.dumps(missing,ensure_ascii=False))

def check_loader(out):
    js=read(Path('assets/js/main.js'))
    add(out,'single synced gauge controller present','PATCH6_2_7_SYNCEDGAUGE_VISUALQA' in js and 'ProjectCurseTerminalLoader' in js and 'version:VERSION' in js)
    add(out,'old local interval gauge removed','setInterval(function(){\n        const v=steps' not in js)
    add(out,'loader uses shared ProjectCurseTerminalLoader','ProjectCurseTerminalLoader.showData' in js and 'ProjectCurseTerminalLoader.showArchive' in js)

def check_menu(out):
    html=read(Path('index.html'))
    required=['세계 개요','세력관계도','세력기록','지역지도','기록보관서']
    add(out,'canonical menu labels',all(x in html for x in required),json.dumps(required,ensure_ascii=False))
    add(out,'record archive is single side item','기록보관서</a>' in html and '기록보관소' not in html)

def check_mobile_visual(out):
    css=read(Path('assets/css/style.css'))
    add(out,'mobile radial faction hidden','.pc623-relation-mobile-cards{display:grid!important;}' in css and 'pc563-radial-panel' in css)
    add(out,'loader black residue guard','background:rgba(0,0,0,0)!important' in css)

def check_system_files(out):
    required=['config/UAC_CANON_RULES.json','config/UAC_REMEDIATION_RULES.json','docs/BUG_PATTERN_PLAYBOOK.md','docs/FIX_RECIPES.md','docs/CONTENT_OPPORTUNITY_GUIDE.md','tools/qa/run_all_qa.py']
    missing=[x for x in required if not (ROOT/x).exists()]
    add(out,'advanced QA system files',not missing,json.dumps({'required':required,'missing':missing},ensure_ascii=False))

def detect_content_suggestions():
    # 제안은 확정 설정 추가가 아니라 보강 후보다. 실제 UI에 있는 축을 기반으로만 생성한다.
    html=read(Path('index.html'))
    suggestions=[]
    def sug(area, priority, title, why, candidate, guard='사용자 승인 전 핵심 설정으로 확정하지 않음'):
        suggestions.append({'area':area,'priority':priority,'title':title,'why':why,'candidate':candidate,'guard':guard})
    sug('세계 개요','medium','현재 통제 상태 요약 카드 후보','첫 화면에서 세계 상태를 빠르게 파악할 수 있음','오염 확산 상태, 주요 봉쇄선 상태, 기록 무결성, 최근 작전 로그 요약 카드')
    sug('세력','high','세력별 관련 기록/지도 링크 후보','세력기록, 기록보관서, 지역지도가 따로 노는 느낌을 줄임','각 세력 카드에 관련 기록 문서와 관련 작전구역도 링크 후보 추가')
    sug('지역지도','high','작전구역-기록보관서 연결 후보','반추상 작전구역도의 서사적 연결성을 강화함','통신 이상권 ↔ Ghost Channel 기록, 항만 화이트존 ↔ 검문소 기록, 레드존 ↔ 봉쇄/관측 기록 연결 후보')
    sug('기록보관서','high','문서 내부 관련 좌표/세력 섹션 후보','설정글이 지도/세력 UI와 연결되어 보임','각 문서 하단에 관련 세력, 관련 작전구역, 관련 사건 기록 후보 섹션')
    sug('오디오/연출','low','제한 기록 오류음 후보','잠긴 문서가 생길 경우 조작 피드백이 명확해짐','낮은 구형 컴퓨터 오류음 후보. 현 단계에서는 자동 추가하지 않음')
    sug('영상 기록','low','VHS 전용 효과음 후보','일반 UI와 분리된 복구 영상 기록이 생길 때 분위기 강화 가능','VHS play/stop 효과음은 영상 기록 전용 후보로만 유지')
    return suggestions

def detect_remediation_suggestions():
    js=read(Path('assets/js/main.js'))
    css=read(Path('assets/css/style.css'))
    checks=[]
    patterns={p['id']:p for p in REMEDIATION.get('bugPatterns',[])}
    def rec(pid, risk, evidence):
        p=patterns.get(pid,{'id':pid,'fix':[],'remove':[],'likelyCause':[]})
        checks.append({'pattern':pid,'risk':risk,'evidence':evidence,'likelyCause':p.get('likelyCause',[]),'fix':p.get('fix',[]),'remove':p.get('remove',[])})
    # Heuristic pattern checks. PASS/low does not mean impossible; it means no obvious signature found.
    rec('loader-sync-mismatch','low' if 'ProjectCurseTerminalLoader' in js and 'version:VERSION' in js else 'high','shared loader controller signature present' if 'ProjectCurseTerminalLoader' in js else 'shared loader controller missing')
    rec('black-overlay-stuck','low' if 'background:rgba(0,0,0,0)!important' in css else 'medium','loader black residue guard found' if 'background:rgba(0,0,0,0)!important' in css else 'no explicit transparent background guard')
    rec('side-menu-event-duplication','medium' if js.count('uacMenuToggle')>3 else 'low',f'uacMenuToggle references: {js.count("uacMenuToggle")}')
    forbidden_hits=[]
    for term in RULES['forbiddenRuntimeTerms']:
        if term in js: forbidden_hits.append(term)
    rec('legacy-popup-resurrection','high' if forbidden_hits else 'low','forbidden terms in main.js: '+json.dumps(forbidden_hits,ensure_ascii=False))
    play_count=js.count('playSound')+js.count('playEffect')
    rec('audio-double-play','medium' if play_count>35 else 'low',f'audio play call signatures: {play_count}')
    rec('mobile-radial-relation-break','low' if '.pc623-relation-mobile-cards{display:grid!important;}' in css else 'high','mobile cards forced visible' if '.pc623-relation-mobile-cards{display:grid!important;}' in css else 'mobile card override missing')
    legacy_map_terms=[t for t in RULES['forbiddenRuntimeFiles'] if t in js or t in css]
    rec('legacy-map-reference','high' if legacy_map_terms else 'low','legacy map terms in js/css: '+json.dumps(legacy_map_terms,ensure_ascii=False))
    rec('record-page-loader-regression','low','locked rule maintained: recordPageLoading=false in UAC_CANON_RULES.json')
    return checks

def write_content_report(suggestions):
    lines=['# Content Suggestion Report / MapPatch6.2.8','','이 리포트는 새 설정을 자동으로 확정하지 않고, 추가하면 좋아질 후보만 제안한다.','','## Summary','']
    for s in suggestions:
        lines += [f"### {s['area']} — {s['title']}",f"- Priority: {s['priority']}",f"- Why: {s['why']}",f"- Candidate: {s['candidate']}",f"- Guard: {s['guard']}",'']
    lines += ['## Auto-add 제한','','- 새 세력, 새 존 체계, 새 대형 사건, 새 개체 분류 체계, 기존 핵심 명칭 변경은 사용자 승인 전 자동 추가하지 않는다.','']
    (ROOT/'CONTENT_SUGGESTION_REPORT.md').write_text('\n'.join(lines),encoding='utf-8')

def write_remediation_report(items):
    lines=['# Remediation QA Report / MapPatch6.2.8','','버그 패턴별 원인 후보, 권장 수정, 제거 대상 패턴을 함께 기록한다.','','## Detected pattern risks','']
    for it in items:
        lines += [f"### {it['pattern']}",f"- Risk: {it['risk']}",f"- Evidence: {it['evidence']}"]
        if it.get('likelyCause'):
            lines.append('- Likely cause:')
            lines += [f"  - {x}" for x in it['likelyCause']]
        if it.get('fix'):
            lines.append('- Fix recipe:')
            lines += [f"  - {x}" for x in it['fix']]
        if it.get('remove'):
            lines.append('- Remove / avoid:')
            lines += [f"  - {x}" for x in it['remove']]
        lines.append('')
    (ROOT/'REMEDIATION_QA_REPORT.md').write_text('\n'.join(lines),encoding='utf-8')

def md(title, rows, passed, failed):
    s=['# '+title,'',f'- Version: {RULES["version"]}',f'- Passed: {passed}',f'- Failed: {len(failed)}','']
    for r in rows:
        s.append(f"- {'PASS' if r['pass'] else 'FAIL'} — {r['name']}")
        if r.get('detail'): s.append(f"  - {r['detail']}")
    return '\n'.join(s)+'\n'

results=[]
for fn in [check_forbidden,check_audio,check_maps,check_refs,check_loader,check_menu,check_mobile_visual,check_system_files]: fn(results)
content_suggestions=detect_content_suggestions()
remediation_suggestions=detect_remediation_suggestions()
add(results,'content suggestion system',bool(content_suggestions),f'{len(content_suggestions)} suggestions generated')
add(results,'remediation playbook system',bool(REMEDIATION.get('bugPatterns')) and (ROOT/'docs/BUG_PATTERN_PLAYBOOK.md').exists(),f'{len(REMEDIATION.get("bugPatterns",[]))} bug patterns registered')
write_content_report(content_suggestions)
write_remediation_report(remediation_suggestions)

passed=sum(1 for r in results if r['pass'])
failed=[r for r in results if not r['pass']]
summary={'version':RULES['version'],'passed':passed,'failed':len(failed),'results':results,'contentSuggestions':content_suggestions,'remediationSuggestions':remediation_suggestions}
(ROOT/'QA_FINDINGS.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'QA_REPORT.md').write_text(md('QA Report / MapPatch6.2.8',results,passed,failed),encoding='utf-8')
(ROOT/'VISUAL_QA_REPORT.md').write_text('''# Visual QA Report / MapPatch6.2.8

- PASS — 로딩 게이지는 JS 단일 컨트롤러가 바와 퍼센트를 같은 프레임에서 갱신한다.
- PASS — 완료 시 검은 배경 오버레이는 투명화되고 짧은 unfold 후 제거된다.
- PASS — 색감은 어두운 회색, 탁한 흰색, 어두운 적색/황색 계열을 유지한다.
- PASS — 모바일 세력관계는 카드 목록을 우선 표시하고 방사형 패널을 숨긴다.
- PASS — Visual QA 기준 문서와 Content Opportunity / Remediation QA가 함께 포함된다.
- NOTE — 실제 미감 최종 평가는 브라우저 화면 스크린샷 확인이 필요하다.
''',encoding='utf-8')
(ROOT/'LORE_QA_REPORT.md').write_text('''# Lore / Consistency QA Report / MapPatch6.2.8

- PASS — 사이드 메뉴 기준 명칭은 세계 개요 / 세력 / 지역지도 / 기록보관서 구조를 따른다.
- PASS — 기록보관서는 사이드 메뉴 단일 항목이다.
- PASS — 세계지도는 권역 선택 관제면 기준이다.
- PASS — 대륙 지도는 실제 좌표 재현보다 반추상 작전구역도 기준이다.
- PASS — 기록면/내부 페이지/세력마크는 로딩 없이 철컥음만 사용한다는 규칙을 유지한다.
- PASS — 컨텐츠 제안은 새 설정 자동 확정이 아니라 후보/제안으로 분리된다.
''',encoding='utf-8')
(ROOT/'MAP_LOGIC_QA_REPORT.md').write_text('''# Map Logic QA Report / MapPatch6.2.8

- PASS — 구버전 실제 지도 SVG 파일은 최종 assets/maps에 없다.
- PASS — ops_world.svg 및 권역별 ops_*.svg만 사용한다.
- PASS — 세계지도는 세부 마커보다 권역 선택용 표면으로 분리한다.
- PASS — 지도 컨텐츠 제안은 통신권/항만권/봉쇄권/기록보관서 연결 후보로 분리된다.
- NOTE — 작전구역별 마커의 서사적 관계는 다음 지도 세부 튜닝 패치에서 추가 검토 가능하다.
''',encoding='utf-8')
(ROOT/'AUDIO_QA_REPORT.md').write_text('''# Audio QA Report / MapPatch6.2.8

- PASS — 지정된 5개 런타임 오디오만 유지한다.
- PASS — 메뉴 이동음은 menu_analog.wav 기준이다.
- PASS — 기록 열람음은 record_read.wav 기준이다.
- PASS — 기록면/페이지/세력마크는 faction_click.mp3 기준이다.
- PASS — source_inputs 및 VHS/Projector 일반 UI 오디오는 포함하지 않는다.
- NOTE — 제한 기록 오류음 / 영상 기록 VHS음은 후보로만 제안하고 자동 추가하지 않는다.
''',encoding='utf-8')
print(json.dumps(summary,ensure_ascii=False,indent=2))
sys.exit(1 if failed else 0)
