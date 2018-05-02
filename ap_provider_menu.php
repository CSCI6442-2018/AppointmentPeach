<?php
add_action('admin_menu',function(){
    add_submenu_page('overview','Provider','Provider','manage_options','ap_provider_menu',function(){
        wp_enqueue_style('ap_style_provider_menu', plugins_url("/static/ap_provider_menu.css",__File__));
        wp_enqueue_script('ap_script_provider_menu',plugins_url('/static/ap_provider_menu.js',__File__), array('jquery'));
        ?>
        <h1>Provider Menu</h1>
        <?php
    });
});
?>