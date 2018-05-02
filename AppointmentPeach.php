<?php
/*
Plugin Name:  AppointmentPeach
Plugin URI:   http://appointmentpeach.com
Description:  Self-Booked Customer Appointments
Version:      0.0.4
Author:       GWU CSCI6442 2018
Author URI:   https://github.com/CSCI6442-2018
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  AppointmentPeach
Domain Path:  /languages
*/

/**
 * app
 */
add_shortcode(
    'appointment_peach',
    function () {
        wp_enqueue_style('ap_style_app', plugins_url('./static/app.css', __FILE__));
        wp_enqueue_script('ap_script_react', plugins_url("/lib/css/react-with-addons.min.js", __File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("/lib/css/react-dom.min.js", __File__));
        wp_enqueue_script('ap_script_app', plugins_url('./static/app.js', __FILE__), array('jquery'));
        wp_localize_script('ap_script_app', 'ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));

        ?>
        <div id="ap">
        </div>
        <?php
    }
);

// db operations in plugin activation and uninstall
include "includes/installation.php";
register_activation_hook(__FILE__, "activation");
register_uninstall_hook(__FILE__, "uninstall");
include "includes/api.php";
include "includes/ap_overview_menu.php";
include "includes/ap_appointments_menu.php";
include "includes/ap_provider_menu.php";
include "includes/ap_test_menu.php";
?>
