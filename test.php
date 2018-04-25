<?php
/*
	function:	test php file
	created by:	xingxing li
	notes:		script for test some function
*/

$keys = array('1'=>'2',23=>'34');
$allkeys = array_keys($keys);
echo $allkeys[1].'<br>';
class Car{
	function __construct(){

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
		<input type = 'submit'>
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
