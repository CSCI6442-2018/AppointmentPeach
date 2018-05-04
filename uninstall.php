<?php

/*
 * This file is run automatically when the users deletes the plugin.
 * */

// if uninstall.php is not called by WordPress, die
if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

global $wpdb;
$sql_file=file_get_contents(plugins_url('./sql/uninstall.sql',__FILE__));
$sql=explode(";",$sql_file);
for($i=0;$i<count($sql);$i++){
    $wpdb->query($sql[$i]);
}

// delete options
delete_option('wp_custom_appointment_peach');