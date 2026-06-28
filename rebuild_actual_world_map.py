import os, re, math, shutil, zipfile
from pathlib import Path

BASE = Path('/mnt/data/rebuild_realmap')
MAP_DIR = BASE/'assets'/'maps'
MAP_DIR.mkdir(parents=True, exist_ok=True)

# ---------- 1) Generate accurate map SVGs from Basemap coast/country data ----------
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap

regions = {
    'world_actual_base.svg': dict(label='U.A.C ACTUAL WORLD MAP', lon=(-180, 180), lat=(-58, 84), size=(16, 6.4), mer=30, par=20),
    'continent_east_asia.svg': dict(label='EAST ASIA ACTUAL MAP', lon=(70, 155), lat=(-5, 58), size=(12, 6.4), mer=15, par=10),
    'continent_europe.svg': dict(label='EUROPE ACTUAL MAP', lon=(-25, 45), lat=(30, 72), size=(12, 6.2), mer=10, par=10),
    'continent_north_america.svg': dict(label='NORTH AMERICA ACTUAL MAP', lon=(-170, -50), lat=(15, 78), size=(12, 6.2), mer=20, par=10),
    'continent_south.svg': dict(label='SOUTHERN BELT ACTUAL MAP', lon=(55, 180), lat=(-50, 35), size=(12, 6.4), mer=20, par=10),
    'continent_me_africa.svg': dict(label='MIDDLE EAST / AFRICA ACTUAL MAP', lon=(-25, 65), lat=(-38, 45), size=(12, 6.4), mer=15, par=10),
}

def make_map_svg(name, cfg):
    lon0, lon1 = cfg['lon']; lat0, lat1 = cfg['lat']
    fig = plt.figure(figsize=cfg['size'], dpi=100, facecolor='#030507')
    ax = fig.add_axes([0,0,1,1], facecolor='#030507')
    m = Basemap(projection='cyl', llcrnrlon=lon0, urcrnrlon=lon1, llcrnrlat=lat0, urcrnrlat=lat1, resolution='l', ax=ax)
    # Background and map shape.
    m.drawmapboundary(fill_color='#030507', linewidth=0)
    m.fillcontinents(color='#0b141a', lake_color='#030507', zorder=1)
    # Basemap country/coastline data gives actual world-map shapes.
    m.drawcoastlines(color='#aeb9c1', linewidth=0.8, zorder=3)
    m.drawcountries(color='#52606a', linewidth=0.42, zorder=2)
    try:
        m.drawrivers(color='#20303a', linewidth=0.18, zorder=2)
    except Exception:
        pass
    # Grid similar to UAC terminal overlay.
    meridians = list(range(math.floor(lon0/ cfg['mer'])*cfg['mer'], math.ceil(lon1/cfg['mer'])*cfg['mer']+1, cfg['mer']))
    parallels = list(range(math.floor(lat0/ cfg['par'])*cfg['par'], math.ceil(lat1/cfg['par'])*cfg['par']+1, cfg['par']))
    m.drawmeridians(meridians, color='#18303d', linewidth=0.36, dashes=[1,0], labels=[0,0,0,0], zorder=0, alpha=0.7)
    m.drawparallels(parallels, color='#18303d', linewidth=0.36, dashes=[1,0], labels=[0,0,0,0], zorder=0, alpha=0.7)
    ax.text(lon0 + (lon1-lon0)*0.012, lat1 - (lat1-lat0)*0.035, cfg['label'], color='#d5dde2', fontsize=8, fontfamily='monospace', alpha=0.95, zorder=5)
    # subtle vignette rectangle only through CSS/overlay not needed; keep actual map clean.
    ax.set_xlim(lon0, lon1); ax.set_ylim(lat0, lat1); ax.set_axis_off()
    out = MAP_DIR/name
    fig.savefig(out, format='svg', facecolor='#030507', bbox_inches='tight', pad_inches=0)
    plt.close(fig)
    # Remove hardcoded dimensions? Preserve viewBox; make image scale.
    text = out.read_text(encoding='utf-8')
    text = re.sub(r'<svg ([^>]*?)width="[^"]+" height="[^"]+"', r'<svg \1width="100%" height="100%"', text, count=1)
    out.write_text(text, encoding='utf-8')

for name,cfg in regions.items():
    make_map_svg(name,cfg)
# keep legacy aliases identical to world map.
for alias in ['global_zone_map.svg','global_zone_map_clean.svg']:
    shutil.copyfile(MAP_DIR/'world_actual_base.svg', MAP_DIR/alias)

# ---------- 2) Build new region map HTML from lat/lon data ----------
region_cfg = {
    'world': dict(title='세계 관제 개요', map='world_actual_base.svg', lon=(-180,180), lat=(-58,84), desc='전역 지도는 대표 권역만 축약 표시한다. 세부 시설·사건·현상은 각 대륙권 기록면에서 확인한다.'),
    'east': dict(title='동아시아 오염 구역 관제도', map='continent_east_asia.svg', lon=(70,155), lat=(-5,58), desc='동아시아 권역은 중국 내륙, 홍콩 해안, 한반도·일본 감시권을 실제 지도 좌표에 맞춰 분리한다.'),
    'europe': dict(title='유럽 레드존 및 해상 감시권', map='continent_europe.svg', lon=(-25,45), lat=(30,72), desc='유럽 권역은 함부르크-덴마크 인접권의 피의 호수와 북해 해상 감시권을 중심으로 표시한다.'),
    'north': dict(title='북미 봉쇄·관측 구역', map='continent_north_america.svg', lon=(-170,-50), lat=(15,78), desc='북미 권역은 캐나다 북부 장기 봉쇄권, 오대호 감시권, 위성 관측 실패 지점을 분리 표시한다.'),
    'south': dict(title='남아시아·오세아니아 감시 구역', map='continent_south.svg', lon=(55,180), lat=(-50,35), desc='남방권은 호주 내륙과 동남아 해안권 중심으로 표시한다. 바다의 위험권은 색칠하지 않고 점선 감시권으로 처리한다.'),
    'mea': dict(title='중동·아프리카 유출 경로 관제도', map='continent_me_africa.svg', lon=(-25,65), lat=(-38,45), desc='중동·아프리카 권역은 확정 레드존보다 유출 경로, 사막 감시권, 임시 봉쇄선 중심으로 기록한다.'),
}

def pct(region, lon, lat):
    cfg = region_cfg[region]
    lon0, lon1 = cfg['lon']; lat0, lat1 = cfg['lat']
    x = (lon-lon0)/(lon1-lon0)*100
    y = (lat1-lat)/(lat1-lat0)*100
    return max(1,min(99,x)), max(1,min(99,y))

def zone(region, color, title, lon, lat, w, h, status, records, rot=0):
    x,y = pct(region,lon,lat)
    return dict(kind='zone', filter='zone', color=color, title=title, x=x,y=y,w=w,h=h,rot=rot,status=status,records=records)

def seawatch(region,title,lon,lat,w,h,status,records,rot=0):
    x,y = pct(region,lon,lat)
    return dict(kind='sea', filter='blockade', title=title, x=x,y=y,w=w,h=h,rot=rot,status=status,records=records)

def line(region,title,lon,lat,w,status,records,rot=0):
    x,y = pct(region,lon,lat)
    return dict(kind='line', filter='blockade', title=title, x=x,y=y,w=w,rot=rot,status=status,records=records)

def marker(region, mtype, title, lon, lat, status, records, org=None):
    x,y = pct(region,lon,lat)
    return dict(kind='marker', filter=mtype, mtype=mtype, org=org, title=title, x=x, y=y, status=status, records=records)

records_std = '레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서'
items = {k: [] for k in region_cfg}
# World representative only.
items['world'] += [
    zone('world','red','동아시아 내륙 레드존 권역',104,36,5.4,3.6,'전역 축약 표시',records_std),
    zone('world','red','북유럽 피의 호수 권역',10,54.5,4.5,3.0,'전역 축약 표시','피의 호수 부검 기록 / 레드존 이상현상 및 오염 기준 문서'),
    zone('world','red','캐나다 북부 레드존 권역',-110,60,5.5,3.7,'전역 축약 표시',records_std),
    zone('world','black','호주 내륙 블랙존 후보권',134,-25,4.7,3.5,'전역 축약 표시',records_std),
    zone('world','yellow','중동 사막 감시권',44,25,5.6,3.5,'전역 축약 표시',records_std),
    seawatch('world','북해 해상 감시권',5,56,5.2,3.2,'해상 점선 감시권','피의 호수 부검 기록',-8),
    seawatch('world','남태평양 접근 제한 해역',165,-25,6.6,3.9,'해상 점선 감시권','지역지도',8),
    marker('world','incident','피의 호수 사건',10,54.5,'1986년 북해권 혈액성 이상현상','피의 호수 부검 기록 / 불멸을 향해'),
    marker('world','zone','동아시아 내륙 레드존 권역',104,36,'전역 대표 오염권','레드존 이상현상 및 오염 기준 문서'),
    marker('world','zone','캐나다 북부 레드존',-110,60,'장기 봉쇄','레드존 이상현상 및 오염 기준 문서'),
    marker('world','zone','호주 내륙 블랙존 후보권',134,-25,'남방권 오염 후보지','레드존 이상현상 및 오염 기준 문서'),
    marker('world','facility','U.A.C 글로벌 관제망',12,52,'전역 관측망 연결 노드','세력 정보 / 지역지도','uac'),
]
# East Asia
items['east'] += [
    zone('east','red','란저우 레드존',104.0,36.0,11,7.4,'장기 봉쇄',records_std,-4),
    zone('east','black','란저우 외곽 블랙존 후보지',104.3,35.8,5.2,4.0,'중심부 블랙존 후보지',records_std),
    zone('east','yellow','광둥권 옐로우존',113.5,23.5,8.5,5.4,'남중국 감시권',records_std,4),
    zone('east','red','홍콩 해안 오염 구역',114.2,22.3,4.2,3.2,'해안 도시권 레드존',records_std),
    zone('east','green','한반도 그린존 통제권',127.5,36.5,5.6,3.8,'민간 행정 유지 권역','구역 위험도 분류 문서'),
    zone('east','white','일본 서부 화이트존 감시권',135.5,35.0,5.2,3.4,'관측 가능 감시권','구역 위험도 분류 문서'),
    line('east','란저우 외곽 1차 봉쇄선',104,35.5,13,'N.H.C 1차 봉쇄선','N.H.C 현장 작전·장비·봉쇄 규정 문서',-5),
    line('east','홍콩 해안 감시선',114.2,22.4,7,'해안 감시선','C.P.D 대피 기록',18),
    marker('east','zone','란저우 레드존',104,36,'장기 봉쇄','레드존 이상현상 및 오염 기준 문서'),
    marker('east','incident','홍콩 민간인 대피 지연',114.2,22.3,'C.P.D 대피 지연 사건','C.P.D 기록'),
    marker('east','facility','N.H.C 란저우 외곽 봉쇄기지',103.2,35.4,'외곽 봉쇄기지','N.H.C 현장 작전·장비·봉쇄 규정 문서','nhc'),
    marker('east','facility','C.P.D 홍콩 대피 거점',114.0,22.2,'해안 대피 거점','C.P.D 기록','cpd'),
    marker('east','facility','U.A.C 동아시아 관제소',127.0,37.2,'동아시아 관제 노드','세력 정보','uac'),
    marker('east','anomaly','란저우 죽은 시간 반복 구역',104.5,36.6,'죽은 시간 반복 보고','레드존 이상현상 및 오염 기준 문서'),
    marker('east','anomaly','홍콩 오염 무전 수신 지점',114.4,22.5,'오염 무전 반복 수신','레드존 이상현상 및 오염 기준 문서'),
]
# Europe
items['europe'] += [
    zone('europe','red','피의 호수 레드존',10.0,54.5,8.5,5.6,'함부르크-덴마크 인접권',records_std,-8),
    zone('europe','yellow','북유럽 옐로우존',10.0,54.8,12,7.5,'피의 호수 주변 감시권',records_std,-8),
    zone('europe','black','피의 호수 중심부 블랙존 후보지',9.5,55.2,4.8,3.8,'중심부 블랙존 후보지',records_std),
    zone('europe','white','동유럽 화이트존 감시권',28,50,8,5.2,'동유럽 감시권','구역 위험도 분류 문서'),
    seawatch('europe','북해 해상 감시권',5.0,56.0,13,6,'해상 점선 감시권','피의 호수 부검 기록',-10),
    line('europe','북유럽 1차 봉쇄선',10,54.2,14,'N.H.C 북유럽 봉쇄선','N.H.C 현장 작전·장비·봉쇄 규정 문서',-6),
    marker('europe','incident','피의 호수 사건 지점',10,54.5,'1986년 혈액성 이상현상','피의 호수 부검 기록 / 불멸을 향해'),
    marker('europe','facility','U.A.C 유럽 관측 거점',8.8,53.8,'유럽 관측 거점','세력 정보','uac'),
    marker('europe','facility','A.R.F 피의 호수 회수 거점',9.5,54.0,'회수 실패 기록 보유','A.R.F 기록','arf'),
    marker('europe','facility','Ash Crew 북해 소각 처리소',11.2,53.8,'오염 장비 소각 처리','Ash Crew 기록','ash'),
    marker('europe','anomaly','북해 오염 무전 수신권',5.5,56.3,'해상 오염 무전 반복','레드존 이상현상 및 오염 기준 문서'),
    marker('europe','incident','블랙월 붕괴 관측 지점',18,52,'블랙월 잔존 관측','작전 기록','incident'),
]
# North America
items['north'] += [
    zone('north','red','캐나다 북부 레드존',-108,60,15,8.0,'북미권 장기 봉쇄',records_std,-4),
    zone('north','black','북부 침묵 지대',-116,61,7,5.5,'블랙존 후보지',records_std),
    zone('north','yellow','오대호 옐로우존',-84,43,11,6,'미국 북부 감시권',records_std,2),
    zone('north','white','알래스카 화이트존 관측권',-147,62,8,5,'알래스카 감시권','구역 위험도 분류 문서'),
    line('north','캐나다 북부 1차 봉쇄선',-108,56.5,18,'캐나다 북부 봉쇄선','N.H.C 현장 작전·장비·봉쇄 규정 문서',-2),
    line('north','오대호 감시선',-84,43,10,'오대호 감시선','지역지도',15),
    marker('north','zone','캐나다 북부 레드존',-108,60,'장기 봉쇄','레드존 이상현상 및 오염 기준 문서'),
    marker('north','facility','U.A.C 북미 관제소',-100,47,'북미 관제 노드','세력 정보','uac'),
    marker('north','facility','N.H.C 북미 협력 전진기지',-112,51,'협력 전진기지','N.H.C 현장 작전·장비·봉쇄 규정 문서','nhc'),
    marker('north','facility','A.R.F 냉지 회수거점',-120,54,'냉지 회수 작전 거점','A.R.F 기록','arf'),
    marker('north','anomaly','위성 영상 변질 구역',-105,58,'위성 관측 실패 기록','오염 기술·감시 체계 기록'),
    marker('north','incident','실험체 유출 추정 좌표',-123,49,'비인가 실험체 유출 추정','인공 개체·생체병기 기록'),
]
# South / Southern belt
items['south'] += [
    zone('south','red','호주 서부 레드존 후보권',121,-27,9.5,6.0,'호주 육지 오염권',records_std),
    zone('south','black','호주 내륙 블랙존 후보지',134,-25,7.2,5.2,'남방권 오염 영역',records_std),
    zone('south','yellow','호주 동부 옐로우존',150,-27,8.5,5.8,'호주 동부 감시권',records_std),
    zone('south','green','호주 동부 그린존 통제권',145,-37,6,4,'민간 행정 유지권','구역 위험도 분류 문서'),
    zone('south','white','동남아 해안 화이트존',105,8,10,6,'해안 감시권','구역 위험도 분류 문서'),
    seawatch('south','인도양 해상 감시권',85,-20,15,8,'해상 점선 감시권','지역지도',-6),
    seawatch('south','남태평양 접근 제한 해역',170,-26,12,7,'접근 제한 해역','지역지도',5),
    line('south','호주 북부 1차 봉쇄선',133,-18,12,'호주 북부 봉쇄선','N.H.C 현장 작전·장비·봉쇄 규정 문서',0),
    line('south','호주 동부 해안 감시선',151,-27,11,'해안 감시선','지역지도',-8),
    marker('south','zone','호주 내륙 블랙존 후보지',134,-25,'남방권 오염 영역','레드존 이상현상 및 오염 기준 문서'),
    marker('south','facility','N.H.C 호주 외곽 전진기지',122,-29,'호주 외곽 전진기지','N.H.C 현장 작전·장비·봉쇄 규정 문서','nhc'),
    marker('south','facility','C.P.D 호주 동부 선별소',151,-33,'귀환자 선별소','C.P.D 기록','cpd'),
    marker('south','facility','Ash Crew 서호주 소각거점',119,-31,'서호주 소각거점','Ash Crew 기록','ash'),
    marker('south','facility','U.A.C 남방권 관측소',103,12,'남방권 관측소','세력 정보','uac'),
    marker('south','anomaly','호주 내륙 죽은 시간 발생지',135,-26,'내륙 시간 반복 보고','레드존 이상현상 및 오염 기준 문서'),
    marker('south','incident','호주 동부 귀환자 선별 실패',151,-33,'귀환자 선별 실패 기록','C.P.D 기록'),
]
# Middle East Africa
items['mea'] += [
    zone('mea','yellow','중동 사막 감시 구역',45,25,12,7,'사막 감시권 / 변동 중',records_std),
    zone('mea','white','북아프리카 장기 방치 구역',15,25,11,6,'장기 방치 후보권','구역 위험도 분류 문서'),
    zone('mea','yellow','동아프리카 옐로우존 후보지',40,5,10,6,'동아프리카 감시권','구역 위험도 분류 문서'),
    zone('mea','black','사막 침묵 지대',22,20,7.5,5.5,'블랙존 후보지',records_std),
    zone('mea','green','지중해 남부 그린존 접속권',10,32,6,4,'대피·접속 가능권','구역 위험도 분류 문서'),
    seawatch('mea','지중해 남부 접근 제한 해역',15,36,11,4.5,'해상 점선 감시권','지역지도',-5),
    line('mea','사막 임시 봉쇄선',25,20,12,'사막 임시 봉쇄선','N.H.C 현장 작전·장비·봉쇄 규정 문서',16),
    line('mea','유출 경로 차단선',18,26,11,'비인가 유출 경로 차단선','세력 관계 / Syndicate 기록',25),
    marker('mea','zone','중동 사막 감시 구역',45,25,'사막 감시권 / 변동 중','레드존 이상현상 및 오염 기준 문서'),
    marker('mea','facility','U.A.C 중동·아프리카 감시거점',10,32,'감시 거점','세력 정보','uac'),
    marker('mea','facility','N.H.C 임시 전진기지',45,24,'임시 전진기지','N.H.C 현장 작전·장비·봉쇄 규정 문서','nhc'),
    marker('mea','facility','C.P.D 난민 대피 거점',12,31,'난민·귀환자 대피 거점','C.P.D 기록','cpd'),
    marker('mea','facility','A.R.F 사막 회수거점',22,20,'사막 회수 작전 거점','A.R.F 기록','arf'),
    marker('mea','facility','Ash Crew 이동 소각 차량기지',38,0,'이동 소각 차량기지','Ash Crew 기록','ash'),
    marker('mea','facility','S.I.D 이스탄불 조사 지부',29,41,'의식성 유출 조사 지부','S.I.D 기록','sid'),
    marker('mea','anomaly','사막 오염 무전 반복',23,20,'오염 무전 반복 수신','레드존 이상현상 및 오염 기준 문서'),
    marker('mea','incident','유출 장비 거래 좌표',18,26,'Syndicate 유출 경로','세력 관계'),
]

filter_label = {'zone':'오염 구역','facility':'작전 시설','anomaly':'현상 기록','incident':'사건 좌표','blockade':'봉쇄선'}

def esc(s): return str(s).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;')

def overlay_html(it):
    if it['kind']=='zone':
        return f'<div class="map-overlay continent-zone-blob {it["color"]}" data-filter="zone" data-title="{esc(it["title"])}" data-status="{esc(it["status"])}" data-records="{esc(it["records"])}" style="left:{it["x"]:.2f}%;top:{it["y"]:.2f}%;--w:{it["w"]:.2f}%;--h:{it["h"]:.2f}%;--rot:{it.get("rot",0)}deg;"></div>'
    if it['kind']=='sea':
        return f'<div class="map-overlay continent-sea-watch" data-filter="blockade" data-title="{esc(it["title"])}" data-status="{esc(it["status"])}" data-records="{esc(it["records"])}" style="left:{it["x"]:.2f}%;top:{it["y"]:.2f}%;--w:{it["w"]:.2f}%;--h:{it["h"]:.2f}%;--rot:{it.get("rot",0)}deg;"></div>'
    if it['kind']=='line':
        return f'<div class="map-overlay continent-blockade-line" data-filter="blockade" data-title="{esc(it["title"])}" data-status="{esc(it["status"])}" data-records="{esc(it["records"])}" style="left:{it["x"]:.2f}%;top:{it["y"]:.2f}%;--w:{it["w"]:.2f}%;--rot:{it.get("rot",0)}deg;"></div>'
    cls = 'continent-marker '
    if it['mtype']=='facility': cls += 'facility ' + (it.get('org') or 'uac')
    elif it['mtype']=='zone': cls += 'red'
    else: cls += it['mtype']
    return f'<button class="{cls}" data-filter="{it["filter"]}" style="left:{it["x"]:.2f}%;top:{it["y"]:.2f}%" title="{esc(it["title"])}" data-title="{esc(it["title"])}" data-status="{esc(it["status"])}" data-records="{esc(it["records"])}" type="button"><span>{esc(it["title"])}</span></button>'

def panel_html(key):
    cfg=region_cfg[key]
    h=[]
    h.append(f'<div class="continent-panel{(" active" if key=="world" else "")}" data-continent-panel="{key}">')
    h.append('<div class="continent-map-frame">')
    h.append(f'<img alt="{esc(cfg["title"])}" class="continent-map-img" src="assets/maps/{cfg["map"]}"/>')
    # zone/line overlays under markers
    for it in items[key]:
        if it['kind']!='marker': h.append(overlay_html(it))
    for it in items[key]:
        if it['kind']=='marker': h.append(overlay_html(it))
    h.append('<div class="map-detail-card"><b>U.A.C 관제 기록</b><p>마커를 누르면 관련 기록과 상태가 표시된다.</p></div>')
    h.append('</div>')
    h.append(f'<div class="continent-region-info"><h3>{esc(cfg["title"])}</h3><p>{esc(cfg["desc"])}</p><div class="continent-point-list">')
    # list only markers and selected sea/line, not every zone overlay duplicated? Include markers + line/sea, and core zones.
    listed=[]
    for it in items[key]:
        if it['kind'] in ('marker','sea','line'):
            fl=it['filter']; listed.append((fl,it['title'],it['status']))
    # Also add named zone overlays once.
    for it in items[key]:
        if it['kind']=='zone': listed.insert(0,(it['filter'],it['title'],it['status']))
    seen=set()
    for fl,title,status in listed:
        if (fl,title) in seen: continue
        seen.add((fl,title))
        h.append(f'<div class="continent-point" data-filter="{fl}"><b>{filter_label.get(fl,fl)}</b><span>{esc(title)}<small>{esc(status)}</small></span></div>')
    h.append('</div></div></div>')
    return '\n'.join(h)

map_html = '''<section class="content-page panel" id="zone-map">
<div class="label">U.A.C ACTUAL WORLD MAP</div>
<h2>지역 지도</h2>
<p class="section-brief">실제 세계지도 벡터를 기준으로 대륙권을 확대 열람한다. 지도 자체는 같은 실제 지형 기반을 사용하고, 오염 구역·작전 시설·현상 기록·사건 좌표·봉쇄선만 U.A.C 관제 오버레이로 분리 표시한다.</p>
<div class="continental-map-shell" data-filter="all">
<div aria-label="대륙권 기록면 선택" class="continent-tabs" role="tablist">
<button class="continent-tab active" data-continent="world" type="button">세계</button><button class="continent-tab" data-continent="east" type="button">동아시아</button><button class="continent-tab" data-continent="europe" type="button">유럽</button><button class="continent-tab" data-continent="north" type="button">북미</button><button class="continent-tab" data-continent="south" type="button">남방권</button><button class="continent-tab" data-continent="mea" type="button">중동·아프리카</button>
</div>
<div aria-label="지도 내부 필터 선택" class="continent-filters" role="tablist">
<button class="continent-filter active" data-map-filter="all" type="button">전체</button><button class="continent-filter" data-map-filter="zone" type="button">오염 구역</button><button class="continent-filter" data-map-filter="facility" type="button">작전 시설</button><button class="continent-filter" data-map-filter="anomaly" type="button">현상 기록</button><button class="continent-filter" data-map-filter="incident" type="button">사건 좌표</button><button class="continent-filter" data-map-filter="blockade" type="button">봉쇄선</button>
</div>
<div class="continental-map-note"><b>지도 기준:</b> 실제 세계지도 벡터 / 육지 오염권은 반투명 존으로, 해상권은 점선 감시권으로 표시한다.</div>
<div class="continent-legend clean-legend" aria-label="지도 범례"><span><i class="lg lg-red"></i>레드존</span><span><i class="lg lg-yellow"></i>옐로우존</span><span><i class="lg lg-green"></i>그린존</span><span><i class="lg lg-white"></i>화이트존</span><span><i class="lg lg-black"></i>블랙존</span><span><i class="lg lg-facility"></i>작전 시설</span><span><i class="lg lg-anomaly"></i>현상 기록</span><span><i class="lg lg-incident"></i>사건 좌표</span><span><i class="lg lg-blockade"></i>봉쇄선</span><span><i class="lg lg-sea"></i>해상 감시권</span></div>
<div class="continent-panel-wrap">
''' + '\n'.join(panel_html(k) for k in ['world','east','europe','north','south','mea']) + '''
</div>
</div>
'''

index_path = BASE/'index.html'
html = index_path.read_text(encoding='utf-8')
start = html.find('<section class="content-page panel" id="zone-map">')
if start < 0:
    raise SystemExit('zone-map section start not found')
mid = html.find('<div class="zone-risk-panel compact-zone-guide">', start)
if mid < 0:
    raise SystemExit('zone-risk-panel marker not found')
# Keep zone criteria guide and rest of section after our map header. New map_html opens section but does not close before guide.
html = html[:start] + map_html + html[mid:]
index_path.write_text(html, encoding='utf-8')

# ---------- 3) Append final CSS overrides for real-map layout ----------
css_path = BASE/'assets'/'css'/'style.css'
css = css_path.read_text(encoding='utf-8')
css += r'''

/* Final real-world-map rebuild: accurate vector base + controlled U.A.C overlay. */
.continental-map-shell{position:relative;}
.continent-panel.active{grid-template-columns:minmax(0,1fr) 315px!important;gap:14px!important;align-items:start!important;}
.continent-map-frame{position:relative!important;min-height:570px!important;background:#030507!important;border:1px solid #35404a!important;overflow:hidden!important;}
.continent-map-img{width:100%!important;height:100%!important;object-fit:fill!important;opacity:1!important;filter:contrast(1.05) brightness(1.04)!important;}
.continent-map-frame:after{pointer-events:none!important;content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,transparent 68%,rgba(0,0,0,.28) 100%)!important;z-index:1!important;}
.map-overlay,.continent-marker{position:absolute!important;z-index:4!important;}
.continent-zone-blob{width:var(--w)!important;height:var(--h)!important;left:0;top:0;transform:translate(-50%,-50%) rotate(var(--rot,0deg))!important;border-radius:50%!important;opacity:.82!important;mix-blend-mode:normal!important;pointer-events:auto!important;}
.continent-zone-blob.red{background:radial-gradient(circle,rgba(160,24,34,.74) 0%,rgba(122,17,27,.52) 58%,rgba(80,8,14,.12) 100%)!important;border:1.7px solid rgba(230,55,64,.96)!important;box-shadow:0 0 18px rgba(220,40,48,.28)!important;}
.continent-zone-blob.yellow{background:radial-gradient(circle,rgba(170,136,36,.52) 0%,rgba(138,112,32,.34) 66%,rgba(95,76,20,.09) 100%)!important;border:1.5px solid rgba(230,198,70,.92)!important;box-shadow:0 0 13px rgba(215,180,54,.16)!important;}
.continent-zone-blob.green{background:radial-gradient(circle,rgba(50,120,82,.46) 0%,rgba(34,82,58,.26) 66%,rgba(34,82,58,.08) 100%)!important;border:1.35px solid rgba(105,195,140,.84)!important;box-shadow:0 0 10px rgba(75,170,111,.14)!important;}
.continent-zone-blob.white{background:radial-gradient(circle,rgba(192,212,220,.37) 0%,rgba(155,178,188,.22) 68%,rgba(125,150,160,.07) 100%)!important;border:1.35px solid rgba(230,244,248,.82)!important;box-shadow:0 0 10px rgba(190,220,232,.12)!important;}
.continent-zone-blob.black{background:radial-gradient(circle,rgba(0,0,0,.84) 0%,rgba(8,8,10,.60) 58%,rgba(32,6,12,.12) 100%)!important;border:1.55px solid rgba(130,34,58,.88)!important;box-shadow:0 0 17px rgba(145,35,58,.21),inset 0 0 20px rgba(0,0,0,.68)!important;}
.continent-sea-watch{width:var(--w)!important;height:var(--h)!important;transform:translate(-50%,-50%) rotate(var(--rot,0deg))!important;border-radius:50%!important;background:transparent!important;border:1.55px dashed rgba(224,204,122,.86)!important;opacity:.74!important;box-shadow:0 0 10px rgba(224,204,122,.10)!important;pointer-events:auto!important;}
.continent-blockade-line{width:var(--w)!important;height:0!important;transform:translate(-50%,-50%) rotate(var(--rot,0deg))!important;border-top:2px dashed rgba(220,232,238,.86)!important;background:transparent!important;opacity:.80!important;pointer-events:auto!important;}
.continent-marker{width:14px!important;height:14px!important;border:1.2px solid #e3ecef!important;border-radius:50%!important;background:#b9c9d2!important;box-shadow:0 0 0 2px rgba(0,0,0,.62),0 0 7px rgba(220,235,240,.15)!important;transform:translate(-50%,-50%)!important;cursor:pointer!important;}
.continent-marker.red,.continent-marker.yellow,.continent-marker.green,.continent-marker.white,.continent-marker.black{background:#c9343f!important;border-color:#ff747a!important;}
.continent-marker.facility{width:13px!important;height:13px!important;border-radius:2px!important;clip-path:polygon(50% 0,100% 28%,100% 72%,50% 100%,0 72%,0 28%)!important;}
.continent-marker.facility.uac{background:#7eb7d0!important;border-color:#d9f3ff!important}.continent-marker.facility.nhc{background:#b8c0c8!important;border-color:#fff!important}.continent-marker.facility.cpd{background:#d3d8d9!important;border-color:#fff!important}.continent-marker.facility.arf{background:#95afd0!important;border-color:#dfeeff!important}.continent-marker.facility.ash{background:#c28553!important;border-color:#ffd0a0!important}.continent-marker.facility.sid{background:#9da3ba!important;border-color:#e3e8ff!important}
.continent-marker.anomaly{clip-path:polygon(50% 0,100% 100%,0 100%)!important;border-radius:0!important;background:#858aa0!important;border-color:#d8def0!important;}
.continent-marker.incident{border-radius:1px!important;background:#d64f5a!important;border-color:#ffd0d3!important;transform:translate(-50%,-50%) rotate(45deg)!important;}
.continent-marker.incident span{transform:translateX(-50%) rotate(-45deg)!important;}
.continent-marker.blockade{width:30px!important;height:10px!important;border:0!important;border-top:2.2px dashed #dce8ee!important;background:transparent!important;box-shadow:none!important;border-radius:0!important;}
.continent-marker span{opacity:0!important;position:absolute!important;bottom:20px!important;left:50%!important;transform:translateX(-50%)!important;white-space:nowrap!important;max-width:220px!important;background:rgba(2,3,4,.95)!important;border:1px solid rgba(190,200,210,.72)!important;color:#e6ecef!important;padding:4px 7px!important;font-size:10px!important;pointer-events:none!important;}
.continent-marker:hover span{opacity:1!important;}.continent-marker:hover{filter:brightness(1.35)!important;z-index:10!important;}
.map-detail-card{position:absolute!important;left:12px!important;bottom:12px!important;z-index:8!important;width:min(330px,calc(100% - 24px))!important;border:1px solid rgba(115,126,136,.55)!important;background:rgba(3,5,7,.88)!important;box-shadow:0 10px 26px rgba(0,0,0,.5)!important;padding:10px 12px!important;font-family:Consolas,'Malgun Gothic',monospace!important;color:#d8dee2!important;}
.map-detail-card b{display:block!important;color:#d2787d!important;font-size:13px!important;margin-bottom:4px!important}.map-detail-card p{margin:0!important;color:#c8d0d4!important;font-size:12px!important;line-height:1.45!important}.map-detail-card small{display:block!important;color:#9aa4aa!important;margin-top:6px!important;font-size:11px!important}
.clean-legend{background:rgba(5,7,10,.92)!important;border-color:#39434b!important;gap:7px!important}.clean-legend .lg{border-radius:2px!important;clip-path:none!important;transform:none!important}.lg-red{background:#9e1c25!important;border-color:#e43b44!important}.lg-yellow{background:#9d802b!important;border-color:#e6c646!important}.lg-green{background:#377c58!important;border-color:#6cc38c!important}.lg-white{background:#bdcdd5!important;border-color:#eefcff!important}.lg-black{background:#050608!important;border-color:#84223a!important}.lg-facility{background:#aab8c8!important;clip-path:polygon(50% 0,100% 28%,100% 72%,50% 100%,0 72%,0 28%)!important}.lg-anomaly{background:#858aa0!important;clip-path:polygon(50% 0,100% 100%,0 100%)!important}.lg-incident{background:#d64f5a!important;transform:rotate(45deg)!important}.lg-blockade{height:0!important;border:0!important;border-top:2px dashed #dce8ee!important}.lg-sea{border:1px dashed #d7c991!important;border-radius:50%!important;background:transparent!important}
.continent-region-info{max-height:570px!important;overflow:hidden!important}.continent-region-info h3{font-size:18px!important}.continent-point-list{max-height:490px!important;overflow:auto!important;padding-right:2px!important}.continent-point{padding:6px 7px!important}.continent-point b{font-size:10px!important}.continent-point span{font-size:11px!important}.continent-point small{font-size:9.5px!important;color:#8d999f!important}
.continental-map-shell[data-filter="zone"] .map-overlay:not([data-filter="zone"]),.continental-map-shell[data-filter="facility"] .map-overlay:not([data-filter="facility"]),.continental-map-shell[data-filter="anomaly"] .map-overlay:not([data-filter="anomaly"]),.continental-map-shell[data-filter="incident"] .map-overlay:not([data-filter="incident"]),.continental-map-shell[data-filter="blockade"] .map-overlay:not([data-filter="blockade"]){display:none!important}.continental-map-shell[data-filter="zone"] .continent-marker:not([data-filter="zone"]),.continental-map-shell[data-filter="facility"] .continent-marker:not([data-filter="facility"]),.continental-map-shell[data-filter="anomaly"] .continent-marker:not([data-filter="anomaly"]),.continental-map-shell[data-filter="incident"] .continent-marker:not([data-filter="incident"]),.continental-map-shell[data-filter="blockade"] .continent-marker:not([data-filter="blockade"]){display:none!important}
@media(max-width:980px){.continent-panel.active{grid-template-columns:1fr!important}.continent-map-frame{min-height:390px!important}.map-detail-card{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;margin:8px!important;width:auto!important}.continent-region-info{max-height:none!important}}
'''
css_path.write_text(css, encoding='utf-8')

# Validate SVG close tags / basic.
for svg in MAP_DIR.glob('*.svg'):
    text=svg.read_text(encoding='utf-8')
    if '</svg>' not in text:
        raise SystemExit(f'SVG missing close tag: {svg}')
print('done')
