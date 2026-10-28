import {Scenario} from 'Leaf.lspkg/Scenarios/scenario/Scenario';
import {ScenarioConfig} from 'Leaf.lspkg/Scenarios/scenario/ScenarioConfig';
import {DefaultLeafInteractor} from 'Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor';
import {findInteractableByName} from 'Leaf.lspkg/Interactors/InteractableUtils';
import {findSceneObjectByName,sleep} from 'Leaf.lspkg/Utils/common/Utils';
import {expect} from 'Leaf.lspkg/Utils/common/Expect';
@component
export class PromptCraftCaptureScenario extends Scenario {
  async run(config?:ScenarioConfig):Promise<void> {
    await sleep(1500);
    const input=new DefaultLeafInteractor();
    await input.trigger(findInteractableByName('RestartButton'));
    await input.trigger(findInteractableByName('YoungReaderButton')); await sleep(200);
    expect((findSceneObjectByName('AssembledPrompt').getComponent('Component.Text') as Text).text).toBe('Write me a story. For a young reader.');
    const state=config?.getOrThrow('state');
    if(state === 'clear' || state === 'restart') {
      await input.trigger(findInteractableByName(state === 'clear' ? 'ClearAudienceButton' : 'RestartButton'));
      await sleep(200);
      expect((findSceneObjectByName('AssembledPrompt').getComponent('Component.Text') as Text).text).toBe('Write me a story.');
    } else if(state !== 'selected') throw new Error('Invalid capture state');
  }
}
