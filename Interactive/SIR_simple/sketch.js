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
let smallp5DivElement = document.getElementById('p5DivDist'); // For using CSS sizes



// --- Find interactive elements --- 
let R0_slider = document.getElementById('R0_slider');
let tInf_slider = document.getElementById('tInf_slider');
let R0_dist_slider = document.getElementById('R0_dist_slider');
let tInf_dist_slider = document.getElementById('tInf_dist_slider');

let R0_label = document.getElementById('R0_label');
let tInf_label = document.getElementById('tInf_label');
let R0_dist_label = document.getElementById('R0_dist_label');
let tInf_dist_label = document.getElementById('tInf_dist_label');


// Flags for what to show
let showNewInf = false;
let showAllVar = true;
// let showNewInf = true;
// let showAllVar = false;

// Initialize arrays for all random values
let toShowR0 = [];
let toShowTInf = [];
let maxRandoms = 200; 

// Define parameters for "real" models
let sirR0;
let sirR0Dist;
let sirTInf;
let sirTInfDist;

let sirTInfMin;
let sirTInfMax;

// --- Read sliders ---
let readInputs = function(){
  sirR0 = parseFloat(R0_slider.value);
  sirR0Dist  = parseFloat(R0_dist_slider.value);
  sirTInf = parseFloat(tInf_slider.value);
  sirTInfDist = parseFloat(tInf_dist_slider.value);

  sirTInfMax = sirTInf + sirTInfDist;
  sirTInfMin = sirTInf - sirTInfDist;
  if (sirTInfMin < 0){
    sirTInfMin = 0;
  }

  // sirTInfMax = 1/sirTInfMax;
  // sirTInfMin = 1/sirTInfMin;

}

// --- Set labels beneath inputs --
let setLabels = function(){
  R0_label.innerHTML  = 'R0: '+sirR0;
  tInf_label.innerHTML  = 'Smitsom periode: '+sirTInf;
}

// -- Functions for getting random values from distributions --
let getRandomR0 = function(){
  let toReturn = p5func.randomGaussian(sirR0,sirR0Dist);
  // Just keep trying until a positive number is returned (Could be slow sometimes *shrug*)
  while (toReturn < 0){
    toReturn = p5func.randomGaussian(sirR0,sirR0Dist);
  }
  return toReturn
}
let getRandomTInf = function(){
  return p5func.random(sirTInfMin,sirTInfMax);
  // return p5func.random(sirTInfMin,sirTInfMax);
}


/// -------------------------
function calcSIRvalues(R0,tInf){

  let gamma = 1/tInf;

  // Limit gamma 
  if (gamma > 10){
    gamma = 10;
  }

    
  var Ss = [];
  var Is = [];
  var Rs = [];
  var Ts = [];
  var newInfs = [];
  var newInfsCumu = [];
  // var maxT = 150;
  var maxT = 75;



  var iniS = 100;
  var iniI = 1;
  var iniR = 0;
  var maxPop = iniS+iniI+iniR;


  timeScale = 0.25;
  timeScale = 0.5;
  // timeScale = 1;

  dt = 0.1;
  stepsPerTimescale = timeScale/dt;

  curNewInfsCumu = 0;

  var popSize = iniS+iniI+iniR;
  var curN = 1;


  var count = 0;
  var curS = iniS/popSize;
  var curI = iniI/popSize;
  var curR = iniR/popSize;


  // gamma = 1/4.7;
  beta = R0 * gamma / curN;
  // console.log(beta);
  let tScaler = 10;

  for (let t = 0; t < maxT; t = t + dt) {

    // Euler integration
    dS = - beta * ((curS * curI) / curN);
    dI = beta * ((curS * curI) / curN) - gamma * curI;
    dR = gamma * curI;
    curS = curS + dS * dt;
    curI = curI + dI * dt;
    curR = curR + dR * dt;

    // Add the every X steps
    if ((count%stepsPerTimescale)==0){
        
      var rounder = 100;
      let tToPush = (Math.round(t*100)/100)/tScaler;
      Ts.push(tToPush)
      Ss.push(Math.round(popSize*curS*rounder)/rounder)
      Is.push(Math.round(popSize*curI*rounder)/rounder)
      Rs.push(Math.round(popSize*curR*rounder)/rounder)

      // Only calculate the new infections if they are going to be shown.
      if (showNewInf) {
        if (Ss.length > 1){
          curNewInfs = Ss[Ss.length-2] - Ss[Ss.length-1]
          newInfs.push(Math.round((curNewInfs)*rounder)/rounder) 

          curNewInfsCumu = curNewInfsCumu + curNewInfs
          newInfsCumu.push(Math.round((curNewInfsCumu)*rounder)/rounder)
        } else {
          newInfs.push(iniI)
          newInfsCumu.push(iniI)
        }
      }
    }
    count = count + 1;
  }

  newInfs[0] = newInfs[1]*0.8;
  return [Ts,Ss,Is,Rs,newInfs,newInfsCumu]
}

/// -------------------------
// Define sizes of everything
// let allW = 450
let allW = firstp5DivElement.offsetWidth;
let allH = 350;
let smallW = smallp5DivElement.offsetWidth;
let smallH = 200;

// Axes
let axMargin = 35;
let ax_0_X = axMargin;
let ax_0_Y = allH-axMargin;
let ax_W = allW-axMargin*2;
let ax_H = -allH + axMargin*2;
// let ax_NumTicks_X = 10;
let ax_NumTicks_X = 5;
let xTicksStep = Math.floor(ax_W / ax_NumTicks_X);
// let ax_NumTicks_Y = 10;

let xMax  = ax_NumTicks_X;
// let yMax  = 200;
// let yMax  = R0_slider.max  * 2;
let yMax = 100;


// Colors
let clrAxes = [155,200,200];
let clrBackground = [240,240,255];
let clrDataReal = [0,0,0];
let clrAniPath = [150,150,150];
let clrS    = [0,0,255];
let clrS_li = [150,150,255];
let clrI    = [255,0,0];
let clrI_li = [255,150,150];
let clrR    = [0,255,0];
let clrR_li = [150,255,150];
let clrNewInf = [100,100,100];
let clrNewInf_li = [150,150,150];

// Data-arrays 
let dataT;
let meanS; 
let meanI; 
let meanR; 
let meanNewInfs;
let meanNewInfsCumu;
// let dt_plot = 0.1;


let calcData = () =>  {
  // Reset arrays
  dataT = [];
  meanS = [];
  meanI = [];
  meanR = [];

  
  [dataT,meanS,meanI,meanR,meanNewInfs,meanNewInfsCumu]  = calcSIRvalues(sirR0,sirTInf)
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
let backgroundMargin = 10;

let drawBackground = (sketch) => {
  sketch.fill(clrBackground);
  
  sketch.stroke(0,50)
  sketch.strokeWeight(1)

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

  // Ticks
  sketch.strokeWeight(2)
  for (let k = 1; k < ax_NumTicks_X; k++) {
    sketch.line(k*xTicksStep,-arrowSize/3,k*xTicksStep,+arrowSize/3)    

  }
  sketch.pop()
}

// ---
let drawData = (sketch) => {

  // For showing the function for defining data
  let showThis = true;
  for (let k = 0; k < dataT.length - 1; k++) {
    const t = dataT[k];
    const t2 = dataT[k+1];

    let x = valueToScreenX(t);
    let x2 = valueToScreenX(t2);
    // [x,y] = coorToScreenCoor(t,s);
    // [x2,y2] = coorToScreenCoor(t2,s2);

    sketch.strokeWeight(2);
    // For a dotted line:
    if (showThis) {

      let y;
      let y2;

      if (x < (ax_W+axMargin)){
        if (showAllVar){
          const s = meanS[k];
          const i = meanI[k];
          const r = meanR[k];
          const s2 = meanS[k+1];
          const i2 = meanI[k+1];
          const r2 = meanR[k+1];

          y = valueToScreenY(s);
          y2 = valueToScreenY(s2);
          sketch.stroke(clrS_li)
          sketch.line(x,y,x2,y2);
          
          y = valueToScreenY(i);
          y2 = valueToScreenY(i2);
          sketch.stroke(clrI_li)
          sketch.line(x,y,x2,y2);
          
          y = valueToScreenY(r);
          y2 = valueToScreenY(r2);
          sketch.stroke(clrR_li)
          sketch.line(x,y,x2,y2);

        } else if (showNewInf) {
          
          
          const ni = meanNewInfs[k];
          // const i = meanNewInfsCumu[k];
          const ni2 = meanNewInfs[k+1];
          // const i2 = meanNewInfsCumu[k+1];

          y = valueToScreenY(ni);
          y2 = valueToScreenY(ni2);
          sketch.stroke(clrNewInf_li)
          sketch.line(x,y,x2,y2);
          
          // y = valueToScreenY(i);
          // y2 = valueToScreenY(i2);
          // sketch.stroke(clrI_li)
          // sketch.line(x,y,x2,y2);
          
        }
      }

      showThis = false;
    } else {
      showThis = true;
    }
    
    
  }
}


let ax_W_small = smallW*0.8;
let ax_H_small = -smallH*0.7;
let ax_0_Y_small = smallH*0.85;

let drawParameterAxes = (sketch) => {
  sketch.fill(clrAxes);
  sketch.stroke(clrAxes);
  sketch.strokeWeight(2);  

  let arrowSize = 5;

  sketch.push()
  // Draw left axes
  // sketch.translate(ax_0_X,ax_0_Y_small);
  // sketch.line(0,0,ax_W_small,0);
  sketch.translate(backgroundMargin,ax_0_Y_small);
  sketch.line(0,0,smallW-backgroundMargin*2,0);
  // Arrows
  // sketch.line(ax_W_small,0,ax_W_small-arrowSize,arrowSize/2);
  // sketch.line(ax_W_small,0,ax_W_small-arrowSize,-arrowSize/2);

  // sketch.translate(ax_W_small/2,0)
  // sketch.line(0,0,0,ax_H_small);
  // sketch.line(0,ax_H_small,arrowSize/2,ax_H_small+arrowSize);
  // sketch.line(0,ax_H_small,-arrowSize/2,ax_H_small+arrowSize);

  // // Ticks
  // sketch.strokeWeight(2)
  // for (let k = 1; k < ax_NumTicks_X; k++) {
  //   sketch.line(k*xTicksStep,-arrowSize/3,k*xTicksStep,+arrowSize/3)    

  // }
  sketch.pop()
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

// --------------------------------
// ---- Define animated points ----
// --------------------------------
class aniPoint {
  constructor(type){
    this.t0 = 0;
    this.r0;
    this.tInf;
    this.ts = [];
    this.Ss = [];
    this.Is = [];
    this.Rs = [];
    
    this.maxT = 10;
    this.dt = 0.05;
    this.dt = 0.1;

    this.stepsToShow = 50;

    // this.aniID = Math.floor(Math.random()*(this.maxT/this.dt));
    // this.aniID = Math.floor(Math.random()*this.ts.length);
    this.aniID = 0;

    // this.clr = [Math.random()*255,Math.random()*255,Math.random()*255]
    // this.clr = [Math.random()*155,Math.random()*155,Math.random()*155]
    // this.clr = [155,155,155];

    this.type = type;

    this.reset();

  }

  getPars(){
    if (this.type == 'mean'){
      this.r0 = sirR0; 
      this.tInf = sirTInf;
    } else if (this.type == 'random'){
      this.r0 = getRandomR0(); 
      this.tInf = getRandomTInf();
    }
    // If the array of all values is filled, remove one values
    if (toShowR0.length > maxRandoms){
      toShowR0.splice(0,1);
      toShowTInf.splice(0,1);
    }
    // Add to arrays of all values
    toShowR0.push(this.r0);
    toShowTInf.push(this.tInf);
  }


  calcPath(){

    this.getPars();

    let [Ts,Ss,Is,Rs,newInfs,newInfsCumu] = calcSIRvalues(this.r0,this.tInf)

    this.ts = Ts;
    this.Ss = Ss;
    this.Is = Is;
    this.Rs = Rs;
    this.newInfs = newInfs;
    this.newInfsCumu = newInfsCumu;

  }

  reset(){
    this.calcPath();  

    
    // this.aniID = Math.floor(Math.random()*(this.maxT/this.dt));
    // this.aniID = Math.floor(Math.random()*this.ts.length);
  }

  showFullPath(sketch){
    for (let k = 1; k < this.ts.length; k++) {
      const t = this.ts[k];
      const t2 = this.ts[k-1];

      let x;
      let x2;
      let y;
      let y2;


      x = valueToScreenX(t);
      x2 = valueToScreenX(t2);

      const S = this.Ss[k];
      const I = this.Is[k];
      const R = this.Rs[k];
      const S2 = this.Ss[k-1];
      const I2 = this.Is[k-1];
      const R2 = this.Rs[k-1];

      sketch.strokeWeight(0.5);
      const curAlpha = 40;
      // sketch.stroke(this.clr[0],this.clr[1],this.clr[2],curAlpha);

      if (x < (ax_W+axMargin)){
        // [x,y] = coorToScreenCoor(t,S);
        y = valueToScreenY(S);
        if (y > backgroundMargin){
          // [x2,y2] = coorToScreenCoor(t2,S2);
          y2 = valueToScreenY(S2);
          sketch.stroke(clrS_li[0],clrS_li[1],clrS_li[2],curAlpha);
          sketch.line(x,y,x2,y2);
        }

        // [x,y] = coorToScreenCoor(t,I);
        y = valueToScreenY(I);
        if (y > backgroundMargin){
          // [x2,y2] = coorToScreenCoor(t2,I2);
          y2 = valueToScreenY(I2);
          sketch.stroke(clrI_li[0],clrI_li[1],clrI_li[2],curAlpha);
          sketch.line(x,y,x2,y2);
        }
        
        // [x,y] = coorToScreenCoor(t,R);
        y = valueToScreenY(R);
        if (y > backgroundMargin){
          // [x2,y2] = coorToScreenCoor(t2,R2);
          y2 = valueToScreenY(R2);
          sketch.stroke(clrR_li[0],clrR_li[1],clrR_li[2],curAlpha);
          sketch.line(x,y,x2,y2);
        }
      }

    }
  }

  showAnimation(sketch){


    // Show the trail
    let stepsToShow = this.stepsToShow;

    for (let k = 0; k < stepsToShow; k++) {
      if ((this.aniID - k) > 0){
        const t = this.ts[this.aniID - k];
        const t2 = this.ts[this.aniID - k - 1];

        let x;
        let x2;
        let y;
        let y2;

        x = valueToScreenX(t);
        x2 = valueToScreenX(t2);

        sketch.strokeWeight(1);
        const curAlpha = 255*(stepsToShow - k)/stepsToShow;

        
        if (x < (ax_W+axMargin)){
          if (showAllVar) {
            const S = this.Ss[this.aniID - k];
            const I = this.Is[this.aniID - k];
            const R = this.Rs[this.aniID - k];
            const S2 = this.Ss[this.aniID - k - 1];
            const I2 = this.Is[this.aniID - k - 1];
            const R2 = this.Rs[this.aniID - k - 1];
            

            // [x,y] = coorToScreenCoor(t,S);
            y = valueToScreenY(S);
            // if (y > backgroundMargin){
              // [x2,y2] = coorToScreenCoor(t2,S2);
              y2 = valueToScreenY(S2);
              sketch.stroke(clrS[0],clrS[1],clrS[2],curAlpha);
              sketch.line(x,y,x2,y2);
            // }

            // [x,y] = coorToScreenCoor(t,I);
            y = valueToScreenY(I);
            // if (y > backgroundMargin){
              // [x2,y2] = coorToScreenCoor(t2,I2);
              y2 = valueToScreenY(I2);
              sketch.stroke(clrI[0],clrI[1],clrI[2],curAlpha);
              sketch.line(x,y,x2,y2);
            // }

            // [x,y] = coorToScreenCoor(t,R);
            y = valueToScreenY(R);
            // if (y > backgroundMargin){
              // [x2,y2] = coorToScreenCoor(t2,R2);
              y2 = valueToScreenY(R2);
              sketch.stroke(clrR[0],clrR[1],clrR[2],curAlpha);
              sketch.line(x,y,x2,y2);
            // }

          } else if (showNewInf){
            // For showing new infections instead
            
            const ni = this.newInfs[this.aniID - k];
            const ni2 = this.newInfs[this.aniID - k - 1];
            
            y = valueToScreenY(ni);
            y2 = valueToScreenY(ni2);
            sketch.stroke(clrNewInf[0],clrNewInf[1],clrNewInf[2],curAlpha);
            sketch.line(x,y,x2,y2);

          }
        }

      }      
    }

    

    // --- Draw a dot at the front ---
    const t = this.ts[this.aniID];

    let x;
    let y;
    x = valueToScreenX(t);

    sketch.strokeWeight(3);


    if (x < (ax_W+axMargin)){
      if (showAllVar) {
        const S = this.Ss[this.aniID];
        const I = this.Is[this.aniID];
        const R = this.Rs[this.aniID];


        // [x,y] = coorToScreenCoor(t,S);
        y = valueToScreenY(S);
        // if (y > backgroundMargin){
          sketch.stroke(clrS);
          sketch.point(x,y)
        // }
        // [x,y] = coorToScreenCoor(t,I);
        y = valueToScreenY(I);
        // if (y > backgroundMargin){
          sketch.stroke(clrI);
          sketch.point(x,y)
        // }
        // [x,y] = coorToScreenCoor(t,R);
        y = valueToScreenY(R);
        // if (y > backgroundMargin){
          sketch.stroke(clrR);
          sketch.point(x,y)
        // }
      } else if (showNewInf){
        const ni = this.newInfs[this.aniID];
        
        y = valueToScreenY(ni);
        sketch.stroke(clrNewInf);
        sketch.point(x,y)

      }
    }

    // Move one point forward
    this.aniID = this.aniID+1;


    // if (x > ax_W ){
    if (x > (ax_W*1.5) ){
      this.reset();
      this.aniID = 0;
    }


    // let maxAniID = this.ts.length - 1;
    // if (this.aniID > maxAniID + stepsToShow){
    //   this.reset();
    //   this.aniID = 0;
    // }

    // if (y < yMax){
    //   this.reset();
    //   this.aniID = 0;
    // }
  }

}


// ---- Main sketch ----
const sketchSir = ( sketch ) => {
  

  let numAniPointsIni = 0;
  let numAniPoints = 50;
  // let numAniPoints = 1;
  let allAniPoints = [];
  let framesBetweenNewAni = 5;

  sketch.setup = () =>{
    sketch.createCanvas(allW,allH);

    
    // Initialize animated points
    for (let k = 0; k < numAniPointsIni; k++) {
      let newAniPoint = new aniPoint('random');   

      allAniPoints.push(newAniPoint);
      
      allAniPoints[k].calcPath();
    }
  }

  sketch.draw = () =>{
    sketch.background(255);
    drawBackground(sketch)
    
    drawAxes(sketch);
    drawData(sketch);

    // Add one new point framesBetweenNewAni frame until max is reached
    if ((sketch.frameCount % framesBetweenNewAni) == 0) {
      if (allAniPoints.length < numAniPoints){
        let newAniPoint = new aniPoint('random');   

        allAniPoints.push(newAniPoint);
        
        allAniPoints[allAniPoints.length-1].calcPath();
      }
    }

    for (let k = 0; k < allAniPoints.length; k++) {
      // allAniPoints[k].showFullPath(sketch);
      allAniPoints[k].showAnimation(sketch);
    }


  }

  sketch.resetAnimations = () => {
    for (let k = 0; k < allAniPoints.length; k++) {
      allAniPoints[k].reset(sketch);
    }
    allAniPoints = [];
  }
}




// ---- Sketch Distributions, initial value ----
const sketchDist = ( sketch ) => {
  
  let parMu;
  let parSi;
  let drawRandom = true;
  let randomsToShowX = [];
  let randomsToShowY = [];

  sketch.addRandom = (thisT) => {
    let curMaxT = parseFloat(R0_slider.max); 
    
    parMu = sirR0;
    parSi = sirR0Dist;

    let thisV =  Math.exp(-0.5 * Math.pow((thisT-parMu)/parSi,2));
    let [curX,curY] = coorToScreenCoorDist(thisT,thisV,curMaxT,1); 

    randomsToShowX.push(curX);
    randomsToShowY.push(curY);
  }

  sketch.getRandom = ()  => {
    let thisT = getRandomR0();   
    sketch.addRandom(thisT);
  }

  sketch.drawAllRandom = () => {
    
    let curMaxT = parseFloat(R0_slider.max); 
    // let [botX,botY] = coorToScreenCoorDist(0,0,curMaxT,1);
    let botY = valueToScreenYDist(0,1);
    sketch.stroke(0,50)
    sketch.strokeWeight(1);

    for (let k = 0; k < randomsToShowX.length; k++) {
      const curX = randomsToShowX[k];
      const curY = randomsToShowY[k];
      sketch.line(curX,curY,curX,botY);
      
    }
  }

  sketch.resetRandoms = () =>{
    randomsToShowX = [];
    randomsToShowY = [];
  }


  sketch.setup = () =>{
    sketch.createCanvas(smallW,smallH);
  }

  sketch.draw = () =>{
    sketch.background(255);
    drawBackground(sketch);
    drawParameterAxes(sketch);

    // - For drawing random examples
    if (drawRandom){
      
      // Every 5 frames,
      if ((sketch.frameCount % 5) == 0){ 
        // Reset what is being drawn
        sketch.resetRandoms();
        // And add everything again
        for (let k = toShowR0.length; k > (toShowR0.length-maxRandoms); k--) {
          const curT = toShowR0[k];        
          sketch.addRandom(curT);
        }
      }
      // // For getting new random values
      // if ((sketch.frameCount % 5) == 0){ 
      //   if (randomsToShowX.length < maxRandoms){
      //     sketch.getRandom()
      //   }
      // }
      sketch.drawAllRandom();
    }

    // - For drawing distribution -
    parMu = sirR0;
    parSi = sirR0Dist;

    let curMaxT = parseFloat(R0_slider.max); 

    let tRange = [];
    let numVals = 100;
    let iniT = parMu - parSi*5;
    let endT = parMu + parSi*5;
    let delT = (endT - iniT) / numVals;
    

    let prevT = iniT;
    let prevV = 0; 
    let [prevX,prevY] = coorToScreenCoorDist(prevT,prevV,curMaxT,1);

    let [curZero,asdf] = coorToScreenCoorDist(0,0,curMaxT,1);


    sketch.strokeWeight(2);
    sketch.stroke(0);

    if (parSi ==  0){
      let x;
      let y;
      let x2;
      let y2;
      [x,y] = coorToScreenCoorDist(parMu,0,curMaxT,1);
      [x2,y2] = coorToScreenCoorDist(parMu,1,curMaxT,1);
      sketch.strokeWeight(4);
      sketch.line(x,y,x2,y2)
    }

    for (let k = 0; k < numVals; k++) {
      
      let thisT = iniT + (delT*k)
      let thisV =  Math.exp(-0.5 * Math.pow((thisT-parMu)/parSi,2))

      // // To get the normalized value: (But here we show the non-normalized).
      // let preFact = 1/(parSi * Math.sqrt(2*Math.PI));
      // let thisV = preFact * Math.exp(-0.5 * Math.pow((thisT-parMu)/parSi,2))

      let x;
      let y;
      [x,y] = coorToScreenCoorDist(thisT,thisV,curMaxT,1);
      
      // if (prevX > backgroundMargin ){    
      if (prevX > curZero){    
        if (x < (smallW-backgroundMargin)){
          sketch.line(prevX,prevY,x,y);
        }
      }
      prevX = x;
      prevY = y;
    }


    // - Draw ticks and text - 
    let x;
    let y;

    let curPrec = 1;
    // let firstTicks = Math.round(curPrec*(parMu-parSi*2))/curPrec;
    // let lastTicks  = Math.round(curPrec*(parMu+parSi*2))/curPrec;
    let firstTicks = 0;
    let lastTicks  = 10;
    let deltaTicks = 1/curPrec;

    sketch.textAlign(sketch.CENTER,sketch.CENTER);
    for (let k = firstTicks; k <= lastTicks; k = k + deltaTicks) {
      
      [x,y] = coorToScreenCoorDist(k,0,curMaxT,1);
      sketch.stroke(clrAxes);
      sketch.strokeWeight(1);
      sketch.line(x,y+5,x,y-5); 

      [x,y] = coorToScreenCoorDist(k,-0.1,curMaxT,1);

      sketch.noStroke();
      sketch.fill(0);
      kRound = Math.round(k*curPrec)/curPrec;
      sketch.text(kRound,x,y);
      
    }
  }
}

// ---- Sketch Distribution, infectious period ----
const sketchDist2 = ( sketch ) => {

  let parMu;
  let parSi;

  let drawRandom = true;
  let randomsToShowX = [];
  let randomsToShowY = [];


  sketch.addRandom = (thisT) => {
    let curMaxT = parseFloat(tInf_slider.max); 
    
    // Uniform distribution
    let thisV = 1; 

    // Gaussian distribution 
    // let parMu = sirTInf;
    // let parSi = sirTInfDist;
    // let thisV =  Math.exp(-0.5 * Math.pow((thisT-parMu)/parSi,2)) 

    let [curX,curY] = coorToScreenCoorDist(thisT,thisV,curMaxT,1); 

    randomsToShowX.push(curX);
    randomsToShowY.push(curY);
  }

  sketch.getRandom = ()  => {
    let thisT = getRandomTInf();   
    sketch.addRandom(thisT);
  }

  sketch.drawAllRandom = () => {
    
    let curMaxT = parseFloat(tInf_slider.max); 
    let [botX,botY] = coorToScreenCoorDist(0,0,curMaxT,1);
    sketch.stroke(0,50)
    sketch.strokeWeight(1);

    for (let k = 0; k < randomsToShowX.length; k++) {
      const curX = randomsToShowX[k];
      const curY = randomsToShowY[k];
      sketch.line(curX,curY,curX,botY);
    }
  }

  sketch.resetRandoms = () =>{
    randomsToShowX = [];
    randomsToShowY = [];
  }

  sketch.setup = () =>{
    sketch.createCanvas(smallW,smallH);
    
  }

  sketch.draw = () =>{
    sketch.background(255);
    drawBackground(sketch);
    drawParameterAxes(sketch);

    // - For getting and drawing random examples
    if (drawRandom){
      // Every 5 frames,
      if ((sketch.frameCount % 5) == 0){ 
        // Reset what is being drawn
        sketch.resetRandoms();
        // And add everything again
        for (let k = toShowTInf.length; k > (toShowTInf.length-maxRandoms); k--) {
          const curT = toShowTInf[k];        
          sketch.addRandom(curT);
        }
      }
      // if ((sketch.frameCount % 5) == 0){ 
      //   if (randomsToShowX.length < maxRandoms){
      //     sketch.getRandom()
      //   }
      // }
      sketch.drawAllRandom();
    }

    // - For drawing distribution -
    let curMaxT = parseFloat(tInf_slider.max); 

    sketch.strokeWeight(2);
    sketch.stroke(0);

    let [firstX,firstY] = coorToScreenCoorDist(sirTInfMin,1,curMaxT,1);
    let [lastX,lastY] = coorToScreenCoorDist(sirTInfMax,1,curMaxT,1);
    sketch.line(firstX,firstY,lastX,lastY);

    let [firstX2,firstY2] = coorToScreenCoorDist(sirTInfMin,0,curMaxT,1);
    let [lastX2,lastY2] = coorToScreenCoorDist(sirTInfMax,0,curMaxT,1);
    sketch.strokeWeight(1);
    sketch.line(firstX,firstY,firstX2,firstY2);
    sketch.line(lastX,lastY,lastX2,lastY2);

    let [origoX,origoY] = coorToScreenCoorDist(0,0,curMaxT,1);
    let [endX,endY] = coorToScreenCoorDist(curMaxT,0,curMaxT,1);
    sketch.line(origoX,origoY,firstX2,firstY2);
    sketch.line(endX,endY,lastX2,lastY2);

    // - Draw ticks and text -
    let x;
    let y;

    let curPrec = 1;
    // let firstTicks = Math.round(curPrec*(parMu-parSi*2))/curPrec;
    // let lastTicks  = Math.round(curPrec*(parMu+parSi*2))/curPrec;
    let firstTicks = 0;
    // let lastTicks  = 0.5;
    let lastTicks = tInf_slider.max;
    let deltaTicks = 1/curPrec;

    sketch.textAlign(sketch.CENTER,sketch.CENTER);
    for (let k = firstTicks; k <= lastTicks; k = k + deltaTicks) {
      
      [x,y] = coorToScreenCoorDist(k,0,curMaxT,1);
      sketch.stroke(clrAxes);
      sketch.strokeWeight(1);
      sketch.line(x,y+5,x,y-5); 

      [x,y] = coorToScreenCoorDist(k,-0.1,curMaxT,1);

      sketch.noStroke();
      sketch.fill(0);
      kRound = Math.round(k*curPrec)/curPrec;
      sketch.text(kRound,x,y);
      
    }
  }
}


// --------------------------------
// ---- Final things ----
// --------------------------------

let mainP5 = new p5(sketchSir,document.getElementById('p5Div'));
let distP5 = new p5(sketchDist,document.getElementById('p5DivDist'));
let dist2P5 = new p5(sketchDist2,document.getElementById('p5DivDist2'));


let resetAllRandoms = function(){
  toShowR0 = [];
  toShowTInf = [];
}

let mainFunc = function(){
  readAndSet();
  calcData();
  resetAllRandoms();
  mainP5.resetAnimations();
  distP5.resetRandoms();
  dist2P5.resetRandoms();
  if (showAllVar){
    yMax = 100;
  } else if (showNewInf){
    yMax = sirR0*5;
  }
}

// Read, set and update everything on first run-through
mainFunc();


// -- Set the onchangefunctions of sliders --
R0_slider.onchange = function(){
  // Run main function 
  mainFunc();
}

tInf_slider.onchange = function(){
  // Run main function 
  mainFunc();
}

R0_dist_slider.onchange = function(){
  // Run main function 
  mainFunc();
}

tInf_dist_slider.onchange = function(){
  // Run main function 
  mainFunc();
}