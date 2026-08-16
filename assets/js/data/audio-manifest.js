// Project Curse 5.16.0 — semantic sound-event registry.
(function(root){
  'use strict';

  root.ProjectCurseAudioManifest=Object.freeze({
    version:'1.0.0',
    storageKey:'pc_audio_settings_v1',
    buses:Object.freeze({master:1,ambient:1,interface:1,record:1,alert:1}),
    events:Object.freeze({
      'boot.start':Object.freeze({cue:'boot',bus:'interface',cooldown:1600}),
      'record.mount':Object.freeze({cue:'open',bus:'record',cooldown:260}),
      'record.page':Object.freeze({cue:'page',bus:'record',cooldown:180}),
      'system.denied':Object.freeze({cue:'denied',bus:'alert',cooldown:420}),
      'system.alert':Object.freeze({cue:'alert',bus:'alert',cooldown:420})
    })
  });
})(window);
