/* 
	Interactive simulation of Michaelis-Menten Enzyme kinetics
*/

var allMols = [];
var numMols = 100;

// Counters
var allE = 0;

var fieldWidth = 1000;
var fieldHeight = 1000;
var fieldLeft = 50;
var fieldTop = 50;

var curScale = 1;

var colorEnzyme;
var colorSubstrate;

var maxVel = 3;
var maxVelSq = maxVel*maxVel;

var bindDist = 20;
var bindProb = 0.06;
var unbindProb = 0.005;
var unbindAsProductProb = 0.002;

function setup(){
	
	var divWidth = document.getElementById('sketch-holder').offsetWidth;
	/*if (divWidth > 1.75*fieldWidth){
		divWidth = 1.75*fieldWidth;
	}*/
	var divHeight;
	if (divWidth < fieldHeight){
		divHeight = fieldHeight;
	} else {
		divHeight = fieldHeight + 200;
	}
	
	divHeight = divWidth;
		
	//fieldTop = floor(0 * divHeight);
	//fieldTop = 0;
	//fieldLeft = floor(0.5 * divWidth);
	//fieldTop = floor(0.18 * divHeight);
	//fieldLeft = floor(0.63 * divWidth);
	//fieldWidth = floor(0.33 * divWidth);
	//fieldHeight = fieldWidth;
	
	curScale = (divWidth-fieldLeft*2)/fieldWidth;

	// Create canvas
	cnv = createCanvas(divWidth, divHeight);
	cnv.parent('sketch-holder');
	cnv.style('display','block');
	
	
	// Define the colors
	colorEnzyme = color(150,255,150);
	colorComplex = color(100,100,200);
	colorSubstrate = color(100,100,255);
	colorProduct = color(255,100,100);
	
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
	
	// Start the simulation
	startupSim();
}

function startupSim(){
	// Reset arrays
	allMols = [];
	// Reset counters
	numE = 0;
	
	// Initialize molecules
	for (var p = 0; p < numMols; p++){
		
		// Fifty-fifty
		if (random(1) < 0.5){
			var newMolecule = new Enzyme();
		} else {
			var newMolecule = new Substrate();
		}
		
		/*
		// Only complex
		var newMolecule = new Enzyme();
		newMolecule.type = 'Complex';
		*/
		
		numE++;
		allMols.push(newMolecule);
	}	
}

function pauseSim(){
	// Change the state of "timeIsRunning"
	timeIsRunning = !timeIsRunning;		
}

function draw(){
	
	background(0);

	/*	
	// Load variables from sliders
	infProb = infSlider.value();
	infDist = infRadiusSlider.value();
	infDistSq = infDist*infDist;
	
	fill(255);
	text('Infection probability',sliderLeft, sliderTop+sliderHeight-10)
	fill(255);
	text('Infection radius',sliderLeft, sliderTop+sliderHeight*2-10)
	*/
	
	push();
	translate(fieldLeft,fieldTop);
	scale(curScale);
	var borderWidth = 10;
	var extraWidth = 3;
	fill(50)
	rect(-borderWidth,-borderWidth,fieldWidth+borderWidth*2,fieldHeight+borderWidth*2);
	fill(0);
	rect(-extraWidth,-extraWidth,fieldWidth+extraWidth*2,fieldHeight+extraWidth*2);
	//rect(0,0,fieldWidth,fieldHeight);
	
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
			}
			// Try to unbind as product
			if (random(1) < unbindAsProductProb){
				allMols[p].unbind();
				var newMolecule = new Substrate();
				newMolecule.type = 'Product';
				newMolecule.pos.x = allMols[p].pos.x;
				newMolecule.pos.y = allMols[p].pos.y;
				allMols.push(newMolecule);
			}
		}
	}
	for (var p = numMols-1; p >= 0; p--){
		if (allMols[p].toRemove == 1){
			allMols.splice(p,1);
		}
	}
	numMols = allMols.length;
	
	pop();
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
		this.size = 20;
		this.color = colorSubstrate;
	}
	
	
	display(){
		if (this.type == 'Substrate'){
			this.color = colorSubstrate;
		} else {
			this.color = colorProduct;
		}
		fill(this.color);
		push();
		noStroke();
		translate(this.pos.x,this.pos.y);
		ellipse(0,0,this.size);
		pop(); 
	}	
}

class Enzyme extends Molecule{
	constructor() {	
		super('Enzyme'); 
		this.color = colorEnzyme;
		this.size = 30;
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
	}
	
	unbind(){
		this.type = 'Enzyme';
	}
	
	display(){
		push();
		noStroke();
		translate(this.pos.x,this.pos.y);
		rotate(this.angle);
		fill(this.color);
		rect(-this.size/2,-this.size/4,this.size,this.size/2);
		if (this.type == 'Enzyme'){
			fill(0);
		} else {
			fill(colorComplex);
		}
		ellipse(0,0,20);
		fill(50,155,50,50)
		rect(-this.size/2,-this.size/4,this.size,this.size/2);
		pop(); 
		this.changeRotation();
		//ellipse(this.x,this.y,this.diameter);
	}	
}