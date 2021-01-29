// let RW_Slider,RM_Slider;
// let sliderWidth = 200;
// let sliderMargin = 50;


// let sliders_Y;

// Starter i uge 50, med omkring 21000 ugentlige tilfælde, så 3000 daglige
// Dage fra mandag uge 50 til søndag uge 10: 7 * 14 = 98

let tScale = 7;
let genTid = 4.7;

// let tEnd = 20
// let tEnd = 20*tScale;
// let tEnd = 98;
let tEnd = 120;
tEnd = Math.floor(tEnd/tScale);
let tRange = [];
let tRangePlot = [];
let data_count = [];
let data_ratio = [];
// tRange = [...Array(tEnd).keys()];
for (let i = 0; i < tEnd; i++) {
    tRange[i] = i
    tRangePlot[i] = 'Uge '+(i-2)
    data_count[i] = NaN
    data_ratio[i] = NaN    
}

// let uge2Index = 4;
let uge2Index = 5;
let withMutation = false;

// tRangePlot[0] = 'Uge '+50
tRangePlot[0] = 'Uge '+51
tRangePlot[1] = 'Uge '+52
tRangePlot[2] = 'Uge '+53

// Hardcoded data from SSI numbers
// data_count[0] = 21804/tScale
data_count[0] = 24425/tScale
data_count[1] = 16928/tScale
data_count[2] = 14533/tScale
data_count[3] = 11288/tScale
data_count[4] =  6986/tScale

// data_ratio[0] = 0.4 / 100
// data_ratio[0] = 0.8 / 100
// data_ratio[1] = 2.0 / 100
// data_ratio[2] = 2.4 / 100
// data_ratio[3] = 4.0 / 100
// data_ratio[4] = 7.4 / 100

data_ratio[0] = 0.8 
data_ratio[1] = 2.0 
data_ratio[2] = 2.4 
data_ratio[3] = 4.0 
data_ratio[4] = 7.4 

let data_kontakt = [];
// data_kontakt[0] = 1;
// data_kontakt[1] = 0.9; // 20 december, søndag i uge 51
// data_kontakt[2] = 0.8;
// data_kontakt[3] = 0.7;
// data_kontakt[4] = 0.7;
// data_kontakt[5] = 0.8;
// data_kontakt[0] = 0.9;
// data_kontakt[1] = 1; 
// data_kontakt[2] = 0.9; 
// data_kontakt[3] = 0.8;
// data_kontakt[4] = 0.7;
// data_kontakt[5] = 0.8;

// data_kontakt[0] = 0.9; 
// data_kontakt[1] = 0.9; 
// data_kontakt[2] = 0.8;
// data_kontakt[3] = 0.7;
// data_kontakt[4] = 0.8;

// data_kontakt[0] = 0.9; 
// data_kontakt[1] = 0.833; 
// data_kontakt[2] = 0.766;
// data_kontakt[3] = 0.7;
// data_kontakt[4] = 0.8;

data_kontakt[0] = 0.9; 
data_kontakt[1] = 0.85; 
data_kontakt[2] = 0.8; 
data_kontakt[3] = 0.75;
data_kontakt[4] = 0.7;
data_kontakt[5] = 0.8;
// data_kontakt[5] = NaN;

let data_kontakt2 = []
data_kontakt2[0] = NaN; 
data_kontakt2[1] = NaN;
data_kontakt2[2] = NaN;
data_kontakt2[3] = NaN;
data_kontakt2[4] = NaN;
data_kontakt2[5] = 0.8;


// let data_kontakt_lower = []
// data_kontakt_lower[0] = 

// let tEndPlot = Math.floor(tEnd/tScale);
// let tRangePlot;
// tRangePlot = [...Array(tEndPlot).keys()];

// let tRangePlot = [];
// for (let i = 0; i < tRange.length; i++) {
//     tRangePlot[i] = Math.floor(tRange[i]/tScale); 
// }


// let ini_W = 3000;
// let ini_M = 2;
// let ini_W = data_count[0];
let ini_W = 3200;
// let ini_M = ini_W * data_ratio[0];
let ini_M = ini_W * data_ratio[0] / 100;
// let ini_W = 21000/tScale;
// let ini_W = 2000/tScale;
// let ini_M = 10/tScale;
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




// let RW_slider = document.getElementById('RW_range');
let RW_slider_2 = document.getElementById('RW_range_2');
let RM_slider = document.getElementById('RM_range');
// let RW_Label = document.getElementById('RW_Label');
let RW_Label_2 = document.getElementById('RW_Label_2');
let RM_Label = document.getElementById('RM_Label');
let VariantCheckbox = document.getElementById('VariantCheckbox');

let RW;
let RW_2;
let RM;
let RM_2;

var calcValues = function(){
    // RW = RW_slider.value;
    RW_2 = RW_slider_2.value;
    // RM = RM_slider.value;
    RM = RW*(1+(RM_slider.value/100));
    RM_2 = RW_2*(1+(RM_slider.value/100));
    withMutation = VariantCheckbox.checked;

    curW = ini_W;
    curM = ini_M;

    for (var i = 0, len = tRange.length; i < len; ++i) {
        // count_W[i] = Math.floor(ini_W * Math.exp((RW-1)*tRange[i]/tScale));
        // count_M[i] = Math.floor(ini_M * Math.exp((RM-1)*tRange[i]/tScale));
        // if (i < uge2Index){
        //     count_W[i] = ini_W * Math.exp(tScale*(RW-1)*tRange[i]/genTid);
        // } else {
        //     count_W[i] = ini_W * Math.exp(tScale*(RW_2-1)*tRange[i]/genTid);
        // }
        // count_M[i] = ini_M * Math.exp(tScale*(RM-1)*tRange[i]/genTid);
        // RW_List[i] = RW;
        // RM_List[i] = RM;

        
        if (i < uge2Index){
            // curRW = RW;
            // curRM = RM;
            curRW = data_kontakt[i];
            curRM = data_kontakt[i]*(1+(RM_slider.value/100));
        } else {
            curRW = RW_2;
            curRM = RM_2;
        }

        count_W[i] = curW;
        count_M[i] = curM;

        curW = curW *  Math.exp(tScale*(curRW-1)/genTid);
        if (withMutation){
            curM = curM *  Math.exp(tScale*(curRM-1)/genTid);
        } else {
            curM = 0;
        }
        RW_List[i] = curRW;
        RM_List[i] = curRM;
        // if (i < uge2Index){
            // curW = curW *  Math.exp(tScale*(RW-1)/genTid);
            // curM = curM *  Math.exp(tScale*(RM-1)/genTid);
            // RW_List[i] = RW;
            // RM_List[i] = RM;
        // } else {
            // curW = curW *  Math.exp(tScale*(RW_2-1)/genTid);
            // curM = curM *  Math.exp(tScale*(RM_2-1)/genTid);
            // RW_List[i] = RW_2;
            // RM_List[i] = RM_2;
        // }
        count_sum[i] = count_W[i]+count_M[i];
        count_M_Plot[i] = Math.round(count_M[i]);
        count_W_Plot[i] = Math.round(count_W[i]);
        count_sum_Plot[i] = Math.round(count_sum[i]);
        rel_W[i] = count_W[i]/count_sum[i];
        rel_M[i] = count_M[i]/count_sum[i];
        // RT_List[i] = rel_W[i] * RW + rel_M[i] * RM;
        RT_List[i] = rel_W[i] * curRW + rel_M[i] * curRM;
        
        rel_W[i] = rel_W[i]*100;
        rel_M[i] = rel_M[i]*100;
    }

    window.myLine.update();
    window.myLine2.update();
    window.linesR.update();

    
    // RW_Label.innerHTML = 'Normal Coronavirus: '+RW;
    // RW_Label.innerHTML = 'Kontakttal indtil uge 2: '+RW;
    RW_Label_2.innerHTML = 'Kontakttal efter uge 2: '+RW_2;
    // RM_Label.innerHTML = 'B.1.1.7. variant: '+RM
    // RM_Label.innerHTML = 'B.1.1.7. variant: '+Math.round(RM*100)/100;
    RM_Label.innerHTML = 'B.1.1.7. variant: '+RM_slider.value + "% højere";

}

var config = {
    type: 'line',
    data: {
        // labels: tRange,
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
                label: 'Normal Corona-virus',
                data: count_W_Plot,
                borderColor: window.chartColors.blue,
                backgroundColor:  window.chartColors.blue,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 1,
            }, {
                label: 'B.1.1.7. Variant',
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
        // maintainAspectRatio: false,

        // title: {
        // display: true,
        // text: ''
        // },
        // tooltips: {
        // mode: 'index'
        // },
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
            fontSize: 14,
            display: true,
            labelString: 'Antal inficerede'
            },
            ticks: {
            min: 0,
            // max: Math.round(1.5*ini_W / 100)*100
            // suggestedMax: Math.round(1.2*ini_W / 100)*100
            // max: Math.round(1.2*ini_W / 100)*100
            max: 5000
            
            }
        }]
        }
    }
    };
    
var config2 = {
    type: 'line',
    data: {
        // labels: tRange,
        labels: tRangePlot,
        datasets: [
            {
                label: 'Data (B.1.1.7.)',
                data: data_ratio,
                borderColor: window.chartColors.black,
                backgroundColor: window.chartColors.black,
                fill: false,
                showLine: false,
                lineTension: 0,
                pointRadius: 2,
                pointHoverRadius: 5,
            },{
                label: 'Normal Corona-virus',
                data: rel_W,
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 1,
            }, {
                label: 'B.1.1.7. Variant',
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
        // maintainAspectRatio: false,
        // title: {
        // display: true,
        // text: ''
        // },
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
            fontSize: 18,
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
    
    
var configR = {
    type: 'line',
    data: {
        // labels: tRange,
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
        //     {
        //     label: 'Data (SSI estimat)',
        //     data: data_kontakt2,
        //     display: false,
        //     borderColor: window.chartColors.black,
        //     backgroundColor:  window.chartColors.black,
        //     fill: false,
        //     showLine: false,
        //     pointStyle: 'star',
        //     lineTension: 0,
        //     pointRadius: 5,
        //     pointHoverRadius: 5,
        // },
            {
                label: 'Effektiv',
                data: RT_List,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 3,
            },
            {
                label: 'Normal Corona-virus',
                data: RW_List,
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                fill: false,
                borderDash: [10,8],
                lineTension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,
            }, {
                label: 'B.1.1.7. Variant',
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
        // title: {
        // display: true,
        // text: ''
        // },
        tooltips: {
        mode: 'index'
        },        
        legend: {
            position: 'top',
            // position: 'right',
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
            fontSize: 22,
            labelString: 'Kontakttal'
            },
            ticks: {
            min: 0.4,
            max: 1.6,
            stepSize: 0.2,               
            }
        }]
        }
    }
    };

window.onload = function() {
var ctx = document.getElementById('canvas').getContext('2d');
window.myLine = new Chart(ctx, config);
var ctx2 = document.getElementById('canvas2').getContext('2d');
window.myLine2 = new Chart(ctx2, config2);
var ctxR = document.getElementById('canvasR').getContext('2d');
window.linesR = new Chart(ctxR, configR);
calcValues();
};


// RW_slider.addEventListener('click', function() {
//     calcValues();
    
// });
// RW_slider_2.addEventListener('click', function() {
//     calcValues();
    
// }); 
// RM_slider.addEventListener('click', function() {
//     calcValues();
// });
// VariantCheckbox.addEventListener('click', function(){
//     calcValues();
// });

RW_slider_2.onchange = function(){
    calcValues()
}
RM_slider.onchange = function(){
    calcValues()
}
VariantCheckbox.onchange = function(){
    calcValues()
}


    // console.log(RW);
    // console.log(RM);
        // datapoints[i] = Math.random() < 0.05 ? NaN : randomScalingFactor();
        // count_W[i] = ini_W * Math.exp((RW-1)*tRange[i]);
        // count_M[i] = ini_M * Math.exp((RM-1)*tRange[i]);
        // count_W[i] = Math.floor(ini_W * Math.exp((RW-1)*tRange[i]));
        // count_M[i] = Math.floor(ini_M * Math.exp((RM-1)*tRange[i]));
// var randomScalingFactor = function() {
// return Math.round(Math.random() * 100);
// };
//['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
// var datapoints = [0, 20, 20, 60, 60, 120, NaN, 180, 120, 125, 105, 110, 170];


// document.getElementById('randomizeData').addEventListener('click', function() {
// for (var i = 0, len = datapoints.length; i < len; ++i) {
//     datapoints[i] = Math.random() < 0.05 ? NaN : randomScalingFactor();
// }
// window.myLine.update();
// });
