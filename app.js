const canvas=document.getElementById("world"),ctx=canvas.getContext("2d");
let W,H,dpr=1,t=0,mode="hero",journeyStep=0,sound=false;
const scenes=[...document.querySelectorAll(".scene")];
const steps=[
 {title:"התא",text:"הגוף שלך בנוי מתאים — עולמות זעירים שפועלים כל הזמן.",caption:"תא • עולם זעיר"},
 {title:"הגרעין",text:"בתוך תאים רבים נמצא גרעין. שם נמצא רוב ה-DNA של התא.",caption:"גרעין התא"},
 {title:"כרומוזום",text:"ה-DNA ארוך מאוד. התא אורז אותו בצורה מסודרת בתוך כרומוזומים.",caption:"כרומוזום • DNA ארוז"},
 {title:"DNA",text:"עכשיו אנחנו רואים את המבנה המוכר: שתי שרשראות שמחוברות בזוגות.",caption:"DNA • סליל כפול"},
];
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+"px";canvas.style.height=H+"px";ctx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener("resize",resize);resize();

function show(id){scenes.forEach(s=>s.classList.toggle("active",s.id===id));mode=id;document.getElementById("caption").textContent="";
 if(id==="journey"){document.getElementById("stepTitle").textContent=steps[journeyStep].title;document.getElementById("stepText").textContent=steps[journeyStep].text;document.getElementById("stepKicker").textContent=`שלב 0${journeyStep+1}`;document.getElementById("caption").textContent=steps[journeyStep].caption}
 buildProgress();
}
function buildProgress(){let p=document.getElementById("progress");p.innerHTML="";let n=mode==="hero"?1:mode==="journey"?5:mode==="bases"?6:7;for(let i=0;i<7;i++){let e=document.createElement("i");if(i<n)e.className="active";p.appendChild(e)}}
buildProgress();

function background(){
 ctx.clearRect(0,0,W,H);
 const g=ctx.createRadialGradient(W*.52,H*.45,0,W*.52,H*.45,Math.max(W,H)*.7);
 g.addColorStop(0,mode==="hero"?"#0b2931":"#071b23");g.addColorStop(.5,"#041018");g.addColorStop(1,"#02070a");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 // restrained particulate motion: slow Brownian-like drift
 for(let i=0;i<95;i++){
   const x=(i*97.31+(t*(3+(i%5))*.35))%W,y=(i*53.17+Math.sin(t*.00025+i)*30)%H;
   ctx.fillStyle=`rgba(110,220,213,${.025+(i%7)*.009})`;ctx.beginPath();ctx.arc(x,y,0.7+(i%3)*.35,0,Math.PI*2);ctx.fill();
 }
 if(mode==="hero"){DNA.helix(ctx,W*.68,H*.48,1.05,t*.00055); drawVignette()}
 if(mode==="journey") drawJourney();
 if(mode==="bases") drawBaseScene();
 if(mode==="ending"){DNA.helix(ctx,W*.66,H*.48,.82,t*.0004);drawVignette()}
 requestAnimationFrame(background);
}
function drawJourney(){
 const p=journeyStep/3, cx=W*.52,cy=H*.48;
 if(journeyStep===0){drawCell(cx,cy,Math.min(W,H)*.25,t)}
 if(journeyStep===1){DNA.nucleus(ctx,cx,cy,Math.min(W,H)*.25,t*.00015);drawChromatin(cx,cy)}
 if(journeyStep===2){DNA.nucleus(ctx,cx,cy,Math.min(W,H)*.29,t*.00012);DNA.chromosome(ctx,cx,cy,1.35,t*.00025)}
 if(journeyStep===3){DNA.helix(ctx,cx,cy,1.05,t*.0006)}
 drawVignette();
}
function drawCell(cx,cy,r,t){
 ctx.save();ctx.translate(cx,cy);ctx.rotate(Math.sin(t*.00008)*.05);
 ctx.beginPath();ctx.ellipse(0,0,r*1.18,r*.88,.2,0,Math.PI*2);ctx.fillStyle="#09232b";ctx.fill();ctx.strokeStyle="#65d8cf99";ctx.lineWidth=4;ctx.stroke();
 for(let i=0;i<13;i++){let a=i*2.4,rr=r*(.45+(i%4)*.12);ctx.save();ctx.translate(Math.cos(a)*rr,Math.sin(a)*rr*.7);ctx.rotate(a);ctx.strokeStyle="#74cfc366";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,28+(i%3)*8,13,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
 DNA.nucleus(ctx,-r*.05,r*.04,r*.34,t*.00012);ctx.restore();
}
function drawChromatin(cx,cy){for(let i=0;i<38;i++){let a=i*.82,r=70+Math.sin(i*2)*35;ctx.fillStyle="#d7c87855";ctx.beginPath();ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,3+(i%3),0,Math.PI*2);ctx.fill()}}
function drawVignette(){let g=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.25,W/2,H/2,Math.max(W,H)*.7);g.addColorStop(0,"transparent");g.addColorStop(1,"rgba(0,0,0,.68)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
function drawBaseScene(){drawVignette();}

document.getElementById("startBtn").onclick=()=>show("journey");
document.getElementById("nextBtn").onclick=()=>{
 if(journeyStep<3){journeyStep++;show("journey")}
 else show("bases");
};
document.getElementById("backBtn").onclick=()=>{if(journeyStep>0){journeyStep--;show("journey")}else show("hero")};
document.getElementById("finishBtn").onclick=()=>show("ending");
document.getElementById("restartBtn").onclick=()=>{journeyStep=0;show("hero")};
document.getElementById("soundBtn").onclick=()=>{sound=!sound;document.getElementById("soundBtn").textContent=sound?"◉":"◌"};

const lab=document.getElementById("baseLab"),message=document.getElementById("baseMessage");
const basePairs={A:"T",T:"A",C:"G",G:"C"};
let dragged=null,offset={x:0,y:0};
function makeBase(letter,x,y){
 const el=document.createElement("div");el.className="base";el.dataset.letter=letter;el.textContent=letter;el.style.left=x+"px";el.style.top=y+"px";lab.appendChild(el);
 el.addEventListener("pointerdown",e=>{dragged=el;el.setPointerCapture(e.pointerId);const r=el.getBoundingClientRect();offset.x=e.clientX-r.left;offset.y=e.clientY-r.top;el.style.cursor="grabbing"});
 el.addEventListener("pointermove",e=>{if(!dragged)return;const r=lab.getBoundingClientRect();el.style.left=(e.clientX-r.left-offset.x)+"px";el.style.top=(e.clientY-r.top-offset.y)+"px"});
 el.addEventListener("pointerup",()=>{if(!dragged)return;const target=[...lab.children].find(x=>x!==el&&x.dataset.letter===basePairs[letter]&&!x.classList.contains("locked"));if(target){
   const a=el.getBoundingClientRect(),b=target.getBoundingClientRect(),d=Math.hypot(a.left-b.left,a.top-b.top);
   if(d<125){el.classList.add("locked");target.classList.add("locked");message.textContent=`נכון — ${letter} מתחבר עם ${basePairs[letter]}.`;dragged=null;return}
 }
 el.classList.add("wrong");setTimeout(()=>el.classList.remove("wrong"),300);message.textContent="כמעט. נסה את השותף המתאים.";dragged=null;el.style.cursor="grab"});
}
function resetBases(){lab.innerHTML="";message.textContent="";makeBase("A",35,30);makeBase("T",215,30);makeBase("C",75,145);makeBase("G",255,145)}
resetBases();
show("hero");

if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js"));}
