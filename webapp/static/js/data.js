// For Chart
function generateChart(x_axis, x_data, y_axis, y_data) {
    
    var data = [];
    x_data.forEach((element, index) => {
        data.push({x: x_data[index], y: y_data[index]});
    });
    
    var ctx = document.getElementById("myChart").getContext("2d");

    var myChart = new Chart(ctx, {
    type: "scatter",
    data: {
        datasets: [{
            label: y_axis,
            data: data,
            backgroundColor: 'rgb(78, 115, 223)'
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Original Data'
        },
        scales: {
            yAxes: [{
                ticks: {
                    min: 28,
                    max: 40,
                    beginAtZero:false
                }
            }]
        },
        elements: {
            point: {
                radius: 5
            }
        }
    },
    // Boolean - whether or not the chart should be responsive and resize when the browser does.

    responsive: true,

    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container

    maintainAspectRatio: false,
    });

return myChart;
};


/* Get the rows which are currently selected */
function fnGetSelected( oTableLocal )
{
    return oTableLocal.$('tr.dt_row_selected');
}

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

        //---------------------------------------------------------------------
        
        // For Checkboxes
        var check_div = document.getElementById('checkboxes');

        var ul = "<ul class='pl-3' style='-webkit-columns: 4;-moz-columns: 4;columns: 4'>"

        df_k.forEach((element, index) => {
            ul += "<div class='custom-checkbox mr-0'>"
            ul += "<input class='custom-control-input position-relative start-0' type='checkbox' name='checkbox' id="+element+" value="+index+" style='margin: .2rem'>"
            ul += "<label class='custom-control-label' for='"+element+"'>"+element+"</label>"
            ul += "</div>"
        });
        ul += "</ul>"

        check_div.innerHTML += ul
    })
};

var df;
var df_k = null;
var df_v = null;

// Call before document.ready to try and speed up loading of checkboxes
fetch_data();

$(document).ready(function() {

    var table = null;
    var chart = null;
    // var df_k = null;
    // var df_v = null;

    var xaxis = "";
    var xdata = null;
    var yaxis = "";
    var ydata = null;

    //---------------------------------------------------------------------

    // For Generate DataTable event listener
    $('a#generate').bind('click', function() {
        
        loading = document.getElementById('loading_spinner');
        loading.innerHTML += '<div class="d-flex justify-content-center mb-3"><div class="spinner-border text-primary" role="status"></div></div>';

        $.ajax({
            method: 'GET',
            url: '/apis/fetch_df'// + 'chameleon.db'
        })
        .done(function ( data ) {

            var df = JSON.parse(data);

            df_k = Object.keys(df);
            //console.log(df_k)
            df_v = Object.values(df);
            //console.log(df_v)

            // Needs to re-fetch df arrays for remaking the table arrays
            df_keys = df_k;
            df_vals = df_v;

            let boxIds = [];

            var check_div = document.getElementById('checkboxes');

            elems = check_div.getElementsByClassName('custom-control-input')
            for (let item of elems) {
                if ($(item).prop('checked')) {
                    boxIds.push($(item).prop('id'))
                };
            };

            var new_df_keys = []
            var new_df_vals = []
            if (boxIds.length === 0) {
                new_df_keys = df_keys;
                new_df_vals = df_vals;
                }
            else {
                df_keys.forEach((element, index) => {
                if (boxIds.includes(element)) {
                    var i = df_keys.indexOf(element);
                    new_df_keys.push(element);
                    new_df_vals.push(df_vals[i]);
                };
            });
            };

    //            // If boxIds contains any checkbox ids...
    //            if (boxIds.length > 0) {
    //                // Loop through every df key
    //                df_keys.forEach((element, index) => {
    //
    //                    // get the key index
    //                    var key_i = index //df_keys.indexOf(element);
    ////                    new_df_keys.push(element);
    ////                    new_df_vals.push(df_vals[i]);
    ////                    if (boxIds.includes(element)) {
    //
    //                    // Filter out any keys that are in the boxIds array
    //                    df_keys = df_keys.filter(key => boxIds.includes(key));
    //                    // --WIP-- Filter out the corresponding value to that key
    //                    // ----- Loops through every df_key which wipes array from some reason
    //                    df_vals = df_vals.filter(function(val) {
    //                        return df_vals.indexOf(val) == key_i && key_i !== -1 && boxIds.includes(df_keys[key_i]);
    //                    });
    //                });
    //            };
    //            new_df_keys = df_keys;
    //            new_df_vals = df_vals;

            // Convert object array into array array for use with DT
            new_df_vals.forEach((element, index) => {
                new_df_vals[index] = Object.values(element);
            });


            columns = [];
            new_df_keys.forEach((element, id) => {
                columns.push({"title": element});
            });

            // Maps the columns back into rows to be used by DataTables
            var val_cols = new_df_vals[0].map(function(col, i) {
                return new_df_vals.map(function(row) {
                    return row[i];
                });
            });

            // Make cards visible again
            $('.invisible').each((i, card) => {
                $(card).removeClass('invisible');
                $(card).addClass('fadeIn_slowly');
            });
            $('#loading_spinner').empty();

            if (table !== null) {
                table.destroy();
                table = null;
                $("#data_table").empty();
            }
            table = $("#data_table").DataTable({
                data: val_cols,
                columns: columns,
                scrollY:        "440px",
                scrollX:        true,
                scrollCollapse: true,
                paging:         false,
                fixedHeader:    true,
                fixedColumns:   true
            });
            //});

            // Setup - add a text input to each footer cell
            $('.dataTable thead tr').clone(true).appendTo( '.dataTable thead' );
            $('.dataTable thead tr:eq(1) th').each( function (i) {
                // remove sorting classes/icons from cloning the header tags
                $(this).removeClass('sorting');
                $(this).removeClass('sorting_asc');

                var title = $(this).text();
                $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
        
                $( 'input', this ).on( 'keyup change', function () {
                    if ( table.column(i).search() !== this.value ) {
                        table
                            .column(i)
                            .search( this.value )
                            .draw();
                    }
                } );
            } );
            // Need to re-draw the table otherwise there is a duplicate header row in the table body???
            //TODO: fix ghost dupe header row creation
            table.draw();


            /* Add a click handler to the rows - this could be used as a callback */
            $(".dataTable tbody tr").click( function( e ) {
                if ( $(this).hasClass('dt_row_selected') ) {
                    $(this).removeClass('dt_row_selected');
                }
                else {
                    table.$('tr.dt_row_selected')//.removeClass('row_selected');
                    $(this).addClass('dt_row_selected');
                }
            });

            
            /* Add a click handler for the delete row */
            $('#delete').click( function() {
                var anSelected = fnGetSelected( table );
                $(anSelected).remove();
            } );


            //---------------------------------------------------------------------


            // For Select boxes
            axes = ['x', 'y'];
            var dropdown_div = document.getElementById('dropdowns');

            // If two select boxes already exist, remove them
            if ($('#dropdowns').find("select").length > 0) {
                $('#dropdowns').empty();
            };

            dropdown_div.innerHTML += "<form><div class='form-group form-inline'>"

            axes.forEach((axis, i) => {
                
                var select = "<label for="+axis+" style='font-size: 20px'>"+axis+":&nbsp</label><select name="+axis+" id="+axis+" class='custom-select custom-select-sm' style='width: 500px; margin-right: 25px; margin-bottom: 15px'>"

                new_df_keys.forEach((element, index) => {
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
                        xdata = Object.values(new_df_vals[select.val()]);
                    };
                    if (select.prop('id') == "y") {
                        yaxis = select.find('option:selected').prop('id');
                        ydata = Object.values(new_df_vals[select.val()]);
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

        })
    //---------------------------------------------------------------------


        return false;
    });

    //---------------------------------------------------------------------


});