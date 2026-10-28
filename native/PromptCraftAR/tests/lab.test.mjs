import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PromptCraftLabSession as Session,DISCLOSURE,optionsFor,promptFor,storyFor} from '../Assets/Scripts/PromptCraftLabState.ts';
const act=(s,a)=>s.act(a,s.snapshot().revision);
const at=(step)=>{const s=new Session();while(s.snapshot().step!==step){assert.equal(act(s,'next'),true);}return s;};
test('vague start, persistent prepared offline provenance, obvious Begin',()=>{const s=new Session().snapshot();assert.equal(s.step,'start');assert.equal(s.prompt,'Write me a story.');assert.match(s.disclosure,/offline.*authored.*not live AI/);assert.equal(optionsFor(s).length,0);});
for(const [key,values,field] of [['intent',['cooperate','explore'],'resolution'],['audience',['young','adult'],'setting'],['context',['garden','station'],'problem'],['form',['beats','sentences'],'setting']]){
 test(key+' has distinct prompt and relevant story effects and exact reversal',()=>{const s=at(key),base=s.snapshot();const outcomes=[];for(const v of values){assert.equal(act(s,'choose:'+key+':'+v),true);const n=s.snapshot();outcomes.push(n);assert.notEqual(n.prompt,base.prompt);assert.notEqual(n.story[field],base.story[field]);assert.match(n.changed,/→/);act(s,'choose:'+key+':none');assert.deepEqual(s.snapshot().story,base.story);assert.equal(s.snapshot().prompt,base.prompt);}assert.notEqual(outcomes[0].story[field],outcomes[1].story[field]);});
}
test('form sentences obey three sentence contract for every content combination',()=>{for(const intent of ['none','cooperate','explore'])for(const audience of ['none','young','adult'])for(const context of ['none','garden','station']){const story=storyFor({intent,audience,context,form:'sentences'});assert.equal(Object.values(story).join(' ').match(/[.!?]/g).length,3);}});
test('every exposed choice is accepted once and repeated choice is idempotent',()=>{for(const step of ['intent','audience','context','form']){const s=at(step);for(const o of optionsFor(s.snapshot())){const old=s.snapshot();const result=act(s,o.action);if(o.action.endsWith(':none'))continue;assert.equal(result,true);const chosen=s.snapshot();assert.equal(act(s,o.action),false);assert.deepEqual(s.snapshot(),chosen);assert.equal(s.snapshot().revision,old.revision+1);}}});
test('navigation keeps valid choices and rejects hidden/stale transitions',()=>{const s=at('audience');act(s,'choose:audience:adult');const p=s.snapshot().prompt;act(s,'back');assert.equal(s.snapshot().prompt,p);assert.equal(act(s,'choose:audience:young'),false);act(s,'next');assert.equal(s.snapshot().prompt,p);const r=s.snapshot().revision;act(s,'help');assert.equal(s.act('next',r),false);assert.equal(act(s,'next'),false);assert.equal(act(s,'choose:audience:young'),false);});
test('invalid commands and revision numbers fail closed',()=>{const s=new Session(),b=s.snapshot();for(const a of ['nonsense','predict:setting','choose:context:moon','back','retry'])assert.equal(act(s,a),false);assert.equal(s.act('next',-1),false);assert.deepEqual(s.snapshot(),b);});
for(const context of ['none','garden','station'])test('prediction snapshot/retry restores original '+context,()=>{const s=at('context');if(context!=='none')act(s,'choose:context:'+context);act(s,'next');act(s,'next');const before=s.snapshot();assert.equal(act(s,'next'),false);act(s,'predict:wording');let n=s.snapshot();assert.deepEqual(n.before,before.story);assert.match(n.feedback,/Try again/);assert.equal(act(s,'next'),false);act(s,'retry');assert.deepEqual(s.snapshot().story,before.story);assert.deepEqual(s.snapshot().choices,before.choices);act(s,'predict:setting');n=s.snapshot();assert.match(n.feedback,/Correct/);assert.notEqual(n.story.setting,n.before.setting);assert.notEqual(n.story.problem,n.before.problem);assert.equal(n.story.resolution,n.before.resolution);act(s,'next');assert.equal(s.snapshot().step,'complete');});
test('snapshot copies cannot mutate live state',()=>{const s=at('predict');act(s,'predict:setting');const x=s.snapshot();x.choices.context='bad';x.before.setting='bad';assert.notEqual(s.snapshot().choices.context,'bad');assert.notEqual(s.snapshot().before.setting,'bad');});
test('Restart clears full lesson, feedback and snapshots and invalidates old inputs',()=>{const s=at('predict');act(s,'predict:setting');const old=s.snapshot().revision;act(s,'restart');const n=s.snapshot();assert.equal(n.step,'start');assert.equal(n.before,null);assert.equal(n.feedback,'');assert.equal(n.prediction,'');assert.equal(n.changed,'');assert.equal(n.prompt,'Write me a story.');assert.equal(s.act('next',old),false);assert.equal(n.disclosure,DISCLOSURE);});
test('Help preserves learning state, motion preference and Recenter are independent',()=>{const s=at('context');act(s,'choose:context:garden');const b=s.snapshot();act(s,'help');act(s,'motion');act(s,'recenter');act(s,'help');const n=s.snapshot();assert.equal(n.prompt,b.prompt);assert.deepEqual(n.story,b.story);assert.equal(n.motion,false);assert.equal(n.help,false);act(s,'restart');assert.equal(s.snapshot().motion,false);});
test('all bounded combinations retain honest provenance and instruction effects',()=>{for(const intent of ['none','cooperate','explore'])for(const audience of ['none','young','adult'])for(const context of ['none','garden','station'])for(const form of ['none','beats','sentences']){const c={intent,audience,context,form},p=promptFor(c),s=storyFor(c);if(context==='station'){assert.match(p,/space station/);assert.match(s.setting,/space station/);assert.match(s.problem,/air leak/);}if(context==='garden'){assert.match(s.setting,/garden/);assert.match(s.problem,/dry seed/);}if(intent==='cooperate')assert.match(s.resolution,/Jo/);if(intent==='explore')assert.match(s.resolution,/tries|tests/);}});

test('Back from completion retains comparison evidence and valid Finish',()=>{const s=at('predict');act(s,'predict:setting');const before=s.snapshot().before;act(s,'next');act(s,'back');assert.equal(s.snapshot().step,'compare');assert.match(s.snapshot().feedback,/Correct/);assert.deepEqual(s.snapshot().before,before);assert.equal(act(s,'next'),true);assert.equal(s.snapshot().step,'complete');});

// Compare declares context -> setting + problem, resolution UNCHANGED.
// Exercise every directed context switch for all 81 bounded configurations.
test('declared context mapping holds for all 81 combinations and every context switch',()=>{
 let cases=0;
 for(const intent of ['none','cooperate','explore'])for(const audience of ['none','young','adult'])for(const context of ['none','garden','station'])for(const form of ['none','beats','sentences']){
  cases++;const before=storyFor({intent,audience,context,form});
  for(const nextContext of ['none','garden','station'].filter(v=>v!==context)){
   const after=storyFor({intent,audience,context:nextContext,form});
   assert.notEqual(after.setting,before.setting);assert.notEqual(after.problem,before.problem);
   assert.equal(after.resolution,before.resolution,JSON.stringify({intent,audience,context,form,nextContext}));
  }
 }
 assert.equal(cases,81);
});
test('actual prediction snapshots preserve resolution for all bounded choices',()=>{
 for(const intent of ['none','cooperate','explore'])for(const audience of ['none','young','adult'])for(const context of ['none','garden','station'])for(const form of ['none','beats','sentences']){
  const s=new Session();act(s,'next');
  for(const [key,value] of Object.entries({intent,audience,context,form})){if(value!=='none')assert.equal(act(s,'choose:'+key+':'+value),true);assert.equal(act(s,'next'),true);}
  const before=s.snapshot();assert.equal(act(s,'predict:setting'),true);const after=s.snapshot();
  assert.equal(after.changed,'Context → setting + problem');assert.match(after.feedback,/Correct/);
  assert.deepEqual(after.before,before.story);assert.equal(after.story.resolution,before.story.resolution);
  assert.notEqual(after.story.setting,before.story.setting);assert.notEqual(after.story.problem,before.story.problem);
 }
});
test('Discover remains independent, distinct by audience and different from cooperation',()=>{
 const resolutions=[];
 for(const audience of ['none','young','adult']){
  const c={intent:'explore',audience,context:'none',form:'none'},r=storyFor(c).resolution;
  assert.match(r,/own idea|independently/);assert.match(r,/tries|tests/);
  assert.notEqual(r,storyFor({...c,intent:'cooperate'}).resolution);resolutions.push(r);
 }
 assert.equal(new Set(resolutions).size,3);
});
