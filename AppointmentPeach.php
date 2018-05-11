<?php
/*
Plugin Name:  AppointmentPeach
Plugin URI:   http://appointmentpeach.com
Description:  Self-Booked Customer Appointments
Version:      0.0.2
Author:       GWU CSCI6442 2018
Author URI:   https://github.com/CSCI6442-2018
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  AppointmentPeach
Domain Path:  /languages
*/

function activation(){
    global $wpdb;
    $sql_file=file_get_contents(plugins_url('./sql/activation.sql',__FILE__));
    $sql=explode(";",$sql_file);
    for($i=0;$i<count($sql);$i++){
        $wpdb->query($sql[$i]);
    }
}
register_activation_hook(__FILE__,"activation");

function uninstall(){
    global $wpdb;
    $sql_file=file_get_contents(plugins_url('./sql/uninstall.sql',__FILE__));
    $sql=explode(";",$sql_file);
    for($i=0;$i<count($sql);$i++){
        $wpdb->query($sql[$i]);
    }
}
register_uninstall_hook(__FILE__,"uninstall");

//
include "app.php";

//
include "ap_overview_menu.php";

include "ap_appointment_types_menu.php";

include "ap_appointments_menu.php";

include "ap_providers_menu.php";

include "ap_test_menu.php";
?>
