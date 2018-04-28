<?php
/*
	function:	test php file
	created by:	xingxing li
	notes:		script for test some function
*/
	require_once('../../../wp-load.php');
	wp_enqueue_script('jqeury');
	$keys = array('1'=>'2',23=>'34');
	$allkeys = array_keys($keys);
	echo $allkeys[1].'<br>';
	class Car{
		private $name;
		function __construct(){
			$this->model = 'empty';
		}
		function show(){
			echo 'show<br>';
			$this->model = "car 1";
		}
	}

	$car = new Car();	
	var_dump($car);

	$car->show();
	var_dump($car);
	echo $car->model;
	echo '<br>';
	echo $_SERVER['HTTP_HOST'];
	echo '<br>';
	echo $_SERVER['REMOTE_ADDR'];
?> 
<div>
	<form method = 'post' action = <?php $_SERVER['PHP_SELF'];?>>
		<span>please enter your name: </span>
		<input type = 'text' name = 'usr_name'>
		<input type = 'radio' name = 'radio_option' value = 'radio_1'>radio_1
		<input type = 'submit' id = 'submit'>
		<hr>
 		<?php
			function process(){
				$radio = $_POST['radio_option'];
				var_dump($radio);

				$name = $_POST['usr_name'];
				var_dump($name);
			}
			if($_SERVER['REQUEST_METHOD'] == 'POST'){
				process();
			}
		?> 
	</form>
</div>
<hr>

<button>hide</button>
<p>hahahaha</p>
<script type="text/javascript" src = './lib/js/jquery-3.3.1.js'></script>
<script type="text/javascript">
	console.log('hello');
	$(function(){
		$('button').click(function(){
			$('p').hide();
		});
	});
</script>

