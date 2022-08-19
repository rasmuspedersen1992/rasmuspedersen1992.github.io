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
let p5DivElement = document.getElementById('p5Div'); // For using CSS sizes

// Window size
let sketchW = p5DivElement.offsetWidth;
// let sketchW = 300;
let sketchH = 400;

// Axes constants
let axMargin = 45;
let axMarginExtraY = 30;
let ax_0_X = axMargin + axMarginExtraY;
let ax_0_Y = sketchH - axMargin;
let ax_W = sketchW - (2*axMargin) - axMarginExtraY;
let ax_H = sketchH - (2*axMargin);

// Colors 
let clrAxes = [155,200,200];
let clrBackground = [240,240,255];
let clrDataReal = [0,0,0];

let clrDK = [255,0,0];
let clrSE = [0,0,255];

let clrGood = [50,155,50];
let clrBad = [155,50,50];
// Various sizes
let predictionSize = 10;
let symbolSize = 10;
let DKpop =  5800;
let SEpop = 10350;


// Flags / Booleans
let flagShowDK = true;
// let flagShowSE = true;
let flagShowSE = false;


// ----------- Setup interactive elements ----------- 
let slider_start = document.getElementById('slider_start');
let slider_end = document.getElementById('slider_end');

let label_start = document.getElementById('label_start');
let label_end = document.getElementById('label_end');

// -- Set the onchangefunctions of sliders --
slider_start.onchange = function(){
  // Run main function 
  mainFunc();
}
slider_end.onchange = function(){
  // Run main function 
  mainFunc();
}

// Setup listener for radio button
document.addEventListener('input',(e)=>{
  if(e.target.getAttribute('name')=="visDKellerSE"){
    curChoice = e.target.value;
    if (curChoice == 'visDK'){
      flagShowDK = true;
      flagShowSE = false;
    } else {
      flagShowDK = false;
      flagShowSE = true;
    }
    mainFunc()
  }
}
)

// --- Read sliders ---
let yearStart = 2000;
let yearEnd = 2019;

let readInputs = function(){
  // yearStart = parseFloat(slider_start.value);
  // yearEnd  = parseFloat(slider_end.value);

  // Limit values to be in correct order
  let newStart = parseFloat(slider_start.value);
  let newEnd  = parseFloat(slider_end.value);

  // // If sliders are in wrong order
  // if (newStart > newEnd){
  //   console.log(newStart);
  //   console.log(newEnd);
  //     // If start slider was increased
  //     if (newStart != yearStart){
  //       console.log('Start'); 
  //     }
  // }

  
  // yearStart = newStart
  // yearEnd = newEnd

  // If sliders are in wrong order or equal
  if (newStart >= newEnd){
    // If start sliders was increased
    if (newStart != yearStart){
      console.log('Start');
      // Increase end slider accordingly
      yearStart = newStart 
      yearEnd = newStart + 1
      slider_start.value = yearStart
      slider_end.value = yearEnd
    // } 
    // If end sliders was decreased
    } else if (newEnd != yearEnd){
      console.log('End');
      // Increase start slider accordingly
      yearStart = newEnd - 1
      yearEnd = newEnd
      slider_start.value = yearStart
      slider_end.value = yearEnd
    }
  } else {
    yearStart = newStart
    yearEnd = newEnd
  }

  // if (newStart > newEnd){
  //   yearStart = newStart 
  //   yearEnd = newStart + 1
  //   slider_start.value = yearStart
  //   slider_end.value = yearStart
  // }


  // if (yearStart >= yearEnd){
  //   yearStart = yearEnd - 1 
  //   slider_start.value = yearStart
  // }
  // if (yearEnd <= yearStart){
  //   yearEnd = yearStart + 1 
  //   slider_end.value = yearEnd
  // }

  yearMin = yearStart-1.2;
  yearMax = yearEnd+2.5;
  yearMax = 2021.5;

  // // Change limits of sliders
  // slider_start.max = yearEnd;
  // slider_end.min = yearStart;
}

// --- Set labels beneath inputs --
let setLabels = function(){
  label_start.innerHTML  = 'Første år: '+yearStart;
  label_end.innerHTML  = 'Sidste år: '+yearEnd;
}

// --- Main function for both checking everything and setting everything --- 
let readAndSet = function(){
  readInputs();
  setLabels();
}


// ----------------------
// ---- Data loading ----
// ----------------------
function parseCSV(str) {
  var arr = [];
  var quote = false;  // 'true' means we're inside a quoted field

  // Iterate over each character, keep track of current row and column (of the returned array)
  for (var row = 0, col = 0, c = 0; c < str.length; c++) {
      var cc = str[c], nc = str[c+1];        // Current character, next character
      arr[row] = arr[row] || [];             // Create a new row if necessary
      arr[row][col] = arr[row][col] || '';   // Create a new column (start with empty string) if necessary

      // If the current character is a quotation mark, and we're inside a
      // quoted field, and the next character is also a quotation mark,
      // add a quotation mark to the current column and skip the next character
      if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

      // If it's just one quotation mark, begin/end quoted field
      if (cc == '"') { quote = !quote; continue; }

      // If it's a comma and we're not in a quoted field, move on to the next column
      if (cc == ',' && !quote) { ++col; continue; }

      // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
      // and move on to the next row and move to column 0 of that new row
      if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

      // If it's a newline (LF or CR) and we're not in a quoted field,
      // move on to the next row and move to column 0 of that new row
      if (cc == '\n' && !quote) { ++row; col = 0; continue; }
      if (cc == '\r' && !quote) { ++row; col = 0; continue; }

      // Otherwise, append the current character to the current column
      arr[row][col] += cc;
  }
  return arr;
}


function readTextFile(file){
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false); // using synchronous call
  var allText;
  rawFile.onreadystatechange = function ()
  {   
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              allText = rawFile.responseText;
          }
      }
  }
  rawFile.send(null);
  return allText;
}

let dataYears = [];
let dataDK = [];
let dataSE = [];

let dataRaw = readTextFile('./HMDclean.csv');
let dataParsed = parseCSV(dataRaw);
let dataCols = dataParsed[0].map((_, colIndex) => dataParsed.map(row => row[colIndex]));

let dataYears_str = dataCols[0];
dataYears_str.shift();
// console.log(dataYears_str);

let dataDK_str = dataCols[1];
dataDK_str.shift();
// console.log(dataDK_str);

let dataSE_str = dataCols[2];
dataSE_str.shift();
// console.log(dataSE_str);

dataYears_str.forEach(element => {
  dataYears.push(parseInt(element));
});
dataDK_str.forEach(element => {
  dataDK.push(parseFloat(element));
});
dataSE_str.forEach(element => {
  dataSE.push(parseFloat(element));
});


// --------------------------
// ---- P5 drawing stuff ----
// --------------------------
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
  sketch.line(0,0,0,-ax_H);
  // Arrows
  let arrowSize = 10;
  sketch.line(ax_W,0,ax_W-arrowSize,arrowSize/2);
  sketch.line(ax_W,0,ax_W-arrowSize,-arrowSize/2);
  sketch.line(0,-ax_H,arrowSize/2,-ax_H+arrowSize);
  sketch.line(0,-ax_H,-arrowSize/2,-ax_H+arrowSize);

  sketch.pop()
  // --- Ticks ---
  let tickSize = 5;
  // - Y ticks -
  let allYticks = [8,8.5,9,9.5,10,10.5,11]
  // let curTick = 10.5;
  allYticks.forEach(curTick => {
    let curY = valueToScreenY(curTick);
    // If not outside range of axis
    if ((curY + ax_H > ax_0_Y) & (curY < ax_0_Y)){
      
      sketch.stroke(clrAxes);
      sketch.strokeWeight(2);
      sketch.line(ax_0_X-tickSize,curY,ax_0_X+tickSize,curY);
      sketch.noStroke();
      sketch.fill(0);
      sketch.textSize(14);
      sketch.textAlign(sketch.RIGHT,sketch.CENTER);
      sketch.textStyle(sketch.BOLD);
      let curText = curTick.toString().replace('.',',');
      sketch.text(curText,ax_0_X-tickSize*2,curY)
    }
  });
  // - X ticks -
  for (let curTick = 1999; curTick < 2022; curTick++) {
    
    let curX = valueToScreenX(curTick);
    // If not outside range of axis
    if (curX > ax_0_X){
        sketch.stroke(clrAxes);
        sketch.strokeWeight(2);
        sketch.line(curX,ax_0_Y-tickSize,curX,ax_0_Y+tickSize);

        // if ((curTick % toModulo) == 0){
            sketch.noStroke();
            sketch.fill(0);
            sketch.textSize(14);
            sketch.textAlign(sketch.CENTER,sketch.TOP);
            sketch.textStyle(sketch.BOLD);
            let curText = curTick.toString().replace('.',',');
            if (yearStart < 2010){
              curText = "'" + curText[2] +curText[3]
            }
            sketch.text(curText,curX,ax_0_Y+tickSize*2)
        // }
    }
  }

  // -- Y-label -- 
  sketch.push()
  sketch.translate(axMarginExtraY,ax_0_Y - ax_H/2)
  sketch.rotate(-sketch.PI/2);
  sketch.noStroke();
  sketch.fill(0);
  sketch.textSize(18);
  sketch.textAlign(sketch.CENTER,sketch.CENTER);
  sketch.textStyle(sketch.NORMAL);
  sketch.text('Dødsfald per 1000 borgere',0,0)
  sketch.pop()

  // sketch.strokeWeight(2)
  // for (let k = 1; k < ax_NumTicks_X; k++) {
  //   sketch.line(k*xTicksStep,-arrowSize/3,k*xTicksStep,+arrowSize/3)    

  // }

  
  //   // Ticks (From uncertainty article)
  //   sketch.noStroke();
  //   sketch.fill(0);
  //   sketch.textSize(14);
  //   sketch.textAlign(sketch.CENTER,sketch.CENTER);
  //   sketch.text(0,0,15)

  //   sketch.push();
  //   for (let k = 1; k < ax_NumTicks_X; k++) {
      
  //     sketch.strokeWeight(2)
  //     sketch.stroke(clrAxes);
  //     sketch.translate(xTicksStep,0)
  //     sketch.line(0,-arrowSize/3,0,+arrowSize/3)    

      
  //     sketch.noStroke();
  //     sketch.fill(0);
  //     // sketch.text(xTicksDiff*k,0,15)
  //     sketch.text(xTicksDiff*k * 10,0,15)
  //   }
  //   sketch.translate(xTicksStep,0)
  //   sketch.noStroke();
  //   sketch.fill(0);
  //   // sketch.text(xTicksDiff*ax_NumTicks_X,0,15)
  //   sketch.text(xTicksDiff*ax_NumTicks_X*10,0,15)
  //   sketch.text('days',0,25)

  //   sketch.pop();
  //   // Y-Ticks
  //   sketch.noStroke();
  //   sketch.fill(0);
  //   sketch.textAlign(sketch.RIGHT,sketch.CENTER);
  //   sketch.text(0,-10,0)

  //   sketch.push();
  //   // ax_NumTicks_Y = 5;
  //   // yTicksStep = xTicksStep/2;
  //   for (let k = 1; k < ax_NumTicks_Y; k++) {
      
  //     sketch.strokeWeight(2)
  //     sketch.stroke(clrAxes);
  //     sketch.translate(0,yTicksStep)
  //     sketch.line(-arrowSize/3,0,+arrowSize/3,0)

      
  //     sketch.noStroke();
  //     sketch.fill(0);
  //     sketch.text(yTicksDiff*k,-10,0) // Procent af befolkningen
  //     // sketch.text(yTicksDiff*k * 6/100,-10,0) // Millioner personer

  //   }
  //   sketch.translate(0,yTicksStep)
  //   sketch.noStroke();
  //   sketch.fill(0);
  //   sketch.text(yTicksDiff*ax_NumTicks_Y,-10,0) // Procent af befolkningen
  //   // sketch.text(yTicksDiff*ax_NumTicks_Y *  6/100,-10,0) // Millioner personer
    
    
  //   sketch.text('%',0,-20) 
    
  //   sketch.pop();



}
// let yearMin = dataYears[0]-1;
// let yearMax = dataYears[dataYears.length-1]+2;
let yearMin = yearStart;
let yearMax = yearEnd+2.5;
let valMin = 8.5
let valMax = 11.5

function valueToScreenX(year){
  return ax_0_X + ((year-yearMin)/(yearMax-yearMin)) * ax_W
}
function valueToScreenY(val){
  return ax_0_Y - ((val-valMin)/(valMax-valMin)) * ax_H
}

let drawData = (sketch) => {
  // let testYear = 2010;
  // let testVal = 9.5;
  // let x = valueToScreenX(testYear);
  // let y = valueToScreenY(testVal);
  // console.log(y);

  // sketch.push()
  // sketch.translate(ax_0_X,ax_0_Y);
  sketch.stroke(155);
  sketch.strokeWeight(10);
  // sketch.line(ax_0_X,ax_0_Y,x,y);
  // sketch.point(x,y);
  // sketch.line(0,0,10,10);
  // sketch.pop();


  // Plot all data-points
  for (let i = 0; i < dataYears.length ; i++) {
    const curYear = dataYears[i];
    const curDK = dataDK[i];
    const curSE = dataSE[i];

    
    let x = valueToScreenX(curYear);
    let yDK = valueToScreenY(curDK);
    let ySE = valueToScreenY(curSE);

    if (x > ax_0_X){
      if (flagShowDK){
        sketch.stroke(clrDK);
        sketch.point(x,yDK); 
      }
      if (flagShowSE){
        sketch.stroke(clrSE);
        sketch.point(x,ySE); 
      }    
    }
  }

  sketch.strokeWeight(5);
  // Plot data-points used larger
  // let firstToUse = 12;
  // let lastToUse = 18;
  let firstToUse = yearStart-dataYears[0];
  let lastToUse = yearEnd-dataYears[0] +1;
  for (let i = firstToUse; i < lastToUse ; i++) {
    const curYear = dataYears[i];
    const curDK = dataDK[i];
    const curSE = dataSE[i];

    
    let x = valueToScreenX(curYear);
    let yDK = valueToScreenY(curDK);
    let ySE = valueToScreenY(curSE);

    if (flagShowDK){
      sketch.stroke(clrDK);
      sketch.line(x-symbolSize,yDK-symbolSize,x+symbolSize,yDK+symbolSize);
      sketch.line(x-symbolSize,yDK+symbolSize,x+symbolSize,yDK-symbolSize);
    }
    if (flagShowSE){
      sketch.stroke(clrSE);
      sketch.line(x-symbolSize,ySE-symbolSize,x+symbolSize,ySE+symbolSize);
      sketch.line(x-symbolSize,ySE+symbolSize,x+symbolSize,ySE-symbolSize);
    }
    
  }

}


let maxAll = 0;
let minAll = 20;
function calcYlimits(){
  // For automatic y-limits
  maxAll = 0;
  minAll = 20;
  
  let firstToShow = yearStart-dataYears[0];
  let lastToShow = 20;
  for (let i = firstToShow; i < lastToShow ; i++) {
    const curDK = dataDK[i];
    const curSE = dataSE[i];
    // For automatic y-limits
    if (flagShowDK){
      if (curDK > maxAll){
        maxAll = curDK;
      }
      if (curDK < minAll){
        minAll = curDK;
      }
    }
    if (flagShowSE){
      if (curSE > maxAll){
        maxAll = curSE;
      }
      if (curSE < minAll){
        minAll = curSE;
      }
    }
  }
  
  // For automatic y-limits
  valMax = maxAll*1.05;
  valMin = minAll*0.95;
}

let averageDK = 0;
let averageSE = 0;
function calcAverage(){
  

  let firstToUse = yearStart-dataYears[0];
  let lastToUse = yearEnd-dataYears[0] +1;
  averageDK = 0;
  averageSE = 0;
  let numYears = 0;
  for (let i = firstToUse; i < lastToUse ; i++) {
    const curDK = dataDK[i];
    const curSE = dataSE[i];

    averageDK = averageDK + curDK;
    averageSE = averageSE + curSE;
    numYears = numYears + 1;
    
  }

  averageDK = averageDK / numYears;
  averageSE = averageSE / numYears;

}


let linearDK = [];
let linearSE = [];
let slopeDK = 0;
let interDK = 0;
let pred_linear_2020_DK = 0;
let pred_linear_2021_DK = 0;
let pred_linear_2020_SE = 0;
let pred_linear_2021_SE = 0;
function calcLinearParameters(){
  let firstToUse = yearStart-dataYears[0];
  let lastToUse = yearEnd-dataYears[0] +1;
  linearDK = [];
  linearSE = [];
  let N;
  let sumX ;
  let sumY ;
  let sumX2;
  let sumXY;
  let top1;
  let top2;
  let bot1;
  let bot2;
  let intersect;
  let slope;

  
  N = 0;
  sumX  = 0;
  sumY  = 0;
  sumX2 = 0;
  sumXY = 0;

  // Calculate DK
  for (let i = firstToUse; i < lastToUse ; i++) {
    const X = dataYears[i] - dataYears[0];
    const Y = dataDK[i];
    const X2 = X * X;
    const XY = X * Y;
    

    N = N + 1;
    sumX = sumX + X;
    sumY = sumY + Y;
    sumX2 = sumX2 + X2;
    sumXY = sumXY + XY;
  }

  top1 = sumY*sumX2;
  top2 = sumX*sumXY;
  bot1 = N * sumX2;
  bot2 = sumX*sumX;
  intersect = (top1-top2)/(bot1-bot2);
  // console.log(intersect); 

  top1 = N * sumXY;
  top2 = sumX*sumY;
  bot1 = N*sumX2;
  bot2 = sumX*sumX;
  slope = (top1-top2)/(bot1-bot2);
  // console.log(slope);

  interDK = intersect;
  slopeDK = slope;

  // Calculate SE  
  N = 0;
  sumX  = 0;
  sumY  = 0;
  sumX2 = 0;
  sumXY = 0;

  for (let i = firstToUse; i < lastToUse ; i++) {
    const X = dataYears[i] - dataYears[0];
    const Y = dataSE[i];
    const X2 = X * X;
    const XY = X * Y;
    

    N = N + 1;
    sumX = sumX + X;
    sumY = sumY + Y;
    sumX2 = sumX2 + X2;
    sumXY = sumXY + XY;
  }

  top1 = sumY*sumX2;
  top2 = sumX*sumXY;
  bot1 = N * sumX2;
  bot2 = sumX*sumX;
  intersect = (top1-top2)/(bot1-bot2);
  // console.log(intersect); 

  top1 = N * sumXY;
  top2 = sumX*sumY;
  bot1 = N*sumX2;
  bot2 = sumX*sumX;
  slope = (top1-top2)/(bot1-bot2);
  // console.log(slope);

  interSE = intersect;
  slopeSE = slope;

  for (let i = 0; i < dataYears.length; i++) {
    const curYear = dataYears[i] - dataYears[0];
    let curDK = slopeDK * curYear + interDK;
    linearDK.push(curDK)
    let curSE = slopeSE * curYear + interSE;
    linearSE.push(curSE)
  }

  pred_linear_2020_DK = slopeDK * (2020-dataYears[0]) + interDK;
  pred_linear_2021_DK = slopeDK * (2021-dataYears[0]) + interDK;
  pred_linear_2020_SE = slopeSE * (2020-dataYears[0]) + interSE;
  pred_linear_2021_SE = slopeSE * (2021-dataYears[0]) + interSE;
  // averageDK = averageDK / numYears;
  // averageSE = averageSE / numYears;
}

function calcLinear(year,slope,intersect){
  return slope * (year-dataYears[0]) + intersect
}

let drawAverage = (sketch) => {

  let yAvgDK = valueToScreenY(averageDK);
  let yAvgSE = valueToScreenY(averageSE);

  if (flagShowDK){
    sketch.strokeWeight(1);
    sketch.stroke(clrDK);
    sketch.line(ax_0_X,yAvgDK,ax_0_X+ax_W,yAvgDK);
    
    // // Draw prediction
    // sketch.strokeWeight(3);
    // sketch.stroke(155);
    // // sketch.strokeWeight(predictionSize);
    // let predX = valueToScreenX(2020);
    // let predY = yAvgDK;
    // sketch.line(predX-predictionSize,predY,predX+predictionSize,predY);
    // sketch.line(predX,predY+predictionSize,predX,predY-predictionSize);
    // sketch.line(predX-predictionSize*0.66,predY+predictionSize*0.66,predX+predictionSize*0.66,predY-predictionSize*0.66);
    // sketch.line(predX+predictionSize*0.66,predY+predictionSize*0.66,predX-predictionSize*0.66,predY-predictionSize*0.66);
    // predX = valueToScreenX(2021);
    // predY = yAvgDK;
    // sketch.line(predX-predictionSize,predY,predX+predictionSize,predY);
    // sketch.line(predX,predY+predictionSize,predX,predY-predictionSize);
    // sketch.line(predX-predictionSize*0.66,predY+predictionSize*0.66,predX+predictionSize*0.66,predY-predictionSize*0.66);
    // sketch.line(predX+predictionSize*0.66,predY+predictionSize*0.66,predX-predictionSize*0.66,predY-predictionSize*0.66);

  }
  if (flagShowSE){
    sketch.strokeWeight(1);
    sketch.stroke(clrSE);
    sketch.line(ax_0_X,yAvgSE,ax_0_X+ax_W,yAvgSE);
    
    // // Draw prediction
    // sketch.strokeWeight(3);
    // sketch.stroke(155);
    // // sketch.strokeWeight(predictionSize);
    // let predX = valueToScreenX(2020);
    // let predY = yAvgSE;
    // sketch.line(predX-predictionSize,predY,predX+predictionSize,predY);
    // sketch.line(predX,predY+predictionSize,predX,predY-predictionSize);
    // sketch.line(predX-predictionSize*0.66,predY+predictionSize*0.66,predX+predictionSize*0.66,predY-predictionSize*0.66);
    // sketch.line(predX+predictionSize*0.66,predY+predictionSize*0.66,predX-predictionSize*0.66,predY-predictionSize*0.66);
    // predX = valueToScreenX(2021);
    // predY = yAvgSE;
    // sketch.line(predX-predictionSize,predY,predX+predictionSize,predY);
    // sketch.line(predX,predY+predictionSize,predX,predY-predictionSize);
    // sketch.line(predX-predictionSize*0.66,predY+predictionSize*0.66,predX+predictionSize*0.66,predY-predictionSize*0.66);
    // sketch.line(predX+predictionSize*0.66,predY+predictionSize*0.66,predX-predictionSize*0.66,predY-predictionSize*0.66);

  }

}

let drawLinear = (sketch) => {

  sketch.strokeWeight(3);
  if (flagShowDK){
    sketch.stroke(clrDK);

    // // Dot every year
    // for (let i = 0; i < linearDK.length; i++) {
    //   const curYear = dataYears[i];
    //   const curVal = linearDK[i];

    //   let curX = valueToScreenX(curYear);
    //   let curY = valueToScreenY(curVal);
    //   sketch.point(curX,curY);
    // }

    // Dotted line
    for (let i = yearMin-dataYears[0]; i < yearMax-dataYears[0]; i += 0.1) {
      
      const curYear = dataYears[0] + i;
      const curVal = calcLinear(curYear,slopeDK,interDK);

      let curX = valueToScreenX(curYear);
      let curY = valueToScreenY(curVal);
      sketch.point(curX,curY);
      
    }

    // // Draw prediction
    // sketch.stroke(155);
    // // sketch.strokeWeight(predictionSize);
    // let predX = valueToScreenX(2020);
    // let predY = valueToScreenY(pred_linear_2020_DK);
    // sketch.line(predX-predictionSize,predY,predX+predictionSize,predY);
    // sketch.line(predX,predY+predictionSize,predX,predY-predictionSize);
    // sketch.line(predX-predictionSize*0.66,predY-predictionSize*0.66,predX+predictionSize*0.66,predY+predictionSize*0.66);
    // sketch.line(predX+predictionSize*0.66,predY-predictionSize*0.66,predX-predictionSize*0.66,predY+predictionSize*0.66);
    // predX = valueToScreenX(2021);
    // predY = valueToScreenY(pred_linear_2021_DK);
    // sketch.line(predX-predictionSize,predY,predX+predictionSize,predY);
    // sketch.line(predX,predY+predictionSize,predX,predY-predictionSize);
    // sketch.line(predX-predictionSize*0.66,predY-predictionSize*0.66,predX+predictionSize*0.66,predY+predictionSize*0.66);
    // sketch.line(predX+predictionSize*0.66,predY-predictionSize*0.66,predX-predictionSize*0.66,predY+predictionSize*0.66);
  }
  
  if (flagShowSE){
    sketch.stroke(clrSE);

    // // Dot every year
    // for (let i = 0; i < linearSE.length; i++) {
    //   const curYear = dataYears[i];
    //   const curVal = linearSE[i];

    //   let curX = valueToScreenX(curYear);
    //   let curY = valueToScreenY(curVal);
    //   sketch.point(curX,curY);
    // }

    // Dotted line
    for (let i = yearMin-dataYears[0]; i < yearMax-dataYears[0]; i += 0.1) {
      
      const curYear = dataYears[0] + i;
      const curVal = calcLinear(curYear,slopeSE,interSE);

      let curX = valueToScreenX(curYear);
      let curY = valueToScreenY(curVal);
      sketch.point(curX,curY);
      
    }

    // // Draw prediction
    // sketch.stroke(155);
    // // sketch.strokeWeight(predictionSize);
    // let predX = valueToScreenX(2020);
    // let predY = valueToScreenY(pred_linear_2020_SE);
    // sketch.line(predX-predictionSize,predY,predX+predictionSize,predY);
    // sketch.line(predX,predY+predictionSize,predX,predY-predictionSize);
    // sketch.line(predX-predictionSize*0.66,predY-predictionSize*0.66,predX+predictionSize*0.66,predY+predictionSize*0.66);
    // sketch.line(predX+predictionSize*0.66,predY-predictionSize*0.66,predX-predictionSize*0.66,predY+predictionSize*0.66);
    // predX = valueToScreenX(2021);
    // predY = valueToScreenY(pred_linear_2021_SE);
    // sketch.line(predX-predictionSize,predY,predX+predictionSize,predY);
    // sketch.line(predX,predY+predictionSize,predX,predY-predictionSize);
    // sketch.line(predX-predictionSize*0.66,predY-predictionSize*0.66,predX+predictionSize*0.66,predY+predictionSize*0.66);
    // sketch.line(predX+predictionSize*0.66,predY-predictionSize*0.66,predX-predictionSize*0.66,predY+predictionSize*0.66);
  }
}

function drawPredictionLineLinear(sketch){
  if (flagShowDK) {
    let pred2020 = calcLinear(2020,slopeDK,interDK);
    let pred2021 = calcLinear(2021,slopeDK,interDK);

    let x
    let y1
    let y2
    let curDiff;
    // console.log(dataDK);
    x = valueToScreenX(2020.1);
    y1 = valueToScreenY(dataDK[20]);
    y2 = valueToScreenY(pred2020);
    curDiff = dataDK[20] - pred2020;

    if (dataDK[20] <= pred2020){
      sketch.stroke(clrGood);
    } else {
      sketch.stroke(clrBad);
    }
    sketch.strokeWeight(6);
    sketch.line(x,y1,x,y2);

    // Show a label for excess
    let curLabel;
    sketch.strokeWeight(2);
    sketch.stroke(155);
    sketch.line(x+5,(y1+y2)/2,x+10,50);
    sketch.fill(0);
    sketch.noStroke();
    sketch.textSize(12);
    sketch.textAlign(sketch.CENTER,sketch.CENTER);
    sketch.textStyle(sketch.NORMAL);
    curLabel = Math.round(curDiff*DKpop).toString();
    sketch.text(curLabel,x+10,40)
    sketch.text('Lineær',x+10,25)


    x = valueToScreenX(2021.1);
    y1 = valueToScreenY(dataDK[21]);
    y2 = valueToScreenY(pred2021);
    curDiff = dataDK[21] - pred2021;

    if (dataDK[21] <= pred2021){
      sketch.stroke(clrGood);
    } else {
      sketch.stroke(clrBad);
    }
    sketch.strokeWeight(6);
    sketch.line(x,y1,x,y2);

    // Show a label for excess
    sketch.strokeWeight(2);
    sketch.stroke(155);
    sketch.line(x+5,(y1+y2)/2,x+10,50);
    sketch.fill(0);
    sketch.noStroke();
    sketch.textSize(12);
    sketch.textAlign(sketch.CENTER,sketch.CENTER);
    sketch.textStyle(sketch.NORMAL);
    curLabel = Math.round(curDiff*DKpop).toString();
    sketch.text(curLabel,x+10,40)
    sketch.text('Lineær',x+10,25)

  }
  
  if (flagShowSE) {
    let pred2020 = calcLinear(2020,slopeSE,interSE);
    let pred2021 = calcLinear(2021,slopeSE,interSE);

    let x
    let y1
    let y2
    let curDiff;
    // console.log(dataSE);
    x = valueToScreenX(2020.1);
    y1 = valueToScreenY(dataSE[20]);
    y2 = valueToScreenY(pred2020);
    curDiff = dataSE[20] - pred2020;

    if (dataSE[20] <= pred2020){
      sketch.stroke(clrGood);
    } else {
      sketch.stroke(clrBad);
    }
    sketch.strokeWeight(6);
    sketch.line(x,y1,x,y2);
    // Show a label for excess
    sketch.strokeWeight(2);
    sketch.stroke(155);
    sketch.line(x+5,(y1+y2)/2,x+10,70);
    sketch.fill(0);
    sketch.noStroke();
    sketch.textSize(12);
    sketch.textAlign(sketch.CENTER,sketch.CENTER);
    sketch.textStyle(sketch.NORMAL);
    curLabel = Math.round(curDiff*SEpop).toString();
    sketch.text(curLabel,x+10,50)
    sketch.text('Lineær',x+10,30)

    // 2021
    x = valueToScreenX(2021.1);
    y1 = valueToScreenY(dataSE[21]);
    y2 = valueToScreenY(pred2021);
    curDiff = dataSE[21] - pred2021;

    if (dataSE[21] <= pred2021){
      sketch.stroke(clrGood);
    } else {
      sketch.stroke(clrBad);
    }
    sketch.strokeWeight(6);
    sketch.line(x,y1,x,y2);

    // Show a label for excess
    sketch.strokeWeight(2);
    sketch.stroke(155);
    sketch.line(x+5,(y1+y2)/2,x+10,70);
    sketch.fill(0);
    sketch.noStroke();
    sketch.textSize(12);
    sketch.textAlign(sketch.CENTER,sketch.CENTER);
    sketch.textStyle(sketch.NORMAL);
    curLabel = Math.round(curDiff*SEpop).toString();
    sketch.text(curLabel,x+10,50)
    sketch.text('Lineær',x+10,30)

  }
}

function drawPredictionLineAverage(sketch){
  if (flagShowDK) {
    let pred2020 = averageDK
    let pred2021 = averageDK;

    let x
    let y1
    let y2
    let curDiff;
    // console.log(dataSE);
    x = valueToScreenX(2020 - 0.1);
    y1 = valueToScreenY(dataDK[20]);
    y2 = valueToScreenY(pred2020);
    curDiff = dataDK[20] - pred2020;

    if (dataDK[20] <= pred2020){
      sketch.stroke(clrGood);
    } else {
      sketch.stroke(clrBad);
    }
    sketch.strokeWeight(6);
    sketch.line(x,y1,x,y2);
    // Show a label for excess
    sketch.strokeWeight(2);
    sketch.stroke(155);
    sketch.line(x-5,(y1+y2)/2,x-15,100);
    sketch.fill(0);
    sketch.noStroke();
    sketch.textSize(12);
    sketch.textAlign(sketch.CENTER,sketch.CENTER);
    sketch.textStyle(sketch.NORMAL);
    curLabel = Math.round(curDiff*DKpop).toString();
    sketch.text(curLabel,x-15,90)
    sketch.text('Gnmsnit',x-15,75)


    x = valueToScreenX(2021 - 0.1);
    y1 = valueToScreenY(dataDK[21]);
    y2 = valueToScreenY(pred2021);
    curDiff = dataDK[21] - pred2021;

    if (dataDK[21] <= pred2021){
      sketch.stroke(clrGood);
    } else {
      sketch.stroke(clrBad);
    }
    sketch.strokeWeight(6);
    sketch.line(x,y1,x,y2);

    // Show a label for excess
    sketch.strokeWeight(2);
    sketch.stroke(155);
    sketch.line(x-5,(y1+y2)/2,x-15,100);
    sketch.fill(0);
    sketch.noStroke();
    sketch.textSize(12);
    sketch.textAlign(sketch.CENTER,sketch.CENTER);
    sketch.textStyle(sketch.NORMAL);
    curLabel = Math.round(curDiff*DKpop).toString();
    sketch.text(curLabel,x-15,90)
    sketch.text('Gnmsnit',x-15,75)


  }
  
  if (flagShowSE) {
    let pred2020 = averageSE;
    let pred2021 = averageSE;

    let x
    let y1
    let y2
    // console.log(dataSE);
    x = valueToScreenX(2020 - 0.1);
    y1 = valueToScreenY(dataSE[20]);
    y2 = valueToScreenY(pred2020);
    curDiff = dataSE[20] - pred2020;

    if (dataSE[20] <= pred2020){
      sketch.stroke(clrGood);
    } else {
      sketch.stroke(clrBad);
    }
    sketch.strokeWeight(6);
    sketch.line(x,y1,x,y2);
    // Show a label for excess
    sketch.strokeWeight(2);
    sketch.stroke(155);
    sketch.line(x-5,(y1+y2)/2,x-15,100);
    sketch.fill(0);
    sketch.noStroke();
    sketch.textSize(12);
    sketch.textAlign(sketch.CENTER,sketch.CENTER);
    sketch.textStyle(sketch.NORMAL);
    curLabel = Math.round(curDiff*SEpop).toString();
    sketch.text(curLabel,x-15,90)
    sketch.text('Gnmsnit',x-15,75)


    x = valueToScreenX(2021 - 0.1);
    y1 = valueToScreenY(dataSE[21]);
    y2 = valueToScreenY(pred2021);
    curDiff = dataSE[21] - pred2021;

    if (dataSE[21] <= pred2021){
      sketch.stroke(clrGood);
    } else {
      sketch.stroke(clrBad);
    }
    sketch.strokeWeight(6);
    sketch.line(x,y1,x,y2);

    // Show a label for excess
    sketch.strokeWeight(2);
    sketch.stroke(155);
    sketch.line(x-5,(y1+y2)/2,x-15,100);
    sketch.fill(0);
    sketch.noStroke();
    sketch.textSize(12);
    sketch.textAlign(sketch.CENTER,sketch.CENTER);
    sketch.textStyle(sketch.NORMAL);
    curLabel = Math.round(curDiff*SEpop).toString();
    sketch.text(curLabel,x-15,90)
    sketch.text('Gnmsnit',x-15,75)

  }
}

// ---- Main sketch ----
const sketchMain = ( sketch ) => {
  

  // let numAniPointsIni = 0;
  // let numAniPoints = maxAniPoints;
  // // let numAniPoints = 0;
  // // let numAniPoints = 1;
  // let allAniPoints = [];
  // let allAniPoints_redu = [];
  // let framesBetweenNewAni = 5;

  sketch.setup = () =>{
    sketch.createCanvas(sketchW,sketchH);
  }

  sketch.draw = () =>{
    // sketch.background(255);
    sketch.background(clrBackground);
    drawBackground(sketch);
    
   

    drawAverage(sketch);

    drawLinear(sketch);

    drawPredictionLineAverage(sketch);
    drawPredictionLineLinear(sketch);

    drawData(sketch);

    drawAxes(sketch);

  }
}


// --------------------------------
// ---- Final things ----
// --------------------------------

let mainP5 = new p5(sketchMain,document.getElementById('p5Div'));


let mainFunc = function(){
  // readData();

  readAndSet();
  calcYlimits();
  calcAverage();
  calcLinearParameters();


  // calcData();
}

// Read, set and update everything on first run-through
mainFunc();
calcAverage();
