// Function to generate a chart based on the data provided
function generateChart(x_axis, x_data, y_axis, y_data) {
    
    // Create an empty dara array
    var data = [];
    // For each element in the x_data array...
    x_data.forEach((element, index) => {
        // Push a JSON object to data array, pairing the x and y values
        data.push({x: x_data[index], y: y_data[index]});
    });
    
    // Get the chart element from the DOM
    var ctx = document.getElementById("myChart").getContext("2d");

    // Create a new Chart object using the DOM chart element and config options
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

// Return the chart to the function call
return myChart;
};


/* Get the rows which are currently selected */
function fnGetSelected( oTableLocal )
{
    return oTableLocal.$('tr.dt_row_selected');
}

// Function to fetch data using an API
function fetch_data() {

    // Set up AJAX request to fetch_df API
    $.ajax({
        method: 'GET',
        url: '/apis/fetch_df'// + 'chameleon.db'
    })
    .done(function ( data ) {
        // Declared in data.html.j2 file so jinja2 can substitute it in
        // Parse the JSON string into an object
        df = JSON.parse(data);

        // Extract the keys from the df JSON object
        df_k = Object.keys(df);
        // Extract the values from the df JSON object
        df_v = Object.values(df);

        //---------------------------------------------------------------------
        
        // Get the checkboxes fieldset DOM element
        var check_div = document.getElementById('checkboxes');

        // Set up an unordered list for the checkboxes
        var ul = "<ul class='pl-3' style='-webkit-columns: 4;-moz-columns: 4;columns: 4'>"

        // For each key from the dataframe...
        df_k.forEach((element, index) => {
            // Create a checkbox for that key
            ul += "<div class='custom-checkbox mr-0'>"
            ul += "<input class='custom-control-input position-relative start-0' type='checkbox' name='checkbox' id="+element+" value="+index+" style='margin: .2rem'>"
            ul += "<label class='custom-control-label' for='"+element+"'>"+element+"</label>"
            ul += "</div>"
        });
        ul += "</ul>"

        // Add the checkboxes to the checkbox fieldset DOM element
        check_div.innerHTML += ul
    })
};

//  Set up global variables
var df;
var df_k = null;
var df_v = null;

// Call before document.ready to try and speed up loading of checkboxes
fetch_data();

// Once the DOM is fully loaded...
$(document).ready(function() {

    //  Set up variables
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
        
        // Get loading_spinner element from DOM
        loading = document.getElementById('loading_spinner');
        // Activate loading spinner
        loading.innerHTML += '<div class="d-flex justify-content-center mb-3"><div class="spinner-border text-primary" role="status"></div></div>';

        // TODO: Replace this with fetch_data() function?
        $.ajax({
            method: 'GET',
            url: '/apis/fetch_df'// + 'chameleon.db'
        })
        .done(function ( data ) {

            // Parse the JSON string into an object
            df = JSON.parse(data);

            // Extract the keys from the df JSON object
            df_k = Object.keys(df);
            // Extract the values from the df JSON object
            df_v = Object.values(df);

            // Needs to re-fetch df arrays for remaking the table arrays
            df_keys = df_k;
            df_vals = df_v;

            // Create empty array for checkbox IDs
            let boxIds = [];

            // Fetch DOM element for checkbox fieldset
            var check_div = document.getElementById('checkboxes');

            // Fetch all checkboxes from the DOM
            elems = check_div.getElementsByClassName('custom-control-input')
            // For each checkbox...
            for (let item of elems) {
                // If the checkbox is checked...
                if ($(item).prop('checked')) {
                    // Push the checkbox ID to the boxIDs array
                    boxIds.push($(item).prop('id'))
                };
            };

            // Set up some empty arrays
            var new_df_keys = []
            var new_df_vals = []

            // If no checkboxes were selected...
            if (boxIds.length === 0) {
                // Use all keys and values in the dataframe
                new_df_keys = df_keys;
                new_df_vals = df_vals;
                }
            // Otherwise, if some checkboxes were selected...
            else {
                // For each key from the dataframe
                df_keys.forEach((element, index) => {
                    // If the keys is in boxIDs...
                    if (boxIds.includes(element)) {
                        // Get the index of the key in the dataframe
                        var i = df_keys.indexOf(element);
                        //Push the key and value to their respective arrays 
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

            // Create empty columns array
            columns = [];

            // For each element in the keys array...
            new_df_keys.forEach((element, id) => {
        // Add the element along with a 'title' key to the columns array
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
            // Remove the loading spinner as data now loaded
            $('#loading_spinner').empty();

            // If that table ID corresponds to an existing table
            if (table !== null) {
                // Destroy the table and empty its DOM element
                table.destroy();
                table = null;
                $("#data_table").empty();
            };
            // Set the tables array element to the corresponding table DOM element
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


            // Set up axes array for select boxes
            axes = ['x', 'y'];

            // Get DOM element for dropdown boxes
            var dropdown_div = document.getElementById('dropdowns');

            // If two select boxes already exist, remove them
            if ($('#dropdowns').find("select").length > 0) {
                $('#dropdowns').empty();
            };

            // Add some elements to the dropdown DOM element
            dropdown_div.innerHTML += "<form><div class='form-group form-inline'>"

            // For each axis...
            axes.forEach((axis, i) => {
                
                // Add a new dropdown
                var select = "<label for="+axis+" style='font-size: 20px'>"+axis+":&nbsp</label><select name="+axis+" id="+axis+" class='custom-select custom-select-sm' style='width: 500px; margin-right: 25px; margin-bottom: 15px'>"

                // Add a new option to that dropdown for every key in the filtered df array
                new_df_keys.forEach((element, index) => {
                    select += "<option id="+element+" value="+index+">"+element+"</option>";
                });
                select += "</select>"

                // Add the dropdown to the dropdown DOM element
                dropdown_div.innerHTML += select;
            });
            dropdown_div.innerHTML += "</div></form>"

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
                        xdata = Object.values(new_df_vals[select.val()]);
                    };
                    // If the ID of the dropdown is "y"...
                    if (select.prop('id') == "y") {
                        // Find the selected option's ID in the dropdown
                        yaxis = select.find('option:selected').prop('id');
                        // Get the values corresponding to the selected option
                        ydata = Object.values(new_df_vals[select.val()]);
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

        })

        // TODO: Is this needed at all? (don't know if it does anything)
        return false;
    });

});