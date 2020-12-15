/* 
	Sketch for displaying difference in number of tests
*/

// // For saving
// let saveAllFrames = true;

let imgHealthy;
let imgSick;

let allPersons = [];
let numPersons = 200;


let sickProb = 0.3;

let TPZonePos;
let FNZonePos;
let FPZonePos;
let TNZonePos;
let TPSize;
let FNSize;
let FPSize;
let TNSize;

let pSize = 20;
// let normalSpeed = 10;
// let reducedSpeed = 10;
let normalSpeed = 4;
let reducedSpeed = 2;

// let testSens = 0.99;
// let testSpec = 0.75;
let singleTestTP = 0.99;
let singleTestTN = 0.75;
// let tpr = testSens;
// let tnr = testSpec;
let TPrate = singleTestTP;
let TNrate = singleTestTN;
// let TPrate;
// let TNrate;
let numTests = 3;
let maxNumTests = 10;

let PCRSpec = 0.99;
let PCRSens = 0.99;
let AntiSpec = 0.75;
let AntiSens = 0.99;
// let AntiSpec = 0.60;
// let AntiSens = 0.60;

// let toBoost = 'Sens';
let toBoost;

// // spec_boost
// let TPrate = Math.pow(tpr,numTests);
// let TNrate = 1-Math.pow((1-tnr),numTests); 

// // sens_boost
// let TPrate = 1-Math.pow((1-tpr),numTests);
// let TNrate = Math.pow(tnr,numTests);

// let ShowIndivRes = true;
let ShowIndivRes = false;
// let ShowTotalRes = true;
let ShowTotalRes = false;

let splitZones = false;

// Define the number of rows in the quarentine area
let quaRow = 5;
let numInQua = 0;
let countTP = 0;
let countFP = 0;
let countTN = 0;
let countFN = 0;

let tentPos;
let allTentPos = [];
let tentWidth = pSize*2;
let tentHeight = pSize*2.5;
// let tentHeight = pSize*2;

// Interactivity
let sliderNumTests;
let sliderSpec;
let sliderSens;
let textNumTests;
let textSpec;
let textSens;
let textPosNumTests;
let textPosSpec;
let textPosSens;

let radioTests;
let radioType;


let midZones;

function updateProbs(){
	// Recalculates the effective probabilities
	switch (toBoost) {
		case 'Spec':
			// spec_boost
			TPrate = Math.pow(singleTestTP,numTests);
			TNrate = 1-Math.pow((1-singleTestTN),numTests); 
			break;
		case 'Sens':
			// sens_boost
			TPrate = 1-Math.pow((1-singleTestTP),numTests);
			TNrate = Math.pow(singleTestTN,numTests);
			break;
	
		default:
			break;
	}
}

function setup(){

	noSmooth();
	// Load images
	imgHealthy = loadImage('healthy.png');
	imgSick = loadImage('sick.png');
	
	divW = document.getElementById('sketch-holder').offsetWidth;
	divH = document.getElementById('sketch-holder').offsetHeight;

	// Create canvas
	cnv = createCanvas(divW, divH);
	cnv.parent('sketch-holder');
	cnv.style('display','block');
	
	// Define location of zones
	// TPZonePos = createVector(5*divW/8,divH/2 - divH/4);
	// FNZonePos = createVector(5*divW/8,divH/2 + divH/4);
	// FPZonePos = createVector(7*divW/8,divH/2 - divH/4);
	// TNZonePos = createVector(7*divW/8,divH/2 + divH/4);
	if (splitZones){
		TPZonePos = createVector(5*divW/8,divH/2 - divH/4);
		FNZonePos = createVector(5*divW/8,divH/2 + divH/4);
		FPZonePos = createVector(7*divW/8,divH/2 - divH/4);
		TNZonePos = createVector(7*divW/8,divH/2 + divH/4);
		TPSize = createVector(divW/12,divH/10);
		FNSize = TPSize;
		FPSize = TPSize;
		TNSize = TPSize;
	} else {
		TPZonePos = createVector(5*divW/8,divH/2 - divH/4);
		FPZonePos = TPZonePos;
		FNZonePos = createVector(5*divW/8,divH/2 + divH/4);
		TNZonePos = FNZonePos;

		TPSize = createVector(2*divW/12,divH/10);
		FNSize = TPSize;
		FPSize = TPSize;
		TNSize = TPSize;

	}

	// midZones = createVector(0,0);
	calcAllPos()

	// Calculate default probabilities
	updateProbs();

	// Start 
	restartTesting()

	// Generate test-tent positions
	allTentPos = generateTentPos(numTests);

// let posiZonePos = createVector(300,100);
// let negaZonePos = createVector(300,400);
// let posiZoneSiz = createVector(200,200);
// // let negaZoneSiz = createVector(100,100);
// let negaZoneSiz = posiZoneSiz;

// let TPZonePos = createVector(300,100);
// let FNZonePos = createVector(300,400);
// let FPZonePos = createVector(450,100);
// let TNZonePos = createVector(450,400);
// let TPZonePos = createVector(divW/4,divH/2 - divH/4);
// let FNZonePos = createVector(divW/4,divH/2 + divH/4);
// let FPZonePos = createVector(3*divW/4,divH/2 - divH/4);
// let TNZonePos = createVector(3*divW/4,divH/2 + divH/4);
// let TPSize = createVector(divW/8,divH/8);



	// Make sliders
	// Number of tests
	// sliderNumTests = createSlider(1,3,1,1);
	// sliderNumTests.position(10,10);
	// sliderNumTests.style('width', '80px');
	// textPosNumTests = createVector(100,10); 
	
	textSize(16)
	textAlign(LEFT,TOP);
	fill(0);
	noStroke();

	radioTests = createRadio();
	for (let k = 1; k < maxNumTests+1; k++) {
		radioTests.option(k);
	}
	// radioTests.option(1);
	// radioTests.option(2);
	// radioTests.option(3);
	radioTests.selected('1');
	radioTests.style('width', '300px');
	radioTests.position(100,10);
	

	radioType = createRadio();
	radioType.option('PCR');
	radioType.option('Antigen');
	radioType.selected('PCR');
	radioType.style('width','150px');
	radioType.position(100,40);

	radioBoost = createRadio();
	radioBoost.option('Specificitet','Spec');
	radioBoost.option('Sensitivitet','Sens');
	radioBoost.selected('Spec');
	radioBoost.style('width','300px');
	radioBoost.position(100,70);

	// Specificity
	// sliderSpec = createSlider(0,100,testSpec*100,1);
	// sliderSpec.position(10,30);
	// sliderSpec.style('width', '80px');
	// textPosSpec = createVector(100,30);
	// Sensitivity
	// sliderSens = createSlider(0,100,testSens*100,1);
	// sliderSens.position(10,50);
	// sliderSens.style('width', '50px');
	// textPosSens = createVector(100,50);

	// sliderBind = createSlider(0,maxBindProb,bindProb,maxBindProb/100);
	// sliderBind.position(sliderBindLeft,sliderBindTop)
	// sliderBind.size(sliderLength);
	// sliderUnbind = createSlider(0,maxUnbindProb,unbindProb,maxUnbindProb/100);
	// sliderUnbind.position(sliderUnbindLeft,sliderUnbindTop)
	// sliderUnbind.size(sliderLength);
	// sliderUnbindAsProd = createSlider(0,maxUnbindAsProductProb,unbindAsProductProb,maxUnbindAsProductProb/100);
	// sliderUnbindAsProd.position(sliderUnbindAsProdLeft,sliderUnbindAsProdTop)
	// sliderUnbindAsProd.size(sliderLength);
	// // Start the simulation
	// startupSim();
	
	// console.log(3*divW/4)
	// console.log(divH)

	// Generate persons

	// let iniPersons = 1;
	// for (let k = 0; k < iniPersons; k++) {
	// 	let isSick = false;
	// 	if (random(0,1) < sickProb){
	// 		isSick = true;
	// 	}

	// 	let newPerson = new Person(-random(0,divW),divH/2,isSick)		
	// 	// let newPerson = new Person(random(0,divW),random(0,divH),isSick)		

	// 	newPerson.state = 'move';
	// 	newPerson.moveTo = createVector(2*divW/4,divH/2);

	// 	allPersons.push(newPerson);
	// }

}
const lerp = (x, y, a) => x * (1 - a) + y * a;

function generateTentPos(numTents){
	let xSta = divW/20;
	let xEnd = divW/2 - divW/20;
	let yPos = divH/2;

	posAll = [];
	for (let k = 0; k < numTents; k++) {
		let curDist = (k+1)/(numTents+1); 
		let newTentPos = createVector(lerp(xSta,xEnd,curDist),yPos);
		posAll.push(newTentPos);
	}

	// // Hardcoded positions
	// if (numTents == 1){
	// 	tentPos = createVector(lerp(xSta,xEnd,0.5),yPos);
	// 	posAll = [tentPos];
	// }
	// if (numTents == 2){
	// 	let tentPos1 = createVector(lerp(xSta,xEnd,0.33),yPos);
	// 	let tentPos2 = createVector(lerp(xSta,xEnd,0.67),yPos);
	// 	posAll = [tentPos1,tentPos2];
	// }
	// if (numTents == 3){
	// 	let tentPos1 = createVector(lerp(xSta,xEnd,0.25),yPos);
	// 	let tentPos2 = createVector(lerp(xSta,xEnd,0.5),yPos);
	// 	let tentPos3 = createVector(lerp(xSta,xEnd,0.75),yPos);
	// 	posAll = [tentPos1,tentPos2,tentPos3];
	// }
	// if (numTents == 4){
	// 	let tentPos1 = createVector(1*divW/6,divH/2);
	// 	let tentPos2 = createVector(3*divW/12,divH/2);
	// 	let tentPos3 = createVector(5*divW/12,divH/2);
	// 	let tentPos4 = createVector(3*divW/6,divH/2);
	// 	posAll = [tentPos1,tentPos2,tentPos3,tentPos4];
	// }
	

	return posAll
}

function restartTesting(){
	numInQua = 0;
	countTP = 0;
	countFP = 0;
	countTN = 0;
	countFN = 0;
	allPersons = [];
}

function calcAllPos(){
	let midX = (TPZonePos.x+TNZonePos.x)/2;
	let midY = (TPZonePos.y+TNZonePos.y)/2;

	midZones = createVector(midX,midY);
	// midZones = createVector(divW/2,midY); // Use middle instead
	
}

function draw(){
	
	background(100,200,150);

	// image(imgHealthy,0,0);
	// image(imgSick,200,0);
	
	// frameRate(curFrameRate);

	// Show text
	textSize(18)
	textAlign(RIGHT,TOP);
	fill(0);
	noStroke();

	text('Antal tests:',100,10)
	text('Testtype:',100,40)
	text('Boost:',100,70)

	// Get interactive values
	numTests = int(radioTests.value());
	let curType = radioType.value();
	toBoost = radioBoost.value();

	if (curType == 'PCR'){
		singleTestTP = PCRSpec;
		singleTestTN = PCRSens;
		// testSpec = PCRSpec;
		// testSens = PCRSens;
	} else {
		singleTestTP = AntiSpec;
		singleTestTN = AntiSens;
		// testSpec = AntiSpec;
		// testSens = AntiSens;
	}

	// Update probabilities
	updateProbs();

	// Show spec and sens
	let hdiffText = 30;
	let xPosText = 200;
	text('Specificitet:',xPosText,divH-5*hdiffText)
	text('Sensitivitet:',xPosText,divH-4*hdiffText)
	textAlign(LEFT,TOP);
	text((singleTestTP*100) + '%',xPosText+hdiffText/2,divH-5*hdiffText);
	text((singleTestTN*100) + '%',xPosText+hdiffText/2,divH-4*hdiffText);

	textAlign(RIGHT,TOP);
	text('Effektiv specificitet:',xPosText,divH-3*hdiffText)
	text('Effektiv sensitivitet:',xPosText,divH-2*hdiffText)
	textAlign(LEFT,TOP);
	text(Math.round(TPrate*100000)/1000 + '%',xPosText+hdiffText/2,divH-3*hdiffText);
	text(Math.round(TNrate*100000)/1000 + '%',xPosText+hdiffText/2,divH-2*hdiffText);
	// text(Math.round(TNrate*100) + '%',xPosText+hdiffText/2,divH-3*hdiffText);
	// text(Math.round(TPrate*100) + '%',xPosText+hdiffText/2,divH-2*hdiffText);


	// Generate test-tent positions
	if (allTentPos.length != numTests){
		allTentPos = generateTentPos(numTests);
	}
	
	// Restart if anything changes
	radioTests.changed(restartTesting);
	radioType.changed(restartTesting);
	radioBoost.changed(restartTesting);




	// Draw zones
	fill(200,200,255);
	stroke(0);
	let zoneMargin = pSize;
    // rect(TPZonePos.x-TPSize.x-zoneMargin,TPZonePos.y-TPSize.y-zoneMargin,TPSize.x*2+zoneMargin*2,TPSize.y*2+zoneMargin*2);
	// rect(FPZonePos.x-FPSize.x-zoneMargin,FPZonePos.y-FPSize.y-zoneMargin,FPSize.x*2+zoneMargin*2,FPSize.y*2+zoneMargin*2);
	rect(TPZonePos.x-TPSize.x-zoneMargin*3,TPZonePos.y+TPSize.y+zoneMargin,TPSize.x*10,-TPSize.y*10)
	fill(100,150,100);
	noStroke();
    // rect(FNZonePos.x-FNSize.x-zoneMargin,FNZonePos.y-FNSize.y-zoneMargin,FNSize.x*2+zoneMargin*2,FNSize.y*2+zoneMargin*2);
	// rect(TNZonePos.x-TNSize.x-zoneMargin,TNZonePos.y-TNSize.y-zoneMargin,TNSize.x*2+zoneMargin*2,TNSize.y*2+zoneMargin*2);
	rect(FNZonePos.x-FNSize.x-zoneMargin*3,FNZonePos.y-FNSize.y-zoneMargin,FNSize.x*10,FNSize.y*10)
	
	fill(0)
	stroke(0);
	textSize(32);
	textAlign(CENTER);
	text('I karantæne',3*divW/4,20)
	text('Ikke i karantæne',3*divW/4,divH-50)
	textSize(16);
	// text('Sandt positive: '+countTP,3*divW/4,50)
	// text('Falsk positive: '+countFP,3*divW/4,65)
	// text('Sandt negative: '+countTN,3*divW/4,divH-85)
	// text('Falsk negative: '+countFN,3*divW/4,divH-70)
	text('Syge: '+countTP,3*divW/4,50)
	text('Raske: '+countFP,3*divW/4,65)
	text('Raske: '+countTN,3*divW/4,divH-70)
	text('Syge: '+countFN,3*divW/4,divH-85)

	// Draw background of "test-tents"
	for (let tentN = 0; tentN < allTentPos.length; tentN++) {
		tentPos = allTentPos[tentN];
		drawTentBack(tentPos);		
	}


	// Test, add more people every x frames
	if ((frameCount % 20) == 0){
		if (allPersons.length < numPersons){
			let isSick = false;
			if (random(0,1) < sickProb){
				isSick = true;
			}

			let newPerson = new Person(-pSize,divH/2,isSick)		
			// let newPerson = new Person(random(0,divW),random(0,divH),isSick)		

			newPerson.state = 'move';
			newPerson.moveTo = allTentPos[0];
			// newPerson.moveTo = midZones;
			// newPerson.moveTo = createVector(5*divW/8,divH/2);

			allPersons.push(newPerson);
		}
	}
	

	for (let p = 0; p < allPersons.length; p++) {
		// const curP = allPersons[p];		
		allPersons[p].update();	
		allPersons[p].display();		
	}

	// Draw tent foregrounds
	for (let tentN = 0; tentN < allTentPos.length; tentN++) {
		tentPos = allTentPos[tentN];
		drawTentFore(tentPos);		
	}

	
	// numTests = sliderNumTests.value();
	// textNumTests = '# Tests:' + numTests;
	// text(textNumTests,textPosNumTests.x,textPosNumTests.y);
	
	// testSpec = sliderSpec.value()/100;
	// textSpec = 'Specificity:' + (Math.round(testSpec*100));
	// text(textSpec,textPosSpec.x,textPosSpec.y);

	// testSens = sliderSens.value()/100;
	// textSens = 'Sensitivity:' + (Math.round(testSens*100));
	// text(textSens,textPosSens.x,textPosSens.y);

	
	// sliderNumTests.changed(restartTesting);
	// sliderSpec.changed(restartTesting);
	// sliderSens.changed(restartTesting);

	// bindProb = sliderBind.value();
	// unbindProb = sliderUnbind.value();
	// unbindAsProductProb = sliderUnbindAsProd.value();
	/*
	// To make field smaller when settings are shown
	if (showSettings == true){
		// Change the field ratio, so show a smaller field
		//curFieldScreenRatio = 1-settingsRatio;
	} else {
		// Set the field to full screen
		curFieldScreenRatio = 1;
	}
	*/
	
	
	// push();
	// // Scale and translate to full screen field
	// translate(fieldLeft,fieldTop);
	// scale(curScale); // Scales to full width field
	
	// // Scale to a smaller field, if necessary
	// scale(curFieldScreenRatio); // Scales to take up the correct ratio of the screen
	// var smallFieldLeft = 0;//sketchW * curFieldScreenRatio;
	// var smallFieldTop = fieldHeight *0.5* (1-curFieldScreenRatio);
	// translate(smallFieldLeft,smallFieldTop);

	// if (saveAllFrames){
	// 	// Save images
	// 	frameRate(2); 
	// 	saveCanvas('multipleTestingFrame'+frameCount, 'jpg');
	// 	// delayTime(delayTime)
	// 	// delayTime = 1
	// }
	
}


function drawTentFore(tentPos){
	push()
	translate(tentPos)
	translate(0,pSize/2 +5)
	noStroke();

	// rect(tentWidth/2,- tentHeight/2,3*tentWidth/2,1.5*tentHeight);
	// rect(tentWidth/2,- tentHeight,tentWidth,tentHeight*1.5);
	fill(200,200,200,150);
	// rect(0, - tentHeight/2,tentWidth/2,tentHeight);
	rect(tentWidth/2,-tentHeight,-tentWidth/2,tentHeight);


	fill(255);
	stroke(0)
	strokeWeight(2)
	rect(tentWidth/2,-tentHeight,-tentWidth/4,tentHeight);

	rect(tentWidth/2,-tentHeight,-tentWidth,tentHeight/4); // Top


	// rect(tentWidth/2,- tentHeight/2,tentWidth,tentHeight);
	// rect(- tentWidth,- tentHeight/2,tentWidth*2.5,-tentHeight/4);
	// rect(- tentWidth,- tentHeight/2,tentWidth*2,-tentHeight/4);
	// rect(tentWidth/2,- tentHeight/2,tentWidth/2,tentHeight);

	// rect(tentWidth/2,-tentHeight/2,-tentWidth/4,tentHeight);
	// rect(tentWidth/2,-tentHeight/2,-tentWidth,tentHeight/4);
	pop()
}
function drawTentBack(tentPos){
	push()
	translate(tentPos)
	translate(0,pSize/2 +5)
	noStroke();
	fill(200,200,200,150);
	rect(-tentWidth/2,-tentHeight,tentWidth/2,tentHeight);
	stroke(0)
	strokeWeight(2)
	fill(255);
	rect(-tentWidth/2,-tentHeight,tentWidth/4,tentHeight);

	// rect(- tentWidth,-tentHeight,tentWidth*2,tentHeight/2);
	// triangle(-tentWidth,-tentHeight/2,0,-tentHeight,tentWidth*2,-1.5*tentHeight/2);
	// triangle(-tentWidth,-tentHeight/2,tentWidth*2,-1.5*tentHeight/2,tentWidth*2,-tentHeight/2);
	// triangle(-tentWidth,-tentHeight/2-tentHeight/4,0,-tentHeight-tentHeight/4,tentWidth,-tentHeight/2-tentHeight/4);
	// triangle(-tentWidth,-tentHeight/2,0,-tentHeight,tentWidth,-tentHeight/2);
	// rect(0,-tentHeight/2,tentWidth,-tentHeight/2);
	// rect(- tentWidth,- tentHeight/2,tentWidth/2,tentHeight);
	// rect(-tentWidth/2,-tentHeight/2,-tentWidth/4,tentHeight)
	
	// rect(- tentWidth/2, - tentHeight/2,tentWidth/2,tentHeight);
	pop()
}


function getPlaceInZone(zoneName){


	let toReturnX;
	let toReturnY;

	switch (zoneName) {
		// case 'Positive':
		// 	toReturnX = posiZonePos.x+random(0,posiZoneSiz.x);
		// 	toReturnY = posiZonePos.y+random(0,posiZoneSiz.y);
		// 	break;
	
		// case 'Negative':
		// 	toReturnX = negaZonePos.x+random(0,negaZoneSiz.x);
		// 	toReturnY = negaZonePos.y+random(0,negaZoneSiz.y);
		// 	break;
			
		case 'TruePos':
			curRow = Math.floor(numInQua/quaRow)
			curCol = numInQua % quaRow
			toReturnX = TPZonePos.x - TPSize.x + curRow * pSize*2;
			toReturnY = TPZonePos.y - TPSize.y + curCol * pSize*2;
			numInQua = numInQua +1 
			// toReturnX = TPZonePos.x+random(-1,1)*TPSize.x;
			// toReturnY = TPZonePos.y+random(-1,1)*TPSize.y;
			break;
	
		case 'TrueNeg':
			toReturnX = TNZonePos.x+random(-1,1)*TNSize.x;
			toReturnY = TNZonePos.y+random(-1,1)*TNSize.y;
			break;
			
		case 'FalseNeg':
			toReturnX = FNZonePos.x+random(-1,1)*FNSize.x;
			toReturnY = FNZonePos.y+random(-1,1)*FNSize.y;
			break;
		
		case 'FalsePos':
			curRow = Math.floor(numInQua/quaRow)
			curCol = numInQua % quaRow
			toReturnX = FPZonePos.x - FPSize.x + curRow * pSize*2;
			toReturnY = FPZonePos.y - FPSize.y + curCol * pSize*2;
			numInQua = numInQua +1 
			// toReturnX = FPZonePos.x+random(-1,1)*FPSize.x;
			// toReturnY = FPZonePos.y+random(-1,1)*FPSize.y;
			break;
	
		default:
			break;
	}

	return createVector(toReturnX,toReturnY)

}

// Person class
class Person {
	
	constructor(xPos,yPos,sick) {		
		this.pos = createVector(xPos,yPos);
		this.sick = sick;
		this.size = pSize;
		this.size2 = this.size*2;
		// this.state = 'none';
		this.state = 'move';
		this.moveTo = createVector(0,0);
		this.moveTo = allTentPos[0];
		this.speed = normalSpeed;
		this.testRes = false;
		this.testResultCombined;
		this.testResults = [];
		this.testCount = 0;
		this.toPreZone = true;
		this.testDisplay = ''
		this.testCombined = false;
		this.stopNextRun = false;

		// this.testPerson();
		// this.getNewState();
		
	}
	
	display(){
		push();
		translate(this.pos.x,this.pos.y);

		
		if (this.sick){
			image(imgSick,-this.size,-this.size,this.size*2,this.size*2);
		} else {
			image(imgHealthy,-this.size,-this.size,this.size*2,this.size*2);
		}
		textSize(20)
		textLeading(10);
		text(this.testDisplay,0,20)
		// text(this.testCount,0,-30)
		// for (let t = 0; t < this.testResults.length; t++) {
		// 	const element = this.testResults[t];
		// 	// text(element,this.pos.x,this.pos.y+(10*t)+30) 
		// 	if (element == true){
		// 		text('+',0,(15*t)+30)
		// 	} else {
		// 		text('-',0,(15*t)+30)
		// 	}
		// }
		// if (this.testCount == numTests){
		// 	text(this.testResultCombined,0,(15*(numTests+1)) + 30 )
		// }
		pop();
		
		// if (this.sick){
		// 	image(imgSick,this.pos.x-this.size,this.pos.y-this.size,this.size*2,this.size*2);
		// } else {
		// 	image(imgHealthy,this.pos.x-this.size,this.pos.y-this.size,this.size*2,this.size*2);
		// }
		// textSize(20)
		// text(this.testResultCombined,this.pos.x,this.pos.y+10)
		// text(this.testCount,this.pos.x,this.pos.y-30)
		// for (let t = 0; t < this.testResults.length; t++) {
		// 	const element = this.testResults[t];
		// 	// text(element,this.pos.x,this.pos.y+(10*t)+30) 
		// 	if (element == true){
		// 		text('+',this.pos.x,this.pos.y+(10*t)+30)
		// 	} else {
		// 		text('-',this.pos.x,this.pos.y+(10*t)+30)
		// 	}
		// }
	}

	makeOneTest(){
		let toAdd;
		if (this.sick){
			if (random(0,1) <= singleTestTP){
				toAdd = true;
			} else {
				toAdd = false;
			}
		} else {
			if (random(0,1) <= singleTestTN){
			// if (random(0,1) <= (1-singleTestTN)){
				toAdd = false;
			} else {
				toAdd = true;
			}
		}
		// Add to test-result array
		this.testResults.push(toAdd);
		// Add to displaytext
		if (ShowIndivRes){
			if (toAdd){
				this.testDisplay = this.testDisplay + '+\n'
			} else {
				this.testDisplay = this.testDisplay + '-\n'
			}
		}
		
		// if (toAdd){
		// 	this.testDisplay = this.testDisplay + '+'
		// } else {
		// 	this.testDisplay = this.testDisplay + '-'
		// }
	}

	combineTestResults(){
		let anyTrue = false;
		let anyFalse = false;
		for (let t = 0; t < this.testResults.length; t++) {
			const element = this.testResults[t];
			if (element == true){
				anyTrue = true;
			}
			if (element == false){
				anyFalse = true;
			}
		}
		switch (toBoost) {
			case 'Spec':
				this.testResultCombined = !anyFalse;
				// // spec_boost
				// TPrate = Math.pow(singleTestTP,numTests);
				// TNrate = 1-Math.pow((1-singleTestTN),numTests); 
				break;
			case 'Sens':
				// sens_boost
				this.testResultCombined = anyTrue;
				// TPrate = 1-Math.pow((1-singleTestTP),numTests);
				// TNrate = Math.pow(singleTestTN,numTests);
				break;
		
			default:
				break;
		}
		
		// Increase global counter
		if (this.sick){
			if (this.testResultCombined){
				countTP += 1;
			} else {
				countFN += 1;
			}
		} else {
			if (this.testResultCombined){
				countFP += 1;
			} else {
				countTN += 1;
			}
		}
		
		// Add to displaytext
		
		if (ShowTotalRes){
			if (this.testResultCombined){
				this.testDisplay = this.testDisplay + '\nPositiv\n'
			} else {
				this.testDisplay = this.testDisplay + '\nNegativ\n'
			}
		}
		
	}
		

	getNewState() {
		
		if (!this.stopNextRun){
			// If the person has not been in all tents, go to next
			if (this.testCount < numTests){  
				// Make next test
				this.makeOneTest()
				// Update count
				this.testCount = this.testCount+1;
				// Set next waypoint
				this.moveTo = allTentPos[this.testCount];
			} 		
			// If the person is done being tested, go to zone
			if (this.testCount == numTests){  
				if (!this.testCombined){
					this.combineTestResults()
					this.testCombined = true;
				}
				

				if (this.toPreZone){
					this.moveTo = midZones;
					this.toPreZone = false;
				} else {
					this.speed = reducedSpeed;

					if (this.testResultCombined){
						
						if (this.sick){
							this.moveTo = getPlaceInZone('TruePos');
							this.stopNextRun = true;
						} else {
							this.moveTo = getPlaceInZone('FalsePos');
							this.stopNextRun = true;
						}
					} else {
						if (this.sick){
							this.moveTo = getPlaceInZone('FalseNeg');
						} else {
							this.moveTo = getPlaceInZone('TrueNeg');
						}
					}
				}
			}
		} else{
			this.state = 'none';
		}
	}

	update(){
		switch (this.state) {
			case 'none':
				// Do nothing
				break;
				
			// case 'getTest':
			// 	this.getNewState();
			case 'move':
				// Move toward point linearly
				let xDiff = this.pos.x - this.moveTo.x;
				let yDiff = this.pos.y - this.moveTo.y;

				// Idea: If distance is above 2*speed, move with speed
				// Otherwise, move half of distance (for "smoothing"-ish)
				if (Math.abs(xDiff) > 3*this.speed){
					this.pos.x += -Math.sign(xDiff)*this.speed;
				} else {
					this.pos.x += -xDiff/4;
				}				
				if (Math.abs(yDiff) > 3*this.speed){
					this.pos.y += -Math.sign(yDiff)*this.speed;
				} else {
					this.pos.y += -yDiff/4;
				}

				// If close to where it should be, change state
				let curDistSq = (Math.pow(xDiff,2) + Math.pow(yDiff,2));
				if (curDistSq < 1){
					// // For testing
					// this.moveTo = createVector(random(0,divW),random(0,divH));
					// this.moveTo = createVector(divW,0);
					// this.moveTo = this.pos;

					this.getNewState();
				}

				break;

			default:
				break;
		}
	}
}
	

			// for (let t = 0; t < this.testResults.length; t++) {
			// 	const element = this.testResults[t];
			// 	// text(element,this.pos.x,this.pos.y+(10*t)+30) 
			// 	if (element == true){
			// 		text('+',0,(15*t)+30)
			// 	} else {
			// 		text('-',0,(15*t)+30)
			// 	}
			// }
			// if (this.testCount == numTests){
			// 	text(this.testResultCombined,0,(15*(numTests+1)) + 30 )
			// }