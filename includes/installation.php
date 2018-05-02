<?php

/**
 *
 * action for plugin being activated
 * when plugin is being activated
 * execute activation.sql file, create data tables
 *
 */
function activation()
{
    global $wpdb;
    $sql_file = file_get_contents(plugins_url('../sql/activation.sql', __FILE__));
    $sql = explode(";", $sql_file);
    for ($i = 0; $i < count($sql); $i++) {
        $wpdb->query($sql[$i]);
    }
}


/**
 * action for plugin being uninstalled
 * when uninstalling the plugin
 * execute uninstall.sql file, delete data tables
 *
 */
function uninstall()
{
    global $wpdb;
    $sql_file = file_get_contents(plugins_url('../sql/uninstall.sql', __FILE__));
    $sql = explode(";", $sql_file);
    for ($i = 0; $i < count($sql); $i++) {
        $wpdb->query($sql[$i]);
    }
}
?>