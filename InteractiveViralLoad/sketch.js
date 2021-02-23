let axLeft;
let axTop;
let axWidth;
let axHeight;
let axMargin = 50;
let axSize = 4;
 
let pLeft;
let pRight;
let pBot;
let pTop;

let HighSensThres = 3;
let LowSensThres = 5;
let InfectThres = 6;

let HighPoints = [];
let LowPoints  = [];

let LowInterval = 3;
let HighInterval = 7;

let LowOffset = 0;
let HighOffset = 0;

let lastDetectableLow;
let lastDetectableHigh;
let firstDetectableLow;
let firstDetectableHigh;

let timeArray = [];
let plotTimeArray = [];
let viralLoadArray = [];

let curX;
let curY;

let dayEnd = 30;
let timeScale = 10; // Ten points per day
let yMax  = 12;

let testRadius = 10;
let testRadiusLarge = 15;

let isolationPeriod = 14;

let InfectionInit = 0;

let timeDelay = 1;

let countSmitte;
let countSmitteInit;
let countSmitteEnd;
let countReduLow;
let countReduHighLate;



let showSettings = false;
let showInfectiousPeriod = true;
let showIsolationSelf = false;
let showIsolationLow = true;
let showIsolationHigh = false;
let showIsolationHighLate = true;
let showPeriodsOnPlot = false;

let isoBarHeight;
let isoBarTop;
let isoBarMid;
let textIsoBarFontSize = 20;
let IsoBarSmallMargin = 5;

// Define color-names
let clrBackground;
let clrLines;
let clrInfectiousLgt;
let clrInfectiousDrk;
let clrLowSensLgt;
let clrLowSensDrk;
let clrHighSensLgt;
let clrHighSensDrk;
let clrSelfIso;
let clrInfection;
let clrInfectiousTrans;
let clrLowSensTrans;
let clrHighSensTrans;
let clrSelfIsoTrans;

// Initialize interactive stuff
let sliderDist;
let sliderWidth = 300; 
let sliderTop;

let sliderInfInit;
let sliderLowInt;
let sliderLowOff;
let sliderHighInt;
let sliderHighOff;

let sliderLowSens;
let sliderHighSens;

let buttonFlagDanish;
let buttonFlagEnglish;
let buttonSettings;

let flagWidth = 80;
let flagDist = 80;
let flagTop;

let checkIsoSymp;
let checkIsoLow;
let checkIsoHigh;
let checkIsoHighLate;

let checkboxX;
let checkboxY;
let checkboxDist;
let checkboxTextX;

let tableX;
let tableY;
let tableDist = 30


let textInfInit = 'textInfInit';
let textLowInt = 'textLowInt';
let textLowOff = 'textLowOff';
let textHighInt = 'textHighInt';
let textHighOff = 'textHighOff';
let textLowSens = 'textLowSens';
let textHighSens = 'textHighSens';

let textTableSmitte = 'textTableSmitte';
let textTableLow = 'textTableLow';
let textTableHigh = 'textTableHigh';


let textIsoBarInf;
let textIsoBarSymp;
let textIsoBarLow;
let textIsoBarHigh;
// textIsoBarInf  = 'Smitsom';
// textIsoBarSymp = 'Symptomstart \nSelv-isolation';
// textIsoBarLow  = 'Positiv test \nIsolation';
// textIsoBarHigh = 'Positiv test \nIsolation';

let textXAxis;
let textYAxis;
// textXAxis = 'Tid [dage]';
// textYAxis = 'Log10 Viral load';

let textIsoSymp;
let textIsoLow;
let textIsoHigh;
let textIsoHighLate;
let textTestInterval;
let textSens;
// textIsoSymp = 'Symptomer';
// textIsoLow =  'Antigen-test';
// textIsoHigh = 'PCR-test';
// textIsoHighLate = 'PCR-test, forsinket svar';
// textTestInterval = 'Testinterval:';
// textSens = 'Sensitivitet:';

let textInfInitPre;
let textLowIntPre;
let textHighIntPre;
let textLowSensPre;
let textHighSensPre;
let textDaySin;
let textDayPlu;
let textCheckBox;
let textTableBest;
// textInfInitPre = 'Infektionstart: Dag ';
// textLowIntPre = 'Antigen-test: \nHver ';
// textHighIntPre = 'PCR-test: \nHver ';
// textLowSensPre = 'Antigen-test: 10^';
// textHighSensPre = 'PCR-test: 10^';
// textDaySin = ' dag'
// textDayPlu = ' dage'
// textCheckBox = 'Vis periode for isolation:';

// let textIsoSymp = 'Vis periode for isolation, symptomer';
// let textIsoLow =  'Vis periode for isolation, lavsensitivitetstest';
// let textIsoHigh = 'Vis periode for isolation, højsensitivitetstest';
// let textIsoLow =  'Lavsensitivitetstest';
// let textIsoHigh = 'Højsensitivitetstest';


function setLanguageEnglish(){
  textIsoBarInf = 'Infectious'
  // textIsoBarSymp = 'Symptom onset \nSelf-isolation';
  textIsoBarSymp = '';
  textIsoBarLow  = '+';
  textIsoBarHigh = '+';
  // textIsoBarHighLate = 'Positiv test \nIsolation \n(1 day later)';
  textIsoBarHighLate = '+';
  
  
  textXAxis = 'Time [days]';
  textYAxis = 'Log10 Viral load';

  textIsoSymp = 'Symptoms';
  textIsoLow =  'Antigen-test';
  textIsoHigh = 'PCR-test';
  textIsoHigh = 'PCR-test, immediate result';
  textIsoHighLate = 'PCR-test, delayed result'

  textTestInterval = 'Test interval:';
  textSens = 'Sensitivity:';
  
  textInfInitPre = 'Infection: Day ';
  // textLowIntPre = 'Antigen-test: \nEvery ';
  // textHighIntPre = 'PCR-test: \nEvery ';
  textLowIntPre = 'Antigen-test: Every ';
  textHighIntPre = 'PCR-test: Every ';
  textLowSensPre = 'Antigen-test sensitivity: 10^';
  textHighSensPre = 'PCR-test sensitivity: 10^';
  textDaySin = 'day'
  textDayPlu = 'days'
  textCheckBox = 'Show isolation-period:';

  textTableSmitte = 'Infectious days';
  textTableLow = 'With antigen-test: ';
  textTableHigh = 'With PCR-test: ';
  textTableBest = 'Best reduction: ';
  
}

function setLanguageDanish(){
  textIsoBarInf  = 'Smitsom';
  // textIsoBarSymp = 'Symptomstart \nSelv-isolation';
  textIsoBarSymp = '';
  textIsoBarLow  = '+';
  textIsoBarHigh = '+';
  // textIsoBarHighLate = 'Positiv test \nIsolation \n(1 dag senere)';
  textIsoBarHighLate = '+';
  
  textXAxis = 'Tid [dage]';
  textYAxis = 'Log10 Viral load';

  textIsoSymp = 'Symptomer';
  textIsoLow =  'Antigen-test';
  textIsoHigh = 'PCR-test, øjeblikkeligt svar';
  textIsoHighLate = 'PCR-test, forsinket svar'

  textTestInterval = 'Testinterval:';
  textSens = 'Sensitivitet:';
  
  textInfInitPre = 'Infektionstart: Dag ';
  // textLowIntPre = 'Antigen-test: \nHver ';
  // textHighIntPre = 'PCR-test: \nHver ';
  textLowIntPre = 'Antigen-test: Hver ';
  textHighIntPre = 'PCR-test: Hver ';
  textLowSensPre = 'Antigen-test sensitivitet: 10^';
  textHighSensPre = 'PCR-test sensitivitet: 10^';
  textDaySin = 'dag'
  textDayPlu = 'dage'
  textCheckBox = 'Vis periode for isolation:';
  
  textTableSmitte = 'Smitsomme dage';
  textTableLow = 'Med antigen-test: ';
  textTableHigh = 'Med PCR-test: ';
  textTableBest = 'Bedste reduktion: ';
}


function calcTestPoint(){
  let dayEnd = 30;
  
  HighPoints = [];
  LowPoints  = [];
  
  for (let k = 0; k < dayEnd; k++) {
    if ((k % LowInterval) == 0){
      LowPoints.push(k)
    }
    if ((k % HighInterval) == 0){
      HighPoints.push(k)
    }
  }
}

function calcViralLoad(){
  // The curve by Mina, Larremore et al, is recreated with:
  // a logistic curve first 5 days, bi-exponential decay after
  let daySwitch = 5;
  let tIniPhase = [...Array(daySwitch*timeScale).keys()]
  let dayEnd = 30;
  let tPostPhase = [...Array((dayEnd-daySwitch)*timeScale).keys()]


  let maxViral = 10;
  // let growthRate = 0.2;
  let growthRate = 1.9/timeScale;
  let v0 = 0.05;
  let finalViral;
  for (let k = 0; k < tIniPhase.length; k++) {
    const curT = tIniPhase[k];
    timeArray.push(curT);
    let newViral = maxViral/(1+((maxViral-v0)/v0)*Math.exp(-growthRate*curT));
    viralLoadArray.push(newViral);
    finalViral = newViral;
  }
  
  // let decayRate1 = 0.03;
  // let decayRate2 = 0.06;
  // let decayRate1 = 0.295/timeScale;
  // let decayRate2 = 0.6/timeScale;
  let decayRate1 = 0.245/timeScale;
  let decayRate2 = 0.5/timeScale;
  let factor1 = 2;
  let factor2 = factor1-1;

  for (let k = 0; k < tPostPhase.length; k++) {
    const curT = tPostPhase[k];
    timeArray.push(curT+(daySwitch*timeScale));
    let newViral = finalViral*(factor1*Math.exp(-decayRate1*curT) - factor2*Math.exp(-decayRate2*curT));
    viralLoadArray.push(newViral);
  }

}
function coorToScreenCoor(t,v){
  // Translates a time and a viral load to the point on the screen where it should be shown
  let xZero = 0;
  let xMax  = 30 * timeScale;
  let yZero = 0;
  // let yMax  = 12;

  let x = lerp(pLeft,pRight,t/xMax);
  let y = lerp(pBot,pTop,v/yMax)

  return [x,y]
}

function toggleSettings(){
  if (showSettings){
    showSettings = false;
  } else {
    showSettings = true;
  }
}

function setup() {
  // createCanvas(800, 400);
  let roomForSliders = 600;
  createCanvas(1200, 500 + roomForSliders);

  // Set position of axes  
  axTop = axMargin;
  axLeft = axMargin;
  axWidth = width - 2*axMargin ;
  axHeight = height - 2*axMargin -roomForSliders;

  pLeft = axLeft;
  pRight= axLeft + axWidth;
  pBot  = axTop + axHeight;
  pTop  = axTop;
  

  // Define colors
  clrBackground = color(230);
  clrLines      = color(0);
  clrInfectiousLgt = color(255,150,150);
  clrInfectiousDrk = color(255,0,0);
  clrLowSensLgt    = color(180,180,255);
  clrLowSensDrk    = color(120,120,255);
  clrHighSensLgt   = color(255,255,155);
  clrHighSensDrk   = color(155,155,0);
  clrSelfIsoLgt    = color(155);
  clrSelfIsoDrk    = color(155);
  clrInfection = color(0,190,0);

  let allTransAlpha = 50;
  clrInfectiousTrans = color(255,0,0,allTransAlpha);
  clrLowSensTrans    = color(0,0,155,allTransAlpha);
  clrHighSensTrans   = color(155,155,0,allTransAlpha);
  clrSelfIsoTrans    = color(155,2*allTransAlpha);
  // clrInfectiousTrans = clrInfectious;
  // clrLowSensTrans    = clrLowSens;
  // clrHighSensTrans   = clrHighSens;
  // clrSelfIsoTrans    = clrSelfIso;
  // clrInfectiousTrans.setAlpha(allTransAlpha);
  // clrLowSensTrans.setAlpha(allTransAlpha);
  // clrHighSensTrans.setAlpha(allTransAlpha);
  // clrSelfIsoTrans.setAlpha(allTransAlpha);

  // Initialize stuff
  calcViralLoad()
  calcTestPoint();
  calcDetectableAndTimeArray();

  // Create sliders
  sliderDist = axMargin*1.2;
  isoBarHeight = 100;
  isoBarTop = pBot + axMargin;
  isoBarMid = pBot + axMargin + isoBarHeight/2;
  sliderTop = isoBarTop + axMargin + isoBarHeight;

  let sliderLeft = pLeft + axMargin/4;
  
  tableX = pLeft + sliderWidth*2;
  tableY = sliderTop-axMargin/2;

  sliderInfInit = createSlider(0,30,0);
  sliderInfInit.position(sliderLeft, sliderTop);
  sliderInfInit.changed(slidersChanged)
  sliderInfInit.style('width',sliderWidth+'px');
  sliderLowInt = createSlider(1,21,3);
  sliderLowInt.position(sliderLeft, sliderTop+ 1.3*sliderDist);
  sliderLowInt.changed(slidersChanged)
  sliderLowInt.style('width',sliderWidth+'px');
  sliderHighInt = createSlider(1,21,7);
  sliderHighInt.position(sliderLeft, sliderTop+ 2.3*sliderDist);
  sliderHighInt.changed(slidersChanged)
  sliderHighInt.style('width',sliderWidth+'px');
  // sliderLowOff = createSlider(0,10,0);
  // sliderLowOff.position(sliderLeft, sliderTop+ 3*sliderDist);
  // sliderLowOff.changed(slidersChanged)
  // sliderLowOff.style('width',sliderWidth+'px');
  // sliderHighOff = createSlider(0,10,0);
  // sliderHighOff.position(sliderLeft, sliderTop+ 4*sliderDist);
  // sliderHighOff.changed(slidersChanged)
  // sliderHighOff.style('width',sliderWidth+'px');
  sliderLowSens = createSlider(0,10,LowSensThres);
  sliderLowSens.position(sliderLeft, sliderTop+ 3.6*sliderDist);
  sliderLowSens.changed(slidersChanged)
  sliderLowSens.style('width',sliderWidth+'px');
  sliderHighSens = createSlider(0,10,HighSensThres);
  sliderHighSens.position(sliderLeft, sliderTop+ 4.6*sliderDist);
  sliderHighSens.changed(slidersChanged)
  sliderHighSens.style('width',sliderWidth+'px');

  // Create checkboxes
  // checkboxX = pLeft + sliderWidth*1.75; 
  checkboxX = pRight - sliderWidth*1.1; 
  checkboxY = sliderTop;
  checkboxDist = sliderDist/2;
  checkboxTextX = checkboxX + checkboxDist;
  // checkIsoSymp = createCheckbox(textIsoSymp);
  // checkIsoLow = createCheckbox(textIsoLow);
  // checkIsoHigh = createCheckbox(textIsoHigh);

  checkIsoSymp = createCheckbox('',showIsolationSelf); 
  checkIsoSymp.changed(funcIsoSymp);
  checkIsoSymp.position(checkboxX,checkboxY +  checkboxDist);
  checkIsoLow = createCheckbox('',showIsolationLow);
  checkIsoLow.changed(funcIsoLow);
  checkIsoLow.position(checkboxX,checkboxY + 2*checkboxDist);
  checkIsoHigh = createCheckbox('',showIsolationHigh);
  checkIsoHigh.changed(funcIsoHigh);
  checkIsoHigh.position(checkboxX,checkboxY+ 3*checkboxDist);
  checkIsoHighLate = createCheckbox('',showIsolationHighLate);
  checkIsoHighLate.changed(funcIsoHighLate);
  checkIsoHighLate.position(checkboxX,checkboxY+ 4*checkboxDist);

  // Settings button
  flagTop = sliderTop-axMargin/2;
  buttonSettings = createImg('gear.png');
  buttonSettings.position(pRight-flagWidth,flagTop);
  buttonSettings.style('width:'+flagWidth+'px');
  buttonSettings.mousePressed(toggleSettings);

  // Language buttons
  buttonFlagDanish = createImg('DKflag.png');
  buttonFlagDanish.position(pRight-flagWidth,flagTop + flagDist);
  buttonFlagDanish.style('width:'+flagWidth+'px');
  buttonFlagDanish.mousePressed(setLanguageDanish);
  buttonFlagEnglish = createImg('UKflag.png');
  buttonFlagEnglish.position(pRight-flagWidth,flagTop+2*flagDist);
  buttonFlagEnglish.mousePressed(setLanguageEnglish);
  buttonFlagEnglish.style('width:'+flagWidth+'px');


  setLanguageDanish();


} // ------------ End setup ------------ 

function funcIsoSymp(){
  if (this.checked()){
    showIsolationSelf = true;
  } else {
    showIsolationSelf = false;
  }
}
function funcIsoLow(){
  if (this.checked()){
    showIsolationLow = true;
  } else {
    showIsolationLow = false;
  }
}
function funcIsoHigh(){
  if (this.checked()){
    showIsolationHigh = true;
  } else {
    showIsolationHigh = false;
  }
}
function funcIsoHighLate(){
  if (this.checked()){
    showIsolationHighLate = true;
  } else {
    showIsolationHighLate = false;
  }
}
function slidersChanged(){
  // Read values from sliders
  InfectionInit = sliderInfInit.value()*timeScale;
  LowInterval = sliderLowInt.value();
  HighInterval = sliderHighInt.value();
  LowSensThres = sliderLowSens.value();
  HighSensThres = sliderHighSens.value();
  // LowOffset = sliderLowOff.value();
  // HighOffset = sliderHighOff.value();

  // calcViralLoad()
  calcTestPoint()
  calcDetectableAndTimeArray();

}
function calcDetectableAndTimeArray(){

  // Calculate the time array used for plotting
  for (let k = 0; k < timeArray.length; k++) {
    const curT = timeArray[k];
    plotTimeArray[k] = curT + InfectionInit;
  }

  // Calculate the (relative) time-points at which the thresholds are exceeded.
  lastDetectableLow = dayEnd*timeScale;
  firstDetectableLow = dayEnd*timeScale;
  lastDetectableHigh = dayEnd*timeScale;
  firstDetectableHigh = dayEnd*timeScale;

  for (let k = 0; k < viralLoadArray.length; k++) {
    const curV = viralLoadArray[k];
    const curT = timeArray[k];
    // const curT = plotTimeArray[k];

    if (curV > LowSensThres){
      lastDetectableLow = curT;
      if (curT < firstDetectableLow){
        firstDetectableLow = curT;
      }
    }    

    if (curV > HighSensThres){
      lastDetectableHigh = curT;
      if (curT < firstDetectableHigh){
        firstDetectableHigh = curT;
      }
    }    

  }

  lastDetectableLow = lastDetectableLow+InfectionInit;
  firstDetectableLow = firstDetectableLow+InfectionInit;
  lastDetectableHigh = lastDetectableHigh+InfectionInit;
  firstDetectableHigh = firstDetectableHigh+InfectionInit;

  // lastDetectableLow = lastDetectableLow;
  // firstDetectableLow = firstDetectableLow;
  // lastDetectableHigh = lastDetectableHigh;
  // firstDetectableHigh = firstDetectableHigh;

}
function draw() {
  background(255);
  slidersChanged();

  let sliderLabelLeft = pLeft+axMargin/4;

  // Labels for sliders
  textInfInit = textInfInitPre+(InfectionInit/timeScale);
  textLowInt = textLowIntPre+LowInterval;
  textHighInt = textHighIntPre+HighInterval;
  textLowSens = textLowSensPre+LowSensThres;
  textHighSens = textHighSensPre+HighSensThres;
  // textLowOff = 'Første test, lavsensitivitetstest: Dag '+LowOffset;
  // textHighOff = 'Første test, højsensitivitetstest: Dag '+HighOffset;
  // textLowInt = 'Lavsensitivitetstest: \nHver '+LowInterval;
  // textHighInt = 'Højsensitivitetstest: \nHver '+HighInterval;
  // textLowSens = 'Lavsensitivitetstest: 10^'+LowSensThres;
  // textHighSens = 'Højsensitivitetstest: 10^'+HighSensThres;
  // textLowInt = 'Testinterval\nLavsensitivitetstest: '+LowInterval;
  // textHighInt = 'Testinterval\nHøjsensitivitetstest: '+HighInterval;

  if (LowInterval == 1){
    textLowInt = textLowIntPre + textDaySin
  } else {
    textLowInt = textLowInt + ' ' + textDayPlu
  }
  if (HighInterval == 1){
    textHighInt = textHighIntPre + textDaySin
  } else {
    textHighInt = textHighInt + ' ' + textDayPlu
  }
  
  // Additional settings that are initially hidden
  if (showSettings) {
    // Box behind settings
    fill(clrBackground);
    noStroke();
    strokeWeight(2);
    rect(pRight,flagTop,-0.95*axWidth/3,flagDist*3)
    
    // Box behind all sliders
    rect(pLeft,flagTop,sliderWidth+axMargin/2,sliderDist*6)

    // Checkbox text
    fill(0)
    noStroke();
    textAlign(LEFT,TOP);
    textSize(16);
    text(textCheckBox,checkboxX,checkboxY);
    text(textIsoSymp,checkboxTextX,checkboxY+checkboxDist)
    text(textIsoLow,checkboxTextX,checkboxY+2*checkboxDist)
    text(textIsoHigh,checkboxTextX,checkboxY+3*checkboxDist)
    text(textIsoHighLate,checkboxTextX,checkboxY+4*checkboxDist)

    // Checkboxes for isolation period
    checkIsoSymp.show();
    checkIsoLow.show();
    checkIsoHigh.show();
    checkIsoHighLate.show();

    // Sensitivity sliders
    sliderLowSens.show();
    sliderHighSens.show();
    // Sensitivity sliders labels
    // text(textSens,pLeft,sliderTop + 3.5*sliderDist);
    textAlign(LEFT,TOP);
    textSize(16);
    text(textLowSens,sliderLabelLeft,sliderTop + 3.6*sliderDist+sliderDist/2.5);
    text(textHighSens,sliderLabelLeft,sliderTop + 4.6*sliderDist+sliderDist/2.5);
    
    // text(textLowOff,sliderLabelLeft,sliderTop + 3*sliderDist);
    // text(textHighOff,sliderLabelLeft,sliderTop + 4*sliderDist);

    // Flags
    buttonFlagDanish.show();
    buttonFlagEnglish.show();
    
  } else {

    // Box behind top sliders
    fill(clrBackground);
    noStroke();
    strokeWeight(2);
    rect(pLeft,flagTop,sliderWidth+axMargin/2,sliderDist*4)

    // Checkboxes
    checkIsoSymp.hide();
    checkIsoLow.hide();
    checkIsoHigh.hide();
    checkIsoHighLate.hide();

    // Sensitivity sliders
    sliderLowSens.hide();
    sliderHighSens.hide();

    // Flags
    buttonFlagDanish.hide();
    buttonFlagEnglish.hide();
  }



  textAlign(LEFT,TOP);
  textSize(16);
  stroke(0);
  fill(0);
  strokeWeight(0);
  // let sliderLabelLeft = pLeft+sliderWidth*0.9+axMargin;
  text(textInfInit,sliderLabelLeft,sliderTop+sliderDist/2.5);
  // text(textTestInterval,pLeft,sliderTop + 1.5* sliderDist);
  text(textLowInt,sliderLabelLeft,sliderTop + 1.3*sliderDist+sliderDist/2.5);
  text(textHighInt,sliderLabelLeft,sliderTop +2.3*sliderDist+sliderDist/2.5);


  // Draw background and axes
  fill(clrBackground);
  noStroke();
  rect(axLeft,axTop,axWidth,axHeight);

  fill(0);
  stroke(0);
  strokeWeight(axSize);
  line(axLeft,axTop+axHeight,axLeft+axWidth,axTop+axHeight);
  // line(axLeft+axWidth,axTop+axHeight,axLeft+axWidth-axSize,axTop+axHeight-axSize);
  // line(axLeft+axWidth,axTop+axHeight,axLeft+axWidth-axSize,axTop+axHeight+axSize);
  line(axLeft+axWidth-axSize/3,axTop+axHeight,axLeft+axWidth-3*axSize,axTop+axHeight-axSize);
  line(axLeft+axWidth-axSize/3,axTop+axHeight,axLeft+axWidth-3*axSize,axTop+axHeight+axSize);
  line(axLeft,axTop+axHeight,axLeft,axTop);
  line(axLeft,axTop,axLeft-axSize,axTop+3*axSize);
  line(axLeft,axTop,axLeft+axSize,axTop+3*axSize);

  textAlign(RIGHT,TOP);
  strokeWeight(0.1);
  textSize(16);
  text(textXAxis,pRight,pBot+axMargin/2);
  push();
  translate(pLeft-axMargin*0.75,pTop);
  rotate(-PI/2);
  textSize(14);
  text(textYAxis,0,0);
  pop();

  // Draw isolation-bar-background
  fill(clrBackground);
  noStroke();
  rect(axLeft,isoBarTop,axWidth,isoBarHeight);

  
  for (let k = 0; k < yMax; k++) {
    const curY = k;

    if ((curY % 1) == 0){
      let thisViral;
      thisViral = coorToScreenCoor(0,curY);
      strokeWeight(1);
      stroke(0);
      fill(0);
      line(pLeft-axSize,thisViral[1],pLeft+axSize,thisViral[1])     
      
      textAlign(RIGHT,CENTER);
      strokeWeight(0);
      textSize(10);
      fill(0,150);
      text(curY,pLeft-2*axSize,thisViral[1])
    }
  }


  // Draw thresholds
  let HighSensScreen;
  let LowSensScreen;
  let InfectCoor;
  HighSensScreen = coorToScreenCoor(0,HighSensThres);
  LowSensScreen = coorToScreenCoor(0,LowSensThres);
  InfectCoor = coorToScreenCoor(0,InfectThres);

  strokeWeight(3);
  stroke(255,155,0,100)
  line(pLeft,HighSensScreen[1],pRight,HighSensScreen[1])
  stroke(0,155,255,100)
  line(pLeft,LowSensScreen[1],pRight,LowSensScreen[1])
  stroke(255,100,100,100)
  line(pLeft,InfectCoor[1],pRight,InfectCoor[1])



  // --- Show infective period ---
  if (showInfectiousPeriod){
    let infXs =[];
    let infYs =[];

    // For determining the infectious period 
    let firstTimeInf = 10000;
    let lastTimeInf = 0;

    // Go through the times
    for (let k = 0; k < plotTimeArray.length; k++) {
      const curT = plotTimeArray[k];
      const curV = viralLoadArray[k];

      if (curV > InfectThres){
        [curX,curY] = coorToScreenCoor(curT,curV);
        infXs.push(curX);
        infYs.push(curY);

        // For determining the infectious period 
        if (curT > lastTimeInf){
          lastTimeInf = curT;
        }
        if (curT < firstTimeInf){
          firstTimeInf = curT;
        }
      }
    }
    // Move first and last point a little down
    let InfectThresCoor = coorToScreenCoor(0,InfectThres);
    infYs[0] = InfectThresCoor[1];
    infYs[infYs.length-1] = InfectThresCoor[1];

    // Determine the infectious period (Should be always 6 days here)
    countSmitte = (lastTimeInf-firstTimeInf)/timeScale;
    countSmitteInit = firstTimeInf;
    countSmitteEnd  = lastTimeInf;
    
    // Draw the shape below the curve
    fill(clrInfectiousLgt)
    noStroke();
    beginShape()
    for (let k = 0; k < infXs.length; k++) {
      const curNum1 = infXs[k];
      const curNum2 = infYs[k];
      vertex(curNum1,curNum2)
    }
    endShape(CLOSE);

    // Draw on isolation-bar
    fill(clrInfectiousLgt)
    noStroke();
    rect(infXs[0],isoBarTop,infXs[infXs.length-1]-infXs[0],isoBarHeight);
    
    // strokeWeight(0);
    // fill(0);
    // textSize(14);
    // textAlign(CENTER,TOP);
    // push();
    // translate(infXs[0]+5,isoBarTop+isoBarHeight/2);
    // rotate(-PI/2);
    // text(textIsoBarInf,0,0);
    // pop();
  }

  // --- Show Self-isolation period ---
  if (showIsolationSelf){
    // --- Show symptom-start ---
    let symptomDay = 5*timeScale;
    let sympStartCoor = coorToScreenCoor(symptomDay+InfectionInit,10);

    // Old way to show periods on plot, change flag at top to show
    if (showPeriodsOnPlot){
      stroke(100,0,0)
      let sympLabelOffset = 10;
      line(sympStartCoor[0],sympStartCoor[1],sympStartCoor[0]+sympLabelOffset/2,sympStartCoor[1]-sympLabelOffset/2)
      strokeWeight(0);
      fill(0);
      textSize(12);
      textAlign(LEFT,BOTTOM);
      text('Symptomstart, selv-isolation',sympStartCoor[0]+sympLabelOffset,sympStartCoor[1]-sympLabelOffset)
    
      let infXs =[];
      let infYs =[];
      // Go through the times
      for (let k = 0; k < plotTimeArray.length; k++) {
        const curT = plotTimeArray[k];
        const curTInf = timeArray[k];
        const curV = viralLoadArray[k];

        
        if (curTInf > symptomDay){
            [curX,curY] = coorToScreenCoor(curT,curV);
            infXs.push(curX);
            infYs.push(curY);
        }
      }
      // // Move first and last point a little down
      let newPos2 = coorToScreenCoor(symptomDay+InfectionInit,0)
      infXs.unshift(newPos2[0]);
      infYs.unshift(infYs[0]);
      infXs.unshift(newPos2[0])
      infYs.unshift(pBot);
      
      // Draw the shape
      fill(clrSelfIsoTrans)
      noStroke();
      beginShape()
      for (let k = 0; k < infXs.length; k++) {
        const curNum1 = infXs[k];
        const curNum2 = infYs[k];
        vertex(curNum1,curNum2)
      }
      endShape(CLOSE);
    }

    
    // Draw on isolation-bar
    fill(clrSelfIsoLgt)
    noStroke();
    let selfIsoEndTime = symptomDay +InfectionInit+ isolationPeriod*timeScale;
    // let selfIsoEndTime = isolationPeriod*timeScale;
    [curX,curY] = coorToScreenCoor(selfIsoEndTime,0);
    rect(sympStartCoor[0],isoBarTop,curX-sympStartCoor[0],isoBarHeight);

    // Label the isolation-bar
    strokeWeight(0);
    fill(0);
    textSize(13);
    textAlign(CENTER,TOP);
    push();
    translate(sympStartCoor[0]+2,isoBarTop+isoBarHeight/2);
    rotate(-PI/2);
    text(textIsoBarSymp,0,0);
    pop();
  }



  // ---  Plot test points ---
  strokeWeight(2);
  stroke(0)
  
  // Low sensitivity test-points
  // fill(0,0,255)
  
  let anyFoundLow = false;
  let firstFoundTimeLow = 30;
  for (let k = 0; k < LowPoints.length; k++) {
    const curT = (LowOffset + LowPoints[k])*timeScale;
    let pointFound = false;
    if (curT >= firstDetectableLow){
      if (curT <= lastDetectableLow){
        // console.log(curT);
        pointFound = true;
        if (anyFoundLow == false){
          firstFoundTimeLow = curT;
        }
        anyFoundLow = true;
      }
    }
    if (pointFound){
      // fill(200,200,255);
      fill(clrLowSensLgt);
      testRadiusToShow = testRadiusLarge;
    } else {
      fill(0,0,155);
      // fill(clrLowSensDrk)
      testRadiusToShow = testRadius;
    }
    [curX,curY] = coorToScreenCoor(curT,LowSensThres);
    circle(curX,curY,testRadiusToShow)
  }
  
  // High sensitivity test-points
  // fill(255,255,0)
  stroke(0)
  let anyFoundHigh = false;
  let firstFoundTimeHigh = 30;
  for (let k = 0; k < HighPoints.length; k++) {
    const curT = (HighOffset + HighPoints[k])*timeScale;
    let pointFound = false;
    if (curT > firstDetectableHigh){
      if (curT <= lastDetectableHigh){
        pointFound = true;
        if (anyFoundHigh == false){
          firstFoundTimeHigh = curT;
        }
        anyFoundHigh = true;
      }
    }
    if (pointFound){
      testRadiusToShow = testRadiusLarge;
      fill(255,255,200);
    } else {
      testRadiusToShow = testRadius;
      fill(155,155,0);
    }
    [curX,curY] = coorToScreenCoor(curT,HighSensThres);
    circle(curX,curY,testRadiusToShow)
  }

  // --- Calculate the reduced infectious periods ---
  if (anyFoundLow){
    countReduLow = (countSmitteEnd/timeScale) - (firstFoundTimeLow/timeScale);
  } else {
    countReduLow = 0;
  }
  if (countReduLow < 0){
    countReduLow = 0;
  }
  if (anyFoundHigh){
    // countReduHighLate = (firstFoundTimeHigh/timeScale) - (countSmitteInit/timeScale) + timeDelay;
    countReduHighLate = (countSmitteEnd/timeScale) - (firstFoundTimeHigh/timeScale) - timeDelay;
  } else {
    countReduHighLate = 0;
  }
  if (countReduHighLate < 0){
    countReduHighLate = 0;
  }

  let bestTest;
  if (countReduHighLate > countReduLow){
    bestTest = 'PCR';
  } else {
    bestTest = 'Antigen';
  } 
  if (countReduHighLate == countReduLow){
    bestTest = '';
  }
  
  push();
  translate(tableX,tableY);
  fill(clrBackground)
  noStroke();
  // rect(axMargin*1.8,-axMargin/4,-axMargin*5.8,tableDist*4+axMargin/4);
  rect(axMargin*1.8,0,-axMargin*5.8,tableDist*4.5);
  translate(0,tableDist/2);

  textSize(18);
  noStroke();
  fill(0)

  textAlign(LEFT,TOP);
  // let countTextSmitte;
  // if (countSmitte == 1) {
  //   countTextSmitte = countSmitte + ' ' + textDaySin
  // } else {
  //   countTextSmitte = countSmitte + ' ' + textDayPlu
  // }
  let countTextLow;
  if ((countSmitte-countReduLow) == 1) {
    countTextLow = (countSmitte-countReduLow) + ' ' + textDaySin
  } else {
    countTextLow = (countSmitte-countReduLow) + ' ' + textDayPlu
  }
  let countTextHigh; 
  if ((countSmitte-countReduHighLate) == 1) {
    countTextHigh = (countSmitte-countReduHighLate) + ' ' + textDaySin
  } else {
    countTextHigh = (countSmitte-countReduHighLate) + ' ' + textDayPlu
  }
  // text(countReduLow,pLeft + sliderWidth*2,pBot+isoBarHeight*2)
  // text(countReduHighLate,pLeft + sliderWidth*2,pBot+isoBarHeight*2.5)
  // text(countTextSmitte,0,0)
  text(countTextLow,0,tableDist)
  text(countTextHigh,0,tableDist*2)
  
  text(bestTest,0,tableDist*3)

  // textSize(16);
  textAlign(RIGHT,TOP);
  textStyle(BOLD)
  text(textTableSmitte,0,0);
  textStyle(NORMAL)
  text(textTableLow,0,tableDist);
  text(textTableHigh,0,tableDist*2);
  text(textTableBest,0,tableDist*3);
  pop();
  

  // --- Show the isolation periods ---
  let newPos;
  let newPos2;

  if (showIsolationLow){
    if (anyFoundLow){ 
      stroke(0,100) 
      newPos = coorToScreenCoor(firstFoundTimeLow,LowSensThres)
      newPos2 = coorToScreenCoor(firstFoundTimeLow,0)
      line(newPos[0],newPos[1],newPos2[0],newPos2[1])
    }
  }
  if (showIsolationHigh){
    if (anyFoundHigh){  
      // stroke(255,255,0)
      stroke(0,100)
      newPos = coorToScreenCoor(firstFoundTimeHigh,HighSensThres)
      newPos2 = coorToScreenCoor(firstFoundTimeHigh,0)
      line(newPos[0],newPos[1],newPos2[0],newPos2[1])
    }
  }
  if (showIsolationHighLate){
    if (anyFoundHigh){  
      stroke(0,100)
      newPos = coorToScreenCoor(firstFoundTimeHigh,HighSensThres)
      newPos2 = coorToScreenCoor(firstFoundTimeHigh+timeDelay*timeScale,0)
      line(newPos[0],newPos[1],newPos2[0],newPos2[1])
    }
  }


  // --- Show isolation-period due to low sensitivity test  ---
  if (showIsolationLow){
     
    if (anyFoundLow){ 
      let infXs =[];
      let infYs =[];
      // Go through the times
      for (let k = 0; k < plotTimeArray.length; k++) {
        const curT = plotTimeArray[k];
        const curV = viralLoadArray[k];

        if (curT > firstFoundTimeLow){
          // if (curV > LowSensThres){
            [curX,curY] = coorToScreenCoor(curT,curV);
            infXs.push(curX);
            infYs.push(curY);
          // }
        }
      }
      // Move first and last point a little down
      newPos2 = coorToScreenCoor(firstFoundTimeLow,0)
      infXs.unshift(newPos2[0]);
      infYs.unshift(infYs[0]);
      infXs.unshift(newPos2[0])
      infYs.unshift(pBot);

      // Old way to show periods on plot, change flag at top to show
      if (showPeriodsOnPlot){
        // Draw the shape
        // fill(0,0,155,50)
        fill(clrLowSensTrans)
        noStroke();
        beginShape()
        for (let k = 0; k < infXs.length; k++) {
          const curNum1 = infXs[k];
          const curNum2 = infYs[k];
          vertex(curNum1,curNum2)
        }
        endShape(CLOSE);
        // --- Show label ---
        let LowStartCoor = coorToScreenCoor(firstFoundTimeLow,LowSensThres);
        let LowLabelOffset = 10;
        stroke(0,0,100)
        line(LowStartCoor[0],LowStartCoor[1],LowStartCoor[0]-LowLabelOffset,LowStartCoor[1]-LowLabelOffset)
        strokeWeight(0);
        fill(0);
        textSize(12);
        textAlign(RIGHT,CENTER);
        push();
        translate(LowStartCoor[0]-LowLabelOffset*1.25,LowStartCoor[1]-LowLabelOffset*1.25)
        rotate(PI/4)
        text(textIsoBarLow,0,0)
        pop();
        
      }
      // Draw on isolation-bar
      // fill(clrLowSensTrans)
      fill(clrLowSensLgt)
      noStroke();
      // rect(infXs[0],isoBarTop,infXs[infXs.length-1]-infXs[0],isoBarHeight);
      let IsoEndTime = firstFoundTimeLow + isolationPeriod*timeScale;
      [curX,curY] = coorToScreenCoor(IsoEndTime,0);
      // rect(infXs[0],isoBarTop,curX-infXs[0],isoBarHeight);
      rect(infXs[0],isoBarTop+IsoBarSmallMargin,curX-infXs[0],isoBarHeight/2-IsoBarSmallMargin*1.5);
      

      // --- Show label on isolation-bar ---
      fill(0);
      textSize(textIsoBarFontSize);
      textAlign(CENTER,TOP);
      push();
      translate(infXs[0]+2,isoBarTop + isoBarHeight/4);
      rotate(-PI/2)
      text(textIsoBarLow,0,0)
      pop();
    }
    
    
  
  }


  // --- Show isolation-period due to high sensitivity test  ---
  if (showIsolationHigh){
    if (anyFoundHigh){ 
      let infXs =[];
      let infYs =[];
      // Go through the times
      for (let k = 0; k < plotTimeArray.length; k++) {
        const curT = plotTimeArray[k];
        const curV = viralLoadArray[k];

        if (curT > firstFoundTimeHigh){
          // if (curV > LowSensThres){
            [curX,curY] = coorToScreenCoor(curT,curV);
            infXs.push(curX);
            infYs.push(curY);
          // }
        }
      }
      // Move first and last point a little down
      newPos2 = coorToScreenCoor(firstFoundTimeHigh,0)
      infXs.unshift(newPos2[0]);
      infYs.unshift(infYs[0]);
      infXs.unshift(newPos2[0])
      infYs.unshift(pBot);

      // Old way to show periods on plot, change flag at top to show
      if (showPeriodsOnPlot){
        // Draw the shape
        // fill(255,255,0,50)
        fill(clrHighSensTrans)
        noStroke();
        beginShape()
        for (let k = 0; k < infXs.length; k++) {
          const curNum1 = infXs[k];
          const curNum2 = infYs[k];
          vertex(curNum1,curNum2)
        }
        endShape(CLOSE);
        // --- Show label ---
        let HighStartCoor = coorToScreenCoor(firstFoundTimeHigh,HighSensThres);
        let HighLabelOffset = 10;
        stroke(0,0,100)
        line(HighStartCoor[0],HighStartCoor[1],HighStartCoor[0]-HighLabelOffset,HighStartCoor[1]-HighLabelOffset)
        strokeWeight(0);
        fill(0);
        textSize(12);
        textAlign(RIGHT,CENTER);
        push();
        translate(HighStartCoor[0]-HighLabelOffset*1.25,HighStartCoor[1]-HighLabelOffset*1.25)
        rotate(PI/4)
        text(textIsoBarHigh,0,0)
        pop();
      }

      // Draw on isolation-bar
      fill(clrHighSensLgt)
      noStroke();
      let IsoEndTime = firstFoundTimeHigh + isolationPeriod*timeScale;
      [curX,curY] = coorToScreenCoor(IsoEndTime,0);
      // rect(infXs[0],isoBarMid,curX-infXs[0],isoBarHeight/2);
      // rect(infXs[0],isoBarMid+IsoBarSmallMargin,curX-infXs[0],isoBarHeight/2-IsoBarSmallMargin*2);
      rect(infXs[0],isoBarMid+IsoBarSmallMargin*0.5,curX-infXs[0],isoBarHeight/2-IsoBarSmallMargin*1.5);
      // rect(infXs[0],isoBarTop,infXs[infXs.length-1]-infXs[0],isoBarHeight);
      // --- Show label ---
      fill(0);
      textSize(textIsoBarFontSize);
      textAlign(CENTER,TOP);
      push();
      translate(infXs[0]+2,isoBarTop + 3* isoBarHeight/4);
      rotate(-PI/2)
      text(textIsoBarHigh,0,0)
      pop();
    }
    
    
  }
  
  if (showIsolationHighLate){
    if (anyFoundHigh){ 
      // Find the coordinate for the first time found, plus the timedelay
      firstFoundCoor = coorToScreenCoor(firstFoundTimeHigh+timeDelay*timeScale,0)

      // Draw on isolation-bar
      fill(clrHighSensLgt)
      noStroke();
      let IsoEndTime = firstFoundTimeHigh + isolationPeriod*timeScale ;
      [curX,curY] = coorToScreenCoor(IsoEndTime+timeDelay*timeScale,0);
      // rect(firstFoundCoor[0],isoBarTop,curX-firstFoundCoor[0],isoBarHeight);
      // rect(firstFoundCoor[0],isoBarMid,curX-firstFoundCoor[0],isoBarHeight/2);
      rect(firstFoundCoor[0],isoBarMid+IsoBarSmallMargin*0.5,curX-firstFoundCoor[0],isoBarHeight/2-IsoBarSmallMargin*1.5);
      // --- Show label ---
      fill(0);
      textSize(textIsoBarFontSize);
      textAlign(CENTER,TOP);
      push();
      // translate(firstFoundCoor[0]+2,isoBarTop + isoBarHeight/2);
      translate(firstFoundCoor[0]+2,isoBarTop + 3*isoBarHeight/4);
      rotate(-PI/2)
      text(textIsoBarHighLate,0,0)
      pop();
    }
    
    
  }



  // Plot viral load curve
  // let prevT = plotTimeArray[0] + InfectionInit;
  let prevT = plotTimeArray[0];
  let prevV = viralLoadArray[0];
  let prevX;
  let prevY;
  [prevX,prevY] = coorToScreenCoor(prevT,prevV);
  for (let t = 1; t < timeArray.length; t++) {
    const curT = plotTimeArray[t];
    // const curT = plotTimeArray[t] + InfectionInit;
    const curV = viralLoadArray[t];
    [curX,curY] = coorToScreenCoor(curT,curV);
    // point(curX,curY)
    fill(0)
    stroke(0)
    strokeWeight(2)

    if (curX < pRight) {
      line(curX,curY,prevX,prevY)
    }
    prevX = curX;
    prevY = curY;
  }
  
  // Draw ticks on axes 
  for (let k = 0; k < 30*timeScale; k++) {
    const curT = k;

    if ((curT % (1*timeScale)) == 0){
      let thisTime;
      thisTime = coorToScreenCoor(curT,0);
      strokeWeight(1);
      stroke(0);
      line(thisTime[0],pBot-axSize,thisTime[0],pBot+axSize);
      
      textAlign(CENTER,TOP);
      strokeWeight(0);
      textSize(12);
      fill(0,150);
      text(Math.floor(curT/timeScale),thisTime[0],pBot+2*axSize);

      // Also draw a thin line on isolation-bar
      // stroke(155);
      strokeWeight(1);
      line(thisTime[0],isoBarTop,thisTime[0],isoBarTop+isoBarHeight);
    }
    // if ((curT % (5*timeScale)) == 0){
    if ((curT % (7*timeScale)) == 0){
      let thisTime;
      thisTime = coorToScreenCoor(curT,0);
      strokeWeight(4);
      stroke(0);
      line(thisTime[0],pBot-axSize,thisTime[0],pBot+axSize)      

      // Also draw a thin line on isolation-bar
      // stroke(155);
      strokeWeight(3);
      line(thisTime[0],isoBarTop,thisTime[0],isoBarTop+isoBarHeight);
    }
  }

  // Plot infection point
  stroke(clrInfection)
  newPos = coorToScreenCoor(plotTimeArray[0],viralLoadArray[0]);
  // let newPos = coorToScreenCoor(timeArray[0]+InfectionInit,viralLoadArray[0]);
  curX = newPos[0]
  curY = newPos[1]
  // circle(curX,curY,testRadius);
  // rect(curX-testRadius/2,curY-testRadius/2,testRadius/2,testRadius);
  strokeWeight(5);
  line(curX,curY-testRadius,curX,curY+testRadius);


  // Draw line on top of isolation-bar-background
  noFill();
  // stroke(0)
  // strokeWeight(axSize);
  // rect(axLeft,isoBarTop,axWidth,isoBarHeight);

  // Draw infection on top, so its also shown in the left side of infection bar
  stroke(clrInfection)
  strokeWeight(axSize);
  line(curX,isoBarTop,curX,isoBarHeight+isoBarTop);


  // Draw a white rectangle to remove overflow...
  fill(255);
  noStroke()
  rect(pRight+2,0,500,height);

  // // Plot ends of detectable interval
  // let newPos2;
  // stroke(0,0,255)
  // newPos = coorToScreenCoor(lastDetectableLow,LowSensThres)
  // newPos2 = coorToScreenCoor(lastDetectableLow,0)
  // line(newPos[0],newPos[1],newPos2[0],newPos2[1])

  // newPos = coorToScreenCoor(firstDetectableLow,LowSensThres)
  // newPos2 = coorToScreenCoor(firstDetectableLow,0)
  // line(newPos[0],newPos[1],newPos2[0],newPos2[1])
  
  // stroke(255,255,0)
  // newPos = coorToScreenCoor(lastDetectableHigh,HighSensThres)
  // newPos2 = coorToScreenCoor(lastDetectableHigh,0)
  // line(newPos[0],newPos[1],newPos2[0],newPos2[1])

  // newPos = coorToScreenCoor(firstDetectableHigh,HighSensThres)
  // newPos2 = coorToScreenCoor(firstDetectableHigh,0)
  // line(newPos[0],newPos[1],newPos2[0],newPos2[1])



  // let randt = random(0,30);
  // let randv = random(0,12);
  // [randX,randY] = coorToScreenCoor(randt,randv);
  // randt = random(0,30);
  // randv = random(0,12);
  // [randX2,randY2] = coorToScreenCoor(randt,randv);
  // line(randX,randY,randX2,randY2);


  // let axSize = 4;
  // rect(axLeft,axTop+axHeight-(axSize/2),axWidth,axSize)

}
