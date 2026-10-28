import {PromptCraftLabSession} from './PromptCraftLabState';
import {PromptCraftLabUI} from './PromptCraftLabUI';
import {PromptCraftStoryMesh} from './PromptCraftStoryMesh';
import {PromptCraftRecoveryUI} from './PromptCraftRecoveryUI';
import WorldCameraFinderProvider from 'SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider';
@component
export class PromptCraftLabMain extends BaseScriptComponent {
 @input @hint('Passive laboratory view') view:PromptCraftLabUI;
 @input @hint('Dynamic story connections') connections:PromptCraftStoryMesh;
 @input @hint('Movable authored lab root') lab:SceneObject;
 @input @hint('Camera-relative recovery button') recovery:PromptCraftRecoveryUI;
 private session=new PromptCraftLabSession();
 onAwake():void{this.createEvent('OnStartEvent').bind(()=>{
  this.view.onAction.add(intent=>{if(this.session.act(intent.action,intent.revision)){if(intent.action==='recenter')this.recenter();this.present();}});
  this.recovery.onRecenter.add(()=>{this.session.act('recenter',this.session.snapshot().revision);this.recenter();this.present();});this.present();
 });}
 private present():void{const s=this.session.snapshot();this.view.render(s);this.connections.setMotion(s.motion);this.connections.setStory(s);}
 private recenter():void{const c=WorldCameraFinderProvider.getInstance().getComponent().getTransform();const t=this.lab.getTransform();t.setWorldPosition(c.getWorldPosition().add(c.forward.uniformScale(-122)));t.setWorldRotation(c.getWorldRotation());}
}
