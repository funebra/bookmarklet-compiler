javascript:(function(){
  if(window.__funebra_watch){window.__funebra_watch();return;}
  const stage = document.createElement('div');
  stage.style.cssText = 'position:fixed;top:20px;right:20px;width:220px;height:220px;background:rgba(10,10,15,0.85);backdrop-filter:blur(8px);border:1px solid #333;border-radius:12px;z-index:999999;box-shadow:0 10px 30px rgba(0,0,0,0.5);font-family:monospace;';
  
  const title = document.createElement('div');
  title.style.cssText = 'color:#666;font-size:10px;text-align:center;padding-top:6px;letter-spacing:1px;';
  title.innerText = 'FUNEBRA :: WATCH-01';
  stage.appendChild(title);

  const canvas = document.createElement('div');
  canvas.style.cssText = 'position:relative;width:100%;height:180px;';
  stage.appendChild(canvas);
  document.body.appendChild(stage);

  // Ring generator helper
  function makeRing(count, color, radius) {
    const nodes = [];
    for(let i=0; i<count; i++) {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;width:4px;height:4px;background:${color};border-radius:50%;top:50%;left:50%;`;
      canvas.appendChild(el);
      nodes.push({el, rad: radius, angle: (i/count)*Math.PI*2});
    }
    return nodes;
  }

  const hRing = makeRing(12, '#00e5ff', 40);
  const mRing = makeRing(24, '#76ff03', 60);
  const sRing = makeRing(30, '#ff1744', 75);

  let angleX = 0.6, angleY = 0.3, active = true;

  function render(){
    if(!active) return;
    const now = new Date();
    const secAng = (now.getSeconds() + now.getMilliseconds()/1000) / 60 * Math.PI * 2;
    const minAng = (now.getMinutes() + now.getSeconds()/60) / 60 * Math.PI * 2;
    const hrAng = ((now.getHours()%12) + now.getMinutes()/60) / 12 * Math.PI * 2;

    angleY += 0.005;

    function drawRing(ring, currentAngle) {
      ring.forEach(pt => {
        let a = pt.angle - currentAngle;
        let x = Math.cos(a) * pt.rad;
        let z = Math.sin(a) * pt.rad;
        let y = 0;

        // Apply 3D tilt
        let y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
        let z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
        let x2 = x * Math.cos(angleY) + z1 * Math.sin(angleY);
        let z2 = -x * Math.sin(angleY) + z1 * Math.cos(angleY);

        let sc = 150 / (200 + z2);
        pt.el.style.transform = `translate(${x2 * sc}px, ${y1 * sc}px) scale(${sc})`;
        pt.el.style.opacity = (z2 + 100) / 200;
      });
    }

    drawRing(sRing, secAng);
    drawRing(mRing, minAng);
    drawRing(hRing, hrAng);

    requestAnimationFrame(render);
  }

  window.__funebra_watch = function(){ active = false; stage.remove(); delete window.__funebra_watch; };
  render();
})();
