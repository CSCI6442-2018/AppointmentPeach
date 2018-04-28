<?php
/*
	function:	test php file
	created by:	xingxing li
	notes:		script for test some function
*/

	function process(){
		$radio = $_POST['radio_option'];
		var_dump($radio);
		$name = $_POST['usr_name'];
		var_dump($name);
	}
	process();
?>