import {scenariosIndex} from 'Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator';
import {ScenarioMetadata} from 'Leaf.lspkg/Scenarios/scenario/ScenarioMetadata';
import {PromptCraftSliceScenario} from './PromptCraftSliceScenario';
import {PromptCraftGuardScenario} from './PromptCraftGuardScenario';
import {PromptCraftCaptureScenario} from './PromptCraftCaptureScenario';
import {PromptCraftLabScenario} from './PromptCraftLabScenario';
import {PromptCraftLabGuardScenario} from './PromptCraftLabGuardScenario';
import {PromptCraftPlacementScenario} from './PromptCraftPlacementScenario';
@component
export class PromptCraftLeaf extends BaseScriptComponent {
  @scenariosIndex static scenarios:ScenarioMetadata[] = [
    // Slice assertions and source remain preserved; their disabled harness is
    // superseded in the active scene by the complete lab scenarios below.
    {id:'promptcraft-lab',typename:PromptCraftLabScenario.getTypeName(),parameters:{mode:'full'}},
    {id:'promptcraft-lab-guards',typename:PromptCraftLabGuardScenario.getTypeName()},
    {id:'promptcraft-placement',typename:PromptCraftPlacementScenario.getTypeName()}
  ];
}
