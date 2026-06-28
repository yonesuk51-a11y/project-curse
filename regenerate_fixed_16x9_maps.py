from pathlib import Path
import re, math
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap

BASE=Path(__file__).resolve().parent
MAP_DIR=BASE/'assets'/'maps'
MAP_DIR.mkdir(parents=True, exist_ok=True)

REGIONS={
 'world_actual_base.svg': dict(label='U.A.C GLOBAL ACTUAL MAP', lon=(-180,180), lat=(-58,84), mer=30, par=20),
 'global_zone_map.svg': dict(label='U.A.C GLOBAL ACTUAL MAP', lon=(-180,180), lat=(-58,84), mer=30, par=20),
 'global_zone_map_clean.svg': dict(label='U.A.C GLOBAL ACTUAL MAP', lon=(-180,180), lat=(-58,84), mer=30, par=20),
 'continent_east_asia.svg': dict(label='EAST ASIA ACTUAL MAP', lon=(70,155), lat=(-5,58), mer=15, par=10),
 'continent_europe.svg': dict(label='EUROPE ACTUAL MAP', lon=(-25,45), lat=(30,72), mer=10, par=10),
 'continent_north_america.svg': dict(label='NORTH AMERICA ACTUAL MAP', lon=(-170,-25), lat=(5,81), mer=20, par=10),
 'continent_south_asia.svg': dict(label='SOUTH ASIA ACTUAL MAP', lon=(60,100), lat=(0,38), mer=10, par=8),
 'continent_se_asia_indian.svg': dict(label='SEA / INDIAN ACTUAL MAP', lon=(88,130), lat=(-13,25), mer=10, par=8),
 'continent_oceania.svg': dict(label='OCEANIA ACTUAL MAP', lon=(110,180), lat=(-48,-5), mer=10, par=8),
 'continent_middle_east.svg': dict(label='MIDDLE EAST ACTUAL MAP', lon=(25,65), lat=(10,42), mer=10, par=8),
 'continent_africa.svg': dict(label='AFRICA ACTUAL MAP', lon=(-20,55), lat=(-35,38), mer=15, par=10),
 # legacy aliases kept for older references
 'continent_south.svg': dict(label='SOUTHERN BELT ACTUAL MAP', lon=(55,180), lat=(-50,35), mer=20, par=10),
 'continent_me_africa.svg': dict(label='MIDDLE EAST / AFRICA ACTUAL MAP', lon=(-25,65), lat=(-38,45), mer=15, par=10),
}

def svg_fix(path: Path):
    txt=path.read_text(encoding='utf-8')
    # keep the native 16:9 viewBox but make the browser scale it to the map frame.
    txt=re.sub(r'<svg ([^>]*?)width="[^"]+" height="[^"]+"', r'<svg \1width="100%" height="100%"', txt, count=1)
    # remove XML comments that Matplotlib injects with timestamps? keep stable enough.
    path.write_text(txt, encoding='utf-8')

def draw(name,cfg):
    lon0,lon1=cfg['lon']; lat0,lat1=cfg['lat']
    fig=plt.figure(figsize=(16,9), dpi=100, facecolor='#020506')
    ax=fig.add_axes([0,0,1,1], facecolor='#020506')
    m=Basemap(projection='cyl', llcrnrlon=lon0, urcrnrlon=lon1, llcrnrlat=lat0, urcrnrlat=lat1, resolution='l', ax=ax)
    m.drawmapboundary(fill_color='#020506', linewidth=0)
    m.fillcontinents(color='#0a151b', lake_color='#020506', zorder=1)
    m.drawcoastlines(color='#d8e1e7', linewidth=0.74, zorder=4)
    m.drawcountries(color='#52636e', linewidth=0.34, zorder=3)
    try:
        m.drawrivers(color='#1b303a', linewidth=0.12, zorder=2)
    except Exception:
        pass
    mer=list(range(math.floor(lon0/cfg['mer'])*cfg['mer'], math.ceil(lon1/cfg['mer'])*cfg['mer']+1, cfg['mer']))
    par=list(range(math.floor(lat0/cfg['par'])*cfg['par'], math.ceil(lat1/cfg['par'])*cfg['par']+1, cfg['par']))
    m.drawmeridians(mer, color='#19323c', linewidth=0.25, dashes=[1,0], labels=[0,0,0,0], zorder=0, alpha=0.68)
    m.drawparallels(par, color='#19323c', linewidth=0.25, dashes=[1,0], labels=[0,0,0,0], zorder=0, alpha=0.68)
    # fixed frame: no bbox_inches='tight'. This preserves lon/lat extents over the full 16:9 surface.
    ax.text(lon0+(lon1-lon0)*0.018, lat1-(lat1-lat0)*0.035, cfg['label'], color='#d9e2e8', fontsize=8.5, fontfamily='monospace', alpha=.94, zorder=6)
    ax.text(lon1-(lon1-lon0)*0.06, lat1-(lat1-lat0)*0.12, 'WATCH', color='#425661', fontsize=5.5, fontfamily='monospace', alpha=.55, zorder=6)
    ax.set_xlim(lon0,lon1); ax.set_ylim(lat0,lat1); ax.set_axis_off()
    out=MAP_DIR/name
    fig.savefig(out, format='svg', facecolor='#020506', pad_inches=0)
    plt.close(fig)
    svg_fix(out)

for n,c in REGIONS.items():
    draw(n,c)
print('regenerated', len(REGIONS), 'map surfaces in', MAP_DIR)
