// UIKit module generated through specs-build-ui: passive cards, layouts and guarded input.
import Event from 'SpectaclesInteractionKit.lspkg/Utils/Event';
import {BackPlate} from 'SpectaclesUIKit.lspkg/Scripts/BackPlate';
import {Frame} from 'SpectaclesUIKit.lspkg/Scripts/Components/Frame/Frame';
import {Button} from 'SpectaclesUIKit.lspkg/Scripts/Components/Button/Button';
import {FlexLayout} from 'SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout';
import {FlexItem} from 'SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem';
import {FlexDirection,FlexAlign,FlexAlignSelf} from 'SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes';
import {LabSnapshot,LabAction,optionsFor,instructionFor,changedStoryFields,lastChangeFor} from './PromptCraftLabState';
const TYPE_SCALE={heading:{size:48,weight:700},body:{size:39,weight:500}};
function applyTextRole(t:Text,role:'heading'|'body'):void{t.size=TYPE_SCALE[role].size;(t as Text & {weight?:number}).weight=TYPE_SCALE[role].weight;}
interface Face {object:SceneObject;text:Text;action:string}
@component
export class PromptCraftLabUI extends BaseScriptComponent {
 @input @hint('Authored prompt card anchor') headerSlot:SceneObject;
 @input @hint('Authored setting story anchor') settingSlot:SceneObject;
 @input @hint('Authored problem story anchor') problemSlot:SceneObject;
 @input @hint('Authored resolution story anchor') resolutionSlot:SceneObject;
 @input @hint('Authored controls anchor') controlsSlot:SceneObject;
 private actionEvent=new Event<LabAction>();get onAction(){return this.actionEvent.publicApi();}
 private texts:{[key:string]:Text}={};private faces:Face[]=[];private nav:Face[]=[];
 private revision=0;private data:LabSnapshot;private ready=false;
 onAwake():void {
  this.sceneObject.createComponent('Component.Canvas');
  const frame=this.sceneObject.createComponent(Frame.getTypeName()) as Frame;
  frame.autoShowHide=false;frame.autoScaleContent=false;frame.allowScaling=false;

  frame.onInitialized.add(()=>{
   frame.innerSize=new vec2(52,49);frame.allowTranslation=true;frame.cutOutCenter=true;frame.showCloseButton=false;frame.showFollowButton=false;
   for(const anchor of [this.headerSlot,this.settingSlot,this.problemSlot,this.resolutionSlot,this.controlsSlot]){
    const p=anchor.getTransform().getLocalPosition();anchor.setParent(frame.contentTransform.getSceneObject());anchor.getTransform().setLocalPosition(p);
   }
   const h=this.panel(this.headerSlot,50);
   this.texts.StageTitle=this.label(h,'StageTitle',2,'heading');
   this.texts.AssembledPrompt=this.label(h,'LabPrompt',5,'body');
   this.texts.Provenance=this.label(h,'LabProvenance',1.6,'body');
   const slots=[this.settingSlot,this.problemSlot,this.resolutionSlot],names=['Setting','Problem','Resolution'];
   const accents=[new vec4(.45,1,.85,1),new vec4(1,.83,.35,1),new vec4(.8,.7,1,1)];
   slots.forEach((slot,i)=>{const c=this.panel(slot,15);this.texts[names[i]+'Title']=this.label(c,'Lab'+names[i]+'Title',1.6,'body');this.texts[names[i]+'Title'].textFill.color=accents[i];this.texts[names[i]]=this.label(c,'Lab'+names[i],6,'body');});
   const c=this.panel(this.controlsSlot,50);
   this.texts.Instruction=this.label(c,'LabInstruction',3,'body');
   const row=this.row(c,6);for(let i=0;i<3;i++)this.faces.push(this.button(row,'LabOption'+i));
   const nav=this.row(c,6);for(const n of ['Back','Next','Help'])this.nav.push(this.button(nav,'Lab'+n));
   this.texts.Changed=this.label(c,'LabChanged',1.6,'body');
   this.ready=true;if(this.data)this.render(this.data);
  });
 }
 render(s:LabSnapshot):void{
  this.data=s;this.revision=s.revision;if(!this.ready)return;
  this.texts.StageTitle.text=s.help?'Help & placement':s.step==='start'?'PromptCraft • Living Prompt Lab':s.step==='complete'?'Complete • evaluate, then refine':s.step==='predict'||s.step==='compare'?'3 • Test and refine':'2 • Give the request direction';
  // Preserve complete prompt wording; group whole instructions into <=3 lines.
  const sentences=s.prompt.match(/[^.]+\./g)||[s.prompt];
  const lines:string[]=[];let line='';
  for(const sentence of sentences){const part=sentence.trim();if(line&&(line+' '+part).length>58){lines.push(line);line=part;}else line+=(line?' ':'')+part;}
  if(line)lines.push(line);this.texts.AssembledPrompt.text=lines.join('\n');
  this.texts.Provenance.text=s.disclosure;
  this.texts.Instruction.text=instructionFor(s);
  this.texts.Changed.text=lastChangeFor(s);
  ['Setting','Problem','Resolution'].forEach((n,i)=>{
   const k=['setting','problem','resolution'][i] as 'setting'|'problem'|'resolution';
   const changed=changedStoryFields(s).includes(k);
   this.texts[n+'Title'].text=(changed?'Δ ':'')+(i+1)+' • '+n;
   this.texts[n].text=s.step==='compare'&&s.before?(i===2?'UNCHANGED\n'+s.story[k].replace(/^[123] [A-Z]+\n/, ''):'BEFORE\n'+s.before[k].replace(/^[123] [A-Z]+\n/, '')+'\nNOW\n'+s.story[k].replace(/^[123] [A-Z]+\n/, '')):s.story[k];
  });
  const opts=optionsFor(s);this.faces.forEach((f,i)=>{f.object.enabled=i<opts.length;f.action=opts[i]?.action||'';f.text.text=opts[i]?.label||'';});
  this.nav[0].object.enabled=s.step!=='start'&&!s.help;this.nav[0].text.text='Back';this.nav[0].action='back';
  this.nav[1].object.enabled=!s.help&&s.step!=='predict'&&!(s.step==='compare'&&!s.feedback.startsWith('Correct'));
  this.nav[1].text.text=s.step==='start'?'Begin':s.step==='complete'?'Restart':s.step==='compare'?'Finish':'Next';this.nav[1].action=s.step==='complete'?'restart':'next';
  this.nav[2].text.text=s.help?'Close Help':'Help';this.nav[2].action='help';
 }
 private obj(p:SceneObject,n:string,z=0):SceneObject{const o=global.scene.createSceneObject(n);o.setParent(p);o.getTransform().setLocalPosition(new vec3(0,0,z));return o;}
 private flex(o:SceneObject,w:number,dir:FlexDirection):FlexLayout{const f=o.createComponent(FlexLayout.getTypeName()) as FlexLayout;f.autoDiscoverItemsOnStart=false;f.width=w;f.height=-1;f.direction=dir;f.alignItems=FlexAlign.Stretch;f.rowGap=.5;f.columnGap=2;return f;}
 private panel(slot:SceneObject,w:number):SceneObject{const b=slot.createComponent(BackPlate.getTypeName()) as BackPlate;const c=this.obj(slot,'Content',.6);const f=this.flex(c,w,FlexDirection.Column);f.paddingTop=f.paddingBottom=f.paddingLeft=f.paddingRight=1;f.onLayoutComplete.add(r=>b.size=new vec2(r.containerWidth,r.containerHeight));return c;}
 private item(p:SceneObject,o:SceneObject,h:number,w?:number):void{const i=o.createComponent(FlexItem.getTypeName()) as FlexItem;i.overrideHeight=h;if(w)i.overrideWidth=w;i.flexShrink=0;i.alignSelf=FlexAlignSelf.Stretch;(p.getComponent(FlexLayout.getTypeName()) as FlexLayout).addItems([i]);}
 private label(p:SceneObject,n:string,h:number,role:'heading'|'body'):Text{const o=this.obj(p,n);const t=o.createComponent('Component.Text') as Text;applyTextRole(t,role);t.depthTest=true;t.textFill.color=new vec4(1,1,1,1);t.horizontalAlignment=HorizontalAlignment.Center;t.verticalAlignment=VerticalAlignment.Center;t.horizontalOverflow=HorizontalOverflow.Wrap;t.verticalOverflow=VerticalOverflow.Overflow;t.layoutRect=Rect.create(-.5,.5,-.5,.5);this.item(p,o,h);return t;}
 private row(p:SceneObject,h:number):SceneObject{const o=this.obj(p,'ButtonRow');this.flex(o,48,FlexDirection.Row);this.item(p,o,h);return o;}
 private button(p:SceneObject,n:string):Face{
  const o=this.obj(p,n);const b=o.createComponent(Button.getTypeName()) as Button;b.size=new vec3(14.6,6,1);b.onInitialized.add(()=>b.size=new vec3(14.6,6,1));
  const face=this.obj(o,n+'Label',.08);const t=face.createComponent('Component.Text') as Text;applyTextRole(t,'body');t.depthTest=true;t.textFill.color=new vec4(1,1,1,1);t.horizontalAlignment=HorizontalAlignment.Center;t.verticalAlignment=VerticalAlignment.Center;t.horizontalOverflow=HorizontalOverflow.Wrap;t.layoutRect=Rect.create(-6.8,6.8,-2.5,2.5);
  this.item(p,o,6,14.6);const result={object:o,text:t,action:''};
  b.onInitialized.add(()=>{const pending=new Map<unknown,{revision:number;action:string}>();
   b.onTriggerDown.add(e=>pending.set(e.interactor,{revision:this.revision,action:result.action}));
   b.interactable.onTriggerCanceled.add(e=>pending.delete(e.interactor));b.interactable.onHoverExit.add(e=>pending.delete(e.interactor));
   b.onTriggerUp.add(e=>{const begun=pending.get(e.interactor);pending.delete(e.interactor);if(begun&&begun.revision===this.revision&&begun.action===result.action&&o.enabled)this.actionEvent.invoke(begun);});
  });return result;
 }
}


