/*
	funciton: 	js functions for provider subpage
	created by: access team 
*/

jQuery(document).ready(function($){
	var rows = $('#appt_types_table_body').find('tr');
	// selected row in appt type table
	var appt_type_selected_row = undefined;

	// add hover effects on table row
	rows.hover(
		function(){
			$(this).attr('class', 'z-depth-3');
			$('#message').html('hovered row: '+$(this).text());
		},
		function(){
			$(this).attr('class', '');
		}

	);

	// change the color when click table row
	rows.click(function(){
		remove_color(rows);
		$(this).css('background-color','pink');
		appt_type_selected_row = $(this);
		$('#message_2').html('selected row: '+appt_type_selected_row.text());
		// console.log('click:'+$('#message_2').text());
	});

	// fill the form with selected row information
	function fill_form(){
		if(appt_type_selected_row != undefined){
			var cols = appt_type_selected_row.children('td');
			$('#appt_title').attr('placeholder', cols.eq(1).text());
			$('#appt_description').attr('placeholder', cols.eq(2).text());
			$('#appt_icon').attr('placeholder', cols.eq(3).text());
			$('#appt_time').attr('placeholder', cols.eq(4).text());
		}
	}

	// indicate adding row or editing row
	var add_edit_flag;	

	//edit button listener
	$("#edit_button").click(function(e){
		add_edit_flag = "edit";
		fill_form();
		$('#appt_type_edit').fadeToggle();
	});

	//save button listener
	$("#save_button").click(function(){
		if(appt_type_selected_row != undefined)
		{
			if(add_edit_flag === 'edit'){
				var cols = appt_type_selected_row.children('td');
				// console.log(cols);
				var data = {
					'id': cols.eq(0).text(),
					'title': $('#appt_title').val(),
					'description': $('#appt_description').val(),
					'icon': $('#appt_icon').val(),
					'time': $('#appt_time').val()
				};
				for(var key in data){
					if(data[key] == ''){
						for(var i = 0 ; i < cols.length ; i++){
							if(key == cols.eq(i).attr('value')){
								data[key] = cols.eq(i).text();
							}
						}
					}
				}
				// console.log(data);

				var sendPacket = {
					'action':'test_action',
					'data': data
				};
				console.log(data);
					$.post(ajax_object.ajax_url, sendPacket, function(response){
						console.log('get this from the server:'+ response);
				});
			}
		}
	});



	// recover the color of the table when mouse click other area
	function recover_appt_type_table(event){
		// get the event object
		var event = event || windown.event;
		// use event to get the event source element
		var element = event.target || event.srcElement;
		while(element){
			// if the click area is in table, don't do anything
			if(element.id && element.id == 'appt_types_table_body'){
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

	// hide the edit appintment type form when mouse click other area
	function hide_edit_appt_type_form(event){
		var container = $('#appt_type_edit');
		if(!container.is(event.target) && container.has(event.target).length === 0){
			container.fadeOut();
		}
	}

	// recover the page when the mouse click other area
	$(document).bind('mouseup', function(e){
		recover_appt_type_table(e);
		hide_edit_appt_type_form(e);
	});



			
});