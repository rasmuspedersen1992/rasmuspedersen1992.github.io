/* Sketch for visualizing simple ODE systems

	Features currently implemented:
		- Flow illustrating circles
		- Directional field vectors (Partially)
		- Use p5 built-in vectors instead
		- Colorschemes (NigthMode and RUC, and function setAllColors('name'))
		- Make arrowhead of vectors (Use "triangle" function) 
		- Simple nullclines 
		- Input interpretation:
			- Now uses math.js, so everything should work
		- Make directional field toggle-able
		- Make nullclines toggle-able
		- Make checkboxes
		- Draw equilibria (Use nullclines implementation)
	
	TODO:
		- Calculate/find stability of equilibria (Could be done in a rudamentary numerical way)
		- Draw stability of equilibria
		- Improved nullclines 
		- Marching squares for drawing nullclines
*/


/* 

Ny metode til nullkliner:

+---+
|   | 
|   | 
|   |
%---+

Tjek i et grid, hvis værdien skifter til højre eller oven over, marker som uafklaret
Næste iteration:

+---+
|   |
% + | 
|   |
%-%-+ 

Igen, de steder hvor værdien skifter, marker som uafklaret

Tegn en firkant eller en prik i alle uafklarede positioner

*/

let cnv;

let fieldWidth = 300;
let fieldHeight = 300;
let maxWidth = 800;

let scalingFactor = 0.01;

// String for differential equations
//let xString = "3 * x^3  + 5 * y^2 - 15";
//let yString = "1 * x ^2 - 1* y ";
let xString = "3 * x^2  + 5 * y^2 - 15";
let yString = "1 * x ^2 - 1* y -3";
//let xString = "-3 * x  + 5 * y + -1";
//let yString = "1 * x ^2 + -1* y +-1";
let xStringInter = '';
let yStringInter = '';
let curXfunc = [0,0,0,0,0];
let curYfunc = [0,0,0,0,0];
//let curXfuncStr = "1*x^2";
//let curYfuncStr = "1*y";

// Directional field
let dirFieldVectors = [];
let dirFieldDiffs = [];
let curDirFieldRes = 20; // Resolution of directional vectorfield
let showDirField = true;
let minVecLen = 0.1; // Smallest allowed vector: 1 pixel

// Flow followers
let allFlows = [];
let curTraceLength = 10;
let curFlowLifetime = 5;
let spawnFlowFollowersOnMouseClick = true;
let flowUseAllColors = true;

// Older Nullclines
let xSignChange = [];
let ySignChange = [];
let nullClinesResolution = 20;
let showNullclines = true; 
let nullPos = [];
let dyPosi = [];
let dxPosi = []; 
let gridPos =[];

// Old nullclines
let nClineInitRes = nullClinesResolution;
let nClineVecs = [];
let nClineDifs = [];

let nClineTest1 = [];
let nClineTest2 = [];

// Grid-structured nullclines
let xNullclinePosis = [];
let yNullclinePosis = [];
let xNullclineShow = [];
let yNullclineShow = [];
let maxNullclineArraySize = 100000;
//let maxNullclineArraySize = 300000;
//let maxNullclineArraySize = 0;

// Equilibria
let equis =[];
let equiSize = 10;
let showEquis = false;

// Newton walkers
let showNewtonWalkers = true;
let numNewtonWalkers = 0;
let newtownWalkerOpacity = 150; // Out of 255
let AllNewtonWalkers = [];
let permWalkerX = [];
let permWalkerY = [];
//let maxPermWalkLength = 1000;
let maxPermWalkLength = 0;

// Newton walker looking for equilibria
let newtonEquiTest;
let newtonEquiFinders = [];
let numNewtonEquis = 0;

// New equilibrium finder
let equilibriumFinderTest;


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
	
	/*
	axesWidth= fieldWidth*scalingFactor;
	minX = -axesWidth;
	maxX = axesWidth;
	minY = -axesWidth;
	maxY = axesWidth;
	
	let newX = minX;
	let newY = minY;
	
	let nclinetestres = 10;
	for (let k = 1; k < nclinetestres; k++){
		newX = lerp(minX,maxX,k/nclinetestres);
		newX2 = newX + 1;
		
		for (let j = 1; j < nclinetestres; j++){
			newY = lerp(minY,maxY,j/nclinetestres);
			newY2 = newY + 1;
			
			
			nClineTest1.push(createVector(newX,newY));
			nClineTest2.push(createVector(newX2,newY2));
			
		}
	}
	*/


	cnv = createCanvas(divWidth, divHeight);
	cnv.parent('sketch-holder');
	cnv.style('display','block');

	// Set the width to the full width
	fieldWidth = width*0.5;
	fieldHeight = height*0.5;
		
	wMargin = (width-fieldWidth)/2;
	hMargin = (height-fieldHeight)/2;
	
	
	// Input interpretation
	curXfuncStr = math.simplify(xString);
	curYfuncStr = math.simplify(yString);
	
	curXfuncStrXDiff = math.derivative(curXfuncStr,'x');
	curXfuncStrYDiff = math.derivative(curXfuncStr,'y');
	curYfuncStrXDiff = math.derivative(curYfuncStr,'x');
	curYfuncStrYDiff = math.derivative(curYfuncStr,'y');
	
	// Calculate dirfield and nullclines	
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
	
	
	
	// Newton walker test
	let axesWidth= fieldWidth*scalingFactor;
	let minX = -axesWidth;
	let maxX = axesWidth;
	let minY = -axesWidth;
	let maxY = axesWidth;
	for (let k = 0; k < numNewtonWalkers;k++){
		let varToUse = 'x';
		if (random() < 0.5){
			varToUse = 'y';
		}
		let newWalker = new newtonWalker(createVector(random(minX,maxX),random(minY,maxY)),varToUse);
		AllNewtonWalkers.push(newWalker);
	}
	
	for (let k = 0; k < numNewtonEquis;k++){
		let newWalker = new newtonWalker(createVector(random(minX,maxX),random(minY,maxY)),'x');
		newWalker.color = equiColor;
		newWalker.type = 'equi';
		newtonEquiFinders.push(newWalker)
	}
	
	/*
	// Equilibria newton walker
	newtonEquiTest = new newtonWalker(createVector(random(minX,maxX),random(minY,maxY)),'x');
	newtonEquiTest.color = equiColor;
	newtonEquiTest.size = 10;
	*/
	
	
	equilibriumFinderTest = new equilibriumFinder(createVector(random(minX,maxX),random(minY,maxY)));
}  

function makeDirFieldInits(dirFieldRes){
	
	// Empty the array
	dirFieldVectors = []; 
	dirFieldDiffs = [];
		
	// Calculate the coordinates to start dirField vectors from
	axesWidth= fieldWidth*scalingFactor;
	minX = -axesWidth;
	maxX = axesWidth;
	minY = -axesWidth;
	maxY = axesWidth;
	
	let newX = minX;
	let newY = minY;
	
	let dX = (maxX-minX)/dirFieldRes;
	let dY = (maxY-minY)/dirFieldRes;
	
	
	// Go through in the x-direction
	for (let k = 0; k < dirFieldRes; k++){
		//newX = lerp(minX,maxX,k/dirFieldRes);
		newX = minX+dX*k;
		
		
		for (let j = 0; j < dirFieldRes; j++){
			//newY = lerp(minY,maxY,j/dirFieldRes);
			newY = minY+dY*j;
			
			newVec = createVector(newX,newY);
			
			//newVec = pixelToCoordinate(newVec);
			
			dirFieldVectors.push(newVec);
			dirFieldDiffs.push(diffEq(newVec));
			//dirFieldDiffs.push(newVec);
		}
	}
}

// Function for making the array for the directional field vectors
function makeDirField(dirFieldRes){
	
		makeDirFieldInits(dirFieldRes);
		/*
	// Check if "dirFieldVectors" needs to be remade
	if (dirFieldVectors.length == 0){
		makeDirFieldInits(dirFieldRes);
	} else if ((dirFieldVectors[0].x == -fieldWidth*scalingFactor) && (dirFieldVectors[dirFieldVectors.length-1].x == fieldWidth*scalingFactor) == false){
		makeDirFieldInits(dirFieldRes);
	}*/
	
}


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
		// [xSignChange,ySignChange] =  calcNullclines(nullClinesResolution);
		//calcNullclinesThread();
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
	
	
	curXfuncStrXDiff = math.derivative(curXfuncStr,'x');
	curXfuncStrYDiff = math.derivative(curXfuncStr,'y');
	curYfuncStrXDiff = math.derivative(curYfuncStr,'x');
	curYfuncStrYDiff = math.derivative(curYfuncStr,'y');
	
	
	
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
		
		improveNullclineResolution();
		
		// X-nullclines
		for (let k = 0;k < xNullclineShow.length;k++){ 
			noStroke();
			let posVec = coordinateToPixel(xNullclineShow[k].pos);
			let curSize = xNullclineShow[k].boxSize;
			
			//fill(xNullclineColor)
			let curAlpha = 100;
			fill([xNullclineColor[0],xNullclineColor[1],xNullclineColor[2],curAlpha]);
			rect(posVec.x,posVec.y,curSize/scalingFactor+1,-curSize/scalingFactor-1);
			
			//if (xNullclineShow[k].status == false){
				//circle(posVec.x,posVec.y,xNullclinePosis[k].boxSize*10);
			//}
		}
		// Y-nullclines
		for (let k = 0;k < yNullclineShow.length;k++){ 
			noStroke();
			let posVec = coordinateToPixel(yNullclineShow[k].pos);
			let curSize = yNullclineShow[k].boxSize;
			
			//fill(yNullclineColor)
			let curAlpha = 100;
			fill([yNullclineColor[0],yNullclineColor[1],yNullclineColor[2],curAlpha]);
			rect(posVec.x,posVec.y,curSize/scalingFactor+1,-curSize/scalingFactor-1);
			
			//if (yNullclineShow[k].statusY == false){
				//circle(posVec.x,posVec.y,curSize/scalingFactor);
			//}
		}
		
			/*
			} else {
				fill(yNullclineColor)
				circle(posVec.x,posVec.y,0.1*xNullclinePosis[k].boxSize/scalingFactor);
				rect(posVec.x,posVec.y,xNullclinePosis[k].boxSize/scalingFactor,-xNullclinePosis[k].boxSize/scalingFactor);
			*/
			/*
			fill(yNullclineColor)
			circle(yNullclinePosis[k].x,yNullclinePosis[k].y,5);
			*/
		/*
		for (let k=0; k < xNullclinePosis.length;k++){
			
			noStroke();
			let posVec = coordinateToPixel(xNullclinePosis[k].pos);
			let curSize = xNullclinePosis[k].boxSize;
			if (xNullclinePosis[k].status == false){
				fill(xNullclineColor)
				circle(posVec.x,posVec.y,0.2*xNullclinePosis[k].boxSize/scalingFactor);
			} else {
				fill(yNullclineColor)
			}
				
			
		}
		*/
		/*
		let nClineRes = nullClinesResolution;
		let maxIndex = nClineRes*nClineRes;
		let prevXsign = 0;
		//curIndex = 
		for (let nX = 0;nX < nClineRes;nX++){ 
			//let curX = nClineDifs;
			for (let nX = 0;nX < nClineRes;nX++){ 
			
			}			
		}
		*/
		
		/*
		// Increase resolution
		if (xSignChange.length < 4000){
			let axesWidth= fieldWidth*scalingFactor;
			let minX = -axesWidth;
			let maxX = axesWidth;
			let minY = -axesWidth;
			let maxY = axesWidth;
			
			let numRandom = 10;
			for (let k = 0; k < numRandom;k++){
				newRandPos = createVector(random(minX,maxX),random(minY,maxY));
				curPosDiff = getDiffAt([newRandPos]);
				
				xSignChange.push(newRandPos);
				ySignChange.push(curPosDiff[0]);
			}
		}
		*/
		/*
		if (xSignChange.length < nClineTest1.length){
			for (let nullX = 1; nullX < nClineTest1.length;nullX++){
				let curPos = nClineTest1[nullX]
				let curDiffs = getDiffAt(nClineTest1)
				let curDiff = curDiffs[nullX];
				
				xSignChange.push(curPos)
				ySignChange.push(curDiff)
			}
		}
		
		if (xSignChange.length - nClineTest1.length < nClineTest2.length){
			for (let nullX = 1; nullX < nClineTest2.length;nullX++){
				let curPos = nClineTest2[nullX]
				let curDiffs = getDiffAt(nClineTest2)
				let curDiff = curDiffs[nullX];
				xSignChange.push(curPos)
				ySignChange.push(curDiff)
			}
		}
		*/
		
		/*
		for (let nullX = 1; nullX < nClineTest1.length;nullX++){
			let curPos = coordinateToPixel(nClineTest1[nullX]);
			let curDiff = coordinateToPixel(nClineTest1[nullX]);
			*/
		
		/*
		gridPos =[];
		gridPosY =[];
		
		let nClineRes = nullClinesResolution;
		let maxIndex = nClineRes*nClineRes;
		//let curID = 0;
		
		for (let k = 0;k < maxIndex;k++){
			
			curGrid = 0;
			curGridY = 0;
			
			// Add south-west
			curGrid = dxPosi[k];
			curGridY = dyPosi[k];
			
			if (k+1 < maxIndex){
				// Add northwest
				curGrid = curGrid + 8 * dxPosi[k+1];
				curGridY = curGridY + 8 * dyPosi[k+1];
				if (k+nClineRes < maxIndex){
					// Add southeast
					curGrid = curGrid + 2 * dxPosi[k+nClineRes-1];
					curGridY = curGridY + 2 * dyPosi[k+nClineRes-1];
					if (k+nClineRes+1 < maxIndex){
						// Add northeast
						curGrid = curGrid + 4 * dxPosi[k+nClineRes];
						curGridY = curGridY + 4 * dyPosi[k+nClineRes];
					}
				}
			}
			
			gridPos.push(curGrid);
			gridPosY.push(curGridY);
		}
		*/
		
	}
	
	
	// Draw equilibria
	if (showEquis){
		// Check for equilibria every 200 frames
		if ((frameCount % 200) == 1){
			checkForEquilibria()
		}
		fill(equiColor);
		noStroke();
		for (let curEq = 0; curEq < equis.length; curEq++){
			let curPos = coordinateToPixel(equis[curEq]);
			circle(curPos.x,curPos.y,equiSize,equiSize);
			//circle(curPos.x,curPos.y,equiSize);
		}
	}
	
	
	// Draw directional field
	if (showDirField){
		for (let k = 0; k < dirFieldVectors.length;k++){
			curVec = dirFieldVectors[k];
			curdiffVec = dirFieldDiffs[k];
			//curdiffVec = diffEq(curVec);
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
	
	
  
	
	// Newton walkers
	for (let k = 0; k < numNewtonWalkers;k++){
		if (random() < 0.25){
			AllNewtonWalkers[k].update();
		}
		AllNewtonWalkers[k].display();
	}
	/*
	newtonEquiTest.update();
	newtonEquiTest.display();
	if (newtonEquiTest.varToUse == 'x'){
		newtonEquiTest.varToUse = 'y';
	} else {
		newtonEquiTest.varToUse = 'x';	
	}
	*/
	
	for (let k = 0; k < numNewtonEquis;k++){
		newtonEquiFinders[k].update();
		
		newtonEquiFinders[k].display();
		
		if (newtonEquiFinders[k].varToUse == 'x'){
			newtonEquiFinders[k].varToUse = 'y';
		} else {
			newtonEquiFinders[k].varToUse = 'x';	
		}
	}

/*	
	equilibriumFinderTest.update();
	equilibriumFinderTest.display();
  
  */
	/*
	// Permanent newton walker array
	for (let k = 0; k < permWalkerX.length;k++){
		let thisPixelVec = coordinateToPixel(permWalkerX[k]);
		fill(155,155)
		stroke(155,155)
		
		circle(thisPixelVec.x,thisPixelVec.y,10);
	}
	for (let k = 0; k < permWalkerY.length;k++){
		let thisPixelVec = coordinateToPixel(permWalkerY[k]);
		fill(155,155)
		stroke(155,155)
		
		circle(thisPixelVec.x,thisPixelVec.y,10);
	}
	*/
	
}

/*
let promiseTest = new Promise((resolve,reject) => {
	//resolve('asdf')
	//resolve(nClineTest1);
			console.log('starting')
	let curDiffs = getDiffAt(nClineTest1);
	console.log(nClineTest1)
	console.log(curDiffs)
	let  asdf = [nClineTest1,curDiffs];
	resolve(asdf)
})
*/
class nullclinePoint {
	// Object used to determine the position of the nullclines
	constructor(x,y,status,boxSize){
		this.pos = createVector(x,y);
		//this.x = x;
		//this.y = y;
		this.status = status;
		this.statusY = status;
		this.boxSize = boxSize;
		//this.children = [];
	}
	
	// Function for making the next three points
	makeSubPoints(){
		let curWidth = this.boxSize/2;
		let toReturn = [];
		toReturn.push(new nullclinePoint(this.pos.x,this.pos.y,		 false,curWidth));
		toReturn.push(new nullclinePoint(this.pos.x+curWidth,this.pos.y+curWidth,false,curWidth));
		toReturn.push(new nullclinePoint(this.pos.x,		 this.pos.y+curWidth,false,curWidth));
		toReturn.push(new nullclinePoint(this.pos.x+curWidth,this.pos.y,		 false,curWidth));
		
		//this.children = toReturn;
		
		return toReturn;
	}
	
	determine(){
		let curDiff = diffEq(this.pos);
		// Determine x
		let xSign = math.sign(curDiff.x);
		let ySign = math.sign(curDiff.y);
		// Above and right
		let aboveDiff = diffEq(createVector(this.pos.x+this.boxSize,this.pos.y));
		let rightDiff = diffEq(createVector(this.pos.x,this.pos.y+this.boxSize)); 
		let aboveXSign = math.sign(aboveDiff.x);
		let rightXSign = math.sign(rightDiff.x);
		let aboveYSign = math.sign(aboveDiff.y);
		let rightYSign = math.sign(rightDiff.y);
		
		
		if ((aboveXSign == xSign) && (rightXSign == xSign)){
			this.status = true;
		}
		if ((aboveYSign == ySign) && (rightYSign == ySign)){
			this.statusY = true;
		}
		
	}
	
	
}
function improveNullclineResolution(){
	let numToAdd = 10;
	
	if (xNullclinePosis.length < maxNullclineArraySize){
		for (let k = numToAdd; k >= 0; k--){
				/*
			xNullclinePosis[k].determine();
			if (!xNullclinePosis[k].status){
				xNullclineShow.push(xNullclinePosis[k]);
			}*/
				let newPoints = xNullclinePosis[k].makeSubPoints();
				for (let nP = 0;nP < newPoints.length;nP++){
					newPoints[nP].determine();
					xNullclinePosis.push(newPoints[nP]);
				}
				
				// Check if the current position is in "Show"-array and remove it if it is
				for (let j = xNullclineShow.length-1; j >= 0; j--){
					if (xNullclineShow[j].pos.x == xNullclinePosis[k].pos.x){
						if (xNullclineShow[j].pos.y == xNullclinePosis[k].pos.y){
							xNullclineShow.splice(j,1);
						}						
					}
				}
				
				// Add to show array
				if (!xNullclinePosis[k].status){
					xNullclineShow.push(xNullclinePosis[k]);
				}
				
				// Remove the current point, since a higher resolution one has been added
				xNullclinePosis.splice(k,1);	
			
		}
	}
	if (yNullclinePosis.length < maxNullclineArraySize){
		//for (let k = 0; k < numToAdd; k++){
		for (let k = numToAdd; k >= 0; k--){
				/*
			yNullclinePosis[k].determine();
			if (!yNullclinePosis[k].status){
				yNullclineShow.push(yNullclinePosis[k]);
			}
			*/
				let newPoints = yNullclinePosis[k].makeSubPoints();
				for (let nP = 0;nP < newPoints.length;nP++){
					newPoints[nP].determine();
					yNullclinePosis.push(newPoints[nP]);
				}
				
				// Check if the current position is in "Show"-array and remove it if it is
				for (let j = yNullclineShow.length-1; j >= 0; j--){
					if (yNullclineShow[j].pos.x == yNullclinePosis[k].pos.x){
						if (yNullclineShow[j].pos.y == yNullclinePosis[k].pos.y){
							yNullclineShow.splice(j,1);
						}						
					}
				}
				
				// Add to show array
				if (!yNullclinePosis[k].statusY){
					yNullclineShow.push(yNullclinePosis[k]);
				}
				
				// Remove the current point, since a higher resolution one has been added
				yNullclinePosis.splice(k,1);	
			
		}
	}

/*
					if (!newPoints[nP].statusY){
						yNullclineShow.push(newPoints[nP]);
					}
*/

/*
	xNullclineShow = [];
	
	for (let k = 0; k < xNullclinePosis.length; k++){
		
		if (!xNullclinePosis[k].status){
			xNullclineShow.push(xNullclinePosis[k]);
		}
	}
	*/
	/*
	yNullclineShow = [];
	for (let k = 0; k < yNullclinePosis.length; k++){
		
		if (!yNullclinePosis[k].statusY){
			yNullclineShow.push(yNullclinePosis[k]);
		}
	}
	
	*/
}

function checkForEquilibria(){
	equis = [];
	for (let k = 0; k < xNullclineShow.length; k++){ 
		let curX = xNullclineShow[k].pos;
		for (let j = 0; j < yNullclineShow.length; j++){ 
			let curY = yNullclineShow[j].pos;
			if ((curX.x == curY.x) && (curX.y == curY.y) ){
				equis.push(createVector(curX.x,curY.y));
			}
		}
	}
}

function makeInitialCalculations(){
	
	// Calculate the nullclines
	if (showNullclines){
		
		// -------- New grid-based nullcline implementation --------
		xNullclinePosis = [];
		yNullclinePosis = [];
		
		// First construct the first four points
		let axesWidth= fieldWidth*scalingFactor;
		let minX = -axesWidth;
		let maxX = axesWidth;
		let minY = -axesWidth;
		let maxY = axesWidth;
		
		// I SHOULD MAKE AN OBJECT! THAT WOULD MAKE THINGS SMARTER
		// Has to include x pos, y pos, determined boolean 
		
		// First, just make the four corners
		//let newN = new nullclinePoint(minX,minY,0);
		let curWidth = maxX-minX;
		xNullclinePosis.push(new nullclinePoint(minX,minY,false,curWidth))
		xNullclinePosis.push(new nullclinePoint(minX,maxY,false,curWidth))
		xNullclinePosis.push(new nullclinePoint(maxX,minY,false,curWidth))
		xNullclinePosis.push(new nullclinePoint(maxX,maxY,false,curWidth))
		
		yNullclinePosis.push(new nullclinePoint(minX,minY,false,curWidth))
		yNullclinePosis.push(new nullclinePoint(minX,maxY,false,curWidth))
		yNullclinePosis.push(new nullclinePoint(maxX,minY,false,curWidth))
		yNullclinePosis.push(new nullclinePoint(maxX,maxY,false,curWidth))
		
		let curLength  = xNullclinePosis.length;
		let curLengthY = yNullclinePosis.length;
		 
		/*
		//for (let k = 0; k < curLength;k++){
		for (let k = curLength-1; k >= 0; k--){
			// Determine the current points
			//xNullclinePosis[k].determine();
			
			let newPoints = xNullclinePosis[k].makeSubPoints();
			
			for (let nP = 0;nP < newPoints.length;nP++){
				xNullclinePosis.push(newPoints[nP]);
			}	
			// Remove the current point, since a higher resolution one has been added
			xNullclinePosis.splice(k,1);
		}
		*/
		
		
		// Do a couple of iterations
		for (let numIter = 0; numIter < 4; numIter++){
			// Get the length of the array
			curLength = xNullclinePosis.length;
			for (let k = curLength-1; k >= 0; k--){
				let newPoints = xNullclinePosis[k].makeSubPoints();
				for (let nP = 0;nP < newPoints.length;nP++){
					xNullclinePosis.push(newPoints[nP]);
				}
				// Remove the current point, since a higher resolution one has been added
				xNullclinePosis.splice(k,1);	
			}
		}
		for (let numIter = 0; numIter < 3; numIter++){
			// Get the length of the array
			curLengthY = yNullclinePosis.length;
			for (let k = curLengthY-1; k >= 0; k--){
				let newPoints = yNullclinePosis[k].makeSubPoints();
				for (let nP = 0;nP < newPoints.length;nP++){
					yNullclinePosis.push(newPoints[nP]);
				}
				// Remove the current point, since a higher resolution one has been added
				yNullclinePosis.splice(k,1);	
			}
		}
		
		/*
		// Remove if the points are outside the screen
		curLength = xNullclinePosis.length;
		for (let k = curLength-1; k >= 0; k--){
			if (xNullclinePosis[k].x < minX){
				console.log('asdf')
				xNullclinePosis.splice(k,1);
			}
		} 
		*/
			//curLength = xNullclinePosis.length;
			//for (let k = 0; k < curLength;k++){
				/*
			for (let k = curLength-1; k >= 0; k--){
				// Determine the current points
				xNullclinePosis[k].determine();
			}*/
			
		// Make an initial check for equilibria
		xNullclineShow = [];
		yNullclineShow = [];
		
		for (let k = 0; k < xNullclinePosis.length; k++){
			
			xNullclinePosis[k].determine();
			if (!xNullclinePosis[k].status){
				xNullclineShow.push(xNullclinePosis[k]);
			}
		}
		for (let k = 0; k < yNullclinePosis.length; k++){
			
			yNullclinePosis[k].determine();
			if (!yNullclinePosis[k].statusY){
				yNullclineShow.push(yNullclinePosis[k]);
			}
		}
		
		equis =[];
		//checkForEquilibria()
		

		
				/*
				// Remove the determined ones
				if (xNullclinePosis[k].status == true){
					xNullclinePosis.splice(k,1);
				}
				*/
		/*
		curLength = xNullclinePosis.length;
		//for (let k = 0; k < curLength;k++){
		for (let k = curLength-1; k >= 0; k--){
			// Determine the current points
			xNullclinePosis[k].determine();
			
			// Remove the determined ones
			if (xNullclinePosis[k].status == true){
				xNullclinePosis.splice(k,1);
			}
			
		}
		*/
		
		// --------
		
		/*
		xSignChange =[];
		ySignChange =[];
		dxPosi =[];
		dyPosi =[];
		
		[xSignChange,ySignChange] = calcNullclines(nullClinesResolution);
		nullPos = xSignChange;
		for (let k = 0; k < ySignChange.length;k++){
			dxPosi.push(1*(ySignChange[k].x>0));
			dyPosi.push(1*(ySignChange[k].y>0));
			//dxPosi.push(math.sign(ySignChange[k].x));
			//dyPosi.push(math.sign(ySignChange[k].y));
		}
		*/
	//[xSignChange,ySignChange] =  calcNullclines(nullClinesResolution);
		/*
		calcNullclinesThread().then(function(response){
			console.log('Done')
			[xSignChange,ySignChange] = response;
		});
		*/
		/*
		promiseTest.then(value=> {
			console.log('success')
			console.log(value);
			[outPos,outDiff] = value;
			xSignChange.push(outPos);
			ySignChange.push(outDiff);
		}).catch(err => {
			console.log(err);
		})
		*/
		
		
		//calcNullAll()
		//.then(calcNullMedium())
		
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
	//if (showDirField){
		// Make the directional field
		makeDirField(curDirFieldRes)
	//}
}


/*
function worker(){
	self.addEventListener('message', function(e){
		[xSignChange,ySignChange] = calcNullclines(e);
	}
}
*/

/*
async function calcNullAll(){
	await calcNullLow();
//	await sleep(500);
	await new Promise(r => setTimeout(r, 2000));
	await calcNullMedium();
	await new Promise(r => setTimeout(r, 2000));
	//await sleep(500);
	await calcNullHigh();
	await new Promise(r => setTimeout(r, 2000));
	//await sleep(500);
	await calcNullUltraHigh();

}

function addNull(resStep){
	
	toAddX = [];
	toAddY = [];
	
	if (resStep == 1){
		axesWidth= fieldWidth*scalingFactor;
		minX = -axesWidth;
		maxX = axesWidth;
		minY = -axesWidth;
		maxY = axesWidth;
		
		toAddX = [minX,minX,maxX,maxX];
		toAddY = [minY,maxY,minY,maxY];
		
		for (let k = 0; k < array.length; k = k+1){
			
		}
	}
	
	
}

function calcNullLow(){
	[xSignChange,ySignChange] = calcNullclines(10);
}
function calcNullMedium(){
	[xSignChange,ySignChange] = calcNullclines(25);
}
function calcNullHigh(){
	[xSignChange,ySignChange] = calcNullclines(50);
}
function calcNullUltraHigh(){
	[xSignChange,ySignChange] = calcNullclines(100);
}

*/

/*
function calcNullclinesThread(){
	
//	for (let k =10; k < 50 ; k = k+10){
//		[xSignChange,ySignChange] =  calcNullclines(k);
//	}
	
	//[xSignChange,ySignChange] =  calcNullclines(10);
	[asdf,qwer] =  calcNullclines(50);
	//.then(calcNullclines(20));
	return [asdf,qwer];
}
*/
function getDiffAt(array){
	
	toReturn = [];
	for (let k = 0; k < array.length; k = k+1){
		curPos = array[k];
		toReturn.push(diffEq(curPos));
	}
	return toReturn
}

function calcNullclines(nullclineRes){
	axesWidth= fieldWidth*scalingFactor;
	//minX = -axesWidth+0.001;
	minX = -axesWidth;
	maxX = axesWidth;
	//minY = -axesWidth+0.001;
	minY = -axesWidth;
	maxY = axesWidth;
	
	//let curPos = createVector(minX,minY);
	//let curDiff = diffEq(createVector(minX,minY));
	
	let nX = minX;
	let nY = minY;	
	
	let prevX = nX;
	let prevY = nY;
	
	let dX = (maxX-minX)/nullclineRes;
	let dY = (maxY-minY)/nullclineRes;
	
	
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

class equilibriumFinder {
	constructor(vec){
		this.pos = vec;
		this.jumpSize = 0.1;
	}
	restartPos(){
		let axesWidth= fieldWidth*scalingFactor;
		let minX = -axesWidth;
		let maxX = axesWidth;
		let minY = -axesWidth;
		let maxY = axesWidth;
		this.pos = createVector(random(minX,maxX),random(minY,maxY));
	}
	updateEquations(){
		if (this.varToUse == 'x'){
			this.equation = curXfuncStr;
			this.equationXDiff = curXfuncStrXDiff;
			this.equationYDiff = curXfuncStrYDiff;
		} else {
			this.equation = curYfuncStr;
			this.equationXDiff = curYfuncStrXDiff;
			this.equationYDiff = curYfuncStrYDiff;				
		}
	}
	stepInXdir(){
		// Make one Newton-Raphson step toward x-nullcline
		let curX = this.pos.x;
		let curY = this.pos.y;
		let diffX = curXfuncStr.evaluate({x:this.pos.x,y:this.pos.y});
		let diffXdiffX = curXfuncStrXDiff.evaluate({x:this.pos.x,y:this.pos.y});
		let diffXdiffY = curXfuncStrYDiff.evaluate({x:this.pos.x,y:this.pos.y}); 
		
		
		this.pos.x = curX - this.jumpSize*((diffX)/(diffXdiffX));
		this.pos.y = curY - this.jumpSize*((diffX)/(diffXdiffY));
	}
	stepInYdir(){
		// Make one Newton-Raphson step toward y-nullcline
		let curX = this.pos.x;
		let curY = this.pos.y;
		let diffX = curYfuncStr.evaluate({x:this.pos.x,y:this.pos.y});
		let diffXdiffX = curYfuncStrXDiff.evaluate({x:this.pos.x,y:this.pos.y});
		let diffXdiffY = curYfuncStrYDiff.evaluate({x:this.pos.x,y:this.pos.y}); 
		
		
		this.pos.x = curX - this.jumpSize*((diffX)/(diffXdiffX));
		this.pos.y = curY - this.jumpSize*((diffX)/(diffXdiffY));
	}
	
	update(){
		this.stepInXdir();
		this.stepInXdir();
		this.stepInXdir();
		this.stepInXdir();
		
		this.stepInYdir();
		this.stepInYdir();
		this.stepInYdir();
		this.stepInYdir();
		
		this.numIter = this.numIter+1;
	}
	
	display(){
		let thisPixelVec = coordinateToPixel(this.pos);
		
		fill(150)
		//stroke(150,10)
		noStroke();
		 
			circle(thisPixelVec.x,thisPixelVec.y,10);
			//rect(thisPixelVec.x,thisPixelVec.y,this.size,this.size);
	}
	
}

class newtonWalker {
	constructor(vec,varToUse){
		this.pos = vec;
		this.numIter = 0;
		this.varToUse = varToUse;
		this.color = color(155);
		this.alpha = newtownWalkerOpacity;
		this.size = 5;
		this.type = 'normal';
		
	}
	updateEquations(){
		if (this.varToUse == 'x'){
			this.equation = curXfuncStr;
			this.equationXDiff = curXfuncStrXDiff;
			this.equationYDiff = curXfuncStrYDiff;
			if (this.type == 'normal'){
				this.color = xNullclineColor;
			}
		} else {
			this.equation = curYfuncStr;
			this.equationXDiff = curYfuncStrXDiff;
			this.equationYDiff = curYfuncStrYDiff;	
			if (this.type == 'normal'){
				this.color = yNullclineColor;
			}
			
		}
	}
	
	restart(){
		let axesWidth= fieldWidth*scalingFactor;
		let minX = -axesWidth;
		let maxX = axesWidth;
		let minY = -axesWidth;
		let maxY = axesWidth;
		this.pos = createVector(random(minX,maxX),random(minY,maxY));
		this.numIter = 0;

		// Change the nullcline to show
		if (random() < 0.5){
			this.varToUse = 'x';
		} else {
			this.varToUse = 'y';
		}		
	}
	
	update(){
		
		if (isNaN(this.pos.x)) {
			this.restart();
		}
		
		this.updateEquations();
		// Make one newton-raphson step
		let curX = this.pos.x;
		let curY = this.pos.y;
		let diff = this.equation.evaluate({x:this.pos.x,y:this.pos.y});
		let diffXdiff = this.equationXDiff.evaluate({x:this.pos.x,y:this.pos.y});
		let diffYdiff = this.equationYDiff.evaluate({x:this.pos.x,y:this.pos.y});
		//let newX = curX - ((diff)/(diffXdiff));
		//let newY = curY - ((diff)/(diffYdiff));
		
		let jumpSize = 0.05;		
		if (this.type == 'equi'){
			//jumpSize = 0.01;
			jumpSize = 0.75*random();
		}
		
		let newX = curX - jumpSize*((diff)/(diffXdiff));
		let newY = curY - jumpSize*((diff)/(diffYdiff));
		
		
		/*
		if (this.type == 'equi'){
			if (newX-curX < 0.000000001){
				if (newY-curY < 0.000000001){
					let equiPos = createVector(newX,newY);
					equis.push(equiPos);
				}
			}
		}
		*/
		
		this.pos.x = newX+ 0.01*(random()-0.5);
		
		
		//this.pos.y = this.pos.y + 0.01*(random()-0.5);
		this.pos.y = newY+ 0.01	*(random()-0.5);
		this.numIter = this.numIter+1;
		
		
		// Restart with a random rate
		if (random() < 0.01){	
			this.restart();
		}
		
		// If there has been enough iterations, add the position to permanent list
		if (this.numIter > 30){
			if (this.varToUse == 'x'){
				if (permWalkerX.length < maxPermWalkLength){
					permWalkerX.push(this.pos.copy());
				}
			} else {
				if (permWalkerY.length < maxPermWalkLength){
				permWalkerY.push(this.pos.copy());
				}
			}
		}
	}
	
	display(){
		let curAlpha = 0.1*(this.alpha * this.numIter)/20;
		
		let thisPixelVec = coordinateToPixel(this.pos);
		
		//fill(150,150)
		//stroke(150,10)
		fill([this.color[0],this.color[1],this.color[2],curAlpha]);
		noStroke();
		//stroke([this.color[0],this.color[1],this.color[2],this.alpha]);
		//stroke(this.color,this.alpha);
		 
		// Only show if more than 3 iterations of newton-raphson has been made
		if (this.numIter > 20){
			//circle(thisPixelVec.x,thisPixelVec.y,2);
			rect(thisPixelVec.x,thisPixelVec.y,this.size,this.size);
		}
		
	}
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