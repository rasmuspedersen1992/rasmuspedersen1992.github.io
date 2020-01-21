/*Updated version of the SIR simulation
Simple agent-based simulation of the SIR model.
Version 0.9 - "Beta": 
Main features work, almost looks nice
Code needs a cleanup
More features needs to be added
Pre-saved settings as in old "epidemi"-simulation
*/ 

// Initialize a bunch of stuff
var allPars = []; 
var numPar;
var density = 4; // Density of particles
var totArea;


var fieldWidth = 700;
var fieldHeight = 500;

var dt = 0.01; // Timescale

// Counters for current number of infected and exposed
var numInf = 0;
var numExp = 0;

// // Table of UI texts
// var UItexts = new p5.Table([1]);
/*UItexts.addColumn('id');
UItexts.addColumn('english');
UItexts.addColumn('danish');
let newRow = UItexts.addRow();
newRow.setString('id', table.getRowCount() - 1);
newRow.setString('english','Restart');
console.log(UItexts);
*/
// Hardcoded texts, for offline use
var TRes;
var TCon;
var TDen;
var TTIn;
var TTEx;
var TVac;
var TReb;
var TRebBot;
var TRebQue;
var TAlways;

var language = 'Danish'
if (language == 'Danish'){
	// Danish
	TRes = 'Genstart';
	TCon = 'Indstillinger';
	TDen = 'Antal';
	TTIn = 'Infektionstid';
	TTEx = 'Latensperiode';
	TVac = 'Vaccinationsrate';
	TReb = 'Genfødselsrate';
	TRebBot = 'Hvert ';
	TRebQue = 'Genfødsel?';
	TAlways = 'Auto-start sygdom?';
} else {	
	// English
	TRes = 'Restart';
	TCon = 'Controls';
	TDen = 'Density';
	TTIn = 'Time Infected';
	TTEx = 'Time Exposed';
	TVac = 'Vaccinationsrate';
	TReb = 'Rebirth rate';
	TRebBot = 'Every ';
	TRebQue = 'Rebirth?';
	TAlways = 'Auto-start disease?';
}

//p5.disableFriendlyErrors = true;

// UI stuff
var UIparent;
var UItoggle;
var contCheckBox;
var UIrestart;
var UIdensity;
var UImodelType;
var UItimeInf;
var UItimeInfText;
var UItimeExp;
var UItimeExpText;
var UIrebirth;
var UIvaccine;
var UIvaccRateText;
var UIrebirthText;
var UIrebirthButton;

var maxSpeed = 80; // Max speed (in any direction)
var addSpeed = 20; // Maximal speed added per frame

var particleDiameter = 10;
var sqDia; // Squared diameter for faster calculations, calculated in setup
var TimeInfected = 5; // Counted in seconds
var TimeExposed = 0; // Counted in seconds
var rebirthRate = 0; // Rebirth rate
var rebirthTimer = 0;
var VaccRate = 0; // Vaccination rate
var modelType = 'SIR'; 
var contDisease = false; // Whether disease should restart when no there are not more infected.
var rebirthBool = false; // Whether or not rebirthing should happen
var UIon = false;

// Define colors
var colorS;
var colorI;
var colorE;
var colorR;
		
var wMargin;
var hMargin;
		
// Enum for the disease stage
const disStage = {
  S: 'susceptible',
  E: 'exposed',
  I: 'infected',
  R: 'recovered'
}

var framesBetweenSpeedUpdate = 10;

var cnv;

function centerCanvas(){
	var x = (windowWidth - fieldWidth)/2;
	var y = 0;
	//var y = (windowHeight - fieldHeight)/2;
	cnv.position(x,y);
}

function setup() {
  //cnv = createCanvas(windowWidth-20, 600); // Dynamic size
  //cnv = createCanvas(800, 600,WEBGL); 
  //cnv = createCanvas(800, 600); 
  //cnv = createCanvas(800, 600); 
  
	var divWidth = document.getElementById('sketch-holder').offsetWidth;
	/*if (divWidth > 1.75*fieldWidth){
		divWidth = 1.75*fieldWidth;
	}*/
	var divHeight;
	if (divWidth < fieldHeight){
		divHeight = fieldHeight;
	} else {
		divHeight = fieldHeight +200;
	}
		

	cnv = createCanvas(divWidth, divHeight);
	cnv.parent('sketch-holder');
	cnv.style('display','block');

		
	wMargin = (width-fieldWidth)/2;
	hMargin = (height-fieldHeight)/2;
		
  
  //cnv = createCanvas(800, 600); // Static size
  //centerCanvas();
  //cnv.parent('sketch-holder');
  
  //frameRate(20);
  //frameRate(); 
  
  
  // Load file with text for UI
  //UItexts = loadTable('./textfile.csv');
  /*console.log(UItexts);
  console.log(UItexts.getColumn('english'));*/
  
  
  // Define colors
  colorS = color(0,255,0);
  colorI = color(255, 0, 0);
  colorE = color(255, 255, 255);
  colorR = color(0, 255, 255);
  
  
  // Calculate the square of the particle diametre, for faster collisionchecking
  sqDia = pow(particleDiameter,2);
  
  
  // Setup controls. All sliders use the default values from top of script
  UIrestart = createButton(TRes); 
  UIrestart.mousePressed(startupSim);
  UIrestart.style("font-size : 24px; font-weight: bold");
  UIrestart.parent('sketch-holder');
  UIrestart.position(10,10);
  UIrestart.class('uiButton');
  
  
  UItoggle =  createCheckbox(TCon,UIon)
  UItoggle.changed(toggleUI);
  //UItoggle.style("font-size : 20px; font-weight: bold");
  UItoggle.class('uiText');
  UItoggle.parent('sketch-holder');
  UItoggle.position(10,50);
  //UItoggle.position(width-50,height-20);
  
  UIparent = createDiv();
  UIparent.parent('sketch-holder');
  UIparent.position(10,80);
  
  var UIdensityTitle = createDiv(TDen);
  UIdensityTitle.parent(UIparent);
  UIdensity = createSlider(1, 8,density);
  //UIdensity = createSlider(1, 10,density);
  UIdensity.changed(updateVariables);
  //UIdensity.position(10, 10);
  //UIdensity.style('width', '80px');
  //UIdensityTitle.style("font-size : 20px; text-shadow: -1px 0px black, 0 1px black, 1px 0 black, 0 -1px black; color: white");
  UIdensityTitle.class('uiText');
  //UIdensityTitle.style("font-family: Arial;-webkit-text-stroke: 1px black; font-size : 30px; color: white ; font-weight: bold");
  UIdensity.parent(UIparent);
  
  var UItimeInfTitle = createDiv(TTIn);
  UItimeInfTitle.parent(UIparent);
  UItimeInfTitle.class('uiText');
  UItimeInf = createSlider(1, 10,TimeInfected);
  UItimeInf.changed(updateVariables);
  UItimeInf.parent(UIparent);
  UItimeInfText = createDiv(TimeInfected+' s');
  UItimeInfText.parent(UIparent);
  UItimeInfText.class('uiText');
  
  var UItimeExpTitle = createDiv(TTEx);
  UItimeExpTitle.parent(UIparent);
  UItimeExpTitle.class('uiText');
  UItimeExp = createSlider(0, 10,TimeExposed);
  UItimeExp.changed(updateVariables);
  UItimeExp.parent(UIparent);
  UItimeExpText = createDiv(TimeExposed+' s');
  UItimeExpText.parent(UIparent);
  UItimeExpText.class('uiText');
  
  var UIvaccineTitle = createDiv(TVac);
  UIvaccineTitle.parent(UIparent);
  UIvaccineTitle.class('uiText');
  UIvaccine = createSlider(0,100,VaccRate);
  UIvaccine.changed(updateVariables);
  UIvaccine.parent(UIparent);
  UIvaccRateText = createDiv(VaccRate+' %');
  UIvaccRateText.parent(UIparent);
  UIvaccRateText.class('uiText');
  
  var UIrebirthTitle = createDiv(TReb);
  UIrebirthTitle.parent(UIparent);
  UIrebirthTitle.class('uiText');
  UIrebirth = createSlider(0,2,rebirthRate,0.01);
  //UIrebirth = createSlider(0,100,rebirthRate);
  UIrebirth.changed(updateVariables);
  UIrebirth.parent(UIparent);
  UIrebirthText = createDiv(rebirthRate+' s');
  UIrebirthText.parent(UIparent);
  UIrebirthText.class('uiText');
  UIrebirthButton =  createCheckbox(TRebQue,rebirthBool)
  UIrebirthButton.changed(rebirthCheckedEvent);
  UIrebirthButton.parent(UIparent);
  UIrebirthButton.class('uiText');
  
  contCheckBox =  createCheckbox(TAlways,contDisease)
  contCheckBox.changed(myCheckedEvent);
  contCheckBox.parent(UIparent);
  contCheckBox.class('uiText');
  
  
  var UImodelTitle = createDiv('Model:');
  UImodelTitle.parent(UIparent);
  UImodelTitle.class('uiText');
  UImodelTitle.style("font-size: 24px;");
  UImodelType = createRadio();
  UImodelType.option('SIR');
  UImodelType.option('SEIR');
  UImodelType.option('SIS');
  UImodelType.value(modelType);
  //UImodelType.style("width: 70px"); // 'width', '60px'
  UImodelType.changed(updateVariables);
  UImodelType.parent(UIparent);
  //UImodelType.class('uiText');
  UImodelType.class('uiRadio');
  
  
  
  
  // Make sure the default variables are read, in case any are undefined
  updateVariables();
  
  // Calculated the area of the canvas
  totArea = fieldWidth*fieldHeight;
  
  // Initialize the simulation
  startupSim()
  
  updateUI()
  
  
}

// Function for restarting simulation. Run at startup, and when simulation is restarted
function startupSim(){
	// Make sure the array of particles is empty
	allPars = []; 
	// And that the counters are zero
	numInf = 0;
	numExp = 0;
  
	// Scale the density from the slider, and calculate the number of particles
	density = UIdensity.value()/2000;
	numPar = round(density*totArea);

	// Initialize particles
	var newPar;
	for (var k = 0; k < numPar; k++) {
		
		// Try to vaccinate 
		if (random(1) < (VaccRate/100)){
			newPar = new Particle(disStage.R);
		} else { 
			newPar = new Particle(disStage.S);
		}
    
		// Add to the array
		allPars.push(newPar);
	}  
}

function mousePressed() {
  var curDist;
  var xDist;
  var yDist;
  
  var mouseXwithMargin = mouseX - wMargin;
  var mouseYwithMargin = mouseY - hMargin;

  // Go through all particles
	for (var j = 0; j < allPars.length; j++) {
		//xDist = mouseX - allPars[j].x;
		//yDist = mouseY - allPars[j].y;
		xDist = mouseXwithMargin - allPars[j].x;
		yDist = mouseYwithMargin - allPars[j].y;
		curDist = pow(xDist, 2) + pow(yDist, 2);
		
		// If distance^2 between mouse and particles is less than diameter^2, infect.
		if (curDist < sqDia) {
			allPars[j].infect(millis());
		}
    }
 // return false;
}

// Continuous disease checkbox function
function toggleUI(){
  if (this.checked()){
    UIon = true;
  } else
  {
    UIon = false;
  }
  // Set the UI
  updateUI();
}

function updateUI(){
	if (UIon){
		UIparent.show(); 
	} else {
		UIparent.hide();
	}
}
	
// Continuous disease checkbox function
function myCheckedEvent(){
  if (this.checked()){
    contDisease = true;
  } else
  {
    contDisease = false;
  }
}

// Rebirth checkbox function
function rebirthCheckedEvent(){
  if (this.checked()){
    rebirthBool = true;
  } else
  {
    rebirthBool = false;
  }
}

// Function for updating values controled by UI
function updateVariables(){
  
  // Update from UI stuff
  modelType = UImodelType.value();
  TimeInfected = UItimeInf.value();
  UItimeInfText.elt.innerHTML = TimeInfected+' s';
  TimeExposed = UItimeExp.value();
  UItimeExpText.elt.innerHTML = TimeExposed+' s';
  rebirthRate = UIrebirth.value();
  UIrebirthText.elt.innerHTML = TRebBot+rebirthRate+" s";
  VaccRate = UIvaccine.value();
  UIvaccRateText.elt.innerHTML = VaccRate+" %";
}

// Draw stuff
function draw() {
  //background(0);
  //background(100,155,100);
  //background(100,100,155);
  //background(255,100,255);
  background(100,80,40); 
  //translate(margins,margins);
  
  // Center field in canvas
  translate(wMargin,hMargin); // For non-WEBGL
  //translate(-fieldWidth/2,-fieldHeight/2); // For WEBGL
  
  //scale(0.5);
  
  

  var curDist;
  var xDist;
  var yDist;
  var xAdd;
  var yAdd;
 // Apparently, not initializing parameters is faster in javascript(?!)
  
  
  // Try rebirthing a particle
    /*if (random(1) < (rebirthRate/10)){
		// Remove one
		allPars.splice(int(random(numPar)),1);
	  
		// Try to vaccinate 
		if (random(1) < (VaccRate/100)){
			newPar = new Particle(disStage.R);
		} else { 
			newPar = new Particle(disStage.S);
		}

		// Add to the array of all
		allPars.push(newPar);
    }
	*/

	// If rebirthing is turned on
	if (rebirthBool) {
		// Rebirth once every "rebirthRate"
		if ((millis()-rebirthTimer ) > rebirthRate*1000){
			
			// Remove one
			allPars.splice(int(random(numPar)),1);
		  
			// Try to vaccinate 
			if (random(1) < (VaccRate/100)){
				newPar = new Particle(disStage.R);
			} else { 
				newPar = new Particle(disStage.S);
			}

			// Add to the array of all
			allPars.push(newPar);
			
			// Reset timer
			rebirthTimer = millis();
			
		}
	}
	
	// Get the current time to pass through to particles
	var curMillis = millis();
	// Go through all
	for (var k = 0; k < numPar; k++) {
	  
		allPars[k].move();
		allPars[k].updateDisease(curMillis);
		
		// Only change speed every once in a while. Makes it less eratic
		if ((frameCount % framesBetweenSpeedUpdate ) == 0) {
			allPars[k].changeSpeed();
		}
		
		var curX = allPars[k].x;
		var curY = allPars[k].y;
		
		for (var j = 0; j < numPar; j++) {
		//for (var j = k+1; j < numPar; j++) { // Faster, but can lead to overlaps
		
			if (j != k){
		/*
			  var xDist = curX - allPars[j].x;
			  var yDist = curY - allPars[j].y;
			  //var curDist = pow(xDist, 2) + pow(yDist, 2);
			  var curDist = (xDist*xDist) + (yDist*yDist);*/
			  xDist = curX - allPars[j].x;
			  yDist = curY - allPars[j].y;
			  curDist = (xDist*xDist) + (yDist*yDist);
			  

			 while (curDist < sqDia) {

				allPars[k].touch(allPars[j],curMillis);
				 
				var xAdd =0.75* xDist/particleDiameter;
				var yAdd =0.75* yDist/particleDiameter;
				//var xAdd =0.5* xDist/particleDiameter;
				//var yAdd =0.5* yDist/particleDiameter;
			   
				allPars[k].x = allPars[k].x + xAdd;
				allPars[j].x = allPars[j].x - xAdd;
			   
				allPars[k].y = allPars[k].y + yAdd;
				allPars[j].y = allPars[j].y - yAdd;
				
				/*
				// Try also adding some speed
				allPars[k].vX = allPars[k].vX +10*xAdd;
				allPars[k].vY = allPars[k].vY +10*yAdd;
				allPars[j].vX = allPars[j].vX -10*xAdd;
				allPars[j].vY = allPars[j].vY -10*yAdd;
				*/
				
				xDist = allPars[k].x - allPars[j].x;
				yDist = allPars[k].y - allPars[j].y;
				curDist = (xDist*xDist) + (yDist*yDist);
				//curDist = pow(xDist, 2) + pow(yDist, 2);
				
				}
			}
		}
		allPars[k].display();
	}
  
  
  // Infect one if no-one is sick
  if (contDisease){
    if ((numInf+numExp) == 0){
      allPars[int(random(numPar))].infect(millis());
    }
  }
  
  
  
  // Debugging for performance
	let fps = frameRate();  
	fill(255);
	stroke(0);
	//textFont('Arial');
	//text("FPS: " + fps.toFixed(2), 10, height - 10);
	text("FPS: " + fps.toFixed(2), 10, 10);
	
	
}

class Particle {
	
  getColor(s){
	
	switch (s) {
      case 'susceptible':
		this.color = colorS;
        break;
      case 'infected':
		this.color = colorI;
        break;
      case 'exposed':
		this.color = colorE;
        break;
      case 'recovered':
		this.color = colorR;
        break;
    }	  
  }
  
  constructor(stage) {
    this.Stage = stage;
    this.x = random(fieldWidth);
    this.y = random(fieldHeight);
    this.diameter = particleDiameter;
    this.vX = random(-5, 5);
    this.vY = random(-5, 5);
    this.vX = maxSpeed*random(-1,1);
    this.vY = maxSpeed*random(-1,1);
	//this.color = this.getColor(disStage.S);
	this.color = color(0,0,0);
	
	
	// Update the color
	this.getColor(this.Stage);
    
  }
  
  updateDisease(curMillis){
	  
	// Update   
	if (this.Stage == disStage.E){
		if ((curMillis - this.exposedTime) > TimeExposed*1000){
		//if (this.exposedTime > TimeExposed){
			this.Stage = disStage.I;
			//this.infectTime = 0;
			this.infectTime = curMillis;
			
			// Update the color
			this.getColor(this.Stage);
			
          
            numExp--;
            numInf++;
		//} else {
		    //this.exposedTime = this.exposedTime+1;
			//this.exposedTime = this.exposedTime+dt;
		}
	}
	  
    // Check disease stage
    if (this.Stage == disStage.I){
		if ((curMillis - this.infectTime) > TimeInfected*1000){
    //  if (this.infectTime > TimeInfected){
        numInf--;
	    if(modelType == 'SIS'){
			this.Stage = disStage.S;
			// Update the color
			this.getColor(this.Stage);
        } else{
			this.Stage = disStage.R;
			// Update the color
			this.getColor(this.Stage);
        }
      //} else {
        //this.infectTime = this.infectTime+1;
        //this.infectTime = this.infectTime+dt;
      }
    }
  }
  
  changeSpeed() {
	  
    
    // Random addition to velocity
    //this.vX = this.vX + random(-addSpeed, addSpeed);
    //this.vY = this.vY + random(-addSpeed, addSpeed);
	
	// Instead, add a vector of "addSpeed" in a random direction
	var randAng = random(0,2*PI);
	this.vX = this.vX + cos(randAng)*addSpeed;
	this.vY = this.vY + sin(randAng)*addSpeed;
	
    //this.vX = this.vX + 100 * random(-addSpeed, addSpeed);
    //this.vY = this.vY + 100 * random(-addSpeed, addSpeed);
    
    /*
    // Bouncing boundaries
    if (this.x >= fieldWidth){
      this.vX = -this.vX;
      this.x = fieldWidth;
    }
    if (this.x <= 0){
      this.vX = -this.vX;
      this.x = 0;
    }
    if (this.y >= fieldHeight){
      this.vY = -this.vY;
      this.y = fieldHeight;
    }
    if (this.y <= 0){
      this.vY = -this.vY;
      this.y = 0;
    }
    */
 

    // Scale down speed if too high
    if (this.vX > maxSpeed) {
      this.vX = maxSpeed;
    }
    if (this.vX < -maxSpeed) {
      this.vX = -maxSpeed;
    }
    if (this.vY > maxSpeed) {
      this.vY = maxSpeed;
    }
    if (this.vY < -maxSpeed) {
      this.vY = -maxSpeed;
    }

  }

  move() {
    
    
    // Periodic boundaries
    if (this.x > fieldWidth) {
      this.x = this.x - fieldWidth;
    }
    if (this.x < 0) {
      this.x = this.x + fieldWidth;
    }
    if (this.y > fieldHeight) {
      this.y = this.y - fieldHeight;
    }
    if (this.y < 0) {
      this.y = this.y + fieldHeight;
    }
    
    // Euler move
    this.x = this.x + this.vX * dt;
    this.y = this.y + this.vY * dt;

  }

  touch(p,curMillis) {
    // One S and one I -> both I
    if (this.Stage == disStage.I && p.Stage == disStage.S) {
      //p.Stage = disStage.I;
      p.infect(curMillis);
    }
    if (this.Stage == disStage.S && p.Stage == disStage.I) {
      //this.Stage = disStage.I;
      this.infect(curMillis);
    }

  }
  
  infect(curMillis){
    
    numInf++;
	  if (modelType == 'SIR') {
			//this.infectTime = 0;
			//this.infectTime = millis();
			this.infectTime = curMillis;
			this.Stage = disStage.I;
	  } else if(modelType == 'SIS'){
			//this.infectTime = 0;
			//this.infectTime = millis();
			this.infectTime = curMillis;
			this.Stage = disStage.I;
	  } else if(modelType == 'SEIR'){
			//this.exposedTime = 0;
			//this.exposedTime = millis();
			this.exposedTime = curMillis;
			this.Stage = disStage.E;
	  }
	  
	// Update the color
	this.getColor(this.Stage);
  }
  

  display() {
    //stroke(255);
	fill(this.color);
    ellipse(this.x, this.y, this.diameter);
  }

}

