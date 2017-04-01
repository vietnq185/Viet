$(document).ready(function() {
	var status;

	$("#contact-form").submit(function(event) {
		event.preventDefault();
		
		var name = $("#contact-name").val(),
		mail = $("#contact-email").val(),
		msg = $("#contact-msg").val();

		var contact = {
			type: "inspi_contact",
			content: "Name: " + name + ". Emai: " + mail + ". Message: " + msg
		}

		$("#contact-wrapper").append('<img id="loading" src="https://cdn.zenquiz.net/static/Assets/loading-animation.gif ">');

		$.ajaxSetup({
		  headers: { 'organic': 'zqmastertoken' }
		});

		$.ajax({
			url: 'https://api.zenquiz.net/v1/reports/',
			type: 'POST',
			data: contact,
		})
		.done(function(data) {
			$("img#loading").remove();
			status = true;
		})
		.fail(function(err) {
			status = false;
		})
		.always(function() {
			if (status) 
				$("#contact-wrapper").append('<span class="text-success" id="stt">Your form is sent successfully</span>');
			else 
				$("#contact-wrapper").append('<span class="text-danger" id="stt">Something happened. Please try again later</span>');
			setTimeout(function() {
				$("span#stt").remove();
			}, 2000);
		});
		
	});

});