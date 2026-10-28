import {DefaultSikInteractor} from 'Leaf.lspkg/Interactors/interactor/DefaultSikInteractor';
import {Interactable} from 'SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable';
import {InteractorTriggerType,InteractorInputType} from 'SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor';

// LEAF SIK input source with frame-controlled hold/cancel. Uses protected SIK
// state setters, never invokes an Interactable event or application callback.
@component
export class PromptCraftHeldInteractor extends DefaultSikInteractor {
  constructor() { super(); this.inputType=InteractorInputType.CustomController; }
  target:Interactable|null=null;
  pressed=false;
  active=true;
  updateState():void {
    super.updateState();
    this.currentInteractable=this.target;
    this.currentTrigger=this.pressed ? InteractorTriggerType.Pinch : InteractorTriggerType.None;
  }
  isActive():boolean {return this.active;}
  // Explicit custom-controller semantics; this test source does not track a hand.
  // Kept as a harmless project adapter for older test clients.
  isFarField():boolean {return true;}
}

