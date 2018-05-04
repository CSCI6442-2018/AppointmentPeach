<?php
add_action('wp_ajax_ap_appointments_menu_get_appt_types',function(){
    global $wpdb;
    $res=$wpdb->get_results('SELECT * FROM ap_appt_types;');

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_get_providers_by_appt_type',function(){
    global $wpdb;

    $appt_type_id=intval($_POST['appt_type_id']);

    $provider_by_appt_type=$wpdb->get_results("SELECT provider_id FROM ap_provider_appt_types WHERE appt_type_id=$appt_type_id;");

    $res=[];

    for($i=0;$i<count($provider_by_appt_type);$i++){
        $provider_id=$provider_by_appt_type[$i]->provider_id;
        array_push($res,($wpdb->get_results("SELECT * FROM ap_users WHERE user_id=$provider_id;")[0]));
    }

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_get_appts_info',function(){
    global $wpdb;

    $appts=$wpdb->get_results("SELECT * FROM ap_appointments;");

    $res=[];

    for($i=0;$i<count($appts);$i++){
        array_push($res,array(
            'appt_id'=>$appts[$i]->appt_id,
            'status'=>$appts[$i]->status,
            'appt_type_id'=>$appts[$i]->appt_type_id,
            'appt_type_title'=>$wpdb->get_results("SELECT title FROM ap_appt_types WHERE appt_type_id={$appts[$i]->appt_type_id};")[0]->title,
            'appt_type_duration'=>$wpdb->get_results("SELECT duration FROM ap_appt_types WHERE appt_type_id={$appts[$i]->appt_type_id};")[0]->duration,
            'provider_id'=>$appts[$i]->provider_id,
            'provider_name'=>$wpdb->get_results("SELECT name FROM ap_users WHERE user_id={$appts[$i]->provider_id};")[0]->name,
            'customer_id'=>$appts[$i]->customer_id,
            'customer_name'=>$wpdb->get_results("SELECT name FROM ap_users WHERE user_id={$appts[$i]->customer_id};")[0]->name,
            'date'=>$wpdb->get_results("SELECT date FROM ap_time_slots WHERE provider_id={$appts[$i]->provider_id} AND appt_id={$appts[$i]->appt_id};")[0]->date,
            'time'=>$wpdb->get_results("SELECT MIN(time) AS t FROM ap_time_slots WHERE provider_id={$appts[$i]->provider_id} AND appt_id={$appts[$i]->appt_id};")[0]->t,
        ));
    }

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_get_provider_time_slots',function(){
    global $wpdb;

    $provider_id=intval($_POST['provider_id']);

    $res=$wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$provider_id};");

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_get_customers',function(){
    global $wpdb;
    $res=$wpdb->get_results("SELECT * FROM ap_users WHERE role='customer';");

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_new_appt',function(){
    global $wpdb;

    $appt_type=$_POST["appt_type"];
    $status=$_POST["status"];
    $provider=$_POST["provider"];
    $customer=$_POST["customer"];
    $date=$_POST["date"];
    $time=$_POST["time"];

    $duration=($wpdb->get_results("SELECT * FROM ap_appt_types WHERE appt_type_id={$appt_type};"))[0]->duration;

    $accept=true;
    for($i=0;$i<$duration;$i++){
        $t=$time+$i;
        $s=$wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$provider} AND time={$t} AND date='{$date}' AND appt_id IS NULL;");
        if(count($s)==0){
            $accept=false;
            break;
        }
    }

    if($accept==true){
        $wpdb->insert('ap_appointments',
            array(
                'provider_id'=>$provider,
                'customer_id'=>$customer,
                'appt_type_id'=>$appt_type,
                'status'=>$status
            )
        );
        $appt_id=$wpdb->insert_id;
        for($i=0;$i<$duration;$i++){
            $t=$time+$i;
            $wpdb->update('ap_time_slots',
                array(
                    'appt_id'=>$appt_id
                ),
                array(
                    'provider_id'=>$provider,
                    'date'=>$date,
                    'time'=>$t
                )
            );
        }
        wp_send_json(array(
            'code'=>'0'
        ));
    }else{
        wp_send_json(array(
            'code'=>'1'
        ));
    }

    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_edit_appt',function(){
    global $wpdb;
    $appt_id=$_POST["appt_id"];
    $status=$_POST["status"];
    $date=$_POST["date"];
    $time=$_POST["time"];

    $appt=($wpdb->get_results("SELECT * FROM ap_appointments WHERE appt_id={$appt_id};"))[0];

    $old_time=$wpdb->get_results("SELECT MIN(time) AS t FROM ap_time_slots WHERE provider_id={$appt->provider_id} AND appt_id={$appt->appt_id};")[0]->t;
    $old_date=$wpdb->get_results("SELECT date FROM ap_time_slots WHERE provider_id={$appt->provider_id} AND appt_id={$appt->appt_id};")[0]->date;

    if($old_date==$date && $old_time==$time){
        $wpdb->update('ap_appointments',
        array(
            'status'=>$status
        ),
        array(
            'appt_id'=>$appt_id
        ));

        wp_send_json(array(
            'code'=>'0'
        ));
    }else{
        $duration=($wpdb->get_results("SELECT * FROM ap_appt_types WHERE appt_type_id={$appt->appt_type_id};"))[0]->duration;

        $accept=true;
        for($i=0;$i<$duration;$i++){
            $t=$time+$i;
            $s=$wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$appt->provider_id} AND time={$t} AND date='{$date}' AND appt_id IS NULL;");
            if(count($s)==0){
                $accept=false;
                break;
            }
        }

        if($accept==true){
            $wpdb->update('ap_appointments',
            array(
                'status'=>$status
            ),
            array(
                'appt_id'=>$appt_id
            ));

            for($i=0;$i<$duration;$i++){
                $t=$old_time+$i;
                $wpdb->update('ap_time_slots',
                    array(
                        'appt_id'=>NULL
                    ),
                    array(
                        'provider_id'=>$appt->provider_id,
                        'date'=>$old_date,
                        'time'=>$t
                    )
                );
            }
        
            for($i=0;$i<$duration;$i++){
                $t=$time+$i;
                $wpdb->update('ap_time_slots',
                    array(
                        'appt_id'=>$appt_id
                    ),
                    array(
                        'provider_id'=>$appt->provider_id,
                        'date'=>$date,
                        'time'=>$t
                    )
                );
            }

            wp_send_json(array(
                'code'=>'0'
            ));
        }else{
            wp_send_json(array(
                'code'=>'1'
            ));
        }
    }

    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_cancel_appt',function(){
    global $wpdb;
    $appt_id=$_POST["appt_id"];

    $appt=($wpdb->get_results("SELECT * FROM ap_appointments WHERE appt_id={$appt_id};"))[0];

    $duration=($wpdb->get_results("SELECT * FROM ap_appt_types WHERE appt_type_id={$appt->appt_type_id};"))[0]->duration;

    $old_time=$wpdb->get_results("SELECT MIN(time) AS t FROM ap_time_slots WHERE provider_id={$appt->provider_id} AND appt_id={$appt->appt_id};")[0]->t;
    $old_date=$wpdb->get_results("SELECT date FROM ap_time_slots WHERE provider_id={$appt->provider_id} AND appt_id={$appt->appt_id};")[0]->date;

    $wpdb->delete('ap_appointments',
    array(
        'appt_id'=>$appt_id
    ));

    for($i=0;$i<$duration;$i++){
        $t=$old_time+$i;
        $wpdb->update('ap_time_slots',
            array(
                'appt_id'=>NULL
            ),
            array(
                'provider_id'=>$appt->provider_id,
                'date'=>$old_date,
                'time'=>$t
            )
        );
    }

    wp_send_json(array(
        'code'=>'0'
    ));
    wp_die();
});

add_action('admin_menu',function(){
    add_submenu_page('overview',"Appointments","Appointments",'ap_business_administrator','ap_appointments_menu',function(){

        global $wpdb;
        $s=$wpdb->get_results("SELECT * FROM ap_settings;");
        $settings=[];
        for($i=0;$i<count($s);$i++){
            $settings[$s[$i]->key]=$s[$i]->value;
        }

        wp_enqueue_style('ap_style_dialog_box', plugins_url("/static/dialog_box.css",__File__));
        wp_enqueue_style('ap_style_appointments_menu', plugins_url("/static/ap_appointments_menu.css",__File__));

        wp_enqueue_script('ap_script_react', plugins_url("/lib/js/react-with-addons.min.js",__File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("/lib/js/react-dom.min.js",__File__));
        wp_enqueue_script('ap_script_dialog_box',plugins_url('/static/dialog_box.js',__File__), array('jquery'));
        wp_enqueue_script('ap_script_appointments_menu',plugins_url('/static/ap_appointments_menu.js',__File__), array('jquery'));
        wp_localize_script('ap_script_appointments_menu','settings',$settings);

        ?>
        <div id="ap_appointments_menu"></div>
        <?php
    });
});

?>
