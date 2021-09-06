function check(x) {
    return x.every(i => (typeof i === "string"));
}

// https://stackoverflow.com/a/31405527/11051730
function sort_chart(chart, datasetIndex) {

    var temp_data = chart.data.datasets[datasetIndex].data;
    var temp_labels = chart.data.labels;
    
    temp_labels.sort(function(a, b) {
        return a - b;
      });
    
    // chart.data.datasets.forEach(function (dataset, i) {
    //     dataset.data.forEach(function (val, j) {
    //         val = temp_data[j];
    //     })
    // });

    chart.data.labels.forEach(function (label, j) {
        label = temp_labels[j];
    });
    
    // Reset the x-axis labels
    //chart.data.labels = ;

    chart.update();
};


function updateChart(currentChart, ctx, dataMap, x_axis, y_axis) {

    if(currentChart){currentChart.destroy();};

    //console.log(check(dataMap['line'].data.labels));

    //TYPE OF DATA TO DETERMINE
    if (true) {
        var determineChart = 'scatter';
    };

    var params = dataMap[determineChart];

    // Note: changes to the plugin code is not reflected to the chart,
    // because the plugin is loaded at chart construction time and editor
    // changes only trigger an chart.update().
    const background_plugin = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    var delayed;

    var config = {
        type: params.type,
        data: params.data,
        plugins: [background_plugin],
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: "rgb(255,255,255)",
                    titleMarginBottom: 10,
                    titleColor: '#6e707e',
                    titleFont: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 2,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                    callbacks: {
                        labelTextColor: function(label) {
                            return 'rgb(1,165,175)';
                        },
                        title: function(tooltipItem) {
                            var dataVal = tooltipItem[0].label;
                            return "[X] " + x_axis + ": " + dataVal;
                        },
                        label: function (tooltipItem) {
                            var datasetLabel = tooltipItem.formattedValue;
                            return "[Y] " + y_axis + ": " + datasetLabel;
                        }
                    }
                }
            },
            animation: {
                onComplete: () => {
                    delayed = true;
                },
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default' && !delayed) {
                        delay = context.dataIndex * 1.02 + context.datasetIndex * 1.01;
                    }
                    return delay;
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: x_axis
                    },
                    ticks: {
                        min: 28,
                        max: 40,
                        beginAtZero:false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: y_axis
                    },
                    ticks: {
                        min: 28,
                        max: 40,
                        beginAtZero:false
                    }
                }
            },
        },
        // Boolean - whether or not the chart should be responsive and resize when the browser does.

        responsive: true,

        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container

        maintainAspectRatio: false
    };


    //console.log(params);
    currentChart = new Chart(ctx, config);

    // setTimeout(function () {
    //     sort_chart(currentChart, 0)
    // }, 200);
    // currentChart.update();

    return currentChart;
};

function generateChart(x_axis, x_data, y_axis, y_data) {

    var data = [];
    x_data.forEach((element, index) => {
        data.push({x: x_data[index], y: y_data[index]});
    });
    
    var dataMap = {
        'scatter': {
            type: 'scatter',
            data: {
                labels: x_data,
                datasets: [{
                    label: y_axis,
                    data: data,
                    //pointRadius: 20,
                    backgroundColor: "rgb(90, 92, 105, 0.05)",
                    borderColor: "rgb(90, 92, 105, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgb(90, 92, 105, 1)",
                    pointBorderColor: " rgb(90, 92, 105, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgb(90, 92, 105, 1)",
                    pointHoverBorderColor: "rgb(90, 92, 105, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2
                }]
            }
        },
        // LINE PLOTS DONT SEEM TO WORK
        // 'line': {
        //     type: 'line',
        //     data: {
        //         labels: x_data,
        //         datasets: [{
        //             label: y_axis,
        //             data: data,
        //             lineTension: 0.3,
        //             backgroundColor: "rgb(90, 92, 105, 0.05)",
        //             borderColor: "rgb(90, 92, 105, 1)",
        //             pointRadius: 3,
        //             pointBackgroundColor: "rgb(90, 92, 105, 1)",
        //             pointBorderColor: " rgb(90, 92, 105, 1)",
        //             pointHoverRadius: 3,
        //             pointHoverBackgroundColor: "rgb(90, 92, 105, 1)",
        //             pointHoverBorderColor: "rgb(90, 92, 105, 1)",
        //             pointHitRadius: 10,
        //             pointBorderWidth: 2
        //         }]
        //     }
        // }
    };

    var currentChart;
    var ctx = document.getElementById("myChart").getContext("2d");

    return updateChart(currentChart, ctx, dataMap, x_axis, y_axis);

};

function create_selects() {

    // For Select boxes
    axes = ['x', 'y'];
    var select_div = document.getElementById('selects');

    select_div.innerHTML += "<form><div class='form-group form-inline'>"

    axes.forEach((axis, i) => {
        
        var select = "<label for="+axis+" style='font-size: 20px'>"+axis+":&nbsp</label><select name="+axis+" id="+axis+" class='custom-select custom-select-sm' style='width: 500px; margin-right: 25px; margin-bottom: 15px'>"

        df_k.forEach((element, index) => {
            select += "<option id="+element+" value="+index+">"+element+"</option>";
        });
        select += "</select>"

        select_div.innerHTML += select;
    });
    select_div.innerHTML += "</div></form>"

    $("select").each(function(){

        var select = $(this);

        select.change(function () {

            if (select.prop('id') == "x") {
                xaxis = select.find('option:selected').prop('id');
                xdata = Object.values(df_v[select.val()]);
            };
            if (select.prop('id') == "y") {
                yaxis = select.find('option:selected').prop('id');
                ydata = Object.values(df_v[select.val()]);
            };

            if (chart !== null) {
                chart.destroy();
                chart = null;
                $('myChart').empty();
            };
            if (xdata !== null && ydata !== null && xdata.length && ydata.length) {
                chart = generateChart(xaxis, xdata, yaxis, ydata);
            };

        });
    }).trigger('change');

};

function fetch_data() {

    $.ajax({
        method: 'GET',
        url: '/apis/fetch_df'// + 'chameleon.db'
    })
    .done(function ( data ) {
        // Declared in data.html.j2 file so jinja2 can substitute it in
        df = JSON.parse(data);

        df_k = Object.keys(df);
        //console.log(df_k)
        df_v = Object.values(df);
        //console.log(df_v)

        // Convert object array into array array for use with DT
        df_v.forEach((element, index) => {
            df_v[index] = Object.values(element);
        });

        create_selects();
    })
};

var df;
var df_k = null;
var df_v = null;

var chart = null;

var xaxis = "";
var xdata = null;
var yaxis = "";
var ydata = null;

// Call before document.ready
fetch_data();


$(document).ready(function() {

    // while (df_v === null) {
    //     continue
    // };

    $('#save_png').bind('click', function savePNG() {
        $('#save_png').attr('href', chart.toBase64Image());
        $('#save_png').attr('download', 'plot.png');
    });

    $('#export_data').bind('click', function exportCSV() {
        var data = [];

        console.log(chart.getDatasetMeta(0));
        // Extract the x and y data from the chart object
        chart.getDatasetMeta(0).data.forEach((element) => {
            elem = Object.values(element);
            data.push({x: elem[0], y: elem[1]});
        });
        
        json_data = JSON.stringify(data);
        
        axes_titles = "x:" + xaxis + "-y:" + yaxis + ";";

        var element = document.createElement('a');
        element.href = 'data:text/txt;charset=utf-8,' + encodeURI(axes_titles + json_data);
        element.target = '_blank';
        element.download = 'export.txt';
        element.click();
    });

});
