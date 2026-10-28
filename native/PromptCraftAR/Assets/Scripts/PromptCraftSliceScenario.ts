import {Scenario} from 'Leaf.lspkg/Scenarios/scenario/Scenario';
import {scenariosIndex} from 'Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator';
import {ScenarioMetadata} from 'Leaf.lspkg/Scenarios/scenario/ScenarioMetadata';
import {DefaultLeafInteractor} from 'Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor';
import {findInteractableByName} from 'Leaf.lspkg/Interactors/InteractableUtils';
import {findSceneObjectByName,sleep} from 'Leaf.lspkg/Utils/common/Utils';
import {expect} from 'Leaf.lspkg/Utils/common/Expect';

// Names are authored by PromptCraftSliceUI; assertions observe rendered Text components.
function text(name:string):string {
  return (findSceneObjectByName(name).getComponent('Component.Text') as Text).text;
}
@component
export class PromptCraftSliceScenario extends Scenario {
  async run():Promise<void> {
    await sleep(1500);
    const input = new DefaultLeafInteractor();
    const choose = findInteractableByName('YoungReaderButton');
    const clear = findInteractableByName('ClearAudienceButton');
    const restart = findInteractableByName('RestartButton');
    await input.trigger(restart); await sleep(200);
    const initialPrompt=text('AssembledPrompt'), initialStory=text('AuthoredStory');
    const disclosure=text('Provenance');
    expect(initialPrompt).toBe('Write me a story.');
    await input.hover(choose,300);
    expect(text('AssembledPrompt')).toBe(initialPrompt);
    await input.trigger(choose); await sleep(200);
    expect(text('AssembledPrompt')).toBe('Write me a story. For a young reader.');
    expect(text('AuthoredStory') === initialStory).toBe(false);
    expect(text('SelectionStatus')).toBe('[Selected] Young reader');
    expect(text('Provenance')).toBe(disclosure);
    await input.trigger(choose); await sleep(200);
    expect(text('AssembledPrompt')).toBe('Write me a story. For a young reader.');
    await input.trigger(clear); await sleep(200);
    expect(text('AssembledPrompt')).toBe(initialPrompt);
    expect(text('AuthoredStory')).toBe(initialStory);
    await input.trigger(choose); await sleep(200);
    await input.trigger(restart); await sleep(200);
    expect(text('AssembledPrompt')).toBe(initialPrompt);
    expect(text('AuthoredStory')).toBe(initialStory);
    expect(text('SelectionStatus')).toBe('[No audience selected]');
    expect(text('Provenance')).toBe(disclosure);
  }
}

