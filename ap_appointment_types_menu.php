<?php
/*
	Created by:		Xingxing Li
	Description:	APIs on the appt types page
*/

/*
	description:	return the whole table of appt types
*/
add_action('wp_ajax_ap_appointment_types_menu_get_appt_types',function(){
	global $wpdb;
	$sql="select * from ap_appt_types";
	$res = $wpdb->get_results($sql);
	wp_send_json($res);
	wp_die();
});

/*
	Created by:		Xingxing Li
	modified by:	Dingle Zhang 2018-05-03
	description:	update the specified row in ap_appt_types table
	input:			id(int), title(string), description(string), duration(int)
	output:			code:	0	Successful
							1	Duplicate title
							2	Unsuccessfully update
*/
add_action('wp_ajax_ap_appointment_types_menu_edit_appt_type',function(){
	global $wpdb;

	$id = intval($_POST['id']);
	$title = $_POST['title'];
	$description = $_POST['description'];
	$duration = $_POST['duration'];

	//Check dupiclated title with different ID (case insensitive)
	$duplicate=$wpdb->get_results("select appt_type_id from ap_appt_types where upper(title) = upper('$title')");

	//id exist and same id cause error 1
	if ($duplicate[0] && $duplicate[0]->appt_type_id != $id) {
		wp_send_json(array(
			"code"=>"1"
			));
	}

	$sql = "update ap_appt_types set title = %s, description = %s, duration = %d where appt_type_id = %d";
	$res = $wpdb->query($wpdb->prepare($sql, $title, $description, $duration, $id));

	if($res || $res === 0)	// TODO: test this part
	{
		wp_send_json(array(
			"code" => "0"
		));
	}else{
		wp_send_json(array(
			"code" => "2"
		));
	}

	wp_die();
});

/*
	Created by:		Xingxing Li
	Modified by:	Dingle Zhang	2018-05-03
	description:	add a new row in the ap_appt_types table
	input:			title(string), description(string), duration(int)
	output:			code:	0	add successfully
							1	duplicate title
							2	unexpected error
*/
add_action('wp_ajax_ap_appointment_types_menu_add_appt_type', function(){
	global $wpdb;

	//get parameter
	$title = $_POST['title'];
	$description = $_POST['description'];
	$duration = $_POST['duration'];

	//check duplicate title
	$duplicate=$wpdb->get_results("select appt_type_id from ap_appt_types where upper(title) = upper('$title')");

	if (count($duplicate)) {
		// code.
		wp_send_json(array(
			"code" => "1"
		));
	}

	//Insert new type
	$sql = "INSERT INTO ap_appt_types (appt_type_id, title, description, duration) VALUES(%d, %s, %s, %d)";
	$res = $wpdb->query($wpdb->prepare($sql, $id, $title, $description, $duration));

	if($res){
		wp_send_json(array(
			"code" => "0"
		));
	}else{
		wp_send_json(array(
			"code" => "2"
		));
	}

	wp_die();

});

/*
	Creator: 		Dingle Zhang
	Description:	delete appointment appointment types in ap_appt_types
	Input:			appt_type_id(int)
	Output:			code : 0 === Successful
						   1 === Unsuccessful
 */
add_action("wp_ajax_ap_appointment_types_menu_deactivate_appt_type", function(){
	global $wpdb;

	$appt_type_id = intval($_POST['appt_type_id']);

	$res = $wpdb->update("ap_appt_types", array(
		"active" => 0
	), array(
		"appt_type_id" => $appt_type_id
	));

	if ($res) {
		wp_send_json(array(
			"code" => "0"
		));
	}else{
		wp_send_json(array(
			"code" => "1"
		));
	}

	wp_die();
});

?>
