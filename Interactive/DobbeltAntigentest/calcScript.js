// --- Initialize variables ---
// - Inputs -
let prae;
let test;
let sens;
let spec;

let prae_scaled;

// - Calculated variables -
let pProb;
let pPV;
let ppProb;
let ppPV;
let pnProb;
let pnPV;
let pnPV_prae;

// - Size of groups -
let posTest;
let opspor;
let sandPos;
let stopSpor;
let isoVent;
let senSpor;
let ratioDelay;

// --- Get reference to html-things --
let test_slider = document.getElementById('test_slider');
let prae_slider = document.getElementById('prae_slider');
let sens_slider = document.getElementById('sens_slider');
let spec_slider = document.getElementById('spec_slider');
 
let test_label = document.getElementById('test_label');
let prae_label = document.getElementById('prae_label');
let sens_label = document.getElementById('sens_label');
let spec_label = document.getElementById('spec_label');

// Function for getting the values from the sliders
function getAllValues(){
    prae = prae_slider.value;
    sens = sens_slider.value;
    spec = spec_slider.value;
    test = test_slider.value;
}

// Function for setting the labels below the sliders
function updateAllLabels(){
    prae_label.innerHTML ='Prævalens i testpopulation: ' + (prae/100) + '%';
    test_label.innerHTML ='Antal Tests: '+ test;
    let sensToShow = (sens*10000)/100; // To round off at two decimals
    let specToShow = (spec*10000)/100; // To round off at two decimals
    sens_label.innerHTML ='Sensitivitet: '+ (sensToShow) + '%';
    spec_label.innerHTML ='Specificitet: '+ specToShow + '%';
    
}

// --- onchange functions for sliders ---

test_slider.onchange = function(){
    // Get value
    test = test_slider.value;

    // Update everything
    updateAll();
}

prae_slider.onchange = function(){
    // Get value
    prae = prae_slider.value;

    // Update everything
    updateAll();
}

sens_slider.onchange = function(){
    // Get value
    sens = sens_slider.value;

    // Update everything
    updateAll();
}

spec_slider.onchange = function(){
    // Get value
    spec = spec_slider.value;

    // Update everything
    updateAll();
}

// Function for doing all calculations
function updateAll(){    
    
    // Get all values, just to be sure
    getAllValues();

    prae_scaled = prae / 10000;

    pProb = prae_scaled * sens + ((1-prae_scaled)*(1-spec));
    pPV = prae_scaled * sens / pProb;
    ppProb = prae_scaled * sens * sens + ((1-prae_scaled) * (1-spec)*(1-spec));
    ppPV = prae_scaled * sens * sens / ppProb;
    pnProb = prae_scaled * sens * (1-sens) + ((1-prae_scaled)*spec*(1-spec));
    pnPV = prae_scaled * sens * (1-sens) / pnProb;
    pnPV_prae = pnPV/prae_scaled;

    posTest = pProb * test;
    opspor = ppProb * test;
    sandPos = ppPV * opspor;
    stopSpor = opspor - sandPos;
    isoVent = pnProb * test;
    senSpor = isoVent * pnPV;
    // If divide by zero, just use 0
    if (isNaN(senSpor)){
        senSpor = 0;
    }

    ratioDelay = senSpor / (sandPos + senSpor);

    // Update all labels
    updateAllLabels();
}

// Run updateAll initialy
updateAll();

// --- Visual flowchart ---
// - Initialize variables for colors -
let clrBackground;
let clrBox;
let clrBoxStroke;
let clrText;
let clrAg1_P;
let clrAg1_N;
let clrAg2_P;
let clrAg2_N;
let clrPCR_P;
let clrPCR_N;
let clrIso;
let clrIsoStroke;
let clrSpor;
let clrSporStroke;

// Box sizes
let boxH = 100;
let boxW = 150;

// Sizes for plus and minus symbol 
let conSize = 5;
let symbolSize = 6;
let circSize = symbolSize*4; 
let symbolWeight = 2.5;

// Define boxes 
class GroupBox {
    constructor(x,y,type){
        this.x = x;
        this.y = y;
        this.type = type;
    }

    draw(){
        if (this.type == 'ini'){
            fill(clrBox);   
            stroke(clrBoxStroke); 
            this.label = test
            this.label2 = 'Personer testes med \n antigentest\n'
        } else if (this.type == 'p'){
            fill(clrBox);  
            stroke(clrBoxStroke);  
            this.label = round(posTest)
            this.label2 = 'Ag+\n Testes med \nny antigentest'
        } else if (this.type == 'pp'){
            fill(clrBox);    
            stroke(clrBoxStroke);
            this.label = round(opspor)
            this.label2 = 'Ag+ Ag+\nSmittesporing\nstartes omgående'
        } else if (this.type == 'ppP'){
            fill(clrBox);  
            stroke(clrBoxStroke);  
            this.label = round(sandPos)
            this.label2 = 'PCR+\nSmitteopsporing og \nisolation forsættes'
        } else if (this.type == 'pn'){
            fill(clrBox);  
            stroke(clrBoxStroke);  
            this.label = round(isoVent)
            this.label2 = 'Ag+ Ag-\n Isoleres og afventer \nopfølgende PCR-test'
        } else if (this.type == 'pnP'){
            fill(clrBox);    
            stroke(clrBoxStroke);
            this.label = round(senSpor)
            this.label2 = 'Ag+ Ag- PCR+\n24 timer forsinket\nsmitteopsporing'
        } else if (this.type == 'n'){
            fill(255);
            noStroke();
            this.label = round(test-posTest)
            this.label2 = 'Negative svar\n \n'
        } else if (this.type == 'pnN'){
            fill(255);
            noStroke();
            this.label = round(isoVent-senSpor)
            this.label2 = 'Ag+ Ag- PCR-\n  Kan bryde isolationen \n'
        } else if (this.type == 'ppN'){
            fill(255);
            noStroke();
            this.label = round(opspor-sandPos)
            this.label2 = 'PCR-negative svar\n  Smitteopsporing \nafbrydes'
        } else if (this.type == 'noShow'){
            noFill();
            noStroke();
            this.label = ''
            this.label2 = ''
        }
        
        rect(this.x,this.y,boxW,boxH);
        fill(clrText);
        noStroke();
        textStyle(BOLD);
        textSize(18)
        text(this.label,this.x+boxW/2,this.y+boxH/2-boxH/4)
        textStyle(NORMAL);
        textSize(14)
        text(this.label2,this.x+boxW/2,this.y+boxH/2 + boxH/6)
    }
}

// Define arrow-connectors
class Connector {
    constructor(box1,box2,res,ori,clr,typ){
        this.box1 = box1;
        this.box2 = box2;
        this.res = res; // Result of test
        this.ori = ori; // Orientation
        this.clr = clr; // Color
        this.typ = typ; // Type of test (For writing delay)
    }

    draw(){
        
        stroke(this.clr);
        strokeWeight(conSize);

        // If the orientation is downwards
        if (this.ori == 'd'){
            // Draw arrow
            line(this.box1.x+boxW/2,this.box1.y+boxH,this.box2.x+boxW/2,this.box2.y);
            line(this.box2.x+boxW/2,this.box2.y,this.box2.x+boxW/2-conSize,this.box2.y-conSize);
            line(this.box2.x+boxW/2,this.box2.y,this.box2.x+boxW/2+conSize,this.box2.y-conSize);

            // Show test a symbol for result
            if (this.res == 'p'){
                push()
                translate(this.box1.x + boxW/2, this.box1.y + boxH); // Bottom, start of arrow

                // Draw circle 
                translate(symbolSize,symbolSize); // Offset
                strokeWeight(symbolWeight/2);
                noFill();
                circle(circSize/2,circSize/2,circSize)

                // Draw plus-sign
                translate(symbolSize*2,symbolSize*2); // Offset
                strokeWeight(symbolWeight/2);
                line(-symbolSize,0,symbolSize,0);
                line(0,-symbolSize,0,symbolSize);

                pop();

                // For the PCR-test, write delay text
                if (this.typ == 'PCR'){
                    push()
                    noStroke()
                    textSize(10);
                    textStyle(ITALIC)
                    textAlign(LEFT)
                    translate(this.box2.x + boxW/2, this.box2.y); // Top, end of arrow
                    translate(symbolSize*1,-symbolSize*1.1)
                    text('24 timer',0,0)
                    pop();
                }
            } 
        } else if (this.ori == 'r'){ // If the direction of the arrow is to the right     
            // Draw arrow       
            line(this.box1.x+boxW,this.box1.y+boxH/2,this.box2.x,this.box2.y+boxH/2);
            line(this.box2.x,this.box2.y+boxH/2,this.box2.x-conSize,this.box2.y+boxH/2-conSize);
            line(this.box2.x,this.box2.y+boxH/2,this.box2.x-conSize,this.box2.y+boxH/2+conSize);
            // Show test result
            if (this.res == 'n'){
                push()
                translate(this.box1.x + boxW, this.box1.y + boxH/2); // Right hand side, start of arrow

                // Draw circle
                translate(symbolSize,-symbolSize-circSize); // Offset
                strokeWeight(symbolWeight/2);
                noFill();
                circle(circSize/2,circSize/2,circSize)

                // Draw minus arrow
                translate(symbolSize*2,-symbolSize*2+circSize); // Offset
                strokeWeight(symbolWeight);
                line(-symbolSize,0,symbolSize,0);
                // point(0,-symbolSize);
                // point(0,symbolSize);
                pop();

                // For the PCR-test, write delay text
                if (this.typ == 'PCR'){
                    push();
                    noStroke()
                    textSize(10);
                    textStyle(ITALIC)
                    textAlign(RIGHT)
                    translate(this.box2.x,this.box2.y + boxH/2)
                    translate(-symbolSize*2,symbolSize*2)
                    text('24 timer',0,0)
                    pop();
                }
            } 
        }
    }
}

// - Initialize placement variables -
let curLeft = 50;
let curTop = 50;
let curH = boxH*1.6;
let curW = boxW*1.4;

let allp5Objects = [];

// - Main p5 setup -
function setup() {
    var curCanves = createCanvas(650,  520);
    curCanves.parent("p5Div");
    
    // Set default textstyle
    textAlign(CENTER,CENTER);
    textSize(14);
    
    // Set colors
    clrBackground = color(255);
    clrBox = color(250,230,230);
    clrBoxStroke = color(230,140,140)
    clrText = color(0);
    clrAg1_P = color(150,0,0);
    clrAg1_N = color(20,120,0);
    clrAg2_P = clrAg1_P;
    clrAg2_N = clrAg1_N;
    clrPCR_P = color(100,0,255);
    clrPCR_N = color(100,150,255);
    clrIso = color(200,220,230);
    clrIsoStroke = color(180,200,200);
    clrSpor = color(220,220,255,200);
    clrSporStroke = color(180,180,200,220);


    // Define boxes and position of them
    boxTest = new GroupBox(curLeft,curTop,'ini');
    boxPos1 = new GroupBox(curLeft,curTop + curH,'p');
    boxPos2 = new GroupBox(curLeft,curTop + curH * 2,'pp');
    boxIsol = new GroupBox(curLeft + curW,curTop + curH,'pn');
    boxLate  = new GroupBox(curLeft + curW,curTop + curH * 2,'pnP');

    // Add to array to be drawn
    allp5Objects.push(boxTest);
    allp5Objects.push(boxPos1);
    allp5Objects.push(boxPos2);
    allp5Objects.push(boxIsol);
    allp5Objects.push(boxLate);

    // Define invisible boxes
    boxNeg1 = new GroupBox(curLeft + curW,curTop,'n');
    boxNeg2 = new GroupBox(curLeft + curW * 2,curTop + curH * 1,'pnN');

    // Add to array to be drawn
    allp5Objects.push(boxNeg1);
    allp5Objects.push(boxNeg2);

    // Define connectors
    let conP1 = new Connector(boxTest,boxPos1,'p','d',clrAg1_P,'AG');
    let conP2 = new Connector(boxPos1,boxPos2,'p','d',clrAg2_P,'AG');
    let conLate=new Connector(boxIsol,boxLate,'p','d',clrPCR_P,'PCR');
    let conN1 = new Connector(boxTest,boxNeg1,'n','r',clrAg1_N,'AG');
    let conN2 = new Connector(boxPos1,boxIsol,'n','r',clrAg2_N,'AG');
    let conN3 = new Connector(boxIsol,boxNeg2,'n','r',clrPCR_N,'PCR');

    // Add to array to be drawn
    allp5Objects.push(conP1);
    allp5Objects.push(conP2);
    allp5Objects.push(conLate);
    allp5Objects.push(conN1);
    allp5Objects.push(conN2);
    allp5Objects.push(conN3);

}

// - Main p5 draw function -
function draw() {

    // Draw the background
    background(clrBackground);

    // Set default textstyle
    textAlign(CENTER,CENTER);
    textSize(14);
    
    // Draw isolation box
    fill(clrIso);
    stroke(clrIsoStroke);
    rect(curLeft-boxW*0.3,curTop+curH*0.9,boxW*0.35+curW*1.9,curH*1.9)
    
    // Write isolation text
    push();
    translate(curLeft-boxW*0.2,curTop+curH*(0.9+0.4));
    fill(clrText);
    stroke(clrText);
    strokeWeight(0.25);
    textStyle(BOLD)
    rotate(-PI/2);
    text('Isolation',0,0);
    pop();

    // Draw contact-tracing box
    fill(clrSpor);
    stroke(clrSporStroke);
    rect(curLeft-boxW*0.225,curTop+curH*1.9,boxW*0.2+curW*1.9,curH*0.82)

    // Write smittesporing text
    push();    
    translate(curLeft-boxW*0.125,curTop+curH*2.3);
    fill(clrText);
    stroke(clrText);
    strokeWeight(0.25);
    textStyle(BOLD)
    rotate(-PI/2);
    text('Smitteopsporing',0,0);
    pop();

    // Draw all objects
    for (let k = 0; k < allp5Objects.length; k++) {
        allp5Objects[k].draw();        
    }

    // -- Legend --
    let lgdW = boxW/3;
    let lgdH = boxH/3;
    let lgdTop = height - lgdH * 5.2;
    let lgdLeft = width - lgdW * 2;
    let lgdMargin = 20;

    textAlign(LEFT,BOTTOM);
    textSize(12);

    push()
    // Top label
    translate(lgdLeft,lgdTop);
    fill(230);
    stroke(220);
    rect(-lgdMargin,-lgdMargin,lgdW+lgdMargin*2,lgdH*4 + lgdMargin*2);
    noStroke();
    fill(0);
    textStyle(BOLD);
    text('Forklaring',-2,0);
    
    // Normal, not bold, text
    textStyle(NORMAL);
    
    // Ag positve
    translate(0,lgdH);
    fill(clrAg1_P);
    stroke(clrAg1_P);
    line(0,0,lgdW,0);
    line(lgdW,0,lgdW-conSize,conSize); 
    line(lgdW,0,lgdW-conSize,-conSize); 
    noStroke();
    fill(0);
    text('Ag+',0,-5);
    
    // Ag negative
    translate(0,lgdH);
    fill(clrAg1_N);
    stroke(clrAg1_N);
    line(0,0,lgdW,0);
    line(lgdW,0,lgdW-conSize,conSize); 
    line(lgdW,0,lgdW-conSize,-conSize); 
    noStroke();
    fill(0);
    text('Ag-',0,-5);
    
    // PCR positive
    translate(0,lgdH);
    fill(clrPCR_P);
    stroke(clrPCR_P);
    line(0,0,lgdW,0);
    line(lgdW,0,lgdW-conSize,conSize); 
    line(lgdW,0,lgdW-conSize,-conSize); 
    noStroke();
    fill(0);
    text('PCR+',0,-5);
    
    // PCR negative
    translate(0,lgdH);
    fill(clrPCR_N);
    stroke(clrPCR_N);
    line(0,0,lgdW,0);
    line(lgdW,0,lgdW-conSize,conSize); 
    line(lgdW,0,lgdW-conSize,-conSize); 
    noStroke();
    fill(0);
    text('PCR-',0,-5);

    pop() // - End legend -
}