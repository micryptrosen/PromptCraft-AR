import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PromptCraftSession,PROVENANCE} from '../Assets/Scripts/PromptCraftState.ts';
test('initial vague prompt and authored provenance',()=>{
 const s=new PromptCraftSession().snapshot(); assert.equal(s.prompt,'Write me a story.');
 assert.equal(s.provenance,PROVENANCE); assert.match(s.provenance,/offline.*Authored.*not live AI/);
});
test('audience changes meaningful instructions and wording together',()=>{
 const s=new PromptCraftSession(), before=s.snapshot(); assert.equal(s.select('young',0),true);
 const after=s.snapshot(); assert.match(after.prompt,/young reader/); assert.notEqual(after.example,before.example);
 assert.match(after.example,/She and Jo dug a hole/); assert.match(after.effect,/short sentences/);
});
test('reversal restores prompt and corresponding example',()=>{
 const s=new PromptCraftSession(),before=s.snapshot(); s.select('young',0);s.select('unspecified',1);
 assert.equal(s.snapshot().prompt,before.prompt);assert.equal(s.snapshot().example,before.example);
});
test('repeat selection is idempotent',()=>{
 const s=new PromptCraftSession();s.select('young',0);const before=s.snapshot();
 assert.equal(s.select('young',1),false);assert.deepEqual(s.snapshot(),before);
});
test('invalid input fails closed without mutation',()=>{
 const s=new PromptCraftSession(),before=s.snapshot();
 for(const value of [null,undefined,'adult',{},1]) assert.equal(s.select(value,0),false);
 assert.deepEqual(s.snapshot(),before);
});
test('stale input fails closed, including after Restart',()=>{
 const s=new PromptCraftSession();s.select('young',0);assert.equal(s.select('unspecified',0),false);
 s.restart();assert.equal(s.select('young',1),false);assert.equal(s.snapshot().audience,'unspecified');
});
test('Restart restores visible initial state and invalidates pending selections',()=>{
 const s=new PromptCraftSession(),initial=s.snapshot();s.select('young',0);s.restart();
 const {revision,...after}=s.snapshot(),{revision:unused,...before}=initial;
 assert.deepEqual(after,before);assert.equal(revision,2);s.restart();assert.equal(s.snapshot().audience,'unspecified');
});
test('provenance is immutable across selection/reversal/Restart',()=>{
 const s=new PromptCraftSession();for(const value of ['young','unspecified','young']){
 s.select(value,s.snapshot().revision);assert.equal(s.snapshot().provenance,PROVENANCE);
 }s.restart();assert.equal(s.snapshot().provenance,PROVENANCE);
});
