<?php

/*
 * create tables in database and add options when user installs this plugin
 * */
function activation()
{
    global $wpdb;
    $sql_file = file_get_contents(plugins_url('./sql/activation.sql', __FILE__));
    $sql = explode(";", $sql_file);
    for ($i = 0; $i < count($sql); $i++) {
        $wpdb->query($sql[$i]);
    }

    // add custom roles
    add_role('ap_business_administrator', 'Business Administrator', array('read' => true, 'ap_business_administrator' => true));
    add_role('ap_provider', 'Provider', array('read' => true, 'ap_provider' => true));

    // add custom options
    add_option('wp_custom_appointment_peach', ['installed' => false]);
}

function show_setup_menu()
{
    $options = get_option('wp_custom_appointment_peach');
    $option_installed = $options['installed'];
    if (!$option_installed) {
        require_once 'includes/set/setup.php';
        // is just installed
        // display setup page
        // require capability <manage_options> to display
        add_action('admin_menu', function () {
            add_menu_page(
                'Appointment Peach Setup',
                'Appointment',
                'manage_options',
                'appointment_peach',
                'setup_menu_page_html'
            );
        });
    } else {
        include_once "ap_overview_menu.php";
        include_once "ap_provider_menu.php";
        include_once "ap_appointments_menu.php";
        include_once "ap_test_menu.php";
    }
}
