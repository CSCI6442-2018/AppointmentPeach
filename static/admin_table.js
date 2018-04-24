var $=jQuery;

var make_admin_table=function(container,name,cols,keys){

    var init=function(){

        var d={
            "action":"admin_table",
            "operation":"SELECT_ALL",
            "name":name,
            "keys":{},
            "vals":{}
        }

        $.post(
            ajax_object.ajax_url,d,
            function(rows){
                render(rows);
            }
        );
    }

    var render=function(rows){
        var table=$("<table>").attr({"class":"admin_table"});

        var tr=$("<tr>");
        for(var i=0;i<cols.length;i++){
            tr.append($("<th>").html(cols[i]));
        }
        tr.append($("<th>"));
        tr.append($("<th>"));

        table.append(tr);

        for(var i=0;i<rows.length;i++){(function(row){

            var tr=$("<tr>");
            for(var j=0;j<cols.length;j++){(function(col){
                tr.append($("<td>").html(row[col]));
            })(cols[j])}

            var update_button=$("<button>").html("Update").click(function(){

                var col_inputs=[];
                for(var j=0;j<cols.length;j++){(function(col){
                    col_inputs[col]=$("<input>").attr({"type":"text","placeholder":col}).val(row[col]);
                })(cols[j])}

                dialog_box(
                    function(dialog_box){
                        for(var j=0;j<cols.length;j++){(function(col){
                            dialog_box.append($("<span>").html(col)).append(col_inputs[col]);
                        })(cols[j])}
                    },
                    function(){

                        var d={
                            "action":"admin_table",
                            "operation":"UPDATE",
                            "name":name,
                            "keys":{},
                            "vals":{}
                        }

                        for(var j=0;j<cols.length;j++){(function(col){
                            if(keys.includes(col)){
                                d.keys[col]=row[col];
                            }

                            d.vals[col]=col_inputs[col].val();
                        })(cols[j])}

                        $.post(
                            ajax_object.ajax_url,d,
                            function(){init()}
                        );
                    }
                );
            });
            tr.append($("<td>").append(update_button));

            var delete_button=$("<button>").html("Delete").click(function(){
                dialog_box(
                    function(dialog_box){
                        dialog_box.append($("<p>").html("Are yo sure to delete?"));
                    },
                    function(){

                        var d={
                            "action":"admin_table",
                            "operation":"DELETE",
                            "name":name,
                            "keys":{},
                            "vals":{}
                        }

                        for(var j=0;j<cols.length;j++){(function(col){
                            if(keys.includes(col)){
                                d.keys[col]=row[col];
                            }
                        })(cols[j])}

                        $.post(
                            ajax_object.ajax_url,d,
                            function(){init()}
                        );
                    }
                );
            });
            tr.append($("<td>").append(delete_button));

            table.append(tr);
        })(rows[i])}

        var insert_btn=$("<button>").html("Insert").click(function(){
            var col_inputs=[];
            for(var j=0;j<cols.length;j++){(function(col){
                col_inputs[col]=$("<input>").attr({"type":"text","placeholder":col}).val("");
            })(cols[j])}

            dialog_box(
                function(dialog_box){
                    for(var j=0;j<cols.length;j++){(function(col){
                        dialog_box.append($("<span>").html(col)).append(col_inputs[col]);
                    })(cols[j])}
                },
                function(){

                    var d={
                        "action":"admin_table",
                        "operation":"INSERT",
                        "name":name,
                        "keys":{},
                        "vals":{}
                    }

                    for(var j=0;j<cols.length;j++){(function(col){
                        d.vals[col]=col_inputs[col].val();
                    })(cols[j])}

                    $.post(
                        ajax_object.ajax_url,d,
                        function(){init()}
                    );
                }
            );
        })

        container.empty();
        container.append(table);
        container.append(insert_btn);
    }

    init();
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

$(document).ready(function(){

    make_admin_table(
        $("#ap_locations"),
        "ap_locations",
        ["name"],
        ["name"]
    );

    make_admin_table(
        $("#ap_users"),
        "ap_users",
        ["user_id","location","phone","role"],
        ["user_id"]
    );

    make_admin_table(
        $("#ap_time_slots"),
        "ap_time_slots",
        ["provider_id","date","time","appt_id"],
        ["provider_id","date","time"]
    );

    make_admin_table(
        $("#ap_appt_types"),
        "ap_appt_types",
        ["id","title","description","time"],
        ["id"]
    );

    make_admin_table(
        $("#ap_appointments"),
        "ap_appointments",
        ["id","provider_id","customer_id","appt_type_id","status"],
        ["id"]
    );

    make_admin_table(
        $("#ap_provider_appt_types"),
        "ap_provider_appt_types",
        ["provider_id","appt_type_id"],
        ["provider_id","appt_type_id"]
    );
});