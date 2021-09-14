// Function to return all unique values in an array
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
};

// Function to return all indexes of a specific element value in an array
function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] == val)
            indexes.push(i);
    return indexes;
};

// Event listener function for when a dropdown is changed
function selectChange() {

    // Create empty columns array
    columns = [];
    
    // For each element in the keys array...
    df_k.forEach((element, id) => {
        // Add the element along with a 'title' key to the columns array
        columns.push({"title": element});
    });

    // Convert object array into array array for use with DT
    df_v.forEach((element, index) => {
        df_v[index] = Object.values(element);
    });

    // Maps the columns back into rows to be used by DataTables
    var val_cols = df_v[0].map(function(col, i) {
        return df_v.map(function(row) {
            return row[i];
        });
    });
    
    // Get all indexs in the session_nums array of the chosen dropdown value
    df_ser_index = getAllIndexes(session_nums, $(this).val());
    
    // Filter the rows to only include those with the same ID value selected
    val_cols = df_ser_index.map((item) => val_cols[item]);

    // Calculate the table ID number
    i = this.id - 1;

    // If that table ID corresponds to an existing table
    if (tables[i] !== null) {
        // Destroy the table and empty its DOM element
        tables[i].destroy();
        tables[i] = null;
        $(this).parent().find('table').empty();
    };
    // Set the tables array element to the corresponding table DOM element
    tables[i] = $(this).parent().find('table').DataTable({
        data: val_cols,
        columns: columns,
        scrollY:        "440px",
        scrollX:        true,
        scrollCollapse: true,
        paging:         false,
        fixedHeader:    true,
        fixedColumns:   true
    });
};

function cardFadeOut(card) {
    // Removes entrance animation and applies the exit animation
    $(card).parents(".card").removeClass('fadeIn_slow');
    $(card).parents(".card").addClass('fadeOut_slow');

    return card;
};

// Event listener function for when the cross of a card is clicked
function deleteCard() {
    // As long as there is at least one card...
    if ($('.compare_card').length > 1) {
        // Variable for highest id of card to be stored in
        var card_id = this.id;

        // Makes sure animation plays before carrying on
        const promiseA = Promise.resolve(cardFadeOut(this));

        // Makes sure animation Promise is complete before moving on
        // TODO: try and get working without Timeout
        Promise.all([promiseA]).then(function(card) {
            setTimeout(() => {
                return Promise.resolve($(card).parents(".compare_card").remove());
            }, 1200);
        });
        
        // As long as the card ID is greater than -1
        if (card_id-1 > -1) {
            // Splice the tables array to remove the deleted table
            tables.splice(card_id-1, 1);
        };

    // If there is only one card...
    } else {
        console.log("Do you really want to delete the last card?")
    };
};

// Event listener function for when the plus button is pressed
function create_card() {

    // Fetch the full list of session IDs
    session_nums = Object.values(df_v[df_k.indexOf("SessionId")]);

    // Filter the list to only show each ID once
    var unique_nums = session_nums.filter(onlyUnique);

    // Function to sort number strings numerically?
    unique_nums.sort(function(a, b) {
        return a - b;
    });
    
    // Fetch dropdown from DOM
    dropdown = document.getElementsByClassName("serial_num_select")[0];
    // For each unique ID, create an option in the dropdown
    var options = "";
    unique_nums.forEach((element, index) => {
        options += "<option id="+index+" value="+element+">"+element+"</option>";
    });
    dropdown.innerHTML += options;

    // Fetch the cards element
    cards = document.getElementById('cards');
    
    // Fetch the first card with class compare_card
    var first_compare = $('.compare_card').first()
    
    // Clone the first card
    compare_copy = first_compare.clone(true);

    // Attach event listeners to elements on the first card
    first_compare.find('select').bind('change', selectChange).trigger('change');
    first_compare.find('button').bind('click', deleteCard);

};

// Function to fetch data using an API
function fetch_data() {

    // Set up AJAX request to fetch_df API
    $.ajax({
        method: 'GET',
        url: '/apis/fetch_df'// + 'chameleon.db'
    })
    .done(function ( data ) {
        
        // Declared in compare.html.j2 file so jinja2 can substitute it in
        // Parse the JSON string into an object
        df = JSON.parse(data);

        // Extract the keys from the df JSON object
        df_k = Object.keys(df);
        // Extract the values from the df JSON object
        df_v = Object.values(df);
    
        // Create card here so it makes sure to wait until data fetched
        create_card()
    });
};

//  Set up global variables
var df;
var df_k = null;
var df_v = null;

var tables = [null];
var session_nums = null;

var cards = null;
var compare_copy = null;

// Call before document.ready
fetch_data();

// Once the DOM is fully loaded...
$(document).ready(function() {

    // Event listener for when the "Add Table" button is clicked
    $("#add_table").click(function () {
        // Initialize ids array
        var ids = [];

        // Get IDs of all current cards
        $('.compare_card').each(function() {
            ids.push($(this).prop('id'));
        });

        // Clone the original card
        compare_temp = compare_copy.clone(true).insertBefore("#buttons");
        compare_id = compare_temp.prop("id");

        // While any id matches, increment until an unused id is found
        while (ids.some((val) => val == compare_id)) {
            compare_id++;
        };

        // Push a temporary null object to be overwritten by a table object in a bit
        tables.push(null);

        // Change the id of the cloned card to the next available one
        compare_temp.attr("id", compare_id);
        // Change the text for the card to be the same as its id
        compare_temp.find('.card_name').text("Card "+compare_temp.prop("id"));
        compare_temp.find('select').attr('id',compare_temp.prop('id'));

        // Find specific DOM elements and bind event listeners to then
        compare_temp.find('select').bind('change', selectChange).trigger('change');
        compare_temp.find('button').bind('click', deleteCard);

        // Find the datatable DOM element and attach the relevant id to it
        compare_temp.find('.data_table').attr('id',compare_temp.prop('id'));

    });

});
