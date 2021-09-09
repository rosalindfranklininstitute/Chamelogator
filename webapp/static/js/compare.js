function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
};

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] == val)
            indexes.push(i);
    return indexes;
};

function selectChange() {

    columns = [];
    df_k.forEach((element, id) => {
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
    
    df_ser_index = getAllIndexes(session_nums, $(this).val());
    
    val_cols = df_ser_index.map((item) => val_cols[item]);

    i = this.id - 1;

    if (tables[i] !== null) {
        tables[i].destroy();
        tables[i] = null;
        $(this).parent().find('table').empty();
    };
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
    $(card).parents(".card").removeClass('fadeIn_slow');
    $(card).parents(".card").addClass('fadeOut_slow');

    return card;
};

// Event listener for when the cross of a card is clicked
function deleteCard() {
    if ($('.compare_card').length > 1) {
        // Variable for highest id of card to be stored in
        var card_id = this.id;

        // Makes sure animation plays before carrying on
        const promiseA = Promise.resolve(cardFadeOut(this));

        // TODO: try and get working without Timeout
        Promise.all([promiseA]).then(function(card) {
            setTimeout(() => {
                return Promise.resolve($(card).parents(".compare_card").remove());
            }, 1200);
        });
        
        if (card_id-1 > -1) {
            tables.splice(card_id-1, 1);
        };

    } else {
        console.log("Do you really want to delete the last card?")
    };
};

function create_card() {

    session_nums = Object.values(df_v[df_k.indexOf("SessionId")]);

    var unique_nums = session_nums.filter(onlyUnique).sort();

    dropdown = document.getElementsByClassName("serial_num_select")[0];
    var options = "";
    unique_nums.forEach((element, index) => {
        options += "<option id="+index+" value="+element+">"+element+"</option>";
    });
    dropdown.innerHTML += options;

    // Fetch the cards element
    cards = document.getElementById('cards');
    
    var first_compare = $('.compare_card').first()
    
    // Fetch the first card and clone it
    compare_copy = first_compare.clone(true);

    first_compare.find('select').bind('change', selectChange).trigger('change');
    first_compare.find('button').bind('click', deleteCard);

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
    
        // Create card here so it makes sure to wait until data fetched
        create_card()
    });
};

var df;
var df_k = null;
var df_v = null;

var tables = [null];
var session_nums = null;

var cards = null;
var compare_copy = null;

// Call before document.ready
fetch_data();

$(document).ready(function() {

    // setTimeout(() => {
    //     create_card();
    // }, 20);


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

        tables.push(null);

        // Change the id of the cloned card to the next available one
        compare_temp.attr("id", compare_id);
        // Change the text for the card to be the same as its id
        compare_temp.find('.card_name').text("Card "+compare_temp.prop("id"));
        compare_temp.find('select').attr('id',compare_temp.prop('id'));

        // DOES THIS WORK????
        compare_temp.find('select').bind('change', selectChange).trigger('change');
        compare_temp.find('button').bind('click', deleteCard);

        compare_temp.find('.data_table').attr('id',compare_temp.prop('id'));

        // Add the new card to the cards div
        //cards.innerHTML += compare_temp.prop('outerHTML');
    });

    //$("select").each(selectEach).trigger("change");

});
