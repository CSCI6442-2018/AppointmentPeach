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
        ?>
        <div id="ap">
            <h1>Make An Appointment</h1>
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
                <h1>AppointmentPeach Admin Menu</h1>
            </div>
            <?php
        }
    );
});

/*style*/
add_action('wp_enqueue_scripts', function(){
    wp_enqueue_style('ap_style_reset', plugins_url('./static/reset.css', __FILE__));
    wp_enqueue_style('ap_style_app', plugins_url('./static/app.css', __FILE__));
});

/*admin style*/
add_action('admin_enqueue_scripts', function(){
    wp_enqueue_style('ap_style_reset', plugins_url('./static/reset.css', __FILE__));
    wp_enqueue_style('ap_style_admin', plugins_url('./static/admin.css', __FILE__));
});

/*script*/
add_action('wp_enqueue_scripts', function(){
    wp_deregister_script('jquery');
    wp_register_script('jquery', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js', array(), null, false);
    wp_enqueue_script('ap_script_app', plugins_url('./static/app.js',__FILE__), array('jquery'));
    wp_localize_script('ap_script_app','ajax_object',array('ajax_url' => admin_url('admin-ajax.php')));
});

/*admin script*/
add_action('admin_enqueue_scripts', function(){
    wp_deregister_script('jquery');
    wp_register_script('jquery', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js', array(), null, false);
    wp_enqueue_script('ap_script_admin', plugins_url('./static/admin.js',__FILE__), array('jquery'));
});

/*init db when plugin activated*/
register_activation_hook( __FILE__, function(){
    $sql=file_get_contents(plugins_url('./doc/tables.sql', __FILE__));
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
});

/*actions*/
add_action('wp_ajax_ajax_test', function(){
    $dt=intval($_POST['dt']);
    echo($dt+1);
    wp_die();
});
?>