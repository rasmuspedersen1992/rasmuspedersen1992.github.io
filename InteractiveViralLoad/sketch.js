let axLeft;
let axTop;
let axWidth;
let axHeight;
let axMargin = 40;

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

let LowOffset = 1;
let HighOffset = 2;

let lastDetectableLow;
let lastDetectableHigh;
let firstDetectableLow;
let firstDetectableHigh;

let timeArray = [];
let plotTimeArray = [];
let viralLoadArray = [];

let timeScale = 10; // ten points per day

let InfectionInit = 0;

// Initialize interactive stuff
let sliderDist;
let sliderWidth; 

let sliderInfInit;
let sliderLowInt;
let sliderLowOff;
let sliderHighInt;
let sliderHighOff;

let textInfInit = 'textInfInit';
let textLowInt = 'textLowInt';
let textLowOff = 'textLowOff';
let textHighInt = 'textHighInt';
let textHighOff = 'textHighOff';


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
  let yMax  = 12;

  let x = lerp(pLeft,pRight,t/xMax);
  let y = lerp(pBot,pTop,v/yMax)

  return [x,y]
}

function setup() {
  // createCanvas(800, 400);
  let roomForSliders = 200;
  createCanvas(800, 400 + roomForSliders);


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
  sliderWidth = 200;
  sliderInfInit = createSlider(0,30,0);
  sliderInfInit.position(pLeft, pBot + axMargin);
  sliderInfInit.changed(slidersChanged)
  sliderInfInit.style('width',sliderWidth+'px');
  sliderLowInt = createSlider(1,21,3);
  sliderLowInt.position(pLeft, pBot + axMargin + sliderDist);
  sliderLowInt.changed(slidersChanged)
  sliderLowInt.style('width',sliderWidth+'px');
  sliderLowOff = createSlider(0,10,0);
  sliderLowOff.position(pLeft, pBot + axMargin + 2*sliderDist);
  sliderLowOff.changed(slidersChanged)
  sliderLowOff.style('width',sliderWidth+'px');
  sliderHighInt = createSlider(1,21,7);
  sliderHighInt.position(pLeft, pBot + axMargin + 3*sliderDist);
  sliderHighInt.changed(slidersChanged)
  sliderHighInt.style('width',sliderWidth+'px');
  sliderHighOff = createSlider(0,10,0);
  sliderHighOff.position(pLeft, pBot + axMargin + 4*sliderDist);
  sliderHighOff.changed(slidersChanged)
  sliderHighOff.style('width',sliderWidth+'px');
}

function slidersChanged(){
  // Read values from sliders
  InfectionInit = sliderInfInit.value()*timeScale;
  LowInterval = sliderLowInt.value();
  HighInterval = sliderHighInt.value();
  LowOffset = sliderLowOff.value();
  HighOffset = sliderHighOff.value();

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
  let dayEnd = 30;
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
  textLowInt = 'Interval, lavsensitivitetstest: '+LowInterval;
  textHighInt = 'Interval, højsensitivitetstest: '+HighInterval;
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
  text(textLowInt,pLeft+sliderWidth+axMargin,pBot + axMargin + sliderDist);
  text(textLowOff,pLeft+sliderWidth+axMargin,pBot + axMargin + 2*sliderDist);
  text(textHighInt,pLeft+sliderWidth+axMargin,pBot + axMargin + 3*sliderDist);
  text(textHighOff,pLeft+sliderWidth+axMargin,pBot + axMargin + 4*sliderDist);

  // Draw background and axes
  fill(230);
  noStroke();
  rect(axLeft,axTop,axWidth,axHeight);

  fill(0);
  stroke(0);
  let axSize = 4;
  strokeWeight(axSize);
  line(axLeft,axTop+axHeight,axLeft+axWidth,axTop+axHeight);
  line(axLeft+axWidth,axTop+axHeight,axLeft+axWidth-axSize,axTop+axHeight-axSize);
  line(axLeft+axWidth,axTop+axHeight,axLeft+axWidth-axSize,axTop+axHeight+axSize);
  line(axLeft,axTop+axHeight,axLeft,axTop);
  line(axLeft,axTop,axLeft-axSize,axTop+axSize);
  line(axLeft,axTop,axLeft+axSize,axTop+axSize);

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
  for (let k = 0; k < LowPoints.length; k++) {
    const curT = (LowOffset + LowPoints[k])*timeScale;
    let pointFound = false;
    if (curT >= firstDetectableLow){
      if (curT <= lastDetectableLow){
        pointFound = true;
      }
    }
    if (pointFound){
      fill(155,155,255);
    } else {
      fill(0,0,155);
    }

    [curX,curY] = coorToScreenCoor(curT,LowSensThres);
    circle(curX,curY,testRadius)
  }
  
  // High sensitivity test-points
  fill(255,255,0)
  for (let k = 0; k < HighPoints.length; k++) {
    const curT = (HighOffset + HighPoints[k])*timeScale;
    let pointFound = false;
    if (curT >= firstDetectableHigh){
      if (curT <= lastDetectableHigh){
        pointFound = true;
      }
    }
    if (pointFound){
      fill(255,255,155);
    } else {
      fill(155,155,0);
    }
    [curX,curY] = coorToScreenCoor(curT,HighSensThres);
    circle(curX,curY,testRadius)
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
  stroke(0,150,0)
  fill(0,150,0)
  let newPos = coorToScreenCoor(plotTimeArray[0],viralLoadArray[0]);
  // let newPos = coorToScreenCoor(timeArray[0]+InfectionInit,viralLoadArray[0]);
  curX = newPos[0]
  curY = newPos[1]
  circle(curX,curY,testRadius);

  // Plot ends of detectable interval
  let newPos2;
  stroke(0,0,255)
  newPos = coorToScreenCoor(lastDetectableLow,LowSensThres)
  newPos2 = coorToScreenCoor(lastDetectableLow,0)
  line(newPos[0],newPos[1],newPos2[0],newPos2[1])

  newPos = coorToScreenCoor(firstDetectableLow,LowSensThres)
  newPos2 = coorToScreenCoor(firstDetectableLow,0)
  line(newPos[0],newPos[1],newPos2[0],newPos2[1])
  
  stroke(255,255,0)
  newPos = coorToScreenCoor(lastDetectableHigh,HighSensThres)
  newPos2 = coorToScreenCoor(lastDetectableHigh,0)
  line(newPos[0],newPos[1],newPos2[0],newPos2[1])

  newPos = coorToScreenCoor(firstDetectableHigh,HighSensThres)
  newPos2 = coorToScreenCoor(firstDetectableHigh,0)
  line(newPos[0],newPos[1],newPos2[0],newPos2[1])



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