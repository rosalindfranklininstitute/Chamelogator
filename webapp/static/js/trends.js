function check(x) {
    return x.every(i => (typeof i === "string"));
}


function updateChart(currentChart, ctx, dataMap, x_axis, y_axis) {

    if(currentChart){currentChart.destroy();};

    //console.log(check(dataMap['line'].data.labels));

    //TYPE OF DATA TO DETERMINE
    if (true) {
        var determineChart = 'line';
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
            elements: {
                point: {
                    radius: 2
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
                datasets: [{
                    label: y_axis,
                    data: data,
                    backgroundColor: 'rgb(78, 115, 223)'
                }],
            }
        },
        'line': {
            type: 'line',
            data: {
                labels: x_data,
                datasets: [{
                    label: y_axis,
                    data: y_data
                }]
            }
        }
    };

    var currentChart;
    var ctx = document.getElementById("myChart").getContext("2d");

    return updateChart(currentChart, ctx, dataMap, x_axis, y_axis);

};

function savePNG(chart) {
    $('#save_png').attr('href', chart.toBase64Image());
    $('#save_png').attr('download', 'plot.png');
};

$(document).ready(function() {
    var chart = null;
    var df_k = null;
    var df_v = null;

    var xaxis = "";
    var xdata = null;
    var yaxis = "";
    var ydata = null;

    // Declared in data.html.j2 file so jinja2 can substitute it in
    //var df = {{ cham_df }};

    df_k = Object.keys(df);
    //console.log(df_k)
    df_v = Object.values(df);
    //console.log(df_v)

    // Convert object array into array array for use with DT
    df_v.forEach((element, index) => {
        df_v[index] = Object.values(element);
    });
    
    // For Select boxes
    axes = ['x', 'y'];
    var dropdown_div = document.getElementById('dropdowns');

    dropdown_div.innerHTML += "<form><div class='form-group form-inline'>"

    axes.forEach((axis, i) => {
        
        var select = "<label for="+axis+" style='font-size: 20px'>"+axis+":&nbsp</label><select name="+axis+" id="+axis+" class='custom-select custom-select-sm' style='width: 500px; margin-right: 25px; margin-bottom: 15px'>"

        df_k.forEach((element, index) => {
            select += "<option id="+element+" value="+index+">"+element+"</option>";
        });
        select += "</select>"

        dropdown_div.innerHTML += select;
    });
    dropdown_div.innerHTML += "</div></form>"

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

    $('#save_png').bind('click', savePNG(chart));

});
