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

require_once 'activation.php';
register_activation_hook(__FILE__,"activation");
show_setup_menu();

