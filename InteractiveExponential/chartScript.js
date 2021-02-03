// Starter i uge 50, med omkring 21000 ugentlige tilfælde, så 3000 daglige
let genTid = 4.7;
let tScale = 7;
let tEnd = 120;
tEnd = Math.floor(tEnd/tScale);
let tRange = [];
let tRangePlot = [];
let data_count = [];
let data_ratio = [];
let data_kontakt = [];

// Initialize t-array and data-arrays
// tRange = [...Array(tEnd).keys()];
for (let i = 0; i < tEnd; i++) {
    tRange[i] = i
    tRangePlot[i] = 'Uge '+(i-1)
    data_count[i] = NaN
    data_ratio[i] = NaN   
    data_kontakt[i] = NaN    
}
// Manually set the "pre-week 0" labels
// tRangePlot[0] = 'Uge '+50
// tRangePlot[0] = 'Uge '+51
tRangePlot[0] = 'Uge '+52
tRangePlot[1] = 'Uge '+53

// let uge2Index = 4;
let uge2Index = 3;

// Hardcoded data from SSI numbers
// data_count[0] = 21804/tScale // Uge 50
// data_count[0] = 24425/tScale // Uge 51
data_count[0] = 16928/tScale
data_count[1] = 14533/tScale
data_count[2] = 11288/tScale
data_count[3] =  6986/tScale
data_count[4] =  5315/tScale
data_count[5] =  3611/tScale

// data_ratio[0] = 0.8 
data_ratio[0] = 2.0;
data_ratio[1] = 2.4; 
data_ratio[2] = 4.0;
data_ratio[3] = 7.4;
data_ratio[4] = 13.1;
data_ratio[5] = 16.5;


data_kontakt[0] = 0.9;  // Uge 52 (24/12)
data_kontakt[1] = 0.8; // Uge 53 (31/12)
data_kontakt[2] = 0.7; // Uge 1 (7/01-2021)
data_kontakt[3] = 0.8; // Uge 2 (14/01-2021)

// data_kontakt[0] = 0.9; 
// data_kontakt[1] = 0.85; 
// data_kontakt[2] = 0.8; 
// data_kontakt[3] = 0.75;
// data_kontakt[4] = 0.7;
// data_kontakt[5] = 0.8;
// data_kontakt[5] = NaN;


// Initial condition for calculations
let ini_W = data_count[0];
// let ini_W = 3200; // A little below week 51, since week 51 numbers seemed too high, at least for this model
// let ini_M = ini_W * data_ratio[0] / 100;
let ini_M = 0.6 * ini_W * data_ratio[0]/ 100; //Reduced a little, since Uge52 seems excessively high

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
let RW_slider_2 = document.getElementById('RW_range_2');
let RM_slider = document.getElementById('RM_range');

let RW_Label_2 = document.getElementById('RW_Label_2');
let RM_Label = document.getElementById('RM_Label');

let VariantCheckbox = document.getElementById('VariantCheckbox');
let withMutation = false;

// Model parameters
let RW;
let RW_2;
let RM;
let RM_2;

// Function for re-calculating all values
var calcValues = function(){

    // Get variable values from inputs
    RW_2 = RW_slider_2.value;
    RM = RW*(1+(RM_slider.value/100));
    RM_2 = RW_2*(1+(RM_slider.value/100));
    withMutation = VariantCheckbox.checked;

    // Set the initial values 
    curW = ini_W;
    curM = ini_M;

    // Go through all time-steps
    for (var i = 0, len = tRange.length; i < len; ++i) {
        
        // Use data from kontakttal until week 2
        if (i < uge2Index){
            curRW = data_kontakt[i];
            curRM = data_kontakt[i]*(1+(RM_slider.value/100));
        } else {
            curRW = RW_2;
            curRM = RM_2;
        }
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
    RW_Label_2.innerHTML = 'Kontakttal efter uge 2: '+RW_2;
    RM_Label.innerHTML = 'B117 variant: '+RM_slider.value + "% højere";

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
            labelString: 'Fordeling af typer i procent'
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
RW_slider_2.onchange = function(){
    calcValues()
}
RM_slider.onchange = function(){
    calcValues()
}
VariantCheckbox.onchange = function(){
    calcValues()
}