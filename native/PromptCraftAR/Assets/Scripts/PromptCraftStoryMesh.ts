// Declared code-authored MeshBuilder backend: animated directed story connections.
import {LabSnapshot} from './PromptCraftLabState';
@component
export class PromptCraftStoryMesh extends BaseScriptComponent {
 @input @hint('Project-authored unlit connection material') material:Material;
 private visuals:SceneObject[]=[];private motion=true;
 private symbols:SceneObject[]=[];private signature='';
 private roleMaterials:Material[]=[];
 setStory(s:LabSnapshot):void{
  const key=s.choices.context+':'+s.choices.intent;if(this.signature===key)return;this.signature=key;
  this.symbols.forEach(o=>o.destroy());this.symbols=[];
  const garden=s.choices.context==='garden',station=s.choices.context==='station';
  for(let node=0;node<3;node++){
   const o=global.scene.createSceneObject('StoryStructureSymbol'+node);o.setParent(this.sceneObject);o.getTransform().setLocalPosition(new vec3(-17+node*17,7,node*6));
   const b=new MeshBuilder([{name:'position',components:3}]);b.topology=MeshTopology.Triangles;b.indexType=MeshIndexType.UInt16;const vertices:number[]=[],indices:number[]=[];
   const diamond=(x:number,y:number,r:number)=>{const start=vertices.length/3;vertices.push(x-r,y,0,x,y-r,0,x+r,y,0,x,y+r,0,x,y,.8);indices.push(start,start+1,start+4,start+1,start+2,start+4,start+2,start+3,start+4,start+3,start,start+4,start+2,start+1,start,start+3,start+2,start);};
   const ring=(cx:number,cy:number,r:number,broken=false)=>{for(let i=0;i<(broken?12:16);i++){const a=i*Math.PI/8,z=(i+1)*Math.PI/8,k=vertices.length/3;vertices.push(cx+Math.cos(a)*r,cy+Math.sin(a)*r,0,cx+Math.cos(a)*(r-.4),cy+Math.sin(a)*(r-.4),0,cx+Math.cos(z)*(r-.4),cy+Math.sin(z)*(r-.4),0,cx+Math.cos(z)*r,cy+Math.sin(z)*r,0);indices.push(k,k+2,k+1,k,k+3,k+2);}};
   // Bounded setting/problem silhouettes; resolution geometry remains unchanged.
   // Lift the new faces within the existing symbol depth envelope to avoid the frame plane.
   const polygon=(p:number[][])=>{const k=vertices.length/3;p.forEach(v=>vertices.push(v[0],v[1],.4));for(let i=1;i<p.length-1;i++)indices.push(k,k+i,k+i+1);};
   const rectangle=(l:number,bottom:number,r:number,top:number)=>polygon([[l,bottom],[r,bottom],[r,top],[l,top]]);
   const ellipse=(cx:number,cy:number,rx:number,ry:number)=>{const p:number[][]=[];for(let i=0;i<16;i++){const a=i*Math.PI/8;p.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)]);}polygon(p);};
   const thickRing=(r:number,width:number,broken=false)=>{for(let i=broken?2:0;i<(broken?14:16);i++){const a=i*Math.PI/8,z=(i+1)*Math.PI/8;polygon([[Math.cos(a)*r,Math.sin(a)*r],[Math.cos(z)*r,Math.sin(z)*r],[Math.cos(z)*(r-width),Math.sin(z)*(r-width)],[Math.cos(a)*(r-width),Math.sin(a)*(r-width)]]);}};
   if(node===0){if(garden){
    rectangle(-.3,-1.15,.3,1.65);rectangle(-1.8,-1.65,1.8,-1.1);
    polygon([[-.2,.7],[-1.2,1.2],[-1.8,1.2],[-1.8,.65],[-1.3,.15],[-.2,.15]]);
    polygon([[1.3,.15],[1.8,.65],[1.8,1.2],[1.2,1.2],[.2,.7],[.2,.15]]);
   }else if(station){
    rectangle(-1.5,-.275,1.5,.275);thickRing(.9,.52);
    rectangle(-2,-1.35,-1.1,1.35);rectangle(1.1,-1.35,2,1.35);
   }else ring(0,0,1.5);}
   if(node===1){if(station){
    thickRing(1.3,.57,true);
    polygon([[1.05,.45],[1.4,.05],[2,.6],[1.65,1]]);
    polygon([[1.05,-.45],[1.65,-1],[2,-.6],[1.4,-.05]]);
   }else if(garden){
    ellipse(0,.65,1.2,.65);
    polygon([[-1.8,-1.65],[-.35,-1.65],[-.65,-1.15],[-.3,-.6],[-1.8,-.6]]);
    polygon([[.35,-1.65],[1.8,-1.65],[1.8,-.6],[.6,-.6],[.25,-1.15]]);
   }else diamond(0,0,1.4);}
   if(node===2){if(s.choices.intent==='cooperate'){ring(-1,0,1.35);ring(1,0,1.35);}else if(s.choices.intent==='explore'){diamond(0,0,1.9);diamond(0,0,.65);}else ring(0,0,1.5);}
   if(!this.roleMaterials[node]){const mat=this.material.clone();mat.mainPass.baseColor=[new vec4(.45,1,.85,1),new vec4(1,.83,.35,1),new vec4(.8,.7,1,1)][node];this.roleMaterials[node]=mat;}
   b.appendVerticesInterleaved(vertices);b.appendIndices(indices);const visual=o.createComponent('Component.RenderMeshVisual') as RenderMeshVisual;visual.mesh=b.getMesh();visual.mainMaterial=this.roleMaterials[node];b.updateMesh();this.symbols.push(o);
  }
 }
 setMotion(on:boolean):void{this.motion=on;for(const v of this.visuals)v.getTransform().setLocalScale(vec3.one());}
 onAwake():void{
  for(let i=0;i<2;i++){
   const o=global.scene.createSceneObject('StoryConnection'+i);o.setParent(this.sceneObject);
   o.getTransform().setLocalPosition(new vec3(-8.5+i*17,0,3+i*6));
   const b=new MeshBuilder([{name:'position',components:3},{name:'color',components:4},{name:'normal',components:3}]);b.topology=MeshTopology.Triangles;b.indexType=MeshIndexType.UInt16;
   // CCW directed arrow; shortened tip stays in the measured card gap at aimed +/-40 cm.
   const points=[[-2,-.35,-.7],[-.8,-.35,.15],[-.8,-1,.15],[0,0,.7],[-.8,1,.15],[-.8,.35,.15],[-2,.35,-.7]];
   const verts:number[]=[];points.forEach(p=>verts.push(...p,1,1,1,1,0,0,1));
   b.appendVerticesInterleaved(verts);b.appendIndices([0,1,5,0,5,6,2,3,4]);
   const v=o.createComponent('Component.RenderMeshVisual') as RenderMeshVisual;v.mesh=b.getMesh();v.mainMaterial=this.material;b.updateMesh();this.visuals.push(o);
  }
  this.createEvent('UpdateEvent').bind(()=>{if(!this.motion)return;this.visuals.forEach((o,i)=>o.getTransform().setLocalScale(new vec3(1,1+.15*Math.sin(getTime()*3-i),1)));});
 }
}

