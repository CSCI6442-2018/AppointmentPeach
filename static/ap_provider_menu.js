/*
	funciton: 	js functions for provider subpage
	created by: access team 
*/

jQuery(document).ready(function($){
	// dynamicTable tool: manage the table element. update it dynamically
	var dynamicTable = (function(){
		var _tableId,_table,_fields,_headers,_defaultText;
		// build one html row
		// item is a row object, if it is null, use names as the text value
		function _buildRow(names, item){
			var row='<tr>';
			if(names && names.length > 0){
				$.each(names, function(index, name){
					var col = item?item[name+""]:name;
					var tdWidth = 100/_fields.length;
					row +='<td style="width: '+ tdWidth + '%;">'+col+'</td>';
				});
			}
			row +='</tr>';
			return row;
		}

		//set the hearder of the table
		function _setHeaders(){
			// if no headers, we use _fields as headers
			_headers = (_headers == null || _headers.length < 1)?_fields : _headers;
			var h = _buildRow(_headers);
			if(_table.children("thead").length < 1){
				// insert the thead element as the first node in table element
				_table.prepend('<thead></thead>');
			}
			_table.children('thead').html(h);
		}

		// if there is no item to show, show the default text
		function _setNoItemsInfo(){
			if(_table.length < 1) return; // haven't be configured.
			var colspan = _headers != null && _headers.length > 0 ? 'colspan="'+_headers.length+'"':'';
			var content = '<tr class="no-items"><td ' + colspan + ' style="text-align:center">' + 
            _defaultText + '</td></tr>';
            if(_table.children('tbody').length > 0)
            	_table.children('tbody').html(content);
            else
            	_table.append('<tbody>'+content+'</tbody>');
		}
		// remove default text
		function _removeNoItemsInfo() {
			var c = _table.children('tbody').children('tr');
			if(c.length == 1 && c.hasClass('no-items'))
				_table.children('tbody').empty();
		}

		return {
			config: function(tableId, fields, headers, defaultText){
				_tableId = tableId;
				_table = $('#'+tableId);
				_fields = fields || null;
	            _headers = headers || null;
	            _defaultText = defaultText || 'No items to list...';
	            _setNoItemsInfo();
	            return this;
			},
			// append: if append the rows in data to the end of the table or re set the table
			load: function(data, append){
				if(_table.length < 1) 
					return; 
				_removeNoItemsInfo();
				if(data && data.length > 0){
					var rows = '';
					$.each(data, function(index, item){
						rows += _buildRow(_fields, item);
					});
					var method = append?'append':'html';
					_table.children('tbody')[method](rows);
					var rows = _table.find('tr');
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

				}
				else
					_setNoItemsInfo();
				return this;
			},
			setHeaders: function(){
				if(_table.length < 1) 
					return; 
				_setHeaders();
			},
			clear: function(){
				_setNoItemsInfo();
				return this;
			}
		}
	})();

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
	$("#save_button").bind('mouseup',function(e){
		if(appt_type_selected_row != undefined)
		{
			if(add_edit_flag === 'edit'){
				var cols = appt_type_selected_row.children('td');
				// console.log(cols);
				var data = {
					'id': cols.eq(0).text(),
					'title': $('#appt_title').val() == ''?cols.eq(1).text():$('#appt_title').val(),
					'description': $('#appt_description').val()==''?cols.eq(2).text():$('#appt_description').val(),
					'icon': $('#appt_icon').val()==''?cols.eq(3).text():$('#appt_icon').val(),
					'time': $('#appt_time').val()==''?cols.eq(4).text():$('#appt_time').val()
				};

				var sendPacket = {
					'action':'test_action',
					'data': data
				};
				// console.log(data);
					$.post(ajax_object.ajax_url, sendPacket, function(response){
						// console.log('get this from the server:'+ response);
						var table_data = response;
						dynamicTable.config('appt_types_table_body', ['id','title','description','icon','time']);
						dynamicTable.load(table_data, false);
						$('#appt_type_edit').fadeOut();
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