<?php
add_action('wp_ajax_get_appt_types',function(){
    global $wpdb;
    $res=$wpdb->get_results('SELECT * FROM ap_appt_types;');

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_get_appt_providers',function(){
    global $wpdb;

    $appt_type_id=intval($_POST['appt_type_id']);

    $provider_appt_types=$wpdb->get_results("SELECT provider_id FROM ap_provider_appt_types WHERE appt_type_id=$appt_type_id;");

    $res=[];

    for($i=0;$i<count($provider_appt_types);$i++){
        $provider_id=$provider_appt_types[$i]->provider_id;
        array_push($res,$wpdb->get_results("SELECT * FROM ap_users WHERE user_id=$provider_id;"));
    }

    wp_send_json($res);
    wp_die();
});

add_shortcode(
    'appointment_peach',
    function(){

        wp_enqueue_style('ap_style_app', plugins_url('./static/app.css', __FILE__));

        wp_enqueue_script('ap_script_react', plugins_url("/lib/js/react-with-addons.min.js",__File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("/lib/js/react-dom.min.js",__File__));
        wp_enqueue_script('ap_script_app', plugins_url('./static/app.js',__FILE__), array('jquery'));
        wp_localize_script('ap_script_app','ajax_object',array('ajax_url' => admin_url('admin-ajax.php')));

        ?>
        <div id="ap">
        </div>
        <?php
    }
);
?>