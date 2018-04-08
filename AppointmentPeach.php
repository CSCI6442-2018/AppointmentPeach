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

/*shortcode*/
add_shortcode(
    'appointment_peach',
    function($atts=[], $content=null){

        wp_enqueue_style('ap_style_app', plugins_url('./static/app.css', __FILE__));

        wp_enqueue_script('ap_script_app', plugins_url('./static/app.js',__FILE__), array('jquery'));
        wp_localize_script('ap_script_app','ajax_object',array('ajax_url' => admin_url('admin-ajax.php')));

        ?>
        <div id="ap">
            <h1>Make An Appointment</h1>
            <div id="appt_types"></div>
        </div>
        <?php
        return $content;
    }
);

/*shortcode*/
add_shortcode(
    'appointment_peach_admin',
    function($atts=[], $content=null){

        if(!current_user_can('manage_options')){
            return;
        }

        wp_enqueue_style('ap_style_admin', plugins_url('./static/admin.css', __FILE__));

        wp_enqueue_script('ap_script_admin', plugins_url('./static/admin.js',__FILE__), array('jquery'));
        wp_localize_script('ap_script_admin','ajax_object',array('ajax_url' => admin_url('admin-ajax.php')));

        ?>
        <div id="ap_admin">
            <div id="ap_admin_dialog_box_mask"></div>
            <h1>AppointmentPeach Admin Menu</h1>
            <h2>Appointment Types</h2>
            <table id="appt_types_admin"></table>
            <button id="add_appt_type_btn">Add an appointment type</button>
            <a href="<?=plugins_url('print_appt_types.php',__FILE__)?>"><button>Print as PDF file</button></a>
        </div>
        <?php
        return $content;
    }
);

/*shortcode*/
add_shortcode(
    'appointment_peach_test',
    function($atts=[], $content=null){
        wp_enqueue_style('ap_style_test', plugins_url('./static/test.css', __FILE__));
        wp_enqueue_script('ap_script_test', plugins_url('./static/test.js',__FILE__), array('jquery'));
        wp_localize_script('ap_script_test','ajax_object',array('ajax_url' => admin_url('admin-ajax.php')));
        ?>
        <div id="ap_test">
            <button id="ap_test_insert_test">Insert test data</button>
            <button id="ap_test_delete_test">Delete test data</button>
            <div style="clear: both"></div>
            <br>
            <p style="display: none;" id="ap_test_insert_test_done">Done inserting test data!</p>
            <p style="display: none;" id="ap_test_delete_test_done">Done deleting test data!</p>
        </div>
        <?php
        return $content;
    }
);

/*menu*/
add_action('admin_menu', function(){
    add_menu_page(
        'AppointmentPeach',
        'AppointmentPeach',
        'manage_options',
        basename(__FILE__),
        function(){
            if(!current_user_can('manage_options')){
                return;
            }
            ?>
            <div id="ap">
            </div>
            <?php
        }
    );
});

/*actions*/
add_action('wp_ajax_add_appt_type', function(){
    global $wpdb;

    $title=$_POST['title'];
    $description=$_POST['description'];
    $length=intval($_POST['length']);

    $sql="INSERT INTO ap_appt_types (`title`, `description`, `icon`, `length`) VALUES ('$title', '$description', NULL, $length);";

    $wpdb->query($sql);
    wp_die();
});

add_action('wp_ajax_delete_appt_type', function(){
    global $wpdb;

    $id=$_POST['id'];

    $sql="DELETE FROM ap_appt_types WHERE id=$id;";

    $wpdb->query($sql);
    wp_die();
});

add_action('wp_ajax_edit_appt_type', function(){
    global $wpdb;

    $id=$_POST['id'];
    $title=$_POST['title'];
    $description=$_POST['description'];
    $length=intval($_POST['length']);

    $sql="UPDATE `ap_appt_types` SET `title`='$title', `description`='$description', `length`=$length, `icon`=NULL WHERE id=$id;";

    $wpdb->query($sql);
    wp_die();
});

add_action('wp_ajax_get_appt_types', function(){
    global $wpdb;
    $res=$wpdb->get_results('SELECT * FROM ap_appt_types;');
    wp_send_json($res);
    wp_die();
});

//Test actions
add_action('wp_ajax_load_test_data', function(){
	ap_add_test_data();
});

add_action('wp_ajax_delete_test_data', function(){
	ap_delete_test_data();
});

/*create db*/
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
        
}
register_activation_hook(__FILE__, 'ap_activate');

function ap_delete_test_data() {
	global $wpdb;
	
	$sql = "SET FOREIGN_KEY_CHECKS = 0;";
	$wpdb->query($sql);
	
	$sql = "TRUNCATE TABLE ap_locations;";
	$wpdb->query($sql);
	
	$sql = "TRUNCATE TABLE ap_users;";
	$wpdb->query($sql);
	
	$sql = "TRUNCATE TABLE ap_time_slots;";
	$wpdb->query($sql);
	
	$sql = "TRUNCATE TABLE ap_appt_types;";
	$wpdb->query($sql);
	
	$sql = "TRUNCATE TABLE ap_appointments;";
	$wpdb->query($sql);
	
	$sql = "TRUNCATE TABLE ap_provider_appt_types;";
	$wpdb->query($sql);
	
	$sql = "SET FOREIGN_KEY_CHECKS = 1;";
	$wpdb->query($sql);
	
    wp_die();
}

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
    
    wp_die();
    
}

/*destroy db*/
function ap_uninstall() {
    global $wpdb;
    $sql = "DROP TABLE IF EXISTS ap_locations, ap_users, ap_time_slots, ap_appt_types, ap_appointments, ap_provider_appt_types;";
    $wpdb->query($sql);
}
register_uninstall_hook(__FILE__, 'ap_uninstall');
?>