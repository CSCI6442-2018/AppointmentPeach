<?php

add_action("wp_ajax_ap_provider_edit_info",function(){
    $provider_id=get_current_user_id();;
    $location=$_POST["location"];
    $phone=$_POST["phone"];
    update_user_meta( $provider_id, 'location', $location);
    update_user_meta( $provider_id, 'phone', $phone);
    wp_send_json(array(
        "code"=>"0"
    ));
    wp_die();
});

add_action("wp_ajax_ap_provider_get_appt_types",function(){
    global $wpdb;

    $provider_id=get_current_user_id();

    $res=$wpdb->get_results("SELECT ap_appt_types.*
                            FROM ap_provider_appt_types,ap_appt_types
                            WHERE ap_provider_appt_types.appt_type_id = ap_appt_types.appt_type_id
                            AND ap_provider_appt_types.provider_id = $provider_id;");

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_provider_get_appts_info', function () {
    global $wpdb;

    $provider_id=get_current_user_id();

    $appts = $wpdb->get_results("SELECT * FROM ap_appointments WHERE provider_id={$provider_id};");

    $res = [];

    foreach ($appts as $appt){
        $a_id = $appt->appt_id;
        $a_t_id = $appt->appt_type_id;
        $p_id = $appt->provider_id;
        $c_id = $appt->customer_id;

        $provider = new WP_User($p_id);
        $customer = new WP_User($c_id);
        $time_slot = $wpdb->get_row("SELECT * FROM ap_time_slots WHERE provider_id={$p_id} AND appt_id={$a_id};");
        $appt_type = $wpdb->get_row("SELECT * FROM ap_appt_types WHERE appt_type_id={$a_t_id};");
        array_push($res, array(
            'appt_id' => $a_id,
            'status' => $appt->status,
            'appt_type_id' => $a_t_id,
            'appt_type_title' => $appt_type->title,
            'appt_type_duration' => $appt_type->duration,
            'customer_id' => $c_id,
            'customer_name' => $customer->display_name,
            'date' => $time_slot->date,
            'time' => $time_slot->time,
        ));
    }
    
    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_provider_approve_appt', function () {
    global $wpdb;

    $provider_id=get_current_user_id();
    $appt_id = $_POST["appt_id"];

    $wpdb->update('ap_appointments',
    array(
        'status' => "approved"
    ),
    array(
        'appt_id' => $appt_id,
        'provider_id'=> $provider_id
    ));
    
    wp_send_json(array(
        'code' => '0'
    ));
    wp_die();
});

add_action('wp_ajax_ap_provider_complete_appt', function () {
    global $wpdb;

    $provider_id=get_current_user_id();
    $appt_id = $_POST["appt_id"];

    $wpdb->update('ap_appointments',
    array(
        'status' => "completed"
    ),
    array(
        'appt_id' => $appt_id,
        'provider_id'=> $provider_id
    ));
    
    wp_send_json(array(
        'code' => '0'
    ));
    wp_die();
});

add_action('wp_ajax_ap_provider_cancel_appt', function () {
    global $wpdb;
    $provider_id=get_current_user_id();
    $appt_id = $_POST["appt_id"];

    $appt = $wpdb->get_row("SELECT * FROM ap_appointments WHERE appt_id={$appt_id};");

    $appt_type = $wpdb->get_row("SELECT * FROM ap_appt_types WHERE appt_type_id={$appt->appt_type_id};");
    $duration = $appt_type->duration;

    $time_slot_old = $wpdb->get_row("SELECT date, MIN(time) t FROM ap_time_slots WHERE provider_id={$appt->provider_id} AND appt_id={$appt->appt_id};");
    $old_time = $time_slot_old->t;
    $old_date = $time_slot_old->date;

    $wpdb->delete('ap_appointments',
        array(
            'appt_id' => $appt_id,
            'provider_id'=> $provider_id
        ));

    for ($i = 0; $i < $duration; $i++) {
        $t = $old_time + $i;
        $wpdb->update('ap_time_slots',
            array(
                'appt_id' => NULL
            ),
            array(
                'provider_id' => $appt->provider_id,
                'date' => $old_date,
                'time' => $t
            )
        );
    }

    wp_send_json(array(
        'code' => '0'
    ));
    wp_die();
});

add_action("wp_ajax_ap_provider_get_timeslot",function(){
    global $wpdb;

    $provider_id=get_current_user_id();

    $res=$wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$provider_id};");

    wp_send_json($res);
    wp_die();
});

add_action("wp_ajax_ap_provider_add_timeslot",function(){
    global $wpdb;
    //get values
    $log=true; // indicator of system process, true = right, false = fun
    $provider_id = get_current_user_id();
    $date = $_POST['date'];
    $time = intval($_POST["time"]);
    $length= intval($_POST['length']);

    $active= get_users(['role' => 'ap_provider', 'meta_key' => 'active', 'meta_value' => 0, 'meta_compare' => '=']);

    if($active==0){
        wp_send_json(array(
            "code" => "1"
        ));
    }else{
        //insert multiple timeslots
        for ($i = 0; $i < $length ; $i++) {
            $t=$time+$i;

            $res = $wpdb->get_results("select *
                                    from ap_time_slots
                                    where provider_id = $provider_id
                                    and date= '$date'
                                    and time = $t;");
            //check if thhe current timeslot has exist
            if (count($res) > 0) {
                //if record exists, don't proceed
                $log=false;
                continue;
            } else {
                //if record not exist then proceed
                $res = $wpdb->insert("ap_time_slots",array(
                    "provider_id" => $provider_id,
                    "date" => $date,
                    "time" => $t,
                ));
            }
        }
        if ($log) {
            wp_send_json(array(
                "code" => "0"
            ));
        }else{
            wp_send_json(array(
                "code" => "1"
            ));
        }
    }
    wp_die();
});

add_action("wp_ajax_ap_provider_delete_timeslot", function(){
    global $wpdb;

    // get values
    $log=true;  //record the status;
    $provider_id = get_current_user_id();
    $date = $_POST['date'];
    $time = intval($_POST["time"]);
    $length= intval($_POST['length']);

    //insert multiple rows
    for ($i = 0; $i < $length ; $i++) {
        $t=$time+$i;
        // check if timeslot has signed appt_id
        $res = $wpdb->get_results("select appt_id
                                from ap_time_slots
                                where provider_id = $provider_id
                                and date= '$date'
                                and time = $t;");

        if ($res[0]->appt_id) {
            $log=false;
            continue;
        }else {
            $res = $wpdb->delete("ap_time_slots",array(
                "provider_id" => $provider_id,
                "date" => $date,
                "time" => $t,
            ));
        }
     }

    //return status:  0 = success, 1 = unsuccess
    if ($log) {
        wp_send_json(array(
            "code"=>"0"
        ));
    }else{
        wp_send_json(array(
            "code"=>"1"
        ));
    }

    wp_die();
});

add_action('admin_menu', function(){
    add_menu_page('Appointment Peach','Appointment Peach','ap_provider','ap_provider_overview',function(){

        //setting
        $settings=get_option('wp_custom_appointment_peach');

        //
        $user=wp_get_current_user();
        $provider=array();
        $provider["name"]=$user->data->display_name;
        $provider["email"]=$user->data->user_email;
        $provider["phone"]=get_user_meta($user->ID, 'phone', true);
        $provider["location"]=get_user_meta($user->ID, 'location', true);

        wp_enqueue_style('ap_style_dialog_box', plugins_url("../static/dialog_box.css",__File__));
        wp_enqueue_style('ap_style_ap_provider', plugins_url("../static/ap_provider.css",__File__));

        wp_enqueue_script('ap_script_react', plugins_url("../lib/js/react-with-addons.min.js",__File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js",__File__));
        wp_enqueue_script('ap_script_dialog_box',plugins_url('../static/dialog_box.js',__File__), array('jquery'));
        wp_enqueue_script('ap_script_ap_provider',plugins_url('../static/ap_provider.js',__File__), array('jquery'));
        wp_localize_script('ap_script_ap_provider','settings',$settings);
        wp_localize_script('ap_script_ap_provider','provider',$provider);
        ?>
        <div id="ap_provider"></div>
        <?php
    });
});
