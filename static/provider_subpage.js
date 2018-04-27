/*
	funciton: 	js functions for provider subpage
	created by: access team 
*/

jQuery(document).ready(function($){
			var rows = $('#appt_types_table').find('tr');
			// add hover effects on table row
			rows.hover(
				function(){
					$(this).attr('class', 'z-depth-3');
					$('#message').html($(this).text());
				},
				function(){
					$(this).attr('class', '');
				}

			);
			// change the color when click
			rows.click(function(){
				remove_color(rows);
				$(this).css('background-color','pink');			
			});
			// recover the color of the table when mouse leaves
			function recover_appt_type_table(event){
				// get the event object
				var event = event || windown.event;
				// use event to get the event source element
				var element = event.target || event.srcElement;
				while(element){
					// if the click area is in table, don't do anything
					if(element.id && element.id == 'appt_types_table'){
						return;
					}else{
						element = element.parentNode;
					}
				}
				remove_color(rows);
			}
			function remove_color(rows){
				for(var i = 0 ; i < rows.length; i++){
					var row = rows[i];
					$(row).css('background-color','');
				}
			}
			// recover the color when mouse leave the table
			$(document).bind('click', function(e){
				recover_appt_type_table(e);
			});
			
		});