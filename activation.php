<?php

/*
 * create tables in database and add options when user installs this plugin
 * */
function activation()
{
    global $wpdb;
    $sql_file = file_get_contents(plugins_url('sql/activation.sql', __FILE__));
    $sql = explode(";", $sql_file);
    for ($i = 0; $i < count($sql); $i++) {
        $wpdb->query($sql[$i]);
    }

    // add custom roles
    add_role('ap_business_administrator', 'Business Administrator', array('read' => true, 'ap_business_administrator' => true));
    add_role('ap_provider', 'Provider', array('read' => true, 'ap_provider' => true));

    // add custom options
    add_option('wp_custom_appointment_peach', ['installed' => false]);

    // for testing purpose
    create_test_users();
//    update_option('wp_custom_appointment_peach', ['installed' => true, 'business_type' => 1, 'granularity' => 30]);
}

function create_test_users()
{
    global $wpdb;
    $sql_file = file_get_contents(plugins_url('sql/activation_users.sql', __FILE__));
    $sql = explode(";", $sql_file);
    for ($i = 0; $i < count($sql); $i++) {
        $wpdb->query($sql[$i]);
    }

    // fix user roles
    $test_user_ids = [
        1109 => 'administrator',
        1110 => 'ap_business_administrator',
        1111 => 'ap_provider',
        1112 => 'ap_provider',
        1113 => 'ap_provider',
        1114 => 'ap_provider',
        1115 => 'ap_provider',
        1116 => 'subscriber',
        1117 => 'subscriber',
        1118 => 'subscriber',
        1119 => 'subscriber',
        1120 => 'subscriber'
    ];
    foreach ($test_user_ids as $user_id => $role) {
        $u = new WP_User($user_id);
        $u->set_role($role);
    }
}

function show_setup_menu()
{
    $options = get_option('wp_custom_appointment_peach');
    $option_installed = $options['installed'];
    if (!$option_installed) {
        require_once 'includes/setup.php';
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
        include_once "includes/ap_customers_menu.php";
        include_once "includes/ap_appointment_types_menu.php";
        include_once "includes/ap_overview_menu.php";
        include_once "includes/ap_providers_menu.php";
        include_once "includes/ap_appointments_menu.php";
        include_once "includes/ap_test_menu.php";
    }
}
