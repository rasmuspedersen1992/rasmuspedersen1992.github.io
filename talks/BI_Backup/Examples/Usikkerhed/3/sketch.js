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
let firstp5DivElement = document.getElementById('p5Div2'); // For using CSS sizes
// let smallp5DivElement = document.getElementById('p5DivDist'); // For using CSS sizes

// --- Find interactive elements --- 
let ini_slider = document.getElementById('ini_slider2');
// let ini_slider2 = document.getElementById('ini_slider2');
// let ini_slider3 = document.getElementById('ini_slider3');
let grow_slider = document.getElementById('grow_slider2');
// let grow_slider2 = document.getElementById('grow_slider2');
// let grow_slider3 = document.getElementById('grow_slider3');
let ini_dist_slider = document.getElementById('ini_dist_slider');
// let ini_dist_slider2 = document.getElementById('ini_dist_slider2');
let grow_dist_slider = document.getElementById('grow_dist_slider');
// let grow_dist_slider2 = document.getElementById('grow_dist_slider2');

// let ini_label = document.getElementById('ini_label');
let ini_label2 = document.getElementById('ini_label2');
// let ini_label3 = document.getElementById('ini_label3');
// let grow_label = document.getElementById('grow_label');
let grow_label2 = document.getElementById('grow_label2');
// let grow_label3 = document.getElementById('grow_label3');
let ini_dist_label = document.getElementById('ini_dist_label');
// let ini_dist_label2 = document.getElementById('ini_dist_label2');
let grow_dist_label = document.getElementById('grow_dist_label');
// let grow_dist_label2 = document.getElementById('grow_dist_label2');


// Define parameters for "real" models
let expGrowthRate;
let expInit;
let expGrowDist;
let expInitDist; 

// --- Read sliders ---
let readInputs = function(){
  expGrowthRate = parseFloat(grow_slider.value);
  expInit = parseFloat(ini_slider.value);
  expGrowDist = parseFloat(grow_dist_slider.value);
  expInitDist = parseFloat(ini_dist_slider.value);
}

// --- Set labels beneath inputs --
let setLabels = function(){
  // ini_label.innerHTML  = 'Antal i starten: '+expInit;
  ini_label2.innerHTML = 'Starting value: '+expInit;
  // ini_label3.innerHTML = 'Antal i starten: '+expInit;
  // grow_label.innerHTML  = 'Vækstrate: '+expGrowthRate;
  grow_label2.innerHTML = 'Growthrate: '+expGrowthRate;
  // grow_label3.innerHTML = 'Vækstrate: '+expGrowthRate;
}

// -- Functions for getting random values from distributions --
let getRandomExpInit = function(){
  let toReturn = p5func.randomGaussian(expInit,expInitDist);
  // if (toReturn < 0){
  //   toReturn = 0;
  // }
  while (toReturn < 0){
    toReturn = p5func.randomGaussian(expInit,expInitDist);
  }
  return toReturn
  // return (expInit + (Math.random()-0.5)) 
}
let getRandomExpAlpha = function(){
  return p5func.randomGaussian(expGrowthRate,expGrowDist);
  // return (expGrowthRate + (expGrowDist*(Math.random()-0.5)))
  // return (expGrowthRate + (0.06*(Math.random()-0.5)))
}




// Define sizes of everything
// let allW = 450
let allW = firstp5DivElement.offsetWidth;
let allH = 350;
// let smallW = smallp5DivElement.offsetWidth;
let smallW = 300;
let smallH = 200;

// Axes
let axMargin = 35;
let ax_0_X = axMargin;
let ax_0_Y = allH-axMargin;
let ax_W = allW-axMargin*2;
let ax_H = -allH + axMargin*2;
let ax_NumTicks_X = 10;
let xTicksStep = Math.floor(ax_W / ax_NumTicks_X);
// let ax_NumTicks_Y = 10;

let xMax  = ax_NumTicks_X;
// let yMax  = 200;
let yMax  = ini_slider.max  * 2;


// Colors
let clrAxes = [155,200,200];
let clrBackground = [240,240,255];
// let clrDataReal = [155,155,155];
let clrDataReal = [0,0,0];
let clrAniPath = [150,150,150];

// let clrBackgroundAlpha = 20;

// Data-arrays 
let dataT;
let meanV; 
let dt_plot = 0.1;


let calcData = () =>  {
  // Reset arrays
  dataT = [];
  meanV = [];
  // Exponential
  for (let t = 0; t < ax_NumTicks_X; t=t+dt_plot) {
    dataT.push(t);
    const curV = expInit * Math.exp((expGrowthRate) * t);
    meanV.push(curV);
  }
}



function coorToScreenCoor(t,v){
  // Translates variables to screen-coordinates
  // let xZero = 0;
  // let yZero = 0;
  // let xMax  = ax_NumTicks_X;
  // let yMax  = 50;

  // let x = lerp(xZero,xMax,t/xMax);
  // let y = lerp(yZero,yMax,v/yMax);
  let x = ax_0_X + (t/xMax) * ax_W;
  let y = ax_0_Y + (v/yMax) * ax_H;

  return [x,y]
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
  // sketch.fill(clrBackground[0],clrBackground[1],clrBackground[2],clrBackgroundAlpha)
  // sketch.stroke(clrBackground[0],clrBackground[1],clrBackground[2],255)
  sketch.stroke(0,50)
  sketch.strokeWeight(1)
  // sketch.stroke(0,50)

  // let backgroundMargin = 10;
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
    const v = meanV[k];
    const t2 = dataT[k+1];
    const v2 = meanV[k+1];

    
    [x,y] = coorToScreenCoor(t,v);
    [x2,y2] = coorToScreenCoor(t2,v2);

    sketch.strokeWeight(2);

    sketch.stroke(clrDataReal)
    // For a dotted line:
    if (showThis) {
      sketch.stroke(clrDataReal)
      showThis = false;
    } else {
      sketch.noStroke();
      showThis = true;
    }

    if (y > yMax){
      sketch.line(x,y,x2,y2);
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

  // let ax_margin = 100;
  

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
  let x = ax_0_X + (t/tMax) * ax_W_small;
  let y = ax_0_Y_small + (v/vMax) * ax_H_small;

  return [x,y]
}


// function coorToScreenCoorDist(t,v,tMax,vMax){
//   // Translates variables to screen-coordinates
//   let x = ax_0_X + (t/tMax) * ax_W_small;
//   let y = ax_0_Y_small + (v/vMax) * ax_H_small;

//   return [x,y]
// }

// --------------------------------
// ---- Define animated points ----
// --------------------------------
class aniPoint {
  constructor(type){
    this.t0 = 0;
    this.v0 = expInit; // Change!
    this.alpha = expGrowthRate; // Change!
    this.ts = [];
    this.vs = [];
    
    this.maxT = 10;
    this.dt = 0.05;
    this.dt = 0.1;
    // this.dt = 0.2;

    this.stepsToShow = 20;

    // this.aniID = Math.floor(Math.random()*this.stepsToShow);
    // this.aniIDini = Math.floor(Math.random()*(this.maxT/this.dt));
    this.aniID = Math.floor(Math.random()*(this.maxT/this.dt));
    // this.aniIDini = 0;
    // this.aniIDini = aniIDini;
    // this.aniID = this.aniIDini;

    // this.clr = [Math.random()*255,Math.random()*255,Math.random()*255]
    // this.clr = [Math.random()*155,Math.random()*155,Math.random()*155]
    this.clr = [155,155,155]

    this.type = type;
  }

  getPars(){
    if (this.type == 'mean'){
      this.v0 = expInit; 
      this.alpha = expGrowthRate;
    } else if (this.type == 'random'){
      this.v0 = getRandomExpInit(); 
      this.alpha = getRandomExpAlpha();
    }
  }


  calcPath(){
    
    this.ts = [];
    this.vs = [];
    // let maxT = 10;
    // let dt = 0.1;

    this.getPars();
    // this.v0 = expInit + (Math.random()); //Change!
    // this.alpha = expGrowthRate + (0.06*Math.random()); // Change!


    for (let curT = this.t0; curT < this.maxT; curT = curT + this.dt) {
      this.ts.push(curT);
      const curV = this.v0 * Math.exp((this.alpha) * curT);
      this.vs.push(curV);
    }
  }

  reset(){
    this.calcPath();
    // this.aniID = this.aniIDini;
    // this.aniID = Math.floor(Math.random()*this.stepsToShow);

    this.getPars();
    

    this.aniID = Math.floor(Math.random()*(this.maxT/this.dt));
  }

  showFullPath(sketch){
    for (let k = 1; k < this.ts.length; k++) {
      const t = this.ts[k];
      const v = this.vs[k];
      const t2 = this.ts[k-1];
      const v2 = this.vs[k-1];

      let x;
      let y;
      let x2;
      let y2;
      [x,y] = coorToScreenCoor(t,v);
      [x2,y2] = coorToScreenCoor(t2,v2);

      sketch.strokeWeight(0.5);
      // sketch.stroke(clrAniPath);
      const curAlpha = 20;
      sketch.stroke(this.clr[0],this.clr[1],this.clr[2],curAlpha);
      if (y > backgroundMargin){
        sketch.line(x,y,x2,y2);
      }


    }
  }

  showAnimation(sketch){

    let stepsToShow = this.stepsToShow;

    for (let k = 0; k < stepsToShow; k++) {
      if ((this.aniID - k) > 0){
        const t = this.ts[this.aniID - k];
        const v = this.vs[this.aniID - k];
        const t2 = this.ts[this.aniID - k - 1];
        const v2 = this.vs[this.aniID - k - 1];
        
        let x;
        let y;
        let x2;
        let y2;
        [x,y] = coorToScreenCoor(t,v);
        [x2,y2] = coorToScreenCoor(t2,v2);
        sketch.strokeWeight(1);

        const curAlpha = 255*(stepsToShow - k)/stepsToShow;

        sketch.stroke(this.clr[0],this.clr[1],this.clr[2],curAlpha);
        if (y > backgroundMargin){
          sketch.line(x,y,x2,y2);
        }


      }      
    }

    

    // Draw a dot at the front
    const t = this.ts[this.aniID];
    const v = this.vs[this.aniID];
    let x;
    let y;
    [x,y] = coorToScreenCoor(t,v);
    sketch.stroke(this.clr);
    sketch.strokeWeight(3);
    if (y > backgroundMargin){
      sketch.point(x,y)
    }

    // Move one point forward
    this.aniID = this.aniID+1;

    let maxAniID = this.ts.length - 1;
    if (this.aniID > maxAniID + stepsToShow){
      this.reset();
      this.aniID = 0;
    }

    // if (x > ax_W +50){
    //   this.aniID = 0;
    // }

    if (y < yMax){
      this.reset();
      this.aniID = 0;
    }
  }

}

// --------------------------------
// ---- Sketches ----
// --------------------------------

// ---- Sketch 1 ----
const sketch1 = ( sketch ) => {
  
  let numAniPoints = 20;
  let allAniPoints = [];

  sketch.setup = () =>{
    sketch.createCanvas(allW,allH);

    // Initialize animated points
    for (let k = 0; k < numAniPoints; k++) {
      let newAniPoint = new aniPoint('mean');   

      allAniPoints.push(newAniPoint);
      
      allAniPoints[k].calcPath();
    }
  }

  sketch.draw = () =>{
    // sketch.background(clrBackground);
    sketch.background(255);
    drawBackground(sketch)
    drawAxes(sketch);
    // drawData(sketch); 


    for (let k = 0; k < allAniPoints.length; k++) {
      allAniPoints[k].showFullPath(sketch);
      allAniPoints[k].showAnimation(sketch);
    }


  }

  sketch.resetAnimations = () => {
    for (let k = 0; k < allAniPoints.length; k++) {
      allAniPoints[k].reset(sketch);
    }
  }
}

// ---- Sketch 2 ----
const sketch2 = ( sketch ) => {
  
  // sketch.showRealData = true;
  // sketch.showNoisyData = false;
  // sketch.showRealFunction = true;

  let numAniPoints = 50;
  let allAniPoints = [];

  sketch.setup = () =>{
    sketch.createCanvas(allW,allH);
    
    // Initialize animated points
    for (let k = 0; k < numAniPoints; k++) {
      let newAniPoint = new aniPoint('random');   

      allAniPoints.push(newAniPoint);
      
      allAniPoints[k].calcPath();
    }
  }

  sketch.draw = () =>{
    sketch.background(255);
    // sketch.background(clrBackground);
    drawBackground(sketch)
    
    drawAxes(sketch);
    drawData(sketch);

    for (let k = 0; k < allAniPoints.length; k++) {
      allAniPoints[k].showFullPath(sketch);
      allAniPoints[k].showAnimation(sketch);
    }


  }

  sketch.resetAnimations = () => {
    for (let k = 0; k < allAniPoints.length; k++) {
      allAniPoints[k].reset(sketch);
    }
  }
}



// ---- Sketch Distributions, initial value ----
const sketchDist = ( sketch ) => {
  
  let parMu;
  let parSi;
  let drawRandom = true;
  let maxRandoms = 200;
  let randomsToShowX = [];
  let randomsToShowY = [];

  sketch.getRandom = ()  => {
    let thisT = getRandomExpInit();   
    let curMaxT = parseFloat(ini_slider.max); 
    
    parMu = expInit
    parSi = expInitDist;

    let thisV =  Math.exp(-0.5 * Math.pow((thisT-parMu)/parSi,2));
    let [curX,curY] = coorToScreenCoorDist(thisT,thisV,curMaxT,1); 

    randomsToShowX.push(curX);
    randomsToShowY.push(curY);
  }

  sketch.drawAllRandom = () => {
    
    let curMaxT = parseFloat(ini_slider.max); 
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
      if ((sketch.frameCount % 5) == 0){ 
        if (randomsToShowX.length < maxRandoms){
          sketch.getRandom()
        }
      }
      sketch.drawAllRandom();
    }

    // - For drawing distribution -
    parMu = expInit
    parSi = expInitDist;

    let curMaxT = parseFloat(ini_slider.max); 

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
      // sketch.point(x,y);

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

// ---- Sketch Distribution, growth-rate ----
const sketchDist2 = ( sketch ) => {

  let parMu;
  let parSi;

  let drawRandom = true;
  let maxRandoms = 200;
  let randomsToShowX = [];
  let randomsToShowY = [];

  sketch.getRandom = ()  => {
    let thisT = getRandomExpAlpha();   
    let curMaxT = parseFloat(grow_slider.max); 
    
    let parMu = expGrowthRate;
    let parSi = expGrowDist;

    let thisV =  Math.exp(-0.5 * Math.pow((thisT-parMu)/parSi,2))
    let [curX,curY] = coorToScreenCoorDist(thisT,thisV,curMaxT,1); 

    randomsToShowX.push(curX);
    randomsToShowY.push(curY);
  }

  sketch.drawAllRandom = () => {
    
    let curMaxT = parseFloat(grow_slider.max); 
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
      if ((sketch.frameCount % 5) == 0){ 
        if (randomsToShowX.length < maxRandoms){
          sketch.getRandom()
        }
        // console.log(randomsToShowY)

      }
      sketch.drawAllRandom();
    }


    // - For drawing distribution -
    parMu = expGrowthRate;
    parSi = expGrowDist;

    // let curMinT = parseFloat(grow_slider.min);
    let curMaxT = parseFloat(grow_slider.max); 

    let tRange = [];
    let numVals = 100;
    let iniT = parMu - parSi*5;
    let endT = parMu + parSi*5;
    let delT = (endT - iniT) / numVals;
    

    let prevT = iniT;
    let prevV = 0; 
    let [prevX,prevY] = coorToScreenCoorDist(prevT,prevV,curMaxT,1);

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
      // if (prevX > (ax_0_X) {    
        // console.log(ax_0_X-ax_H_small);
        // if (x < (ax_0_X + ax_W_small)){
      if (prevX > backgroundMargin ){    
        if (x < (smallW-backgroundMargin)){
          sketch.line(prevX,prevY,x,y);
        }
      }
      prevX = x;
      prevY = y;
      // sketch.point(x,y);

    }

    // - Draw ticks and text -
    let x;
    let y;

    let curPrec = 10;
    // let firstTicks = Math.round(curPrec*(parMu-parSi*2))/curPrec;
    // let lastTicks  = Math.round(curPrec*(parMu+parSi*2))/curPrec;
    let firstTicks = 0;
    let lastTicks  = 0.5;
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

// let firstP5 = new p5(sketch1,document.getElementById('p5Div1'));
let secondP5 = new p5(sketch2,document.getElementById('p5Div2'));
// let distP5 = new p5(sketchDist,document.getElementById('p5DivDist'));
// let dist2P5 = new p5(sketchDist2,document.getElementById('p5DivDist2'));


let mainFunc = function(){
  readAndSet();
  calcData();
  // firstP5.resetAnimations();
  secondP5.resetAnimations();
  // distP5.resetRandoms();
  // dist2P5.resetRandoms();
}

// Read, set and update everything on first run-through
mainFunc();


// // -- Set the onchangefunctions of sliders --
// ini_slider.onchange = function(){
//   // Set the value of the other slider as well
//   ini_slider2.value = ini_slider.value;
//   ini_slider3.value = ini_slider.value;
//   // Run main function 
//   mainFunc();
// }
ini_slider2.onchange = function(){
  // Set the value of the other slider as well
  // ini_slider.value = ini_slider2.value;
  // ini_slider3.value = ini_slider2.value;
  // Run main function 
  mainFunc();
}
// ini_slider3.onchange = function(){
//   // Set the value of the other slider as well
//   ini_slider.value = ini_slider3.value;
//   ini_slider2.value = ini_slider3.value;
//   // Run main function 
//   mainFunc();
// }

// grow_slider.onchange = function(){
//   // Set the value of the other slider as well
//   grow_slider2.value = grow_slider.value;
//   grow_slider3.value = grow_slider.value;
//   // Run main function 
//   mainFunc();
// }
grow_slider2.onchange = function(){
  // // Set the value of the other slider as well
  // grow_slider.value = grow_slider2.value;
  // grow_slider3.value = grow_slider2.value;
  // Run main function 
  mainFunc();
}
// grow_slider3.onchange = function(){
//   // Set the value of the other slider as well
//   grow_slider.value = grow_slider3.value;
//   grow_slider2.value = grow_slider3.value;
//   // Run main function 
//   mainFunc();
// }

ini_dist_slider.onchange = function(){
  // Set the value of the other slider as well
  // ini_dist_slider2.value = ini_dist_slider.value;
  // Run main function 
  mainFunc();
}
// ini_dist_slider2.onchange = function(){
//   // Set the value of the other slider as well
//   ini_dist_slider.value = ini_dist_slider2.value;
//   // Run main function 
//   mainFunc();
// }

grow_dist_slider.onchange = function(){
  // Set the value of the other slider as well
  // grow_dist_slider2.value = grow_dist_slider.value;
  // Run main function 
  mainFunc();
}
// grow_dist_slider2.onchange = function(){
//   // Set the value of the other slider as well
//   grow_dist_slider.value = grow_dist_slider2.value;
//   // Run main function 
//   mainFunc();
// }

