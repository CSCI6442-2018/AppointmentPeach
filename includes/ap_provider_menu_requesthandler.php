<?php
add_action('wp_ajax_test_action', function(){
	$data = $_POST['data'];
	//
	// $sql = "update ap_appt_types set title =".$data['title'].", description =".$data['description'].", icon =". $data['icon'].", time =". $data['time']." where id =". $data['id'];

	$sql = "update ap_appt_types set title = %s, description = %s, icon = %s, time = %s where id = %d";
	// echo $sql;
	global $wpdb;
	// update
	$res = $wpdb->query($wpdb->prepare($sql,$data['title'], $data['description'],$data['icon'],$data['time'], $data['id']));
	/*
		$res = array(
			[index]=>object(
						[col name]=> value
					)
		);
	*/
	$res = $wpdb->get_results("select * from ap_appt_types");
	wp_send_json($res);
	wp_die();
});
?>