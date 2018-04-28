var $=jQuery;

function load_test_data(){
    $.post(ajax_object.ajax_url, {"action":"load_test_data"}, function(response){
        $("#ap_test_insert_test_done").show();
        setTimeout(function(){ 
            $("#ap_test_insert_test_done").hide();
        }, 2000);
    });
}

function delete_test_data() {
    $.post(ajax_object.ajax_url, {"action":"delete_test_data"}, function(response){
        $("#ap_test_delete_test_done").show();
        setTimeout(function(){ 
            $("#ap_test_delete_test_done").hide();
        }, 2000);
    });
}

$(document).ready(function(){
    
    $("#ap_test_insert_test").click(function(){
        load_test_data();
    });
    
    $("#ap_test_delete_test").click(function(){
        delete_test_data();
    });
    
});