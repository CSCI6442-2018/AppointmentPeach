<?php

<<<<<<< HEAD
function edit_appointment_table($id,$status){
    global $wpdb;
    $wpdb->update(
        'ap_appointments',
        array('status' => $status),
        array('id'=>$id)
    );
}

add_action('wp_ajax_edit_appointment',function(){
    global $wpdb;
    $status = $_POST["status"];
    $id = $_POST["id"];
    $wpdb->update(
        'ap_appointments',
        array('status' => $status),
        array('id'=>$id)
    );
    wp_die();
});

add_action("wp_ajax_add_appointment", function(){
    global $wpdb;
    $provider_id=$_POST["provider_id"];
    $customer_id=$_POST["customer_id"];
    $appt_type_id=$_POST["appointment_type"];
    $status=$_POST["status"];
    $wpdb->insert('ap_appointments',
            array(
                'provider_id'=>$provider_id,
                'customer_id'=>$customer_id,
                'appt_type_id'=>$appt_type_id,
                'status'=>$status
            )
    );
});

add_action("wp_ajax_get_title",function(){
    global $wpdb;
    $result=$wpdb->get_results("select id,title from ap_appt_types",0);
    echo json_encode($result);
    wp_die();
});

function create_ap_table(){
    global $wpdb;
    $sql='SELECT ap_appointments.id AS id , x.user_nicename AS provider, y.user_nicename AS customer, ap_appt_types.title AS title, ap_appt_types.TIME AS time, ap_appointments.status AS status FROM ap_appointments, '.$wpdb->prefix.'users AS x, '.$wpdb->prefix.'users AS y, ap_appt_types WHERE x.ID = ap_appointments.provider_id AND y.ID = ap_appointments.customer_id AND ap_appt_types.ID IN (SELECT appt_type_id FROM ap_appointments) AND ap_appointments.appt_type_id=ap_appt_types.ID';
    if($result = $wpdb->get_results($sql)){
        if (count($result)>0) {
            echo '<table class="highlight" style="background-color:white" id="ap_table">';
            echo "<thead><tr><th>ID</th> <th>Provider </th> <th>Customer </th> <th>Service</th> <th>Time</th> <th>Status</th> <th></th> </tr></thead><tbody>";
            foreach($result as $row) {
                echo "<tr id='".$row->id."' class='hoverable'>";
                echo "<td>".$row->id."</td>";
                echo "<td>".$row->provider."</td>";
                echo "<td>".$row->customer."</td>";
                echo "<td>".$row->title."</td>";
                echo "<td>".$row->time."</td>";
                echo "<td>".$row->status."</td>";
                echo "<td><a href=\"#!\" onclick='create_edit_modal(".$row->id.")'><i class=\"material-icons\">edit</i></a></td>";
                echo "</tr>";
            }
            echo "</tbody></table>";
        } else {
            echo "No Results to display!";
        }
    } else {
        echo "Error: ". $wpdb->show_errors();
    }
}

function ap_appointments_menu(){

    wp_enqueue_style('materailize_css', plugins_url("/lib/css/materialize.css",__File__));
    wp_enqueue_style('materailize_icon',"https://fonts.googleapis.com/icon?family=Material+Icons");

    wp_enqueue_script('materailize_js', plugins_url("/lib/js/materialize.js",__File__));
    wp_enqueue_script('ap_script_appointments_menu',plugins_url('/static/ap_appointments_menu.js',__File__), array('jquery'));

    ?>
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
                    <li id="ap_id" class="collection-item"></li>
                    <li id="ap_pro" class="collection-item"></li>
                    <li id="ap_cus" class="collection-item"></li>
                    <li id="ap_type" class="collection-item"></li>
                    <li id="ap_time" class="collection-item"></li>
                    <li id="ap_cur_status" class="collection-item"></li>
                </ul>
            </div>
            <div class='container'>
                <form class="col s12" action="#" method="post" id="ap_form">
                    <div class="row">
                        <form class="col s12" action="#" method="post">
                            <div class="row">
                                <div class="col s6 section scrollspy">
                                    <label for="Date">New Date</label>
                                    <input type="text" name="Date" value="<?php echo date(" m-d-Y ")?>" class="datepicker" validate>
                                </div>
                                <div class="col s6 section scrollspy">
                                    <label for="Time">New Time</label>
                                    <input type="text" name="Time" class="timepicker">
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <select id="new_status" name="status" class="status_select">
                                        <option value="" disabled selected>Choose new status</option>
                                        <option value="pending">pending</option>
                                        <option value="confirmed">confirmed</option>
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
                                <select id="add_select" name="appointment_type">
                                    </select>
                                <label for="add_select">Appointment type</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <select id="status2" name="status" class="status_select">
                                        <option value="" disabled selected>Choose new status</option>
                                        <option value="pending">pending</option>
                                        <option value="confirmed">confirmed</option>
                                        <option value="completed">completed</option>
                                        <option value="canceled">canceled</option>
                                    </select>
                                <label>Status</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s6">
                                <label for="Date">New Date</label>
                                <input type="text" name="Date" value="<?php echo date(" m-d-Y ")?>" class="datepicker" validate>
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
            <a href="#" class="modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
            <a href="#" class="modal-action modal-close waves-effect waves-green btn-flat" id="add_submit">Submit</a>
        </div>
    </div>
    <?php
}

add_action('admin_menu',function(){
    add_submenu_page('overview',"Appointments","Appointments",'manage_options','ap_appointments_menu','ap_appointments_menu');
=======
add_action('admin_menu',function(){
    add_submenu_page('overview',"Appointments","Appointments",'manage_options','ap_appointments_menu',function(){

        wp_enqueue_style('ap_style_appointment_menu', plugins_url("/static/ap_appointment_menu.css",__File__));
        
        wp_enqueue_script('ap_script_appointment_menu',plugins_url('/static/ap_appointment_menu.js',__File__), array('jquery'));

        ?>

        <h1>Appointments Menu</h1>

        <?php
    });
>>>>>>> refactor
});

?>
