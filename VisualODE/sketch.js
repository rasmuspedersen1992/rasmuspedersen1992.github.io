/* Sketch for visualizing simple ODE systems

	Features currently implemented:
		- Flow illustrating circles
		- Directional field vectors (Partially)
		- Use p5 built-in vectors instead
		- Colorschemes (NigthMode and RUC, and function setAllColors('name'))
		- Make arrowhead of vectors (Use "triangle" function) 
		- Draw nullclines 
		- Input interpretation:
			- Linear
			- Single variable, higher order
			- Constant
		- Make directional field toggle-able
		- Make nullclines toggle-able
		- Make checkboxes
		- Draw equilibria (Use nullclines implementation)
	
	TODO:
		- Calculate/find stability of equilibria (Could be done in a rudamentary numerical way)
		- Draw stability of equilibria
		- Input interpretation:
			- Crossterms (i.e. both x and y)
*/

let cnv;

let fieldWidth = 300;
let fieldHeight = 300;
let maxWidth = 800;

let scalingFactor = 0.01;

// String for differential equations
let xString = "-3 * x  + 5 * y + -1";
let yString = "1 * x ^2 + -1* y +-1";
let xStringInter = '';
let yStringInter = '';
let curXfunc = [0,0,0,0,0];
let curYfunc = [0,0,0,0,0];
//let curXfuncStr = "1*x^2";
//let curYfuncStr = "1*y";

// Directional field
let dirFieldVectors = [];
let curDirFieldRes = 20; // Resolution of directional vectorfield
let showDirField = true;
let minVecLen = 0.1; // Smallest allowed vector: 1 pixel

// Flow followers
let allFlows = [];
let curTraceLength = 10;
let curFlowLifetime = 5;
let spawnFlowFollowersOnMouseClick = true;
let flowUseAllColors = true;

// Nullclines
let xSignChange = [];
let ySignChange = [];
let nullClinesResolution = 50;
let showNullclines = false; 

// Equilibria
let equis =[];
let equiSize = 10;
let showEquis = true;


// Limits
let minX = -100;
let maxX = 100;
let minY = -100;
let maxY = 100;

let mouseCurDown = false;

let backGroundColor = 0; // Black 
let vectorColor = 100; // Grey
let axesColor = 100; // Grey
let xNullclineColor = [0,100,0];
let yNullclineColor = [100,0,0];
let equiColor = [0,0,150];
let allowedColors = []; // Array of colors used for flow-followers when limiting choices


//let colorScheme = 'RUC';
let colorScheme = 'NightMode';



function centerCanvas(){
	let x = (windowWidth - fieldWidth)/2;
	let y = 0;
	//let y = (windowHeight - fieldHeight)/2;
	cnv.position(x,y);
}

function setAllColors(colorName){
	
	switch (colorName) {
		case ('RUC'):
			backGroundColor = [57,183,140]; // Correct light green RUC  
			vectorColor = 0; // Black
			axesColor = 100; // Grey
			xNullclineColor = [60,180,245];
			yNullclineColor = [255,160,175];
			equiColor = [255,250,130];
			// Limit the colors of flowfollowers
			flowUseAllColors = false;
			allowedColors = [];
			allowedColors.push([0,0,120]);
			allowedColors.push([255,93,93]);
			allowedColors.push([255,190,50]);
			allowedColors.push([0,80,70]);
			break;
		case ('NightMode'):
			backGroundColor = 0; // Black 
			vectorColor = 100; // Grey
			axesColor = 100; // Grey
			xNullclineColor = [0,100,0];
			yNullclineColor = [100,0,0];
			equiColor = [0,0,200];
			break;
		default:
			backGroundColor = 255; // Black 
			vectorColor = 100; // Grey
			axesColor = 100; // Grey	
			xNullclineColor = [0,255,0];
			yNullclineColor = [255,0,0];	
			equiColor = [0,0,255];
	}		
}

function setup() {
  //cnv = createCanvas(windowWidth-20, 600); // Dynamic size
  //cnv = createCanvas(800, 600,WEBGL); 
  //cnv = createCanvas(800, 600); 
  //cnv = createCanvas(800, 600); 
	setAllColors(colorScheme)
	let divWidth = document.getElementById('sketch-holder').offsetWidth;
	if (divWidth > maxWidth){
		divWidth = maxWidth;
	}
	let divHeight = divWidth;
	
		

	cnv = createCanvas(divWidth, divHeight);
	cnv.parent('sketch-holder');
	cnv.style('display','block');

	// Set the width to the full width
	fieldWidth = width*0.5;
	fieldHeight = height*0.5;
		
	wMargin = (width-fieldWidth)/2;
	hMargin = (height-fieldHeight)/2;
	
	// Test flow
	//allFlows.push(new flowFollower(createVector(-100,-100)));
	
	// Input interpretation
	//curXfunc = interpretMathString(xString);
	//curYfunc = interpretMathString(yString);
	/*
	curXfuncStr = xString;
	curYfuncStr = yString;
	*/
	curXfuncStr = math.simplify(xString);
	curYfuncStr = math.simplify(yString);
	
	
	//document.getElementById("mytext").value = yString;
	
	
	makeInitialCalculations();
	
	// For user input
	textdx= createElement('h2', 'dx/dt = ');
	textdx.position(20, height);
	input = createInput(xString);
	input.position(110, height+25);
	textdy= createElement('h2', 'dy/dt = ');
	textdy.position(20, height+50);
	inputy = createInput(yString);
	inputy.position(110, height+25+50);
	reCalcButton = createButton('Recalculate');
	reCalcButton.position(20,height+100);
	reCalcButton.mousePressed(reCalculateFunction);
	
	
	dirFieldCheck = createCheckbox('Toggle directional field',showDirField);
	dirFieldCheck.position(160,height+100);
	dirFieldCheck.changed(toggleDirField);
	
	nullclineCheck = createCheckbox('Toggle nullclines and equilibria',showNullclines);
	nullclineCheck.position(160,height+120);
	nullclineCheck.changed(toggleNullclines);
	
	
}  

/*
function interpretMathString(str){
	// Main function for interpreting a string
	// Currently reads:
		// Constant terms: +4
		// Linear: 3*x (with only one coefficient)
		// Powers
	// To implement:
		// Terms with both x and y
		
	// First, remove spaces
	let curStr = str.replace(/ /g,'');
	
	// Split into terms
	let allTerms = curStr.split('+');
	
	let numTerms = allTerms.length;
	
	//let returnString = '';
	let linX = 0;
	let linY = 0;
	let constTerm = [];
	let mult = [];
	let Xpow = [];
	let Xmult = [];
	let Ypow = [];
	let Ymult = [];
	
	for (let k = 0; k <= allTerms.length-1; k++){
		
		let curTerm = allTerms[k];
		
		
		// Split on * to get the multiplier in front
		let splitStr = curTerm.split('*');
		
		//let toMult = 1;
		// Check the first part and save
		//if ((splitStr[0] == 'x') || (splitStr[0] == 'y')) {
		//} else {
		//	toMult = float(splitStr[0]);
		//}
		
		//if (splitStr[0][0] == '-'){
		//	if (splitStr[0][1]
		//}
		
		//mult.push(toMult); 
		
		
		mult.push(float(splitStr[0]));
		
		// Check if term contains x and y
		let xPos = curTerm.search('x');
		let yPos = curTerm.search('y');
		// Search returns -1 if not found
		
		// If both x and y
		if ((xPos > 0) && (yPos > 0)){
			// Has to be of either of the following forms:
			// a * x * y
			// a * x ^ b * y 
			// a * x * y ^ c
			// a * x ^ b * y ^ c
			
			
			
			// NOT YET IMPLEMENTED!!
			
			
		}
		
		// Only an x, no y
		if ((xPos > 0) && (yPos == -1)){
			// Split to get the power of x
			let powSplit = curTerm.split('^');
			
			// If there are no powers, the two array are identical
			if (curTerm == powSplit){
				// The power of x is one
				Xpow.push(1);
			} else {
				// The second part of powSplit is the power.
				Xpow.push(float(powSplit[1]));
			}
			
			// Zeros for everything else
			Ypow.push(0);
			constTerm.push(0);
			
		}
		// Only a y, no x
		if ((yPos > 0) && (xPos == -1)){
			// Split to get the power of y
			let powSplit = curTerm.split('^');
			
			if (curTerm == powSplit){
				// The power of y is one
				Ypow.push(1);
			} else {
				// The second part of powSplit is the power.
				Ypow.push(float(powSplit[1]));
				
			}
			
			// Zeros for everything else
			Xpow.push(0);
			constTerm.push(0);
		}
		// Constant term: No x and no y
		if ((yPos == -1) && (xPos == -1)){
			
			Xpow.push(0);
			Ypow.push(0);
			constTerm.push(float(curTerm));
		}
	}
	
	//return [constTerm,linX,linY]
	//console.log([numTerms,constTerm,Xpow,Xmult,Ypow,Ymult])
	return [numTerms,constTerm,mult,Xpow,Ypow]
}
*/
/*
function evaluateDiffEq(x,y,curFunc){
	
	let curVal = 0;
	
	let numTerms = curFunc[0]
	
	for (let k = 0; k < numTerms; k++){
		// Constant
		curVal = curVal + curFunc[1][k];
		
		let xContri = curFunc[2][k]*pow(x,curFunc[3][k]);		
		let yContri = curFunc[2][k]*pow(y,curFunc[4][k]);
		
		// If both are non zero
		if ((curFunc[3][k] != 0) && (curFunc[4][k] != 0) ){
			curVal = curVal + xContri*yContri;
		} else if (curFunc[3][k] != 0) {
			curVal = curVal + xContri
		} else if (curFunc[4][k] != 0) {
			curVal = curVal + yContri
		}
		
		
		
		
		
		
	}
	
	// Constant term
	//curVal = curVal + curFunc[0];
	//curVal = curVal + curFunc[1];
	// 
	//curVal = curVal + curFunc[1]*x;
	// Linear y
	//curVal = curVal + curFunc[2]*y;
	
	return curVal
}
*/

// Function for making the array for the directional field vectors
function makeDirField(dirFieldRes){
	// Empty the array
	dirFieldVectors = []; 
	/*
	// Go through in both x and y direction
	for (let k = -dirFieldRes; k <= dirFieldRes ;k++){
		for (let j = -dirFieldRes; j <= dirFieldRes ;j++){
			// Positions split in dirFieldRes positions 
			newX = k*int(fieldWidth/dirFieldRes)/scalingFactor;
			newY = j*int(fieldHeight/dirFieldRes)/scalingFactor; 
			//newVec = new Vector(newX,newY);
			newVec = createVector(newX,newY);
			dirFieldVectors.push(newVec);
		} 
	}
	*/
		
	// Calculate the coordinates to start dirField vectors from
	axesWidth= fieldWidth;
	minX = -axesWidth;
	maxX = axesWidth;
	minY = -axesWidth;
	maxY = axesWidth;
	
	let newX = minX;
	let newY = minY;
	
	for (let k = 1; k < dirFieldRes; k++){
		newX = lerp(minX,maxX,k/dirFieldRes);
		
		for (let j = 1; j < dirFieldRes; j++){
			newY = lerp(minY,maxY,j/dirFieldRes);
			
			newVec = createVector(newX,newY);
			
			newVec = pixelToCoordinate(newVec);
			
			dirFieldVectors.push(newVec);
		}
	}
}



/*			
	for (let k = 0; k <= dirFieldRes ;k++){
		for (let j = 0; j <= dirFieldRes ;j++){
			// Positions split in dirFieldRes positions 
			newX = lerp(minX,maxX,k/dirFieldRes);
			newY = lerp(minY,maxY,j/dirFieldRes);
*/
			

function updateScale(newScale){
	scalingFactor = newScale;
	if (showDirField){
		makeDirField(curDirFieldRes);
	}
	makeInitialCalculations()
}

function toggleDirField(){
	// Change flag
	//showDirField = !showDirField;
	showDirField = dirFieldCheck.checked();
	
	// Either re-draw or remove, dependent on new value of flag
	if (showDirField){
		makeDirField(curDirFieldRes);
	} else {
		dirFieldVectors =[];
	}
}

function toggleNullclines(){
	// Change flag
	//showNullclines = !showNullclines;
	showNullclines = nullclineCheck.checked();
	showEquis = nullclineCheck.checked();
	
	// Either re-draw or remove, dependent on new value of flag
	if (showNullclines){
		[xSignChange,ySignChange] =  calcNullclines(nullClinesResolution);
	} else {
		xSignChange =[];
		ySignChange =[];
	}
}

function toggleMouseFlowFollowers(){
	// Change flag
	spawnFlowFollowersOnMouseClick = !spawnFlowFollowersOnMouseClick;
}
  
function mousePressed() {
	mouseCurDown = true;
	
	/*
	// Get the current mouse-position
	[curX,curY] = transMousePos();
	
	console.log(curX);
	console.log(curY);
	*/
	
	//spawnAtMousePos()
 // return false;
}

function mouseReleased(){
	mouseCurDown = false;
}

function pixelToCoordinate(vec){
	let newX = vec.x*scalingFactor;
	let newY = -vec.y*scalingFactor;
	
	return createVector(newX,newY);
}
function coordinateToPixel(vec){
	let newX = vec.x/scalingFactor;
	let newY = -vec.y/scalingFactor;
	
	return createVector(newX,newY);
}


function mouseWheel(event){
	
	let curScrollZoom = 1.1;
	if (event.delta < 0){
		updateScale(scalingFactor/curScrollZoom)
	} else {
		updateScale(scalingFactor*curScrollZoom)
	}
	
}

function transMousePos(){
	// Function for calculating the mouse position from the pixel position of the mouse. Should more or less be the opposite of the translations done in draw
	
	let curX = mouseX;
	let curY = mouseY;
	// Move it with the translation done in draw
	curX = curX-wMargin-fieldWidth/2;
	curY = curY-hMargin-fieldHeight/2;
	//// Scale it with scalingFactor
	//curX = curX/scalingFactor;
	//curY = curY/scalingFactor;
	
	return [curX,curY];
}

function spawnAtMousePos(){
	// Get the current mouse-position
	[curX,curY] = transMousePos();
	
	let mouseCoorVec = pixelToCoordinate(createVector(curX,curY));
	// While testing
	//let mouseCoorVec = createVector(10,10);
	
	//let pixelVec = createVector(curX,curY);
	// Show an arrow pointing at the mouse for debugging
	//displayVector(createVector(curX,-curY)); 
	// For testing
	//displayVector(mouseCoorVec);
	//let mouseDiff = diffEq(mouseCoorVec);
	//displayRelativeVector(mouseDiff,mouseCoorVec);
	
	if (spawnFlowFollowersOnMouseClick){
		// Make a new flowFollower at the mouse-position
		//allFlows.push(new flowFollower(createVector(curX,-curY)));
		allFlows.push(new flowFollower(mouseCoorVec));
	}
}

function reCalculateFunction(){
	// Re-interpret inputs
	/*
	curXfunc = interpretMathString(input.value());
	curYfunc = interpretMathString(inputy.value());
	curXfuncStr = input.value();
	curYfuncStr = inputy.value();
	*/
	curXfuncStr = math.simplify(input.value());
	curYfuncStr = math.simplify(inputy.value());
	
	
	
	// And make calculations again
	makeInitialCalculations();
	
}

// DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW 
// DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW 
// DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW 
// Draw stuff
function draw() {	
  background(backGroundColor);
  // Center field in canvas
  translate(wMargin+fieldWidth/2,hMargin+fieldHeight/2); // For non-WEBGL
  //translate(-fieldWidth/2,-fieldHeight/2); // For WEBGL
  
  //scale(2);
  if (mouseCurDown){
	  spawnAtMousePos();
  }
	
	
	// Draw axes
	strokeWeight(1);
	stroke(axesColor);
	fill(axesColor);
	line(-fieldWidth,0,fieldWidth,0);
	line(0,-fieldHeight,0,fieldHeight);
	
	
	// Draw nullclines
	if (showNullclines){
		
		for (let nullX = 1; nullX < xSignChange.length;nullX++){
			let curPos = coordinateToPixel(xSignChange[nullX]);
			let curDiff = coordinateToPixel(ySignChange[nullX]);
			fill([math.sign(curDiff.y)*255,255*math.sign(curDiff.x),150]); 
			noStroke();
			//stroke(255,0,0);
			circle(curPos.x,curPos.y,1)
		}
		/*
		for (let nullX = 1; nullX < xSignChange.length;nullX++){
			let curPos = coordinateToPixel(xSignChange[nullX]);
			fill(xNullclineColor); 
			noStroke();
			//stroke(255,0,0);
			circle(curPos.x,curPos.y,1)
		}
		for (let nullY = 1; nullY < ySignChange.length;nullY++){
			let curPos = coordinateToPixel(ySignChange[nullY]);
			fill(yNullclineColor);
			noStroke();
			//stroke(255,0,255);
			circle(curPos.x,curPos.y,1)
		}
		
		*/
	}
	
	// Draw equilibria
	if (showEquis){
		fill(equiColor);
		noStroke();
		for (let curEq = 0; curEq < equis.length; curEq++){
			let curPos = coordinateToPixel(equis[curEq]);
			rect(curPos.x-equiSize/2,curPos.y-equiSize/2,equiSize,equiSize);
			//circle(curPos.x,curPos.y,equiSize);
		}
	}
	
	// Draw directional field
	if (showDirField){
		for (let k = 0; k < dirFieldVectors.length;k++){
			curVec = dirFieldVectors[k];
			curdiffVec = diffEq(curVec);
			//curdiffVec.displayRelative(curVec);
			displayRelativeVector(curdiffVec,curVec);
		}
	}
	// Update and display all flowFollowers
	if (allFlows.length > 0){
		for (let f = allFlows.length-1; f >= 0 ;f--){
			allFlows[f].update();
			allFlows[f].display();
			// If it has reached its lifetime, remove it from the array
			if (allFlows[f].lifeTime > allFlows[f].maxTime){
				allFlows.splice(f,1);
			}
		}
	}
}

function makeInitialCalculations(){

	// Calculate the nullclines
	if (showNullclines){
	[xSignChange,ySignChange] =  calcNullclines(nullClinesResolution);
	}
	
	/*
	// Double loop through nullclines to find equilibria
	if (showEquis){ // Dont find them if showEquis is false, to save time
		equis =[];
		for (let k = 0; k < xSignChange.length;k++){
			for (let j = 0; j < ySignChange.length;j++){
				if (xSignChange[k].x == ySignChange[j].x){
					if (xSignChange[k].y == ySignChange[j].y){
						equis.push(xSignChange[k].copy());
					}
				}
			}			
		}
	}
	*/
	// Make the directional field
	makeDirField(curDirFieldRes)
	
}

function calcNullclines(nullclineRes){
	axesWidth= fieldWidth*scalingFactor;
	minX = -axesWidth+0.001;
	maxX = axesWidth;
	minY = -axesWidth+0.001;
	maxY = axesWidth;
	
	//let curPos = createVector(minX,minY);
	let curDiff = diffEq(createVector(minX,minY));
	
	let nX = minX;
	let nY = minY;	
	
	let prevX = nX;
	let prevY = nY;
	
	let dX = (maxX-minX)/nullclineRes;
	let dY = (maxY-minY)/nullclineRes;
	
	// Idea: Go through all places, check above and to the left
	// and save positions to an array 
	
	let thisxSignChange = [];
	let thisySignChange = [];
	
	let alldX = [];
	let alldY = [];
	
	let allVec = [];
	let allDiff =[];
	
	// Go through in the x-direction
	for (let k = 1; k < nullclineRes; k = k+1){
		prevX = nX; // Save previous x
		// Get the current x
		//nX = lerp(minX,maxX,k/nullclineRes);
		nX = minX+dX*k;
		
		// Go through in the y-direction
		for (let j = 1; j < nullclineRes; j=j+1){
			prevY = nY; // Save previous y
			// Get current y
			//nY = lerp(minY,maxY,j/nullclineRes);
			nY = minY+dY*j;
			
			// Calculate differential equation at current ...
			//curDiff = diffEq(createVector(nX,nY));
			//alldX.push(curDiff.x);
			//alldY.push(curDiff.y);
			
			let curPos = createVector(nX,nY);
			allVec.push(curPos);
			allDiff.push(diffEq(curPos));
			/*
			// ... to the left (previous x-position) ...
			leftDiff = diffEq(createVector(prevX,nY));
			// ... and below (previous y-position)
			belowDiff = diffEq(createVector(nX,prevY));
			
			// Skip the first
			if (j != 1){
				// If signs have changed
				if (Math.sign(curDiff.y) != Math.sign(belowDiff.y)){
					// Add to array
					thisySignChange.push(createVector(nX,nY));
				}
				if (Math.sign(curDiff.x) != Math.sign(belowDiff.x)){
					// Add to array
					thisxSignChange.push(createVector(nX,nY));
				}
			}
			if (Math.sign(curDiff.y) != Math.sign(leftDiff.y)){
				// Add to array
				thisySignChange.push(createVector(nX,nY));
			}
			if (Math.sign(curDiff.x) != Math.sign(leftDiff.x)){
				// Add to array
				thisxSignChange.push(createVector(nX,nY));
			}
			*/
		}
	}
	
	/*
	let prevSign = 0;
	for (let k = 0; k < alldX.length-1; k = k+1){
		let curX = alldX[k];
		if (prevSign != Math.sign(curX)){
			thisxSignChange.push(curX);
		}
	}
	for (let k = 0; k < alldY.length-1; k = k+1){
		let curY = alldY[k];
		if (prevSign != Math.sign(curY)){
			thisySignChange.push(curY);
		}
	}
	*/
	
	//	return [thisxSignChange,thisySignChange];
	//return [alldX,alldY];
	return [allVec,allDiff];
	
}

function diffEq(pos){
	//let x = pos.x;
	//let y = pos.y;
	let dx = 0;
	let dy = 0;
	
	//let fx = new Function ('return -2');
	
	//dx = -1;
	//dy = 1;
	
	//dx = evaluateDiffEq(x,y,curXfunc);
	//dy = evaluateDiffEq(x,y,curYfunc);
	/*
	let curXstring = "0";
	let curYstring = "0";
	if (isFinite(x) && isFinite(y)){
		curXstring = curXfuncStr.replace(/x/g,str(x)).replace(/y/g,str(y));
		curYstring = curYfuncStr.replace(/x/g,str(x)).replace(/y/g,str(y));
	}
	//let curYstring = curXfuncStr.replace("x",str(x));
	
	dx = math.evaluate(curXstring);
	dy = math.evaluate(curYstring);
	*/
	if (isFinite(pos.x) && isFinite(pos.y)){
		
		dx = curXfuncStr.evaluate({x:pos.x,y:pos.y});
		dy = curYfuncStr.evaluate({x:pos.x,y:pos.y});
	}
	/*
	// Apparently eval is horribly insecure and slow... 
	// I have to somehow structure the input and make a function that uses the structure instead
	dx = eval(xStringInter);
	dy = eval(yStringInter);
	
	/*
	
	// While testing, just use x'=y, y' = -x/2 for rotations
	dx = y;
	dy = -0.5*x;
	
	// Saddle
	dx = -y;
	dy  = -0.5*x;
	
	// Lotka-volterra test
	dx = 2*x - 0.02*x*y;
	dy = 0.01*x*y - 0.5*y;
	
	// Last years exam
	let r = -1;
	let c = 3;
	let d = 6;
	dx = c*pow(x,2) + y;
	dy = d*pow(x,2) - y + r;
	
	
	/*
	
	// Something else
	dx = 2*x - 0.1*pow(y,2);
	//dy = -2*x+0.5*y;
	dy = -x+100;
	/*
	// Something else
	dx = 2*x - pow(y,2);
	//dy = -2*x+0.5*y;
	dy = -x+1;
	
	
	
	/*
	// SIR test (with death)
	let beta = 0.02;
	let gamma = 0.01;
	let delta = 0.5;
	dx = -beta*x*y + delta*y;
	dy = beta*x*y-gamma*y - delta*y; 
	*/
	
	//dx = 0.4*pos.x;
	//dy = 0.1*pos.y;
	
	
	dv = createVector(dx,dy);

	
	
	return dv
} 

class flowFollower {
	
	constructor(vec){
		this.pos = vec; // Position vector
		this.dt = 0.01; // Timestep when simulating
		//this.dt = 0.05; // Timestep when simulating
		this.maxTime = curFlowLifetime; // Max time to simulate for 
		this.lifeTime = 0;
		this.size = 5;
		this.traceLength = curTraceLength;
		this.prevPos = [];
		if (flowUseAllColors){
			this.color = [random(255),random(255),random(255)];
		} else {
			this.color = random(allowedColors);
		}
	}
	/*
	constructor(vec,dt){
		this.pos = vec; // Position vector
		this.dt = dt; // Timestep when simulating
		this.maxTime = 10; // Max time to simulate for 
	}
	constructor(vec,dt,maxTime){
		this.pos = vec; // Position vector
		this.dt = dt; // Timestep when simulating
		this.maxTime = maxTime; // Max time to simulate for 
	}*/
	
	update(){
		
		// Add current pos to prevPos
		this.prevPos.push(createVector(this.pos.x,this.pos.y));
		
		// Trim down prevPos, so not all positions are saved
		if (this.prevPos.length > this.traceLength){
			this.prevPos.splice(0,1);
		}
		
		// Get velocity
		let curVel = diffEq(this.pos);
		
		// Forward Euler step 
		this.pos.x = this.dt*curVel.x+this.pos.x;
		this.pos.y = this.dt*curVel.y+this.pos.y;
		
		// Increase the lifeTime
		this.lifeTime = this.lifeTime + this.dt;
		
		
	}
	
	display(){
		let thisPixelVec = coordinateToPixel(this.pos);
		
		// Show trace
		stroke(this.color);
		strokeWeight(this.size)
		if (this.prevPos.length >= 1){
		
			//stroke(this.color[0],this.color[1],this.color[2]);
			//fill(this.color[0],this.color[1],this.color[2]);
			let cur = thisPixelVec;
			let Prev = coordinateToPixel(this.prevPos[this.prevPos.length-1]);
			line(Prev.x,Prev.y,cur.x,cur.y);
			
			for (let k = 0; k < this.prevPos.length-1; k++){
				// Get the pixel positions of current and previous part of trace
				let curPrevPix = coordinateToPixel(this.prevPos[k]);
				let PrevPrevPix = coordinateToPixel(this.prevPos[k+1]);
				
				// Set the color, with alpha as the trace number
				stroke(this.color[0],this.color[1],this.color[2],255*(k+2)/this.prevPos.length);
				fill(this.color[0],this.color[1],this.color[2],255*(k+2)/this.prevPos.length);
				
				
				// Display
				line(PrevPrevPix.x,PrevPrevPix.y,curPrevPix.x,curPrevPix.y);
				
				
				//line(this.prevPos[k].x,-this.prevPos[k].y,this.prevPos[k].x+this.prevPos[k+1].x,-(this.prevPos[k].y+this.prevPos[k+1].y));
				//line(scalingFactor*this.prevPos[k].x,-scalingFactor*this.prevPos[k].y,scalingFactor*this.prevPos[k+1].x,-scalingFactor*(this.prevPos[k+1].y));
				//circle(scalingFactor*this.prevPos[k].x,-this.prevPos[k].y*scalingFactor,this.size*0.5);
			}
		}
		
		// Show circle
		strokeWeight(1)
		stroke(0,0,0)
		noStroke()
		fill(150,0,0);
		fill(this.color);
		//circle(scalingFactor*this.pos.x,-this.pos.y*scalingFactor,this.size);
		circle(thisPixelVec.x,thisPixelVec.y,this.size);
		
	}
}


function displayVector(vec){
	vec = coordinateToPixel(vec);
	// Scale position
	relX = vec.x;
	relY = vec.y;
	stroke(vectorColor);
	fill(vectorColor);
	strokeWeight(1.5);
	// Draw the line
	line(0,0,relX,relY);
	
	push();
	rotate(vec.heading()); // Rotate arrowhead
	//rotate(-vec.heading()); // Rotate arrowhead
	let arrowSize = 5;
	translate(vec.mag()-arrowSize,0); // Move to the front of line
	triangle(0,arrowSize/2,0,-arrowSize/2,arrowSize,0); // Make a triangle
	pop();
}

function  displayRelativeVector(vec1,vec2){
	// Get the pixel-position of the starting point
	vec2 = coordinateToPixel(vec2);

	// Get the position to start the arrow at
	let startX = vec2.x;
	let startY = vec2.y;
	
	let dX = vec1.x;
	let dY = vec1.y;
	let maxLength = 20*scalingFactor;
	let curLen = vec1.mag();//float(sqrt(pow(dX,2)+pow(dY,2)));
	// If the vector is too small, don't show it
	if (curLen > minVecLen){
		// Scale the length to "maxLength"
		dX = maxLength*(dX/curLen);
		dY = maxLength*(dY/curLen);
		push();
		translate(startX,startY); // Move to the starting point
		displayVector(createVector(dX,dY)); // And draw an arrow
		pop();	
	}
}

/*

function  displayRelativeVectorLessOld(vec1,vec2){

	// Get the position to start the arrow at
	let startX = vec2.x;
	let startY = vec2.y;
	
	let dX = vec1.x;
	let dY = vec1.y;
	let maxLength = 20;
	let curLen = vec1.mag();//float(sqrt(pow(dX,2)+pow(dY,2)));
	// If the vector is too small, don't show it
	if (curLen > minVecLen){
		// Scale the length to "maxLength"
		dX = maxLength*(dX/curLen);
		dY = maxLength*(dY/curLen);
		push();
		translate(startX,-startY); // Move to the starting point
		displayVector(createVector(dX,dY)); // And draw an arrow
		pop();	
	}
}
*/

/*
function  displayRelativeVectorOld(vec1,vec2){
	let startX = vec2.x*scalingFactor;
	let startY = vec2.y*scalingFactor;
	let dX = vec1.x*scalingFactor;
	let dY = vec1.y*scalingFactor;
	
	
	//stroke(0);
	//strokeWeight(1);
	stroke(vectorColor);
	line(startX,-startY,startX+dX,-(startY+dY));
	// Draw arrow points
	let curAngle = atan(dY/dX);
	// Need the angle, so wait with this
	//line(startX+dX,-(startY+dY),startX+dX+10*curAngle,-(startY+dY+10*curAngle));
	//line(startX+dX,-(startY+dY),startX+dX+10,-(startY+dY)-10);
	// Simply draw a point at the starting point
	noStroke();
	fill(vectorColor);
	circle(startX,-startY,sqrt(scalingFactor)*2)
 }
 */	