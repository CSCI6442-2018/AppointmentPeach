<?php

include "../pdf.php";

require('../../../../wp-load.php');

function format_time($t){
    $h=floor($t/60);
    $m=$t%60;

    return (string)floor($h/10).(string)($h%10).":".(string)floor($m/10).(string)($m%10);
}

function print_time($time,$granularity,$duration){
    $s=$time*$granularity;
    $e=($time+$duration)*$granularity;
    return format_time($s)."-".format_time($e);
}

$settings = get_option('wp_custom_appointment_peach');

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
        'status' => array('pending'=>"Pending",'approved'=>'Approved','completed'=>'Completed')[$appt->status],
        'appt_type_title' => $appt_type->title,
        'provider_name' => $provider->display_name,
        'customer_name' => $customer->display_name,
        'date' => $time_slot->date,
        'time' => print_time($time_slot->time,intval($settings['granularity']),$appt_type->duration),
    ));
}

table_pdf($res,['ID','Status','Type','Provider','Customer','Date','Time']);
?>