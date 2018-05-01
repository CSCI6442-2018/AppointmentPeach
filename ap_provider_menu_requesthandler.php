<?php
add_action('wp_ajax_test_action', function(){
	$message = $_POST['message'];
	echo 'successfully connect to server. the message I received is:'.$message;
	wp_die();
});
?>