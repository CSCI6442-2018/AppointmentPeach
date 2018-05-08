<?php

add_action('wp_ajax_ap_setup', 'setup');

function setup()
{
    $business_type = $_POST['business_type'];
    $granularity = $_POST['granularity'];

    $options = get_option('wp_custom_appointment_peach');
    $installed = $options['installed'];
    if($installed){
        wp_send_json(['status' => false, 'message'=>'Setup Forbidden.']);
    }
    $options['business_type'] = $business_type;
    $options['granularity'] = $granularity;
    $options['installed'] = true;
    update_option('wp_custom_appointment_peach', $options);
    wp_send_json(['status' => true, 'href' => admin_url(), 'message'=>'Successfully Saved!']);
}

function setup_menu_page_html()
{
    $options = get_option('wp_custom_appointment_peach');
    wp_enqueue_script('ap_script_react', plugins_url("../lib/js/react-with-addons.min.js", __File__));
    wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js", __File__));
    wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js", __File__));
    wp_enqueue_style('ap_style_setup_menu', plugins_url("../static/set/css/setup.css", __File__));
    wp_enqueue_script('ap_script_setup_menu', plugins_url('../static/set/js/setup.js', __File__), array('jquery'));
    wp_localize_script('ap_script_setup_menu', 'options', $options);
    ?>
    <div id="setup_form_container"></div>
    <?php
}