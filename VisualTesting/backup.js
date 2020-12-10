/* 
	Interactive simulation of Michaelis-Menten Enzyme kinetics
*/

var allMols = [];
var numMols = 100;

var curFrameRate = 30;

// Counters
var allE = 0;

// Scaling and sizing of things
var fieldWidth = 1000;
var fieldHeight = 1000;
var fieldLeft = 50;
var fieldTop = 50;
var curFieldScreenRatio = 1;

var divW;
var divH;
var maxW = 800;
var maxH = 800;
var sketchW;
var sketchH;
var sketchBorder = 50;

var curScale = 1;

var colorEnzyme;
var colorSubstrate;
var colorComplex;
var colorEffects;

var maxVel = 3;
var maxVelSq = maxVel*maxVel;

var bindDist = 20;
var bindProb = 0.06;
var maxBindProb = 0.1;
var unbindProb = 0.005;
var maxUnbindProb = 0.1;
var unbindAsProductProb = 0.002;
var maxUnbindAsProductProb = 0.1;

// Particle effects
var showParticleEffects = true;
var allEffects = [];

// Window for settings
var settingsRatio = 0.4;
var showSettings = false;
var settingsWidth;

// Buttons
var mouseOverClose = false;
var mouseOverSettings = false;
var mouseOverRestart = false;

// Sliders
var sliderLength = 400;
var sliderBind;
var sliderBindLeft = 50;
var sliderBindTop = 175;
var sliderUnbind;
var sliderUnbindLeft = 50;
var sliderUnbindTop = 300;
var sliderUnbindAsProd;
var sliderUnbindAsProdLeft = 50;
var sliderUnbindAsProdTop = 425;

// Graph 
var allGraphs = [];
var graphLeft = sliderBindLeft;
var graphTop = 550;
var graphWidth = sliderLength;
var graphHeight = 250;
var curWidth = graphWidth;
var maxGraphNum = 500;

var numE;
var numS;
var numC;
var numP;


function setup(){
	
	divW = document.getElementById('sketch-holder').offsetWidth;
	divH = document.getElementById('sketch-holder').offsetHeight;
	
	/*
	if (divW > divH){
		sketchH = divH;
		sketchW = divW;
	} else {
		if (divW < maxW){
			sketchW = maxW;
		} else {
			sketchW = divW;
		}
		if (divW < maxW){
			sketchW = maxW;
		} else {
			sketchW = divW;
		}
		
	}
	
	divH = divW;
	*/
	if (divH > divW){
		sketchW = divW;
		sketchH = divW;
	} else {
		sketchW = divW;
		sketchH = divH;
	}
	
	if ((sketchW > maxW) || (sketchH > maxH)){
		sketchH = maxH;
		sketchW = maxW;
	}
		
	//fieldTop = floor(0 * divH);
	//fieldTop = 0;
	//fieldLeft = floor(0.5 * divW);
	//fieldTop = floor(0.18 * divH);
	//fieldLeft = floor(0.63 * divW);
	//fieldWidth = floor(0.33 * divW);
	//fieldHeight = fieldWidth;
	
	curScale = (sketchW-sketchBorder*2)/fieldWidth;
	
	fieldLeft = (divW/2) - (fieldWidth/2)*curScale;
	fieldTop = (divH/2) - (fieldHeight/2)*curScale;
	
	//fieldLeft = fieldDisplayPart*(sketchW-sketchBorder*2);
	//curScale = (sketchW-fieldLeft*2)/fieldWidth;
	//curScale = (divW-fieldLeft*2)/fieldWidth;

	// Create canvas
	cnv = createCanvas(divW, divH);
	cnv.parent('sketch-holder');
	cnv.style('display','block');
	
	
	// Define the colors
	colorEnzyme = color(150,255,150);
	colorComplex = color(100,100,200);
	//colorSubstrate = color(100,100,255);
	colorSubstrate = color(0,150,255);
	colorProduct = color(255,100,100);
	//colorEffects = color(50,150,255);
	colorEffects = colorSubstrate;
	
	/*
	// Infection time slider
	infSlider = createSlider(0.1,1,infProb,0.05);
	infSlider.size(sliderWidth);
	infSlider.position(sliderLeft, sliderTop+sliderHeight);
	infRadiusSlider = createSlider(2,20,infDist,1);
	infRadiusSlider.size(sliderWidth);
	infRadiusSlider.position(sliderLeft, sliderTop+sliderHeight*2);
		
	// Pause and restart button
	restartButton = createButton('Restart');
	restartButton.position(sliderLeft-20,sliderTop);
	restartButton.mousePressed(startupSim);
	pauseButton = createButton('Pause/Start');
	pauseButton.position(sliderLeft+50,sliderTop);
	pauseButton.mousePressed(pauseSim);
	
	*/
	
	// Make sliders
	sliderBind = createSlider(0,maxBindProb,bindProb,maxBindProb/100);
	sliderBind.position(sliderBindLeft,sliderBindTop)
	sliderBind.size(sliderLength);
	sliderUnbind = createSlider(0,maxUnbindProb,unbindProb,maxUnbindProb/100);
	sliderUnbind.position(sliderUnbindLeft,sliderUnbindTop)
	sliderUnbind.size(sliderLength);
	sliderUnbindAsProd = createSlider(0,maxUnbindAsProductProb,unbindAsProductProb,maxUnbindAsProductProb/100);
	sliderUnbindAsProd.position(sliderUnbindAsProdLeft,sliderUnbindAsProdTop)
	sliderUnbindAsProd.size(sliderLength);
	// Start the simulation
	startupSim();
}

function startupSim(){
	// Reset arrays
	allMols = [];
	allEffects = [];
	allGraphs = [];
	// Reset counters
	numE = 0;
	numC = 0;
	numS = 0;
	numP = 0;
	
	// Initialize molecules
	for (var p = 0; p < numMols; p++){
		
		// Fifty-fifty
		if (random(1) < 0.5){
			var newMolecule = new Enzyme();
			numE++;
		} else {
			var newMolecule = new Substrate();
			numS++;
		}
		
		/*	
		// Only complex
		var newMolecule = new Enzyme();
		newMolecule.type = 'Complex';
		*/
		
		allMols.push(newMolecule);
	}	
}

function pauseSim(){
	// Change the state of "timeIsRunning"
	timeIsRunning = !timeIsRunning;		
}

function draw(){
	
	background(0);
	
	frameRate(curFrameRate);
	
	
	// Get slider values
	bindProb = sliderBind.value();
	unbindProb = sliderUnbind.value();
	unbindAsProductProb = sliderUnbindAsProd.value();
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
	
	
	push();
	// Scale and translate to full screen field
	translate(fieldLeft,fieldTop);
	scale(curScale); // Scales to full width field
	
	// Scale to a smaller field, if necessary
	scale(curFieldScreenRatio); // Scales to take up the correct ratio of the screen
	var smallFieldLeft = 0;//sketchW * curFieldScreenRatio;
	var smallFieldTop = fieldHeight *0.5* (1-curFieldScreenRatio);
	translate(smallFieldLeft,smallFieldTop);
	
	
	
	for (var p = numMols-1; p >= 0; p--){
		allMols[p].move();
		allMols[p].display();
		
		if (allMols[p].type == 'Enzyme'){
			for (var p2= numMols-1; p2 >= 0; p2--){
				if (p2 != p){
					if (allMols[p2].type == 'Substrate'){
						if (allMols[p2].toRemove != 1){
							var xDist = abs(allMols[p].pos.x -allMols[p2].pos.x);
							var yDist = abs(allMols[p].pos.y -allMols[p2].pos.y);
							if ((xDist+yDist) < bindDist){
								if (random(1) < bindProb) {
									allMols[p].tryConnect(allMols[p2]);
									allMols[p2].toRemove = 1;
									numE--;
									numS--;
									numC++;
								}
							}
						}
					}
				}
			}
		}
		
		if (allMols[p].type == 'Complex'){
			// Try to unbind
			if (random(1) < unbindProb){
				allMols[p].unbind();
				var newMolecule = new Substrate();
				newMolecule.pos.x = allMols[p].pos.x;
				newMolecule.pos.y = allMols[p].pos.y;
				allMols.push(newMolecule);
				numC--;
				numS++;
				numE++;
				
				// Make a particle effect
				var newEffect = new particleEffect('unbind',allMols[p].pos);
				allEffects.push(newEffect);
			}
			// Try to unbind as product
			if (random(1) < unbindAsProductProb){
				allMols[p].unbind();
				var newMolecule = new Substrate();
				newMolecule.type = 'Product';
				newMolecule.pos.x = allMols[p].pos.x;
				newMolecule.pos.y = allMols[p].pos.y;
				allMols.push(newMolecule);
				numC--;
				numE++;
				numP++;
				
				// Make a particle effect
				var newEffect = new particleEffect('unbindProduct',allMols[p].pos);
				allEffects.push(newEffect);
			}
		}
	}
	for (var p = numMols-1; p >= 0; p--){
		if (allMols[p].toRemove == 1){
			allMols.splice(p,1);
		}
	}
	numMols = allMols.length;
	
	//rect(0,0,fieldWidth,fieldHeight);
	
	// Draw particle effects
	if (showParticleEffects){
		for (var e = allEffects.length-1; e >= 0; e--){
			if (allEffects[e].curTime <= allEffects[e].maxTime){
				allEffects[e].display();
				allEffects[e].curTime++;
			} else {
				allEffects.splice(e,1);
			}
		}
	}
	
	// Draw border
	var borderWidth = 30;
	var extraWidth = 20;
	fill(50)
	noStroke();
	//rect(-borderWidth,-borderWidth,fieldWidth+borderWidth*2,fieldHeight+borderWidth*2);
	//fill(0);
	//rect(-extraWidth,-extraWidth,fieldWidth+extraWidth*2,fieldHeight+extraWidth*2);
	/*
	rect(-borderWidth/2,-borderWidth/2,borderWidth+1,fieldHeight+1);
	rect(-borderWidth/2+fieldWidth,-borderWidth/2,borderWidth+1,fieldHeight+1);
	rect(-borderWidth/2,-borderWidth/2,fieldWidth+1,borderWidth+1);
	rect(-borderWidth/2,-borderWidth/2+fieldHeight,fieldWidth+borderWidth+1,borderWidth+1);
	*/
	push()
	//translate(-borderWidth/2,-borderWidth/2);
	stroke(50);
	strokeWeight(35);	
	line(0,0,0,fieldHeight);
	line(0,0,fieldWidth,0);
	line(0,fieldHeight,fieldWidth,fieldHeight);
	line(fieldWidth,0,fieldWidth,fieldHeight);
	pop();
	pop();
	
	var buttonSize = 60;
	var buttonPadding = 20;
	//var SettingsLeft = (1-settingsRatio)*sketchW;
	//var SettingsLeft = (1-settingsRatio)*divW;
	//var SettingsLeft = settingsRatio*divW;
	var SettingsLeft = 0;
	//var SettingsWidth = settingsRatio*divW;
	var SettingsWidth = 500;
	var SettingsTop = 20;
	var SettingsBorder = 10;
	
	var closeButtonLeft = buttonPadding;
	var closeButtonTop = buttonPadding+SettingsBorder*2;
	var restartButtonLeft = buttonSize+buttonPadding*2;
	var restartButtonTop = closeButtonTop;
	/*
	var closeButtonLeft = divW-buttonSize-buttonPadding;
	var closeButtonTop = buttonPadding+SettingsBorder;
	var restartButtonLeft = divW-buttonSize*2-buttonPadding*2;
	var restartButtonTop = buttonPadding+SettingsBorder; 
	*/
	
	// Draw settings windows
	if (showSettings == true){
		
		// Draw settings window background
		push();
		translate(SettingsLeft,SettingsTop);
		noStroke();
		strokeWeight(3);
		stroke(0);
		fill(155,155,155,200);
		rect(-SettingsBorder,0,SettingsWidth,sketchH);
		fill(100,100,100,200);
		rect(-SettingsBorder*2,SettingsBorder,SettingsWidth,sketchH-SettingsBorder*2);
		//rect(SettingsBorder,SettingsBorder,sketchW,sketchH-SettingsBorder*2);
		//rect(SettingsLeft,SettingsTop,sketchW,sketchH);
		//rect(SettingsLeft+SettingsBorder,SettingsTop+SettingsBorder,sketchW,sketchH-SettingsBorder*2);
		
		// Draw a close button
		push();
		translate(-SettingsLeft,-SettingsTop);
		translate(closeButtonLeft,closeButtonTop);
		fill(155,155,155);
		strokeWeight(3);
		rect(0,0,buttonSize,buttonSize)
		if (overRect(closeButtonLeft, closeButtonTop, buttonSize,buttonSize)) {
			stroke(155,0,0);
		} else {
			stroke(100,100,100);
		}
		strokeWeight(8);
		var ratioCross = 4;
		line(buttonSize/ratioCross,buttonSize/ratioCross,buttonSize*(ratioCross-1)/ratioCross,buttonSize*(ratioCross-1)/ratioCross);
		line(buttonSize/ratioCross,buttonSize - buttonSize/ratioCross,buttonSize*(ratioCross-1)/ratioCross,buttonSize - buttonSize*(ratioCross-1)/ratioCross);
				
		strokeWeight(3);
		pop();
		
		
		// Show sliders
		sliderBind.show();
		sliderUnbind.show();
		sliderUnbindAsProd.show();
		
		var arrowScale;
		var minArrowScale = 0.2;

		// Draw illustrations below sliders
		var sliderPadding = 20;
		
			// Bind slider
			push();
				translate(sliderBindLeft,sliderBindTop+sliderPadding*2);
				push();
					translate(sliderPadding,0);
					scale(0.75)
					drawA("Enzyme");
					translate(sliderLength/6,0);
					drawA("Substrate");
				pop();
				push();
					translate(sliderLength*0.5,0);
					arrowScale = bindProb/maxBindProb;
					if (arrowScale < minArrowScale){
						scale(minArrowScale*1.5);
					} else {
						scale(arrowScale*1.5);
					}
					strokeWeight(6);
					noFill();
					stroke(0);
					triangle(0,0,-5,3,-5,-3);
					line(0,0,-15,0)
					if (arrowScale  == 0){
						// Draw an X over arrow
						scale(2);
						strokeWeight(3);
						stroke(255,0,0);
						line(-20,-5,10,5);
						line(-20,5,10,-5);
					}
				pop();
				push();
					translate(sliderLength-sliderPadding,0);
					scale(0.75)
					drawA("EnzymeComplex");
				pop();
			pop();
			
			// Unbind slider
			push();
				translate(sliderUnbindLeft,sliderUnbindTop+sliderPadding*2);
				push();
					translate(sliderPadding,0);
					scale(0.75)
					drawA("EnzymeComplex");
				pop();
				push();
					translate(sliderLength*0.5,0);
					arrowScale = unbindProb/maxUnbindProb;
					if (arrowScale < minArrowScale){
						scale(minArrowScale*1.5);
					} else {
						scale(arrowScale*1.5);
					}
					strokeWeight(6);
					noFill();
					stroke(0);
					triangle(0,0,-5,3,-5,-3);
					line(0,0,-15,0)
					if (arrowScale  == 0){
						// Draw an X over arrow
						scale(2);
						strokeWeight(3);
						stroke(255,0,0);
						line(-20,-5,10,5);
						line(-20,5,10,-5);
					}
				pop();
				push();
					translate(sliderLength*(5/6)-sliderPadding,0);
					scale(0.75)
					drawA("Enzyme");
					translate(sliderLength/6,0);
					drawA("Substrate");
				pop();
			pop();
		
			// Unbind as product slider
			push();
				translate(sliderUnbindAsProdLeft,sliderUnbindAsProdTop+sliderPadding*2);
				push();
					translate(sliderPadding,0);
					scale(0.75)
					drawA("EnzymeComplex");
				pop();
				push();
					translate(sliderLength*0.5,0);
					arrowScale = unbindAsProductProb/maxUnbindAsProductProb;
					if (arrowScale < minArrowScale){
						scale(minArrowScale*1.5);
					} else {
						scale(arrowScale*1.5);
					}
						
					strokeWeight(6);
					noFill();
					stroke(0);
					triangle(0,0,-5,3,-5,-3);
					line(0,0,-15,0)
					if (arrowScale  == 0){
						// Draw an X over arrow
						scale(2);
						strokeWeight(3);
						stroke(255,0,0);
						line(-20,-5,10,5);
						line(-20,5,10,-5);
					}
					
				pop();
				push();
					translate(sliderLength*(5/6)-sliderPadding,0);
					scale(0.75)
					drawA("Enzyme");
					translate(sliderLength/6,0);
					drawA("Product");
				pop();
			pop();
		
		
		pop();
		//if (overRect(closeButtonLeft, cloesButtonTop, buttonSize,buttonSize)) {
		//	fill(255,155,155,155);
		//	//rect(closeButtonLeft,cloesButtonTop,buttonSize,buttonSize);
		//} 
	} else {
		// Draw a settings button
		push();
		translate(closeButtonLeft,closeButtonTop);
		fill(155,155,155);
		strokeWeight(3);
		rect(0,0,buttonSize,buttonSize)
		if (overRect(closeButtonLeft, closeButtonTop, buttonSize,buttonSize)) {
			stroke(0,155,0);
			fill(0,155,0);
		} else {
			stroke(100,100,100);
			fill(100,100,100);
		}
		strokeWeight(8);
		translate(buttonSize/2,buttonSize/2);
		for(var tand = 0; tand < 9; tand ++){
			rotate(2*PI/8)
			line(0,0,buttonSize/4,buttonSize/4);
		}
		ellipse(0,0,buttonSize/2,buttonSize/2);
		fill(155,155,155);
		ellipse(0,0,buttonSize/3,buttonSize/3);
				
		pop();
		
		// Hide sliders
		sliderBind.hide();
		sliderUnbind.hide();
		sliderUnbindAsProd.hide();
	}
	
	
	// Draw a restart button
	push();
	translate(restartButtonLeft,restartButtonTop);
	fill(155,155,155);
	strokeWeight(3);
	rect(0,0,buttonSize,buttonSize)
	var curColor = color(100,100,100);
	if (overRect(restartButtonLeft, restartButtonTop, buttonSize,buttonSize)) {
		//stroke(0,0,155);
		//fill(0,0,155);
		curColor = color(0,0,155);
	//} else {
		//stroke(100,100,100);
		//fill(100,100,100);
	}
	fill(curColor);
	stroke(curColor);
	strokeWeight(5);
	translate(buttonSize/2,buttonSize/2);
	noFill();
	rotate(1.6*PI)
	arc(0, 0, buttonSize/2, buttonSize/2, 0, 1.6*PI);
	translate(buttonSize/4,0)
	rotate(-PI/8);
	strokeWeight(4)
	fill(curColor);
	var triangleSize = buttonSize/8;
	triangle(-triangleSize/2,0,triangleSize/2,0,0,-triangleSize);
	
	
	/*
	//ellipse(0,0,buttonSize/2.2,buttonSize/2.2);
	//arc(0,0,buttonSize/2,buttonSize/2,0,2*PI);
	//rotate(1.75*PI)
	
	strokeWeight(8);
	translate(buttonSize/2,buttonSize/2);
	ellipse(0,0,buttonSize/2.2,buttonSize/2.2);
	fill(155,155,155);
	ellipse(0,0,buttonSize/2,buttonSize/2);
	noStroke();//stroke(155,155,155);
	rect(-buttonSize/3,0,buttonSize/6,-buttonSize/3);
	var triangleSize = buttonSize/8;
	strokeWeight(3);
	fill(curColor);
	stroke(curColor);
	translate(-buttonSize/10,-buttonSize/5)
	rotate(-PI/4);
	//triangle(0,0,0,-triangleSize,-triangleSize/2,-triangleSize/2);
	triangle(0,-triangleSize,0,triangleSize,-triangleSize,0);
	*/
			
	pop();
	
	
	// ----- Button clicking -----
	if (showSettings){
		mouseOverSettings = false;
		// Close button
		if (overRect(closeButtonLeft, closeButtonTop, buttonSize,buttonSize)) {
			mouseOverClose = true;
		} else {
			mouseOverClose = false;
		}
	} else {
		mouseOverClose = false;
		// Settings button
		if (overRect(closeButtonLeft, closeButtonTop, buttonSize,buttonSize)) {
			mouseOverSettings = true;
		} else {
			mouseOverSettings = false;
		}
	}
	// Restart button
	if (overRect(restartButtonLeft, restartButtonTop, buttonSize,buttonSize)) {
		mouseOverRestart = true;
	} else {
		mouseOverRestart = false;
	}
	
	strokeWeight(1);
	
	// Test drawings
	/*
	push();
	translate(restartButtonLeft,150)
	noStroke();
	drawA("Enzyme");
	translate(0,50)
	drawA("EnzymeComplex");
	translate(0,50)
	drawA("Substrate");
	translate(0,50)
	drawA("Product");
	pop();
	*/
	
	
	// Stuff for making graphs, as in SIR simulation
	var numGraph = allGraphs.length;
	//var graphBorder = 10;
	
	push()
	translate(graphLeft,graphTop)
	
	
	// Every XX frames
	if ((frameCount%5)==0){
		
		if ( allGraphs.length > maxGraphNum ){
			allGraphs.splice(0,1);
		}
		
		// Add current status to graph
		var newPoint = new graphPoint(numE,numC,numS,numP,0,graphHeight);
		newPoint.w = curWidth;
		allGraphs.push(newPoint);
		numGraph = allGraphs.length;
		curWidth = graphWidth/numGraph;
		if (curWidth >= graphWidth){
			curWidth = graphWidth;
		}
		
		for (var k = 0; k < numGraph; k++) {
			allGraphs[k].x = k*curWidth;
			allGraphs[k].w = curWidth;
		}
	}
	
	// Only draw the graph when settings are shown 
	if (showSettings){
		/*
		// Draw the graph background / Border
		fill(50,50,50,200)
		//strokeWeight(10);
		noStroke();
		rect(-graphBorder,-graphBorder,graphWidth+graphBorder*2,graphHeight+graphBorder*2)
		*/
		
		// Go through the graph parts and show them
		for (var k = 0; k < allGraphs.length; k++) {
			allGraphs[k].display();
		}
		
	}
	pop()
		
		
} // End draw

function mousePressed(){
	if (mouseOverClose){
		showSettings = false;
	}
	if (mouseOverSettings){
		showSettings = true;
	}
	if (mouseOverRestart){
		startupSim();
	}
}

function overRect(x, y, width, height)  {
  if (mouseX >= x && mouseX <= x+width && 
      mouseY >= y && mouseY <= y+height) {
    return true;
  } else {
    return false;
  }
  
}

// Molecule class that all other classes should extend
class Molecule {
	
	constructor(type) {		
		this.pos = createVector(random(fieldWidth),random(fieldHeight));
		this.vel = createVector(random(-maxVel,maxVel)/1.6,random(-maxVel,maxVel)/1.6);
		this.type = type;
		this.size = 20;
		this.toRemove = 0;
	}
	
	brownianMotion(){
		// Make random motion 
		var deltaX = int(random(0,3)) - 1;
		var deltaY = int(random(0,3)) - 1;
		
		var stepSize = 2;
		this.pos.x += stepSize*deltaX;
		this.pos.y += stepSize*deltaY;
	}
	
	brownianVelocity(){
		// Change velocity random
		var deltaX = int(random(0,3)) - 1;
		var deltaY = int(random(0,3)) - 1;
		
		var stepSize = 0.3;
		this.vel.x += stepSize*deltaX;
		this.vel.y += stepSize*deltaY;
		
		// Limit velocity
		if (this.vel.magSq() > maxVelSq){
			this.vel.div(this.vel.mag());
			this.vel.mult(maxVel);
		}
		
		// Update position
		var timeStep = 1;
		this.pos.x += this.vel.x*timeStep;
		this.pos.y += this.vel.y*timeStep;
	}
	
	move(){
		this.brownianVelocity();
		//this.brownianMotion();
		
		// Periodic boundaries
		var maxX = fieldWidth;
		var maxY = fieldHeight;
		
		if (this.pos.x < 0){
			this.pos.x += maxX;
		}
		if (this.pos.x > maxX){
			this.pos.x -= maxX;
		}
		if (this.pos.y < 0){
			this.pos.y += maxY;
		}
		if (this.pos.y > maxY){
			this.pos.y -= maxY;
		}
		
		/*
		// Boundaries
		
		var boundaryStrength = 0.25;
		if (this.pos.x < 5){
			this.acc.x = boundaryStrength;
			//this.acc.add(boundaryStrength,0);
		}
		if (this.pos.x > maxX-5){
			this.acc.x = -boundaryStrength;
			//this.acc.add(-boundaryStrength,0);
		}
		if (this.pos.y < 5){
			this.acc.y = boundaryStrength;
			//this.acc.add(0,boundaryStrength);
		}
		if (this.pos.y > maxY-5){
			this.acc.y = -boundaryStrength;
			//this.acc.add(0,-boundaryStrength);
		}
		*/
		
	}
	
	
	display(){
		fill(150);
		stroke(0,0,0,50);
		strokeWeight(0.5)
		ellipse(this.pos.x,this.pos.y,this.size);
		//ellipse(this.x,this.y,this.diameter);
	}	
}
class Substrate extends Molecule{
	constructor() {	
		super('Substrate'); 
		//this.size = 20;
		//this.color = colorSubstrate;
	}
	
	
	display(){
		push();
		noStroke();
		translate(this.pos.x,this.pos.y);
		if (this.type == 'Substrate'){
			//this.color = colorSubstrate;
			drawA("Substrate");
		} else {
			//this.color = colorProduct;
			drawA("Product");
		}
		pop(); 
	}	
}

class Enzyme extends Molecule{
	constructor() {	
		super('Enzyme'); 
		this.color = colorEnzyme;
		//this.size = 30;
		this.angle = random(0,2*PI);
		this.angleVel = 0;
	}
	
	changeRotation(){
		var angleChange = 0.025*this.vel.magSq();
		this.angleVel += random(0,angleChange*2)-angleChange;
		var maxAngleVel = PI/2;
		if (this.angleVel > maxAngleVel){
			this.angleVel = maxAngleVel;
		}
		if (this.angleVel < -maxAngleVel){
			this.angleVel = -maxAngleVel;
		}
		this.angle += this.angleVel*0.1;
	}
	
	
	// Try to connect to nearby molecules
	tryConnect(mol){
		this.connect(mol);
	}
	
	connect(mol){
		//this.color = color(255,40,40);
		this.type = 'Complex';
		
		// Make a particle effect
		var newEffect = new particleEffect('connect',this.pos);
		allEffects.push(newEffect);
		
	}
	
	unbind(){
		this.type = 'Enzyme';
		
	}
	
	display(){
		push();
		noStroke();
		translate(this.pos.x,this.pos.y);
		rotate(this.angle);
		//fill(this.color);
		//rect(-this.size/2,-this.size/4,this.size,this.size/2);
		if (this.type == 'Enzyme'){
			//fill(0);
			drawA("Enzyme");
		} else {
			//fill(colorComplex);
			drawA("EnzymeComplex");
		}
		//ellipse(0,0,20);
		//fill(50,155,50,50)
		//rect(-this.size/2,-this.size/4,this.size,this.size/2);
		pop(); 
		this.changeRotation();
		//ellipse(this.x,this.y,this.diameter);
	}	
}

class particleEffect{
	
	constructor(type,pos){
		this.type = type;
		this.maxTime = 5;
		this.curTime = 0;
		this.pos = pos;
		this.lineEffectLength = 15;
		//this.pos2 = pos.copy();
	}
	
	/*
	particleEffect(type,pos,pos2){
		this.type = type;
		this.maxTime = 50;
		this.curTime = 0;
		this.pos = pos.copy();
		this.pos2 = pos2.copy();
	}
	*/
	
	
	display(){
		// Line when connecting
		if (this.type == 'connect'){
			stroke(colorEffects);
			fill(colorEffects);
			strokeWeight(2);
			
			// Inward lines
			push()
			translate(this.pos.x,this.pos.y);
			var curLen =1-( this.curTime/this.maxTime);
			var numLines = 16;
			
			//for (var ang = 0; ang < 2*PI; ang = ang+PI/6){
			for (var lin = 0; lin < numLines ; lin++){
				rotate(2*PI/numLines);
				line(0,0,this.lineEffectLength*curLen,this.lineEffectLength*curLen);
			}
			pop();
		}
		
		// Lines when unbinding
		if (this.type == 'unbind'){
			stroke(colorEffects);
			fill(colorEffects);
			strokeWeight(1);
			
			// Inward lines
			push()
			translate(this.pos.x,this.pos.y);
			var curLen = this.curTime/this.maxTime;
			var numLines =16;
			
			//for (var ang = 0; ang < 2*PI; ang = ang+PI/6){
			for (var lin = 0; lin < numLines ; lin++){
				rotate(2*PI/numLines);
				line(0,0,this.lineEffectLength*curLen,this.lineEffectLength*curLen);
			}
			pop();
		}
		// Lines when unbinding and making product
		if (this.type == 'unbindProduct'){
			stroke(colorProduct);
			fill(colorProduct);
			strokeWeight(3);
			
			// Inward lines
			push()
			translate(this.pos.x,this.pos.y);
			var curLen = this.curTime/this.maxTime;
			var numLines =16;
			
			//for (var ang = 0; ang < 2*PI; ang = ang+PI/6){
			for (var lin = 0; lin < numLines ; lin++){
				rotate(2*PI/numLines);
				line(0,0,this.lineEffectLength*curLen,this.lineEffectLength*curLen);
			}
			pop();
		}
		
		// Test
	
		//fill(200,200,255);
		//noStroke();
		//rect(this.pos.x,this.pos.y,20,20);
		
	}	
}

// Function for all drawings
function drawA(Thing){
	noStroke();
	if (Thing == "Enzyme"){
		var size = 30;
		fill(colorEnzyme); 
		rect(-size/2,-size/4,size,size/2);
		fill(0);
		ellipse(0,0,20);
		fill(50,155,50,50)
		rect(-size/2,-size/4,size,size/2);
	} else if (Thing == "EnzymeComplex"){
		var size = 30;
		fill(colorEnzyme);
		rect(-size/2,-size/4,size,size/2);
		fill(colorComplex);
		ellipse(0,0,20);
		fill(50,155,50,50)
		rect(-size/2,-size/4,size,size/2);
	} else if (Thing == "Substrate"){
		var size = 20;
		fill(colorSubstrate);
		ellipse(0,0,size);
	} else if (Thing == "Product"){
		var size = 20;
		fill(colorProduct);
		ellipse(0,0,size);
	}
}


class graphPoint{
	
	constructor(E,C,S,P,x,h){
		this.E = E;
		this.C = C;
		this.S = S;
		this.P = P; 
		this.x = x;
		this.h = h;
		this.w = 10;
	}
	
	display() {
		var sum = this.E+this.C+this.S+this.P;
		var EH = this.h*this.E/sum;
		var CH = this.h*this.C/sum;
		var SH = this.h*this.S/sum;
		var PH = this.h*this.P/sum;
		var W = ceil(this.w)+1;
		
		noStroke();
		push();
		translate(this.x,0);
		fill(colorEnzyme);
		rect(0,0,W,EH);
		fill(colorComplex);
		rect(0,EH,W,CH);
		fill(colorSubstrate);
		rect(0,EH+CH,W,SH);
		fill(colorProduct);
		rect(0,EH+CH+SH,W,PH);
		pop();
		
	}
}