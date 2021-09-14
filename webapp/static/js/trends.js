// Function to check if every element in an array is a string
// NOT USED CURRENTLY?
function check(x) {
    return x.every(i => (typeof i === "string"));
}

// Function to sort numbers numerically
// (As they are stored as strings they are sorted alphabetically normally)
// https://stackoverflow.com/a/31405527/11051730
function sort_chart(chart, datasetIndex) {

    // Fetch the data and labels from the chart object
    var temp_data = chart.data.datasets[datasetIndex].data;
    var temp_labels = chart.data.labels;

    // Sort the numbers numerically
    temp_labels.sort(function(a, b) {
        return a - b;
    });
    
    // chart.data.datasets.forEach(function (dataset, i) {
    //     dataset.data.forEach(function (val, j) {
    //         val = temp_data[j];
    //     })
    // });

    // TODO: Need to sort data points so they line up with their label too???
    // For each label on the chart object...
    chart.data.labels.forEach(function (label, j) {
        // Replace it with the sorted label
        label = temp_labels[j];
    });
    
    // Reset the x-axis labels
    //chart.data.labels = ;

    // Update the chart to reflect the changes
    chart.update();
};

// Function to set up and update the chart
function updateChart(currentChart, ctx, dataMap, x_axis, y_axis) {

    // If a chart exists, destroy it
    if(currentChart){currentChart.destroy();};

    //console.log(check(dataMap['line'].data.labels));

    //TYPE OF DATA TO DETERMINE
    if (true) {
        var determineChart = 'scatter';
    };

    // Fetch config params based on chart type
    var params = dataMap[determineChart];

    // Note: changes to the plugin code is not reflected to the chart,
    // because the plugin is loaded at chart construction time and editor
    // changes only trigger an chart.update().
    
    // Plugin for chart to change background colour to white
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

    //  Config object for the chart setting options such as colours
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

    // Create the Chart object using the config object
    currentChart = new Chart(ctx, config);

    // Return the CHart object to the function call
    return currentChart;
};

// Function to generate a chart based on the data provided
function generateChart(x_axis, x_data, y_axis, y_data) {

    // Create an empty dara array
    var data = [];
    // For each element in the x_data array...
    x_data.forEach((element, index) => {
        // Push a JSON object to data array, pairing the x and y values
        data.push({x: x_data[index], y: y_data[index]});
    });
    
    // Set up config options for each type of chart
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
    // Get the chart element from the DOM
    var ctx = document.getElementById("myChart").getContext("2d");

    // Send data off to function to construct/update the chart
    // Then to function call
    return updateChart(currentChart, ctx, dataMap, x_axis, y_axis);

};

// Function to create the dropdowns
function create_selects() {

    // Set up axes array for select boxes
    axes = ['x', 'y'];

    // Get DOM element for dropdown boxes
    var select_div = document.getElementById('selects');

    // Add some elements to the dropdown DOM element
    select_div.innerHTML += "<form><div class='form-group form-inline'>"

    // For each axis...
    axes.forEach((axis, i) => {
        
        // Add a new dropdown
        var select = "<label for="+axis+" style='font-size: 20px'>"+axis+":&nbsp</label><select name="+axis+" id="+axis+" class='custom-select custom-select-sm' style='width: 500px; margin-right: 25px; margin-bottom: 15px'>"

        // Add a new option to that dropdown for every key in the filtered df array
        df_k.forEach((element, index) => {
            select += "<option id="+element+" value="+index+">"+element+"</option>";
        });
        select += "</select>"

        // Add the dropdown to the dropdown DOM element
        select_div.innerHTML += select;
    });
    select_div.innerHTML += "</div></form>"

    // For each dropdown...
    $("select").each(function(){

        // get the JQuery object of itself
        var select = $(this);

        // Bind a "change" event listener to the dropdown
        select.change(function () {

            // If the ID of the dropdown is "x"...
            if (select.prop('id') == "x") {
                // Find the selected option's ID in the dropdown
                xaxis = select.find('option:selected').prop('id');
                // Get the values corresponding to the selected option
                xdata = Object.values(df_v[select.val()]);
            };
            // If the ID of the dropdown is "y"...
            if (select.prop('id') == "y") {
                // Find the selected option's ID in the dropdown
                yaxis = select.find('option:selected').prop('id');
                // Get the values corresponding to the selected option
                ydata = Object.values(df_v[select.val()]);
            };

            // If the chart already exists
            if (chart !== null) {
                //Destroy the chart and empty its DOM element
                chart.destroy();
                chart = null;
                $('myChart').empty();
            };
            // As long as the data is valid...
            if (xdata !== null && ydata !== null && xdata.length && ydata.length) {
                // Generate the chart using the provided data
                chart = generateChart(xaxis, xdata, yaxis, ydata);
            };

        });
    // Trigger a ghost change to make chart render when the page loads
    }).trigger('change');

};

// Function to fetch data using an API
function fetch_data() {

    // Set up AJAX request to fetch_df API
    $.ajax({
        method: 'GET',
        url: '/apis/fetch_df'// + 'chameleon.db'
    })
    .done(function ( data ) {
        // Declared in trends.html.j2 file so jinja2 can substitute it in
        // Parse the JSON string into an object
        df = JSON.parse(data);

        // Extract the keys from the df JSON object
        df_k = Object.keys(df);
        // Extract the values from the df JSON object
        df_v = Object.values(df);

        // Convert object array into array array for use with DT
        df_v.forEach((element, index) => {
            df_v[index] = Object.values(element);
        });

        // Create the dropdown boxes
        create_selects();
    })
};

//  Set up global variables
var df;
var df_k = null;
var df_v = null;

var chart = null;

var xaxis = "";
var xdata = null;
var yaxis = "";
var ydata = null;

// Call before document.ready to try and speed up generation of chart
fetch_data();

// Once the DOM is fully loaded...
$(document).ready(function() {

    // Bind a "click" event listener to the element with ID save_PNG
    $('#save_png').bind('click', function savePNG() {
        // Add an attr to the element that converts the chart into an image URL
        $('#save_png').attr('href', chart.toBase64Image());
        // Add an attr that downloads the image using the image URL
        $('#save_png').attr('download', 'plot.png');
    });

    // Bind a "click" event listener to the element with ID export_data
    $('#export_data').bind('click', function exportCSV() {

        // Create empty data array
        var data = [];

        console.log(chart.getDatasetMeta(0));
        // For each dataset on the chart...
        chart.getDatasetMeta(0).data.forEach((element) => {
            // Extract the x and y data
            elem = Object.values(element);
            // and push it to the data array in JSON format
            data.push({x: elem[0], y: elem[1]});
        });
        
        // Convert the JSON object to string
        json_data = JSON.stringify(data);
        
        // Create a string of the x and y axis values
        axes_titles = "x:" + xaxis + "-y:" + yaxis + ";";

        // Create a ghost link element
        var element = document.createElement('a');
        // Attach some attr to it that puts the data in and downloads a txt file
        element.href = 'data:text/txt;charset=utf-8,' + encodeURI(axes_titles + json_data);
        element.target = '_blank';
        element.download = 'export.txt';
        element.click();
    });

});
