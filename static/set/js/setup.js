var $ = jQuery;

function to_update() {
    var business_type = $('#business_type').val();
    var granularity = $('#granularity').val();
    if (!(Math.floor(granularity) == granularity && $.isNumeric(granularity)) || granularity < 0 || granularity > 60) {
        alert('Save failed! Please enter a valid granularity.');
        return;
    }
    if (business_type == null) {
        alert('Save failed! Please select a business type.');
        return;
    }
    $.post(
        ajaxurl, {
            'action': 'ap_setup',
            'business_type': business_type,
            'granularity': granularity
        },
        function (res) {
            alert(res.message);
            if (res.status) {
                window.location.reload();
            }
        }
    );
}

function switch_business_type(event){
    var pre_defined_business_types = options.business_types;
    var bt = pre_defined_business_types[event.target.value];
    $('#icon').attr('src', bt.icon_url);
    $('#customer_title').text(bt.customer_title);
}

$(function () {
    var pre_defined_business_types = options.business_types;

    var sel = $('<select id="business_type">');
    sel.change(switch_business_type);
    for (var key in pre_defined_business_types) {
        var bt = pre_defined_business_types[key];
        sel.append($("<option>").val(key).text(bt.title));
        $('#icon').attr('src', bt.icon_url);
        $('#customer_title').text(bt.customer_title);
    }
    var bt = pre_defined_business_types[sel.val()];
    $('#icon').attr('src', bt.icon_url);
    $('#customer_title').text(bt.customer_title);
    $('#business_type_list').replaceWith(sel);
});