let canvasWidth = 1000;
let canvasHeight = 1000;

// let debug = true;
let debug = false;

let imgPrey;
let imgPred;

let allPrey = [];
let allPred = [];

let allSkulls = [];
let skullMaxTime = 30;
let skullSize = 50;

let allDeco = [];
let numDeco =  500;
let decoSize = 20;

let initPrey = 20;
let initPred = 20;

let preySize = 50;
let preyMoveDist = 200;
let preyMoveSpeed = 100;
let predSize = 70;
let predMoveDist = 250;
let predMoveSpeed = 50;

let eatDist = 1000;

//
let clrGrass = [55,155,55];

// Flags for turning of parts of simulations
let flagBirth = true;
let flagDeath = true;
let flagEat = true;

// More flags
let flagSettings = false;
let flagStats = false;
let flagExamples = false;
let flagRunning = true;
let flagOverExamplesButton = false;
let flagOverSettingsButton = false;
let flagOverStatsButton = false;
let flagOverRestartButton = false;

// --- Examples and settings screen ---
let exaClr = [150,250,150];
let exaMargin = 100;
let exaFrame = 0;
let exaFrameMax = 100;
let exaFontSize = 22;

// Positioning of examples on settings screen
let exaW = canvasWidth  - (exaMargin*2)
let exaH = canvasHeight - (exaMargin*2)
let exampleH = 150;
let exampleW = exampleH*2;
let exampleWDiff = 70;
let exampleHDiff = 70;
let exaX = exampleWDiff;
let exaX2 = exaW - exampleW - exampleWDiff*2.3;
let exaBirthY = exampleHDiff;
let exaDeathY = exampleH+exampleHDiff*2;
let exaEatY = exampleH*2+exampleHDiff*3;


let txtExaBirth_EN = 'Prey gives birth \nat random intervals.\nSet probability:';
let txtExaDeath_EN = 'Predators die from starvation \nat random intervals.\nSet probability:';
let txtExaEat_EN = 'When meeting, predators eat prey.\nWith a random probability, \na new predator is born.\nSet probability:';
// let txtExaEat_EN = 'When meeting, predators eat prey \nNew predators are randomly\nborn at the same time.';

let txtExaBirth = txtExaBirth_EN;
let txtExaDeath = txtExaDeath_EN;
let txtExaEat = txtExaEat_EN;

// Interactivity
let sliderBirth;
let sliderDeath;
let sliderEat;


// For showing results
let saveFreq = 30; // How long between frames to save
let historyPrey = [];
let historyPred = [];


// Define model-parameters
let alpha = 0.005;
// let beta = 0.02;
let gamma = 0.5;
let delta = 0.0025;

let alphaMax = 0.01;
let gammaMax = 1;
let deltaMax = 0.01;

function setup() {
  createCanvas(canvasWidth,canvasHeight);

  // imgPrey = loadImage('images/sheep.png');
  imgPrey = loadImage('images/1F407_color.png');
  imgPred = loadImage('images/predator.png');
  // Decorations
  imgPlant1 = loadImage('images/1F331_color.png');
  imgPlant2 = loadImage('images/1F33F_color.png');
  imgPlant3 = loadImage('images/1F33C_color.png');
  imgPoof = loadImage('images/1F4A5_color.png');
  imgSkull = loadImage('images/2620_color.png');
  imgSkull2 = loadImage('images/1F480_color.png');
  imgExamples = loadImage('images/2754_color.png');
  imgSettings = loadImage('images/2699_color.png');
  imgStats = loadImage('images/1F4CA_color.png');
  imgRestart = loadImage('images/1F504_color.png');


  // Setup sliders
  sliderBirth = createSlider(0,alphaMax,alpha,0.001);
  sliderDeath = createSlider(0,deltaMax,delta,0.001);
  sliderEat = createSlider(0,gammaMax,gamma,0.1);

  let sliderWidth = 200;
  sliderBirth.position(exaX2+exaMargin+sliderWidth/2,exaBirthY+exaMargin*2.4);
  sliderBirth.style('width',sliderWidth+'px');
  sliderDeath.position(exaX2+exaMargin+sliderWidth/2,exaDeathY+exaMargin*2.4);
  sliderDeath.style('width',sliderWidth+'px');
  sliderEat.position(exaX2+exaMargin+sliderWidth/2,exaEatY+exaMargin*2.4);
  sliderEat.style('width',sliderWidth+'px');


  // Start simulation
  startSimulation()
}

function startSimulation(){
  allPrey = [];
  allPred = [];
  allDeco = [];

  for (let k = 0; k < initPrey; k++) {
    allPrey.push(new Prey(random(canvasWidth),random(canvasHeight)))
  }
  for (let k = 0; k < initPred; k++) {
    allPred.push(new Predator(random(canvasWidth),random(canvasHeight)))
  }
  
  for (let k = 0; k < numDeco; k++) {
    allDeco.push(new Decoration(random(canvasWidth),random(canvasHeight)))
  }  

  flagRunning = true;
}

function draw() {
  background(55,155,55);
  background(clrGrass);

  // Read sliders
  alpha = sliderBirth.value();
  delta = sliderDeath.value();
  gamma = sliderEat.value();
  
  // Save results every X frames
  if (flagRunning) {
    if ((frameCount % saveFreq)==0){
      historyPred.push(allPred.length)
      historyPrey.push(allPrey.length)
      // console.log([allPrey.length,allPred.length])
      // console.log(historyPred)
    }
  }


  for (let k = 0; k < allDeco.length; k++) {
    allDeco[k].display()
  }

  
  for (let k = allSkulls.length-1; k>=0; k--) { 
    allSkulls[k].display();
    allSkulls[k].time += 1;

    if (allSkulls[k].time > skullMaxTime){
      allSkulls.splice(k,1);
    }
  }

  for (let k = 0; k < allPrey.length; k++) {
    // allPrey.push(new Prey(random(canvasWidth),random(canvasHeight)))
    allPrey[k].display()
    if (flagRunning) {
      allPrey[k].move()
      if (flagBirth){
        allPrey[k].tryBirth();
      }
    }
  }

  for (let k = allPred.length-1; k>=0; k--) {
    allPred[k].display()
    
    if (flagRunning) {
      allPred[k].move()

      // Death of prey and birth of predator
      if (flagEat){
        for (let j = allPrey.length-1; j>=0; j--) {
          let curDistX = (allPrey[j].pos.x - allPred[k].pos.x)
          let curDistY = (allPrey[j].pos.y - allPred[k].pos.y)        
          let curDistSq = (curDistX*curDistX) + (curDistY*curDistY)
          if (curDistSq < eatDist){
            // Add a skull
            allSkulls.push(new Skull(allPrey[j].pos.x,allPrey[j].pos.y))
            allPrey.splice(j,1);
            allPred[k].tryBirth();
          }
        }
      }

      // Random predator deaths
      if (flagDeath){
        if (random() <= delta){
          // Add a skull
          allSkulls.push(new Skull(allPred[k].pos.x,allPred[k].pos.y))
          // Remove from array
          allPred.splice(k,1);
        }
      }
      
    }
  }
  // Restart simulation if one species dies out
  if (allPrey.length == 0){
    flagRunning = false;
    // noLoop()

    fill(0);
    noStroke();
    textSize(32);
    textAlign(CENTER, CENTER);
    text('All prey got eaten', canvasWidth/2,canvasHeight/2)

    // startSimulation();
  }
  if (allPred.length == 0){
    flagRunning = false;
    // noLoop()

    fill(0);
    noStroke();
    textSize(32);
    textAlign(CENTER, CENTER);
    text('All predators died out', canvasWidth/2,canvasHeight/2)

    // startSimulation();
  }

  // Buttons
  // let buttonExamples;
  // let buttonSettings;
  let buttonSize = 70;
  // let butExaX = canvasWidth-buttonSize - 5;
  // let butSetX = butExaX - buttonSize - 10;
  let butSetX = canvasWidth-buttonSize - 5;
  let butStaX = butSetX - buttonSize - 10;
  let butResX = butStaX - buttonSize - 10;
  let buttonY = canvasHeight-buttonSize - 5;
  
  let buttonFill = [0,0,0,50];
  let buttonFillMouseOver = [150,150,150,100];
  let buttonFillActive = [150,150,250,150];
  let buttonStroke = [0,0,0,150];
  strokeWeight(5);
  // stroke(0,0,0,150);
  fill(0,0,0,50);
  stroke(buttonStroke[0],buttonStroke[1],buttonStroke[2],buttonStroke[3])
  fill(buttonFill[0],buttonFill[1],buttonFill[2],buttonFill[3])

  // // Examples button detection
  // if (
  //   mouseX > butExaX &&
  //   mouseY > buttonY &&
  //   mouseX < butExaX + buttonSize &&
  //   mouseY < buttonY  + buttonSize 
  // ) {
  //   flagOverExamplesButton = true;
  //   fill(buttonFillMouseOver[0],buttonFillMouseOver[1],buttonFillMouseOver[2],buttonFillMouseOver[3])
  // } else {
  //   flagOverExamplesButton = false;
  //   fill(buttonFill[0],buttonFill[1],buttonFill[2],buttonFill[3])
  // }
  // if (flagExamples){
  //   fill(buttonFillActive[0],buttonFillActive[1],buttonFillActive[2],buttonFillActive[3])    
  // }
  // let buttonExamplesBox = rect(butExaX,buttonY,buttonSize,buttonSize,10);

  // Settings button detection
  if (
    mouseX > butSetX &&
    mouseY > buttonY &&
    mouseX < butSetX + buttonSize &&
    mouseY < buttonY  + buttonSize 
  ) {
    flagOverSettingsButton = true;
    fill(buttonFillMouseOver[0],buttonFillMouseOver[1],buttonFillMouseOver[2],buttonFillMouseOver[3])
  } else {
    flagOverSettingsButton = false;
    fill(buttonFill[0],buttonFill[1],buttonFill[2],buttonFill[3])
  }
  if (flagSettings){
    fill(buttonFillActive[0],buttonFillActive[1],buttonFillActive[2],buttonFillActive[3])    
  }
  let buttonSettingsBox = rect(butSetX,buttonY,buttonSize,buttonSize,10);

  
  // Stats button detection
  if (
    mouseX > butStaX &&
    mouseY > buttonY &&
    mouseX < butStaX + buttonSize &&
    mouseY < buttonY  + buttonSize 
  ) {
    flagOverStatsButton = true;
    fill(buttonFillMouseOver[0],buttonFillMouseOver[1],buttonFillMouseOver[2],buttonFillMouseOver[3])
  } else { 
    flagOverStatsButton = false;
    fill(buttonFill[0],buttonFill[1],buttonFill[2],buttonFill[3])
  }
  if (flagStats){
    fill(buttonFillActive[0],buttonFillActive[1],buttonFillActive[2],buttonFillActive[3])    
  }
  let buttonStatsBox = rect(butStaX,buttonY,buttonSize,buttonSize,10);
  
  // Restart button detection
  if (
    mouseX > butResX &&
    mouseY > buttonY &&
    mouseX < butResX + buttonSize &&
    mouseY < buttonY  + buttonSize 
  ) {
    flagOverRestartButton = true;
    fill(buttonFillMouseOver[0],buttonFillMouseOver[1],buttonFillMouseOver[2],buttonFillMouseOver[3])
  } else {
    flagOverRestartButton = false;
    fill(buttonFill[0],buttonFill[1],buttonFill[2],buttonFill[3])
  }
  let buttonRestartBox = rect(butResX,buttonY,buttonSize,buttonSize,10);
  
  // Show symbols over buttons
  // let buttonExamples = image(imgExamples,butExaX,buttonY, buttonSize,buttonSize);
  let buttonSettings = image(imgSettings,butSetX,buttonY, buttonSize,buttonSize);
  let buttonStats = image(imgStats,butStaX,buttonY, buttonSize,buttonSize);
  let buttonRestart = image(imgRestart,butResX,buttonY, buttonSize,buttonSize);

  
  // // Examples screen
  // if (flagExamples){
  // Settings screen
  if (flagSettings){
    // Separate framecounter for examples screen
    exaFrame += 1; 
    if ((exaFrame % exaFrameMax)==0){
      exaFrame = 0
    }

    // Show sliders
    sliderBirth.show();
    sliderDeath.show();
    sliderEat.show();


    push();
    stroke(0)
    strokeWeight(7)
    fill(exaClr)
    translate(exaMargin,exaMargin)

    rect(0,0,exaW,exaH,20)


    // Birth example
    if (true){ 
      push();
      fill(clrGrass)
      translate(exaX,exaBirthY);
      rect(0,0,exampleW,exampleH,20);

      let xIni = exaMargin/2
      let xEnd = exampleW-(exaMargin/2);
      let curX = (xEnd - xIni) * easeInOutQuint(exaFrame/exaFrameMax) + xIni
      
      // if (exaFrame < exaFrameMax/2){ 
        
      //   image(imgPrey,curX-preySize/2,exampleH/2-preySize/2,preySize,preySize);
      //   image(imgPrey,curX-preySize/2,exampleH/2-preySize/2,preySize,preySize);
      // } else {
        let yIni = exampleH/2
        let yEnd1 = exampleH/2 - exaMargin/4
        let yEnd2 = exampleH/2 + exaMargin/4
        let curY1 = (yEnd1 - yIni) * easeInOutQuint(exaFrame/exaFrameMax) + yIni
        let curY2 = (yEnd2 - yIni) * easeInOutQuint(exaFrame/exaFrameMax) + yIni

        image(imgPrey,curX-preySize/2,curY1-preySize/2,preySize,preySize);
        image(imgPrey,curX-preySize/2,curY2-preySize/2,preySize,preySize);
      // }

      translate(exaX2,exampleH/2);
      fill(0);
      noStroke();
      textSize(exaFontSize);
      textStyle(BOLD);
      textAlign(LEFT, CENTER);
      text(txtExaBirth,0,0)
      pop();
    }
    
    // Predator death example
    if (true){
      push();
      fill(clrGrass)
      // translate(exaMargin,exaMargin+exampleH+exampleHDiff);
      // translate(exaW - exampleW - exampleWDiff,exampleHDiff);
      translate(exaX,exaDeathY);
      rect(0,0,exampleW,exampleH,20);

      let xIni = exaMargin/2
      let xEnd = exampleW-(exaMargin/2);
      let curX = (xEnd - xIni) * easeInOutQuint(exaFrame/exaFrameMax) + xIni

      if (exaFrame < exaFrameMax/2){ 
        image(imgPred,curX-predSize/2,exampleH/2-predSize/2,predSize,predSize);
      } else {
        image(imgSkull,curX-predSize/2,exampleH/2-predSize/2,predSize,predSize);
      }

      translate(exaX2,exampleH/2);
      fill(0);
      noStroke();
      textSize(exaFontSize);
      textAlign(LEFT, CENTER);
      textStyle(BOLD);
      text(txtExaDeath,0,0)
      pop();
    }

    // Eat example
    if (true){
      push();
      fill(clrGrass)
      // translate(exampleWDiff,exampleH+exampleHDiff*3);
      translate(exaX,exaEatY);
      rect(0,0,exampleW,exampleH,20);

      let xIni = exaMargin/2
      let xEnd = exampleW-(exaMargin/2);
      let curX = (xEnd - xIni) * easeInOutQuint(exaFrame/exaFrameMax) + xIni
      let yIni1 = exampleH/2 + exaMargin/4
      let yIni2 = exampleH/2 - exaMargin/4
      let yEnd1 = exampleH/2 - exaMargin/4
      let yEnd2 = exampleH/2 + exaMargin/4
      let curY1 = (yEnd1 - yIni1) * easeInOutQuint(exaFrame/exaFrameMax) + yIni1
      let curY2 = (yEnd2 - yIni2) * easeInOutQuint(exaFrame/exaFrameMax) + yIni2

      if (exaFrame < exaFrameMax/2){ 
        image(imgPred,curX-predSize/2,curY1-predSize/2,predSize,predSize);
        image(imgPrey,curX-preySize/2,curY2-preySize/2,preySize,preySize);
      } else {
        // image(imgSkull,curX-preySize/2,curY1-preySize/2,preySize,preySize);
        image(imgPred,curX-predSize/2,curY1-predSize/2,predSize,predSize);
        image(imgPred,curX-predSize/2,curY2-predSize/2,predSize,predSize);
      }

      translate(exaX2,exampleH/2);
      fill(0);
      noStroke();
      textSize(exaFontSize);
      textAlign(LEFT, CENTER);
      textStyle(BOLD);
      text(txtExaEat,0,0)
      pop();
    }

    pop();
  } else {
    // Hide sliders 
    sliderBirth.hide();
    sliderDeath.hide();
    sliderEat.hide();
  }

}


function mousePressed(){
  if (flagOverSettingsButton){
    flagSettings = !flagSettings;
  }
  if (flagOverExamplesButton){
    flagExamples = !flagExamples;
  }
  if (flagOverStatsButton){
    flagStats = !flagStats;
  }
  if (flagOverRestartButton){
    startSimulation();
  }
}

class Prey {
  constructor(x,y){
    this.pos = createVector(x,y);
    // this.size = 50;
    this.moving = true;

    this.moveGoal = createVector(x,y);
    this.prevGoal = this.moveGoal;

    this.movesToGoal = random(preyMoveSpeed);

    this.flipped = true;
  }

  display(){
    // Show extra details if debug is on
    if (debug){
      fill(155,155,255)
      circle(this.moveGoal.x,this.moveGoal.y,preySize/2);
    }
    push()
    translate(this.pos.x,this.pos.y);
    if (debug){
      fill(155)
      circle(0,0,preySize);
    }

    // Flip image if flipped flag is set
    if (this.flipped){
      scale(-1,1)
    }

    image(imgPrey,-preySize/2,-preySize/2,preySize,preySize);


    pop()
  }

  move(){

    // "Jump" toward the goal
    if (this.moving){ 
      let distToGoal =  this.movesToGoal / preyMoveSpeed;
      this.pos.x = (this.moveGoal.x - this.prevGoal.x) * easeInOutQuint(distToGoal) + this.prevGoal.x 
      this.pos.y = (this.moveGoal.y - this.prevGoal.y) * easeInOutQuint(distToGoal) + this.prevGoal.y 
      
      this.movesToGoal += 1

      if (distToGoal >= 1){
        this.moving = false;
      }

    } else {  // if (!this.moving){
    // Make a new goal to move to if it is currently not moving
      this.prevGoal = this.moveGoal;
      this.getNewGoal(); 

      this.moving = true;
      
      this.movesToGoal = 0;

      if ((this.moveGoal.x - this.prevGoal.x) > 0){
        this.flipped = true;
      } else {
        this.flipped = false;
      }
    }
  }

  getNewGoal(){
    this.moveGoal = p5.Vector.random2D().mult(preyMoveDist).add(this.pos);

    if (this.moveGoal.x < 0){
      this.getNewGoal()
    }
    if (this.moveGoal.x > canvasWidth){
      this.getNewGoal()
    }
    if (this.moveGoal.y < 0){
      this.getNewGoal()
    }
    if (this.moveGoal.y > canvasHeight){
      this.getNewGoal()
    }
  }

  tryBirth(){

    if (random() < alpha){
      allPrey.push(new Prey(this.pos.x,this.pos.y))
      // TODO: Make some explosion or animation for some frames
      // image(imgPoof,this.pos.x,this.pos.y,preySize/2,preySize/2)
    }
  }
}


class Predator {
  constructor(x,y){
    this.pos = createVector(x,y);
    this.moving = true;

    this.moveGoal = createVector(x,y);
    this.prevGoal = this.moveGoal;

    this.movesToGoal = random(predMoveSpeed);

    this.flipped = true;
  }

  display(){
    // Show extra details if debug is on
    if (debug){
      fill(155,155,255)
      circle(this.moveGoal.x,this.moveGoal.y,predSize/2);
    }
    push()
    translate(this.pos.x,this.pos.y);
    if (debug){
      fill(155)
      circle(0,0,predSize);
    }

    // Flip image if flipped flag is set
    if (this.flipped){
      scale(-1,1)
    }

    image(imgPred,-predSize/2,-predSize/2,predSize,predSize);


    pop()
  }

  move(){

    // "Jump" toward the goal
    if (this.moving){ 
      let distToGoal =  this.movesToGoal / predMoveSpeed;
      this.pos.x = (this.moveGoal.x - this.prevGoal.x) * easeInOutQuint(distToGoal) + this.prevGoal.x 
      this.pos.y = (this.moveGoal.y - this.prevGoal.y) * easeInOutQuint(distToGoal) + this.prevGoal.y 
      
      this.movesToGoal += 1

      if (distToGoal >= 1){
        this.moving = false;
      }

    } else {  // if (!this.moving){
    // Make a new goal to move to if it is currently not moving
      this.prevGoal = this.moveGoal;
      this.getNewGoal(); 

      this.moving = true;
      
      this.movesToGoal = 0;

      if ((this.moveGoal.x - this.prevGoal.x) > 0){
        this.flipped = true;
      } else {
        this.flipped = false;
      }
    }
  }

  getNewGoal(){
    this.moveGoal = p5.Vector.random2D().mult(predMoveDist).add(this.pos);

    if (this.moveGoal.x < 0){
      this.getNewGoal()
    }
    if (this.moveGoal.x > canvasWidth){
      this.getNewGoal()
    }
    if (this.moveGoal.y < 0){
      this.getNewGoal()
    }
    if (this.moveGoal.y > canvasHeight){
      this.getNewGoal()
    }
  }
  tryBirth(){

    if (random() < gamma){
      allPred.push(new Predator(this.pos.x,this.pos.y))
      // TODO: Make some explosion or animation for some frames
      // image(imgPoof,this.pos.x,this.pos.y,preySize/2,preySize/2)
    }
  }
}

class Skull {
  constructor(x,y){
    this.pos = createVector(x,y);
    this.time = 0;
  }

  display(){
    push()
    translate(this.pos.x,this.pos.y)

    image(imgSkull2,-skullSize/2,-skullSize/2,skullSize,skullSize);
    pop()
  }
}

class Decoration {
  constructor(x,y){
    this.pos = createVector(x,y);
    this.type = Math.floor(random(3));
    this.img;
    if (this.type == 0){
      this.img = imgPlant1;
    } else if (this.type == 1){
      this.img = imgPlant2;
    } else if (this.type == 2){
      this.img = imgPlant3;
    }
    this.flipped = true;
  }

  display(){
    push()
    translate(this.pos.x,this.pos.y)
    // Flip image if flipped flag is set
    if (this.flipped){
      scale(-1,1)
    }

    image(this.img,-decoSize/2,-decoSize/2,decoSize,decoSize);
    pop()
  }

}

function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
  }