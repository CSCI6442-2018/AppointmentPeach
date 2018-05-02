<?php
add_action('wp_ajax_get_appt_types',function(){
    global $wpdb;
    $sql_get_appt_types = 'SELECT * FROM ap_appt_types';
    $res=$wpdb->get_results($sql_get_appt_types);
    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_get_appt_providers',function(){
    global $wpdb;
    $appt_type_id=intval($_POST['appt_type_id']);
    $sql_get_provider_id = "SELECT provider_id FROM ap_provider_appt_types WHERE appt_type_id=$appt_type_id";
    $provider_appt_types=$wpdb->get_results($sql_get_provider_id);
    $res=[];
    for($i=0;$i<count($provider_appt_types);$i++){
        $provider_id=$provider_appt_types[$i]->provider_id;
        $sql_get_clients = "SELECT * FROM ap_users WHERE user_id=$provider_id";
        array_push($res,$wpdb->get_results($sql_get_clients));
    }
    wp_send_json($res);
    wp_die();
});

?>