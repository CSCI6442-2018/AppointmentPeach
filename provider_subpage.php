<?php
/*
	function:	add provider subpage
	created by:	access team
	note:		including some test material
*/


function provider_subpage(){
	// load the external css file, since we can't access the <head>
	wp_enqueue_style('materailize_css', plugins_url("./lib/css/materialize.css",__File__));
	wp_enqueue_script('materailize_js', plugins_url("./lib/js/materialize.js",__File__));
	// load the jquery provided by wp
	wp_enqueue_script('jquery');
	// load the js file
	wp_enqueue_script('provider_subpage',plugins_url('./static/provider_subpage.js',__File__));
	?>
	<div class="card-panel teal lighten-2">
		<h1>Provider</h1>
	</div>

	<?php
	global $wpdb;
	// query the appointment type
	$res = $wpdb->get_results("select * from ap_appt_types");
	// generate the appointment type table
	echo '<div id =\'appt_types_table_div\'>';
		echo "<table id='appt_types_table'>";
			echo '<caption><h2>Appointment type<h2></caption>';
			// print the head of the table
			$value = $res[0];
			foreach($value as $key2=>$value2){
				echo "<th>$key2</th>";
			}
			
			// print all the rows
			foreach($res as $key=>$value){
				echo "<tr>";
				foreach ($value as $key2 => $value2) {
					echo "<td>";
					echo $value2;
					echo "</td>";
				}
				echo "<br>";
				echo "</tr>";
				
			}
		echo "</table>";
	echo '</div>';
	?>
	<div id='message'>
		<p></p>
	</div>
	<!--edit button-->
	<div style = 'text-align:center;'>
		<a class = 'waves-effect waves-light btn'>edit</a>
	</div>
	<?php
	// genenrate the hiden form
}

?>