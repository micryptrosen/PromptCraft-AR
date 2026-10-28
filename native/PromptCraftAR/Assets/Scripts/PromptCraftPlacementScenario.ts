import {Scenario} from 'Leaf.lspkg/Scenarios/scenario/Scenario';
import {DefaultLeafInteractor} from 'Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor';
import {findInteractableByName} from 'Leaf.lspkg/Interactors/InteractableUtils';
import {findSceneObjectByName,sleep} from 'Leaf.lspkg/Utils/common/Utils';
import {expect} from 'Leaf.lspkg/Utils/common/Expect';
@component
export class PromptCraftPlacementScenario extends Scenario {
 async run():Promise<void>{await sleep(1800);const input=new DefaultLeafInteractor();const lab=findSceneObjectByName('PromptCraftLaboratory');
 const before=lab.getTransform().getWorldPosition();
 await input.drag(findInteractableByName('PromptCraftLaboratory'),new vec3(8,0,0),500);await sleep(300);
 const after=lab.getTransform().getWorldPosition();print('PLACEMENT before='+before.toString()+' after='+after.toString());expect(after.distance(before)>2).toBe(true);
 // Move it beyond view with the same standard drag route, then recover from the camera-relative button.
 await input.drag(findInteractableByName('PromptCraftLaboratory'),new vec3(65,0,0),700);await sleep(200);
 await input.trigger(findInteractableByName('LabRecovery'));await sleep(300);const recovered=lab.getTransform().getWorldPosition();
 expect(recovered.distance(before)<2).toBe(true);
 expect((findSceneObjectByName('LabPrompt').getComponent('Component.Text') as Text).text).toBe('Write me a story.');
 print('PLACEMENT: actual LEAF SIK Frame drag and off-view camera-relative Recenter PASS; no physical reach claim');
 }
}
