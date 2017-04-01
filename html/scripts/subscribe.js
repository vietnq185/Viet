$(function () {
	"use strict";
	
	$(document).ready(function(){
	    $('[data-toggle="tooltip"]').tooltip();
	});
	
	$(".subscribe-wrapper").on("click", ".cc-container input[name='card_id']", function (e) {
		if ($(this).val() == 'new') {
			$(".cc-details").show();
		} else {
			$(".cc-details").hide();
		}
	}).on("click", ".payment-method-form input[name='payment_method']", function (e) {
		if ($(this).val() == 'bank') {
			$(".cc-container").hide();
			$(".bank-container").show();
		} else {
			$(".cc-container").show();
			$(".bank-container").hide();
		}
	}).on("click", ".btnCompleteSubscription", function (e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		$("#modalPaymentFailed").modal('show');
	});
});