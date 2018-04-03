<?php
/*
Plugin Name:  AppointmentPeach
Plugin URI:   http://appointmentpeach.com
Description:  Self-Booked Customer Appointments
Version:      0.0.1
Author:       GWU CSCI6442 2018
Author URI:   https://github.com/CSCI6442-2018
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  AppointmentPeach
Domain Path:  /languages
*/

/*
render
*/
$render_html=<<<HTML
<div id="ap">
    <h1>AppointmentPeach</h1>
</div>
HTML;

function ap_render(){
    global $render_html;
    echo $render_html;
}

/*
admin
*/
$admin_html=<<<HTML
<p id="ap_admin">Please use shortcode [appointment_peach] in your page.</p>
HTML;

function ap_admin(){
    global $admin_html;
    echo $admin_html;
}

/*
menu
*/
function ap_menu(){
    add_menu_page("appointment_peach", "appointment_peach", 'edit_plugins', basename(__FILE__), 'ap_admin');
}

add_action('admin_menu', 'ap_menu');

/*
shortcode
*/
add_shortcode('appointment_peach', 'ap_render');

/*
styles
*/
function ap_add_style_app() {
    wp_register_style('ap_style_app', plugins_url('./static/app.css', __FILE__));
    wp_enqueue_style('ap_style_app');
}
add_action('wp_enqueue_scripts', 'ap_add_style_app'); 

/*
scripts
*/
function ap_add_script_app(){
    wp_deregister_script('jquery');
    wp_register_script('jquery', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js', array(), null, false);
    wp_register_script('ap_script_app', plugins_url('./static/app.js',__FILE__), array('jquery'));
    wp_enqueue_script('ap_script_app');
}
add_action('wp_enqueue_scripts', 'ap_add_script_app');

/*
create db
*/
function ap_activate() {
	global $wpdb;
	
	//ap_locations
	$sql = "CREATE TABLE IF NOT EXISTS `ap_locations` (
			  `name` varchar(255) NOT NULL DEFAULT '',
			  PRIMARY KEY (`name`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
	$wpdb->query($sql);
	
	//ap_users
	$sql = "CREATE TABLE IF NOT EXISTS `ap_users` (
			  `user_id` int(11) unsigned NOT NULL,
			  `location` varchar(255) NOT NULL DEFAULT '',
			  `phone` varchar(255) DEFAULT NULL,
			  `role` varchar(255) DEFAULT NULL,
			  KEY `ap_users__location` (`location`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
	$wpdb->query($sql);
	
	//ap_time_slots
	$sql = "CREATE TABLE IF NOT EXISTS `ap_time_slots` (
			  `provider_id` int(11) unsigned NOT NULL,
			  `date` date NOT NULL,
			  `time` tinyint(2) NOT NULL,
			  `appt_id` int(11) unsigned DEFAULT NULL
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
	$wpdb->query($sql);
	
	//ap_appt_types
	$sql = "CREATE TABLE IF NOT EXISTS `ap_appt_types` (
			  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
			  `title` varchar(255) NOT NULL DEFAULT '',
			  `description` text,
			  `icon` varchar(255) DEFAULT NULL,
			  `length` int(11) NOT NULL,
			  PRIMARY KEY (`id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
	$wpdb->query($sql);
	
	//ap_appointments
	$sql = "CREATE TABLE IF NOT EXISTS `ap_appointments` (
			  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
			  `provider_id` int(11) unsigned NOT NULL,
			  `customer_id` int(11) unsigned NOT NULL,
			  `appt_type_id` int(11) unsigned NOT NULL,
			  `status` varchar(255) NOT NULL DEFAULT '',
			  PRIMARY KEY (`id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
	$wpdb->query($sql);
	
	//ap_provider_appt_types
	$sql = "CREATE TABLE IF NOT EXISTS `ap_provider_appt_types` (
			  `provider_id` int(11) unsigned NOT NULL,
			  `appt_type_id` int(11) unsigned NOT NULL
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
	$wpdb->query($sql);
	
	//Add test data
	ap_add_test_data();
		
}
register_activation_hook(__FILE__, 'ap_activate');

function ap_add_test_data() {
	global $wpdb;
	
	//ap_locations
	$sql = "INSERT INTO `ap_locations` (`name`)
			VALUES
				('DC'),
				('LA'),
				('NYC');
			";
	$wpdb->query($sql);
	
	//ap_users
	$sql = "INSERT INTO `ap_users` (`user_id`, `location`, `phone`, `role`)
			VALUES
				(3, 'NYC', '(888) 888-8888', 'provider'),
				(2, 'DC', '(999) 999-9999', 'provider'),
				(1, 'NYC', '(111) 111-1111', 'customer');
			";
	$wpdb->query($sql);
	
	//ap_time_slots
	$sql = "INSERT INTO `ap_time_slots` (`provider_id`, `date`, `time`, `appt_id`)
			VALUES
				(2, '2018-04-01', 18, NULL),
				(2, '2018-04-01', 19, NULL),
				(2, '2018-04-01', 20, 1),
				(2, '2018-04-01', 21, NULL),
				(2, '2018-04-01', 22, NULL),
				(2, '2018-04-01', 23, NULL),
				(2, '2018-04-02', 18, NULL),
				(2, '2018-04-02', 19, NULL),
				(2, '2018-04-02', 20, NULL),
				(2, '2018-04-02', 21, NULL),
				(2, '2018-04-02', 22, NULL),
				(2, '2018-04-02', 23, NULL),
				(3, '2018-04-01', 18, NULL),
				(3, '2018-04-01', 19, NULL),
				(3, '2018-04-01', 20, NULL),
				(3, '2018-04-01', 21, NULL),
				(3, '2018-04-01', 22, 2),
				(3, '2018-04-01', 23, 2),
				(3, '2018-04-02', 18, NULL),
				(3, '2018-04-02', 19, NULL),
				(3, '2018-04-02', 20, NULL),
				(3, '2018-04-02', 21, NULL),
				(3, '2018-04-02', 22, NULL),
				(3, '2018-04-02', 23, NULL);
			";
	$wpdb->query($sql);
	
	//ap_appt_types
	$sql = "INSERT INTO `ap_appt_types` (`id`, `title`, `description`, `icon`, `length`)
			VALUES
				(1, 'Cleaning', 'A standard teeth cleaning.', NULL, 1),
				(2, 'Whitening', 'An intense teeth whitening.', NULL, 2),
				(3, 'Cavity Filling', 'Filling a cavity.', NULL, 2);
			";
	$wpdb->query($sql);
	
	//ap_appointments
	$sql = "INSERT INTO `ap_appointments` (`id`, `provider_id`, `customer_id`, `appt_type_id`, `status`)
			VALUES
				(1, 2, 1, 1, 'pending'),
				(2, 3, 1, 2, 'completed');
			";
	$wpdb->query($sql);
	
	//ap_provider_appt_types
	$sql = "INSERT INTO `ap_provider_appt_types` (`provider_id`, `appt_type_id`)
			VALUES
				(2, 1),
				(2, 2),
				(3, 3),
				(3, 2);
			";
	$wpdb->query($sql);
	
}

/*
destroy db
*/
function ap_uninstall() {
	global $wpdb;
	$sql = "DROP TABLE IF EXISTS ap_locations, ap_users, ap_time_slots, ap_appt_types, ap_appointments, ap_provider_appt_types;";
	$wpdb->query($sql);
}
register_uninstall_hook(__FILE__, 'ap_uninstall');

?>