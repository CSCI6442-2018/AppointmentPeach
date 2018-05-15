<?php
add_action('wp_ajax_ap_appointments_menu_get_appt_types', function () {
    global $wpdb;
    $res = $wpdb->get_results('SELECT * FROM ap_appt_types;');
    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_get_providers_by_appt_type', function () {
    global $wpdb;

    $appt_type_id = intval($_POST['appt_type_id']);

    $provider_ids_by_appt_type = $wpdb->get_results("SELECT provider_id FROM ap_provider_appt_types WHERE appt_type_id=$appt_type_id;");

    $res = [];

    for ($i = 0; $i < count($provider_ids_by_appt_type); $i++) {
        $provider_id = $provider_ids_by_appt_type[$i]->provider_id;
        $provider = new WP_User($provider_id);
        $activated = get_user_meta($provider->ID, 'activated', true);
        $phone = get_user_meta($provider->ID, 'phone', true);
        $location = get_user_meta($provider->ID, 'location', true);
        // remove few fields
        $data = $provider->data;
        $data->user_pass = null;
        $data->user_login = null;
        $data->user_registered = null;
        $data->user_status = null;
        $data->user_activation_key = null;
        $data->active = $activated;
        $data->phone = $phone;
        $data->location = $location;
        $res[] = $data;
    }

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_get_appts_info', function () {
    global $wpdb;

    $appts = $wpdb->get_results("SELECT * FROM ap_appointments;");

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
            'provider_id' => $p_id,
            'provider_name' => $provider->display_name,
            'customer_id' => $c_id,
            'customer_name' => $customer->display_name,
            'date' => $time_slot->date,
            'time' => $time_slot->time,
        ));
    }
    
    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_get_provider_time_slots', function () {
    global $wpdb;

    $provider_id = intval($_POST['provider_id']);

    $res = $wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$provider_id};");

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_get_customers', function () {
    $query_parameters = ['role' => 'subscriber'];
    $customers = get_users($query_parameters);
    $res = [];
    foreach ($customers as $customer){
        $phone = get_user_meta($customer->ID, 'phone', true);
        $location = get_user_meta($customer->ID, 'location', true);
        // remove few fields
        $data = $customer->data;
        $data->user_pass = null;
        $data->user_login = null;
        $data->user_registered = null;
        $data->user_status = null;
        $data->user_activation_key = null;
        $data->phone = $phone;
        $data->location = $location;
        $res[] = $data;
    }
    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_new_appt', function () {
    global $wpdb;

    $appt_type_id = $_POST["appt_type"];
    $status = $_POST["status"];
    $provider = $_POST["provider"];
    $customer = $_POST["customer"];
    $date = $_POST["date"];
    $time = $_POST["time"];

    $appt_type = $wpdb->get_row("SELECT * FROM ap_appt_types WHERE appt_type_id={$appt_type_id};");
    $duration = $appt_type->duration;

    $accept = true;
    for ($i = 0; $i < $duration; $i++) {
        $t = $time + $i;
        $s = $wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$provider} AND time={$t} AND date='{$date}' AND appt_id IS NULL;");
        if (count($s) == 0) {
            $accept = false;
            break;
        }
    }

    if ($accept == true) {
        $wpdb->insert('ap_appointments',
            array(
                'provider_id' => $provider,
                'customer_id' => $customer,
                'appt_type_id' => $appt_type_id,
                'status' => $status
            )
        );
        $appt_id = $wpdb->insert_id;
        for ($i = 0; $i < $duration; $i++) {
            $t = $time + $i;
            $wpdb->update('ap_time_slots',
                array(
                    'appt_id' => $appt_id
                ),
                array(
                    'provider_id' => $provider,
                    'date' => $date,
                    'time' => $t
                )
            );
        }
        wp_send_json(array(
            'code' => '0'
        ));
    } else {
        wp_send_json(array(
            'code' => '1'
        ));
    }

    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_edit_appt', function () {
    global $wpdb;
    $appt_id = $_POST["appt_id"];
    $status = $_POST["status"];
    $date = $_POST["date"];
    $time = $_POST["time"];

    $appt = $wpdb->get_row("SELECT * FROM ap_appointments WHERE appt_id={$appt_id};");

    $time_slot = $wpdb->get_row("SELECT date, MIN(time) t FROM ap_time_slots WHERE provider_id={$appt->provider_id} AND appt_id={$appt->appt_id};");
    $old_time = $time_slot->t;
    $old_date = $time_slot->date;

    if ($old_date == $date && $old_time == $time) {
        $wpdb->update('ap_appointments',
            array(
                'status' => $status
            ),
            array(
                'appt_id' => $appt_id
            ));

        wp_send_json(array(
            'code' => '0'
        ));
    } else {
        $appt_type = $wpdb->get_row("SELECT * FROM ap_appt_types WHERE appt_type_id={$appt->appt_type_id};");
        $duration = $appt_type->duration;

        $accept = true;
        for ($i = 0; $i < $duration; $i++) {
            $t = $time + $i;
            $s = $wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$appt->provider_id} AND time={$t} AND date='{$date}' AND appt_id IS NULL;");
            if (count($s) == 0) {
                $accept = false;
                break;
            }
        }

        if ($accept == true) {
            $wpdb->update('ap_appointments',
                array(
                    'status' => $status
                ),
                array(
                    'appt_id' => $appt_id
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

            for ($i = 0; $i < $duration; $i++) {
                $t = $time + $i;
                $wpdb->update('ap_time_slots',
                    array(
                        'appt_id' => $appt_id
                    ),
                    array(
                        'provider_id' => $appt->provider_id,
                        'date' => $date,
                        'time' => $t
                    )
                );
            }

            wp_send_json(array(
                'code' => '0'
            ));
        } else {
            wp_send_json(array(
                'code' => '1'
            ));
        }
    }

    wp_die();
});

add_action('wp_ajax_ap_appointments_menu_cancel_appt', function () {
    global $wpdb;
    $appt_id = $_POST["appt_id"];

    $appt = $wpdb->get_row("SELECT * FROM ap_appointments WHERE appt_id={$appt_id};");

    $appt_type = $wpdb->get_row("SELECT * FROM ap_appt_types WHERE appt_type_id={$appt->appt_type_id};");
    $duration = $appt_type->duration;

    $time_slot_old = $wpdb->get_row("SELECT date, MIN(time) t FROM ap_time_slots WHERE provider_id={$appt->provider_id} AND appt_id={$appt->appt_id};");
    $old_time = $time_slot_old->t;
    $old_date = $time_slot_old->date;

    $wpdb->delete('ap_appointments',
        array(
            'appt_id' => $appt_id
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

add_action('admin_menu', function () {
    add_submenu_page('overview', "Appointments", "Appointments", 'ap_business_administrator', 'ap_appointments_menu', function () {

        $settings = get_option('wp_custom_appointment_peach');

        wp_enqueue_style('ap_style_dialog_box', plugins_url("../static/dialog_box.css", __File__));
        wp_enqueue_style('ap_style_appointments_menu', plugins_url("../static/ap_appointments_menu.css", __File__));

        wp_enqueue_script('ap_script_react', plugins_url("../lib/js/react-with-addons.min.js", __File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js", __File__));
        wp_enqueue_script('ap_script_dialog_box', plugins_url('../static/dialog_box.js', __File__), array('jquery'));
        wp_enqueue_script('ap_script_appointments_menu', plugins_url('../static/ap_appointments_menu.js', __File__), array('jquery'));
        wp_localize_script('ap_script_appointments_menu', 'settings', $settings);

        ?>
        <div id="ap_appointments_menu"></div>
        <hr>
        <a href="<?=plugins_url('../pdf/appts.php',__FILE__)?>"><button>Print as PDF file</button></a>
        <?php
    });
});

?>
