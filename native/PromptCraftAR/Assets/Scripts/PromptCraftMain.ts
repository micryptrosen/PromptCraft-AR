// Coordinates session and passive view. Requires the authored slice UI; never creates UI or calls a model.
import {PromptCraftSession} from './PromptCraftState';
import {PromptCraftSliceUI} from './PromptCraftSliceUI';
@component
export class PromptCraftMain extends BaseScriptComponent {
  @input @hint('Authored UIKit slice view')
  view: PromptCraftSliceUI;
  private session = new PromptCraftSession();
  onAwake(): void {
    this.createEvent('OnStartEvent').bind(()=>{
      if(!this.view) throw new Error('PromptCraftMain: view is not wired');
      this.view.onChoose.add(revision=>{this.session.select('young',revision);this.present();});
      this.view.onReverse.add(revision=>{this.session.select('unspecified',revision);this.present();});
      this.view.onRestart.add(()=>{this.session.restart();this.present();});
      this.present();
    });
  }
  private present(): void { this.view.render(this.session.snapshot()); }
}
