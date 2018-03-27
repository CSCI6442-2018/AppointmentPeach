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
?>