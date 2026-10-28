import {ScenarioConfig} from 'Leaf.lspkg/Scenarios/scenario/ScenarioConfig';
import {Scenario} from 'Leaf.lspkg/Scenarios/scenario/Scenario';
import {DefaultLeafInteractor} from 'Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor';
import {findInteractableByName} from 'Leaf.lspkg/Interactors/InteractableUtils';
import {findSceneObjectByName,sleep} from 'Leaf.lspkg/Utils/common/Utils';
import {expect} from 'Leaf.lspkg/Utils/common/Expect';
function text(n:string):string{return (findSceneObjectByName(n).getComponent('Component.Text') as Text).text;}
@component
export class PromptCraftLabScenario extends Scenario {
 async run(config?:ScenarioConfig):Promise<void>{
  await sleep(1700);const input=new DefaultLeafInteractor();
  const tap=async(n:string)=>{await input.trigger(findInteractableByName(n));await sleep(130);};
  const mode=config?.getOrThrow('mode')||'full';
  expect(text('LabPrompt')).toBe('Write me a story.');const disclosure=text('LabProvenance');
  if(mode==='start')return;
  if(mode==='discover'){
   for(const audienceOption of [2,0,1])for(const contextOption of [2,0,1]){
    await tap('LabNext');await tap('LabOption1');expect(text('LabPrompt').includes('independent discovery')).toBe(true);
    await tap('LabNext');await tap('LabOption'+audienceOption);
    await tap('LabNext');await tap('LabOption'+contextOption);
    await tap('LabNext');await tap('LabOption0');
    const resolution=text('LabResolution').replace(/^[123] [A-Z]+\n/,'');
    const setting=text('LabSetting'),problem=text('LabProblem');
    await tap('LabNext');await tap('LabOption0');
    expect(text('LabInstruction').includes('Correct')).toBe(true);
    expect(text('LabResolution')).toBe('UNCHANGED\n'+resolution);
    expect(text('LabSetting').includes('BEFORE\n'+setting.replace(/^[123] [A-Z]+\n/,''))).toBe(true);
    expect(text('LabProblem').includes('BEFORE\n'+problem.replace(/^[123] [A-Z]+\n/,''))).toBe(true);
    expect(text('LabSetting').includes('\nNOW\n')).toBe(true);expect(text('LabProblem').includes('\nNOW\n')).toBe(true);
    expect(text('LabProvenance')).toBe(disclosure);
    if(audienceOption===1&&contextOption===1)return;
    await tap('LabNext');await tap('LabNext');
   }
  }
  await input.hover(findInteractableByName('LabNext'),200);expect(text('StageTitle').includes('Living')).toBe(true);
  await tap('LabNext');
  const selectAndReverse=async(fragment:string,story:string)=>{
   const before=text(story);await tap('LabOption0');expect(text('LabPrompt').includes(fragment)).toBe(true);expect(text(story)===before).toBe(false);
   const selected=text('LabPrompt');await tap('LabOption0');expect(text('LabPrompt')).toBe(selected);
   await tap('LabOption2');expect(text(story)).toBe(before);await tap('LabOption1');expect(text(story)===before).toBe(false);await tap('LabOption0');
  };
  if(mode==='full')await selectAndReverse('cooperation','LabResolution');else await tap('LabOption0');
  await tap('LabNext');
  if(mode==='full')await selectAndReverse('young reader','LabSetting');else await tap('LabOption0');
  await tap('LabNext');
  if(mode==='full')await selectAndReverse('garden','LabProblem');else await tap('LabOption0');
  if(mode==='context')return;
  await tap('LabNext');
  if(mode==='full')await selectAndReverse('labeled beats','LabResolution');else await tap('LabOption0');
  if(mode==='full'){
   const prompt=text('LabPrompt');await tap('LabBack');expect(text('LabPrompt')).toBe(prompt);await tap('LabNext');expect(text('LabPrompt')).toBe(prompt);
   await tap('LabHelp');expect(text('LabInstruction').includes('Drag the frame')).toBe(true);
   await tap('LabOption2');expect(text('LabOption2Label')).toBe('Motion: off');
   const motion=findSceneObjectByName('StoryConnection0').getTransform();const scale=motion.getLocalScale();await sleep(250);expect(motion.getLocalScale().distance(scale)<.001).toBe(true);
   await tap('LabOption1');await tap('LabHelp');
  }
  await tap('LabNext');expect(text('LabInstruction').includes('Predict:')).toBe(true);if(mode==='predict')return;
  const before=text('LabSetting');await tap('LabOption1');expect(text('LabInstruction').includes('Try again')).toBe(true);expect(text('LabSetting').includes('BEFORE')).toBe(true);
  await tap('LabOption0');expect(text('LabSetting')).toBe(before);expect(text('LabInstruction').includes('Predict:')).toBe(true);
  await tap('LabOption0');expect(text('LabInstruction').includes('Correct')).toBe(true);expect(text('LabSetting').includes('space station')).toBe(true);expect(text('LabProblem').includes('air leak')).toBe(true);expect(text('LabProvenance')).toBe(disclosure);
  if(mode==='compare')return;
  await tap('LabNext');expect(text('StageTitle').includes('Complete')).toBe(true);expect(text('LabInstruction').includes('wrong or incomplete')).toBe(true);if(mode==='complete')return;
  await tap('LabBack');expect(text('LabInstruction').includes('Correct')).toBe(true);expect(text('LabSetting').includes('BEFORE')).toBe(true);await tap('LabNext');
  await tap('LabNext');expect(text('LabPrompt')).toBe('Write me a story.');expect(text('LabProvenance')).toBe(disclosure);
  await tap('LabHelp');await tap('LabOption0');expect(text('StageTitle').includes('Living')).toBe(true);
  print('LAB: actual SIK full loop, every choice family, reversal, repeat, Back, Help, Motion, Recenter, wrong prediction/retry, correct feedback, completion, Restart PASS');
 }
}

