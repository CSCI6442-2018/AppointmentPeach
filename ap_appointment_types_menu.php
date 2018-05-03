<?php
/*
	Created by:		Xingxing Li
	Description:	APIs on the appt types page
*/




/*
	description:	return the whole table of appt types
*/
add_action('wp_ajax_ap_appointment_types_menu_get_table','get_table');
function get_table(){
	global $wpdb;
	$sql="select * from ap_appt_types";
	$res = $wpdb->get_results($sql);
	if($res)
		wp_send_json($res);
	else{
		wp_send_json("fail to connnect database. Can't get the table.");
	}
	wp_die();
}

/*
	description:	update the specified row in ap_appt_types table
	input:			id(int), title(string), description(string), duration(int)
	output:			success:	the new ap_appt_types table
					fail:		error information
*/
add_action('wp_ajax_ap_appointment_types_menu_edit',function(){
	global $wpdb;
	$id = $_POST['id'];
	$title = $_POST['title'];
	$description = $_POST['description'];
	$duration = $_POST['duration'];

	$sql = "update ap_appt_types set title = %s, description = %s, duration = %d where appt_type_id = %d";
	// echo var_dump($wpdb->prepare($sql,$title, $description, $duration, $id));
	// wp_die();
	$res = $wpdb->query($wpdb->prepare($sql, $title, $description, $duration, $id));
	if($res || $res === 0)
	{
		$sql="select * from ap_appt_types";
		$table_data = $wpdb->get_results($sql);
		if($table_data)
			wp_send_json($table_data);
		else{
			wp_send_json("fail to get appt types table after update.");
		}
	}else{
		wp_send_json('fail to update appt types');
	}
	wp_die();
});

/*
	description:	add a new row in the ap_appt_types table
	input:			title(string), description(string), duration(int)
	output:			success:	the new ap_appt_types table
					fail:		error information
*/
add_action('wp_ajax_ap_appointment_types_menu_add', function(){
	global $wpdb;
	// get the maximun number of id
	$sql = 'SELECT MAX(appt_type_id) as id FROM ap_appt_types;';
	$res = $wpdb->query($sql);
	$id = $res === false?1:$res;
	$title = $_POST['title'];
	$description = $_POST['description'];
	$duration = $_POST['duration'];
	$sql = "INSERT INTO ap_appt_types (appt_type_id, title, description, duration) VALUES(%d, %s, %s, %d)";
	$res = $wpdb->query($wpdb->prepare($sql, $id, $title, $description, $duration));
	if($res){
		wp_send_json("fail to insert row into ap_appt_types");
	}else{
		get_table();
	}
	wp_die();

});

?>
