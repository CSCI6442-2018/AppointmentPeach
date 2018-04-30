<?php

add_action('admin_menu',function(){
    add_submenu_page('overview',"Appointments","Appointments",'manage_options','ap_appointments_menu',function(){

        wp_enqueue_style('ap_style_appointment_menu', plugins_url("/static/ap_appointment_menu.css",__File__));
        
        wp_enqueue_script('ap_script_appointment_menu',plugins_url('/static/ap_appointment_menu.js',__File__), array('jquery'));

        ?>

        <h1>Appointments Menu</h1>

        <?php
    });
});

?>
