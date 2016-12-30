(function () {
	'use strict';

	angular
		.module('app')
		.controller('ver_evento_controller',Controller);

	function Controller(EventService, UserService, $routeParams){
		var vm = this;

		vm.evento = {};
		vm.nombreImagen = undefined;
		vm.usuario = undefined;
		initController();

		function initController(){
			EventService.getById($routeParams.id)
				.then(function(evento){
					vm.evento = evento;
					vm.nombreImagen = vm.evento.imagen.split('/')[4];
				})
				.catch(function(err){
					console.log(err);
					vm.evento = {};
				});
			UserService.getCurrentUser()
				.then(function(usuario) {
					vm.usuario = usuario;
				})
				.catch(function(err) {
					console.log('No hay usuario conectado');
				});

		}
	}
})();