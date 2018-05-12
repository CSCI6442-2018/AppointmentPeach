<?php
/*
By Sipeng Wang
Description: get all customers' information
Params: None
Return: success:	the new ap_user table
		fail:		error information
*/
add_action("wp_ajax_ap_customers_menu_get_users", 'get_table_customers');
function get_table_customers()
{
    $query_parameters = ['role' => 'subscriber'];
    $raw = get_users($query_parameters);
    $res = [];
    foreach ($raw as $customer) {
        // remove few fields
        $data = $customer->data;
        $data->user_pass = null;
        $data->user_login = null;
        $data->user_registered = null;
        $data->user_status = null;
        $data->user_activation_key = null;
        $res[] = $data;
    }
    wp_send_json($res);
    wp_die();
}

add_action('admin_menu', function () {
    add_submenu_page('overview', 'Customers', 'Customers', 'ap_business_administrator', 'ap_customers_menu', function () {

        wp_enqueue_style('ap_style_providers_menu', plugins_url("../static/ap_customers_menu.css",__File__));
        wp_enqueue_script('ap_script_react', plugins_url("../lib/js/react-with-addons.min.js",__File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js",__File__));
        wp_enqueue_script('ap_script_providers_menu',plugins_url('../static/ap_customers_menu.js',__File__), array('jquery'));
        ?>
        <div id="customer_list_container"></div>
        <?php
    });
});