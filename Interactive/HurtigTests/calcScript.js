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
    // inci_label.innerHTML ='Incidens: ' + (inci/10000);
    // inci_label.innerHTML ='Prævalens: ' + (inci/100) + '%';
    inci_label.innerHTML ='Prævalens i testgruppe: ' + (inci/100) + '%';
    // inci_label.innerHTML ='Testgruppeprævalens: ' + (inci/100) + '%';
    let sensToShow = (sens*10000)/100
    sens_label.innerHTML ='Sensitivitet: '+ (sensToShow) + '%';
    let specToShow = (spec*10000)/100; // To round off at two decimals
    spec_label.innerHTML ='Specificitet: '+ specToShow + '%';
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

    // // Update label
    // test_label.innerHTML ='Antal Tests: ' + test;

    // Update display
    updateAll();
}


inci_slider.onchange = function(){
    // Get value
    inci = inci_slider.value;

    // // Update label
    // inci_label.innerHTML ='Prævalens: ' + (inci/10000);

    // Update display
    updateAll();
}

sens_slider.onchange = function(){
    // Get value
    sens = sens_slider.value;

    // // Update label
    // sens_label.innerHTML ='Sensitivitet: ' + sens;

    // Update display
    updateAll();
}

spec_slider.onchange = function(){
    // Get value
    spec = spec_slider.value;

    // // Update label
    // spec_label.innerHTML ='Specificitet: ' + spec;

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
    // If divide by zero, just show 0
    if (isNaN(senSpor)){
        senSpor = 0;
    }
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
let clrIso;
let clrIsoStroke;
let clrSpor;
let clrSporStroke;

let boxH = 100;
let boxW = 150;

let conSize = 5;
let symbolSize = 6;
let circSize = symbolSize*4; 
let symbolWeight = 2.5;

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
            // this.label = test+' personer\n testes'
            // this.label2 = 'hvoraf '+round(inci*test/1000)+'\n er smittet'
        } else if (this.type == 'p'){
            fill(clrBox);  
            stroke(clrBoxStroke);  
            this.label = round(posTest)
            // this.label = posTest
            this.label2 = 'Ag+\n Testes med \nny antigen-test'
        } else if (this.type == 'pp'){
            fill(clrBox);    
            stroke(clrBoxStroke);
            this.label = round(opspor)
            // this.label = opspor
            // this.label2 = 'Positive svar\n Smitteopsporing \n Opfølgende PCR-test'
            // this.label2 = 'Positive svar\nEventuelt \nVariantbestemmelse'
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
            this.label = isoVent
            this.label = round(posTest) - round(opspor);
            this.label2 = 'Ag+ Ag-\n Isoleres og afventer \nopfølgende PCR-test'
        } else if (this.type == 'pnP'){
            fill(clrBox);    
            stroke(clrBoxStroke);
            this.label = round(senSpor)
            // this.label = senSpor
            this.label2 = 'Ag+ Ag- PCR+\n24 timer forsinket\nsmitteopsporing'
        } else if (this.type == 'n'){
            fill(255);
            noStroke();
            this.label = round(test-posTest)
            this.label2 = 'Negative svar\n \n'
            // this.label2 = 'hvoraf ' +round(falskNeg)+'\n er falsk negative'
        } else if (this.type == 'pnN'){
            fill(255);
            noStroke();
            // this.label = round(isoVent-senSpor)
            this.label = round(isoVent-senSpor)
            // this.label = isoVent-senSpor
            this.label = round(posTest) - round(opspor) - round(senSpor);
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
        
        // if (this.type == 'ini'){
        //     fill(clrBox);   
        //     stroke(clrBoxStroke); 
        //     this.label = test+'\npersoner'
        //     this.label2 = 'Testes med \n antigentest'
        //     // this.label = test+' personer\n testes'
        //     // this.label2 = 'hvoraf '+round(inci*test/1000)+'\n er smittet'
        // } else if (this.type == 'p'){
        //     fill(clrBox);  
        //     stroke(clrBoxStroke);  
        //     this.label = round(posTest)+'\npositive svar'
        //     this.label2 = 'Testes med \nny antigen-test'
        // } else if (this.type == 'pp'){
        //     fill(clrBox);    
        //     stroke(clrBoxStroke);
        //     this.label = round(opspor)+'\npositive svar'
        //     this.label2 = 'Smitteopsporing \n Opfølgende PCR-test'
        // } else if (this.type == 'ppP'){
        //     fill(clrBox);  
        //     stroke(clrBoxStroke);  
        //     this.label = round(sandPos)+'\n PCR-positive svar'
        //     this.label2 = 'Smitteopsporing og \nisolation forsættes'
        // } else if (this.type == 'pn'){
        //     fill(clrBox);  
        //     stroke(clrBoxStroke);  
        //     this.label = round(isoVent)+'\nnegative svar'
        //     this.label2 = 'Isoleres og afventer \nopfølgende PCR-test'
        // } else if (this.type == 'pnP'){
        //     fill(clrBox);    
        //     stroke(clrBoxStroke);
        //     this.label = round(senSpor)+'\nPCR-positive svar'
        //     this.label2 = 'Smitteopsporing, \n forsinket af PCR'
        // } else if (this.type == 'n'){
        //     fill(255);
        //     noStroke();
        //     this.label = round(test-posTest)+'\nnegative svar'
        //     this.label2 = ''
        //     // this.label2 = 'hvoraf ' +round(falskNeg)+'\n er falsk negative'
        // } else if (this.type == 'pnN'){
        //     fill(255);
        //     noStroke();
        //     this.label = round(isoVent-senSpor)+'\nPCR-negative svar'
        //     this.label2 = ' og kan bryde \nisolationen'
        // } else if (this.type == 'ppN'){
        //     fill(255);
        //     noStroke();
        //     this.label = round(opspor-sandPos)+'\nPCR-negative svar'
        //     this.label2 = ' Smitteopsporing \nafbrydes'
        // }

            // rect(this.x,this.y,boxW,boxH);
            // fill(clrText);
            // noStroke();
            // textStyle(BOLD);
            // textSize(16)
            // text(this.label,this.x+boxW/2,this.y+boxH/2-boxH/4)
            // textStyle(NORMAL);
            // textSize(14)
            // text(this.label2,this.x+boxW/2,this.y+boxH/2 + boxH/6)
    }

    
    // boxPos1 = new GroupBox(curLeft,curTop + curH,'p');
    // boxPos2 = new GroupBox(curLeft,curTop + curH * 2,'pp');
    // boxPos3 = new GroupBox(curLeft,curTop + curH * 3,'ppP');
    // boxIsol = new GroupBox(curLeft + curW,curTop + curH,'pn');
    // boxLate  = new GroupBox(curLeft + curW,curTop + curH * 3,'pnP');
}

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

                translate(symbolSize,symbolSize); // Offset
                strokeWeight(symbolWeight/2);
                noFill();
                circle(circSize/2,circSize/2,circSize)

                translate(symbolSize*2,symbolSize*2); // Offset
                strokeWeight(symbolWeight/2);
                line(-symbolSize,0,symbolSize,0);
                line(0,-symbolSize,0,symbolSize);

                pop();

                if (this.typ == 'PCR'){
                    push()
                    noStroke()
                    // fill(this.clr);
                    textSize(10);
                    textStyle(ITALIC)
                    textAlign(LEFT)
                    translate(this.box2.x + boxW/2, this.box2.y); // Top, end of arrow
                    translate(symbolSize*1,-symbolSize*1.1)
                    text('24 timer',0,0)
                    pop();
                }
                
            } 
        } else if (this.ori == 'r'){
            line(this.box1.x+boxW,this.box1.y+boxH/2,this.box2.x,this.box2.y+boxH/2);
            line(this.box2.x,this.box2.y+boxH/2,this.box2.x-conSize,this.box2.y+boxH/2-conSize);
            line(this.box2.x,this.box2.y+boxH/2,this.box2.x-conSize,this.box2.y+boxH/2+conSize);
            // Show test result
            if (this.res == 'n'){
                push()
                translate(this.box1.x + boxW, this.box1.y + boxH/2); // Right hand side, start of arrow

                translate(symbolSize,-symbolSize-circSize); // Offset
                strokeWeight(symbolWeight/2);
                noFill();
                circle(circSize/2,circSize/2,circSize)

                translate(symbolSize*2,-symbolSize*2+circSize); // Offset
                strokeWeight(symbolWeight);
                line(-symbolSize,0,symbolSize,0);
                // point(0,-symbolSize);
                // point(0,symbolSize);
                pop();

                if (this.typ == 'PCR'){
                    push();
                    noStroke()
                    // fill(this.clr);
                    textSize(10);
                    textStyle(ITALIC)
                    textAlign(RIGHT)
                    translate(this.box2.x,this.box2.y + boxH/2)
                    translate(-symbolSize*2,symbolSize*2)
                    text('24 timer',0,0)
                    pop();
                }
                
            } 
            
        } else if (this.ori == 'l'){
            line(this.box1.x,this.box1.y+boxH/2,this.box2.x + boxW,this.box2.y+boxH/2);
            line(this.box2.x + boxW,this.box2.y+boxH/2,this.box2.x + boxW+conSize,this.box2.y+boxH/2-conSize);
            line(this.box2.x + boxW,this.box2.y+boxH/2,this.box2.x + boxW+conSize,this.box2.y+boxH/2+conSize);
            // Show test result
            if (this.res == 'n'){
                push()
                translate(this.box1.x, this.box1.y + boxH/2); // Right hand side, start of arrow
                translate(-symbolSize*2,-symbolSize*2); // Offset
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

let curLeft = 50;
let curTop = 50;
let curH = boxH*1.6;
let curW = boxW*1.4;

let allp5Objects = [];

function setup() {
    var curCanves = createCanvas(650,  520);
    curCanves.parent("p5Div");

    // clrBackground = color(255);
    // clrBox = color(210,210,255);
    // clrBoxStroke = color(150,150,255)
    // clrText = color(0);
    // clrAg1_P = color(150,0,0);
    // clrAg1_N = color(20,80,0);
    // clrAg2_P = color(150,0,0);
    // clrAg2_N = color(20,80,0);
    // clrPCR_P = color(150,0,255);
    // clrPCR_N = color(100,150,255);
    
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

    textAlign(CENTER,CENTER);
    textSize(14);

    // Define boxes and position of them
    boxTest = new GroupBox(curLeft,curTop,'ini');
    boxPos1 = new GroupBox(curLeft,curTop + curH,'p');
    boxPos2 = new GroupBox(curLeft,curTop + curH * 2,'pp');
    // boxPos3 = new GroupBox(curLeft,curTop + curH * 3,'ppP');
    boxIsol = new GroupBox(curLeft + curW,curTop + curH,'pn');
    boxLate  = new GroupBox(curLeft + curW,curTop + curH * 2,'pnP');

    allp5Objects.push(boxTest);
    allp5Objects.push(boxPos1);
    allp5Objects.push(boxPos2);
    // allp5Objects.push(boxPos3);
    allp5Objects.push(boxIsol);
    allp5Objects.push(boxLate);

    // Define invisible boxes
    boxNeg1 = new GroupBox(curLeft + curW,curTop,'n');
    boxNeg2 = new GroupBox(curLeft + curW * 2,curTop + curH * 1,'pnN');
    // boxNeg3 = new GroupBox(curLeft + curW * 2,curTop + curH * 2,'ppN');

    allp5Objects.push(boxNeg1);
    allp5Objects.push(boxNeg2);
    // allp5Objects.push(boxNeg3);

    // Define connector
    let conP1 = new Connector(boxTest,boxPos1,'p','d',clrAg1_P,'AG');
    let conP2 = new Connector(boxPos1,boxPos2,'p','d',clrAg2_P,'AG');
    // let conP3 = new Connector(boxPos2,boxPos3,'p','d',clrPCR_P,'PCR');
    let conLate=new Connector(boxIsol,boxLate,'p','d',clrPCR_P,'PCR');
    let conN1 = new Connector(boxTest,boxNeg1,'n','r',clrAg1_N,'AG');
    let conN2 = new Connector(boxPos1,boxIsol,'n','r',clrAg2_N,'AG');
    // let conN3 = new Connector(boxPos2,boxNeg3,'n','r',clrPCR_N,'PCR');
    let conN4 = new Connector(boxIsol,boxNeg2,'n','r',clrPCR_N,'PCR');

    allp5Objects.push(conP1);
    allp5Objects.push(conP2);
    // allp5Objects.push(conP3);
    allp5Objects.push(conLate);
    allp5Objects.push(conN1);
    allp5Objects.push(conN2);
    // allp5Objects.push(conN3);
    allp5Objects.push(conN4);

    
    // let lgdL1 = new GroupBox(lgdLeft,lgdTop,'noShow')
    // let lgdR1 = new GroupBox(lgdLeft+lgdW,lgdTop,'noShow')
    // let lgdL2 = new GroupBox(lgdLeft,lgdTop + lgdH,'noShow')
    // let lgdR2 = new GroupBox(lgdLeft+lgdW,lgdTop + lgdH,'noShow')
    // let lgdL3 = new GroupBox(lgdLeft,lgdTop + lgdH * 2,'noShow')
    // let lgdR3 = new GroupBox(lgdLeft+lgdW,lgdTop + lgdH * 2,'noShow')
    // let lgdL4 = new GroupBox(lgdLeft,lgdTop + lgdH * 3,'noShow')
    // let lgdR4 = new GroupBox(lgdLeft+lgdW,lgdTop + lgdH * 3,'noShow')

    // let conLgdAgP = new Connector(lgdL1,lgdR1,'p','r',clrAg1_P,'AG');
    // let conLgdAgN = new Connector(lgdL2,lgdR2,'n','r',clrAg1_N,'AG');
    // let conLgdPCP = new Connector(lgdL3,lgdR3,'p','r',clrPCR_P,'PCR');
    // let conLgdPCN = new Connector(lgdL4,lgdR4,'n','r',clrPCR_N,'PCR');
    // allp5Objects.push(conLgdAgP);
    // allp5Objects.push(conLgdAgN);
    // allp5Objects.push(conLgdPCP);
    // allp5Objects.push(conLgdPCN);

}

function draw() {

    background(clrBackground);
    textAlign(CENTER,CENTER);

    fill(clrIso);
    stroke(clrIsoStroke);
    // rect(curLeft-boxW*0.3,curTop+curH*0.9,boxW*0.35+curW*1.9,curH*2.9)
    rect(curLeft-boxW*0.3,curTop+curH*0.9,boxW*0.35+curW*1.9,curH*1.9)
    
    push();
    translate(curLeft-boxW*0.2,curTop+curH*(0.9+0.4));
    fill(clrText);
    stroke(clrText);
    strokeWeight(0.25);
    // noStroke()
    textStyle(BOLD)
    rotate(-PI/2);
    text('Isolation',0,0);
    pop();

    fill(clrSpor);
    stroke(clrSporStroke);
    // rect(curLeft-boxW*0.225,curTop+curH*1.9,boxW*0.2+curW*1.9,curH*1.82)
    rect(curLeft-boxW*0.225,curTop+curH*1.9,boxW*0.2+curW*1.9,curH*0.82)

    push();
    // translate(curLeft-boxW*0.125,curTop+curH*(1.9+0.9));
    translate(curLeft-boxW*0.125,curTop+curH*2.3);
    fill(clrText);
    stroke(clrText);
    strokeWeight(0.25);
    // noStroke()
    textStyle(BOLD)
    rotate(-PI/2);
    text('Smitteopsporing',0,0);
    pop();

    for (let k = 0; k < allp5Objects.length; k++) {
        allp5Objects[k].draw();        
    }

    // For legend
    // let lgdLeft = width - boxW -10;
    // let lgdTop = curTop + 10;
    let lgdW = boxW/3;
    let lgdH = boxH/3;
    let lgdTop = height - lgdH * 5.2;
    let lgdLeft = width - lgdW * 2;

    textAlign(LEFT,BOTTOM);
    textSize(12);

    push()
    translate(lgdLeft,lgdTop);

    let lgdMargin = 20;
    fill(230);
    stroke(220);
    rect(-lgdMargin,-lgdMargin,lgdW+lgdMargin*2,lgdH*4 + lgdMargin*2);
    noStroke();
    fill(0);
    textStyle(BOLD);
    text('Forklaring',-2,0);
    
    textStyle(NORMAL);
    
    translate(0,lgdH);
    fill(clrAg1_P);
    stroke(clrAg1_P);
    line(0,0,lgdW,0);
    line(lgdW,0,lgdW-conSize,conSize); 
    line(lgdW,0,lgdW-conSize,-conSize); 
    noStroke();
    fill(0);
    text('Ag+',0,-5);
    
    translate(0,lgdH);
    fill(clrAg1_N);
    stroke(clrAg1_N);
    line(0,0,lgdW,0);
    line(lgdW,0,lgdW-conSize,conSize); 
    line(lgdW,0,lgdW-conSize,-conSize); 
    noStroke();
    fill(0);
    text('Ag-',0,-5);
    
    
    translate(0,lgdH);
    fill(clrPCR_P);
    stroke(clrPCR_P);
    line(0,0,lgdW,0);
    line(lgdW,0,lgdW-conSize,conSize); 
    line(lgdW,0,lgdW-conSize,-conSize); 
    noStroke();
    fill(0);
    text('PCR+',0,-5);
    
    
    translate(0,lgdH);
    fill(clrPCR_N);
    stroke(clrPCR_N);
    line(0,0,lgdW,0);
    line(lgdW,0,lgdW-conSize,conSize); 
    line(lgdW,0,lgdW-conSize,-conSize); 
    noStroke();
    fill(0);
    text('PCR-',0,-5);

    pop()


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
  