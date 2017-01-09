(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificar_evento_controller',Controller);

    function Controller($window,EventService,$routeParams){
    	var vm = this;

        vm.evento = {};
        vm.nombreImagen = undefined;
        vm.action = undefined;
    	initController();

		function initController(){
			EventService.getById($routeParams.id)
    			.then(function(evento){
    				vm.evento = evento;
                    console.log(vm.evento.fecha_inicio);
                    console.log(vm.evento.fecha_final);
                    vm.nombreImagen = vm.evento.imagen.split("/")[4];
                    vm.action = "/app/eventos/"+vm.evento.evento_id+"?_method=PUT";
    			})
    			.catch(function(err){
                    vm.evento = {};
    				console.log(err);
    			});
		}
    }
})();