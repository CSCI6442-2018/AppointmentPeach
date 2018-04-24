<?php
function appointment_js(){?>

        <script type="text/javascript">

            var cstatus;
            var cid;
                jQuery('#edit_submit').click(function(){
                    cstatus=document.getElementById('new_status').value;
                    cid = document.getElementById('ap_id').innerHTML;
                    if(cstatus==="pending"||cstatus==="completed"||cstatus==="comfirmed"||cstatus==="canceled"){
                    jQuery.post(
                        ajaxurl,
                        {
                            action:'edit_appointment',
                            id:cid,
                            status:cstatus
                        },
                    );
                    console.log("after Post");
                    window.location.reload();
                    }
                }
                );

                jQuery('#ap_add').click(function(){
                    var modal=document.getElementById('add_ap_modal');
                    modal = M.Modal.init(modal);
                    var select=document.getElementById('add_select');
                    select = M.FormSelect.init(select);

                    jQuery("#add_submit").click(function(){
                        var pro_id=jQuery('#provider_id2').val();
                        var cus_id=jQuery('#customer_id2').val();
                        var app_type=jQuery("#add_select").val();
                        var sta=jQuery("#status2").val();
                        console.log("status: "+ sta);
                        console.log("pro_id: "+ pro_id);
                        console.log("cus_id: "+ cus_id);
                        console.log("app_type: "+ app_type);
                        jQuery.post(
                            ajaxurl,
                            {
                                action:'add_appointment',
                                provider_id: pro_id,
                                customer_id:cus_id,
                                appointment_type: app_type,
                                status: sta
                            },
                        );
                        window.location.reload();
                    });
                    modal.open();
                });

                jQuery(document).ready(function(){
                    jQuery('.status_select').formSelect();
                    jQuery('.datepicker').datepicker();
                    jQuery('.timepicker').timepicker();
                    jQuery("#add_select option").remove();
                    jQuery.post(
                        ajaxurl,
                        {
                            action:"get_title"
                        },
                        function(titles){
                            console.log(JSON.parse(titles));
                            titles=JSON.parse(titles);
                            for (var i in titles) {
                                jQuery("#add_select").append("<option value='"+titles[i].id+"'>"+ titles[i].title+"</option>");
                            }
                        }
                    );

                });

        </script>
    <?php
}

function create_ap_table(){
    global $wpdb;
        $sql=  'Select  Ap_Appointments.Id as id , X.User_Nicename as provider, Y.User_Nicename as customer, ap_appt_types.Title as title, ap_appt_types.Length as length, Ap_Appointments.Status as status
From  	Ap_Appointments, Wp_Users As X,  Wp_Users As Y, ap_appt_types
Where  X.Id = Ap_Appointments.Provider_Id And  Y.Id = Ap_Appointments.Customer_Id  And  ap_appt_types.id in (select appt_type_id from ap_appointments) and ap_appointments.appt_type_id=ap_appt_types.id;';
        if($result = $wpdb->get_results($sql)){
            if (count($result)>0) {
               echo '<table class="highlight" style="background-color:white" id="ap_table">';
               echo "<thead><tr><th>ID</th> <th>Provider </th> <th>Customer </th> <th>Service</th> <th>Length</th><th>Time</th> <th>Status</th> <th></th> </tr></thead><tbody>";
                foreach($result as $row) {
                    echo "<tr id='".$row->id."' class='hoverable'>";
                    echo "<td>".$row->id."</td>";
                    echo "<td>".$row->provider."</td>";
                    echo "<td>".$row->customer."</td>";
                    echo "<td>".$row->title."</td>";
                    echo "<td>".$row->length."</td>";
                    echo "<td>N/A</td>";
                    echo "<td>".$row->status."</td>";
                    echo "<td><a href=\"#!\" onclick='create_edit_modal(".$row->id.")'><i class=\"material-icons\">edit</i></a></td>";
                    echo "</tr>";
                }
                echo "</tbody></table>";
           }else {
            echo "No Results to display!";
           }
       }else {
           echo "Error: ". $wpdb->show_errors();
   }
}
function create_ap_menu(){
    wp_enqueue_style('M_style','https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css');
    wp_enqueue_script('M_script','https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/js/materialize.min.js');
    wp_enqueue_style('M_icon',"https://fonts.googleapis.com/icon?family=Material+Icons");
    ?>
      <body style="background-color: #fff">
         <!--
            appointments menu
          -->
          <div class='container'>
              <h1 align="center">Appointment Management</h1>
          </div>
          <div class="fixed-action-btn">
              <a class="btn-floating btn-large red" id="ap_add">
                  <i class="large material-icons" >add</i>
              </a>
          </div>
         <div class="container" id="appointments_menu">
              <?php create_ap_table();?>
         </div>
         <!-- Modal Structure -->
          <div id="edit_appointment" class="modal">
            <div class="modal-content">
                <div class="row">
                    <ul class="collection with-header">
                        <li class="collection-header"><h4 id="ap_id"> </h4></li>
                        <li id="ap_pro" class="collection-item"></li>
                        <li id="ap_cus" class="collection-item"></li>
                        <li id="ap_type" class="collection-item"></li>
                        <li id="ap_len" class="collection-item"></li>
                        <li id="ap_time" class="collection-item"></li>
                        <li id="ap_cur_status" class="collection-item"></li>
                    </ul>
                </div>
                <div class='container'>
                <form class="col s12" action="#" method="post" id="ap_form">
                    <div class="row">
                        <form class="col s12" action="#" method="post">
                            <div class="row">
                                <div class="col s6">
                                    <label for="Date">New Date</label>
                                    <input type="text" name="Date" value="<?php echo date("m-d-Y")?>" class="datepicker" validate>
                                </div>
                                <div class="col s6">
                                    <label for="Time">New Time</label>
                                    <input type="text" name="Time" class="timepicker">
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <select id="new_status" name="status" class="status_select">
                                        <option value="" disabled selected>Choose new status</option>
                                        <option value="pending">pending</option>
                                        <option value="comfirmed">comfirmed</option>
                                        <option value="completed">completed</option>
                                        <option value="canceled">canceled</option>
                                    </select>
                                    <label>Status</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <hr>
            <div class="modal-footer">
              <a href="#!" class="modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
              <a href="#" class="modal-action modal-close waves-effect waves-green btn-flat" id="edit_submit">Submit</a>
            </div>
          </div>

         <!-- Modal Structure -->
          <div id="add_ap_modal" class="modal">
            <div class="modal-content">
                <h4>New Appointment:</h4>
                <div class="container">
                    <div class="row">
                        <form class="col s12" method="post">
                            <div class="row">
                                <div class="input-field col s6">
                                    <input type="number" id="provider_id2" name="provider_id" class='validate'>
                                    <label for="provider_id">Provider ID</label>
                                </div>
                                <div class="input-field col s6">
                                    <input type="number" id="customer_id2" name="customer_id" class='validate'>
                                    <label for="customer_id">Customer ID</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <select id ="add_select" name="appointment_type">
                                    </select>
                                    <label for="add_select">Appointment type</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <select id="status2" name="status" class="status_select">
                                        <option value="" disabled selected>Choose new status</option>
                                        <option value="pending">pending</option>
                                        <option value="comfirmed">comfirmed</option>
                                        <option value="completed">completed</option>
                                        <option value="canceled">canceled</option>
                                    </select>
                                    <label>Status</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col s6">
                                    <label for="Date">New Date</label>
                                    <input type="text" name="Date" value="<?php echo date("m-d-Y")?>" class="datepicker" validate>
                                </div>
                                <div class="col s6">
                                    <label for="Time">New Time</label>
                                    <input type="text" name="Time" class="timepicker">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
                <a href="#" class="modal-action modal-close waves-effect waves-green btn-flat" id="add_submit">Submit</a>
             </div>
          </div>

        <!--JavaScript at end of body for optimized loading-->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/js/materialize.min.js"></script>
        <script type="text/javascript">
        /*
        innitialize element.
         */
        var elem4 = document.querySelector('.fixed-action-btn');
        var button = M.FloatingActionButton.init(elem4);

        /*
        create and innitialize edit medal.
         */
        function create_edit_modal(id) {
            var row=document.getElementById(id);
            var attr=row.getElementsByTagName('td');
            // var select=document.getElementById("new_status")
            // select = M.FormSelect.init(select);
            var providerName=attr[1].innerHTML;
            var customerName=attr[2].innerHTML;
            var serviceName=attr[3].innerHTML;
            var length=attr[4].innerHTML;
            var time=attr[5].innerHTML;
            var status=attr[6].innerHTML;
            document.getElementById('ap_id').innerHTML=id;
            document.getElementById('ap_pro').innerHTML="Provider Name:&nbsp;&nbsp; "+providerName;
            document.getElementById('ap_cus').innerHTML="Customer Name: &nbsp;&nbsp;"+customerName;
            document.getElementById('ap_type').innerHTML="Appointment Type:&nbsp;&nbsp; "+ serviceName;
            document.getElementById('ap_len').innerHTML="Length: &nbsp;&nbsp;"+ length;
            document.getElementById('ap_time').innerHTML="Current book time:&nbsp;&nbsp; "+ time;
            document.getElementById('ap_cur_status').innerHTML="Current status:&nbsp;&nbsp;" + status;
            var elem = document.getElementById('edit_appointment');
            var instance = M.Modal.init(elem);
            instance.open();
            M.updateTextFields();
        }


        </script>
    </body>
    <?php
}

 ?>
