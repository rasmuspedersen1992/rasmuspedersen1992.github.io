// Empty p5 function for easy access to p5 functions
const tempSketch = ( sketch ) => {
  sketch.setup = () =>{
    // sketch.createCanvas(allW,allH);
  }
  sketch.draw = () =>{
    // sketch.background(clrBackground); 
  }
}
let p5func = new p5(tempSketch);
let firstp5DivElement = document.getElementById('p5Div'); // For using CSS sizes
// let smallp5DivElement = document.getElementById('p5DivDist'); // For using CSS sizes


// Flags for what to show
let showNewInf = true;
let showAllVar = false;
// let showNewInf = false;
// let showAllVar = true;

let sirR0 = 1.8;
let curMaxInf = 12;
let curMaxInfToShow = 12;
// let DKpop = 5.831;
let DKpop = 6;

// ----------- Setup interactive elements ----------- 
// let R0_slider = document.getElementById('R0_slider');
let immu_slider = document.getElementById('immu_slider');
let waning_slider = document.getElementById('waning_slider');

// let R0_label = document.getElementById('R0_label');
let immu_label = document.getElementById('immu_label');
let waning_label = document.getElementById('waning_label');


// Setup listener for radio button
document.addEventListener('input',(e)=>{
    if(e.target.getAttribute('name')=="visSIRellerInf"){
      curChoice = e.target.value;
      if (curChoice == 'visSIR'){
        showNewInf = false;
        showAllVar = true;
      } else {
        showNewInf = true;
        showAllVar = false;
      }
      mainFunc()
    }
    if(e.target.getAttribute('name')=="setR0"){
      curChoice = e.target.value;
      if (curChoice == 'R0_low'){
        sirR0 = 1.8;
      } else {
        sirR0 = 4;
      }
      mainFunc()
    }
  }
)

// radio_show_SIR.onchange = function(){
//   // Run main function 
//   // mainFunc();
//   console.log(radio_show_SIR)
// }

// -- Set the onchangefunctions of sliders --
// R0_slider.onchange = function(){
//   // Run main function 
//   mainFunc();
// }
immu_slider.onchange = function(){
  // Run main function 
  mainFunc();
}
waning_slider.onchange = function(){
  // Run main function 
  mainFunc();
}

// ----------- END SETUP INTERACTIVITY  -----------

// Define parameters for "real" models
// let sirR0;
let sirImmu;
let sirWaning;
let sirWaningLabel;
// --- Read sliders ---
let readInputs = function(){
  // sirR0 = parseFloat(R0_slider.value);
  sirImmu = parseFloat(immu_slider.value);
  if (waning_slider.value == waning_slider.max){
    sirWaning = Infinity;
    sirWaningLabel = 'Intet tab af immunitet'
  } else { 
    sirWaning = parseFloat(waning_slider.value);
    sirWaningLabel = 'Immunitetstab: '+sirWaning+' dage';
  }

  // if (sirWaning == waning_slider.max){
  //   sirWaning = Infinity;
  // }
}

// --- Set labels beneath inputs --
let setLabels = function(){
  // R0_label.innerHTML  = 'R0: '+sirR0;
  // R0_label.innerHTML  = 'Reproduktionstal, R0: '+sirR0;
  immu_label.innerHTML  = 'Immunitet ved start: '+sirImmu+'%';
  waning_label.innerHTML  = sirWaningLabel;
  // waning_label.innerHTML  = 'Immunitetstab: '+sirWaning+' dage';
}

// var maxT = 50;
// var maxT = 120;
var maxT = 500;

/// -------------------------
function calcSIRSvalues(R0,immu,waning){
    
  var Ss = [];
  var Is = [];
  var Rs = [];
  var Ts = [];
  var newInfs = [];
  var newInfsCumu = [];



  // var iniS = 100;
  // var iniI = 0.1;
  // var iniR = 0;
  var iniI = 0.1;
  var iniR = immu;
  var iniS = 100-iniI-iniR;

  timeScale = 0.25;
  // timeScale = 1;
  

  dt = 0.01;
  // dt = 0.1;
  // dt = 1;
  stepsPerTimescale = timeScale/dt;
  // stepsPerTimescale = 1/dt;

  // console.log(dt);
  // console.log(stepsPerTimescale);
  

  curNewInfsCumu = 0;

  var popSize = iniS+iniI+iniR;
  var curN = 1;


  var count = 0;
  var curS = iniS/popSize;
  var curI = iniI/popSize;
  var curR = iniR/popSize;

  var dS = 0;
  var dI = 0;
  var dR = 0;


  // let gamma = 1/4.7;
  let gamma = 1/7;
  let beta = R0 * gamma / curN;

  let tScaler = 10;

  // let mu = 1/365;
  let mu = 1/waning;
  // mu = 0;

  curMaxInf = 0;

  for (let t = 0; t < maxT; t = t + dt) {

    // Euler integration
    dS = - beta * ((curS * curI) / curN) + mu * curR;
    dI = beta * ((curS * curI) / curN) - gamma * curI;
    dR = gamma * curI - mu * curR;
    // dS = - beta * ((curS * curI) / curN);
    // dI = beta * ((curS * curI) / curN) - gamma * curI;
    // dR = gamma * curI;
    curS = curS + dS * dt;
    curI = curI + dI * dt;
    curR = curR + dR * dt;

    

    // Add the every X steps
    if ((count%stepsPerTimescale)==0){
      
      // console.log(t);
        
      var rounder = 1000;
      let tToPush = (Math.round(t*100)/100)/tScaler;
      Ts.push(tToPush)
      Ss.push(Math.round(popSize*curS*rounder)/rounder)
      Is.push(Math.round(popSize*curI*rounder)/rounder)
      Rs.push(Math.round(popSize*curR*rounder)/rounder)

      // Only calculate the new infections if they are going to be shown.
      if (showNewInf) {
        let curNewInfs;
        
        curNewInfs = 100 * beta * curS * curI / curN;
        newInfs.push(Math.round((curNewInfs)*rounder)/rounder) 

        curNewInfsCumu = curNewInfsCumu + curNewInfs
        newInfsCumu.push(Math.round((curNewInfsCumu)*rounder)/rounder)
        // if (Ss.length > 1){
        //   // curNewInfs = Ss[Ss.length-2] - Ss[Ss.length-1]
        //   // curNewInfs = 100 * dt * (Ss[Ss.length-2] - Ss[Ss.length-1]);
        //   // curNewInfs =  dt * beta * Ss[Ss.length-1] * Is[Is.length-1] / curN
        //   // curNewInfs = dt * beta * Ss[Ss.length-1] * Is[Is.length-1] / curN
        //   // curNewInfs = 100 * timeScale *beta * curS * curI / curN
        //   curNewInfs = 100 * beta * curS * curI / curN;

        //   // SKAL FIXES, KRÆVER NOK AT MAN TÆNKER SIG OM...

        //   // curNewInfs =  dt* beta * Ss[Ss.length-1] * Is[Is.length-1] 
        //   newInfs.push(Math.round((curNewInfs)*rounder)/rounder) 

        //   curNewInfsCumu = curNewInfsCumu + curNewInfs
        //   newInfsCumu.push(Math.round((curNewInfsCumu)*rounder)/rounder)
        // } else {
        //   newInfs.push(iniI)
        //   newInfsCumu.push(iniI)
        // }

        if (curNewInfs > curMaxInf){
          curMaxInf = curNewInfs;
        }
      }
    }
    count = count + 1;
  }

  // console.log(curMaxInf);

  // curMaxInfToShow = Math.round(curMaxInf/4+0.5)*4;
  curMaxInfToShow = Math.round(curMaxInf+0.5);
  // console.log(curMaxInfToShow)
  // newInfs[0] = newInfs[1]*0.8;

  return [Ts,Ss,Is,Rs,newInfs,newInfsCumu]
  // return [Ts,Ss,Is,Rs,newInfsCumu,newInfs] // ---- For checking ----
}

/// -------------------------
// Define sizes of everything
// let allW = 450
let allW = firstp5DivElement.offsetWidth;
let allH = 500;
// let smallW = smallp5DivElement.offsetWidth;
// // let smallH = 200;
// let smallH = 120;

// Axes
// let axMargin = 35;
let axMargin = 50;
// let axMargin = 100;
let ax_0_X = axMargin*1.5;
// let ax_0_X = 50;
let ax_0_Y = allH-axMargin;
let ax_W = allW-axMargin*2;
let ax_H = -allH + axMargin*2;
// // let ax_NumTicks_X = 10;
// // let ax_NumTicks_X = 5;
// // let xTicksStep = Math.floor(ax_W / ax_NumTicks_X);
// // let ax_NumTicks_Y = 10;

// let axMarginDist = 40;
// let axMarginDistH = 20;
// let ax_0_X_small = axMarginDist;
// let ax_0_Y_small = smallH-axMarginDistH*1.2;
// let ax_W_small = smallW-axMarginDist*2; 
// let ax_H_small = -smallH + axMarginDistH*2;

// sketch.translate(0,-50);
// sketch.fill(150);
// sketch.rect(0,0,100,10);

// let ax_W_small = smallW*0.8;
// let ax_H_small = -smallH*0.7;
// let ax_0_Y_small = smallH*0.85;


// // let xMax  = ax_NumTicks_X;
// let xMax = 20;
// // let yMax  = 200;
// // let yMax  = R0_slider.max  * 2;
// // let yMax = 100;
// let yMax = 5;


let ax_NumTicks_X = 5;
let xTicksStep = Math.floor(ax_W / ax_NumTicks_X);
let ax_NumTicks_Y = 4;
let yTicksStep = Math.floor(ax_H / ax_NumTicks_Y);

let xMax = maxT/10;
let yMax = 6;
// NEEDS TO BE FIXED!

let xTicksDiff = xMax/ax_NumTicks_X;
let yTicksDiff = yMax/ax_NumTicks_Y;

// Colors
let clrAxes = [155,200,200];
let clrBackground = [240,240,255];
let clrLegend = [220,220,240];
let clrDataReal = [0,0,0];
let clrS    = [0,0,255];
let clrS_li = [100,100,200];
let clrI    = [255,0,0];
let clrI_li = [255,50,50];
let clrR    = [0,255,0];
// let clrR_li = [50,155,50];
let clrR_li = [0,255,50];
let clrR_li2 = [0,205,50];
// let clrNewInf = [100,100,100];
// let clrNewInf_li = [150,150,150];

let clrNewInf = [150,100,100];
let clrNewInf_li = [250,180,150];

// Data-arrays 
let dataT;
let meanS; 
let meanI; 
let meanR; 
let meanNewInfs;
let meanNewInfsCumu;

let calcData = () =>  {
  // // Reset arrays
  // dataT = [];
  // meanS = [];
  // meanI = [];
  // meanR = [];

  
  // [dataT,meanS,meanI,meanR,meanNewInfs,meanNewInfsCumu]  = calcSIRvalues(sirR0,sirTInf)
  // [dataT,meanS,meanI,meanR,meanNewInfs,meanNewInfsCumu,meanS_redu,meanI_redu,meanR_redu,meanNewInfs_redu,meanNewInfsCumu_redu]  = calcSIRvalues(sirR0,sirTInf,sirRedu)
  [dataT,meanS,meanI,meanR,meanNewInfs,meanNewInfsCumu]  = calcSIRSvalues(sirR0,sirImmu,sirWaning)
  // // Exponential
  // for (let t = 0; t < ax_NumTicks_X; t=t+dt_plot) {
  //   dataT.push(t);
  //   // const curV = expInit * Math.exp((expGrowthRate) * t);
  //   const curV = 1;
  //   meanS.push(curV);
  //   meanI.push(curV);
  //   meanR.push(curV);
  // }
}


function coorToScreenCoor(t,v){
  // Translates variables to screen-coordinates
  // let x = valueToScreenX(t);
  // let y = valueToScreenY(v);
  // return [x,y]
  return [valueToScreenX(t), valueToScreenY(v)]
}

function valueToScreenY(v){
  // Translates variables to screen-Y-coordinate 
  // let y = ax_0_Y + (v/yMax) * ax_H;
  // return y
  return ax_0_Y + (v/yMax) * ax_H;
}

function valueToScreenX(t){
  // Translates time to screen-X-coordinate 
  // let x = ax_0_X + (t/xMax) * ax_W;
  // return x

  return ax_0_X + (t/xMax) * ax_W
}

// --- Main function for both checking everything and setting everything --- 
let readAndSet = function(){
  readInputs();
  setLabels();
}

// ---- P5 drawing stuff ----
let backgroundMargin = 5;

let drawBackground = (sketch) => {
  sketch.fill(clrBackground);
  
  sketch.stroke(0,50)
  sketch.strokeWeight(3)

  sketch.rect(backgroundMargin,backgroundMargin,sketch.width-backgroundMargin*2,sketch.height-backgroundMargin*2);
  
}

let drawAxes = (sketch) => {
  sketch.fill(clrAxes);
  sketch.stroke(clrAxes);
  sketch.strokeWeight(3);

  sketch.push()
  sketch.translate(ax_0_X,ax_0_Y);
  sketch.line(0,0,ax_W,0);
  sketch.line(0,0,0,ax_H);
  // Arrows
  let arrowSize = 10;
  sketch.line(ax_W,0,ax_W-arrowSize,arrowSize/2);
  sketch.line(ax_W,0,ax_W-arrowSize,-arrowSize/2);
  sketch.line(0,ax_H,arrowSize/2,ax_H+arrowSize);
  sketch.line(0,ax_H,-arrowSize/2,ax_H+arrowSize);

  // // Ticks
  // sketch.strokeWeight(2)
  // for (let k = 1; k < ax_NumTicks_X; k++) {
  //   sketch.line(k*xTicksStep,-arrowSize/3,k*xTicksStep,+arrowSize/3)    

  // }

  
    // Ticks (From uncertainty article)
    sketch.noStroke();
    sketch.fill(0);
    sketch.textAlign(sketch.CENTER,sketch.CENTER);
    sketch.text(0,0,15)

    sketch.push();
    for (let k = 1; k < ax_NumTicks_X; k++) {
      
      sketch.strokeWeight(2)
      sketch.stroke(clrAxes);
      sketch.translate(xTicksStep,0)
      sketch.line(0,-arrowSize/3,0,+arrowSize/3)    

      
      sketch.noStroke();
      sketch.fill(0);
      // sketch.text(xTicksDiff*k,0,15)
      sketch.text(xTicksDiff*k * 10,0,15)
    }
    sketch.translate(xTicksStep,0)
    sketch.noStroke();
    sketch.fill(0);
    // sketch.text(xTicksDiff*ax_NumTicks_X,0,15)
    sketch.text(xTicksDiff*ax_NumTicks_X*10,0,15)
    sketch.text('dage',0,25)

    sketch.pop();
    
    
    // Y-Ticks
    sketch.noStroke();
    sketch.fill(0);
    sketch.textAlign(sketch.RIGHT,sketch.CENTER);
    sketch.text(0,-10,0)

    if (showNewInf){

      sketch.push();
      sketch.textAlign(sketch.CENTER,sketch.CENTER);
      sketch.translate(-ax_0_X+18,ax_H/2);
      sketch.rotate(-3.1415/2);
      sketch.textSize(16);
      // sketch.textStyle(sketch.BOLD);
      sketch.text('Daglige nye smittetilfælde',0,0)
      sketch.pop();
      
      sketch.push();
      // ax_NumTicks_Y = 5;
      // yTicksStep = xTicksStep/2;
      for (let k = 1; k < ax_NumTicks_Y; k++) {
        
        sketch.strokeWeight(2)
        sketch.stroke(clrAxes);
        sketch.translate(0,yTicksStep)
        sketch.line(-arrowSize/3,0,+arrowSize/3,0)

        
        sketch.noStroke();
        sketch.fill(0);
        // sketch.text(yTicksDiff*k,-10,0) // Procent af befolkningen
        // sketch.text(yTicksDiff*k * 6/100,-10,0) // Millioner personer
        // sketch.text(yTicksDiff*k * 6 * 10,-10,0) // Tusinde personer
        // sketch.text(yTicksDiff*k * 6 * 10 * 1000,-10,0) // Tusinde personer
        // sketch.text(yTicksDiff*k * 6 * (75/55) * 10 * 1000,-10,0) // Tusinde personer
        sketch.text(yTicksDiff*k * 4 * 10 * 1000,-10,0) // Tusinde personer
        // sketch.text(yTicksDiff*k * 3 * 10 * 1000,-10,0) // Tusinde personer

      }
      sketch.translate(0,yTicksStep)
      sketch.noStroke();
      sketch.fill(0);
      // sketch.text(yTicksDiff*ax_NumTicks_Y,-10,0) // Procent af befolkningen
      // sketch.text(yTicksDiff*ax_NumTicks_Y *  6/100,-10,0) // Millioner personer
      // sketch.text(yTicksDiff*ax_NumTicks_Y *  6 * 10,-10,0) // Tusinde personer
      // sketch.text(yTicksDiff*ax_NumTicks_Y *  6 * 10 * 1000,-10,0) // Tusinde personer
      // sketch.text(yTicksDiff*ax_NumTicks_Y *  6 * (75*55)* 10 * 1000,-10,0) // Tusinde personer
      // sketch.text(yTicksDiff*ax_NumTicks_Y *  3 * 10 * 1000,-10,0) // Tusinde personer
      sketch.text(yTicksDiff*ax_NumTicks_Y *  4 * 10 * 1000,-10,0) // Tusinde personer
      
      
      sketch.text('',0,-20) 
      
      sketch.pop();
    } else {

      sketch.push();
      sketch.textAlign(sketch.CENTER,sketch.CENTER);
      sketch.translate(-ax_0_X+25,ax_H/2);
      sketch.rotate(-3.1415/2);
      sketch.textSize(16);
      // sketch.textStyle(sketch.BOLD);
      sketch.text('Andel af befolkningen',0,0)
      sketch.pop();

      sketch.push();
      // ax_NumTicks_Y = 5;
      // yTicksStep = xTicksStep/2;
      for (let k = 1; k < ax_NumTicks_Y; k++) {
        
        sketch.strokeWeight(2)
        sketch.stroke(clrAxes);
        sketch.translate(0,yTicksStep)
        sketch.line(-arrowSize/3,0,+arrowSize/3,0)

        
        sketch.noStroke();
        sketch.fill(0);
        sketch.text(yTicksDiff*k,-10,0) // Procent af befolkningen
        // sketch.text(yTicksDiff*k * 6/100,-10,0) // Millioner personer

      }
      sketch.translate(0,yTicksStep)
      sketch.noStroke();
      sketch.fill(0);
      sketch.text(yTicksDiff*ax_NumTicks_Y,-10,0) // Procent af befolkningen
      // sketch.text(yTicksDiff*ax_NumTicks_Y *  6/100,-10,0) // Millioner personer
      
      
      sketch.text('%',0,-20) 
      
      sketch.pop();


      // Legend 
      sketch.fill(clrLegend);
    
      sketch.stroke(0,50)
      sketch.strokeWeight(3)
    
      // sketch.rect(backgroundMargin,backgroundMargin,sketch.width-backgroundMargin*2,sketch.height-backgroundMargin*2);
      let legendW = ax_W/4.5;
      // let legendH = ax_H/4;
      let legendH = ax_H/5.5;
      let legendOffsetX = legendW/5;
      let legendOffsetY = legendH/4;
      sketch.push();
      sketch.translate(ax_W-legendW-legendOffsetX,ax_H-legendH-legendOffsetY);
      sketch.rect(0,0,legendW,legendH);
      // sketch.rect(ax_W-legendW-legendOffsetX,ax_H-legendH-legendOffsetY,legendW,legendH);

      let legendMarkW = 15;

      sketch.textAlign(sketch.LEFT,sketch.CENTER);

      sketch.translate(legendMarkW/2,legendH+legendMarkW/2);
      
      sketch.stroke(0,50)
      sketch.strokeWeight(3)
      sketch.fill(clrS_li);
      sketch.rect(0,0,legendMarkW,legendMarkW);
      sketch.fill(0);
      sketch.noStroke();
      sketch.text('Modtagelige',legendMarkW*1.5,legendMarkW/2)
      
      sketch.translate(0,legendMarkW*1.5);
      sketch.stroke(0,50)
      sketch.strokeWeight(3)
      sketch.fill(clrI_li);
      sketch.rect(0,0,legendMarkW,legendMarkW);
      sketch.fill(0);
      sketch.noStroke();
      sketch.text('Inficerede',legendMarkW*1.5,legendMarkW/2)
      
      sketch.translate(0,legendMarkW*1.5);
      sketch.stroke(0,50)
      sketch.strokeWeight(3)
      sketch.fill(clrR_li2);
      sketch.rect(0,0,legendMarkW,legendMarkW);
      sketch.fill(0);
      sketch.noStroke();
      sketch.text('Immune',legendMarkW*1.5,legendMarkW/2)

      sketch.pop();
      
    }

  sketch.pop()
}

// ---
let drawData = (sketch) => {

  // For showing the function for defining data
  let showThis = true;
      
  let y_0 = valueToScreenY(0);
  let y_100 = valueToScreenY(100);
  
  // console.log(dataT[dataT.length-1])
  
  if (showAllVar){
    sketch.noStroke();
    sketch.fill(clrS_li);
    // sketch.rect(x,y_RIS,curdx,y_0-y_RIS);
    // sketch.rect(axMargin,y_100,ax_W,y_0-y_100); 
    // sketch.rect(ax_0_X,y_100,ax_W-ax_0_X+axMargin,y_0-y_100); 
    sketch.rect(ax_0_X,y_100,ax_W,y_0-y_100); 
  }

  for (let k = 0; k < dataT.length - 1; k++) {
    const t = dataT[k];
    const t2 = dataT[k+1];

    // console.log(t2);

    let x = valueToScreenX(t);
    let x2 = valueToScreenX(t2);
    // [x,y] = coorToScreenCoor(t,s);
    // [x2,y2] = coorToScreenCoor(t2,s2);

    let curdx = x2-x;


    // sketch.strokeWeight(2);
    sketch.strokeWeight(5);
    // For a dotted line:
    if (showThis) {

      let y;
      let y2;


      // if (x < (ax_W+axMargin*1.5)){
        if (showAllVar){
          let s = meanS[k];
          let i = meanI[k];
          let r = meanR[k];
          let s2 = meanS[k+1];
          let i2 = meanI[k+1];
          let r2 = meanR[k+1];

          // y = valueToScreenY(s);
          // y2 = valueToScreenY(s2);
          // sketch.stroke(clrS_li)
          // sketch.line(x,y,x2,y2);
          
          // y = valueToScreenY(i);
          // y2 = valueToScreenY(i2);
          // sketch.stroke(clrI_li)
          // sketch.line(x,y,x2,y2);
          
          // y = valueToScreenY(r);
          // y2 = valueToScreenY(r2);
          // sketch.stroke(clrR_li)
          // sketch.line(x,y,x2,y2);


          // -- Stacked -- 
          y_S = valueToScreenY(s);
          y_I = valueToScreenY(i);
          y_R = valueToScreenY(r);
          y_RI = valueToScreenY(r+i);
          y_RIS = valueToScreenY(r+i+s);
          
          y_R2 = valueToScreenY(r2);
          y_RI2 = valueToScreenY(r2+i2);
          y_RIS2 = valueToScreenY(r2+i2+s2);

          sketch.noStroke();
          // sketch.fill(clrS_li);
          // sketch.rect(x,y_RIS,curdx,y_0-y_RIS);
          // sketch.rect(axMargin,y_100,ax_W,y_0-y_100);
          sketch.fill(clrI_li);
          sketch.rect(x,y_RI,curdx,y_0-y_RI);
          // sketch.quad(x,y_RI,x2,y_RI2,x2,y_0,x2,y_RI);
          sketch.fill(clrR_li);
          sketch.rect(x,y_R,curdx,y_0-y_R);
          // sketch.quad(x,y_R,x2,y_R2,x2,y_0,x2,y_R);

          // sketch.stroke(clrS);
          // sketch.line(x,y_R,x2,y_R2);
          
          
          // sketch.beginShape();
          // sketch.vertex(x,y_R);
          // sketch.vertex(x2,y_R2);
          // sketch.endShape();
          // sketch.rect(x,y_0,curdx,y_100-y_I);
          // sketch.rect(x,y_S,curdx,y_0-y_I-y_S);
          // sketch.fill(clrR_li);

        } else if (showNewInf) {
          
          
          let ni = meanNewInfs[k];
          let ni2 = meanNewInfs[k+1];
          // const ni = meanNewInfsCumu[k];
          // const ni2 = meanNewInfsCumu[k+1];

          y = valueToScreenY(ni);
          y2 = valueToScreenY(ni2);
          sketch.stroke(clrNewInf_li)
          sketch.line(x,y,x2,y2);
          
          
        }
      // }

    // Uncomment for dashed lines:
      // showThis = false;
    // } else {
    //   showThis = true;

    }
    
    
  }

  // // Test
  // let curT = dataT[dataT.length-1];
  // let curX = valueToScreenX(curT);
  // sketch.line(curX,0,curX,1000)
  // sketch.noLoop();
}



function coorToScreenCoorDist(t,v,tMax,vMax){
  // Translates variables to screen-coordinates
  // let x = ax_0_X + (t/tMax) * ax_W_small;
  // let y = ax_0_Y_small + (v/vMax) * ax_H_small;
  // return [x,y]
  return [valueToScreenXDist(t,tMax),valueToScreenYDist(v,vMax)]
}

function valueToScreenYDist(v,vMax){
  // Translates value to Y-screen-coordinates for the distribution plots
  return ax_0_Y_small + (v/vMax) * ax_H_small
}

function valueToScreenXDist(t,tMax){
  // Translates t to X-screen-coordinates for the distribution plots
  return ax_0_X + (t/tMax) * ax_W_small;
}


// ---- Main sketch ----
const sketchSir = ( sketch ) => {
  
  sketch.setup = () =>{
    sketch.createCanvas(allW,allH);
  }

  sketch.draw = () =>{
    sketch.background(255);
    drawBackground(sketch)
    
    drawData(sketch);
    drawAxes(sketch);

  }

}



// --------------------------------
// ---- Final things ----
// --------------------------------

let mainP5 = new p5(sketchSir,document.getElementById('p5Div'));
// let distP5 = new p5(sketchDist,document.getElementById('p5DivDist'));
// let dist2P5 = new p5(sketchDist2,document.getElementById('p5DivDist2'));
// let dist3P5 = new p5(sketchDist3,document.getElementById('p5DivDist3'));


// let resetAllRandoms = function(){
//   toShowR0 = [];
//   toShowTInf = [];
//   toShowRedu = [];
// }

let mainFunc = function(){
  readAndSet();
  calcData();
  if (showAllVar){
    yMax = 100;
  } else if (showNewInf){
    // yMax = sirR0*5;
    // yMax = sirR0*3;
    // yMax = R0_slider.max  * 2.5;    
    // yMax = R0_slider.max  * 3;    
    // yMax = 10;
    // yMax = 100;
    yMax = curMaxInfToShow;
  }
  xTicksDiff = xMax/ax_NumTicks_X;
  yTicksDiff = yMax/ax_NumTicks_Y;
}

// Read, set and update everything on first run-through
mainFunc();
