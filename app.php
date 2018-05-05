<?php
add_action('wp_ajax_ap_app_get_appt_types',function(){
    global $wpdb;
    $res=$wpdb->get_results('SELECT * FROM ap_appt_types;');
    wp_send_json($res);
    wp_die();
});


add_action('wp_ajax_ap_app_get_appt_providers',function(){

    global $wpdb;

    $appt_type_id=intval($_POST['appt_type_id']);

    $provider_by_appt_type=$wpdb->get_results("SELECT provider_id FROM ap_provider_appt_types WHERE appt_type_id=$appt_type_id;");

    $res=[];

    for($i=0;$i<count($provider_by_appt_type);$i++){
        $provider_id=$provider_by_appt_type[$i]->provider_id;
        array_push($res,($wpdb->get_results("SELECT * FROM ap_users WHERE user_id=$provider_id;"))[0]);
    }

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_app_get_provider_time_slots',function(){
    global $wpdb;

    $appt_provider_id=intval($_POST['appt_provider_id']);

    $res=$wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$appt_provider_id};");

    wp_send_json($res);
    wp_die();
});

add_shortcode(
    'appointment_peach',
    function () {
        if (is_user_logged_in()) {
            $settings = get_option('wp_custom_appointment_peach');

            wp_enqueue_style('ap_style_app', plugins_url('./static/app.css', __FILE__));

            wp_enqueue_script('ap_script_react', plugins_url("/lib/js/react-with-addons.min.js", __File__));
            wp_enqueue_script('ap_script_react_dom', plugins_url("/lib/js/react-dom.min.js", __File__));
            wp_enqueue_script('ap_script_app', plugins_url('./static/app.js', __FILE__), array('jquery'));
            wp_localize_script('ap_script_app', 'ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));
            wp_localize_script('ap_script_app', 'settings', $settings);

            ?>
            <div id="ap">
            </div>
            <?php
        } else {
            ?>
            <div>
                <label>You need to login to make appointment.</label>
                <?php wp_login_form();?>
                <button onclick="location.href='<?php echo wp_registration_url();?>'">
                    Register
                </button>
            </div>
            <?php
        }
    }
);
?>