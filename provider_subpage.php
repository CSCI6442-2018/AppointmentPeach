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
	echo '<div id =\'appt_types_table_div\'>';
		echo "<table id='appt_types_table'>";
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
				echo "<tr>";
				foreach ($value as $key2 => $value2) {
					echo "<td>";
					echo $value2;
					echo "</td>";
				}
				echo '<td><a href=\'#\'>edit</a><td>';
				echo '<td><a href="#">delete</a><td>';
				echo "<br>";
				echo "</tr>";
				
			}
		echo "</table>";
	echo '</div>';
	?>
	<div id='message'>
		<p></p>
	</div>
	<script type="text/javascript">
		var selected_row;	//get the selected row for appointment type 
		jQuery(document).ready(function($){
			// select the appinotment table
			var tr = $('#appt_types_table').find('tr');
			tr.hover(
				function(){
					$(this).attr('class', 'z-depth-3');
					$('#message').html($(this).text());
				},
				function(){
					$(this).attr('class', '');
				}

			);
			tr.click(function(){
				$(this).css('background-color','pink');
				// console.log($(this).text());
				for(var i = 0 ; i < tr.length; i++){
					var row = tr[i];
					console.log(row.toString());
					// if(row != $(this)){
					// 	row.css('background-color', '');
					// }
				}			

			});


		});

	</script>

	<?php
}

?>