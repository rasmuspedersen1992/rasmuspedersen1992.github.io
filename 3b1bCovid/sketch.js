/* Interactive version of the simulation in the "Simulating an epidemic" video by 3blue1brown on Youtube
	
	
*/
var divWidth; 
var divHeight;

var fieldTop = 0;
var fieldLeft = 400;

var fieldWidth = 200;
var fieldHeight = fieldWidth;
var particleDiameter = 4;

var numPerson = 750;
var allPersons =[];

//var maxVel = 0.75;
//var maxAcc = .25;
var maxVel = 1;
var maxAcc = .5;
var maxVelSq = maxVel*maxVel;
var maxAccSq = maxAcc*maxAcc;

var infDist = 8; // Infection distance (Radius)
var infDistSq = infDist*infDist;

// Variables to change
var infProb = 0.2; // Probability of infection
var infSlider;
var infRadiusSlider;

// Buttons
var restartButton;

var timeIsRunning = true;
var timeStep = 0.5;
var fullTime = 0;

var maxInfTime = 100;

var colorS;
var colorI;
var colorR;

// Counters
var numS = 0;
var numI = 0;
var numR = 0;

// Constants for graph
var graphHeight = 200;
var graphWidth = 100;
var graphTop = 10;
var graphLeft = 20;

var sliderHeight = 70;
var sliderWidth = 200;
var sliderTop = graphTop + graphHeight + sliderHeight + 100;
var sliderLeft = graphLeft + 25;

// Objects for the graph
var graphLines =[];

function setup(){
	
	divWidth = document.getElementById('sketch-holder').offsetWidth;
	/*if (divWidth > 1.75*fieldWidth){
		divWidth = 1.75*fieldWidth;
	}*/
	if (divWidth < fieldHeight){
		divHeight = fieldHeight;
	} else {
		divHeight = fieldHeight + 200;
	}
	
	divHeight = 800;
		
	//fieldTop = floor(0 * divHeight);
	//fieldTop = 0;
	//fieldLeft = floor(0.5 * divWidth);
	fieldTop = floor(0.18 * divHeight);
	fieldLeft = floor(0.63 * divWidth);
	fieldWidth = 400;
	//fieldWidth = floor(0.33 * divWidth);
	fieldHeight = fieldWidth;

	// Create canvas
	cnv = createCanvas(divWidth, divHeight);
	cnv.parent('sketch-holder');
	cnv.style('display','block');
	
	// Define the colors
	colorS = color(121,188,201);
	//colorS = color(107,191,235);
	//colorS = color(49,96,110);
	colorI = color(245,102,84);
	colorR = color(27,27,27);
	
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
	
	// Start the simulation
	startupSim();
}

function startupSim(){
	// Reset arrays
	allPersons = [];
	graphLines =[];
	// Reset counters
	numS = 0;
	numI = 0;
	numR = 0;
	fullTime = 0;
	// Initialize people
	for (var p = 0; p < numPerson; p++){
		/*
		if (random()>0.5){
			var newPerson = new Person('I');
			numI++;
		}else{
			var newPerson = new Person('S');
			numS++;
		}*/
		var newPerson = new Person('S');
		numS++;
		allPersons.push(newPerson);
	}
	// Infect one
	allPersons[0].infect();
	
	
}

function pauseSim(){
	// Change the state of "timeIsRunning"
	timeIsRunning = !timeIsRunning;		
}

function draw(){
	
	background(0);
	
	// Load variables from sliders
	infProb = infSlider.value();
	infDist = infRadiusSlider.value();
	infDistSq = infDist*infDist;
	
	fill(255);
	text('Infection probability',sliderLeft, sliderTop+sliderHeight-10)
	text(infProb,sliderLeft, sliderTop+sliderHeight*2-40)
	text('Infection radius',sliderLeft, sliderTop+sliderHeight*2-10)
	text(infDist,sliderLeft, sliderTop+sliderHeight*3-40)
	
	push();
	translate(fieldLeft,fieldTop);
	var scaleFactor = divWidth/fieldWidth;
	scale(scaleFactor*0.33);
	var bWidth = 2;
	var bOffset = 10;
	fill(255,255,255) 
	rect(-bWidth-bOffset,-bWidth-bOffset,fieldWidth+bWidth*2+bOffset*2,fieldHeight+bWidth*2+bOffset*2);
	fill(0,0,0) 
	rect(-bOffset,-bOffset,fieldWidth+bOffset*2,fieldHeight+bOffset*2);
	
	for (var p = 0; p < numPerson; p++){
		if (timeIsRunning){
		allPersons[p].move();
		allPersons[p].updateState();
		// Try to spread disease
		if (allPersons[p].stage == 'I'){
			// Go through all
			for (var p2 = 0; p2 < numPerson; p2++){
				// If the person is susceptible
				if (allPersons[p2].stage == 'S'){
					// If it is not the same person
					if (p2 != p){
						// Calculate distance
						var xDist = allPersons[p].pos.x-allPersons[p2].pos.x;
						var yDist = allPersons[p].pos.y-allPersons[p2].pos.y;
						var distSq = xDist*xDist+yDist*yDist;
						if (distSq < infDistSq){
							// INFECT
							if (random() < infProb){
								allPersons[p2].infect();
							}
						}
					}
				}
			}
		}
		}
		// Finally, display the person
		allPersons[p].display();
	}
	pop();
	
	// Update time
	if (timeIsRunning){
		fullTime += timeStep;
	}
	
	// ------------ PLOT GRAPH ------------
	// Get the current state
	var percS = numS/numPerson;
	var percI = numI/numPerson;
	var percR = numR/numPerson;
	
	
	translate(graphTop,graphLeft)
	
	// Make the new line
	var newGraphLine = new graphLine(fullTime);
	graphLines.push(newGraphLine);
	
	for (var g = 0; g < graphLines.length; g++){
		graphLines[g].draw();
	}
	
	//var newRrect = 
	
	// Test
	//var curWidth = graphWidth/fullTime;
	//rect(0,0,curWidth,graphHeight);
}

class graphLine{
	
	constructor(time){
		this.time = time;
		this.percS = numS/numPerson;
		this.percI = numI/numPerson;
		this.percR = numR/numPerson;
		this.totalHeight = divHeight*0.4;
		this.totalWidth = divWidth*0.55;
		//this.totalHeight = 300;
		//this.totalWidth = 500;
		this.color = color(random(255),random(255),random(255));
	}
	
	draw(){
		var startX = this.totalWidth*(this.time/fullTime);
		//var curWidth = this.totalWidth*(this.time+timeStep)/fullTime;
		//var curWidth = this.totalWidth/graphLines.length;
		fill(this.color);
		noStroke();
		
		fill(colorR);
		rect(startX,0,this.totalWidth-startX,this.totalHeight*this.percR);
		fill(colorS);
		rect(startX,this.totalHeight*this.percR,this.totalWidth-startX,this.totalHeight*this.percS);
		fill(colorI);
		rect(startX,this.totalHeight*this.percR+this.totalHeight*this.percS,this.totalWidth-startX,this.totalHeight*this.percI);
		/* WRONG ORDER
		fill(colorR);
		rect(startX,0,this.totalWidth-startX,this.totalHeight*this.percR);
		fill(colorI);
		rect(startX,this.totalHeight*this.percR,this.totalWidth-startX,this.totalHeight*this.percI);
		fill(colorS);
		rect(startX,this.totalHeight*this.percR+this.totalHeight*this.percI,this.tota
		lWidth-startX,this.totalHeight*this.percS);
		*/
	}
}

class Person {
	
	// Function for getting color must be declared first to be used in constructor
	getColor(s){
		switch(s){
			case 'S':
				this.color = colorS;
				break;
			case 'I':
				this.color = colorI;
				break; 
			case 'R':
				this.color = colorR;
				break;
		}
	}
	
	constructor(stage) {
		this.stage = stage;
		
		/*
		this.x = random(fieldWidth);
		this.y = random(fieldHeight);
		this.vX = 0;
		this.vY = 0;
		this.aX = 0;
		this.aY = 0;
		*/
		
		this.pos = createVector(random(fieldWidth),random(fieldHeight));
		this.vel = createVector(random(-maxVel,maxVel)/1.6,random(-maxVel,maxVel)/1.6);
		this.acc = createVector(random(-maxAcc,maxAcc)/1.6,random(-maxAcc,maxAcc)/1.6);
		this.acc = createVector(0,0);
		this.diameter = particleDiameter;
		this.color = color(0,0,0);
		this.disTime = 0;
		
		// Get the correct color
		this.getColor(this.stage);
	}
	
	infect(){
		this.disTime = 0;
		this.stage = 'I';
		numS--;
		numI++;
	}
	
	updateState(){
		if (this.stage == 'I'){
			// Update disease time
			this.disTime += timeStep;
			
			// If disease time is finished
			if (this.disTime >= maxInfTime){
				// Update own stage
				this.stage = 'R';
				
				// Update counters
				numI--;
				numR++;
			}
		}
		
		// Get the correct color
		this.getColor(this.stage);
	}
	
	move(){
		// Add some random acceleration
		var accToAdd = 0.1;
		this.acc.add(createVector(random(-accToAdd,accToAdd),random(-accToAdd,accToAdd)));
		
		// Limit acceleration
		if (this.acc.magSq() > maxAccSq){
			this.acc.div(this.acc.mag());
			this.acc.mult(maxAcc);
		}
		
		// Boundaries
		var maxX = fieldWidth;
		var maxY = fieldHeight;
		
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
		
		
		// Update velocity
		this.vel.add(p5.Vector.mult(this.acc,timeStep));
		
		// Limit velocity
		if (this.vel.magSq() > maxVelSq){
			this.vel.div(this.vel.mag());
			this.vel.mult(maxVel);
		}
		
		// Update position
		this.pos.add(p5.Vector.mult(this.vel,timeStep));
				
	}
	
	display(){
		fill(this.color);
		stroke(0,0,0,50);
		strokeWeight(0.5)
		ellipse(this.pos.x,this.pos.y,this.diameter);
		//ellipse(this.x,this.y,this.diameter);
	}	
}