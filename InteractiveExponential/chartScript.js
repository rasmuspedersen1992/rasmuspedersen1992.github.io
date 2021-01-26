// let RW_Slider,RM_Slider;
// let sliderWidth = 200;
// let sliderMargin = 50;


// let sliders_Y;

let tScale = 7;

// let tEnd = 20
let tEnd = 20*tScale;
let tRange;
tRange = [...Array(tEnd).keys()];

// let ini_W = 3000;
// let ini_M = 2;
// let ini_W = 21000/tScale;
let ini_W = 2000/tScale;
let ini_M = 10/tScale;
let count_W = [];
let count_M = [];
let count_sum = [];
let rel_W = [];
let rel_M = [];

let RW_slider = document.getElementById('RW_range');
let RM_slider = document.getElementById('RM_range');

let RW = 0.9;
let RM = 1.1;

var calcValues = function(){
    RW = RW_slider.value;
    RM = RM_slider.value;

    for (var i = 0, len = tRange.length; i < len; ++i) {
        // count_W[i] = Math.floor(ini_W * Math.exp((RW-1)*tRange[i]/tScale));
        // count_M[i] = Math.floor(ini_M * Math.exp((RM-1)*tRange[i]/tScale));
        count_W[i] = ini_W * Math.exp((RW-1)*tRange[i]/tScale);
        count_M[i] = ini_M * Math.exp((RM-1)*tRange[i]/tScale);
        count_sum[i] = count_W[i]+count_M[i];
        rel_W[i] = count_W[i]/count_sum[i];
        rel_M[i] = count_M[i]/count_sum[i];
    }

    window.myLine.update();
    window.myLine2.update();

}

var config = {
    type: 'line',
    data: {
        labels: tRange,
        datasets: [
            {
                label: 'Samlet',
                data: count_sum,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 5,
            }, {
                label: 'Normal Corona-virus',
                data: count_W,
                borderColor: window.chartColors.red,
                backgroundColor:  window.chartColors.red,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 1,
            }, {
                label: 'B.1.1.7. Variant',
                data: count_M,
                borderColor: window.chartColors.blue,
                backgroundColor:  window.chartColors.blue,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 1,
            }
    ]
    },
    options: {
        responsive: true,
        title: {
        display: true,
        text: ''
        },
        tooltips: {
        mode: 'index'
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
            labelString: 'Antal inficerede'
            },
            ticks: {
            min: 0,
            max: 1.5*ini_W
            
            }
        }]
        }
    }
    };
    
var config2 = {
    type: 'line',
    data: {
        labels: tRange,
        datasets: [
            {
                label: 'Normal Corona-virus',
                data: rel_W,
                borderColor: window.chartColors.red,
                backgroundColor: 'rgba(0, 0, 0, 0)',
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 1,
            }, {
                label: 'B.1.1.7. Variant',
                data: rel_M,
                borderColor: window.chartColors.blue,
                backgroundColor: 'rgba(0, 0, 0, 0)',
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 1,
            }
    ]
    },
    options: {
        responsive: true,
        title: {
        display: true,
        text: ''
        },
        tooltips: {
        mode: 'index'
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
            labelString: 'Relativ fordeling af typer'
            },
            ticks: {
            min: 0,
            max: 1
            
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
calcValues();
};

RW_slider.addEventListener('click', function() {
    calcValues();
});
RM_slider.addEventListener('click', function() {
    calcValues();
});


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
