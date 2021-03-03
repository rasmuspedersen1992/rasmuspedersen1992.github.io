let genTid = 4.7;
let tScale = 7;
// let tEnd = 120;
let tEnd = 92;
tEnd = Math.floor(tEnd/tScale);
let tRange = [];
let tRangePlot = [];
let data_count = [];
let data_ratio = [];
let data_kontakt = [];

// Initialize t-array and data-arrays
firstWeek = 4
for (let i = 0; i < tEnd; i++) {
    tRange[i] = i
    tRangePlot[i] = 'Uge '+(i+firstWeek)
    data_count[i] = NaN
    data_ratio[i] = NaN   
    data_kontakt[i] = NaN    
}

let indexForControl = 4;

// Hardcoded data from SSI numbers
// data_count[0] = 21804/tScale // Uge 50
// data_count[0] = 24425/tScale // Uge 51
// data_count[0] = 16930/tScale // Uge 52
// data_count[1] = 14535/tScale // Uge 53
// data_count[2] = 11289/tScale // Uge 1 
// data_count[3] =  6988/tScale // Uge 2
// data_count[4] =  5315/tScale // Uge 3
data_count[0] =  3611/tScale // Uge 4
data_count[1] =  3084/tScale // Uge 5
data_count[2] =  2707/tScale // Uge 6
data_count[3] =  3326/tScale // Uge 7

// data_ratio[0] = 0.8 
// data_ratio[0] = 1.8; // Uge 52
// data_ratio[1] = 2.0; // Uge 53
// data_ratio[2] = 3.7; // Uge 1
// data_ratio[3] = 7.1; // Uge 2 
// data_ratio[4] = 12.8; // Uge 3
data_ratio[0] = 19.5; // Uge 4
data_ratio[1] = 29.6; // Uge 5
data_ratio[2] = 47.3; // Uge 6
data_ratio[3] = 65.7; // Uge 7


// data_kontakt[0] = 0.9;  // Uge 52 (24/12)
// data_kontakt[1] = 0.8; // Uge 53 (31/12)
// data_kontakt[2] = 0.7; // Uge 1 (7/01-2021)
// data_kontakt[3] = 0.8; // Uge 2 (14/01-2021) OBS: GAMMELT TAL! Blev opdateret i seneste datasamling fra SSI
// // data_kontakt[3] = 0.7; // Uge 2 (14/01-2021), Nyt tal. UPDATE 01/03: Tallet er ændret tilbage igen...
// data_kontakt[4] = 0.8; // Uge 3 (21/01-2021), 
data_kontakt[0] = 0.9; // Uge 4 (28/01-2021), 
data_kontakt[1] = 0.9; // Uge 5 (04/02-2021), 
data_kontakt[2] = 1; // Uge 6 (11/02-2021), 
data_kontakt[3] = 1; // Uge 7 (18/02-2021), 

// Kontakttal for wild-type, vurderet fra SSI's kontakttal figur 3
// https://covid19.ssi.dk/-/media/cdn/files/kontakttal-for-b117-og-andre-hyppige-virusvarianter02032021-2bak.pdf?la=da
let data_kontakt_ref = [];
data_kontakt_ref[0] = 0.75; // Uge 4 (28/01-2021) 
data_kontakt_ref[1] = 0.73; // Uge 5 (04/02-2021)
data_kontakt_ref[2] = 0.85; // Uge 6 (11/02-2021)
data_kontakt_ref[3] = 0.79; // Uge 7 (18/02-2021)


// data_kontakt[0] = 0.9; 
// data_kontakt[1] = 0.85; 
// data_kontakt[2] = 0.8; 
// data_kontakt[3] = 0.75;
// data_kontakt[4] = 0.7;
// data_kontakt[5] = 0.8;
// data_kontakt[5] = NaN;


// Initial condition for calculations
// let ini_W = data_count[0];
// let ini_W = 3200; // A little below week 51, since week 51 numbers seemed too high, at least for this model
// let ini_M = ini_W * data_ratio[0] / 100;
// let ini_M = 0.6 * ini_W * data_ratio[0]/ 100; //Reduced a little, since Uge52 seems excessively high
let ini_W = ((100-data_ratio[0])/100) *data_count[0];
let ini_M = ((data_ratio[0])/100) *data_count[0];


// Initialize arrays used in calcuations
let count_W = [];
let count_M = [];
let count_sum = [];
let count_W_Plot = [];
let count_M_Plot = [];
let count_sum_Plot = [];
let rel_W = [];
let rel_M = [];
let RW_List = [];
let RM_List = [];
let RT_List = [];

// Objects for referencing inputs
let slider_uge4 = document.getElementById('uge4slider');
let slider_uge5 = document.getElementById('uge5slider');
let slider_uge6 = document.getElementById('uge6slider');
let slider_uge7 = document.getElementById('uge7slider');
let slider_uge8 = document.getElementById('uge8slider');

let label_uge4 = document.getElementById('uge4num');
let label_uge5 = document.getElementById('uge5num');
let label_uge6 = document.getElementById('uge6num');
let label_uge7 = document.getElementById('uge7num');
let label_uge8 = document.getElementById('uge8num');


console.log(slider_uge8)

// let RW_slider_2 = document.getElementById('RW_range_2');
// let RM_slider = document.getElementById('RM_range');

// let RW_Label_2 = document.getElementById('RW_Label_2');
// let RM_Label = document.getElementById('RM_Label');

// let VariantCheckbox = document.getElementById('VariantCheckbox');¨

let withMutation = true;

// Model parameters
let RW;
let RW_2;
let RM;
let RM_2;

// Function for re-calculating all values
var calcValues = function(){

    // Get variable values from inputs
    // RW_2 = RW_slider_2.value;
    // RM = RW*(1+(RM_slider.value/100));
    // RM_2 = RW_2*(1+(RM_slider.value/100));
    // withMutation = VariantCheckbox.checked;
    let RW_4 = slider_uge4.value;
    let RW_5 = slider_uge5.value;
    let RW_6 = slider_uge6.value;
    let RW_7 = slider_uge7.value;
    let RW_8 = slider_uge8.value;

    console.log(RW_8)

    let RM_4 = RW_4 * 1.55;
    let RM_5 = RW_5 * 1.55;
    let RM_6 = RW_6 * 1.55;
    let RM_7 = RW_7 * 1.55;
    let RM_8 = RW_8 * 1.55;

    // Set the initial values 
    curW = ini_W;
    curM = ini_M;


    // let i_uge4 = 0;
    let i_uge5 = 1;
    let i_uge6 = 2;
    let i_uge7 = 3;
    let i_uge8 = 4;
    // Go through all time-steps
    for (var i = 0, len = tRange.length; i < len; ++i) {
        
        curRW = RW_8;
        curRM = RM_8;
        if (i < i_uge8){
            curRW = RW_7;
            curRM = RM_7;
        }
        if (i < i_uge7){
            curRW = RW_6;
            curRM = RM_6;
        }
        if (i < i_uge6){
            curRW = RW_5;
            curRM = RM_5;
        }
        if (i < i_uge5){
            curRW = RW_4;
            curRM = RM_4;
        }

        // // Use data from kontakttal until week 2
        // if (i < indexForControl){
        //     // curRW = data_kontakt[i];
        //     // curRM = data_kontakt[i]*(1+(RM_slider.value/100));
        //     curRW = data_kontakt_ref[i];
        //     curRM = data_kontakt_ref[i]*(1+(RM_slider.value/100));
        // } else {
        //     curRW = RW_2;
        //     curRM = RM_2;
        // }
        // Save the kontakttal
        RW_List[i] = curRW;
        RM_List[i] = curRM;

        // Save the current infection counts
        count_W[i] = curW;
        count_M[i] = curM;
        count_sum[i] = count_W[i]+count_M[i];

        // Update infection counts
        curW = curW *  Math.exp(tScale*(curRW-1)/genTid);
        if (withMutation){
            curM = curM *  Math.exp(tScale*(curRM-1)/genTid);
        } else {
            curM = 0;
        }
        
        // Round figures for plotting the counts
        count_M_Plot[i] = Math.round(count_M[i]);
        count_W_Plot[i] = Math.round(count_W[i]);
        count_sum_Plot[i] = Math.round(count_sum[i]);

        // Calculate relative infectioncounts
        rel_W[i] = count_W[i]/count_sum[i];
        rel_M[i] = count_M[i]/count_sum[i];
        
        // Calculate the effective reproduction-number
        RT_List[i] = rel_W[i] * curRW + rel_M[i] * curRM;

        // Multiply by 100 for percentage
        rel_W[i] = rel_W[i]*100;
        rel_M[i] = rel_M[i]*100;


    }

    // Update figures
    window.myLine.update();
    window.myLine2.update();
    window.linesR.update();

    // Update text below sliders
    label_uge4.innerHTML = slider_uge4.value 
    label_uge5.innerHTML = slider_uge5.value
    label_uge6.innerHTML = slider_uge6.value
    label_uge7.innerHTML = slider_uge7.value 
    label_uge8.innerHTML = slider_uge8.value 
    // RW_Label_2.innerHTML = 'Reference-kontakttal efter uge 7: '+RW_2;
    // RM_Label.innerHTML = 'B117 variant: '+RM_slider.value + "% højere";

}

// Define first figure
var config = {
    type: 'line',
    data: {
        labels: tRangePlot,
        datasets: [
            {
                label: 'Data (samlet)',
                data: data_count,
                borderColor: window.chartColors.black,
                backgroundColor:  window.chartColors.black,
                fill: false,
                showLine: false,
                lineTension: 0,
                pointRadius: 2,
                pointHoverRadius: 5,
            },{
                label: 'Samlet',
                data: count_sum_Plot,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 5,
            }, {
                label: 'Normal coronavirus',
                data: count_W_Plot,
                borderColor: window.chartColors.blue,
                backgroundColor:  window.chartColors.blue,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 1,
            }, {
                label: 'B117 Variant',
                data: count_M_Plot,
                borderColor: window.chartColors.orange,
                backgroundColor:  window.chartColors.orange,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 1,
            },
    ]
    },
    options: {
        responsive: true,
        aspectRatio: 2.5,
        legend: {
            position: 'top',
            labels: {
            usePointStyle: true,
            }
        },
        scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
            display: true
            }
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
            // fontSize: 14,
            fontSize: 20,
            display: true,
            labelString: 'Antal nye smittede per dag'
            },
            ticks: {
            min: 0,
            // max: Math.round(1.2*ini_W / 100)*100
            max: 5000
            
            }
        }]
        }
    }
    };
    
// Define second figure
var config2 = {
    type: 'line',
    data: {
        labels: tRangePlot,
        datasets: [
            {
                label: 'Data (B117)',
                data: data_ratio,
                borderColor: window.chartColors.black,
                backgroundColor: window.chartColors.black,
                fill: false,
                showLine: false,
                lineTension: 0,
                pointRadius: 2,
                pointHoverRadius: 5,
            },{
                label: 'Normal coronavirus',
                data: rel_W,
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 1,
            }, {
                label: 'B117 Variant',
                data: rel_M,
                borderColor: window.chartColors.orange,
                backgroundColor: window.chartColors.orange,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 1,
            }, 
    ]
    },
    options: {
        
        responsive: true,
        aspectRatio: 2.5,
        tooltips: {
        mode: 'index'
        },
        legend: {
            position: 'top',
            labels: {
            usePointStyle: true,
            }
        },
        scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
            display: true
            }
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
            // fontSize: 18,
            fontSize: 20,
            display: true,
            labelString: 'Fordeling af typer [%]'
            },
            ticks: {
            min: 0,
            max: 100
            
            }
        }]
        }
    }
    };
    
// Define third figure
var configR = {
    type: 'line',
    data: {
        labels: tRangePlot,
        datasets: [
            {
            label: 'Data (SSI estimat)',
            data: data_kontakt,
            borderColor: window.chartColors.black,
            backgroundColor:  window.chartColors.black,
            fill: false,
            showLine: false,
            lineTension: 0,
            pointRadius: 10,
            pointStyle: 'star',
            pointHoverRadius: 10,
        },
            {
                label: 'Effektiv',
                data: RT_List,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                fill: false,
                showLine: true,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 3,
            },
            {
                label: 'Normal coronavirus',
                data: RW_List,
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                fill: false,
                borderDash: [10,8],
                lineTension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,
            }, {
                label: 'B117 Variant',
                data: RM_List,
                borderColor: window.chartColors.orange,
                backgroundColor: window.chartColors.orange,
                fill: false,
                borderDash: [10,8],
                lineTension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,
            }
    ]
    },
    options: {
        responsive: true,
        aspectRatio: 2.5,
        tooltips: {
        mode: 'index'
        },        
        legend: {
            position: 'top',
            labels: {
            usePointStyle: true,
            }
        },
        scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
            display: true
            }
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
            display: true,
            fontSize: 20,
            labelString: 'Kontakttal'
            },
            ticks: {
            min: 0.4,
            max: 1.6,
            stepSize: 0.1,               
            }
        }]
        }
    }
    };

// On loading the page, make the chartjs figures
window.onload = function() {
var ctx = document.getElementById('canvas').getContext('2d');
window.myLine = new Chart(ctx, config);
var ctx2 = document.getElementById('canvas2').getContext('2d');
window.myLine2 = new Chart(ctx2, config2);
var ctxR = document.getElementById('canvasR').getContext('2d');
window.linesR = new Chart(ctxR, configR);
// Calculate data to plot
calcValues();
};

// Check for changes to inputs, re-calculate data if anything changes
slider_uge4.onchange = function(){
    calcValues();
}
slider_uge5.onchange = function(){
    calcValues();
}
slider_uge6.onchange = function(){
    calcValues();
}
slider_uge7.onchange = function(){
    calcValues();
}
slider_uge8.onchange = function(){
    calcValues();
}
// RW_slider_2.onchange = function(){
//     calcValues()
// }
// RM_slider.onchange = function(){
//     calcValues()
// }
// VariantCheckbox.onchange = function(){
//     calcValues()
// }