

// let sketch2ShowRealFunc = document.getElementById('sketch2ShowRealFunc');

// sketch2ShowRealFunc.onclick = function(){
  
//   if (secondP5.showRealFunction) {
//     secondP5.showRealFunction = false
//     sketch2ShowRealFunc.value = 'Vis "virkelig" funktion'
//   } else {
//     secondP5.showRealFunction = true;
//     sketch2ShowRealFunc.value = 'Vis kun data'
//   }
// }


  
  // for (let k = 0; k < dataT.length; k++) {
  //   const t = dataT[k];
  //   let v;

  //   v = meanV[k];
  //   [x,y] = coorToScreenCoor(t,v);
  //   let curSize = 2;
  //   sketch.strokeWeight(curSize)
  //   sketch.stroke(clrData)
  //   sketch.line(x-curSize,y-curSize,x+curSize,y+curSize);    
  //   sketch.line(x-curSize,y+curSize,x+curSize,y-curSize);   
  // }
  
// let drawAnimatedPath = (sketch) => {

//   let curIni = expInit;
//   let curAlpha = expGrowthRate;

//   // let curT = 0;
//   // let curV = curIni;

//   let dt = 0.1;

//   let prevV = curIni;

//   let maxT = 10;

//   for (let curT = 0; curT < maxT; curT = curT + dt) {
//     const curV = expInit * Math.exp((expGrowthRate) * curT);

//     sketch.line(curT,curV,curT-dt,prevV);
//     prevV = curV;
//   }

// }

// let drawParameterAxes = (sketch) => {
//   sketch.fill(clrAxes);
//   sketch.stroke(clrAxes);
//   sketch.strokeWeight(3);

//   let ax_margin = 100;
//   let ax1_0 = ax_0_X;
//   let ax1_W = ax_W/2 - ax_margin/2;
//   // let ax2_0 = ax1_0 + ax1_W;
//   let ax2_W = ax1_W;

//   let ax_H_small = ax_H + ax_margin/2;
//   let ax_0_Y_small = ax_0_Y-ax_margin/4;

//   let arrowSize = 10;

//   sketch.push()
//   // Draw left axes
//   sketch.translate(ax1_0,ax_0_Y_small);
//   sketch.line(0,0,ax1_W,0);
//   sketch.line(0,0,0,ax_H_small);
//   // Arrows
//   sketch.line(ax1_W,0,ax1_W-arrowSize,arrowSize/2);
//   sketch.line(ax1_W,0,ax1_W-arrowSize,-arrowSize/2);
//   sketch.line(0,ax_H_small,arrowSize/2,ax_H_small+arrowSize);
//   sketch.line(0,ax_H_small,-arrowSize/2,ax_H_small+arrowSize);
//   // Draw right axes
//   sketch.translate(ax1_W + ax_margin,0);
//   sketch.line(0,0,ax2_W,0);
//   sketch.line(0,0,0,ax_H_small);
//   // Arrows
//   sketch.line(ax2_W,0,ax2_W-arrowSize,arrowSize/2);
//   sketch.line(ax2_W,0,ax2_W-arrowSize,-arrowSize/2);
//   sketch.line(0,ax_H_small,arrowSize/2,ax_H_small+arrowSize);
//   sketch.line(0,ax_H_small,-arrowSize/2,ax_H_small+arrowSize);

//   // // Ticks
//   // sketch.strokeWeight(2)
//   // for (let k = 1; k < ax_NumTicks_X; k++) {
//   //   sketch.line(k*xTicksStep,-arrowSize/3,k*xTicksStep,+arrowSize/3)    

//   // }
//   sketch.pop()
// }


// let drawParameterAxes = (sketch) => {
//   sketch.fill(clrAxes);
//   sketch.stroke(clrAxes);
//   sketch.strokeWeight(3);

//   let ax_margin = 100;
//   let ax1_0 = ax_0_X;
//   let ax1_W = ax_W/2 - ax_margin/2;
//   // let ax2_0 = ax1_0 + ax1_W;
//   let ax2_W = ax1_W;

//   let arrowSize = 10;

//   sketch.push()
//   // Draw left axes
//   sketch.translate(ax1_0,ax_0_Y);
//   sketch.line(0,0,ax1_W,0);
//   sketch.line(0,0,0,ax_H);
//   // Arrows
//   sketch.line(ax1_W,0,ax1_W-arrowSize,arrowSize/2);
//   sketch.line(ax1_W,0,ax1_W-arrowSize,-arrowSize/2);
//   sketch.line(0,ax_H,arrowSize/2,ax_H+arrowSize);
//   sketch.line(0,ax_H,-arrowSize/2,ax_H+arrowSize);
//   // Draw right axes
//   sketch.translate(ax1_W + ax_margin,0);
//   sketch.line(0,0,ax2_W,0);
//   sketch.line(0,0,0,ax_H);
//   // Arrows
//   sketch.line(ax2_W,0,ax2_W-arrowSize,arrowSize/2);
//   sketch.line(ax2_W,0,ax2_W-arrowSize,-arrowSize/2);
//   sketch.line(0,ax_H,arrowSize/2,ax_H+arrowSize);
//   sketch.line(0,ax_H,-arrowSize/2,ax_H+arrowSize);

//   // // Ticks
//   // sketch.strokeWeight(2)
//   // for (let k = 1; k < ax_NumTicks_X; k++) {
//   //   sketch.line(k*xTicksStep,-arrowSize/3,k*xTicksStep,+arrowSize/3)    

//   // }
//   sketch.pop()
// }


    // [x,y] = coorToScreenCoorDist(parMu,0,curMaxT,1);
    // sketch.stroke(clrAxes);
    // sketch.strokeWeight(1);
    // sketch.line(x,y+5,x,y-5); 

    // [x,y] = coorToScreenCoorDist(parMu,-0.1,curMaxT,1);

    // sketch.noStroke();
    // sketch.fill(0);
    // sketch.textAlign(sketch.CENTER,sketch.CENTER);
    // sketch.text(parMu,x,y);

    // // sketch.strokeWeight(10);
    // // sketch.point(x,y);


    // sketch.push();
    // sketch.translate(smallW/2,smallH*0.85);

    // sketch.strokeWeight(10);
    // sketch.point(0,0);

    // sketch.push();
    // sketch.translate(0,smallH*0.05);
    // sketch.noStroke();
    // sketch.fill(0);
    // sketch.textAlign(sketch.CENTER,sketch.CENTER);
    // sketch.text('asdf',0,0)
    // sketch.pop();
    // sketch.pop();
