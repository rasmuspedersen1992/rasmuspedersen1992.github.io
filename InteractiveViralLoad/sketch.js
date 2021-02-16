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

let isolationPeriod = 14;

let InfectionInit = 0;

let showInfectiousPeriod = true;
let showIsolationSelf = false;
let showIsolationLow = false;
let showIsolationHigh = false;
let showPeriodsOnPlot = false;

let isoBarHeight;
let isoBarTop;

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

let checkIsoSymp;
let checkIsoLow;
let checkIsoHigh;

let checkboxX;
let checkboxY;
let checkboxDist;
let checkboxTextX;

let textInfInit = 'textInfInit';
let textLowInt = 'textLowInt';
let textLowOff = 'textLowOff';
let textHighInt = 'textHighInt';
let textHighOff = 'textHighOff';
let textLowSens = 'textLowSens';
let textHighSens = 'textHighSens';


let textIsoBarInf;
let textIsoBarSymp;
let textIsoBarLow;
let textIsoBarHigh;
textIsoBarInf  = 'Smitsom';
textIsoBarSymp = 'Symptomstart \nSelv-isolation';
textIsoBarLow  = 'Positiv test \nIsolation';
textIsoBarHigh = 'Positiv test \nIsolation';

let textXAxis;
let textYAxis;
textXAxis = 'Tid [dage]';
textYAxis = 'Log10 Viral load';

let textIsoSymp;
let textIsoLow;
let textIsoHigh;
let textTestInterval;
let textSens;
textIsoSymp = 'Symptomer';
textIsoLow =  'Antigen-test';
textIsoHigh = 'PCR-test';
textTestInterval = 'Testinterval:';
textSens = 'Sensitivitet:';

let textInfInitPre;
let textLowIntPre;
let textHighIntPre;
let textLowSensPre;
let textHighSensPre;
let textDaySin;
let textDayPlu;
let textCheckBox;
textInfInitPre = 'Infektionstart: Dag ';
textLowIntPre = 'Antigen-test: \nHver ';
textHighIntPre = 'PCR-test: \nHver ';
textLowSensPre = 'Antigen-test: 10^';
textHighSensPre = 'PCR-test: 10^';
textDaySin = ' dag'
textDayPlu = ' dage'
textCheckBox = 'Vis periode for isolation:';

// let textIsoSymp = 'Vis periode for isolation, symptomer';
// let textIsoLow =  'Vis periode for isolation, lavsensitivitetstest';
// let textIsoHigh = 'Vis periode for isolation, højsensitivitetstest';
// let textIsoLow =  'Lavsensitivitetstest';
// let textIsoHigh = 'Højsensitivitetstest';


function setLanguageEnglish(){
  textIsoBarInf = 'Infectious'
  textIsoBarSymp = 'Symptom onset \nSelf-isolation';
  textIsoBarLow  = 'Positiv test \nIsolation';
  textIsoBarHigh = 'Positiv test \nIsolation';
  
  textXAxis = 'Time [days]';
  textYAxis = 'Log10 Viral load';

  textIsoSymp = 'Symptoms';
  textIsoLow =  'Antigen-test';
  textIsoHigh = 'PCR-test';

  textTestInterval = 'Test interval:';
  textSens = 'Sensitivity:';
  
  textInfInitPre = 'Infection: Day ';
  textLowIntPre = 'Antigen-test: \nEvery ';
  textHighIntPre = 'PCR-test: \nEvery ';
  textLowSensPre = 'Antigen-test: 10^';
  textHighSensPre = 'PCR-test: 10^';
  textDaySin = ' day'
  textDayPlu = ' days'
  textCheckBox = 'Show isolation-period:';
}

function setLanguageDanish(){
  textIsoBarInf  = 'Smitsom';
  textIsoBarSymp = 'Symptomstart \nSelv-isolation';
  textIsoBarLow  = 'Positiv test \nIsolation';
  textIsoBarHigh = 'Positiv test \nIsolation';
  
  textXAxis = 'Tid [dage]';
  textYAxis = 'Log10 Viral load';

  textIsoSymp = 'Symptomer';
  textIsoLow =  'Antigen-test';
  textIsoHigh = 'PCR-test';

  textTestInterval = 'Testinterval:';
  textSens = 'Sensitivitet:';
  
  textInfInitPre = 'Infektionstart: Dag ';
  textLowIntPre = 'Antigen-test: \nHver ';
  textHighIntPre = 'PCR-test: \nHver ';
  textLowSensPre = 'Antigen-test: 10^';
  textHighSensPre = 'PCR-test: 10^';
  textDaySin = ' dag'
  textDayPlu = ' dage'
  textCheckBox = 'Vis periode for isolation:';
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
  let growthRate = 0.2;
  let v0 = 0.05;
  let finalViral;
  for (let k = 0; k < tIniPhase.length; k++) {
    const curT = tIniPhase[k];
    timeArray.push(curT);
    let newViral = maxViral/(1+((maxViral-v0)/v0)*Math.exp(-growthRate*curT));
    viralLoadArray.push(newViral);
    finalViral = newViral;
  }
  
  let decayRate1 = 0.03;
  let decayRate2 = 0.06;
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
  
  // Language buttons
  let flagWidth = 80;
  let flagDist = 80;
  buttonFlagDanish = createImg('DKflag.png');
  buttonFlagDanish.position(pRight-flagWidth,pBot+3*axMargin);
  buttonFlagDanish.style('width:'+flagWidth+'px');
  buttonFlagDanish.mousePressed(setLanguageDanish);
  buttonFlagEnglish = createImg('UKflag.png');
  buttonFlagEnglish.position(pRight-flagWidth,pBot+3*axMargin+flagDist);
  buttonFlagEnglish.mousePressed(setLanguageEnglish);
  buttonFlagEnglish.style('width:'+flagWidth+'px');


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
  sliderDist = axMargin;
  isoBarHeight = 100;
  isoBarTop = pBot + axMargin;
  sliderTop = isoBarTop + sliderDist + isoBarHeight;
  sliderInfInit = createSlider(0,30,0);
  sliderInfInit.position(pLeft, sliderTop);
  sliderInfInit.changed(slidersChanged)
  sliderInfInit.style('width',sliderWidth+'px');
  sliderLowInt = createSlider(1,21,3);
  sliderLowInt.position(pLeft, sliderTop+ 1.5*sliderDist);
  sliderLowInt.changed(slidersChanged)
  sliderLowInt.style('width',sliderWidth+'px');
  sliderHighInt = createSlider(1,21,7);
  sliderHighInt.position(pLeft, sliderTop+ 2.5*sliderDist);
  sliderHighInt.changed(slidersChanged)
  sliderHighInt.style('width',sliderWidth+'px');
  // sliderLowOff = createSlider(0,10,0);
  // sliderLowOff.position(pLeft, sliderTop+ 3*sliderDist);
  // sliderLowOff.changed(slidersChanged)
  // sliderLowOff.style('width',sliderWidth+'px');
  // sliderHighOff = createSlider(0,10,0);
  // sliderHighOff.position(pLeft, sliderTop+ 4*sliderDist);
  // sliderHighOff.changed(slidersChanged)
  // sliderHighOff.style('width',sliderWidth+'px');
  sliderLowSens = createSlider(0,10,LowSensThres);
  sliderLowSens.position(pLeft, sliderTop+ 4*sliderDist);
  sliderLowSens.changed(slidersChanged)
  sliderLowSens.style('width',sliderWidth+'px');
  sliderHighSens = createSlider(0,10,HighSensThres);
  sliderHighSens.position(pLeft, sliderTop+ 5*sliderDist);
  sliderHighSens.changed(slidersChanged)
  sliderHighSens.style('width',sliderWidth+'px');

  // Create checkboxes
  checkboxX = pLeft + sliderWidth*1.75;
  checkboxY = sliderTop;
  checkboxDist = sliderDist/2;
  checkboxTextX = checkboxX + checkboxDist;
  // checkIsoSymp = createCheckbox(textIsoSymp);
  // checkIsoLow = createCheckbox(textIsoLow);
  // checkIsoHigh = createCheckbox(textIsoHigh);

  checkIsoSymp = createCheckbox(); 
  checkIsoSymp.changed(funcIsoSymp);
  checkIsoSymp.position(checkboxX,checkboxY +  checkboxDist);
  checkIsoLow = createCheckbox();
  checkIsoLow.changed(funcIsoLow);
  checkIsoLow.position(checkboxX,checkboxY + 2*checkboxDist);
  checkIsoHigh = createCheckbox();
  checkIsoHigh.changed(funcIsoHigh);
  checkIsoHigh.position(checkboxX,checkboxY+ 3*checkboxDist);


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

function slidersChanged(){
  // Read values from sliders
  InfectionInit = sliderInfInit.value()*timeScale;
  LowInterval = sliderLowInt.value();
  HighInterval = sliderHighInt.value();
  // LowOffset = sliderLowOff.value();
  // HighOffset = sliderHighOff.value();
  LowSensThres = sliderLowSens.value();
  HighSensThres = sliderHighSens.value();

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
    textLowInt = textLowInt + textDaySin
  } else {
    textLowInt = textLowInt + textDayPlu
  }
  if (HighInterval == 1){
    textHighInt = textHighInt + textDaySin
  } else {
    textHighInt = textHighInt + textDayPlu
  }

  textAlign(LEFT,TOP);
  textSize(16);
  stroke(0);
  fill(0);
  strokeWeight(0);
  let sliderLabelLeft = pLeft+sliderWidth*0.9+axMargin;
  text(textInfInit,sliderLabelLeft,sliderTop);
  text(textTestInterval,pLeft,sliderTop + sliderDist);
  text(textLowInt,sliderLabelLeft,sliderTop + 1.4*sliderDist);
  text(textHighInt,sliderLabelLeft,sliderTop + 2.4*sliderDist);
  text(textSens,pLeft,sliderTop + 3.5*sliderDist);
  text(textLowSens,sliderLabelLeft,sliderTop + 4*sliderDist);
  text(textHighSens,sliderLabelLeft,sliderTop + 5*sliderDist);
  // text(textLowOff,sliderLabelLeft,sliderTop + 3*sliderDist);
  // text(textHighOff,sliderLabelLeft,sliderTop + 4*sliderDist);

  // Checkbox text
  text(textCheckBox,checkboxX,checkboxY);
  text(textIsoSymp,checkboxTextX,checkboxY+checkboxDist)
  text(textIsoLow,checkboxTextX,checkboxY+2*checkboxDist)
  text(textIsoHigh,checkboxTextX,checkboxY+3*checkboxDist)


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
      fill(0);
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
    // Go through the times
    for (let k = 0; k < plotTimeArray.length; k++) {
      const curT = plotTimeArray[k];
      const curV = viralLoadArray[k];

      if (curV > InfectThres){
        [curX,curY] = coorToScreenCoor(curT,curV);
        infXs.push(curX);
        infYs.push(curY);
      }
    }
    // Move first and last point a little down
    let InfectThresCoor = coorToScreenCoor(0,InfectThres);
    infYs[0] = InfectThresCoor[1];
    infYs[infYs.length-1] = InfectThresCoor[1];
    
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
    
    strokeWeight(0);
    fill(0);
    textSize(14);
    textAlign(CENTER,TOP);
    push();
    translate(infXs[0]+5,isoBarTop+isoBarHeight/2);
    rotate(-PI/2);
    text(textIsoBarInf,0,0);
    pop();
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
  let testRadius = 10;
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
      testRadiusToShow = 1.3*testRadius;
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
      testRadiusToShow = 1.3*testRadius;
      fill(255,255,200);
    } else {
      testRadiusToShow = testRadius;
      fill(155,155,0);
    }
    [curX,curY] = coorToScreenCoor(curT,HighSensThres);
    circle(curX,curY,testRadiusToShow)
  }

  // Show the isolation curves
  let newPos;
  let newPos2;

  if (anyFoundLow){ 
    stroke(0,100) 
    newPos = coorToScreenCoor(firstFoundTimeLow,LowSensThres)
    newPos2 = coorToScreenCoor(firstFoundTimeLow,0)
    line(newPos[0],newPos[1],newPos2[0],newPos2[1])
  }
  if (anyFoundHigh){  
    // stroke(255,255,0)
    stroke(0,100)
    newPos = coorToScreenCoor(firstFoundTimeHigh,HighSensThres)
    newPos2 = coorToScreenCoor(firstFoundTimeHigh,0)
    line(newPos[0],newPos[1],newPos2[0],newPos2[1])
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
      rect(infXs[0],isoBarTop,curX-infXs[0],isoBarHeight);
      

      // --- Show label on isolation-bar ---
      fill(0);
      textSize(14);
      textAlign(CENTER,TOP);
      push();
      translate(infXs[0]+2,isoBarTop + isoBarHeight/2);
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
      rect(infXs[0],isoBarTop,curX-infXs[0],isoBarHeight);
      // rect(infXs[0],isoBarTop,infXs[infXs.length-1]-infXs[0],isoBarHeight);
      // --- Show label ---
      fill(0);
      textSize(14);
      textAlign(CENTER,TOP);
      push();
      translate(infXs[0]+2,isoBarTop + isoBarHeight/2);
      rotate(-PI/2)
      text(textIsoBarHigh,0,0)
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
      fill(0);
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
  stroke(0)
  strokeWeight(axSize);
  rect(axLeft,isoBarTop,axWidth,isoBarHeight);

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
