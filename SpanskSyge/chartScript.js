// Initialize flags
var showRatioK = false;

// --- Load data from csv ---
// Initialize arrays for all data
var allDatesRaw = []
var allDates = []
var cases0_1 = []
var cases1_4 = []
var cases5_14 = []
var cases15_64 = []
var cases65 = []
var casesSum = []
var ratioK0_1 = []
var ratioK1_4 = []
var ratioK5_14 = []
var ratioK15_64 = []
var ratioK65 = []
var ratioKSum = []

doneLoading = false;
var curMinDate = new Date('1915-01-01');
var curMaxDate = new Date('1920-01-01');

d3.csv("Spansk_Syge_I_Cph.csv").then(function(data) {
    for (let k = 0; k < data.length; k++) {
        const curRow = data[k];
        cases0_1.push(curRow.cases0_1);
        cases1_4.push(curRow.cases1_5);
        cases5_14.push(curRow.cases5_15);
        cases15_64.push(curRow.cases15_65);
        cases65.push(curRow.cases65);
        casesSum.push(curRow.casesSum);
        ratioK0_1.push(curRow.ratioK0_1);
        ratioK1_4.push(curRow.ratioK1_4);
        ratioK5_14.push(curRow.ratioK5_14);
        ratioK15_64.push(curRow.ratioK15_64);
        ratioK65.push(curRow.ratioK65);
        ratioKSum.push(curRow.ratioKAll);
        allDatesRaw.push(curRow.date);
    }
    
    doneLoading = true;
    interpretDate();

    updateChart();


    // Update the sliders, to ensure label is correct
    xlim1_slider.onchange();
    xlim2_slider.onchange();
    
});

// Load deaths
var allDatesDeathRaw = [];
var allDatesDeath = [];
var allDeath = [];
d3.csv("Spansk_Syge_Cph_Doedsfald.csv").then(function(data) {
    for (let k = 0; k < data.length; k++) {
        const curRow = data[k];
        allDatesDeathRaw.push(curRow.Date);
        allDeath.push(curRow.Deaths);
    }
    
    doneLoading = true;
    interpretDate();
    updateChart();


    // // Update the sliders, to ensure label is correct
    // xlim1_slider.onchange();
    // xlim2_slider.onchange();
    
});

// Function for converting date-string into date format
var interpretDate = function(){
    for (let d = 0; d < allDatesRaw.length; d++) {
        const curDateRaw = allDatesRaw[d];
        const curDate = new Date(curDateRaw);
        allDates.push(curDate)
    }
    for (let d = 0; d < allDatesDeathRaw.length; d++) {
        const curDateRaw = allDatesDeathRaw[d];
        const curDate = new Date(curDateRaw);
        allDatesDeath.push(curDate)
    }
}

// Function for interpreting the x-range to show
// There are 365 data-points, slider goes from 0 to 365
var numToDate = function(curNum){
    
    return allDates[curNum];
}


var chartConfig = {
    type: 'line',
    data: {
        labels: allDates,
        datasets: [ // No data, is added in functions below
        ]
    },
    options: {
        responsive: true,
        aspectRatio: 3,
        legend: {
            position: 'top',
            labels: {
            usePointStyle: true,
            }
        },
        scales: {
            xAxes: [{
                type: 'time',
                    time: {
                        unit: 'month',
                        stepSize: 1,
                        // unit: 'week',
                        // tooltipFormat:'MM/DD/YYYY', 
                        // tooltipFormat:'DD/MM - YYYY', 
                        tooltipFormat:'[Uge ]w[, ] DD[.] MMMM - YYYY', 
                        // min: new Date('1917-01-01'), 
                        // max: curMaxDate
                        displayFormats: {
                            week: '[Uge ]w[, ]YYYY', 
                            month: 'MMMM YYYY'
                        }
                },
                display: true,
                scaleLabel: {
                display: true
                },            
                // ticks: {
                //     // min: curMinDate,
                //     min: new Date('1917-01-01'),
                //     max: curMaxDate
                // }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    fontSize: 20,
                    display: true,
                    labelString: 'Antal'
                }
            }]
        }
    }
};

var chartDeathConfig = {
    type: 'line',
    data: {
        labels: allDatesDeath,
        datasets: [ 
            {
                    label: 'Alle aldersgrupper',
                    data: allDeath,
                    // data: casesSum,
                    borderColor: window.chartColors.black,
                    backgroundColor:  window.chartColors.lightgrey,
                    fill: true,
                    showLine: true,
                    lineTension: 0,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    id: 'sumDeath',
            }
        ]
    },
    options: {
        responsive: true,
        aspectRatio: 3,
        legend: {
            position: 'top',
            labels: {
            usePointStyle: true,
            }
        },
        scales: {
            xAxes: [{
                type: 'time',
                    time: {
                        unit: 'month',
                        stepSize: 1,
                        // unit: 'week',
                        // tooltipFormat:'MM/DD/YYYY', 
                        // tooltipFormat:'DD/MM - YYYY', 
                        tooltipFormat:'[Uge ]w[, ] DD[.] MMMM - YYYY', 
                        // min: new Date('1917-01-01'), 
                        // max: curMaxDate
                        displayFormats: {
                            week: '[Uge ]w[, ]YYYY', 
                            month: 'MMMM YYYY'
                        }
                },
                display: true,
                scaleLabel: {
                display: true
                },            
                // ticks: {
                //     // min: curMinDate,
                //     min: new Date('1917-01-01'),
                //     max: curMaxDate
                // }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    fontSize: 20,
                    display: true,
                    labelString: 'Dødsfald'
                }
            }]
        }
    }
};
    
let saveButton = document.getElementById('saveButton');
let xlim1_slider = document.getElementById('xlim1');
let xlim1Label = document.getElementById('xlim1Label');
let xlim2_slider = document.getElementById('xlim2');
let xlim2Label = document.getElementById('xlim2Label');
let Checkbox0 = document.getElementById('Checkbox0');
let Checkbox1 = document.getElementById('Checkbox1');
let Checkbox5 = document.getElementById('Checkbox5');
let Checkbox15 = document.getElementById('Checkbox15');
let Checkbox65 = document.getElementById('Checkbox65');
let CheckboxSum = document.getElementById('CheckboxSum');
let show0 = Checkbox0.checked;
let show1 = Checkbox1.checked;
let show5 = Checkbox5.checked;
let show15 = Checkbox15.checked;
let show65 = Checkbox65.checked;
let showSum = CheckboxSum.checked;

let radioNorm = document.getElementsByName('norm');

// function addData(chart, label, data) {
//     chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(data);
//     });
//     chart.update();
// }

// function removeData(chart){
//     chart.data.labels.pop();
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.pop();
//     });
//     chart.update();
// }

// On loading the page, make the chartjs figures
window.onload = function() {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.mainChart = new Chart(ctx, chartConfig);
    var ctxDeath = document.getElementById('canvasDeath').getContext('2d');
    window.DeathChart = new Chart(ctxDeath, chartDeathConfig);
    updateChart();

    // // Define the data
    // var sumDeath = {
    //     label: 'Alle aldersgrupper',
    //     data: allDeath,
    //     // data: casesSum,
    //     borderColor: window.chartColors.black,
    //     backgroundColor:  window.chartColors.black,
    //     fill: false,
    //     showLine: true,
    //     lineTension: 0,
    //     pointRadius: 2,
    //     pointHoverRadius: 5,
    //     id: 'sumDeath',
    // };
    // // Add to chart
    // chartDeathConfig.data.datasets.push(sumDeath);

    // Initialize according to defaults set in html document
    Checkbox0.onchange();
    Checkbox1.onchange();
    Checkbox5.onchange();
    Checkbox15.onchange();
    Checkbox65.onchange();
    CheckboxSum.onchange();
    // xlim1_slider.onchange();
    // xlim2_slider.onchange();
    
}

var updateChart = function(){

    curMinDate = numToDate(xlim1_slider.value);
    curMaxDate = numToDate(xlim2_slider.value);
    
    window.mainChart.options.scales.xAxes[0].time.min = curMinDate;
    window.mainChart.options.scales.xAxes[0].time.max = curMaxDate;
    window.DeathChart.options.scales.xAxes[0].time.min = curMinDate;
    window.DeathChart.options.scales.xAxes[0].time.max = curMaxDate;

    if (showRatioK){
        window.mainChart.options.scales.yAxes[0].scaleLabel.labelString = 'Tilfælde per 1000';
    } else {
        window.mainChart.options.scales.yAxes[0].scaleLabel.labelString = 'Antal tilfælde';
    }

    // Update chart
    window.mainChart.update();
    window.DeathChart.update();
}

// function addAllDeathData(){
//     // Define the data
//     var sumDeath = {
//         label: 'Alle aldersgrupper',
//         data: allDeath,
//         // data: casesSum,
//         borderColor: window.chartColors.black,
//         backgroundColor:  window.chartColors.black,
//         fill: false,
//         showLine: true,
//         lineTension: 0,
//         pointRadius: 2,
//         pointHoverRadius: 5,
//         id: 'sumDeath',
//     };
//     // Add to chart
//     chartDeathConfig.data.datasets.push(sumDeath);

// }

// currentValue = 0
function handleClick(myRadio) {
    if (myRadio.value == 'ratioK'){
        showRatioK = true;
    } else {
        showRatioK = false;
    }
    
    // Clear all datasets
    for (let k = chartConfig.data.datasets.length ; k > 0; k--) {
        chartConfig.data.datasets.pop()   
    }
    // Add them again
    Checkbox0.onchange();
    Checkbox1.onchange();
    Checkbox5.onchange();
    Checkbox15.onchange();
    Checkbox65.onchange();
    CheckboxSum.onchange();
    
    
    updateChart();
}
function fillCanvasBackgroundWithColor(canvas, color) {
    // From https://stackoverflow.com/questions/50104437/set-background-color-to-save-canvas-chart/50126796#50126796

    // Get the 2D drawing context from the provided canvas.
    const context = canvas.getContext('2d');
  
    // We're going to modify the context state, so it's
    // good practice to save the current state first.
    context.save();
  
    // Normally when you draw on a canvas, the new drawing
    // covers up any previous drawing it overlaps. This is
    // because the default `globalCompositeOperation` is
    // 'source-over'. By changing this to 'destination-over',
    // our new drawing goes behind the existing drawing. This
    // is desirable so we can fill the background, while leaving
    // the chart and any other existing drawing intact.
    // Learn more about `globalCompositeOperation` here:
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    context.globalCompositeOperation = 'destination-over';
  
    // Fill in the background. We do this by drawing a rectangle
    // filling the entire canvas, using the provided color.
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Restore the original context state from `context.save()`
    context.restore();
  }

saveButton.onclick = function(){
    // Hacked together way for saving the figure using just javascript

    // Set the background color 
    // (From https://stackoverflow.com/questions/50104437/set-background-color-to-save-canvas-chart/50126796#50126796 )
    const canvas = document.getElementById('canvas');
    fillCanvasBackgroundWithColor(canvas, 'white');

    // Convert to image
    var url=window.mainChart.toBase64Image();

    // Make a link element for download, click it, delete it again
    // (From second answer of https://stackoverflow.com/questions/17311645/download-image-with-javascript )
    var a = document.createElement('a');
    a.href = url;
    a.download = "SpanskSygeFigur.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // console.log('Done saving');
}

xlim1_slider.onchange = function(){
    curMinDate = numToDate(xlim1_slider.value);

    // xlim1Label.innerHTML ='Første dag: '+curMinDate.getDate()+'/'+curMinDate.getMonth()+' - 19'+curMinDate.getYear();
    var minDateMoment = moment(curMinDate)
    xlim1Label.innerHTML ='Første dag: '+minDateMoment.format('DD[. ]MMM[ - ]YYYY');
    
    // Set the minimum of xlim2 slider
    var minOnMax = parseInt(xlim1_slider.value)
    xlim2_slider.setAttribute("min", minOnMax+1);

    // Update chart
    updateChart();

}
xlim2_slider.onchange = function(){
    curMaxDate = numToDate(xlim2_slider.value);

    // xlim2Label.innerHTML ='Sidste dag: '+curMaxDate.getDate()+'/'+curMaxDate.getMonth()+' - 19'+curMaxDate.getYear();
    var maxDateMoment = moment(curMaxDate)
    xlim2Label.innerHTML ='Sidste dag: '+maxDateMoment.format('DD[. ]MMM[ - ]YYYY');
    
    // Set the maximum of xlim2 slider
    var maxOnMin = parseInt(xlim2_slider.value)
    xlim1_slider.setAttribute("max", maxOnMin-1);

    // Update chart
    updateChart();

}



CheckboxSum.onchange = function(){
    showSum = CheckboxSum.checked;

    var curData;
    if (showRatioK){
        curData = ratioKSum
    } else {
        curData = casesSum
    }

    // Summed data
    if (showSum){
        // Define the data
        var sumData =     {
            label: 'Alle aldersgrupper',
            data: curData,
            // data: casesSum,
            borderColor: window.chartColors.black,
            backgroundColor:  window.chartColors.black,
            fill: false,
            showLine: true,
            lineTension: 0,
            pointRadius: 2,
            pointHoverRadius: 5,
            id: 'sumData',
        };
        // Add to chart
        chartConfig.data.datasets.push(sumData);

    } else {
        // Look for the dataset
        chartConfig.data.datasets.find((dataset, index) => {
            // When found, delete it
            if (dataset.id === 'sumData') {
                chartConfig.data.datasets.splice(index, 1);
                return true; // stop searching
            }
        });
    }

    // Update the chart
    updateChart();
}
Checkbox0.onchange = function(){
    show0 = Checkbox0.checked;
    
    var curData;
    if (showRatioK){
        curData = ratioK0_1
    } else {
        curData = cases0_1
    }

    // 0 - 1 årige
    if (show0){
        // Define the data
        var data0 =     {
            label: '< 1 år',
            data: curData,
            borderColor: window.chartColors.blue,
            backgroundColor:  window.chartColors.blue,
            fill: false,
            showLine: true,
            lineTension: 0,
            pointRadius: 2,
            pointHoverRadius: 5,
            id: 'data0',
        };
        // Add to chart
        chartConfig.data.datasets.push(data0);

    } else {
        // Look for the dataset
        chartConfig.data.datasets.find((dataset, index) => {
            // When found, delete it
            if (dataset.id === 'data0') {
                chartConfig.data.datasets.splice(index, 1);
                return true; // stop searching
            }
        });
    }
    updateChart();
}
Checkbox1.onchange = function(){
    show1 = Checkbox1.checked;
        
    var curData;
    if (showRatioK){
        curData = ratioK1_4
    } else {
        curData = cases1_4
    }

    // 1 - 4 årige
    if (show1){
        // Define the data
        var data1 =     {
            label: '1 - 4 år',
            data: curData,
            borderColor: window.chartColors.green,
            backgroundColor:  window.chartColors.green,
            fill: false,
            showLine: true,
            lineTension: 0,
            pointRadius: 2,
            pointHoverRadius: 5,
            id: 'data1',
        };
        // Add to chart
        chartConfig.data.datasets.push(data1);

    } else {
        // Look for the dataset
        chartConfig.data.datasets.find((dataset, index) => {
            // When found, delete it
            if (dataset.id === 'data1') {
                chartConfig.data.datasets.splice(index, 1);
                return true; // stop searching
            }
        });
    }

    updateChart();
}
Checkbox5.onchange = function(){
    show5 = Checkbox5.checked;
        
    var curData;
    if (showRatioK){
        curData = ratioK5_14
    } else {
        curData = cases5_14
    }

    // 5 - 14 årige
    if (show5){
        // Define the data
        var data5 =     {
            label: '5 - 14 år',
            data: curData,
            borderColor: window.chartColors.yellow,
            backgroundColor:  window.chartColors.yellow,
            fill: false,
            showLine: true,
            lineTension: 0,
            pointRadius: 2,
            pointHoverRadius: 5,
            id: 'data5',
        };
        // Add to chart
        chartConfig.data.datasets.push(data5);

    } else {
        // Look for the dataset
        chartConfig.data.datasets.find((dataset, index) => {
            // When found, delete it
            if (dataset.id === 'data5') {
                chartConfig.data.datasets.splice(index, 1);
                return true; // stop searching
            }
        });
    }
    
    updateChart();
}
Checkbox15.onchange = function(){
    show15 = Checkbox15.checked;
        
    var curData;
    if (showRatioK){
        curData = ratioK15_64
    } else {
        curData = cases15_64
    }

    // 15 - 64 årige
    if (show15){
        // Define the data
        var data15 =     {
            label: '15 - 64 år',
            data: curData,
            borderColor: window.chartColors.purple,
            backgroundColor:  window.chartColors.purple,
            fill: false,
            showLine: true,
            lineTension: 0,
            pointRadius: 2,
            pointHoverRadius: 5,
            id: 'data15',
        };
        // Add to chart
        chartConfig.data.datasets.push(data15);

    } else {
        // Look for the dataset
        chartConfig.data.datasets.find((dataset, index) => {
            // When found, delete it
            if (dataset.id === 'data15') {
                chartConfig.data.datasets.splice(index, 1);
                return true; // stop searching
            }
        });
    }
    
    updateChart();
}
Checkbox65.onchange = function(){
    show65 = Checkbox65.checked;
        
    var curData;
    if (showRatioK){
        curData = ratioK65
    } else {
        curData = cases65
    }

    // 65+ årige
    if (show65){
        // Define the data
        var data65 =     {
            label: '65+ år',
            data: curData,
            borderColor: window.chartColors.red,
            backgroundColor:  window.chartColors.red,
            fill: false,
            showLine: true,
            lineTension: 0,
            pointRadius: 2,
            pointHoverRadius: 5,
            id: 'data65',
        };
        // Add to chart
        chartConfig.data.datasets.push(data65);

    } else {
        // Look for the dataset
        chartConfig.data.datasets.find((dataset, index) => {
            // When found, delete it
            if (dataset.id === 'data65') {
                chartConfig.data.datasets.splice(index, 1);
                return true; // stop searching
            }
        });
    }
    
    updateChart();
}



// , function(d) {
//     return {
//         date: d.casesSum,
//     //   year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
//     //   make: d.Make,
//     //   model: d.Model,
//     //   length: +d.Length // convert "Length" column to number
//     };
//   }, function(error, rows) {
//     console.log(rows);
//   });
// d3.csv("Spansk_Syge_I_Cph.csv").row(function(d) { return {key: d.key, value: +d.value}; }).get(function(error, rows) { console.log(rows); });
//  // Plot the data with Chart.js
//  function makeChart(countries) {
//    var countryLabels = date.map(function (d) {
//      return d.date;
//    });
//    var populationData = casesSum.map(function (d) {
//      return d.casesSum;
//    });

//    var chart = new Chart("myChart", {
//      type: "bar",
//      data: {
//        labels: countryLabels,
//        datasets: [
//          {
//            data: populationData 
//          }
//        ]
//      }
//    });
//  }