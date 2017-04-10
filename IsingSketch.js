
var lattice = [];
var temperature;

var TotNumMoves=0;
var TotAccepted=0;
var TotMonteCarloAccepted=0;
var TotRejected=0;

function setup() {
	temperature = 2;

	var possibleSpins = [-1,1];


  // createCanvas(200, 200); 
  createCanvas(400, 400); 
	for (var a = 0; a < width; a++) {
    	lattice[a] = [];
    	for (var b = 0; b < height; b++) {
      		lattice[a][b] = new tile(a,b,random(possibleSpins));
      		// lattice[a][b].neighbours = [];
 		}
 	}

	for (var a = 0; a < width; a++) {
    	for (var b = 0; b < height; b++) {

    		if (a == 0){
    			lattice[a][b].addNeighbour(lattice[width-1][b]);
    			lattice[width-1][b].addNeighbour(lattice[a][b]);
    		 }
    		if (b == 0){
    			lattice[a][b].addNeighbour(lattice[a][height-1]);
    			lattice[a][height-1].addNeighbour(lattice[a][b]);
    		 }
			if (a != width-1){
				lattice[a][b].addNeighbour(lattice[a+1][b]);
				lattice[a+1][b].addNeighbour(lattice[a][b]);
			}
			if (b != height-1){
 				lattice[a][b].addNeighbour(lattice[a][b+1]);
 				lattice[a][b+1].addNeighbour(lattice[a][b]);
 			}
 			


 		}
 	}

	scale(1);

	for (var a = 0; a < width; a++) {
    	for (var b = 0; b < height; b++) {
    		lattice[a][b].calcEnergy();
    		lattice[a][b].display();
    	}
    }


}

function draw() {

	scale(1);
	// Flip n random spins
	var n = 1000;
	for (var i = 0; i < n; i++){
	    var x = Math.floor(random(width));
    	var y = Math.floor(random(height));


    	// Sum up local energy before flipping
    	var oldEnergy = 0;
    	oldEnergy += lattice[x][y].energyContr;
    	for (var k = lattice[x][y].neighbours.length - 1; k >= 0; k--) {
    		oldEnergy += lattice[x][y].neighbours[k].energyContr;
    	}

    	// Flip the spin
    	lattice[x][y].spin *= -1;

    	// Calculate new local energy
    	var newEnergy = 0;
    	lattice[x][y].calcEnergy();
    	newEnergy += lattice[x][y].energyContr;
    	for (var k = lattice[x][y].neighbours.length - 1; k >= 0; k--) {
    		lattice[x][y].neighbours[k].calcEnergy();
    		newEnergy += lattice[x][y].neighbours[k].energyContr;
    	}

    	var deltaEnergy = newEnergy- oldEnergy;

    	if (deltaEnergy <= 0){ //If the new energy is higher
    		// Allow the move
    		TotAccepted++;
    	} else if(random(1)< Math.exp(-deltaEnergy/temperature)) {
    		// Allow the move
    		TotMonteCarloAccepted++;
    	} else{
    		lattice[x][y].spin *= -1; // Flip the spin back
    		lattice[x][y].calcEnergy(); //Recalculate the energy
    		TotRejected++;
    	}

    	//Finish by recalculaing the energy contributions and redrawing the site and its neightbours
    	lattice[x][y].display();
    	for (var k = lattice[x][y].neighbours.length - 1; k >= 0; k--) {
    		lattice[x][y].neighbours[k].calcEnergy();
    		lattice[x][y].neighbours[k].display();
    	}

    	TotNumMoves++;




  //   	for (var k= 0; k < ; k++) {
  //   		lattice[x][y].neighbours[k].calcEnergy();
  //   		lattice[x][y].neighbours[k].display();
		// }
	}
	stroke(0);
	fill(150,150,150);
	rect(2,2,100,70);

	textSize(8);

	// fill(150,50,50);
	fill(255);
	text("Temperature: "+temperature,10,10);
	text("Total moves: "+TotNumMoves.toString(),10,25);
	text("Lower energy: "+TotAccepted,10,40);
	text("Monte carlo: "+TotMonteCarloAccepted,10,55);
	text("Rejected: "+TotRejected,10,70);

}


function tile(x,y,spin){
	this.spin = spin;
	this.pos = createVector(x,y); 
	this.energyContr=0;

	this.neighbours = [];


	this.display = function(){
		// stroke(100+this.spin*100,-this.energyContr*50,0);
		stroke(this.spin*255);
		// stroke(0,this.energyContr*50,0);
		point(this.pos.x,this.pos.y);
	}

	this.addNeighbour = function(nei){
		this.neighbours.push(nei);
	}

	this.calcEnergy = function(){
		this.energyContr = 0;
		for (var i = 0; i < 4; i++){ 
		// for (var i = this.neighbours.length - 1; i >= 0; i--) {
			this.energyContr -= (this.spin*this.neighbours[i].spin);
		}

	}
}