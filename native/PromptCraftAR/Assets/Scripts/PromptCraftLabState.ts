// Pure deterministic lesson engine. Examples are original authored demonstrations.
export const DISCLOSURE = 'Prepared offline examples • authored, not live AI';
export type Step = 'start'|'intent'|'audience'|'context'|'form'|'predict'|'compare'|'complete';
export type ChoiceKey = 'intent'|'audience'|'context'|'form';
export interface Choices {intent:string;audience:string;context:string;form:string}
export interface Story {setting:string;problem:string;resolution:string}
export interface LabSnapshot {revision:number;step:Step;choices:Choices;prompt:string;story:Story;before:Story|null;feedback:string;prediction:string;changed:string;help:boolean;motion:boolean;disclosure:string}
const ORDER:Step[]=['start','intent','audience','context','form','predict','compare','complete'];
const VALUES:{[key:string]:string[]}={intent:['none','cooperate','explore'],audience:['none','young','adult'],context:['none','garden','station'],form:['none','beats','sentences']};
export function promptFor(c:Choices):string {
  const parts=['Write me a story.'];
  if(c.intent!=='none') parts.push(c.intent==='cooperate'?'Show cooperation.':'Show independent discovery.');
  if(c.audience!=='none') parts.push(c.audience==='young'?'For a young reader.':'For an adult reader.');
  if(c.context!=='none') parts.push(c.context==='garden'?'Set it in a garden.':'Set it on a space station.');
  if(c.form!=='none') parts.push(c.form==='beats'?'Use three labeled beats.':'Use three unlabeled sentences.');
  return parts.join(' ');
}
export function storyFor(c:Choices):Story {
  const young=c.audience==='young',adult=c.audience==='adult',station=c.context==='station',garden=c.context==='garden';
  const place=station?'space station':garden?'garden':'quiet place';
  const need=station?'air leak':garden?'dry seed':'small puzzle';
  let setting=young?'Mira is in a '+place+'.':adult?'Mira surveys the '+place+'.':'Mira enters a '+place+'.';
  let problem=young?'She finds '+(station?'an ':'a ')+need+'.':adult?(station?'An ':'A ')+need+' tests her judgment.':'She notices '+(station?'an ':'a ')+need+'.';
  let resolution=c.intent==='cooperate'?(young?'Jo helps them fix it together.':adult?'Mira and Jo coordinate a repair.':'Mira and Jo solve it together.'):
    c.intent==='explore'?(young?'She tries her own idea and learns what works.':adult?'She independently tests an idea and evaluates the result.':'She tests her own idea and learns why it works.'):
    (young?'She finds a way to help.':adult?'She weighs a possible solution.':'She finds a possible answer.');
  if(c.form==='sentences'){setting='Today, '+setting;problem='Then, '+problem.charAt(0).toLowerCase()+problem.slice(1);resolution='Finally, '+(/^(Mira|Jo) /.test(resolution)?resolution:resolution.charAt(0).toLowerCase()+resolution.slice(1));}
  if(c.form==='beats'){setting='1 SETTING\n'+setting;problem='2 PROBLEM\n'+problem;resolution='3 RESOLUTION\n'+resolution;}
  return {setting,problem,resolution};
}
export class PromptCraftLabSession {
  private revision=0; private step:Step='start';
  private choices:Choices={intent:'none',audience:'none',context:'none',form:'none'};
  private challengeContext='none'; private before:Story|null=null; private prediction='';private feedback='';private changed='';private help=false;private motion=true;
  snapshot():LabSnapshot {return {revision:this.revision,step:this.step,choices:{...this.choices},prompt:promptFor(this.choices),story:storyFor(this.choices),before:this.before?{...this.before}:null,prediction:this.prediction,feedback:this.feedback,changed:this.changed,help:this.help,motion:this.motion,disclosure:DISCLOSURE};}
  act(action:string,expected:number):boolean {
    if(expected!==this.revision)return false;
    if(action==='restart'){this.choices={intent:'none',audience:'none',context:'none',form:'none'};this.step='start';this.before=null;this.prediction='';this.feedback='';this.changed='';this.help=false;}
    else if(action==='help')this.help=!this.help;
    else if(action==='motion')this.motion=!this.motion;
    else if(action==='recenter'){/* placement controller consumes this accepted intent */}
    else if(action==='next'){
      if(this.help||this.step==='complete'||this.step==='predict')return false;
      if(this.step==='compare'&&!this.feedback.startsWith('Correct'))return false;
      const i=ORDER.indexOf(this.step);this.step=ORDER[i+1];if(this.step!=='complete')this.feedback='';
      if(this.step==='predict'){this.before=storyFor(this.choices);this.prediction='';this.changed='';}
    }
    else if(action==='back'){
      if(this.help||this.step==='start')return false;
      if(this.step==='complete'){this.step='compare';}
      else if(this.step==='compare'){this.choices.context=this.challengeContext;this.step='predict';this.prediction='';this.feedback='';this.changed='';}
      else {this.step=ORDER[ORDER.indexOf(this.step)-1];this.before=null;this.prediction='';this.feedback='';this.changed='';}
    }
    else if(action==='retry'&&this.step==='compare') {this.feedback='';this.prediction='';this.step='predict';this.choices.context=this.challengeContext;this.changed='';}
    else if(action.startsWith('predict:')&&this.step==='predict'&&!this.help){
      const p=action.split(':')[1];if(!['setting','wording','teamwork'].includes(p))return false;
      this.prediction=p;this.before=storyFor(this.choices);this.challengeContext=this.choices.context;this.choices.context=this.choices.context==='station'?'garden':'station';this.step='compare';this.changed='Context → setting + problem';
      this.feedback=p==='setting'?'Correct — setting and problem match the new context.':'Try again — context changes place and problem, not audience or intent.';
    }
    else if(action.startsWith('choose:')&&!this.help){
      const bits=action.split(':');const key=bits[1] as ChoiceKey,value=bits[2];
      if(this.step!==key||!VALUES[key]||!VALUES[key].includes(value)||this.choices[key]===value)return false;
      this.choices[key]=value;this.changed=key==='intent'?'Intent → resolution':key==='audience'?'Audience → wording':key==='context'?'Context → setting + problem':'Form → story labels';
    }
    else return false;
    this.revision++;return true;
  }
}
export interface LabAction {action:string;revision:number}
export function optionsFor(s:LabSnapshot):{label:string;action:string}[]{
 if(s.help)return [{label:'Restart',action:'restart'},{label:'Recenter',action:'recenter'},{label:s.motion?'Motion: on':'Motion: off',action:'motion'}];
 const sets:{[key:string]:[string,string][]}={intent:[['Cooperate','cooperate'],['Discover','explore'],['Clear intent','none']],audience:[['Young reader','young'],['Adult reader','adult'],['Clear audience','none']],context:[['Garden','garden'],['Space station','station'],['Clear context','none']],form:[['Labeled beats','beats'],['Sentences','sentences'],['Clear form','none']]};
 if(sets[s.step])return sets[s.step].map(([label,value])=>({label:(s.choices[s.step as ChoiceKey]===value?'✓ ':'')+label,action:'choose:'+s.step+':'+value}));
 if(s.step==='predict')return [{label:'Place + problem',action:'predict:setting'},{label:'Reading level',action:'predict:wording'},{label:'Teamwork',action:'predict:teamwork'}];
 if(s.step==='compare'&&!s.feedback.startsWith('Correct'))return [{label:'Retry prediction',action:'retry'}];
 return [];
}
export function instructionFor(s:LabSnapshot):string {
 if(s.help)return 'Pinch a choice; release to select. Drag the frame to place.\nHelp closes this menu. Recenter restores the lab.';
 const words:{[key:string]:string}={start:'A vague request leaves choices open.\nBegin, add direction, then check the result.',intent:'1 / 4 • What should the story show?',audience:'2 / 4 • Who will read it?',context:'3 / 4 • Where does it happen?',form:'4 / 4 • Choose an output form.',predict:'Predict: switch context to '+(s.choices.context==='station'?'garden':'space station')+'.\nWhat should change?',compare:s.feedback,complete:'Direction helps; more detail is not always better.\nCheck real AI: it can be wrong or incomplete. Try this beyond stories.'};
 return words[s.step];
}





