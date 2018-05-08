<?php

add_action("wp_ajax_ap_providers_menu_get_providers",function(){
    global $wpdb;

    $res=$wpdb->get_results("SELECT * from ap_users WHERE role='provider';");

    wp_send_json($res);
    wp_die();
});

add_action("wp_ajax_ap_providers_menu_edit_provider",function(){
    global $wpdb;

    $provider_id=intval($_POST["provider_id"]);
    $name=$_POST["name"];
    $location=$_POST["location"];
    $phone=$_POST["phone"];
    $email=$_POST["email"];

    $r=$wpdb->update('ap_users',
    array(
        'name'=>$name,
        'location'=>$location,
        'phone'=>$phone,
        'email'=>$email
    ),
    array(
        'user_id'=>$provider_id,
        'role'=>'provider'
    ));

    wp_send_json(array(
        "code"=>"0"
    ));
    wp_die();
});

add_action("wp_ajax_ap_providers_menu_activate_provider",function(){
    global $wpdb;

    $provider_id=intval($_POST["provider_id"]);
    $r=$wpdb->update('ap_users',
    array(
        'active'=>1,
    ),
    array(
        'user_id'=>$provider_id,
        'role'=>'provider'
    ));

    wp_send_json(array(
        "code"=>"0"
    ));
    wp_die();
});

add_action("wp_ajax_ap_providers_menu_deactivate_provider",function(){
    global $wpdb;

    $provider_id=intval($_POST["provider_id"]);
    $r=$wpdb->update('ap_users',
    array(
        'active'=>0,
    ),
    array(
        'user_id'=>$provider_id,
        'role'=>'provider'
    ));

    wp_send_json(array(
        "code"=>"0"
    ));
    wp_die();
});

add_action('wp_ajax_ap_providers_menu_get_appt_types',function(){
    global $wpdb;
    $res=$wpdb->get_results('SELECT * FROM ap_appt_types;');

    wp_send_json($res);
    wp_die();
});

/*
by Sipeng Wang
get appointment types: return a object of query result of table ap_appt_types
 */
add_action("wp_ajax_ap_providers_menu_get_types_by_provider",function(){
    global $wpdb;

    $provider_id=intval($_POST['provider_id']);

    $res=$wpdb->get_results("SELECT ap_appt_types.*
                            FROM ap_provider_appt_types,ap_appt_types
                            WHERE ap_provider_appt_types.appt_type_id = ap_appt_types.appt_type_id
                            AND ap_provider_appt_types.provider_id = $provider_id;");

    wp_send_json($res);
    wp_die();
});

/*
by Dingle Zhang
add new appointment types;
 */
add_action("wp_ajax_ap_providers_menu_add_new_type_to_provider",function(){
    global $wpdb;

    $table = "ap_provider_appt_types";
    $provider_id = intval($_POST["provider_id"]);
    $appt_type_id=intval($_POST["appt_type_id"]);
    if ($wpdb->insert($table,
                        array(
                            'appt_type_id' => $appt_type_id,
                            'provider_id'=>$provider_id
                        ))) {
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

/*
by Sipeng Wang
edit exited types;
id：type id;
title:
discription:
icon:
duration:
 */
add_action("wp_ajax_ap_providers_menu_delete_provider_appt_type",function(){
    global $wpdb;

    $provider_id=intval($_POST['provider_id']);
    $appt_type_id=intval($_POST['appt_type_id']);
    $res=$wpdb->query("DELETE FROM ap_provider_appt_types
                        WHERE ap_provider_appt_types.appt_type_id=$appt_type_id
                        AND ap_provider_appt_types.provider_id=$provider_id");
    if($res == 1){
        wp_send_json(array(
            "code"=>"0"
        ));    //Successful
    }else{
        wp_send_json(array(
            "code"=>"1"
        ));    //Failed
    }
    wp_die();

});

/*
get provider's available time
 */
add_action("wp_ajax_ap_providers_menu_get_provider_timeslot",function(){
    global $wpdb;

    $provider_id=intval($_POST['provider_id']);

    $res=$wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$provider_id};");

    wp_send_json($res);
    wp_die();
});

/*
by Dingle Zhang
add time slot to provider
  provider_id;
  date: date of new time
  time: start time;
  length: length of time;
 */
add_action("wp_ajax_ap_providers_menu_add_timeslot_to_provider",function(){
    global $wpdb;
    //get values
    $log=true; // indicator of system process, true = right, false = fun
    $provider_id = intval($_POST['provider_id']);
    $date = $_POST['date'];
    $time = intval($_POST["time"]);
    $length= intval($_POST['length']);

    $active=$wpdb->get_results("SELECT active from ap_users WHERE user_id={$provider_id}")[0]->active;

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

/*
by Dingle Zhang
delete timeslot by start time and length
provider_id
date
time: start time
length: length of timeslot
 */
add_action("wp_ajax_ap_providers_menu_delete_provider_timeslot", function(){
    global $wpdb;

    // get values
    $log=true;  //record the status;
    $provider_id = intval($_POST['provider_id']);
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

add_action('admin_menu',function(){
    add_submenu_page('overview','Providers','Providers','ap_business_administrator','ap_providers_menu',function(){
        global $wpdb;

        //setting

        $settings=get_option('wp_custom_appointment_peach');

        //locations
        $locations=$wpdb->get_results("SELECT * FROM ap_locations;");

        wp_enqueue_style('ap_style_dialog_box', plugins_url("../static/dialog_box.css",__File__));
        wp_enqueue_style('ap_style_providers_menu', plugins_url("../static/ap_providers_menu.css",__File__));

        wp_enqueue_script('ap_script_react', plugins_url("../lib/js/react-with-addons.min.js",__File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js",__File__));
        wp_enqueue_script('ap_script_dialog_box',plugins_url('../static/dialog_box.js',__File__), array('jquery'));
        wp_enqueue_script('ap_script_providers_menu',plugins_url('../static/ap_providers_menu.js',__File__), array('jquery'));
        wp_localize_script('ap_script_providers_menu','settings',$settings);
        wp_localize_script('ap_script_providers_menu','locations',$locations);

        ?>
        <div id="ap_providers_menu"></div>
        <?php
    });
});
?>
