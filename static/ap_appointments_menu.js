/*
innitialize element.
*/
var elem4 = document.querySelector('.fixed-action-btn');
var button = M.FloatingActionButton.init(elem4);

/*
create and innitialize edit medal.
 */
function create_edit_modal(id) {
    var row = document.getElementById(id);
    var attr = row.getElementsByTagName('td');
    // var select=document.getElementById("new_status")
    // select = M.FormSelect.init(select);
    var providerName = attr[1].innerHTML;
    var customerName = attr[2].innerHTML;
    var serviceName = attr[3].innerHTML;
    var time = attr[4].innerHTML;
    var status = attr[5].innerHTML;
    document.getElementById('ap_id').innerHTML = "ID: " + id;
    document.getElementById('ap_pro').innerHTML = "Provider Name: " + providerName;
    document.getElementById('ap_cus').innerHTML = "Customer Name: " + customerName;
    document.getElementById('ap_type').innerHTML = "Appointment Type: " + serviceName;
    document.getElementById('ap_time').innerHTML = "Time: " + time;
    document.getElementById('ap_cur_status').innerHTML = "Current status: " + status;
    var elem = document.getElementById('edit_appointment');
    var instance = M.Modal.init(elem);
    instance.open();
    M.updateTextFields();
}

(function() {
    
   
    jQuery(document).ready(function() {
        jQuery('.status_select').formSelect();
        jQuery('.datepicker').datepicker();
        jQuery('.timepicker').timepicker();
        jQuery("#add_select option").remove();

        var cstatus;
        var cid;

        jQuery('#edit_submit').click(function() { 
            cstatus = document.getElementById('new_status').value;
            cid = document.getElementById('ap_id').innerHTML;
           
            if (cstatus === "pending" || cstatus === "completed" || cstatus === "confirmed" || cstatus === "canceled") {
                console.log("cstatus:"+cstatus);
                jQuery.post(
                    ajaxurl, {
                        action: 'edit_appointment',
                        id: cid,
                        status: cstatus
                    },
                );
                console.log("after Post");
               // window.location.reload();
            }
        });


        jQuery('#ap_add').click(function() {
            var modal = document.getElementById('add_ap_modal');
            modal = M.Modal.init(modal);
            var select = document.getElementById('add_select');
            select = M.FormSelect.init(select);
    
            jQuery("#add_submit").click(function() {
                var pro_id = jQuery('#provider_id2').val();
                var cus_id = jQuery('#customer_id2').val();
                var app_type = jQuery("#add_select").val();
                var sta = jQuery("#status2").val();
                console.log("status: " + sta);
                console.log("pro_id: " + pro_id);
                console.log("cus_id: " + cus_id);
                console.log("app_type: " + app_type);
                jQuery.post(
                    ajaxurl, {
                        action: 'add_appointment',
                        provider_id: pro_id,
                        customer_id: cus_id,
                        appointment_type: app_type,
                        status: sta
                    },
                );
                window.location.reload();
            });
            modal.open();
        });
    

        jQuery.post(
            ajaxurl, {
                action: "get_title"
            },
            function(titles) {
                console.log(JSON.parse(titles));
                titles = JSON.parse(titles);
                for (var i in titles) {
                    jQuery("#add_select").append("<option value='" + titles[i].id + "'>" + titles[i].title + "</option>");
                }
            }
        );
    });
})()