/**
 * Created by Jeremy on 4/16/16.
 */


/**
 * helper function to access daily statistical information from database
 */

// define set of data points
var dataPoints = [];
// define remove chart control variable
var updateInterval = 1000;

var IntervalID_1 = window.setInterval(dailyStaCal,updateInterval);
// calcualte the daily statistic data
function dailyStaCal(event) {
    var date = document.getElementById('dayDate').value;
    var route = document.getElementById('dayRoute').value;
    var type = 'daily';
    var transInfo = "?Type=" + 'daily' + "&Date=" + date + "&Route=" + route;
    $.ajax({
        url: "/dailyStaCal/" + transInfo, success: function (result) {
            console.log(result);
            if (result!='null') {
                var data = JSON.parse(result);
                for (var key in data[0]) {
                    if (data[0].hasOwnProperty(key)) {
                        dataPoints.push({x:new Date( "Fri Apr 22 2016 " + key + " UTC+2000"),
                                         y:Number(data[0][key])});
                        DrawGraph(type)
                    }
                }

            }
            else{
                DrawGraph(type)
            }
        }
    });
}

var IntervalID_2 = window.setInterval(monthlyStaCal,updateInterval);
// calcualte the monthly statistic data
function monthlyStaCal(event) {
    var date = document.getElementById('monthDate').value;
    var route = document.getElementById('monthRoute').value;
     var type = 'monthly';
    var transInfo = "?Type=" + 'monthly' + "&Date=" + date + "&Route=" + route;
    $.ajax({
        url: "/monthlyStaCal/" + transInfo, success: function (result) {
            console.log(result);
            if (result!='null') {
                var data = JSON.parse(result);
                for (var key in data[0]) {
                    if (data[0].hasOwnProperty(key)) {
                        var yearAndMonth = key.split('/');
                        dataPoints.push({x:new Date(yearAndMonth[1],Number(yearAndMonth[0])-1), y:Number(data[0][key])});
                        DrawGraph(type)
                    }
                }

            }
            else{
                DrawGraph(type)
            }
        }
    });
}

var IntervalID_3 = window.setInterval(yearlyStaCal,updateInterval);
// calcualte the monthly statistic data
function yearlyStaCal(event) {
    var date = document.getElementById('yearDate').value;
    var route = document.getElementById('yearRoute').value;
     var type = 'yearly';
    var transInfo = "?Type=" + 'yearly' + "&Date=" + date + "&Route=" + route;
    $.ajax({
        url: "/yearlyStaCal/" + transInfo, success: function (result) {
            console.log(result);
            if (result!='null') {
                var data = JSON.parse(result);
                for (var key in data[0]) {
                    if (data[0].hasOwnProperty(key)) {
                        console.log(key);
                        dataPoints.push({x:new Date(key,0), y:Number(data[0][key])});
                        DrawGraph(type)
                    }
                }

            }
            else{
                DrawGraph(type)
            }
        }
    });
}


/**
 *  helper funciton to draw charts
 */

// the draw graph funcion is a wrapper function
// which contains and call the updateChart function
function DrawGraph(type) {
    var dataLength = 20;
    // updateChart
    switch(type) {
        case 'daily':
            updateDailyChart(dataLength);
            break;
        case 'monthly':
            updateMonthlyChart(dataLength);
            break;
        case 'yearly':
            updateYearlyChart(dataLength);
    }
}

// below codes are written by referencing
// the example codes on canvasjs website
var updateDailyChart = function (dataLength) {
    // define chart
    var chart  = new CanvasJS.Chart("chart_day_div", {
        zoomEnable: true,
        title: {
            text: "Number of Students Taking Escort Daily"
        },
        axisX: {
            valueFormatString: "HH:mm",
            interval: 1,
            intervalType: "hour",
            title: "Time",
            gridColor: "white",
            gridThickness: 0,
            labelFontSize: 13,
            labelAngle: -60
        },
        axisY: {
            title: "Number Of Students"
        },
        data: [{
            toolTipContent: "Time:{x} <br> Opens:<strong>y</strong>",
            type: "column",
            dataPoints: dataPoints
        }]
    });
    if(dataPoints != []) {
       clearDataPoints();  // reinitialize dataPoints
    }
    chart.render();
    if (dataPoints.length > dataLength) {
        dataPoints.shift();
    }
};

var updateMonthlyChart = function (dataLength) {
    // define chart
    var chart  = new CanvasJS.Chart("chart_month_div", {
        zoomEnable: true,
        title: {
            text: "Number of Students Taking Escort Daily"
        },
        axisX: {
            valueFormatString: "MMM",
            interval: 1,
            intervalType: "month",
            title: "Month",
            gridColor: "white",
            gridThickness: 0,
            labelFontSize: 13,
            labelAngle: -60
        },
        axisY: {
            title: "Number Of Students"
        },
        data: [{
            toolTipContent: "Time:{x} <br> Opens:<strong>y</strong>",
            type: "column",
            dataPoints: dataPoints
        }]
    });
    if(dataPoints != []) {
       clearDataPoints();  // reinitialize dataPoints
    }
    chart.render();
    if (dataPoints.length > dataLength) {
        dataPoints.shift();
    }
};

var updateYearlyChart = function (dataLength) {
    // define chart
    var chart  = new CanvasJS.Chart("chart_year_div", {
        zoomEnable: true,
        title: {
            text: "Number of Students Taking Escort Daily"
        },
        axisX: {
            valueFormatString: "YYYY",
            interval: 1,
            intervalType: "year",
            title: "Year",
            gridColor: "white",
            gridThickness: 0,
            labelFontSize: 13,
            labelAngle: -60
        },
        axisY: {
            title: "Number Of Students"
        },
        data: [{
            toolTipContent: "Time:{x} <br> Opens:<strong>y</strong>",
            type: "column",
            dataPoints: dataPoints
        }]
    });
    if(dataPoints != []) {
       clearDataPoints();  // reinitialize dataPoints
    }
    chart.render();
    if (dataPoints.length > dataLength) {
        dataPoints.shift();
    }
};

//define a function to update dataPoints
function clearDataPoints(event){
    dataPoints = [];
}


$(document).ready(function(){
    $('#dayDate').change(dailyStaCal,clearDataPoints);
    $('#dayRoute').change(dailyStaCal,clearDataPoints);
    $('#monthDate').change(monthlyStaCal,clearDataPoints);
    $('#monthRoute').change(monthlyStaCal,clearDataPoints);
    $('#yearDate').change(yearlyStaCal,clearDataPoints);
    $('#yearRoute').change(yearlyStaCal,clearDataPoints);
    //the two events below are citied from github
    $('#selectMonthlyDate').datepicker({
         format: "mm/yyyy",
         startView: "months",
         minViewMode: "months"
    });
    $('#selectYearlyDate').datepicker({
         format: "yyyy",
         startView: "years",
         minViewMode:"years"
    });
});
