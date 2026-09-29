/* Scientific visualization primitives.
   The geometry is deliberately simplified for readability, while preserving
   the real relationships: two antiparallel backbones, paired bases, nucleus,
   chromosome packing and scale transitions. */
const DNA = {
  helix(ctx,cx,cy,scale,t,opts={}){
    const turns=2.35, length=340*scale, radius=55*scale, steps=170;
    ctx.save(); ctx.translate(cx,cy);
    ctx.lineCap="round";
    for(let s=0;s<2;s++){
      ctx.beginPath();
      for(let i=0;i<=steps;i++){
        const y=-length/2 + length*i/steps;
        const a=(i/steps)*Math.PI*2*turns+t + s*Math.PI;
        const x=Math.cos(a)*radius;
        const z=Math.sin(a);
        const yy=y + z*5*scale;
        if(i===0)ctx.moveTo(x,yy);else ctx.lineTo(x,yy);
      }
      ctx.strokeStyle=s===0?"#6ce8df":"#a7fff8";ctx.globalAlpha=.86;ctx.lineWidth=7*scale;ctx.stroke();
    }
    for(let i=8;i<steps;i+=9){
      const y=-length/2 + length*i/steps;
      const a=(i/steps)*Math.PI*2*turns+t;
      const x1=Math.cos(a)*radius, x2=-x1;
      const depth=(Math.sin(a)+1)/2;
      ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y);
      ctx.strokeStyle=depth>.5?"#d7fffa":"#6eaaa9";ctx.globalAlpha=.72;ctx.lineWidth=2.5*scale;ctx.stroke();
    }
    ctx.restore();
  },
  nucleus(ctx,cx,cy,r,rot){
    ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);
    const g=ctx.createRadialGradient(-r*.25,-r*.3,r*.1,0,0,r);
    g.addColorStop(0,"#19434b");g.addColorStop(.65,"#0b242d");g.addColorStop(1,"#061218");
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#78ded477";ctx.lineWidth=3;ctx.stroke();
    for(let a=0;a<Math.PI*2;a+=Math.PI/7){let x=Math.cos(a)*r*.82,y=Math.sin(a)*r*.82;
      ctx.fillStyle="#a4eee877";ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  },
  chromosome(ctx,cx,cy,scale,t){
    ctx.save();ctx.translate(cx,cy);ctx.rotate(t);
    ctx.strokeStyle="#f4cc73";ctx.lineWidth=16*scale;ctx.lineCap="round";
    for(const dx of [-22,22]){ctx.beginPath();ctx.moveTo(dx,-80*scale);ctx.bezierCurveTo(dx*1.2,-25*scale,-dx*.7,25*scale,dx,80*scale);ctx.stroke();}
    ctx.strokeStyle="#f9d985";ctx.lineWidth=13*scale;ctx.beginPath();ctx.moveTo(-48,0);ctx.lineTo(48,0);ctx.stroke();
    ctx.restore();
  }
};
