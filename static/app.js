var $=jQuery;

function render_appt_types_list(appt_types){

    var appt_types_container=$("#appt_types");

    appt_types_container.empty();

    for(var i=0;i<appt_types.length;i++){(function(appt_type){
        var id=appt_type.id;
        var title=appt_type.title;
        var description=appt_type.description;
        var length=appt_type.length;

        var item=$("<div>");

        var item_title=$("<span>").html(title);
        var item_description=$("<span>").html(description);
        var item_length=$("<span>").html(length);

        item
            .append(item_title)
            .append(item_description)
            .append(item_length);

        appt_types_container.append(item);

    })(appt_types[i])}
}

function init_appt_types_list(){
    get_appt_types(function(res){
        render_appt_types_list(res);
    })
}

function get_appt_types(callback){
    $.post(ajax_object.ajax_url,{"action":"get_appt_types"},function(response){
        if(typeof callback=="function"){
            callback(response);
        }
    });
}

$(document).ready(function(){
    init_appt_types_list();
});