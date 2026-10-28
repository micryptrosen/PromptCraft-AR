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
  if(mode==='spatial'){
   const visual=(n:string)=>findSceneObjectByName(n).getComponent('Component.RenderMeshVisual') as RenderMeshVisual;
   const fingerprint=(n:string)=>{const m=visual(n).mesh;return JSON.stringify([Array.from(m.getVertexDataForAttribute('position')),Array.from(m.getIndexBuffer())]);};
   const symbols=()=>[0,1,2].map(i=>fingerprint('StoryStructureSymbol'+i));
   const materials=[0,1,2].map(i=>visual('StoryStructureSymbol'+i).mainMaterial);
   const connectors=[0,1].map(i=>fingerprint('StoryConnection'+i));
   const audit=()=>{
    const rows:unknown[]=[];let symbolCount=0;const parent=findSceneObjectByName('LabConnections');
    for(let i=0;i<parent.getChildrenCount();i++)if(parent.getChild(i).name.startsWith('StoryStructureSymbol'))symbolCount++;
    expect(symbolCount).toBe(3);
    for(let i=0;i<3;i++)expect(visual('StoryStructureSymbol'+i).mainMaterial.isSame(materials[i])).toBe(true);
    for(let i=0;i<2;i++){
     const o=findSceneObjectByName('StoryStructureSymbol'+i),v=visual(o.name),m=v.mesh;
     const p=m.getVertexDataForAttribute('position'),idx=m.getIndexBuffer(),lo=m.aabbMin,hi=m.aabbMax;
     expect(p.length>0&&p.length/3<=256&&idx.length>0&&idx.length<=768).toBe(true);
     expect(hi.x-lo.x<=4.001&&hi.y-lo.y<=4.001&&hi.z-lo.z<=.801).toBe(true);
     expect(Array.from(p).every(Number.isFinite)).toBe(true);
     for(let j=0;j<idx.length;j+=3){
      const a=idx[j]*3,b=idx[j+1]*3,c=idx[j+2]*3;
      expect(Math.max(a,b,c)+2<p.length).toBe(true);
      expect((p[b]-p[a])*(p[c+1]-p[a+1])-(p[b+1]-p[a+1])*(p[c]-p[a])>.001).toBe(true);
     }
     rows.push({name:o.name,vertices:p.length/3,indices:idx.length,localMin:lo.toString(),localMax:hi.toString(),worldMin:v.worldAabbMin().toString(),worldMax:v.worldAabbMax().toString()});
    }
    expect(fingerprint('StoryConnection0')).toBe(connectors[0]);expect(fingerprint('StoryConnection1')).toBe(connectors[1]);
    print('SPATIAL_ACTUAL_MESH '+JSON.stringify(rows));
   };
   await tap('LabNext');await tap('LabOption0');await tap('LabNext');await tap('LabOption0');await tap('LabNext');
   const unchanged=symbols();await tap('LabOption0');const garden=symbols();audit();
   expect(garden[2]).toBe(unchanged[2]);expect(garden[0]!==garden[1]).toBe(true);
   const original=findSceneObjectByName('StoryStructureSymbol0');await tap('LabOption0');expect(findSceneObjectByName('StoryStructureSymbol0').isSame(original)).toBe(true);
   await tap('LabOption1');const station=symbols();audit();
   expect(station[0]!==garden[0]&&station[1]!==garden[1]&&station[0]!==station[1]).toBe(true);expect(station[2]).toBe(garden[2]);
   await tap('LabOption2');expect(JSON.stringify(symbols())).toBe(JSON.stringify(unchanged));
   for(let i=0;i<6;i++){await tap('LabOption0');expect(JSON.stringify(symbols())).toBe(JSON.stringify(garden));audit();await tap('LabOption1');expect(JSON.stringify(symbols())).toBe(JSON.stringify(station));audit();}
   await tap('LabHelp');await tap('LabOption2');expect(text('LabOption2Label')).toBe('Motion: off');
   const transforms=[0,1].map(i=>findSceneObjectByName('StoryConnection'+i).getTransform());
   const scales=transforms.map(t=>t.getLocalScale());await sleep(350);
   transforms.forEach((t,i)=>{expect(t.getLocalScale().distance(scales[i])<.001).toBe(true);expect(t.getLocalScale().distance(vec3.one())<.001).toBe(true);});
   await tap('LabHelp');expect(JSON.stringify(symbols())).toBe(JSON.stringify(station));audit();
   print('SPATIAL PASS: actual mesh distinctness, CCW faces, finite bounded resources, context-only change, reversal, repeat cache, stable role materials, 12 swaps and motion off');return;
  }
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
  expect(text('LabChanged').startsWith('Last change: Intent')).toBe(true);
  if(mode==='selection')return;
  await tap('LabNext');
  if(mode==='full')await selectAndReverse('young reader','LabSetting');else await tap('LabOption0');
  await tap('LabNext');
  if(mode==='full')await selectAndReverse('garden','LabProblem');else await tap('LabOption0');
  if(mode==='context')return;
  await tap('LabNext');
  if(mode==='full')await selectAndReverse('labeled beats','LabResolution');else await tap('LabOption0');
  expect(text('LabChanged')).toBe('Last change: Form → output structure');
  for(const title of ['LabSettingTitle','LabProblemTitle','LabResolutionTitle'])expect(text(title).startsWith('Δ ')).toBe(true);
  if(mode==='form')return;
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

