// Passive UIKit view. Owns layout/input intents only; domain state belongs to PromptCraftSession.
import Event from 'SpectaclesInteractionKit.lspkg/Utils/Event';
import {BackPlate} from 'SpectaclesUIKit.lspkg/Scripts/BackPlate';
import {Button} from 'SpectaclesUIKit.lspkg/Scripts/Components/Button/Button';
import {FlexLayout} from 'SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout';
import {FlexItem} from 'SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem';
import {FlexDirection, FlexAlign, FlexAlignSelf} from 'SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes';
import {Snapshot} from './PromptCraftState';

type TextRole = 'title' | 'body';
const SCALE = {title: {size:54, weight:700}, body: {size:39, weight:500}};
function applyTextRole(text: Text, role: TextRole): void {
  text.size = SCALE[role].size;
  (text as Text & {weight?:number}).weight = SCALE[role].weight;
}
@component
export class PromptCraftSliceUI extends BaseScriptComponent {
  @ui.label('PromptCraft — first native slice')
  @ui.separator
  @input @hint('Panel width in centimeters') @widget(new SliderWidget(40,54,1))
  widthCm: number = 50;
  @input @hint('Spacing between layout rows in centimeters') @widget(new SliderWidget(0.5,2,0.1))
  gapCm: number = 1;
  private choose = new Event<number>();
  private reverse = new Event<number>();
  private reset = new Event<void>();
  get onChoose() { return this.choose.publicApi(); }
  get onReverse() { return this.reverse.publicApi(); }
  get onRestart() { return this.reset.publicApi(); }
  private prompt: Text;
  private story: Text;
  private effect: Text;
  private disclosure: Text;
  private selection: Text;
  private revision = 0;
  onAwake(): void {
    this.sceneObject.createComponent('Component.Canvas');
    const plate = this.sceneObject.createComponent(BackPlate.getTypeName()) as BackPlate;
    const content = this.obj(this.sceneObject,'SliceContent',new vec3(0,0,0.6));
    const flex = content.createComponent(FlexLayout.getTypeName()) as FlexLayout;
    flex.autoDiscoverItemsOnStart = false;
    flex.width = this.widthCm; flex.height = -1; flex.direction = FlexDirection.Column;
    flex.alignItems = FlexAlign.Stretch; flex.rowGap = this.gapCm;
    flex.paddingTop = flex.paddingBottom = flex.paddingLeft = flex.paddingRight = 2;
    flex.onLayoutComplete.add(r => plate.size = new vec2(r.containerWidth,r.containerHeight));
    this.label(content,'SliceTitle','Prompt → requirement → example',3,'title');
    this.prompt = this.label(content,'AssembledPrompt','',4,'title');
    this.disclosure = this.label(content,'Provenance','',4,'body');
    this.label(content,'ExampleHeading','Story wording',2,'title');
    this.story = this.label(content,'AuthoredStory','',5,'body');
    this.effect = this.label(content,'AudienceEffect','',4,'body');
    this.selection = this.label(content,'SelectionStatus','',2,'body');
    this.button(content,'YoungReaderButton','Young reader',revision => this.choose.invoke(revision));
    this.button(content,'ClearAudienceButton','Clear audience',revision => this.reverse.invoke(revision));
    this.button(content,'RestartButton','Restart',() => this.reset.invoke());
  }
  render(data: Snapshot): void {
    this.revision=data.revision;
    this.prompt.text=data.prompt; this.story.text=data.example;
    this.effect.text=data.effect; this.disclosure.text=data.provenance;
    this.selection.text=data.audience === 'young' ? '[Selected] Young reader' : '[No audience selected]';
  }
  private obj(parent: SceneObject,name: string,position?: vec3): SceneObject {
    const object=global.scene.createSceneObject(name); object.setParent(parent);
    if(position) object.getTransform().setLocalPosition(position);
    return object;
  }
  private item(parent: SceneObject,child: SceneObject,height: number): void {
    const item=child.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideHeight=height; item.flexShrink=0; item.alignSelf=FlexAlignSelf.Stretch;
    (parent.getComponent(FlexLayout.getTypeName()) as FlexLayout).addItems([item]);
  }
  private label(parent: SceneObject,name: string,value: string,height: number,role: TextRole): Text {
    const object=this.obj(parent,name);
    const text=object.createComponent('Component.Text') as Text;
    text.text=value; text.depthTest=true; applyTextRole(text,role);
    text.horizontalAlignment=HorizontalAlignment.Center;
    text.verticalAlignment=VerticalAlignment.Center;
    text.horizontalOverflow=HorizontalOverflow.Overflow;
    text.verticalOverflow=VerticalOverflow.Overflow;
    text.layoutRect=Rect.create(-0.5,0.5,-0.5,0.5);
    this.item(parent,object,height); return text;
  }
  private button(parent: SceneObject,name: string,label: string,action: (revision: number)=>void): void {
    const object=this.obj(parent,name);
    const button=object.createComponent(Button.getTypeName()) as Button;
    button.size=new vec3(this.widthCm-4,6,1);
    button.onInitialized.add(()=>button.size=new vec3(this.widthCm-4,6,1));
    const face=this.obj(object,'ButtonLabel',new vec3(0,0,0.08));
    const text=face.createComponent('Component.Text') as Text;
    text.text=label; text.depthTest=true; applyTextRole(text,'body');
    text.horizontalAlignment=HorizontalAlignment.Center; text.verticalAlignment=VerticalAlignment.Center;
    text.layoutRect=Rect.create(-(this.widthCm-4.5)/2,(this.widthCm-4.5)/2,-1.2,1.2);
    this.item(parent,object,6);
    button.onInitialized.add(()=>{
      // Capture at genuine input begin. Never relabel an old gesture with a new revision.
      const pending = new Map<unknown,number>();
      button.onTriggerDown.add(e => pending.set(e.interactor,this.revision));
      button.interactable.onTriggerCanceled.add(e => pending.delete(e.interactor));
      button.interactable.onHoverExit.add(e => pending.delete(e.interactor));
      button.onTriggerUp.add(e => {
        const began = pending.get(e.interactor);
        pending.delete(e.interactor);
        if(began !== undefined && began === this.revision) action(began);
      });
    });
  }
}
