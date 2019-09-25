// Cancer growth simulation, inspired by Enderling et al (2009)
// "Paradoxical Dependencies of Tumor Dormancy and Progression on Basic Cell Kinetics"
// Simulation made for blog post for mathematical oncology blog
// http://blog.mathematical-oncology.org/ 

// Version 1.00
// Created by Rasmus Kristoffer Pedersen
// rasmuspedersen1992@gmail.com


// Model parameters
var diffDeathRate = 0.05; // Rate of random death for differentiated cells (unit: per time-step)
var diffMoveRate = 0.05; // Rate of movement for differentiated cells (unit: per time-step) 
var stemDivRate = 0.1; // Rate of division for stem cells (unit: per time-step)
var diffDivRate = 0.1; // Rate of division for differentiated cells (unit: per time-step)
var rhoMax = 2; // Max number of divisions before cell dies
var maturationAge = 10; // Number of time-steps before cell mature and start dividing

var allCells = []; // Array for all cells
var maxCellsAllowed = 45000; // Simulation stops when the cell-count reaches this number, which is approximately a full screen

var occuPos;// Dictionary for keeping track of occupied positions

var curScale = 5; // Scaling factor of cells (1 -> one-pixel size)
var timeScale = 1; // Number of frames between updates
var simTime = 0; // Number of frames simulated

// Interactivity
var simulationRunning = true;
var showControls = true; // Whether to show the controls or not
var allButtons = []; // Array for keeping track of all buttons

// Setup function is run once, on page-load
function setup() {
	createCanvas(800, 800); 
	//createCanvas(800, 800,WEBGL); // WEBGL can be used for easier 3D 
	
	noStroke(); // For not drawing borders
	
	// Create buttons for interactivity
	var buttonDist = 20;
	var buttonOffset = 10;
	var buttonXsize = 30;
	var buttonYsize = 20;
	// Reset button
	resetButton = createButton('Reset'); // Create the button, and set its text
	resetButton.position(10,buttonOffset); // Position it
	resetButton.mousePressed(initializeSimulation); // Assign it a function to run
	resetButton.size(60,40); // Set the size of the button
	allButtons.push(resetButton); // Add it to the array of all buttons
	// Death rate 
	deathUpButton = createButton('+');
	deathUpButton.position(10,buttonDist*2+buttonOffset);
	deathUpButton.mousePressed(incDeathRate);
	deathUpButton.size(buttonXsize,buttonYsize);
	allButtons.push(deathUpButton);
	deathDownButton = createButton('-');
	deathDownButton.position(40,buttonDist*2+buttonOffset);
	deathDownButton.mousePressed(decDeathRate);
	deathDownButton.size(buttonXsize,buttonYsize);
	allButtons.push(deathDownButton);
	// Division rate (Same for both stem and non-stem)
	divUpButton = createButton('+');
	divUpButton.position(10,buttonDist*3+buttonOffset);
	divUpButton.mousePressed(incDivRate);
	divUpButton.size(buttonXsize,buttonYsize);
	allButtons.push(divUpButton);
	divDownButton = createButton('-');
	divDownButton.position(40,buttonDist*3+buttonOffset);
	divDownButton.mousePressed(decDivRate);
	divDownButton.size(buttonXsize,buttonYsize);
	allButtons.push(divDownButton);
	// Maturation time
	matUpButton = createButton('+');
	matUpButton.position(10,buttonDist*4+buttonOffset);
	matUpButton.mousePressed(incMat);
	matUpButton.size(buttonXsize,buttonYsize);
	allButtons.push(matUpButton);
	matDownButton = createButton('-');
	matDownButton.position(40,buttonDist*4+buttonOffset);
	matDownButton.mousePressed(decMat);
	matDownButton.size(buttonXsize,buttonYsize);
	allButtons.push(matDownButton);
	// Divisions before cell death
	rhoUpButton = createButton('+');
	rhoUpButton.position(10,buttonDist*5+buttonOffset);
	rhoUpButton.mousePressed(incRho);
	rhoUpButton.size(buttonXsize,buttonYsize);
	allButtons.push(rhoUpButton);
	rhoDownButton = createButton('-');
	rhoDownButton.position(40,buttonDist*5+buttonOffset);
	rhoDownButton.mousePressed(decRho);
	rhoDownButton.size(buttonXsize,buttonYsize);
	allButtons.push(rhoDownButton);
	// Timescale
	timeUpButton = createButton('+');
	timeUpButton.position(10,buttonDist*6+buttonOffset);
	timeUpButton.mousePressed(incTime);
	timeUpButton.size(buttonXsize,buttonYsize);
	allButtons.push(timeUpButton);
	timeDownButton = createButton('-');
	timeDownButton.position(40,buttonDist*6+buttonOffset);
	timeDownButton.mousePressed(decTime);
	timeDownButton.size(buttonXsize,buttonYsize);
	allButtons.push(timeDownButton);

	// Define colors
	colorStem  = color(150,200,150);
	colorYoung = color(220,220,220);
	colorDiff  = color(150,150,150);
	colorDead  = color(255,100,100);
	colorQuie  = color(100,100,100);
	
	// For simplicity, we'll set division-rates equal for both cell types
	stemDivRate = diffDivRate;
	
	// Set the interactive buttons display state to the default "showControls"
	updateButtons();
	
	// Start simulation
	initializeSimulation();
}


// Draw loop, is run every frame
function draw() {
	// Make a single-colored background
	//background(255,255,255); // White
	background(150,100,100); // Red-ish
	
	// As default, top-left corner of sketch is (0,0). 
	// For simplicity, we shift the "the camera", so (0,0) is in the middle
	translate(width/2,height/2); // Move center for non-WEBGL version
	
	// Go through the array of cells, and display them
	for (var k = 0; k < allCells.length; k++) {
		allCells[k].display();
	}
  
	// If there are not too many cells, and simulation is not paused
	if (simulationRunning && (allCells.length < maxCellsAllowed)){
		
		// Only update cells every timeScale frame, allowing for the user to slow down simulation
		if ((frameCount % timeScale) == 0){
			simTime++; // Increment number of simulation time-steps taken
		
			// Go through all cells (Iterate backwards for removal)
			for (var k = allCells.length-1; k >= 0; k--){
				// Only update cell if it is not quiescent
				if (allCells[k].state !='quiescent'){ 
					allCells[k].update(); 
				}
							
				// Remove dead cells from the array
				if (allCells[k].state =='dead'){
					// Draw the dead cell again, so it is there for a single frame.
					allCells[k].display();
					// Remove its position from the dictionary of occupied positions
					occuPos.remove(posToDictKey(allCells[k].pos.x,allCells[k].pos.y));
					// And remove it from the array
					allCells.splice(k,1);
				}
			}		
		}
	}

	// If controls are set to be shown, draw the text, buttons and legend
	if (showControls){
		fill(color(0,0,0)); // Black color
		textSize(16); // Font-size
		var textDist = 20;
		var xOffset = 80;
		var yOffset = 65;
		text("Time elapsed: "+ simTime,-width/2+xOffset,-height/2+25);
		text("Cell count: "+ allCells.length,-width/2+xOffset,-height/2+45);
		text('Death rate: '+diffDeathRate.toFixed(2),-width/2+xOffset,-height/2+yOffset);
		text('Division rate: '+diffDivRate.toFixed(2),-width/2+xOffset,-height/2+yOffset+textDist);
		text('Maturation time: '+maturationAge,-width/2+xOffset,-height/2+yOffset+textDist*2);
		text('Max cell age: '+rhoMax,-width/2+xOffset,-height/2+yOffset+textDist*3);
		text('Update every '+timeScale+ ' frames',-width/2+xOffset,-height/2+yOffset+textDist*4);
		text('Press p to pause',-width/2+10,-height/2+yOffset+textDist*5+5);
		text('Press r to reset',-width/2+10,-height/2+yOffset+textDist*6+5);
		text('Press h to show/hide controls',-width/2+10,-height/2+yOffset+textDist*7+5);
		
		// Also show a legend for the cell colors 
		var legendX = -390;
		var legendY = -180;
		var legendCellSize = 20;
		var legendCellYDiff = legendCellSize+10;
		var legendTextXOff = 30;
		var legendTextYOff = 15;
		// Set stroke color to black for borders on legend
		stroke(color(0,0,0));
		strokeWeight(2);
		// Set the fill color
		fill(colorStem);
		// Draw a rectangle
		rect(legendX,legendY,legendCellSize,legendCellSize);
		// Set the fill color
		fill(colorYoung);
		// Draw a rectangle
		rect(legendX,legendY+legendCellYDiff,legendCellSize,legendCellSize);
		// Set the fill color
		fill(colorDiff);
		// Draw a rectangle
		rect(legendX,legendY+2*legendCellYDiff,legendCellSize,legendCellSize);
		// Set the fill color
		fill(colorQuie);
		// Draw a rectangle
		rect(legendX,legendY+3*legendCellYDiff,legendCellSize,legendCellSize);
		// Set the fill color
		fill(colorDead);
		// Draw a rectangle
		rect(legendX,legendY+4*legendCellYDiff,legendCellSize,legendCellSize);
		// Turn off stroke again
		noStroke()
		// Make the text
		fill(color(0,0,0));
		text('Stem cell'     ,legendX+legendTextXOff,legendY+legendTextYOff);
		text('Immature cell' ,legendX+legendTextXOff,legendY+legendTextYOff+legendCellYDiff);
		text('Mature cell'   ,legendX+legendTextXOff,legendY+legendTextYOff+2*legendCellYDiff);
		text('Quiescent cell',legendX+legendTextXOff,legendY+legendTextYOff+3*legendCellYDiff);
		text('Dead cell'     ,legendX+legendTextXOff,legendY+legendTextYOff+4*legendCellYDiff);
	}
}

// Function for reseting simulation
function initializeSimulation(){
	// Make sure array of cells is empty
	allCells = [];  
	// Instantiate starting stem-cell
	iniPosition = createVector(0,0);
	var startCell = new Cell(iniPosition,'stem');
	// Add to list of all cells
	allCells.push(startCell);
	// Add to list of occupied positions
	var KeyString = posToDictKey(iniPosition.x,iniPosition.y);
	occuPos = createStringDict(KeyString,'stem');

	// Reset time
	simTime = 0
}

// Function for formatting positions into the string used in the occupid positions dictionary
function posToDictKey(x,y){
	var toReturn = x.toString()+ ',' + y.toString();
	return toReturn
}

// Functions for buttons
function incDeathRate(){ // Increase death rate
	diffDeathRate = diffDeathRate + 0.01;
	if (diffDeathRate > 1){
		diffDeathRate = 1;
	}
}
function decDeathRate(){ // Decrease death rate
	diffDeathRate = diffDeathRate - 0.01;
	if (diffDeathRate < 0){
		diffDeathRate = 0;
	}
}
function incDivRate(){ // Increase division rate
	diffDivRate = diffDivRate + 0.01;
	if (diffDivRate > 1){
		diffDivRate = 1;
	}
}
function decDivRate(){ // Decrease division rate
	diffDivRate = diffDivRate - 0.01;
	if (diffDivRate < 0){
		diffDivRate = 0;
	}
}
function incMat(){ // Increase number of maturation-frames
	maturationAge = maturationAge + 1;
}
function decMat(){ // Decrease number of maturation-frames
	maturationAge = maturationAge - 1;
	if (maturationAge < 0){
		maturationAge = 0;
	}
}
function incRho(){ // Increase rho (Number of division before cell death)
	rhoMax = rhoMax + 1;
}
function decRho(){ // Decrease rho (Number of division before cell death)
	rhoMax = rhoMax - 1;
	if (rhoMax < 0){
		rhoMax = 0;
	}
}
function incTime(){ // Increase timescale / frame-update-skips
	timeScale = timeScale + 1;
}
function decTime(){ // Decrease timescale / frame-update-skips
	timeScale = timeScale - 1;
	if (timeScale < 0){
		timeScale = 0;
	}
}

// Function for updating the display-state of the buttons
function updateButtons(){
	for (var b = 0; b < allButtons.length;b++){
		if (showControls){
			allButtons[b].show();
		} else {
			allButtons[b].hide();
		}
	}
}

// keyPressed() detects keyboard presses, allowing for easy interactivity.
function keyPressed(){
	// If the user presses "r" on the keyboard, reset simulation
	if (keyCode== 82){
		initializeSimulation();
	}
	// If the user presses "p" on the keyboard, pause/unpause
	if (keyCode== 80){
		simulationRunning = !simulationRunning;
	}
	// If the user pressed "h", change control-display, and update button states
	if (keyCode== 72){
		showControls = !showControls;		
		updateButtons();
	}
}

// Class definition of a cell
class Cell {
	
	// Constructor function for the cell
	constructor(iniPosition,state) {
		this.x = iniPosition.x;
		this.y = iniPosition.y;
		this.pos = iniPosition;
		this.size = 1;
		this.state = state;
		this.age = 0;
		this.rho = rhoMax; // Default value
		this.numQuiescentNeighbours = 0;
		this.getColor();
	}
	// Function for updating the color-variable
	getColor(){
		switch (this.state) {
		  case 'stem':
			this.color = colorStem;
			break;
		  case 'young':
			this.color = colorYoung;
			break;
		  case 'diff':
			this.color = colorDiff;
			break;
		  case 'quiescent':
			this.color = colorQuie;
			break;
		  case 'dead':
			this.color = colorDead;
			break;
		}	  
	}
  
  // Function for finding neighbours. Returns directions without neighbours
  // Some optimization is probably possible
  findNeighbours(){
  	// Array of all free directions. Starts with all directions
	var freeDirections = [0,1,2,3,4,5,6,7];
	// First, define the eight neighbouring locations
	var neighN  = this.pos.copy().add(createVector(0,-1));
	var neighS  = this.pos.copy().add(createVector(0, 1));
	var neighE  = this.pos.copy().add(createVector( 1,0));
	var neighW  = this.pos.copy().add(createVector(-1,0));
	var neighNE = this.pos.copy().add(createVector(1, -1));
	var neighSE = this.pos.copy().add(createVector(1, 1));
	var neighNW = this.pos.copy().add(createVector(-1,-1));
	var neighSW = this.pos.copy().add(createVector(-1,1));
	
	// Make a dictionary, for translating direction-number into location
	var directionDict ={};
	directionDict[0] = neighN;
	directionDict[1] = neighS;
	directionDict[2] = neighE;
	directionDict[3] = neighW;
	directionDict[4] = neighNE;
	directionDict[5] = neighSE;
	directionDict[6] = neighNW;
	directionDict[7] = neighSW;
	
	// Check if the directions are in the occuPos dictionary
	// And remove it from the "freeDirections" vector if it is
	if (occuPos.hasKey(posToDictKey(neighN.x,neighN.y))){
		for (var j = freeDirections.length; j >= 0; j--){
			if (freeDirections[j] == 0){
				freeDirections.splice(j,1);
			}
		}
	}
	if (occuPos.hasKey(posToDictKey(neighS.x,neighS.y))){
		for (var j = freeDirections.length; j >= 0; j--){
			if (freeDirections[j] == 1){
				freeDirections.splice(j,1);
			}
		}
	}
	
	if (occuPos.hasKey(posToDictKey(neighE.x,neighE.y))){
		for (var j = freeDirections.length; j >= 0; j--){
			if (freeDirections[j] == 2){
				freeDirections.splice(j,1);
			}
		}
	}
	
	if (occuPos.hasKey(posToDictKey(neighW.x,neighW.y))){
		for (var j = freeDirections.length; j >= 0; j--){
			if (freeDirections[j] == 3){
				freeDirections.splice(j,1);
			}
		}
	}
	
	if (occuPos.hasKey(posToDictKey(neighNE.x,neighNE.y))){
		for (var j = freeDirections.length; j >= 0; j--){
			if (freeDirections[j] == 4){
				freeDirections.splice(j,1);
			}
		}
	}
	
	if (occuPos.hasKey(posToDictKey(neighSE.x,neighSE.y))){
		for (var j = freeDirections.length; j >= 0; j--){
			if (freeDirections[j] == 5){
				freeDirections.splice(j,1);
			}
		}
	}
	
	if (occuPos.hasKey(posToDictKey(neighNW.x,neighNW.y))){
		for (var j = freeDirections.length; j >= 0; j--){
			if (freeDirections[j] == 6){
				freeDirections.splice(j,1);
			}
		}
	}
	
	if (occuPos.hasKey(posToDictKey(neighSW.x,neighSW.y))){
		for (var j = freeDirections.length; j >= 0; j--){
			if (freeDirections[j] == 7){
				freeDirections.splice(j,1);
			}
		}
	}
	
	// Return the vector of free directions and the dictionary for translating the vector 
	return [freeDirections,directionDict];
  }
  
  // Sets the color of the cell to be the quiescent color
  setColorQuiescent(){
	  this.color = colorQuie;	  
  }
  
  update(){
	  
	// Increase cell age
	this.age++;
	
	if (this.state == 'young'){				
		// Mature if age is above maturation age
		if (this.age > maturationAge){
			// Update the dictionary of occupied position 
			// (In the current model, the cell-types of the neighbours are not important)
			// (But it could be an interesting extension, so we'll keep track of it in occuPos)
			occuPos.set(posToDictKey(this.pos.x,this.pos.y),'diff');
			
			// Set the state of the cell to the mature type
			this.state = 'diff';
			this.getColor();
		}
	}

	// // Skip cell if it is quiescent
	// if (this.state != 'quiescent'){
	
	// Get the free neighbouring directions
	var [freeDirections,directionDict] = this.findNeighbours();

	// If there is no space around the cell, color the cell quiescent
	if (freeDirections.length < 1){
		// Make sure the stem cell is always stem-cell colored
		if (this.state != 'stem'){
			this.setColorQuiescent(); 
		}
	// If there is space, do cell-specific actions
	} else {
			this.getColor();
		
		switch(this.state){
			
			case 'stem':	
				// Probability of stem cell division
				if (random() < stemDivRate){
					// Pick a random free direction
					var randDir = freeDirections[Math.floor(Math.random()*freeDirections.length)];
					// Get the corresponding position
					var newPos = directionDict[randDir];
					// Instantiate a new cell at that position
					var newCell = new Cell(newPos,'young');
					// Add it to the array of all cells
					allCells.push(newCell);	
					// Add to list of occupied positions
					occuPos.create(posToDictKey(newPos.x,newPos.y),'young');						
				}
			break;
			
			case 'young':	
			
				// Probability for differentiated cells to move around
				if (random() < diffMoveRate){
					// Pick a random free direction
					var randDir = freeDirections[Math.floor(Math.random()*freeDirections.length)];
					// Get the corresponding position
					var newPos = directionDict[randDir];
					
					// Add new position to list of occupied positions
					occuPos.create(posToDictKey(newPos.x,newPos.y),'young');
					// Remove the current position from the dictionary of occupied positions
					occuPos.remove(posToDictKey(this.pos.x,this.pos.y));	
					
					// Change the coordinates of the cell
					this.pos.x = newPos.x;
					this.pos.y = newPos.y;
				}
			break;
			
			case 'diff':	
		
				// Probability for differentiated cells to move around
				if (random() < diffMoveRate){
					// Pick a random free direction
					var randDir = freeDirections[Math.floor(Math.random()*freeDirections.length)];
					// Get the corresponding position
					var newPos = directionDict[randDir];
					
					// Add new position to list of occupied positions
					occuPos.create(posToDictKey(newPos.x,newPos.y),'diff');
					// Remove the current position from the dictionary of occupied positions
					occuPos.remove(posToDictKey(this.pos.x,this.pos.y));	
					
					// Change the coordinates of the cell
					this.pos.x = newPos.x;
					this.pos.y = newPos.y;
				}
			
				// Probability of spontaneous cell-death
				if (random() < diffDeathRate){
					// Set its state to dead
					this.state = 'dead';
					// Update the color
					this.getColor();
				}
				
				// Check for space again, and try to divide
				[freeDirections,directionDict] = this.findNeighbours();
				if (freeDirections.length > 0){
					// Probability of differentiated cell division
					if (random() < diffDivRate){
						// Pick a random free direction
						var randDir = freeDirections[Math.floor(Math.random()*freeDirections.length)];
						// Get the corresponding position
						var newPos = directionDict[randDir];
						
						// Add new position to list of occupied positions
						occuPos.create(posToDictKey(newPos.x,newPos.y),'young');
						
						// Instantiate a new cell at that position
						var newCell = new Cell(newPos,'young');
						// Add it to the array of all cells
						allCells.push(newCell);		

						// Decrease capacity
						this.rho--;
					}
				}
				
				// If capacity is exhausted, kill the cell
				if (this.rho <= 0){
					// Set its state to dead
					this.state = 'dead';
					// Update the color
					this.getColor();	
				}
			break;
			
			case 'dead':	
				// Dead cells do nothing, and are removed in main draw loop at next frame
			break;
		}
	}
}
	display(){
		// Set the current fill 
		fill(this.color);
		// Draw a rectangle
		rect(this.pos.x*curScale,this.pos.y*curScale,this.size*curScale,this.size*curScale);
		//ellipse(this.pos.x*curScale,this.pos.y*curScale,this.size*curScale*1.5);
	}  
}