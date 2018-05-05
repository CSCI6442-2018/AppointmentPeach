<?php
/*
By Sipeng Wang
Description: get all customers' information
Params: None
Return: success:	the new ap_user table
		fail:		error information
*/
add_action("wp_ajax_ap_customers_menu_get_users",'get_table_customers');
function get_table_customers(){
    global $wpdb;

    $res=$wpdb->get_results("SELECT * 
                            FROM ap_users 
                            WHERE ap_users.role='customer';");

    if($res)
        wp_send_json($res);
    else{
        wp_send_json("fail to connnect database. Can't get the table.");
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
add_action("wp_ajax_ap_customers_menu_edit_user",function(){
    global $wpdb;

    $user_id=$_POST['user_id'];
    $name=$_POST['name'];
    $location=$_POST['location'];
    $phone=$_POST['phone'];
    $email=$_POST['email'];

    $res = $wpdb->query("UPDATE ap_users SET name='$name', location='$location', phone='$phone', email='$email' WHERE user_id=$user_id;");

    if($res == 1){
        get_table_customers();
    }else{
        wp_send_json("Failed to update customer's information.");
    }
    
    wp_die();
});