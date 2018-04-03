var $=jQuery;

function render_appt_types_list(appt_types){

    var appt_types_container=$("#appt_types_admin");

    appt_types_container.empty();

    appt_types_container.append(
        $("<tr>")
            .append($("<th>").html("Title"))
            .append($("<th>").html("Description"))
            .append($("<th>").html("Length"))
            .append($("<th>"))
            .append($("<th>"))
        );

    for(var i=0;i<appt_types.length;i++){(function(appt_type){
        var id=appt_type.id;
        var title=appt_type.title;
        var description=appt_type.description;
        var length=appt_type.length;

        var item=$("<tr>");

        var item_title=$("<td>").html(title);
        var item_description=$("<td>").html(description);
        var item_length=$("<td>").html(length);

        var item_edit=$("<button>").attr({"class":"appt_type_btn"}).html("Edit");
        var item_delete=$("<button>").attr({"class":"appt_type_btn"}).html("Delete");

        item_edit.click(function(){
            edit_appt_type_dialog_box(id,title,description,length);
        });

        item_delete.click(function(){
            delete_appt_type_dialog_box(id);
        });

        item
            .append(item_title)
            .append(item_description)
            .append(item_length)
            .append($("<td>").append(item_edit))
            .append($("<td>").append(item_delete));

        appt_types_container.append(item);

    })(appt_types[i])}
}

function init_appt_types_list(){
    get_appt_types(function(res){
        render_appt_types_list(res);
    })
}

function add_appt_type_dialog_box(){

    title_input=$("<input>").attr({"type":"text","placeholder":"Title"}).val("");
    description_input=$("<input>").attr({"type":"text","placeholder":"Description"}).val("");
    length_input=$("<input>").attr({"type":"text","placeholder":"Length"}).val("");

    dialog_box(
        function(dialog_box){
            dialog_box.append(
                $("<div>").attr({"class":"add_appt_type_dialog_box_container"})
                    .append($("<div>").attr({"class":"add_appt_type_dialog_box_title"}).html("Add an Appointment Type"))
                    .append(title_input)
                    .append(description_input)
                    .append(length_input)
            );
        },
        function(){
            if(isNaN(parseInt(length_input.val()))){
                alert("Please input a valid integer for length.");
                return false;
            }

            add_appt_type(
                title_input.val(),
                description_input.val(),
                length_input.val(),
                function(){
                    init_appt_types_list();
                }
            );
        }
    );
}

function edit_appt_type_dialog_box(id,title,description,length){
    title_input=$("<input>").attr({"type":"text","placeholder":"Title"}).val(title);
    description_input=$("<input>").attr({"type":"text","placeholder":"Description"}).val(description);
    length_input=$("<input>").attr({"type":"text","placeholder":"Length"}).val(length);

    dialog_box(
        function(dialog_box){
            dialog_box.append(
                $("<div>").attr({"class":"edit_appt_type_dialog_box_container"})
                    .append($("<div>").attr({"class":"edit_appt_type_dialog_box_title"}).html("Edit Appointment Type"))
                    .append(title_input)
                    .append(description_input)
                    .append(length_input)
            );
        },
        function(){
            if(isNaN(parseInt(length_input.val()))){
                alert("Please input a valid integer for length.");
                return false;
            }

            edit_appt_type(
                id,
                title_input.val(),
                description_input.val(),
                length_input.val(),
                function(){
                    init_appt_types_list();
                }
            );
        }
    );
}

function delete_appt_type_dialog_box(id){
    dialog_box(
        function(dialog_box){
            dialog_box.append(
                $("<div>").attr({"class":"delete_appt_type_dialog_box_text"}).html("Are you sure to delete this appointment type?")
            );
        },
        function(){
            delete_appt_type(id,function(){
                init_appt_types_list();
            })
        }
    )
}

function dialog_box(render,callback){
    var dialog_box=$("<div>").attr({"class":"ap_admin_dialog_box"});

    var cancel_btn=$("<button>").attr({"class":"ap_admin_dialog_box_cancel_btn"}).html("Cancel");
    var confirm_btn=$("<button>").attr({"class":"ap_admin_dialog_box_confirm_btn"}).html("Confirm");

    dialog_box.append(
        $("<div>").attr({"class":"ap_admin_dialog_box_btn_container"})
            .append(confirm_btn)
            .append(cancel_btn)
    );

    var dialog_box_mask=$("#ap_admin_dialog_box_mask");

    dialog_box_mask.css({"display":"block"}).append(dialog_box);

    if(typeof render=="function"){
        render(dialog_box);
    }

    cancel_btn.click(function(){
        dialog_box_mask.empty();
        dialog_box_mask.css({"display":"none"});
    });

    confirm_btn.click(function(){
        //mark if the dialog box can close, return false and dialog won't close
        var flag=true;

        if(typeof callback=="function"){
            flag=callback();
        }

        if(flag!==false){
            dialog_box_mask.empty();
            dialog_box_mask.css({"display":"none"});
        }
    });
}

function add_appt_type(title,description,length,callback){
    $.post(
        ajax_object.ajax_url,
        {
            "action":"add_appt_type",
            "title":title,
            "description":description,
            "length":length
        },
        function(response){
            if(typeof callback=="function"){
                callback(response);
            }
        }
    );
}

function delete_appt_type(id,callback){
    $.post(
        ajax_object.ajax_url,
        {
            "action":"delete_appt_type",
            "id":id
        },
        function(response){
            if(typeof callback=="function"){
                callback(response);
            }
        }
    );
}

function edit_appt_type(id,title,description,length,callback){
    $.post(
        ajax_object.ajax_url,
        {
            "action":"edit_appt_type",
            "id":id,
            "title":title,
            "description":description,
            "length":length
        },
        function(response){
            if(typeof callback=="function"){
                callback(response);
            }
        }
    );
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

    $("#add_appt_type_btn").click(function(){
        add_appt_type_dialog_box();
    });
});