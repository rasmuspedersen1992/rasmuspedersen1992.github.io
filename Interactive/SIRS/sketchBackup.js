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


// Flags for what to show
let showNewInf = true;
let showAllVar = false;
// let showNewInf = false;
// let showAllVar = true;
let drawRandom = true;
let maxAniPoints = 0;



// ----------- Setup interactive elements ----------- 
let R0_slider = document.getElementById('R0_slider');
let tInf_slider = document.getElementById('tInf_slider');
let redu_slider = document.getElementById('redu_slider');
let R0_dist_slider = document.getElementById('R0_dist_slider');
let tInf_dist_slider = document.getElementById('tInf_dist_slider');
let redu_dist_slider = document.getElementById('redu_dist_slider');

let R0_label = document.getElementById('R0_label');
let tInf_label = document.getElementById('tInf_label');
let redu_label = document.getElementById('redu_label');
let R0_dist_label = document.getElementById('R0_dist_label');
let tInf_dist_label = document.getElementById('tInf_dist_label');
let redu_dist_label = document.getElementById('redu_dist_label');


let check_red = document.getElementById('checkRoed');
let check_gre = document.getElementById('checkGroen');
let check_conf = document.getElementById('checkConf'); 
let check_anim = document.getElementById('checkAnim');

let showRed = check_red.checked;
let showGreen = check_gre.checked;
let showConf = check_conf.checked;

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
  }
)

// radio_show_SIR.onchange = function(){
//   // Run main function 
//   // mainFunc();
//   console.log(radio_show_SIR)
// }

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

redu_slider.onchange = function(){
  // Run main function 
  mainFunc();
}
redu_dist_slider.onchange = function(){
  // Run main function 
  mainFunc();
}


check_anim.onchange = function(){
  if (check_anim.checked){
    maxAniPoints = 50;
    maxRandoms = 200;
  } else {
    maxAniPoints = 0;
    maxRandoms = 0;
  }

  // Run main function 
  mainFunc();
}


check_red.onchange = function(){
  showRed = check_red.checked;
  // Run main function 
  mainFunc();
}


check_gre.onchange = function(){
  showGreen = check_gre.checked;
  // Run main function 
  mainFunc();
}


check_conf.onchange = function(){
  showConf = check_conf.checked;
  // Run main function 
  mainFunc();
}

// ----------- END SETUP INTERACTIVITY  -----------


// Initialize arrays for all random values
let toShowR0 = [];
let toShowTInf = [];
let toShowRedu = [];
let maxRandoms = 0; 

// Define parameters for "real" models
let sirR0;
let sirR0Dist;
let sirTInf;
let sirTInfDist;
let sirRedu;
let sirReduDist;

let sirTInfMin;
let sirTInfMax;

// --- Read sliders ---
let readInputs = function(){
  sirR0 = parseFloat(R0_slider.value);
  sirR0Dist  = parseFloat(R0_dist_slider.value);
  sirTInf = parseFloat(tInf_slider.value);
  sirTInfDist = parseFloat(tInf_dist_slider.value);
  sirRedu = parseFloat(redu_slider.value);
  sirReduDist = parseFloat(redu_dist_slider.value);

  sirTInfMax = sirTInf + sirTInfDist;
  sirTInfMin = sirTInf - sirTInfDist;
  if (sirTInfMin < 0){
    sirTInfMin = 0;
  }
}

// --- Set labels beneath inputs --
let setLabels = function(){
  // R0_label.innerHTML  = 'R0: '+sirR0;
  R0_label.innerHTML  = 'Reproduktionstal, R0: '+sirR0;
  tInf_label.innerHTML  = 'Smitsom periode: '+sirTInf + ' dage';
  redu_label.innerHTML  = 'Effekt af nedlukning: '+parseInt(100*sirRedu)+'%';
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

let getRandomRedu = function(){
  let toReturn = p5func.randomGaussian(sirRedu,sirReduDist);
  // Just keep trying until a positive number is returned (Could be slow sometimes *shrug*)
  while (toReturn < 0){
    toReturn = p5func.randomGaussian(sirRedu,sirReduDist);
  }
  return toReturn
}


// var maxT = 50;
var maxT = 100;

/// -------------------------
function calcSIRvalues(R0,tInf,redu){

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
  var Ss_redu = [];
  var Is_redu = [];
  var Rs_redu = [];
  // var Ts_redu = [];
  var newInfs_redu = [];
  var newInfsCumu_redu = [];



  var iniS = 100;
  var iniI = 0.1;
  var iniR = 0;
  var maxPop = iniS+iniI+iniR;


  timeScale = 0.25;
  // timeScale = 0.5;
  // timeScale = 1;
  // timeScale = 1;

  dt = 0.1;
  stepsPerTimescale = timeScale/dt;

  
  // var maxT = 150;
  // var maxT = 75;
  // var maxT = 50;



  curNewInfsCumu = 0;

  var popSize = iniS+iniI+iniR;
  var curN = 1;


  var count = 0;
  var curS = iniS/popSize;
  var curI = iniI/popSize;
  var curR = iniR/popSize;
  var curS_redu = iniS/popSize;
  var curI_redu = iniI/popSize;
  var curR_redu = iniR/popSize;


  var dS = 0;
  var dI = 0;
  var dR = 0;
  var dS_redu = 0;
  var dI_redu = 0;
  var dR_redu = 0; 


  // gamma = 1/4.7;
  beta = R0 * gamma / curN;
  beta_redu = (1-redu) * beta; // Mitigated epidemic is simply just reduction of beta

  let tScaler = 10;

  let mu = 1/365;
  mu = 0;

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
    // Mitigated
    dS_redu = - beta_redu * ((curS_redu * curI_redu) / curN);
    dI_redu = beta_redu * ((curS_redu * curI_redu) / curN) - gamma * curI_redu;
    dR_redu = gamma * curI_redu;
    curS_redu = curS_redu + dS_redu * dt;
    curI_redu = curI_redu + dI_redu * dt;
    curR_redu = curR_redu + dR_redu * dt;

    

    // Add the every X steps
    if ((count%stepsPerTimescale)==0){
        
      var rounder = 100;
      let tToPush = (Math.round(t*100)/100)/tScaler;
      Ts.push(tToPush)
      Ss.push(Math.round(popSize*curS*rounder)/rounder)
      Is.push(Math.round(popSize*curI*rounder)/rounder)
      Rs.push(Math.round(popSize*curR*rounder)/rounder)
      Ss_redu.push(Math.round(popSize*curS_redu*rounder)/rounder)
      Is_redu.push(Math.round(popSize*curI_redu*rounder)/rounder)
      Rs_redu.push(Math.round(popSize*curR_redu*rounder)/rounder)

      // Only calculate the new infections if they are going to be shown.
      if (showNewInf) {
        if (Ss.length > 1){
          curNewInfs = Ss[Ss.length-2] - Ss[Ss.length-1]
          // curNewInfs =  dt * beta * Ss[Ss.length-1] * Is[Is.length-1] / curN
          // curNewInfs = dt * beta * Ss[Ss.length-1] * Is[Is.length-1] / curN
          // curNewInfs = 100 * timeScale *beta * curS * curI / curN
          curNewInfs = 100 * dt * tScaler *beta * curS * curI / curN

          // SKAL FIXES, KRÆVER NOK AT MAN TÆNKER SIG OM...

          // curNewInfs =  dt* beta * Ss[Ss.length-1] * Is[Is.length-1] 
          newInfs.push(Math.round((curNewInfs)*rounder)/rounder) 
          curNewInfs_redu = Ss_redu[Ss_redu.length-2] - Ss_redu[Ss_redu.length-1]
          newInfs_redu.push(Math.round((curNewInfs_redu)*rounder)/rounder) 

          curNewInfsCumu = curNewInfsCumu + curNewInfs
          newInfsCumu.push(Math.round((curNewInfsCumu)*rounder)/rounder)
        } else {
          newInfs.push(iniI)
          newInfsCumu.push(iniI)
          newInfs_redu.push(iniI)
          newInfsCumu_redu.push(iniI)
        }
      }
    }
    count = count + 1;
  }

  newInfs[0] = newInfs[1]*0.8;
  newInfs_redu[0] = newInfs_redu[1]*0.8;
  // return [Ts,Ss,Is,Rs,newInfs,newInfsCumu]
  // console.log(newInfs_redu)
  // console.log(Is_redu)
  return [Ts,Ss,Is,Rs,newInfs,newInfsCumu,Ss_redu,Is_redu,Rs_redu,newInfs_redu,newInfsCumu_redu]
}

/// -------------------------
// Define sizes of everything
// let allW = 450
let allW = firstp5DivElement.offsetWidth;
let allH = 500;
let smallW = smallp5DivElement.offsetWidth;
// let smallH = 200;
let smallH = 120;

// Axes
// let axMargin = 35;
let axMargin = 50;
let ax_0_X = axMargin;
// let ax_0_X = 50;
let ax_0_Y = allH-axMargin;
let ax_W = allW-axMargin*2;
let ax_H = -allH + axMargin*2;
// // let ax_NumTicks_X = 10;
// // let ax_NumTicks_X = 5;
// // let xTicksStep = Math.floor(ax_W / ax_NumTicks_X);
// // let ax_NumTicks_Y = 10;

let axMarginDist = 40;
let axMarginDistH = 20;
let ax_0_X_small = axMarginDist;
let ax_0_Y_small = smallH-axMarginDistH*1.2;
let ax_W_small = smallW-axMarginDist*2; 
let ax_H_small = -smallH + axMarginDistH*2;

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
let clrDataReal = [0,0,0];
let clrAniPath = [150,150,150];
let clrS    = [0,0,255];
let clrS_li = [100,100,200];
let clrS_redu = [120,200,200];
let clrI    = [255,0,0];
let clrI_li = [255,50,50];
let clrI_redu = [255,150,250];
let clrR    = [0,255,0];
let clrR_li = [50,155,50];
let clrR_redu = [150,200,100];
// let clrNewInf = [100,100,100];
// let clrNewInf_li = [150,150,150];

let clrNewInf = [150,100,100];
let clrNewInf_li = [250,180,150];

let clrNewInf_redu = [100,150,100];
let clrNewInf_li_redu = [150,250,150];

let clrConf = [100,100,100];
// let clrConf_S = clrS_li + [0,20,00]
// let clrConf_I = clrI_li + [0,20,00]
// let clrConf_R = clrR_li + [0,20,00]
let clrConf_NewInf = [150,120,100];
let clrConf_NewInf_redu = [100,150,100];

// Data-arrays 
let dataT;
let meanS; 
let meanI; 
let meanR; 
let meanNewInfs;
let meanNewInfsCumu;

let meanS_redu; 
let meanI_redu; 
let meanR_redu; 
let meanNewInfs_redu;
let meanNewInfsCumu_redu;

// For confidence intervals
let meanS_upper; 
let meanI_upper; 
let meanR_upper; 
let meanNewInfs_upper;
let meanNewInfsCumu_upper;
let meanS_redu_upper; 
let meanI_redu_upper; 
let meanR_redu_upper; 
let meanNewInfs_redu_upper;
let meanNewInfsCumu_redu_upper;
let meanS_lower; 
let meanI_lower; 
let meanR_lower; 
let meanNewInfs_lower;
let meanNewInfsCumu_lower;
let meanS_redu_lower; 
let meanI_redu_lower; 
let meanR_redu_lower; 
let meanNewInfs_redu_lower;
let meanNewInfsCumu_redu_lower;


let meanNewInfs_upper2;
let meanNewInfs_lower2;
let meanNewInfs_redu_upper2;
let meanNewInfs_redu_lower2;

let calcData = () =>  {
  // // Reset arrays
  // dataT = [];
  // meanS = [];
  // meanI = [];
  // meanR = [];

  
  // [dataT,meanS,meanI,meanR,meanNewInfs,meanNewInfsCumu]  = calcSIRvalues(sirR0,sirTInf)
  [dataT,meanS,meanI,meanR,meanNewInfs,meanNewInfsCumu,meanS_redu,meanI_redu,meanR_redu,meanNewInfs_redu,meanNewInfsCumu_redu]  = calcSIRvalues(sirR0,sirTInf,sirRedu)
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

let calcConfIntervals = () => {

  numToSample = 1000;

  if (showAllVar){
    // TO BE DONE
    // [dataT,meanS_upper,meanI_upper,meanR_upper,meanNewInfs_upper,meanNewInfsCumu_upper,meanS_redu_upper,meanI_redu_upper,meanR_redu_upper,meanNewInfs_redu_upper,meanNewInfsCumu_redu_upper]   = calcSIRvalues(sirR0,sirTInf,sirRedu)
    // [dataT,meanS_lower,meanI_lower,meanR_lower,meanNewInfs_lower,meanNewInfsCumu_lower,meanS_redu_lower,meanI_redu_lower,meanR_redu_lower,meanNewInfs_redu_lower,meanNewInfsCumu_redu_lower]    = calcSIRvalues(sirR0,sirTInf,sirRedu)
    
    
    [dataT,__,__,__,__,__,__,__,__,__,__]   = calcSIRvalues(sirR0,sirTInf,sirRedu)
    
    let allS = [];
    let allS_redu = [];
    let allI = [];
    let allI_redu = [];
    let allR = [];
    let allR_redu = [];
    let curS;
    let curS_redu;
    let curI;
    let curI_redu;
    let curR;
    let curR_redu;
    for (let k = 0; k < numToSample; k++) {
      curR0 = getRandomR0();
      curTInf = getRandomTInf();
      curRedu = getRandomRedu();
      [__,curS,curI,curR,__,__,curS_redu,curI_redu,curR_redu,__,__]  = calcSIRvalues(curR0,curTInf,curRedu)

      allS.push(curS)
      allS_redu.push(curS_redu)
      allI.push(curI)
      allI_redu.push(curI_redu)
      allR.push(curR)
      allR_redu.push(curR_redu)
    }
      
    meanS_upper = []; 
    meanI_upper = []; 
    meanR_upper = []; 
    meanS_redu_upper = []; 
    meanI_redu_upper = []; 
    meanR_redu_upper = []; 
    meanS_lower = []; 
    meanI_lower = []; 
    meanR_lower = []; 
    meanS_redu_lower = []; 
    meanI_redu_lower = []; 
    meanR_redu_lower = []; 
    
    
    
    for (let t = 0; t < dataT.length; t++) {
      curS = [];
      curS_redu = [];
      curI = [];
      curI_redu = [];
      curR = [];
      curR_redu = [];
      
      
      // new Float64Array(
        
      for (let k = 0; k < numToSample; k++) {
        curS.push(allS[k][t])      
        curS_redu.push(allS_redu[k][t])      
        curI.push(allI[k][t])      
        curI_redu.push(allI_redu[k][t])      
        curR.push(allR[k][t])      
        curR_redu.push(allR_redu[k][t])      
      }
      
      
      // Cast to Float64Arrays for quicker (and correct) sorting
      curS = new Float64Array(curS);
      curS_redu = new Float64Array(curS_redu);
      curI = new Float64Array(curI);
      curI_redu = new Float64Array(curI_redu);
      curR = new Float64Array(curR);
      curR_redu = new Float64Array(curR_redu);
      
      // Sort curVals
      curS = curS.sort();
      curS_redu = curS_redu.sort();
      curI = curI.sort();
      curI_redu = curI_redu.sort();
      curR = curR.sort();
      curR_redu = curR_redu.sort();

      // console.log(curI);

      let confRangeBottom = 0.10;
      let confRangeTop = 1-confRangeBottom
      

      let newValLower; 
      let newValUpper; 
      newValUpper = curS[parseInt(numToSample*confRangeTop)];
      newValLower = curS[parseInt(numToSample*confRangeBottom)];
      meanS_lower.push(newValLower)
      meanS_upper.push(newValUpper)
      newValUpper = curI[parseInt(numToSample*confRangeTop)];
      newValLower = curI[parseInt(numToSample*confRangeBottom)];
      meanI_lower.push(newValLower)
      meanI_upper.push(newValUpper)
      newValUpper = curR[parseInt(numToSample*confRangeTop)];
      newValLower = curR[parseInt(numToSample*confRangeBottom)];
      meanR_lower.push(newValLower)
      meanR_upper.push(newValUpper)
      
      
      newValUpper = curS_redu[parseInt(numToSample*confRangeTop)];
      newValLower = curS_redu[parseInt(numToSample*confRangeBottom)];
      meanS_redu_lower.push(newValLower)
      meanS_redu_upper.push(newValUpper)
      newValUpper = curI_redu[parseInt(numToSample*confRangeTop)];
      newValLower = curI_redu[parseInt(numToSample*confRangeBottom)];
      meanI_redu_lower.push(newValLower)
      meanI_redu_upper.push(newValUpper)
      newValUpper = curR_redu[parseInt(numToSample*confRangeTop)];
      newValLower = curR_redu[parseInt(numToSample*confRangeBottom)];
      meanR_redu_lower.push(newValLower)
      meanR_redu_upper.push(newValUpper)
      
      
    }
  } else if (showNewInf){
    

    // // Old bad and stupid way:
    // R0upper = sirR0 + sirR0Dist;
    // TInfupper = sirTInf + sirTInfDist;
    // ReduUpper = sirRedu + sirReduDist;
    // [dataT,meanS_upper,meanI_upper,meanR_upper,meanNewInfs_upper,meanNewInfsCumu_upper,meanS_redu_upper,meanI_redu_upper,meanR_redu_upper,meanNewInfs_redu_upper,meanNewInfsCumu_redu_upper]  = calcSIRvalues(R0upper,TInfupper,ReduUpper)

    
    // R0lower = sirR0 - sirR0Dist;
    // TInflower = sirTInf - sirTInfDist;
    // Redulower = sirRedu - sirReduDist;
    // [dataT,meanS_lower,meanI_lower,meanR_lower,meanNewInfs_lower,meanNewInfsCumu_lower,meanS_redu_lower,meanI_redu_lower,meanR_redu_lower,meanNewInfs_redu_lower,meanNewInfsCumu_redu_lower]  = calcSIRvalues(R0lower,TInflower,Redulower)


    // Correct new way
    // Idea: Calculate a number of examples, collect in 2D array, go through each time step and calculate intervals, save in the one which is shown
    let allNewInfs = [];
    let allNewInfs_redu = [];
    let curNewInfs;
    let curNewInfs_redu;
    for (let k = 0; k < numToSample; k++) {
      curR0 = getRandomR0();
      curTInf = getRandomTInf();
      curRedu = getRandomRedu();
      [__,__,__,__,curNewInfs,__,__,__,__,curNewInfs_redu,__]  = calcSIRvalues(curR0,curTInf,curRedu)

      allNewInfs.push(curNewInfs)
      allNewInfs_redu.push(curNewInfs_redu)
    }

    meanNewInfs_upper = [];
    meanNewInfs_lower = [];
    meanNewInfs_redu_upper = [];
    meanNewInfs_redu_lower = [];
    // meanNewInfs_upper2 = [];
    // meanNewInfs_lower2 = [];
    // meanNewInfs_redu_upper2 = [];
    // meanNewInfs_redu_lower2 = [];

    for (let t = 0; t < curNewInfs.length; t++) {
      let curVals =[];
      let curVals_redu =[];
      for (let k = 0; k < numToSample; k++) {
        curVals.push(allNewInfs[k][t])      
        curVals_redu.push(allNewInfs_redu[k][t])      
      }
      // Cast to Float64Arrays for quicker (and correct) sorting
      curVals = new Float64Array(curVals);
      curVals_redu = new Float64Array(curVals_redu);
      // Sort curVals
      curVals = curVals.sort()
      curVals_redu = curVals_redu.sort()
      // console.log(curVals)

      // let newValLower = curVals[parseInt(numToSample/4)];
      // let newValUpper = curVals[parseInt(3*numToSample/4)];
      // let newValLower = curVals[parseInt(numToSample/8)];
      // let newValUpper = curVals[parseInt(7*numToSample/8)];

      let confRangeBottom = 0.10;
      let confRangeTop = 1-confRangeBottom

      let newValLower = curVals[parseInt(numToSample*confRangeBottom)];
      let newValUpper = curVals[parseInt(numToSample*confRangeTop)];
      meanNewInfs_lower.push(newValLower)
      meanNewInfs_upper.push(newValUpper)
      
      let newValLower_redu = curVals_redu[parseInt(numToSample*confRangeBottom)];
      let newValUpper_redu = curVals_redu[parseInt(numToSample*confRangeTop)];
      meanNewInfs_redu_lower.push(newValLower_redu)
      meanNewInfs_redu_upper.push(newValUpper_redu)
      

      // let confRangeBottom2 = 0.10;
      // let confRangeTop2 = 1-confRangeBottom2

      // newValLower = curVals[parseInt(numToSample*confRangeBottom2)];
      // newValUpper = curVals[parseInt(numToSample*confRangeTop2)];
      // meanNewInfs_lower2.push(newValLower)
      // meanNewInfs_upper2.push(newValUpper)
      
      // newValLower_redu = curVals_redu[parseInt(numToSample*confRangeBottom2)];
      // newValUpper_redu = curVals_redu[parseInt(numToSample*confRangeTop2)];
      // meanNewInfs_redu_lower2.push(newValLower_redu)
      // meanNewInfs_redu_upper2.push(newValUpper_redu)

      // let newValMedian = curVals[parseInt(numToSample*0.5)];
      // meanNewInfs.push(newValMedian);

    }
  }
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



  sketch.pop()
}

// ---
let drawData = (sketch) => {

  // For showing the function for defining data
  let showThis = true;
      
  let y_0 = valueToScreenY(0);
  let y_100 = valueToScreenY(100);
  
  
  if (showAllVar){
    sketch.noStroke();
    sketch.fill(clrS_li);
    // sketch.rect(x,y_RIS,curdx,y_0-y_RIS);
    sketch.rect(axMargin,y_100,ax_W,y_0-y_100); 
  }

  for (let k = 0; k < dataT.length - 1; k++) {
    const t = dataT[k];
    const t2 = dataT[k+1];

    let x = valueToScreenX(t);
    let x2 = valueToScreenX(t2);
    // [x,y] = coorToScreenCoor(t,s);
    // [x2,y2] = coorToScreenCoor(t2,s2);

    let curdx = x2-x;


    sketch.strokeWeight(2);
    // For a dotted line:
    if (showThis) {

      let y;
      let y2;


      if (x < (ax_W+axMargin)){
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
          sketch.quad(x,y_RI,x2,y_RI2,x2,y_0,x2,y_RI);
          sketch.fill(clrR_li);
          sketch.rect(x,y_R,curdx,y_0-y_R);
          sketch.quad(x,y_R,x2,y_R2,x2,y_0,x2,y_R);

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
      }

    // Uncomment for dashed lines:
      // showThis = false;
    // } else {
    //   showThis = true;

    }
    
    
  }
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
  if (showConf) {
    calcConfIntervals();
  }
  if (showAllVar){
    yMax = 100;
  } else if (showNewInf){
    // yMax = sirR0*5;
    // yMax = sirR0*3;
    yMax = R0_slider.max  * 2.5;    
    yMax = R0_slider.max  * 3;    
    yMax = 16;
    // yMax = 100;
  }
  xTicksDiff = xMax/ax_NumTicks_X;
  yTicksDiff = yMax/ax_NumTicks_Y;
}

// Read, set and update everything on first run-through
mainFunc();
