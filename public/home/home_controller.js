(function () {
	'use strict';

	angular
		.module('app')
		.controller('home_controller',Controller);

	function Controller(EventService, webNotification){
		var socket = io.connect( '/', {
			reconnection: false
		});

		socket.on("new event", function(evento) {
			webNotification.showNotification('Nuevo evento '+evento.categoria+' creado', {
				body: evento.titulo,
				icon: '/public/icons/event.png',
				autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
			}, function onShow(error, hide) {
				if (error) {
					window.alert('Unable to show notification: ' + error.message);
				} else {
					console.log('Notification Shown.');
				}
			});
		});

		var vm = this;

		vm.eventosSlider = [];
		vm.eventos = [];
		
		initController();

		function initController(){
			EventService.getSliderEvents()
				.then(function(eventos){
					vm.eventosSlider = eventos;
				})
				.catch(function(err){
					console.log(err);
					vm.eventosSlider = [];
				});
			EventService.getHomeEvents()
				.then(function(eventos) {
					vm.eventos = eventos;
				})
				.catch(function(err){
					console.log(err);
					vm.eventos = [];
				})
		}
	}
})();