import {Scenario} from 'Leaf.lspkg/Scenarios/scenario/Scenario';
import {DefaultLeafInteractor} from 'Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor';
import {findInteractableByName} from 'Leaf.lspkg/Interactors/InteractableUtils';
import {findSceneObjectByName,sleep} from 'Leaf.lspkg/Utils/common/Utils';
import {expect} from 'Leaf.lspkg/Utils/common/Expect';
import {PromptCraftHeldInteractor} from './PromptCraftHeldInteractor';
function text(n:string):string{return (findSceneObjectByName(n).getComponent('Component.Text') as Text).text;}
@component
export class PromptCraftLabGuardScenario extends Scenario {
 async run():Promise<void>{await sleep(1800);const input=new DefaultLeafInteractor('GuardNavigation');
 const tap=async(n:string)=>{await input.trigger(findInteractableByName(n));await sleep(150);};
 await tap('LabNext');const choice=findInteractableByName('LabOption0');const host=global.scene.createSceneObject('LabHeldInput');const held=host.createComponent(PromptCraftHeldInteractor.getTypeName()) as PromptCraftHeldInteractor;
 let begins=0,ends=0,cancels=0;const off=[choice.onTriggerStart.add(()=>begins++),choice.onTriggerEnd.add(()=>ends++),choice.onTriggerCanceled.add(()=>cancels++)];
 try{
  held.target=choice;await sleep(120);held.pressed=true;await sleep(120);expect(begins).toBe(1);expect(ends).toBe(0);
  await tap('LabHelp');held.pressed=false;await sleep(120);expect(text('LabPrompt')).toBe('Write me a story.');expect(text('StageTitle')).toBe('Help & placement');
  await tap('LabHelp');held.pressed=true;await sleep(120);held.pressed=false;await sleep(120);expect(text('LabPrompt').includes('cooperation')).toBe(true);
  await tap('LabOption2');const before=text('LabPrompt');held.pressed=true;await sleep(120);const e=ends;held.active=false;held.pressed=false;await sleep(120);expect(cancels).toBe(1);expect(ends).toBe(e+1);expect(text('LabPrompt')).toBe(before);
  held.active=true;await sleep(120);held.pressed=true;await sleep(120);held.pressed=false;await sleep(120);expect(text('LabPrompt').includes('cooperation')).toBe(true);
  held.target=findInteractableByName('LabOption1');await sleep(120);held.pressed=true;await sleep(120);await tap('LabHelp');await tap('LabOption0');held.pressed=false;await sleep(150);expect(text('LabPrompt')).toBe('Write me a story.');expect(text('StageTitle').includes('Living')).toBe(true);
  print('LAB GUARDS: genuine SIK stale release across Help, cancellation plus end, fresh recovery, Restart PASS');
 }finally{off.forEach(f=>f());host.destroy();}
 }
}

