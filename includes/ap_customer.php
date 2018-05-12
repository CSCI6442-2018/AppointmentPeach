<?php

add_action('wp_ajax_ap_customer_get_appointments', function (){
    global $wpdb;
    $user = wp_get_current_user();
    $user_id = $user->ID;
    $raw = $wpdb->get_results("SELECT * FROM ap_appointments WHERE customer_id = $user_id;");
    $providers = get_users(['role' => 'ap_provider']);
    $res = [];
    foreach ($raw as $appointment) {
        $provider_id = $appointment->provider_id;
        $p = null;
        foreach ($providers as $provider){
            if($provider->ID == $provider_id){
                $p = $provider;
                break;
            }
        }

        if($p != null){
            $appointment->provider_name = $p->user_nicename;
            $location = get_user_meta($provider_id, 'location', true);
            $appointment->location = $location;
        }
    }
    wp_send_json($res);
    wp_die();
});

add_action('admin_menu', function () {
    add_menu_page('Appointments', 'Appointments', 'subscriber', 'ap_customer_overview', function () {

        wp_enqueue_style('ap_style_dialog_box', plugins_url("../static/dialog_box.css", __File__));
        wp_enqueue_style('ap_style_customer_overview_menu', plugins_url("../static/ap_customer.css", __File__));

        wp_enqueue_script('ap_script_react', plugins_url("../lib/js/react-with-addons.min.js", __File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js", __File__));
        wp_enqueue_script('ap_script_dialog_box', plugins_url('../static/dialog_box.js', __File__), array('jquery'));
        ?>
        <div id="ap_customer_overview_container">Admin Page for Customer</div>
        <?php
    });
});