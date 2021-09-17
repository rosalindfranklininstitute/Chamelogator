// Dropzone.autoDiscover = false;

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

const CHART_COLORS = {
    primary: 'rgb(90, 92, 105)',
    secondary: 'rgb(210, 35, 125)',
    third: 'rgb(255, 205, 86)',
    fourth: 'rgb(75, 192, 192)'
    // blue: 'rgb(54, 162, 235)',
    // purple: 'rgb(153, 102, 255)',
    // grey: 'rgb(201, 203, 207)'
};

const NAMED_COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.third,
    CHART_COLORS.fourth
    // CHART_COLORS.blue,
    // CHART_COLORS.purple,
    // CHART_COLORS.grey,
];
  
function namedColor(index) {
    return NAMED_COLORS[index % NAMED_COLORS.length];
  }

function AddChartJSDataset (axes, data) {
    //const data = chart.data;
    
    //
    dataset = {
        label: axes[1] + "(2)",
        data: data,
        yAxisID: 'y2',
        //pointRadius: 20,
        backgroundColor: "rgb(210, 35, 125, 0.05)",
        borderColor: "rgb(210, 35, 125, 1)",
        pointRadius: 1,
        pointBackgroundColor: "rgb(210, 35, 125, 1)",
        pointBorderColor: " rgb(210, 35, 125, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgb(210, 35, 125, 1)",
        pointHoverBorderColor: "rgb(210, 35, 125, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2
    }

    y2 = {
        title: {
            display: true,
            text: axes[1],
            color: CHART_COLORS.secondary
        },
        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        position: 'right',
        reverse: false,
        ticks: {
            min: 28,
            max: 40,
            beginAtZero:false,
            color: CHART_COLORS.secondary
        },
        grid: {
            drawOnChartArea: false // only want the grid lines for one axis to show up
        }
    }

    chart.data.datasets.push(dataset);
    chart.config.options.scales.y2 = y2;
    chart.update();

    $('remove_data').removeClass('invisible');

    // const dsColor = Utils.namedColor(chart.data.datasets.length);
    // const newDataset = {
    //     label: 'Dataset ' + (data.datasets.length + 1),
    //     backgroundColor: Utils.transparentize(dsColor, 0.5),
    //     borderColor: dsColor,
    //     data: Utils.bubbles({count: data.labels.length, rmin: 1, rmax: 1, min: 0, max: 100}),
    // };
    // chart.data.datasets.push(newDataset);
    // chart.update();
};

function RemoveChartJSDataset () {
    chart.data.datasets.pop();
    chart.config.options.scales.pop();
    chart.update();

    $('remove_data').addClass('invisible');
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

    x_max = Math.max.apply(null, xdata);
    y_max = Math.max.apply(null, ydata);

    const zoomOptions = {
        limits: {
            x: {min: -10, max: x_max+10, minRange: 50},
            y: {min: -10, max: y_max+10, minRange: 50}
        },
        pan: {
            enabled: true,
            mode: 'xy',
        },
        zoom: {
            wheel: {
                enabled: true,
            },
            pinch: {
                enabled: true
            },
            mode: 'xy',
            onZoomComplete({chart}) {
                // This update is needed to display up to date zoom level in the title.
                // Without this, previous zoom level is displayed.
                // The reason is: title uses the same beforeUpdate hook, and is evaluated before zoom.
                chart.update('none');
            }
        }
    };

    var config = {
        type: params.type,
        data: params.data,
        plugins: [background_plugin],
        options: {
            plugins: {
                title: {
                    display: true,
                    text: function({chart}) {
                        return 'Zoom: ' + (Math.round(((100/chart.getZoomLevel()) + Number.EPSILON) * 100) / 100) + "%"// + ', Pan: ' + panStatus()
                    }
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
                        labelTextColor: function(tooltipItem) {
                            var dataset = currentChart.config.data.datasets[tooltipItem.datasetIndex];
                            return dataset.pointBackgroundColor;
                        },
                        title: function(tooltipItem) {
                            var dataVal = tooltipItem[0].label;
                            return "[X] " + x_axis + ": " + dataVal;
                        },
                        label: function (tooltipItem) {
                            var dataset = currentChart.config.data.datasets[tooltipItem.datasetIndex];
                            var datasetLabel = dataset.label;
                            var datasetVal = tooltipItem.formattedValue;
                            return "[Y] " + datasetLabel + ": " + datasetVal;
                        }
                    }
                },
                zoom: zoomOptions,
            },
            // animation: {
            //     onComplete: () => {
            //         delayed = true;
            //     },
            //     delay: (context) => {
            //         let delay = 0;
            //         if (context.type === 'data' && context.mode === 'default' && !delayed) {
            //             delay = context.dataIndex * 1.02 + context.datasetIndex * 1.01;
            //         }
            //         return delay;
            //     },
            // },
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
                },
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
                    yAxisID: 'y',
                    //pointRadius: 20,
                    backgroundColor: "rgb(90, 92, 105, 0.05)",
                    borderColor: "rgb(90, 92, 105, 1)",
                    pointRadius: 1,
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

function upload_file() {
    
    var postData = new FormData($("#modal_form_id")[0]);
    console.log(postData);

    $.ajax({
        type:'POST',
        url: '/apis/upload',// + 'chameleon.db'
        data : postData,
        contentType: false,
        cache: false,
        processData: false
    })
    .done(function(data){
        $("#modal_input_id").val('');

        console.log("File Uploaded");
        
        var axes = data['axes'];
        var json_data = JSON.parse(data['data']);
        console.log(json_data[0]);
        // json_data.forEach((element) => {
        //     element['x'] = element['x'] + 1;
        // })


        // Check current chart for axes names
        if (xaxis == axes[0]) {
            AddChartJSDataset(axes, json_data)
        } else {
            console.log("This data doesn't have the same x-axis values!")
        };
    })
};

function limit_y() {

    y_limit_high = document.getElementById("y_limit_high");
    y_limit_low = document.getElementById("y_limit_low");

    console.log(y_limit_high.value);
    console.log(y_limit_low.value);

    console.log(chart.config.options.scales.y)

    chart.config.options.scales.y.min = y_limit_low.value;
    chart.config.options.scales.y.max = y_limit_high.value;

    console.log(chart.config.options.scales.y)

    chart.update();
    
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

        // Extract the x and y data from the chart object
        chart.getDatasetMeta(0).data.forEach((element) => {
            // Get the object element that contains the values for x and y
            elem = Object.values(Object.values(element)[5]);
            data.push({x: elem[0], y: elem[1]});
        });
        
        // https://stackoverflow.com/a/31536517/11051730
        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = Object.keys(data[0])
        const data_csv = [
        header.join(','), // header row first
        ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        ].join('\r\n')

        //console.log(data_csv)
        
        axes_titles = xaxis + "," + yaxis + "\n";

        var element = document.createElement('a');
        element.href = 'data:text/csv;charset=utf-8,' + encodeURI(axes_titles + data_csv);
        element.target = '_blank';
        element.download = 'export.csv';
        element.click();
    });

    // var myDropzone = new Dropzone('#modal_form_id', {
    //     maxFiles: 2000,
    //     url: "localhost:5000/upload_file",
    //     success: function (file, response) {
    //         console.log(response);
    //     }
    // })

    // // $('#modal_form_id').Dropzone({
    // //     maxFiles: 2000,
    // //     url: "/ajax_file_upload_handler/",
    // //     success: function (file, response) {
    // //         console.log(response);
    // //     }
    // // })

    $('#import_data_button').bind('click', upload_file);

    $('remove_data').bind('click', RemoveChartJSDataset)

    $('#y_limits_submit').bind('click', limit_y);

});
