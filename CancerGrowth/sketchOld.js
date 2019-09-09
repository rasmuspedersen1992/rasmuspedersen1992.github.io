var allCells = [];
var occupiedGrids = [];
var startCell;

var diffDeathRate = 0;
var diffMoveRate = 0.5;
var stemDivRate = 0.1;
var diffDivRate = 0.1;
var rhoMax = 2;
var maturationAge = 1;

var maxCellsAllowed = 3000;

var simulationRunning = true;

//var zoomLevel = 5;
var curScale = 6;
function setup() {
	//createCanvas(800, 600,WEBGL); 
	createCanvas(800, 600); 
	noStroke(); // For not drawing borders


	// Define colors
	colorStem  = color(150,255,150);
	colorYoung = color(220,220,220);
	colorDiff  = color(150,150,150);
	colorDead  = color(255, 100,100);
	colorQuie  = color(100, 100,100);

	// Start simulation
	initializeSimulation();
}

function initializeSimulation(){
	// Make sure array of cells is empty
	allCells = [];  
	// Instantiate starting stem-cell
	iniPosition = createVector(1,1);
	startCell = new Cell(iniPosition,'stem');
	// Add to list of all cells
	allCells.push(startCell);
}

function keyPressed(){
	// If the user presses "r" on the keyboard, reset simulation
	if (keyCode== 82){
		initializeSimulation();
	}
	// If the user presses spcae on the keyboard, pause/unpause
	if (keyCode== 32){
		simulationRunning = !simulationRunning;
	}
	
	// For testing interactive stuff
	// --- diffDeathRate ---
	var deltaDeathRate = 0.01;
	if (keyCode== 84){
			diffDeathRate = diffDeathRate + deltaDeathRate;
		if (diffDeathRate > 1){
			diffDeathRate = 1;
		}
	}
	if (keyCode== 71){
		diffDeathRate = 0;		
	}
	if (keyCode== 66){
			diffDeathRate = diffDeathRate - deltaDeathRate;
		if (diffDeathRate < 0){
			diffDeathRate = 0;
		}
	}
	
	// --- diffDeathRate ---
	var deltaMoveRate = 0.01;
	if (keyCode== 89){
			diffMoveRate = diffMoveRate + deltaMoveRate;
		if (diffMoveRate > 1){
			diffMoveRate = 1;
		}
	}
	if (keyCode== 72){
		diffMoveRate = 0;		
	}
	if (keyCode== 78){
			diffMoveRate = diffMoveRate - deltaMoveRate;
		if (diffMoveRate < 0){
			diffMoveRate = 0;
		}
	}
	
	// --- rhoMax ---
	var deltarho = 1;
	if (keyCode== 85){
			rhoMax = rhoMax + deltarho;
	}
	if (keyCode== 724){
		rhoMax = 0;		
	}
	if (keyCode== 77){
			rhoMax = rhoMax - deltarho;
		if (rhoMax < 0){
			rhoMax = 0;
		}
	}
}

// Draw stuff
function draw() {
	
  background(150,100,100); 
  translate(width/2,height/2); // Move center for non-WEBGL version
  //scale(zoomLevel);
  
  // If there are not too many cells, and simulation is not paused
  if (simulationRunning && (allCells.length < maxCellsAllowed)){
	  
	for (var k = 0; k < allCells.length; k++) {
		// For testing
		//if ((frameCount % 10)==0){
		allCells[k].update(); 
		//}
		allCells[k].display();
	}
	// Remove dead cells (Iterate backwards for removal)
	for (var k = allCells.length-1; k > 0; k--){
		if (allCells[k].state =='dead'){
			allCells.splice(k,1);
		// Also stop considering the cell if all its neighbours are quiescent
		//} else if (allCells[k].numQuiescentNeighbours == 8){
			//allCells.splice(k,1);		
			
			// !!! DOESNT WORK, BAD IDEA. Thought it would optimize stuff, but it doesn't
		}
	}
	// If max cells is reached, stop simulation
	} else {	  
		// Simply display all cells, but don't update them
		for (var k = 0; k < allCells.length; k++) {
			allCells[k].display();
		} 
	}

	var textDist = 30;
  fill(color(0,0,0));
  text('Press space to pause',-width/2,-textDist*2)
  text('Press r to reset',-width/2,-textDist)
  text('Press other letters to change variables',-width/2,0)
  text('Death rate: '+diffDeathRate.toFixed(2),-width/2,textDist)
  text('Move rate: '+diffMoveRate.toFixed(2),-width/2,textDist*2)
  text('Stem-cell division rate: '+stemDivRate.toFixed(2),-width/2,textDist*3)
  text('Other cells division rate: '+diffDivRate.toFixed(2),-width/2,textDist*4)
  text('Max number of divisions: '+rhoMax,-width/2,textDist*5)
  text('Maturation age: '+maturationAge,-width/2,textDist*6)
/*var diffDivRate = 0.1;
var rhoMax = 2;
var maturationAge = 1;
*/
	
}

class Cell {
	    
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
  constructor(iniPosition,state) {
    this.x = iniPosition.x;
    this.y = iniPosition.y;
	this.pos = iniPosition;
	this.size = 1;
	this.state = state;
	this.age = 0;
	this.rho = rhoMax; // Default value
	this.numQuiescentNeighbours = 0;
  }
  
  findNeighbours(){
	// Check if neighbouring points are occupied	  
	var neighN  = this.pos.copy().add(createVector(0,-1));
	var neighS  = this.pos.copy().add(createVector(0, 1));
	var neighE  = this.pos.copy().add(createVector( 1,0));
	var neighW  = this.pos.copy().add(createVector(-1,0));
	var neighNE = this.pos.copy().add(createVector(1, -1));
	var neighSE = this.pos.copy().add(createVector(1, 1));
	var neighNW = this.pos.copy().add(createVector(-1,-1));
	var neighSW = this.pos.copy().add(createVector(-1,1));

	var directionDict ={};
	directionDict[0] = neighN;
	directionDict[1] = neighS;
	directionDict[2] = neighE;
	directionDict[3] = neighW;
	directionDict[4] = neighNE;
	directionDict[5] = neighSE;
	directionDict[6] = neighNW;
	directionDict[7] = neighSW;

	var freeDirections = [0,1,2,3,4,5,6,7];
	var numQuiescentNeighbours = 0;
	for (var k = 0; k < allCells.length; k++) {
		if (allCells[k].numQuiescentNeighbours < 8){
		
			// If the position of the cell is north of here
			if (allCells[k].pos.equals(neighN)){
				// If it is quiescent...
				if (allCells[k].state == 'quiescent'){
					// ... add one to the count of quiescent neighbours
					numQuiescentNeighbours++;
				}
				// Remove north from the array of free directions
				for (var j = freeDirections.length; j >= 0; j--){
					if (freeDirections[j] == 0){
						freeDirections.splice(j,1);
					}
				}
			} 
			
			// Same thing for all other directions
			if (allCells[k].pos.equals(neighS)){
				if (allCells[k].state == 'quiescent'){
					numQuiescentNeighbours++;
				}
				for (var j = freeDirections.length; j >= 0; j--){
					if (freeDirections[j] == 1){
						freeDirections.splice(j,1);
					}
				}
			}
			
			if (allCells[k].pos.equals(neighE)){
				if (allCells[k].state == 'quiescent'){
					numQuiescentNeighbours++;
				}
				for (var j = freeDirections.length; j >= 0; j--){
					if (freeDirections[j] == 2){
						freeDirections.splice(j,1);
					}
				}
			}
			
			if (allCells[k].pos.equals(neighW)){
				if (allCells[k].state == 'quiescent'){
					numQuiescentNeighbours++;
				}
				for (var j = freeDirections.length; j >= 0; j--){
					if (freeDirections[j] == 3){
						freeDirections.splice(j,1);
					}
				}
			}
			
			if (allCells[k].pos.equals(neighNE)){
				if (allCells[k].state == 'quiescent'){
					numQuiescentNeighbours++;
				}			
				for (var j = freeDirections.length; j >= 0; j--){
					if (freeDirections[j] == 4){
						freeDirections.splice(j,1);
					}
				}
			}
			
			if (allCells[k].pos.equals(neighSE)){
				if (allCells[k].state == 'quiescent'){
					numQuiescentNeighbours++;
				}
				for (var j = freeDirections.length; j >= 0; j--){
					if (freeDirections[j] == 5){
						freeDirections.splice(j,1);
					}
				}
			}
			
			if (allCells[k].pos.equals(neighNW)){
				if (allCells[k].state == 'quiescent'){
					numQuiescentNeighbours++;
				}
				for (var j = freeDirections.length; j >= 0; j--){
					if (freeDirections[j] == 6){
						freeDirections.splice(j,1);
					}
				}
			}
			
			if (allCells[k].pos.equals(neighSW)){
				if (allCells[k].state == 'quiescent'){
					numQuiescentNeighbours++;
				}
				for (var j = freeDirections.length; j >= 0; j--){
					if (freeDirections[j] == 7){
						freeDirections.splice(j,1);
					}
				}
			}
		}
	}
	return [freeDirections,directionDict,numQuiescentNeighbours];
  }
  
  update(){
	  
	  // Increase cell age
	  this.age++;
	  
	  // Skip cell if it is quiescent
	  if (this.state != 'quiescent'){
		  
		var [freeDirections,directionDict,numQuiescentNeighbours] = this.findNeighbours();
		this.numQuiescentNeighbours = numQuiescentNeighbours;
		
		  switch(this.state){
				case 'stem':	
					// If there is empty space around the cell
					if (freeDirections.length > 0){
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
						}
					}
				break;
				case 'young':			
					// If there is no space around the cell, turn quiescent
					if (freeDirections.length < 1){
						this.state = 'quiescent';
					} else {
		  
						// Probability for differentiated cells to move around
						if (random() < diffMoveRate){
							// Pick a random free direction
							var randDir = freeDirections[Math.floor(Math.random()*freeDirections.length)];
							// Get the corresponding position
							var newPos = directionDict[randDir];
							// Change the coordinates of the cell
							this.pos.x = newPos.x;
							this.pos.y = newPos.y;
						}
					}
					
					// Mature if age is above maturation age
					if (this.age > maturationAge){
						this.state = 'diff';
					}
					
				break;
				case 'diff':			
					// If there is no space around the cell, turn quiescent
					if (freeDirections.length < 1){
						this.state = 'quiescent';
					} else {
						// Probability for differentiated cells to move around
						if (random() < diffMoveRate){
							// Pick a random free direction
							var randDir = freeDirections[Math.floor(Math.random()*freeDirections.length)];
							// Get the corresponding position
							var newPos = directionDict[randDir];
							// Change the coordinates of the cell
							this.pos.x = newPos.x;
							this.pos.y = newPos.y;
						}
					
						// Probability of spontaneous cell-death
						if (random() < diffDeathRate){
							this.state = 'dead';
						}
						
						// Check for space again, and try to divide
						[freeDirections,directionDict,numQuiescentNeighbours] = this.findNeighbours();
						if (freeDirections.length > 0){
							// Probability of differentiated cell division
							if (random() < diffDivRate){
								// Pick a random free direction
								var randDir = freeDirections[Math.floor(Math.random()*freeDirections.length)];
								// Get the corresponding position
								var newPos = directionDict[randDir];
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
							this.state = 'dead';
						}
					}
					
				break;
				case 'dead':		
				break;
		  }
	  }
  }
  
  display(){
	this.getColor();
	fill(this.color);
	//rect(this.pos.x,this.pos.y,this.size,this.size);
	
	rect(this.pos.x*curScale,this.pos.y*curScale,this.size*curScale,this.size*curScale);
	//ellipse(this.pos.x*curScale,this.pos.y*curScale,this.size*curScale*1.5);
  }  
}