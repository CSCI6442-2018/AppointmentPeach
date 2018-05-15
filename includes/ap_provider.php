<?php

add_action('wp_ajax_ap_provider_reject_request', function () {
    global $wpdb;
    $appt_id = $_POST["appt_id"];
    $wpdb->update('ap_appointments',
        array(
            'request_status' => 'rejected',
        ),
        array(
            'appt_id' => $appt_id
        ));

    wp_send_json(array(
        'code' => '0'
    ));

    wp_die();
});

add_action('wp_ajax_ap_provider_confirm_request', function () {
    global $wpdb;
    $appt_id = $_POST["appt_id"];
    $appt = $wpdb->get_row("SELECT * FROM ap_appointments WHERE appt_id={$appt_id};");
    if($appt->request == 'cancel'){
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
    }

    if($appt->request == 'reschedule'){
        $data = json_decode($appt->request_data);
        $date = $data->date;
        $time = $data->time;
        $time_slot = $wpdb->get_row("SELECT date, MIN(time) t FROM ap_time_slots WHERE provider_id={$appt->provider_id} AND appt_id={$appt->appt_id};");
        $old_time = $time_slot->t;
        $old_date = $time_slot->date;

        if ($old_date == $date && $old_time == $time) {
            $wpdb->update('ap_appointments',
                array(
                    'request_status' => 'completed'
                ),
                array(
                    'appt_id' => $appt_id
                )
            );
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
                        'request_status' => 'completed'
                    ),
                    array(
                        'appt_id' => $appt_id
                    )
                );
                for ($i = 0; $i < $duration; $i++) {
                    $t = $old_time + $i;
                    $wpdb->update('ap_time_slots',
                        array(
                            'appt_id' => NULL
                        ),
                        array(
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
                            'date' => $date,
                            'time' => $t
                        )
                    );
                }
            } else {
                $wpdb->update('ap_appointments',
                    array(
                        'request_status' => 'rejected'
                    ),
                    array(
                        'appt_id' => $appt_id
                    )
                );
            }
        }
    }

    wp_send_json(array(
        'code' => '0'
    ));

    wp_die();
});

add_action('wp_ajax_ap_provider_edit_appt', function () {
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

add_action('wp_ajax_ap_provider_new_appt', function () {
    global $wpdb;

    $appt_type_id = $_POST["appt_type"];
    $status = $_POST["status"];
    $provider = get_current_user_id();
    ;
    $customer = $_POST["customer"];
    $date = $_POST["date"];
    $time = $_POST["time"];
    $note = $_POST['note'];

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
                'status' => $status,
                'note' => $note
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

add_action("wp_ajax_ap_provider_edit_info", function () {
    $provider_id = get_current_user_id();
    $location = $_POST["location"];
    $phone = $_POST["phone"];
    update_user_meta($provider_id, 'location', $location);
    update_user_meta($provider_id, 'phone', $phone);
    wp_send_json(array(
        "code" => "0"
    ));
    wp_die();
});

add_action("wp_ajax_ap_provider_get_appt_types", function () {
    global $wpdb;

    $provider_id = get_current_user_id();

    $res = $wpdb->get_results("SELECT ap_appt_types.*
                            FROM ap_provider_appt_types,ap_appt_types
                            WHERE ap_provider_appt_types.appt_type_id = ap_appt_types.appt_type_id
                            AND ap_provider_appt_types.provider_id = $provider_id;");

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_provider_get_appts_info', function () {
    global $wpdb;

    $provider_id = get_current_user_id();

    $appts = $wpdb->get_results("SELECT * FROM ap_appointments WHERE provider_id={$provider_id};");

    $res = [];

    foreach ($appts as $appt) {
        $a_id = $appt->appt_id;
        $a_t_id = $appt->appt_type_id;
        $p_id = $appt->provider_id;
        $c_id = $appt->customer_id;

        $customer = new WP_User($c_id);
        $time_slot = $wpdb->get_row("SELECT * FROM ap_time_slots WHERE provider_id={$p_id} AND appt_id={$a_id};");
        $appt_type = $wpdb->get_row("SELECT * FROM ap_appt_types WHERE appt_type_id={$a_t_id};");
        $data = json_decode($appt->request_data);
        if($data){
            $reschedule_date = $data->date;
            $reschedule_time = $data->time;
        }else{
            $reschedule_date = null;
            $reschedule_time = null;
        }
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
            'request' => $appt->request,
            'request_note' => $appt->request_note,
            'request_status' => $appt->request_status,
            'reschedule_date' => $reschedule_date,
            'reschedule_time' => $reschedule_time
        ));
    }

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_provider_approve_appt', function () {
    global $wpdb;

    $provider_id = get_current_user_id();
    $appt_id = $_POST["appt_id"];

    $wpdb->update('ap_appointments',
        array(
            'status' => "approved"
        ),
        array(
            'appt_id' => $appt_id,
            'provider_id' => $provider_id
        ));

    wp_send_json(array(
        'code' => '0'
    ));
    wp_die();
});

add_action('wp_ajax_ap_provider_complete_appt', function () {
    global $wpdb;

    $provider_id = get_current_user_id();
    $appt_id = $_POST["appt_id"];

    $wpdb->update('ap_appointments',
        array(
            'status' => "completed"
        ),
        array(
            'appt_id' => $appt_id,
            'provider_id' => $provider_id
        ));

    wp_send_json(array(
        'code' => '0'
    ));
    wp_die();
});

add_action('wp_ajax_ap_provider_cancel_appt', function () {
    global $wpdb;
    $provider_id = get_current_user_id();
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
            'provider_id' => $provider_id
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

add_action('wp_ajax_ap_provider_get_customers', function () {
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

add_action("wp_ajax_ap_provider_get_time_slots", function () {
    global $wpdb;

    $provider_id = get_current_user_id();

    $res = $wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$provider_id};");

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_provider_get_provider_time_slots', function () {
    global $wpdb;

    $provider_id = intval($_POST['provider_id']);

    $res = $wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$provider_id};");

    wp_send_json($res);
    wp_die();
});

add_action("wp_ajax_ap_provider_add_timeslot", function () {
    global $wpdb;
    //get values
    $log = true; // indicator of system process, true = right, false = fun
    $provider_id = get_current_user_id();
    $date = $_POST['date'];
    $time = intval($_POST["time"]);
    $length = intval($_POST['length']);

    $active = get_users(['role' => 'ap_provider', 'meta_key' => 'active', 'meta_value' => 0, 'meta_compare' => '=']);

    if ($active == 0) {
        wp_send_json(array(
            "code" => "1"
        ));
    } else {
        //insert multiple timeslots
        for ($i = 0; $i < $length; $i++) {
            $t = $time + $i;

            $res = $wpdb->get_results("select *
                                    from ap_time_slots
                                    where provider_id = $provider_id
                                    and date= '$date'
                                    and time = $t;");
            //check if thhe current timeslot has exist
            if (count($res) > 0) {
                //if record exists, don't proceed
                $log = false;
                continue;
            } else {
                //if record not exist then proceed
                $res = $wpdb->insert("ap_time_slots", array(
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
        } else {
            wp_send_json(array(
                "code" => "1"
            ));
        }
    }
    wp_die();
});

add_action("wp_ajax_ap_provider_delete_timeslot", function () {
    global $wpdb;

    // get values
    $log = true;  //record the status;
    $provider_id = get_current_user_id();
    $date = $_POST['date'];
    $time = intval($_POST["time"]);
    $length = intval($_POST['length']);

    //insert multiple rows
    for ($i = 0; $i < $length; $i++) {
        $t = $time + $i;
        // check if timeslot has signed appt_id
        $res = $wpdb->get_results("select appt_id
                                from ap_time_slots
                                where provider_id = $provider_id
                                and date= '$date'
                                and time = $t;");

        if ($res[0]->appt_id) {
            $log = false;
            continue;
        } else {
            $res = $wpdb->delete("ap_time_slots", array(
                "provider_id" => $provider_id,
                "date" => $date,
                "time" => $t,
            ));
        }
    }

    //return status:  0 = success, 1 = unsuccess
    if ($log) {
        wp_send_json(array(
            "code" => "0"
        ));
    } else {
        wp_send_json(array(
            "code" => "1"
        ));
    }

    wp_die();
});

add_action('admin_menu', function () {
    add_menu_page('Appointment', 'Appointment', 'ap_provider', 'ap_provider_overview', function () {

        //setting
        $settings = get_option('wp_custom_appointment_peach');

        //
        $user = wp_get_current_user();
        $provider = array();
        $provider["name"] = $user->data->display_name;
        $provider["email"] = $user->data->user_email;
        $provider["phone"] = get_user_meta($user->ID, 'phone', true);
        $provider["location"] = get_user_meta($user->ID, 'location', true);

        wp_enqueue_style('ap_style_dialog_box', plugins_url("../static/dialog_box.css", __File__));
        wp_enqueue_style('ap_style_ap_provider', plugins_url("../static/ap_provider.css", __File__));
        wp_enqueue_style('ap_style_ap_base', plugins_url("../static/set/css/base.css", __File__));

        wp_enqueue_script('ap_script_react', plugins_url("../lib/js/react-with-addons.min.js", __File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js", __File__));
        wp_enqueue_script('ap_script_dialog_box', plugins_url('../static/dialog_box.js', __File__), array('jquery'));
        wp_enqueue_script('ap_script_ap_provider', plugins_url('../static/ap_provider.js', __File__), array('jquery'));
        wp_localize_script('ap_script_ap_provider', 'settings', $settings);
        wp_localize_script('ap_script_ap_provider', 'provider', $provider);
        ?>
        <div id="ap_provider"></div>
        <hr>
        <a href="<?= plugins_url('../pdf/provider_appts.php', __FILE__) ?>">
            <button class="button-primary">Print my appointments as PDF file</button>
        </a>
        <?php
    });
});
