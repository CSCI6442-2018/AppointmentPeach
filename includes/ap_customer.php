<?php
add_action('wp_ajax_ap_customer_get_appts_info', function () {
    global $wpdb;

    $customer_id=get_current_user_id();

    $appts = $wpdb->get_results("SELECT * FROM ap_appointments WHERE customer_id={$customer_id};");

    $res = [];

    foreach ($appts as $appt){
        $a_id = $appt->appt_id;
        $a_t_id = $appt->appt_type_id;
        $p_id = $appt->provider_id;

        $provider = new WP_User($p_id);
        $time_slot = $wpdb->get_row("SELECT * FROM ap_time_slots WHERE provider_id={$p_id} AND appt_id={$a_id};");
        $appt_type = $wpdb->get_row("SELECT * FROM ap_appt_types WHERE appt_type_id={$a_t_id};");
        array_push($res, array(
            'appt_id' => $a_id,
            'status' => $appt->status,
            'note' => $appt->note,
            'request' => $appt->request,
            'request_note' => $appt->request_note,
            'appt_type_id' => $a_t_id,
            'appt_type_title' => $appt_type->title,
            'appt_type_duration' => $appt_type->duration,
            'provider_id' => $p_id,
            'provider_name' => $provider->display_name,
            'provider_email' => $provider->user_email,
            'provider_phone' => get_user_meta($p_id, 'phone', true),
            'provider_location' => get_user_meta($p_id, 'location', true),
            'date' => $time_slot->date,
            'time' => $time_slot->time,
        ));
    }
    
    wp_send_json($res);
    wp_die();
});

add_action('admin_menu', function () {
    add_menu_page('Appointment', 'Appointment', 'subscriber', 'ap_customer_overview', function () {

        //setting
        $settings=get_option('wp_custom_appointment_peach');

        wp_enqueue_style('ap_style_dialog_box', plugins_url("../static/dialog_box.css", __File__));
        wp_enqueue_style('ap_style_ap_customer', plugins_url("../static/ap_customer.css", __File__));
        wp_enqueue_style('ap_style_ap_base', plugins_url("../static/set/css/base.css", __File__));

        wp_enqueue_script('ap_script_react', plugins_url("../lib/js/react-with-addons.min.js", __File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js", __File__));
        wp_enqueue_script('ap_script_dialog_box', plugins_url('../static/dialog_box.js', __File__), array('jquery'));
        wp_enqueue_script('ap_script_ap_customer',plugins_url('../static/ap_customer.js',__File__), array('jquery'));
        wp_localize_script('ap_script_ap_customer','settings',$settings);
        ?>
        <div id="ap_customer"></div>
        <?php
    });
});