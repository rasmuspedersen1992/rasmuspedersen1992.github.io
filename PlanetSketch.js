
// var boids = [];
// var numBoids = 100;
// var testBoid;
// var maxSpeed = 100;
var allPlanets = [];

  var testP;

  var timescale = 0.5;
  var gravConst = 0.1;
  var maxVel = 10;
  var mouseDisplayerSize = 0;
  var counter = 0;
  var mouseClickX;
  var mouseClickY;
  var velVector;

  var numStars = 100;
  var starsX = [];
  var starsY = [];

  var periodicBoundaries = false;

function setup() {	
  createCanvas(1000, 1000); 

// for (var i = 0; i < 10; i++){
//     newPlanet = new Planet(random(0,width),random(0,height),10);
//     allPlanets.push(newPlanet);
// }

  // Stars:
  for (var i = 0; i < numStars ; i++){
    starsX[i] = random(width);
    starsY[i] = random(height);
  }
// testP = new Planet(400,800,100);
// testP2 = new Planet(500,300,100);
	// for(var i = 0; i < numBoids; i++){
	// 	boids[i] = new boid(random(width),random(height),random(2*PI));
	// }
// allPlanets.push(testP);
// allPlanets.push(testP2);

}

function draw() {
  background(0);


  // Stars:
  for (var i = 0; i < numStars ; i++){
    stroke(150);
    point(starsX[i],starsY[i]);
  }
  fill(150);
  // testP.draw();
  // testP2.draw();
  // testP.update(timescale);
  // testP2.update(timescale);

  // testP.calcAcc(allPlanets);
  // testP2.calcAcc(allPlanets);
var newPlanet;
var newPlanets = false;
// var ForRemoval = [];
  for (var i = allPlanets.length -1; i >= 0;i--){
    for (var j = allPlanets.length-1; j >= 0;j--){ // For all pairs
        if (i != j){ //Unless it the same planet
            var deltaPos = p5.Vector.sub(allPlanets[i].pos.copy(),allPlanets[j].pos.copy());
            // console.log(deltaPos.mag()<= (allPlanets[i].m+allPlanets[j].m)/2);

            // If the two planets overlap
            if (deltaPos.mag()<= (Math.sqrt(allPlanets[i].m)+Math.sqrt(allPlanets[j].m))/2)  {


                if (allPlanets[i].m > allPlanets[j].m){
                    var newPos = allPlanets[i].pos.copy();
                } else if (allPlanets[i].m < allPlanets[j].m){
                    var newPos = allPlanets[j].pos.copy();
                } else {
                    var newPos = p5.Vector.add(allPlanets[i].pos.copy(),allPlanets[j].pos.copy());
                    newPos.mult(0.5);
                }
                var totMass = allPlanets[i].m+allPlanets[j].m;
                // var PlanetOneMomentum = p5.Vector.mult(allPlanets[i].vel.copy(),allPlanets[i].m);
                // var PlanetTwoMomentum = p5.Vector.mult(allPlanets[j].vel.copy(),allPlanets[j].m);
                // var newVel = p5.Vector.add(PlanetTwoMomentum,PlanetTwoMomentum);

                xVel = (allPlanets[i].m*allPlanets[i].vel.x+allPlanets[j].m*allPlanets[j].vel.x)/totMass;
                yVel = (allPlanets[i].m*allPlanets[i].vel.y+allPlanets[j].m*allPlanets[j].vel.y)/totMass;
                var newVel = createVector(xVel,yVel);
                // console.log(newVel);
                // newVel.mult(0.5);
                // newVel.mult(1/totMass);
                // console.log(allPlanets[i].m+allPlanets[j].m);
                // newPlanet = new Planet(newPos.x,newPos.y,(allPlanets[i].m+allPlanets[j].m)/1.5);
                newPlanet = new Planet(newPos.x,newPos.y,totMass);
                newPlanet.vel = newVel;

                allPlanets[i].shouldBeDeleted = true;
                newPlanets = true;


                // ForRemoval = [i,j];
                // ForRemoval.push(i);
                // // ForRemoval.push(j);
                // ForRemoval.sort();
                // console.log(ForRemoval);


                // allPlanets.splice(j,1);
                // allPlanets.splice(i,1);


                // console.log(newPlanet);
            }
        }
    }
  }


for (var i = allPlanets.length -1; i >= 0;i--){ 
    if (allPlanets[i].shouldBeDeleted){
        allPlanets.splice(i,1);
    }
}

if (newPlanets){
    allPlanets.push(newPlanet);
}

// if (ForRemoval.length > 0){
// console.log(ForRemoval);
// for (var k = ForRemoval.length - 1; k >= 0; k--) {
//     console.log(k);
//     allPlanets.splice(ForRemoval[k],1);
// }
// allPlanets.push(newPlanet);
// }

  for (var i = allPlanets.length -1; i >= 0;i--){
    allPlanets[i].draw();
    allPlanets[i].update(timescale);
    allPlanets[i].calcAcc(allPlanets);
  }
 //  testBoid.findNearby(boids);
 //  testBoid.display();
 //  // testBoid.angle += random(-0.1,0.1);
 //  testBoid.move();


	// for(var i = 0; i < numBoids; i++){
	// 	boids[i].findNearby(boids);
	// 	boids[i].display();
	// 	boids[i].angle += random(-0.1,0.1); // Random angle changing
	// 	boids[i].move();
	// }
    if (mouseIsPressed){
        counter++;
        mouseDisplayerSize = 40*(5*Math.sin(counter/15)+5);
        // console.log(frameCount/20);
        ellipse(mouseClickX,mouseClickY,sqrt(mouseDisplayerSize));
        velVector = createVector(mouseClickX-mouseX,mouseClickY-mouseY);
        velVector.mult(-1);
        // line(mouseX,mouseY,mouseClickX,mouseClickY);
        line(mouseClickX,mouseClickY,mouseClickX-velVector.x,mouseClickY-velVector.y);  

    }

}

function mousePressed(){
    mouseClickX = mouseX;
    mouseClickY = mouseY;
    counter = 0;

    // stroke(250);
    // fill(0);
    // rect(mouseX,mouseY,40,40);
    // line(mouseX,mouseY,mouseClickX,mouseClickY);
    
}


function mouseReleased(){
    var newPlanet = new Planet(mouseClickX, mouseClickY, mouseDisplayerSize);
    newPlanet.vel = velVector.mult(-0.1);
    allPlanets.push(newPlanet);
}

function Planet(_x,_y,_m){
	this.pos = createVector(_x,_y);
    this.vel = createVector(0,0);
    this.vel = createVector(0,0);
    // this.vel = createVector(random(-10,10),0);
	this.acc = createVector(0,0);
	
	this.m   = _m;

    this.shouldBeDeleted = false;
}

Planet.prototype.draw = function(){

    fill(150);
    if (this.shouldBeDeleted){
        fill(255);
    }
	stroke(255);
	ellipse(this.pos.x,this.pos.y,Math.sqrt(this.m));
}

Planet.prototype.update = function(t){
	this.pos.add(p5.Vector.mult(this.vel.copy(),t));
	this.vel.add(p5.Vector.mult(this.acc.copy(),t));
	// this.vel.limit(maxVel); // Speed limit

    if (periodicBoundaries){
    // Periodic boundaries (Probably a bad idea)
        this.pos.x = (this.pos.x+width) % width;
        this.pos.y = (this.pos.y+height) % height;
    }
}

Planet.prototype.calcAcc = function(planets){

	this.acc = createVector(0,0);
	for (var i = planets.length -1; i >= 0;i--){
		var deltaPos = p5.Vector.sub(this.pos.copy(),planets[i].pos.copy());

		var mag = deltaPos.mag();
		var dir = deltaPos.normalize();

		// console.log(mag); 

		var force = p5.Vector.mult(dir,- (gravConst*this.m*planets[i].m)/(mag^2));
		// console.log(force.x);
        var newAcc = p5.Vector.mult(force.copy(),1/this.m);

		this.acc.add(newAcc);


		// console.log(deltaPos.normalize());

		// this.acc = this.acc ;
	}
}

// function boid(x,y,angle){
// 	this.pos = createVector(x,y);
// 	this.vel = createVector(0,0);
// 	this.acc = createVector(0,0);
// 	// this.x = x;
// 	// this.y = y;
// 	this.angle = angle;
// 	this.size = 5;
// 	this.closeRadius = 75;
// 	this.sightRadius = 250;
// 	this.speed = 1;
// 	this.nearbyBoids = [];
// 	this.closeBoids = [];
// 	// this.nearbyBoidsVectors = [];
// 	this.debug = false;
// 	this.color = color(0,0,0,0);
// 	this.weights = [0.01,0.01,0.01];
// 	this.orientation = createVector(sin(-this.angle),cos(-this.angle));
// 	// this.desiredOrientation =  createVector(sin(-this.angle),cos(-this.angle));
// 	this.separationVec = createVector(0,0);
// 	this.alignmentVec = createVector(0,0);
// 	this.cohesionVec = createVector(0,0);

// 	this.display = function(){
	
// 		push();
// 		translate(this.pos.x,this.pos.y);

// 		if (this.debug){
// 		stroke(0,0,255);
// 		noFill();
// 		ellipse(0,0,this.sightRadius);

// 		stroke(255,0,0);
// 		ellipse(0,0,this.closeRadius);

// 		stroke(0,255,0);
// 		line(0,0,40*this.orientation.x,40*this.orientation.y);

		
// 		// this.angle = this.orientation.heading();
		
// 		}
		
// 		// print(this.orientation.mag());
// 		// this.angle = p5.Vector.angleBetween(this.orientation,createVector(0,0));
// 		//rotate(this.angle); //Rotate before drawing the triangle
// 		rotate(this.orientation.heading()-0.5*PI);

// 		fill(this.color);
// 		stroke(255);
// 		triangle( 0				, this.size
// 				, 0.5*this.size	, -0.5*this.size
// 				,-0.5*this.size , -0.5*this.size)

// 		pop();
// 		// triangle(this.x 
// 		// 		, this.y + this.size 
// 		// 		, this.x + 0.5*this.size
// 		// 		, this.y - 0.5*this.size
// 		// 		, this.x - 0.5*this.size
// 		// 		, this.y - 0.5*this.size)


// 	}

// 	this.move = function(){
// 		// this.desiredOrientation = createVector(0,0);
// 		// this.orientation = createVector(0,0);
// 		this.separationVec = createVector(0,0);
// 		this.cohesionVec = createVector(0,0);
// 		this.alignmentVec = createVector(0,0);

// 		for (var i = this.nearbyBoids.length - 1; i >= 0; i--) {
// 			var vect = this.nearbyBoids[i].pos.copy();
// 			vect.sub(this.pos);
// 			// this.desiredOrientation.add(vect);
// 			this.cohesionVec.add(this.nearbyBoids[i].pos);
// 			this.alignmentVec.add(this.nearbyBoids[i].orientation);


// 			if (this.debug){
// 				 // nearbyBoidsVectors.push(vect.copy());
// 				push();
// 					translate(this.pos.x,this.pos.y);
// 					// rotate(this.angle);
// 					stroke(255,0,0);
// 					strokeWeight(2);
// 					line(0,0,vect.x,vect.y);
// 				pop();

// 			}
// 		}

// 		for (var i = this.closeBoids.length - 1; i >= 0; i--) {
// 			var vect = this.closeBoids[i].pos.copy();
// 			vect.sub(this.pos);
// 			this.separationVec.add(this.closeBoids[i].pos);
// 		}
// 		// this.desiredOrientation.normalize();
// 		// this.desiredOrientation.mult(50);

// 		this.separationVec.mult(1/this.closeBoids.length);
// 		this.alignmentVec.mult(1/this.nearbyBoids.length);
// 		this.cohesionVec.mult(1/this.nearbyBoids.length);

// 		this.separationVec.sub(this.pos);
// 		this.cohesionVec.sub(this.pos);

// 		this.separationVec.mult(-1);

// 		if (this.debug){
// 			// print(this.alignmentVec);
// 			// print(this.cohesionVec);
// 			push();
// 				translate(this.pos.x,this.pos.y);
// 	// line(0,0,this.desiredOrientation.x,this.desiredOrientation.y);
		
// 				strokeWeight(2);
// 				stroke(155,0,155);
// 				line(0,0,this.separationVec.x,this.separationVec.y);
// 				stroke(0,155,155);
// 				line(0,0,50*this.alignmentVec.x,50*this.alignmentVec.y);
// 				stroke(155,155,0);
// 				line(0,0,this.cohesionVec.x,this.cohesionVec.y);

// 			pop();
// 		}

// 		// this.orientation = createVector(sin(-this.angle),cos(-this.angle));


// 	if (this.debug){
// 		if (this.nearbyBoids.length != 0){
// 		}
// 	}


// 		 // this.pos = this.cohesionVec.copy();
// 		 if (this.nearbyBoids.length != 0){
// 			// this.orientation.add(this.separationVec.mult(this.weights[0]));
// 			// this.orientation.add(this.alignmentVec.mult(this.weights[1])); 
// 			// this.orientation.add(this.cohesionVec.mult(this.weights[2]));
// 		 // this.pos.x += 0.01*this.cohesionVec.x;
// 		 // this.pos.y += 0.01*this.cohesionVec.y;
// 		}
// 		// this.orientation.add(this.desiredOrientation);

// 		this.orientation.normalize();
// 		this.pos.x += this.speed*this.orientation.x;
// 		this.pos.y += this.speed*this.orientation.y;


// 		this.periodicBoundaries();
// 	}

// 	this.periodicBoundaries = function(){
// 		this.pos.x = mod(this.pos.x,width);
// 		this.pos.y = mod(this.pos.y,height);
// 	}

// 	this.findNearby = function(boidList){
// 		this.nearbyBoids = [];
// 		this.closeBoids = [];
// 		for (var i = boidList.length - 1; i >= 0; i--) {
// 			var dist = this.pos.copy();
			
// 			dist.sub(boidList[i].pos);

// 			if (dist.mag() <= this.sightRadius /2){ 
// 				this.nearbyBoids.push(boidList [i]);


// 				if (dist.mag() <= this.closeRadius /2){
// 					this.closeBoids.push(boidList[i]);
				

// 				// if (this.debug){
// 				// 	boidList[i].color = color(255,0,0);
// 				// 	// boidList[i].debug = true; 	
// 				// 	}
// 				// } else {
// 				// 	if(this.debug){
// 				// 		boidList[i].color = color(0,0,0,0);
// 				// 	}
// 				}
// 			}
// 		}
// 	}
// }

// function mod(n, m) {
//         return ((n % m) + m) % m;
// }