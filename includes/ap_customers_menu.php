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
    $options = get_option('wp_custom_appointment_peach');
    $customer_title = $options['customer_title'];

    add_submenu_page('overview', $customer_title, "{$customer_title}", 'ap_business_administrator', 'ap_customers_menu', function () {
        $options = get_option('wp_custom_appointment_peach');
        wp_enqueue_style('ap_style_customers_menu', plugins_url("../static/ap_customers_menu.css",__File__));
        wp_enqueue_style('ap_style_ap_base', plugins_url("../static/set/css/base.css", __File__));

        wp_enqueue_script('ap_script_react', plugins_url("../lib/js/react-with-addons.min.js",__File__));
        wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js",__File__));
        wp_enqueue_script('ap_script_customers_menu',plugins_url('../static/ap_customers_menu.js',__File__), array('jquery'));
        wp_localize_script('ap_script_customers_menu', 'settings', $options);
        ?>
        <div id="customer_list_container"></div>
        <?php
    });
});