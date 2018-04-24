<?php
function edit_appointment_table($id,$status){
    global $wpdb;
    $wpdb->update(
        'ap_appointments',
        array('status' => $status),
        array('id'=>$id)
    );
}

function edit_appointment(){
    global $wpdb;
    $status = $_POST["status"];
    $id = $_POST["id"];
    $wpdb->update(
        'ap_appointments',
        array('status' => $status),
        array('id'=>$id)
    );
    wp_die();
}
function add_appointment(){
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
}

function get_title(){
    global $wpdb;
    $result=$wpdb->get_results("select id,title from ap_appt_types",0);
    echo json_encode($result);
    wp_die();
}
 ?>
