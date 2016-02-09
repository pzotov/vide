/*
 * Entry file for JS
 * Babel is used to transpile into ES5
 */
"use strict";

// ...
$(function(){
	var form = $("#todo-form"),
		input = $("#todo-input"),
		list = $("#todo-list"),
		tpl = $("#todo-row").html(),
		index = 0;

	$.get('api/data.json', function(items){
		items.forEach(addItem);
	}, 'json');

	form.submit(function(e){
		e.preventDefault();
		$.ajax({
			type: 'post',
			url: 'api/save.json',
			data: {
				title: input.val()
			},
			success: function (result) {
				addItem(result);
				input.val('');
			},
			error: function () {
				alert('Could not save item');
			}
		});
	});

	function addItem(data){
		list.append(tpl.replace(/%index/ig, index));

		var row = $('#row' + index);
		row.find('.title').html(data.title);
		row.find('.date').html(data.date.replace(/(\d{4})-(\d\d)-(\d\d)/, '$3.$2.$1'));
		var author = '';
		if(data.url) author = '<a href="'+data.url+'" target="_blank">' + data.author + '</a>';
		else author = data.author;
		row.find('.author').html(author);
		row.find('.btn-remove').click(function(e){
			e.preventDefault();
			$.get('api/delete.json', {
				id: data.id
			}, function(result){
				if(result.status==1) row.remove();
				else alert('Couldn\'t delete this item. Try again.');
			}, 'json');
		});
		index++;
	}

});
