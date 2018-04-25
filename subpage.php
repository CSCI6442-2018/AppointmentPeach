<?php
/*
	function:	add provider subpage
	created by:	access team
	note:		including some test material
*/


function subpage(){
	// load the external css file, since we can't access the <head>
	wp_enqueue_style('materailize_css', plugins_url("./lib/css/materialize.css",__File__));
	wp_enqueue_script('materailize_js', plugins_url("./lib/js/materialize.js",__File__));
	wp_enqueue_script('jquery_js',"https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js");
	?>
	<!--the test div-->
	<div class="card-panel teal lighten-2">
		<h1>Provider</h1>
	</div>
	<!--test end-->
	<?php
	global $wpdb;
	// query the appointment type
	$res = $wpdb->get_results("select * from ap_appt_types");
	// generate the appointment type 
	echo '<div id = \'appt_types_table\'>';
		echo "<table class  = \' striped\'>";
			echo '<caption><h2>Appointment type<h2></caption>';
			// print the head of the table
			$value = $res[0];
			foreach($value as $key2=>$value2){
				echo "<th>$key2</th>";
			}
			// post-process: add 2 new <td> for edit and delete
			for($i = 0 ; $i < 2; $i++){
				echo '<th><th>';
			}
			
			// print all the rows
			foreach($res as $key=>$value){
				echo "<tr onmousemove ='changeColor(this)' onmouseout = 'normalColor(this)'>";
				foreach ($value as $key2 => $value2) {
					echo "<td id = '$key2'>";
					echo $value2;
					echo "</td>";
				}
				echo '<td><a href=\'#\' onclick = \'test()\'>edit</a><td>';
				echo '<td><a href="#" onclick = \'test()\'>delete</a><td>';
				echo "<br>";
				echo "</tr>";
				
			}
		echo "</table>";
	echo '</div>';
	?>
	<script type="text/javascript">
		// change color of row
		var selected_row;	//get the selected row for appointment type 
		function changeColor(e){
			selected_row = e;
			e.style.backgroundColor = 'pink';
		}
		function normalColor(e){			
			e.style.backgroundColor = '';
		}
		function selectRow(e){
			if(selected_row!=undefined)
			{
				selected_row.style.backgroundColor = '';
			}
			selected_row = e;
			e.style.backgroundColor = 'pink';

			console.log(selected_row.cells[1].innerHTML);
		}
		function test(){
			if(selected_row != undefined)
			selected_row.cells[0].innerHTML = 'hahahaha';
		}

	</script>


	<?php
}

?>