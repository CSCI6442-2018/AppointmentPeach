<?php
/*
	function:	add provider subpage
	created by:	access team
	note:		including some test material
*/
function provider_subpage(){
	// load the external css file, since we can't access the <head>
	wp_enqueue_style('materailize_css', plugins_url("/lib/css/materialize.css",__File__));
	wp_enqueue_style('provider_subpage_css', plugins_url("/static/provider_subpage.css",__File__));
	wp_enqueue_script('materailize_js', plugins_url("/lib/js/materialize.js",__File__));
	// load the js file which is dependent on jquery and ban using version number
	wp_enqueue_script('provider_subpage_js',plugins_url('/static/provider_subpage.js',__File__), array('jquery'));
	?>
	<div class="card-panel teal lighten-2">
		<h1>Provider</h1>
	</div>

	<?php
	global $wpdb;
	// query the appointment type
	$res = $wpdb->get_results("select * from ap_appt_types");

	?>
	 <!-- generate the appointment type table -->
	<div id ='appt_types_table_wrapper'>
		<table id='appt_types_table_head' style="width: 100%;">
			<caption><h2>Appointment type</h2></caption>
			<?php 
			// print the head of the table
			$value = $res[0];
			foreach($value as $key2=>$value2){
				echo "<th style='width: 20%;'>$key2</th>";
			}
			?>
		</table>

		<div class = "inner_table_div" style = 'height: 300px; overflow-y: auto; text-align: center;'>	
			<table id ='appt_types_table_body' style="width: 100%;">
				<?php
				// print out the data in scrollable inner table
					foreach($res as $key=>$value){
						echo "<tr>";
						foreach ($value as $key2 => $value2) {
							echo "<td style='width: 20%;'>";
							echo $value2;
							echo "</td>";
						}
						echo "</tr>";
					}
				?>
			</table>
		</div>
	</div>
	<div id='message'>
	</div>
	<div id = 'message_2'>
		
	</div>
	<!--edit button-->
	<div>
		<a class = 'waves-effect waves-light btn' id = 'edit_button'>edit</a>
	</div>
	<!-- genenrate the hiden form -->
	<div id='appt_type_edit' class = 'row'>
		<form class = 'col s12'>
			<!-- row of form -->
			<div class = 'row'>
				<!-- column of form -->
				<div class = 'input-field col s6'>
					<input id = 'appt_title' type = 'text' class = 'validate'>
					<label for='appt_title'>Appoitment Type Title</label>
				</div>			
				
			</div>
			<div class = 'row'>
				<!-- column of form , span the full row-->
				<div class = 'input-field col s12'>
					<input id = 'appt_description' placeholder="type into the description"  type = 'text' class = 'validate'>
					<label for='appt_description'>Appoitment Type Description</label>
				</div>
				
			</div>			
			<div class = 'row'>
				<!-- column of form-->
				<div class = 'input-field col s6'>
					<input id = 'appt_icon' type = 'text' class = 'validate'>
					<label for='appt_icon'>Appoitment Type Icon</label>
				</div>
				<div class = 'input-field col s6'>
					<input id = 'appt_time' type = 'text' class = 'validate'>
					<label for='appt_time'>Appoitment Duration (in minutes)</label>
				</div>
			</div>
			<div class="row">
				<a class = 'waves-effect waves-light btn' class = 'save_button'>save</a>
				<a class = 'waves-effect waves-light btn' class = 'edit_button'>cancel</a>
			</div>
		</form>
	</div>
	<?php
}

?>