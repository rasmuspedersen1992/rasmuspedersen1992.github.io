let test;
let inci;
let sens;
let spec;

let inci_scaled;


let pProb;
let pPV;
let ppProb;
let ppPV;
let pnProb;
let pnPV;
let pnPV_inci;

let posTest;
let opspor;
let sandPos;
let stopSpor;
let isoVent;
let senSpor;
let ratioDelay;

let test_slider = document.getElementById('test_slider');
let inci_slider = document.getElementById('inci_slider');
let sens_slider = document.getElementById('sens_slider');
let spec_slider = document.getElementById('spec_slider');
 
let test_label = document.getElementById('test_label');
let inci_label = document.getElementById('inci_label');
let sens_label = document.getElementById('sens_label');
let spec_label = document.getElementById('spec_label');
// let sandPos_label = document.getElementById('sandPos_label');
// let isoVent_label = document.getElementById('isoVent_label');
// let senSpor_label = document.getElementById('senSpor_label');


function getAllValues(){
    inci = inci_slider.value;
    sens = sens_slider.value;
    spec = spec_slider.value;
    test = test_slider.value;
}

function updateAllLabels(){
    test_label.innerHTML ='Antal Tests: '+ test;
    inci_label.innerHTML ='Incidens:' + (inci/10000);
    sens_label.innerHTML ='Sensitivitet: '+ sens;
    spec_label.innerHTML ='Specificitet: '+ spec;
    // sandPos_label.innerHTML = Math.round(sandPos);
    // isoVent_label.innerHTML = Math.round(isoVent);
    // senSpor_label.innerHTML = Math.round(senSpor);
    // sandPos_label.innerHTML = 'Sande positive fundet og opsporet: '+Math.round(sandPos);
    // isoVent_label.innerHTML = 'Personer i isolation 24 timer: '+Math.round(isoVent);
    // senSpor_label.innerHTML = 'Sent opsporet: '+ Math.round(senSpor);
}

test_slider.onchange = function(){
    // Get value
    test = test_slider.value;

    // Update label
    test_label.innerHTML ='Antal Tests: ' + test;

    // Update display
    updateAll();
}


inci_slider.onchange = function(){
    // Get value
    inci = inci_slider.value;

    // Update label
    inci_label.innerHTML ='Incidens: ' + (inci/10000);

    // Update display
    updateAll();
}

sens_slider.onchange = function(){
    // Get value
    sens = sens_slider.value;

    // Update label
    sens_label.innerHTML ='Sensitivitet: ' + sens;

    // Update display
    updateAll();
}

spec_slider.onchange = function(){
    // Get value
    spec = spec_slider.value;

    // Update label
    spec_label.innerHTML ='Specificitet: ' + spec;

    // Update display
    updateAll();
}

function updateAll(){
// function calcAll(){
    
    inci_scaled = inci / 10000;

    pProb = inci_scaled * sens + ((1-inci_scaled)*(1-spec));
    pPV = inci_scaled * sens / pProb;
    ppProb = inci_scaled * sens * sens + ((1-inci_scaled) * (1-spec)*(1-spec));
    ppPV = inci_scaled * sens * sens / ppProb;
    pnProb = inci_scaled * sens * (1-sens) + ((1-inci_scaled)*spec*(1-spec));
    pnPV = inci_scaled * sens * (1-sens) / pnProb;
    pnPV_inci = pnPV/inci_scaled;

    posTest = pProb * test;
    opspor = ppProb * test;
    sandPos = ppPV * opspor;
    stopSpor = opspor - sandPos;
    isoVent = pnProb * test;
    senSpor = isoVent * pnPV;
    ratioDelay = senSpor / (sandPos + senSpor);

    // console.log(pProb);
    // console.log(pPV);
    // console.log(ppProb);
    // console.log(ppPV);
    // console.log(pnProb);
    // console.log(pnPV);
    // console.log(pnPV_inci);

    // console.log(posTest);
    // console.log(opspor);
    // console.log(sandPos);
    // console.log(stopSpor);
    // console.log(isoVent);
    // console.log(senSpor);
    // console.log(ratioDelay);

    
    getAllValues();
    updateAllLabels();


}



getAllValues();
updateAll();
updateAllLabels();

// Visual flowchart
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

let boxH = 80;
let boxW = 200;

let conSize = 3;
let symbolSize = 8;

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
                this.label = test+' personer testes \nmed antigen-test'
            } else if (this.type == 'p'){
                fill(clrBox);  
                stroke(clrBoxStroke);  
                this.label = round(posTest)+' testes positive \nTestes med ny antigen-test'
            } else if (this.type == 'pp'){
                fill(clrBox);    
                stroke(clrBoxStroke);
                this.label = round(opspor)+' testes positive igen \nSmitteopsporing påbegyndes \n Opfølgende PCR-test'
            } else if (this.type == 'ppP'){
                fill(clrBox);  
                stroke(clrBoxStroke);  
                this.label = round(sandPos)+' er PCR-positive'
            } else if (this.type == 'pn'){
                fill(clrBox);  
                stroke(clrBoxStroke);  
                this.label = round(isoVent)+' isoleres \nOpfølgende PCR-test'
            } else if (this.type == 'pnP'){
                fill(clrBox);    
                stroke(clrBoxStroke);
                this.label = round(senSpor)+' er PCR-positive \nSmitteopsporing påbegyndes, \n dog forsinket af PCR'
            } else if (this.type == 'n'){
                fill(255);
                noStroke();
                this.label = round(test-posTest)+' tester negative'
            } else if (this.type == 'pnN'){
                fill(255);
                noStroke();
                this.label = round(isoVent-senSpor)+' tester PCR-negative \n og kan bryde isolationen'
            } else if (this.type == 'ppN'){
                fill(255);
                noStroke();
                this.label = round(opspor-sandPos)+' tester PCR-negative \n Smitteopsporing skal afbrydes'
            }

            rect(this.x,this.y,boxW,boxH);
            fill(clrText);
            noStroke();
            text(this.label,this.x+boxW/2,this.y+boxH/2)
    }

    
    // boxPos1 = new GroupBox(curLeft,curTop + curH,'p');
    // boxPos2 = new GroupBox(curLeft,curTop + curH * 2,'pp');
    // boxPos3 = new GroupBox(curLeft,curTop + curH * 3,'ppP');
    // boxIsol = new GroupBox(curLeft + curW,curTop + curH,'pn');
    // boxLate  = new GroupBox(curLeft + curW,curTop + curH * 3,'pnP');
}

class Connector {
    constructor(box1,box2,res,ori,clr){
        this.box1 = box1;
        this.box2 = box2;
        this.res = res; // Result of test
        this.ori = ori; // Orientation
        this.clr = clr; // Color
    }

    draw(){
        // translate(this.box1.x,this.box1.y);
        
        stroke(this.clr);
        strokeWeight(conSize);

        if (this.ori == 'd'){
            line(this.box1.x+boxW/2,this.box1.y+boxH,this.box2.x+boxW/2,this.box2.y);
            line(this.box2.x+boxW/2,this.box2.y,this.box2.x+boxW/2-conSize,this.box2.y-conSize);
            line(this.box2.x+boxW/2,this.box2.y,this.box2.x+boxW/2+conSize,this.box2.y-conSize);
            // Show test result
            if (this.res == 'p'){
                push()
                translate(this.box1.x + boxW/2, this.box1.y + boxH); // Bottom, start of arrow
                translate(symbolSize*2,symbolSize*2); // Offset
                line(-symbolSize,0,symbolSize,0);
                line(0,-symbolSize,0,symbolSize);
                pop();
            } 
        } else if (this.ori == 'r'){
            line(this.box1.x+boxW,this.box1.y+boxH/2,this.box2.x,this.box2.y+boxH/2);
            line(this.box2.x,this.box2.y+boxH/2,this.box2.x-conSize,this.box2.y+boxH/2-conSize);
            line(this.box2.x,this.box2.y+boxH/2,this.box2.x-conSize,this.box2.y+boxH/2+conSize);
            // Show test result
            if (this.res == 'n'){
                push()
                translate(this.box1.x + boxW, this.box1.y + boxH/2); // Right hand side, start of arrow
                translate(symbolSize*2,-symbolSize*2); // Offset
                line(-symbolSize,0,symbolSize,0);
                point(0,-symbolSize);
                point(0,symbolSize);
                
                pop();
            } 
        }

    }
}


function drawConnect(x,y){
    fill(clrBox);
    noStroke();
    rect(x,y,boxW,boxH);
}

// let boxTest;
// let boxPos1;

let curLeft = 25;
let curTop = 50;
let curH = boxH*1.6;
let curW = boxW*1.4;

let allp5Objects = [];

function setup() {
    var curCanves = createCanvas(800, 550);
    curCanves.parent("p5Div");

    clrBackground = color(255);
    clrBox = color(210,210,255);
    clrBoxStroke = color(150,150,255)
    clrText = color(0);
    clrAg1_P = color(150,0,0);
    clrAg1_N = color(20,80,0);
    clrAg2_P = color(150,0,0);
    clrAg2_N = color(20,80,0);
    clrPCR_P = color(150,0,255);
    clrPCR_N = color(100,150,255);

    textAlign(CENTER,CENTER);

    // Define boxes and position of them
    boxTest = new GroupBox(curLeft,curTop,'ini');
    boxPos1 = new GroupBox(curLeft,curTop + curH,'p');
    boxPos2 = new GroupBox(curLeft,curTop + curH * 2,'pp');
    boxPos3 = new GroupBox(curLeft,curTop + curH * 3,'ppP');
    boxIsol = new GroupBox(curLeft + curW,curTop + curH,'pn');
    boxLate  = new GroupBox(curLeft + curW,curTop + curH * 3,'pnP');

    allp5Objects.push(boxTest);
    allp5Objects.push(boxPos1);
    allp5Objects.push(boxPos2);
    allp5Objects.push(boxPos3);
    allp5Objects.push(boxIsol);
    allp5Objects.push(boxLate);

    // Define invisible boxes
    boxNeg1 = new GroupBox(curLeft + curW,curTop,'n');
    boxNeg2 = new GroupBox(curLeft + curW * 2,curTop + curH * 1,'pnN');
    boxNeg3 = new GroupBox(curLeft + curW * 2,curTop + curH * 2,'ppN');

    allp5Objects.push(boxNeg1);
    allp5Objects.push(boxNeg2);
    allp5Objects.push(boxNeg3);

    // Define connector
    let conP1 = new Connector(boxTest,boxPos1,'p','d',clrAg1_P);
    let conP2 = new Connector(boxPos1,boxPos2,'p','d',clrAg2_P);
    let conP3 = new Connector(boxPos2,boxPos3,'p','d',clrPCR_P);
    let conLate=new Connector(boxIsol,boxLate,'p','d',clrPCR_P);
    let conN1 = new Connector(boxTest,boxNeg1,'n','r',clrAg1_N);
    let conN2 = new Connector(boxPos1,boxIsol,'n','r',clrAg2_N);
    let conN3 = new Connector(boxPos2,boxNeg3,'n','r',clrPCR_N);
    let conN4 = new Connector(boxIsol,boxNeg2,'n','r',clrPCR_N);

    allp5Objects.push(conP1);
    allp5Objects.push(conP2);
    allp5Objects.push(conP3);
    allp5Objects.push(conLate);
    allp5Objects.push(conN1);
    allp5Objects.push(conN2);
    allp5Objects.push(conN3);
    allp5Objects.push(conN4);
}

function draw() {


    let clrSpor = color(220);
    let clrSporStroke = color(200);
    fill(clrSpor);
    stroke(clrSporStroke);
    rect(0,curTop+curH*1.9,curLeft/2+curW*1.8,curH*1.8)

    push();
    translate(curLeft/2,curTop+curH*(1.9+0.9));
    fill(clrText);
    stroke(clrText);
    strokeWeight(0.25);
    // noStroke()
    // textStyle(BOLD)
    rotate(-PI/2);
    text('Smitteopsporing',0,0);
    pop();

    for (let k = 0; k < allp5Objects.length; k++) {
        allp5Objects[k].draw();        
    }

    // boxTest.draw();
    // boxPos1.draw();
}



// // Import p5 into the global namespace for easy access to functions
// new p5();


// const p5sketch = ( sketch ) => {

//     let clrBackground = color(255);
//     let clrBox = sketch.color(50,50,150);

//     sketch.drawBox = (x,y) =>{
//         sketch.fill(clrBox)
//         sketch.rect(x,y,80,40)
//     }
  
//     sketch.setup = () =>{
//       sketch.createCanvas(500,500);
//     }
  
//     sketch.draw = () =>{
//       sketch.background(clrBackground);
//       sketch.rect(50,50,50,50);
//       sketch.drawBox(10,10);

//     }
//   }
  
// let p5main = new p5(p5sketch,document.getElementById('p5Div'));
  