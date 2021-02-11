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

let dayEnd = 30;
let timeScale = 10; // ten points per day
let yMax  = 12;

let InfectionInit = 0;

// Initialize interactive stuff
let sliderDist;
let sliderWidth; 

let sliderInfInit;
let sliderLowInt;
let sliderLowOff;
let sliderHighInt;
let sliderHighOff;

let sliderLowSens;
let sliderHighSens;

let textInfInit = 'textInfInit';
let textLowInt = 'textLowInt';
let textLowOff = 'textLowOff';
let textHighInt = 'textHighInt';
let textHighOff = 'textHighOff';
let textLowSens = 'textLowSens';
let textHighSens = 'textHighSens';


let curX;
let curY;

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
  // Plan: logistic first 5 days, bi-exponential decay after
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
  

  // let beta = 0.05;
  // let gamma = 0.1;
  // let factor1 = (beta+gamma+growthRate)/gamma;
  // let factor2 = (beta+growthRate)/gamma;
  // let decayRate1 = beta;
  // let decayRate2 = beta+gamma;
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

  // // Calculate the (relative) time-points at which the thresholds are exceeded.
  // lastDetectableLow = dayEnd;
  // firstDetectableLow = dayEnd;
  // lastDetectableHigh = dayEnd;
  // firstDetectableHigh = dayEnd;
  // for (let k = 0; k < viralLoadArray.length; k++) {
  //   const curV = viralLoadArray[k];
  //   const curT = timeArray[k];

  //   if (curV > LowSensThres){
  //     lastDetectableLow = curT;
  //     if (curT < firstDetectableLow){
  //       firstDetectableLow = curT;
  //     }
  //   }    

  //   if (curV > HighSensThres){
  //     lastDetectableHigh = curT;
  //     if (curT < firstDetectableHigh){
  //       firstDetectableHigh = curT;
  //     }
  //   }    

  // }

  // lastDetectableLow = lastDetectableLow+InfectionInit;
  // firstDetectableLow = firstDetectableLow+InfectionInit;
  // lastDetectableHigh = lastDetectableHigh+InfectionInit;
  // firstDetectableHigh = firstDetectableHigh+InfectionInit;



  // console.log(tPostPhase)
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
  let roomForSliders = 300;
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

  // Initialize stuff
  calcViralLoad()
  calcTestPoint();
  calcDetectableAndTimeArray();

  // Create sliders
  sliderDist = axMargin;
  sliderWidth = 300;
  sliderInfInit = createSlider(0,30,0);
  sliderInfInit.position(pLeft, pBot + axMargin);
  sliderInfInit.changed(slidersChanged)
  sliderInfInit.style('width',sliderWidth+'px');
  sliderLowInt = createSlider(1,21,3);
  sliderLowInt.position(pLeft, pBot + axMargin + 1.5*sliderDist);
  sliderLowInt.changed(slidersChanged)
  sliderLowInt.style('width',sliderWidth+'px');
  sliderHighInt = createSlider(1,21,7);
  sliderHighInt.position(pLeft, pBot + axMargin + 2.5*sliderDist);
  sliderHighInt.changed(slidersChanged)
  sliderHighInt.style('width',sliderWidth+'px');
  // sliderLowOff = createSlider(0,10,0);
  // sliderLowOff.position(pLeft, pBot + axMargin + 3*sliderDist);
  // sliderLowOff.changed(slidersChanged)
  // sliderLowOff.style('width',sliderWidth+'px');
  // sliderHighOff = createSlider(0,10,0);
  // sliderHighOff.position(pLeft, pBot + axMargin + 4*sliderDist);
  // sliderHighOff.changed(slidersChanged)
  // sliderHighOff.style('width',sliderWidth+'px');
  sliderLowSens = createSlider(0,10,5);
  sliderLowSens.position(pLeft, pBot + axMargin + 4*sliderDist);
  sliderLowSens.changed(slidersChanged)
  sliderLowSens.style('width',sliderWidth+'px');
  sliderHighSens = createSlider(0,10,3);
  sliderHighSens.position(pLeft, pBot + axMargin + 5*sliderDist);
  sliderHighSens.changed(slidersChanged)
  sliderHighSens.style('width',sliderWidth+'px');
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
  lastDetectableLow = dayEnd;
  firstDetectableLow = dayEnd;
  lastDetectableHigh = dayEnd;
  firstDetectableHigh = dayEnd;
  for (let k = 0; k < viralLoadArray.length; k++) {
    const curV = viralLoadArray[k];
    const curT = timeArray[k];

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

}

function draw() {
  background(255);
  slidersChanged();

  // Labels for sliders
  textInfInit = 'Infektionstart: Dag '+(InfectionInit/timeScale);
  textLowOff = 'Første test, lavsensitivitetstest: Dag '+LowOffset;
  textHighOff = 'Første test, højsensitivitetstest: Dag '+HighOffset;
  textLowInt = 'Testinterval, lavsensitivitetstest: '+LowInterval;
  textHighInt = 'Testinterval, højsensitivitetstest: '+HighInterval;
  textLowSens = 'Sensitivitet, lav: 10^'+LowSensThres;
  textHighSens = 'Sensitivitet, høj: 10^'+HighSensThres;
  if (LowInterval == 1){
    textLowInt = textLowInt + ' dag'
  } else {
    textLowInt = textLowInt + ' dage'
  }
  if (HighInterval == 1){
    textHighInt = textHighInt + ' dag'
  } else {
    textHighInt = textHighInt + ' dage'
  }
  textAlign(LEFT,TOP);
  textSize(16);
  stroke(0);
  fill(0);
  strokeWeight(0);
  text(textInfInit,pLeft+sliderWidth+axMargin,pBot + axMargin);
  text(textLowInt,pLeft+sliderWidth+axMargin,pBot + axMargin + 1.5*sliderDist);
  text(textHighInt,pLeft+sliderWidth+axMargin,pBot + axMargin + 2.5*sliderDist);
  // text(textLowOff,pLeft+sliderWidth+axMargin,pBot + axMargin + 3*sliderDist);
  // text(textHighOff,pLeft+sliderWidth+axMargin,pBot + axMargin + 4*sliderDist);
  text(textLowSens,pLeft+sliderWidth+axMargin,pBot + axMargin + 4*sliderDist);
  text(textHighSens,pLeft+sliderWidth+axMargin,pBot + axMargin + 5*sliderDist);

  // Draw background and axes
  fill(230);
  noStroke();
  rect(axLeft,axTop,axWidth,axHeight);

  fill(0);
  stroke(0);
  strokeWeight(axSize);
  line(axLeft,axTop+axHeight,axLeft+axWidth,axTop+axHeight);
  line(axLeft+axWidth,axTop+axHeight,axLeft+axWidth-axSize,axTop+axHeight-axSize);
  line(axLeft+axWidth,axTop+axHeight,axLeft+axWidth-axSize,axTop+axHeight+axSize);
  line(axLeft,axTop+axHeight,axLeft,axTop);
  line(axLeft,axTop,axLeft-axSize,axTop+axSize);
  line(axLeft,axTop,axLeft+axSize,axTop+axSize);

  let textXAxis = 'Tid [dage]';
  let textYAxis = 'Log10 Viral load';
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

  // Draw ticks on axes 
  for (let k = 0; k < 30*timeScale; k++) {
    const curT = k;

    if ((curT % (1*timeScale)) == 0){
      let thisTime;
      thisTime = coorToScreenCoor(curT,0);
      strokeWeight(1);
      line(thisTime[0],pBot-axSize,thisTime[0],pBot+axSize)     
      
      textAlign(CENTER,TOP);
      strokeWeight(0);
      textSize(12);
      text(Math.floor(curT/timeScale),thisTime[0],pBot+2*axSize)
    }
    if ((curT % (5*timeScale)) == 0){
      let thisTime;
      thisTime = coorToScreenCoor(curT,0);
      strokeWeight(4);
      line(thisTime[0],pBot-axSize,thisTime[0],pBot+axSize)      
    }
  }
  
  for (let k = 0; k < yMax; k++) {
    const curY = k;

    if ((curY % 1) == 0){
      let thisViral;
      thisViral = coorToScreenCoor(0,curY);
      // console.log(curY)
      strokeWeight(1);
      line(pLeft-axSize,thisViral[1],pLeft+axSize,thisViral[1])     
      
      textAlign(RIGHT,CENTER);
      strokeWeight(0);
      textSize(10);
      text(curY,pLeft-2*axSize,thisViral[1])
    }
    // if ((curT % (5*timeScale)) == 0){
    //   let thisTime;
    //   thisTime = coorToScreenCoor(curT,0);
    //   strokeWeight(4);
    //   line(thisTime[0],pBot-axSize,thisTime[0],pBot+axSize)      
    // }
  }

  // Draw thresholds
  let HighSensScreen;
  let LowSensScreen;
  let asdf;
  [asdf,HighSensScreen] = coorToScreenCoor(0,HighSensThres);
  [asdf,LowSensScreen] = coorToScreenCoor(0,LowSensThres);

  strokeWeight(3);
  stroke(255,155,0,100)
  line(pLeft,HighSensScreen,pRight,HighSensScreen)
  stroke(0,155,255,100)
  line(pLeft,LowSensScreen,pRight,LowSensScreen)


  // Plot test points
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
        pointFound = true;
        if (anyFoundLow == false){
          firstFoundTimeLow = curT;
        }
        anyFoundLow = true;
      }
    }
    if (pointFound){
      fill(200,200,255);
      testRadiusToShow = 1.3*testRadius;
    } else {
      fill(0,0,155);
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
    if (curT >= firstDetectableHigh){
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
    stroke(0)

    if (curX < pRight) {
      line(curX,curY,prevX,prevY)
    }
    prevX = curX;
    prevY = curY;
  }
  
  // Plot infection point
  stroke(0,190,0)
  // fill(0,250,0)
  newPos = coorToScreenCoor(plotTimeArray[0],viralLoadArray[0]);
  // let newPos = coorToScreenCoor(timeArray[0]+InfectionInit,viralLoadArray[0]);
  curX = newPos[0]
  curY = newPos[1]
  // circle(curX,curY,testRadius);
  // rect(curX-testRadius/2,curY-testRadius/2,testRadius/2,testRadius);
  strokeWeight(5);
  line(curX,curY-testRadius,curX,curY+testRadius);

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
