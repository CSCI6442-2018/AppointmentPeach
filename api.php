<?php

function get_appt_types($wpdb){
    $res=$wpdb->get_results('
        SELECT * FROM ap_appt_types;
    ');

    // $dir = 'F:/data/phplog.txt';
    // $content = '';
    // foreach($res as $i) {
    //     $content .= '/';
    //     $content .= $i->title;
    // }
    // file_put_contents($dir, $content);

    wp_send_json($res);
    wp_die();
}

function get_appt_providers($wpdb){

    $appt_type_id=intval($_POST['appt_type_id']);

    // $res=$wpdb->get_results('
    //     SELECT * FROM wp_users 
    //     INNER JOIN ap_provider_appt_types 
    //     ON wp_users.ID=ap_provider_appt_types.provider_id
    //     WHERE ap_provider_appt_types.appt_type_id=$appt_type_id
    //     GROUP BY wp_users.ID;
    // ');

    $provider_appt_types=$wpdb->get_results("SELECT provider_id FROM ap_provider_appt_types WHERE appt_type_id=$appt_type_id;");

    $res=[];

    for($i=0;$i<count($provider_appt_types);$i++){
        $provider_id=$provider_appt_types[$i]->provider_id;
        array_push($res,$wpdb->get_results("SELECT * FROM ap_users WHERE user_id=$provider_id;"));
    }

    // $dir = 'F:/data/phplog.txt';
    // $content = '';
    // foreach($res as $i) {
    //     $content .= '/';
    //     $content .= $i->title;
    // }
    // file_put_contents($dir, $content);

    wp_send_json($res);
    wp_die();
}

?>