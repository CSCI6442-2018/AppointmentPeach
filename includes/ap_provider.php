<?php

add_action('wp_ajax_ap_provider_get_provider_info', function () {
    $user = wp_get_current_user();
    if (!in_array('ap_provider', (array)$user->roles)) {
        wp_send_json(['status' => false, 'message' => 'current user is not a Provider!']);
    }
    $activated = get_user_meta($user->ID, 'activated', true);
    $phone = get_user_meta($user->ID, 'phone', true);
    $location = get_user_meta($user->ID, 'location', true);
    // remove few fields
    $data = $user->data;
    $data->user_pass = null;
    $data->user_login = null;
    $data->user_registered = null;
    $data->user_status = null;
    $data->user_activation_key = null;
    $data->active = $activated;
    $data->phone = $phone;
    $data->location = $location;
    wp_send_json($data);
});

add_action('admin_menu', function () {
    add_menu_page('Appointments', 'Appointments', 'ap_provider', 'ap_provider_overview', function () {

        wp_enqueue_style('ap_style_dialog_box', plugins_url("../static/dialog_box.css", __File__));

        wp_enqueue_script('ap_script_react', plugins_url("../lib/js/react-with-addons.min.js", __File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js", __File__));
        wp_enqueue_script('ap_script_dialog_box', plugins_url('../static/dialog_box.js', __File__), array('jquery'));
        ?>
        <div id="ap_provider_overview_container">Admin Page for Provider</div>
        <?php
    });
});
