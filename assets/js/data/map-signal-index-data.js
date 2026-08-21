// Project Curse 5.47.0 — derived, canon-safe signal index for rendered and withheld map contacts.
(function(root){
  'use strict';

  const map=root.ProjectCurseMapRoom;
  const network=root.ProjectCurseIncidentNetwork;
  if(!map||!network) return;

  const freeze=value=>{
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  };
  const regions=new Map(map.regions.map(region=>[region.id,region]));
  const incidentById=id=>network.getIncident?.(id)||null;
  const incidentForOperation=operation=>incidentById(operation.incident)||network.incidentList.find(incident=>incident.operation===operation.id)||null;
  const unique=values=>[...new Set((values||[]).filter(Boolean))];
  const yearOf=date=>/^\d{4}/.test(date||'')?String(date).slice(0,4):'DATE ?';
  const uncertain=new Set(['estimated','testimony','disputed']);
  const unresolved=(confidence,status='')=>confidence==='disputed'||/UNRESOLVED|UNKNOWN|LOST|SEALED|WITHHELD|상충|불가/i.test(status);
  const factionNames=keys=>unique(keys).map(key=>root.ProjectCurseCanon?.factions?.[key]?.name||key);
  const regionLabel=id=>regions.get(id)?.label||'권역 미확정';
  const operationRegionId=operation=>{
    const incident=incidentForOperation(operation);
    if(incident?.region) return incident.region;
    if(/대흑림|남미/.test(operation.region)) return 'southamerica';
    if(/데드존|북미/.test(operation.region)) return 'northamerica';
    if(/유럽|북해/.test(operation.region)) return 'europe';
    return 'world';
  };
  const withSearch=(item,parts)=>({...item,search:unique(parts.flat(Infinity)).join(' ').toLocaleLowerCase('ko-KR')});

  const markerItems=map.markers.filter(marker=>!marker.overview).map(marker=>{
    const incident=incidentById(marker.incident);
    const records=unique([...(marker.records||[]),...(incident?.records||[])]);
    const factions=factionNames(incident?.factions||[]);
    const date=incident?.date||'DATE NOT FILED';
    const category=incident?'event':'site';
    const item={
      id:`marker:${marker.id}`,category,target:{kind:'marker',id:marker.id},title:marker.title,code:incident?.code||marker.id.toUpperCase(),
      year:yearOf(date),date,regionId:marker.region,region:regionLabel(marker.region),meta:marker.meta,status:marker.status,
      confidence:marker.confidence,uncertain:uncertain.has(marker.confidence),unresolved:unresolved(marker.confidence,marker.status),
      mapStatus:'rendered',records,factions,history:incident?.history||null,linked:Boolean(records.length||factions.length||incident?.history)
    };
    return withSearch(item,[item.title,item.code,item.year,item.region,item.meta,item.status,records,factions,incident?.summary]);
  });

  const operationItems=map.operations.map(operation=>{
    const incident=incidentForOperation(operation);
    const regionId=operationRegionId(operation);
    const records=unique(incident?.records||[]);
    const factions=factionNames(incident?.factions||[]);
    const confidence=incident?.confidence||'observed';
    const date=incident?.date||'DATE NOT FILED';
    const item={
      id:`operation:${operation.id}`,category:'operation',target:{kind:'operation',id:operation.id},title:operation.label,code:operation.code,
      year:yearOf(date),date,regionId,region:operation.region||regionLabel(regionId),meta:operation.summary,status:operation.status||'TRACE RECONSTRUCTED',
      confidence,uncertain:uncertain.has(confidence),unresolved:unresolved(confidence,`${operation.status||''} ${operation.classification||''}`),
      mapStatus:'operation',records,factions,history:incident?.history||null,linked:Boolean(records.length||factions.length||incident?.history)
    };
    return withSearch(item,[item.title,item.code,item.year,item.region,item.meta,item.status,operation.classification,records,factions,incident?.title]);
  });

  const synchronyItems=(map.synchronyEvents||[]).flatMap(event=>event.points.map(point=>{
    const item={
      id:`synchrony:${point.id}`,category:'synchrony',target:{kind:'synchrony',event:event.id,id:point.id},title:point.label,code:`${event.code}/${point.code}`,
      year:yearOf(event.date),date:event.date,regionId:point.region,region:regionLabel(point.region),meta:`${event.title} · ${point.site}`,status:event.status,
      confidence:event.confidence,uncertain:false,unresolved:true,mapStatus:'independent',records:[],factions:[],history:event.history||null,linked:Boolean(event.history)
    };
    return withSearch(item,[item.title,item.code,item.year,item.region,item.meta,item.status,point.callsign,point.log,event.summary]);
  }));

  const renderedIncidentIds=new Set(map.markers.map(marker=>marker.incident).filter(Boolean));
  const operationIncidentIds=new Set(map.operations.map(operation=>incidentForOperation(operation)?.id).filter(Boolean));
  const withheldItems=network.incidentList.filter(incident=>incident.coordinates&&!renderedIncidentIds.has(incident.id)&&!operationIncidentIds.has(incident.id)).map(incident=>{
    const records=unique(incident.records||[]);
    const factions=factionNames(incident.factions||[]);
    const item={
      id:`withheld:${incident.id}`,category:'withheld',target:{kind:'withheld',id:incident.id},title:incident.title,code:incident.code,
      year:yearOf(incident.date),date:incident.date,regionId:incident.region,region:regionLabel(incident.region),meta:incident.summary,status:'MAP POSITION WITHHELD',
      confidence:incident.confidence,uncertain:true,unresolved:true,mapStatus:'withheld',records,factions,history:incident.history||null,factionKeys:incident.factions||[],linked:Boolean(records.length||factions.length||incident.history)
    };
    return withSearch(item,[item.title,item.code,item.year,item.region,item.meta,item.status,records,factions]);
  });

  const categoryOrder={event:0,site:1,operation:2,synchrony:3,withheld:4};
  const items=[...markerItems,...operationItems,...synchronyItems,...withheldItems]
    .sort((a,b)=>categoryOrder[a.category]-categoryOrder[b.category]||a.year.localeCompare(b.year)||a.title.localeCompare(b.title,'ko'));

  root.ProjectCurseMapSignalIndex=freeze({
    version:root.ProjectCurseBuild?.version||'5.47.0',
    items,
    filters:[
      {id:'all',label:'전체'},
      {id:'event',label:'사건'},
      {id:'site',label:'현장'},
      {id:'operation',label:'작전'},
      {id:'synchrony',label:'동시 관측'},
      {id:'confirmed',label:'확인'},
      {id:'estimated',label:'추정'},
      {id:'unresolved',label:'미해결'},
      {id:'linked',label:'기록 연결'}
    ],
    categoryLabels:{event:'EVENT',site:'FIELD SITE',operation:'OPERATION',synchrony:'ISOLATED OBSERVATION',withheld:'WITHHELD'},
    confidenceLabels:{confirmed:'확인 자료',observed:'관측 자료',corroborated:'교차 확인',historical:'과거 기록',estimated:'추정 좌표',testimony:'순례자 증언',disputed:'상충 진술'}
  });
})(window);
