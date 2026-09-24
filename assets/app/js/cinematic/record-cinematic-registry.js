// Project Curse — cinematic record registry
(function(root){
  'use strict';

  const records=new Map();

  function register(definition){
    if(!definition || typeof definition.id!=='string' || !definition.id.trim()){
      throw new TypeError('Cinematic record requires a stable id.');
    }
    if(records.has(definition.id)){
      throw new Error(`Duplicate cinematic record: ${definition.id}`);
    }
    const record=Object.freeze({...definition});
    records.set(record.id,record);
    return record;
  }

  function get(id){
    return records.get(id)||null;
  }

  function ids(){
    return Array.from(records.keys());
  }

  function pages(id){
    const record=get(id);
    if(!record) return [];
    const value=typeof record.pages==='function'?record.pages():record.pages;
    return Array.isArray(value)?value:[];
  }

  function check(){
    return ids().map(id=>{
      const record=get(id);
      return {
        id,
        hasPages:pages(id).length>0,
        hasIntro:typeof record.introVideo==='string'&&record.introVideo.length>0,
        hasBgm:typeof record.bgm==='string'&&record.bgm.length>0
      };
    });
  }

  root.ProjectCurseCinematicRegistry=Object.freeze({
    version:'5.15.2cl',
    register,
    get,
    ids,
    pages,
    check
  });
})(window);
