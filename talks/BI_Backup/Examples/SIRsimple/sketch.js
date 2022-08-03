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

// let showRed = check_red.checked;
// let showGreen = check_gre.checked;
// let showConf = check_conf.checked;

let showRed = true;
let showGreen = false;
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

// redu_slider.onchange = function(){
//   // Run main function 
//   mainFunc();
// }
// redu_dist_slider.onchange = function(){
//   // Run main function 
//   mainFunc();
// }


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


// check_red.onchange = function(){
//   showRed = check_red.checked;
//   // Run main function 
//   mainFunc();
// }


// check_gre.onchange = function(){
//   showGreen = check_gre.checked;
//   // Run main function 
//   mainFunc();
// }


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
  // sirRedu = parseFloat(redu_slider.value);
  // sirReduDist = parseFloat(redu_dist_slider.value);

  sirTInfMax = sirTInf + sirTInfDist;
  sirTInfMin = sirTInf - sirTInfDist;
  if (sirTInfMin < 0){
    sirTInfMin = 0;
  }
}

// --- Set labels beneath inputs --
let setLabels = function(){
  R0_label.innerHTML  = 'Reproduction-number, R0: '+sirR0;
  tInf_label.innerHTML  = 'Infectious period: '+sirTInf + ' days';
  // redu_label.innerHTML  = 'Effekt af nedlukning: '+parseInt(100*sirRedu)+'%';
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


var maxT = 50;

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
  timeScale = 0.5;
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

  for (let t = 0; t < maxT; t = t + dt) {

    // Euler integration
    dS = - beta * ((curS * curI) / curN);
    dI = beta * ((curS * curI) / curN) - gamma * curI;
    dR = gamma * curI;
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
let allH = 300;
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
  sketch.strokeWeight(4)

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
          let s = meanS[k];
          let i = meanI[k];
          let r = meanR[k];
          let s2 = meanS[k+1];
          let i2 = meanI[k+1];
          let r2 = meanR[k+1];

          if (showRed){
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
          }
          
          if (showGreen){
            s = meanS_redu[k];
            i = meanI_redu[k];
            r = meanR_redu[k];
            s2 = meanS_redu[k+1];
            i2 = meanI_redu[k+1];
            r2 = meanR_redu[k+1];

            y = valueToScreenY(s);
            y2 = valueToScreenY(s2);
            sketch.stroke(clrS_redu)
            sketch.line(x,y,x2,y2);
            
            y = valueToScreenY(i);
            y2 = valueToScreenY(i2);
            sketch.stroke(clrI_redu)
            sketch.line(x,y,x2,y2);
            
            y = valueToScreenY(r);
            y2 = valueToScreenY(r2);
            sketch.stroke(clrR_redu)
            sketch.line(x,y,x2,y2);

          }

        } else if (showNewInf) {
          
          
          let ni = meanNewInfs[k];
          // const i = meanNewInfsCumu[k];
          let ni2 = meanNewInfs[k+1];
          // const i2 = meanNewInfsCumu[k+1];

          if (showRed){
            y = valueToScreenY(ni);
            y2 = valueToScreenY(ni2);
            sketch.stroke(clrNewInf_li)
            sketch.line(x,y,x2,y2);
          }
          
          // y = valueToScreenY(i);
          // y2 = valueToScreenY(i2);
          // sketch.stroke(clrI_li)
          // sketch.line(x,y,x2,y2);

          if (showGreen){
            ni = meanNewInfs_redu[k];
            ni2 = meanNewInfs_redu[k+1];

            y = valueToScreenY(ni);
            y2 = valueToScreenY(ni2);
            sketch.stroke(clrNewInf_li_redu)
            sketch.line(x,y,x2,y2);
          }
          
          
        }
      }

    // Uncomment for dashed lines:
      // showThis = false;
    // } else {
    //   showThis = true;
    }
    
    
  }
}

let drawConfidenceIntervals = (sketch) => {

  for (let k = 0; k < dataT.length - 1; k++) {
    const t = dataT[k];
    const t2 = dataT[k+1];

    let x = valueToScreenX(t);
    let x2 = valueToScreenX(t2);

    sketch.strokeWeight(2);

    let y;
    let y2;

    if (x < (ax_W+axMargin)){
      if (showAllVar){
        let s_lower;
        let i_lower;
        let r_lower;
        let s2_lower;
        let i2_lower;
        let r2_lower;
        let s_upper;
        let i_upper;
        let r_upper;
        let s2_upper;
        let i2_upper;
        let r2_upper;

        if (showRed){
          
          s_lower = meanS_lower[k];
          s2_lower = meanS_lower[k+1];
          s_upper = meanS_upper[k];
          s2_upper = meanS_upper[k+1];

          y_lower = valueToScreenY(s_lower);
          y2_lower = valueToScreenY(s2_lower);
          y_upper = valueToScreenY(s_upper);
          y2_upper = valueToScreenY(s2_upper);
          // sketch.stroke(clrConf_S)
          // sketch.fill(clrConf_S)
          sketch.strokeWeight(0);
          sketch.fill(clrS_li[0],clrS_li[1],clrS_li[2],50)
          sketch.beginShape();
          sketch.vertex(x,y_lower);
          sketch.vertex(x2,y2_lower);
          sketch.vertex(x2,y2_upper);
          sketch.vertex(x,y_upper);
          sketch.endShape(sketch.CLOSE);
          
          
          i_lower = meanI_lower[k];
          i2_lower = meanI_lower[k+1];
          i_upper = meanI_upper[k];
          i2_upper = meanI_upper[k+1];

          y_lower = valueToScreenY(i_lower);
          y2_lower = valueToScreenY(i2_lower);
          y_upper = valueToScreenY(i_upper);
          y2_upper = valueToScreenY(i2_upper);
          // sketch.stroke(clrConf)
          // sketch.fill(clrConf)
          sketch.strokeWeight(0);
          sketch.fill(clrI_li[0],clrI_li[1],clrI_li[2],50)
          sketch.beginShape();
          sketch.vertex(x,y_lower);
          sketch.vertex(x2,y2_lower);
          sketch.vertex(x2,y2_upper);
          sketch.vertex(x,y_upper);
          sketch.endShape(sketch.CLOSE);
          
          
          r_lower = meanR_lower[k];
          r2_lower = meanR_lower[k+1];
          r_upper = meanR_upper[k];
          r2_upper = meanR_upper[k+1];

          y_lower = valueToScreenY(r_lower);
          y2_lower = valueToScreenY(r2_lower);
          y_upper = valueToScreenY(r_upper);
          y2_upper = valueToScreenY(r2_upper);
          // sketch.stroke(clrConf)
          // sketch.fill(clrConf)
          sketch.strokeWeight(0);
          sketch.fill(clrR_li[0],clrR_li[1],clrR_li[2],50)
          sketch.beginShape();
          sketch.vertex(x,y_lower);
          sketch.vertex(x2,y2_lower);
          sketch.vertex(x2,y2_upper);
          sketch.vertex(x,y_upper);
          sketch.endShape(sketch.CLOSE);
          
        }
        
        if (showGreen){
          
          
          s_lower = meanS_redu_lower[k];
          s2_lower = meanS_redu_lower[k+1];
          s_upper = meanS_redu_upper[k];
          s2_upper = meanS_redu_upper[k+1];

          y_lower = valueToScreenY(s_lower);
          y2_lower = valueToScreenY(s2_lower);
          y_upper = valueToScreenY(s_upper);
          y2_upper = valueToScreenY(s2_upper);
          // sketch.stroke(clrConf)
          // sketch.fill(clrConf)
          sketch.strokeWeight(0);
          sketch.fill(clrS_redu[0],clrS_redu[1],clrS_redu[2],50)
          sketch.beginShape();
          sketch.vertex(x,y_lower);
          sketch.vertex(x2,y2_lower);
          sketch.vertex(x2,y2_upper);
          sketch.vertex(x,y_upper);
          sketch.endShape(sketch.CLOSE);
          
          
          i_lower = meanI_redu_lower[k];
          i2_lower = meanI_redu_lower[k+1];
          i_upper = meanI_redu_upper[k];
          i2_upper = meanI_redu_upper[k+1];

          y_lower = valueToScreenY(i_lower);
          y2_lower = valueToScreenY(i2_lower);
          y_upper = valueToScreenY(i_upper);
          y2_upper = valueToScreenY(i2_upper);
          // sketch.stroke(clrConf)
          // sketch.fill(clrConf)
          sketch.strokeWeight(0);
          sketch.fill(clrI_redu[0],clrI_redu[1],clrI_redu[2],50)
          sketch.beginShape();
          sketch.vertex(x,y_lower);
          sketch.vertex(x2,y2_lower);
          sketch.vertex(x2,y2_upper);
          sketch.vertex(x,y_upper);
          sketch.endShape(sketch.CLOSE);
          
          
          r_lower = meanR_redu_lower[k];
          r2_lower = meanR_redu_lower[k+1];
          r_upper = meanR_redu_upper[k];
          r2_upper = meanR_redu_upper[k+1];

          y_lower = valueToScreenY(r_lower);
          y2_lower = valueToScreenY(r2_lower);
          y_upper = valueToScreenY(r_upper);
          y2_upper = valueToScreenY(r2_upper);
          // sketch.stroke(clrConf)
          // sketch.fill(clrConf)
          sketch.strokeWeight(0);
          sketch.fill(clrR_redu[0],clrR_redu[1],clrR_redu[2],50)
          sketch.beginShape();
          sketch.vertex(x,y_lower);
          sketch.vertex(x2,y2_lower);
          sketch.vertex(x2,y2_upper);
          sketch.vertex(x,y_upper);
          sketch.endShape(sketch.CLOSE);
        
        }

      } else if (showNewInf) {
        
        let ni;
        let ni2;

        if (showRed){
          ni_lower = meanNewInfs_lower[k];
          ni2_lower = meanNewInfs_lower[k+1];
          ni_upper = meanNewInfs_upper[k];
          ni2_upper = meanNewInfs_upper[k+1];


          y_lower = valueToScreenY(ni_lower);
          y2_lower = valueToScreenY(ni2_lower);
          y_upper = valueToScreenY(ni_upper);
          y2_upper = valueToScreenY(ni2_upper);
          // sketch.stroke(clrConf_NewInf)
          // sketch.fill(clrConf_NewInf)
          sketch.strokeWeight(0);
          sketch.fill(clrNewInf_li[0],clrNewInf_li[1],clrNewInf_li[2],100)
          // sketch.fill(clrConf_NewInf[0],clrConf_NewInf[1],clrConf_NewInf[2],150)
          sketch.beginShape();
          sketch.vertex(x,y_lower);
          sketch.vertex(x2,y2_lower);
          sketch.vertex(x2,y2_upper);
          sketch.vertex(x,y_upper);
          sketch.endShape(sketch.CLOSE);

          // // For multiple colors at the same time
          // ni_lower = meanNewInfs_lower2[k];
          // ni2_lower = meanNewInfs_lower2[k+1];
          // ni_upper = meanNewInfs_upper2[k];
          // ni2_upper = meanNewInfs_upper2[k+1];


          // y_lower = valueToScreenY(ni_lower);
          // y2_lower = valueToScreenY(ni2_lower);
          // y_upper = valueToScreenY(ni_upper);
          // y2_upper = valueToScreenY(ni2_upper);
          // sketch.stroke(clrConf_NewInf)
          // sketch.fill(clrConf_NewInf)
          // sketch.strokeWeight(0);
          // sketch.fill(clrConf_NewInf[0],clrConf_NewInf[1],clrConf_NewInf[2],150)
          // sketch.beginShape();
          // sketch.vertex(x,y_lower);
          // sketch.vertex(x2,y2_lower);
          // sketch.vertex(x2,y2_upper);
          // sketch.vertex(x,y_upper);
          // sketch.endShape(sketch.CLOSE);

        }
        

        if (showGreen){
          ni_lower = meanNewInfs_redu_lower[k];
          ni2_lower = meanNewInfs_redu_lower[k+1];
          ni_upper = meanNewInfs_redu_upper[k];
          ni2_upper = meanNewInfs_redu_upper[k+1];


          y_lower = valueToScreenY(ni_lower);
          y2_lower = valueToScreenY(ni2_lower);
          y_upper = valueToScreenY(ni_upper);
          y2_upper = valueToScreenY(ni2_upper);
          // sketch.stroke(clrConf_NewInf_redu)
          // sketch.fill(clrConf_NewInf_redu)
          // sketch.stroke(clrConf_NewInf_redu[0],clrConf_NewInf_redu[1],clrConf_NewInf_redu[2],150)
          // sketch.noStroke();
          sketch.strokeWeight(0);
          sketch.fill(clrNewInf_li_redu[0],clrNewInf_li_redu[1],clrNewInf_li_redu[2],100)
          // sketch.fill(clrConf_NewInf_redu[0],clrConf_NewInf_redu[1],clrConf_NewInf_redu[2],150)
          sketch.beginShape();
          sketch.vertex(x,y_lower);
          sketch.vertex(x2,y2_lower);
          sketch.vertex(x2,y2_upper);
          sketch.vertex(x,y_upper);
          sketch.endShape(sketch.CLOSE);

          // ni = meanNewInfs_redu[k];
          // ni2 = meanNewInfs_redu[k+1];

          // y = valueToScreenY(ni);
          // y2 = valueToScreenY(ni2);
          // sketch.stroke(clrNewInf_li_redu)
          // sketch.line(x,y,x2,y2);
        }
      }
    }
  }
}


// let ax_W_small = smallW*0.8;
// let ax_H_small = -smallH*0.7;
// let ax_0_Y_small = smallH*0.85;

let drawParameterAxes = (sketch) => {
  sketch.fill(clrAxes);
  sketch.stroke(clrAxes);
  sketch.strokeWeight(2);  

  let arrowSize = 5;

  sketch.push()
  // Draw left axes
  // sketch.translate(ax_0_X,ax_0_Y_small);
  // sketch.line(0,0,ax_W_small,0);
  // sketch.translate(backgroundMargin,ax_0_Y_small);
  // sketch.line(ax_0_X-backgroundMargin,0,smallW-backgroundMargin*2,0);
  sketch.translate(backgroundMargin,ax_0_Y_small);
  sketch.line(ax_0_X_small-axMarginDist,0,smallW-backgroundMargin*2,0); ///////////////////////////////////////////
  
  // sketch.line(0,0,smallW-backgroundMargin*2,0);
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
      this.redu = sirRedu;
    } else if (this.type == 'random'){
      this.r0 = getRandomR0(); 
      this.tInf = getRandomTInf();
      this.redu = getRandomRedu();
    }
    // If the array of all values is filled, remove one values
    if (toShowR0.length > maxRandoms){
      toShowR0.splice(0,1);
      toShowTInf.splice(0,1);
      toShowRedu.splice(0,1);
    }
    // Add to arrays of all values
    toShowR0.push(this.r0);
    toShowTInf.push(this.tInf);
    toShowRedu.push(this.redu);
  }


  calcPath(){

    this.getPars();

    // let [Ts,Ss,Is,Rs,newInfs,newInfsCumu] = calcSIRvalues(this.r0,this.tInf)

    // this.ts = Ts;
    // this.Ss = Ss;
    // this.Is = Is;
    // this.Rs = Rs;
    // this.newInfs = newInfs;
    // this.newInfsCumu = newInfsCumu;
    
    let [Ts,Ss,Is,Rs,newInfs,newInfsCumu,Ss_redu,Is_redu,Rs_redu,newInfs_redu,newInfsCumu_redu] = calcSIRvalues(this.r0,this.tInf,this.redu)

    this.ts = Ts;
    this.Ss = Ss;
    this.Is = Is;
    this.Rs = Rs;
    this.newInfs = newInfs;
    this.newInfsCumu = newInfsCumu;
    this.Ss_redu = Ss_redu;
    this.Is_redu = Is_redu;
    this.Rs_redu = Rs_redu;
    this.newInfs_redu = newInfs_redu;
    this.newInfsCumu_redu = newInfsCumu_redu;

  }

  reset(){
    this.calcPath();  

    
    // this.aniID = Math.floor(Math.random()*(this.maxT/this.dt));
    // this.aniID = Math.floor(Math.random()*this.ts.length);
  }

  // showFullPath(sketch){
  //   for (let k = 1; k < this.ts.length; k++) {
  //     const t = this.ts[k];
  //     const t2 = this.ts[k-1];

  //     let x;
  //     let x2;
  //     let y;
  //     let y2;

  //     x = valueToScreenX(t);
  //     x2 = valueToScreenX(t2);

  //     const S = this.Ss[k];
  //     const I = this.Is[k];
  //     const R = this.Rs[k];
  //     const S2 = this.Ss[k-1];
  //     const I2 = this.Is[k-1];
  //     const R2 = this.Rs[k-1];

  //     sketch.strokeWeight(0.5);
  //     const curAlpha = 40;
  //     // sketch.stroke(this.clr[0],this.clr[1],this.clr[2],curAlpha);

  //     if (x < (ax_W+axMargin)){
  //       // [x,y] = coorToScreenCoor(t,S);
  //       y = valueToScreenY(S);
  //       if (y > backgroundMargin){
  //         // [x2,y2] = coorToScreenCoor(t2,S2);
  //         y2 = valueToScreenY(S2);
  //         sketch.stroke(clrS_li[0],clrS_li[1],clrS_li[2],curAlpha);
  //         sketch.line(x,y,x2,y2);
  //       }

  //       // [x,y] = coorToScreenCoor(t,I);
  //       y = valueToScreenY(I);
  //       if (y > backgroundMargin){
  //         // [x2,y2] = coorToScreenCoor(t2,I2);
  //         y2 = valueToScreenY(I2);
  //         sketch.stroke(clrI_li[0],clrI_li[1],clrI_li[2],curAlpha);
  //         sketch.line(x,y,x2,y2);
  //       }
        
  //       // [x,y] = coorToScreenCoor(t,R);
  //       y = valueToScreenY(R);
  //       if (y > backgroundMargin){
  //         // [x2,y2] = coorToScreenCoor(t2,R2);
  //         y2 = valueToScreenY(R2);
  //         sketch.stroke(clrR_li[0],clrR_li[1],clrR_li[2],curAlpha);
  //         sketch.line(x,y,x2,y2);
  //       }
  //     }

  //   }
  // }

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
        const curAlpha = 100*(stepsToShow - k)/stepsToShow;

        
        if (x < (ax_W+axMargin)){
          if (showAllVar) {
            let S = this.Ss[this.aniID - k];
            let I = this.Is[this.aniID - k];
            let R = this.Rs[this.aniID - k];
            let S2 = this.Ss[this.aniID - k - 1];
            let I2 = this.Is[this.aniID - k - 1];
            let R2 = this.Rs[this.aniID - k - 1];
            
            if (showRed){
            y = valueToScreenY(S);
              y2 = valueToScreenY(S2);
              sketch.stroke(clrS_li[0],clrS_li[1],clrS_li[2],curAlpha);
              sketch.line(x,y,x2,y2);

            y = valueToScreenY(I);
              y2 = valueToScreenY(I2);
              sketch.stroke(clrI_li[0],clrI_li[1],clrI_li[2],curAlpha);
              sketch.line(x,y,x2,y2);

            y = valueToScreenY(R);
              y2 = valueToScreenY(R2);
              sketch.stroke(clrR_li[0],clrR_li[1],clrR_li[2],curAlpha);
              sketch.line(x,y,x2,y2);

            }
            
            if (showGreen){
              S = this.Ss_redu[this.aniID - k];
              I = this.Is_redu[this.aniID - k];
              R = this.Rs_redu[this.aniID - k];
              S2 = this.Ss_redu[this.aniID - k - 1];
              I2 = this.Is_redu[this.aniID - k - 1];
              R2 = this.Rs_redu[this.aniID - k - 1];

              y = valueToScreenY(S);
              y2 = valueToScreenY(S2);
              sketch.stroke(clrS_redu[0],clrS_redu[1],clrS_redu[2],curAlpha);
              sketch.line(x,y,x2,y2);

            y = valueToScreenY(I);
              y2 = valueToScreenY(I2);
              sketch.stroke(clrI_redu[0],clrI_redu[1],clrI_redu[2],curAlpha);
              sketch.line(x,y,x2,y2);

            y = valueToScreenY(R);
              y2 = valueToScreenY(R2);
              sketch.stroke(clrR_redu[0],clrR_redu[1],clrR_redu[2],curAlpha);
              sketch.line(x,y,x2,y2);

            }

          } else if (showNewInf){
            // For showing new infections instead
            let ni;
            let ni2;
            
            if (showRed){
              ni = this.newInfs[this.aniID - k];
              ni2 = this.newInfs[this.aniID - k - 1];
              y = valueToScreenY(ni);
              y2 = valueToScreenY(ni2);
              sketch.stroke(clrNewInf_li[0],clrNewInf_li[1],clrNewInf_li[2],curAlpha);
              sketch.line(x,y,x2,y2);
            }
            if (showGreen){
              ni = this.newInfs_redu[this.aniID - k];
              ni2 = this.newInfs_redu[this.aniID - k - 1];
              y = valueToScreenY(ni);
              y2 = valueToScreenY(ni2);
              sketch.stroke(clrNewInf_redu[0],clrNewInf_redu[1],clrNewInf_redu[2],curAlpha);
              sketch.line(x,y,x2,y2);

            }

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
        let S;
        let I;
        let R;

        if (showRed){
          S = this.Ss[this.aniID];
          I = this.Is[this.aniID];
          R = this.Rs[this.aniID];
          y = valueToScreenY(S);
          sketch.stroke(clrS_li);
            sketch.point(x,y)

          y = valueToScreenY(I);
            sketch.stroke(clrI_li);
            sketch.point(x,y)

          y = valueToScreenY(R);
            sketch.stroke(clrR_li);
            sketch.point(x,y)
        }
        if (showGreen){
          S = this.Ss_redu[this.aniID];
          I = this.Is_redu[this.aniID];
          R = this.Rs_redu[this.aniID];
          y = valueToScreenY(S);
            sketch.stroke(clrS_redu);
            sketch.point(x,y)

          y = valueToScreenY(I);
            sketch.stroke(clrI_redu);
            sketch.point(x,y)

          y = valueToScreenY(R);
            sketch.stroke(clrR_redu);
            sketch.point(x,y)

        }

      } else if (showNewInf){
        let ni;
        
        if (showRed){
          ni = this.newInfs[this.aniID];
          y = valueToScreenY(ni);
          sketch.stroke(clrNewInf_li);
          sketch.point(x,y)
        }
        if (showGreen){
          ni = this.newInfs_redu[this.aniID];
          y = valueToScreenY(ni);
          sketch.stroke(clrNewInf_redu);
          sketch.point(x,y)
        }

      }
    } else {
      this.reset();
      this.aniID = 0;
    }

    // Move one point forward
    this.aniID = this.aniID+1;


    // if (x > ax_W ){
    // // if (x > (ax_W*1.1) ){
    //   this.reset();
    //   this.aniID = 0;
    // }


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
  let numAniPoints = maxAniPoints;
  // let numAniPoints = 0;
  // let numAniPoints = 1;
  let allAniPoints = [];
  let allAniPoints_redu = [];
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
    // sketch.background(255);
    sketch.background(clrBackground);
    drawBackground(sketch)
    
    drawAxes(sketch);
    if (showConf){
      drawConfidenceIntervals(sketch);
    }
    drawData(sketch);

    numAniPoints = maxAniPoints;

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




// ---- Sketch Distributions, R0 ----
const sketchDist = ( sketch ) => {
  
  let parMu;
  let parSi;
  // let drawRandom = true;
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
    
    // sketch.background(255);
    sketch.background(clrBackground);
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

  // let drawRandom = true;
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
    // sketch.background(255);
    sketch.background(clrBackground);
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



// ---- Sketch Distribution, mitigation ----
const sketchDist3 = ( sketch ) => {

  // let drawRandom = true;
  let randomsToShowX = [];
  let randomsToShowY = [];


  sketch.addRandom = (thisT) => {
    // let curMaxT = parseFloat(redu_slider.max); 
    let curMaxT = 0.75; 
    
    // Uniform distribution
    // let thisV = 1; 

    // Gaussian distribution 
    let parMu = sirRedu;
    let parSi = sirReduDist;
    let thisV =  Math.exp(-0.5 * Math.pow((thisT-parMu)/parSi,2)) 

    let [curX,curY] = coorToScreenCoorDist(thisT,thisV,curMaxT,1); 

    randomsToShowX.push(curX);
    randomsToShowY.push(curY);
  }

  sketch.getRandom = ()  => {
    // let thisT = getRandomTInf();   
    let thisT = getRandomRedu();
    sketch.addRandom(thisT);
  }

  sketch.drawAllRandom = () => {
    
    // let curMaxT = parseFloat(redu_slider.max); 
    let curMaxT = 0.75;
    let [botX,botY] = coorToScreenCoorDist(0,0,curMaxT,1);
    // let botY = valueToScreenYDist(0,1);
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
    
    // sketch.background(255);
    sketch.background(clrBackground);
    drawBackground(sketch);
    drawParameterAxes(sketch);

    // - For getting and drawing random examples
    if (drawRandom){
      // Every 5 frames,
      if ((sketch.frameCount % 5) == 0){ 
        // Reset what is being drawn
        sketch.resetRandoms();
        // And add everything again
        for (let k = toShowRedu.length; k > (toShowRedu.length-maxRandoms); k--) {
          const curT = toShowRedu[k];        
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
    parMu = sirRedu;
    parSi = sirReduDist;

    // let curMaxT = parseFloat(redu_slider.max); 
    let curMaxT = 0.75;
    // let curMaxT = parseFloat(redu_slider.max*1.05); 

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

    let curPrec = 4;
    // let firstTicks = Math.round(curPrec*(parMu-parSi*2))/curPrec;
    // let lastTicks  = Math.round(curPrec*(parMu+parSi*2))/curPrec;
    let firstTicks = 0;
    // let lastTicks  = 0.5;
    // let lastTicks = redu_slider.max;
    let lastTicks = 0.75;
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
      sketch.text((100*kRound)+'%',x,y);
      
    }
  }
}


// --------------------------------
// ---- Final things ----
// --------------------------------

let mainP5 = new p5(sketchSir,document.getElementById('p5Div'));
let distP5 = new p5(sketchDist,document.getElementById('p5DivDist'));
let dist2P5 = new p5(sketchDist2,document.getElementById('p5DivDist2'));
// let dist3P5 = new p5(sketchDist3,document.getElementById('p5DivDist3'));


let resetAllRandoms = function(){
  toShowR0 = [];
  toShowTInf = [];
  toShowRedu = [];
}

let mainFunc = function(){
  readAndSet();
  calcData();
  if (showConf) {
    calcConfIntervals();
  }
  resetAllRandoms();
  mainP5.resetAnimations();
  distP5.resetRandoms();
  dist2P5.resetRandoms();
  // dist3P5.resetRandoms();
  if (showAllVar){
    yMax = 100;
  } else if (showNewInf){
    // yMax = sirR0*5;
    // yMax = sirR0*3;
    yMax = R0_slider.max  * 2.5;    
  }
  xTicksDiff = xMax/ax_NumTicks_X;
  yTicksDiff = yMax/ax_NumTicks_Y;
}

// Read, set and update everything on first run-through
mainFunc();
