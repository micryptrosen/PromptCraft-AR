// Small camera-relative recovery affordance; the lesson remains world anchored.
import Event from 'SpectaclesInteractionKit.lspkg/Utils/Event';
import {Button} from 'SpectaclesUIKit.lspkg/Scripts/Components/Button/Button';
import {ElementContent} from 'SpectaclesUIKit.lspkg/Scripts/Components/Content/ElementContent';
@component
export class PromptCraftRecoveryUI extends BaseScriptComponent {
 private reset=new Event<void>();get onRecenter(){return this.reset.publicApi();}
 onAwake():void{
  this.sceneObject.createComponent('Component.Canvas');
  const b=this.sceneObject.createComponent(Button.getTypeName()) as Button;b.size=new vec3(16,6,1);
  const face=global.scene.createSceneObject('RecoveryLabel');face.setParent(this.sceneObject);face.getTransform().setLocalPosition(new vec3(0,0,.08));
  const c=face.createComponent(ElementContent.getTypeName()) as ElementContent;c.text='Recenter lab ↓';c.textSize=39;c.sizeOverride=new vec2(16,6);
  b.onInitialized.add(()=>{const pending=new Set<unknown>();b.onTriggerDown.add(e=>pending.add(e.interactor));b.interactable.onTriggerCanceled.add(e=>pending.delete(e.interactor));b.interactable.onHoverExit.add(e=>pending.delete(e.interactor));b.onTriggerUp.add(e=>{if(pending.delete(e.interactor))this.reset.invoke();});});
 }
}
