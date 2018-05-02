<?php
add_action('admin_menu',function(){
    add_submenu_page('overview',"Test","Test",'manage_options','ap_test_menu',function(){
        wp_enqueue_script('ap_script_test', plugins_url('./static/ap_test_menu.js',__FILE__), array('jquery'));
        wp_localize_script('ap_script_test','ajax_object',array('ajax_url' => admin_url('admin-ajax.php')));
        ?>
        <div id="ap_test">
            <h1>Test Menu</h1>
            <button id="ap_test_insert_test">Insert test data</button>
            <button id="ap_test_delete_test">Delete test data</button>
        </div>
        <?php
    });
});

add_action('wp_ajax_load_test_data',function(){
    global $wpdb;
    $sql_file=file_get_contents(plugins_url('./sql/load_test_data.sql',__FILE__));
    $sql=explode(";",$sql_file);
    for($i=0;$i<count($sql);$i++){
        $wpdb->query($sql[$i]);
    }

    wp_die();
});

add_action('wp_ajax_delete_test_data',function(){
    global $wpdb;
    $sql_file=file_get_contents(plugins_url('./sql/delete_test_data.sql',__FILE__));
    $sql=explode(";",$sql_file);
    for($i=0;$i<count($sql);$i++){
        $wpdb->query($sql[$i]);
    }

    wp_die();
});

?>