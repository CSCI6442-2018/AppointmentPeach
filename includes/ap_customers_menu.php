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
    foreach ($raw as $customer){
        $phone = get_user_meta($customer->ID, 'phone', true);
        $location = get_user_meta($customer->ID, 'location', true);
        // remove few fields
        $data = $customer->data;
        $data->user_pass = null;
        $data->user_login = null;
        $data->user_registered = null;
        $data->user_status = null;
        $data->user_activation_key = null;
        $data->phone = $phone;
        $data->location = $location;
        $res[] = $data;
    }
    wp_die();
}

/*
By Sipeng Wang
Description: edit customer's information by user_id
Params: user_id, name, location, phone, email
Return: success:	the new ap_user table
		fail:		error information
*/
add_action("wp_ajax_ap_customers_menu_edit_user", function () {
    $user_id = $_POST['user_id'];
    $location = $_POST['location'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $name = $_POST['name'];

    update_user_meta( $user_id, 'location', $location);
    update_user_meta( $user_id, 'phone', $phone);
    update_user_meta( $user_id, 'user_nickname', $name);
    update_user_meta( $user_id, 'user_email', $email);

    if(!is_wp_error($user_id)){
        get_table_customers();
    }else{
        wp_send_json("Failed to update customer's information.");
    }
    wp_die();
});