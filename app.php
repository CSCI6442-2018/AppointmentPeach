<?php

add_shortcode(
    'appointment_peach',
    function(){

        wp_enqueue_style('ap_style_app', plugins_url('./static/app.css', __FILE__));

        wp_enqueue_script('ap_script_react', plugins_url("/lib/js/react-with-addons.min.js",__File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("/lib/js/react-dom.min.js",__File__));
        wp_enqueue_script('ap_script_app', plugins_url('./static/app.js',__FILE__), array('jquery'));
        wp_localize_script('ap_script_app','ajax_object',array('ajax_url' => admin_url('admin-ajax.php')));

        ?>
        <div id="ap">
        </div>
        <?php
    }
);
?>