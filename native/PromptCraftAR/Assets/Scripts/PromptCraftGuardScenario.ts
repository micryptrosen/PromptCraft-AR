import {Scenario} from 'Leaf.lspkg/Scenarios/scenario/Scenario';
import {DefaultLeafInteractor} from 'Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor';
import {findInteractableByName} from 'Leaf.lspkg/Interactors/InteractableUtils';
import {findSceneObjectByName,sleep} from 'Leaf.lspkg/Utils/common/Utils';
import {expect} from 'Leaf.lspkg/Utils/common/Expect';
import {PromptCraftHeldInteractor} from './PromptCraftHeldInteractor';
function prompt():string {return (findSceneObjectByName('AssembledPrompt').getComponent('Component.Text') as Text).text;}
@component
export class PromptCraftGuardScenario extends Scenario {
  async run():Promise<void> {
    await sleep(1500);
    const resetInput=new DefaultLeafInteractor('ResetInput');
    const choose=findInteractableByName('YoungReaderButton');
    const restart=findInteractableByName('RestartButton');
    await resetInput.trigger(restart); await sleep(150);
    const initial=prompt();
    const host=global.scene.createSceneObject('HeldLeafInput');
    const held=host.createComponent(PromptCraftHeldInteractor.getTypeName()) as PromptCraftHeldInteractor;
    let begins=0, ends=0, cancels=0;
    const off=[choose.onTriggerStart.add(()=>begins++),choose.onTriggerEnd.add(()=>ends++),choose.onTriggerCanceled.add(()=>cancels++)];
    try {
      held.target=choose; await sleep(150);
      held.pressed=true; await sleep(150);
      expect(begins).toBe(1); expect(ends).toBe(0); expect(prompt()).toBe(initial);
      await resetInput.trigger(restart); await sleep(150);
      held.pressed=false; await sleep(150);
      expect(ends).toBe(1); expect(prompt()).toBe(initial);
      print('GUARD: actual SIK begin -> other input Restart -> old release rejected');
      // Fresh input must still work, proving the guard does not disable selection.
      held.pressed=true; await sleep(150); held.pressed=false; await sleep(150);
      expect(prompt()).toBe('Write me a story. For a young reader.');
      await resetInput.trigger(restart); await sleep(150);
      held.pressed=true; await sleep(150);
      const endsBeforeLoss=ends;
      held.active=false; held.pressed=false; await sleep(150);
      expect(cancels).toBe(1);
      // This SIK version also delivers an end on input loss. Cancellation must
      // invalidate the pending action even when that end is delivered.
      expect(ends).toBe(endsBeforeLoss+1);
      expect(prompt()).toBe(initial);
      held.active=true; await sleep(150);
      expect(prompt()).toBe(initial);
      print('GUARD: actual SIK trigger canceled on input loss; no commit');
    } finally { off.forEach(remove=>remove()); host.destroy(); }
  }
}
