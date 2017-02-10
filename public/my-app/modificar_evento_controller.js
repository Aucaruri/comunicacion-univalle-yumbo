(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificar_evento_controller',Controller);

    function Controller($window,EventService,$routeParams,$timeout){
    	var vm = this;
        vm.evento = {};
        vm.nombreImagen = undefined;
        vm.action = undefined;
    	initController();

		function initController(){
			EventService.getById($routeParams.id)
    			.then(function(evento){
    				vm.evento = evento;
                    vm.nombreImagen = vm.evento.imagen.split("/")[4];
                    vm.action = "/app/eventos/"+vm.evento.evento_id+"?_method=PUT";
                    vm.evento.fecha_inicio = moment(vm.evento.fecha_inicio);
                    vm.formattedDate1 = vm.evento.fecha_inicio.format('DD/MM/YYYY HH:MM');
                    vm.evento.fecha_final = moment(vm.evento.fecha_final);
                    vm.formattedDate2 = vm.evento.fecha_final.format('DD/MM/YYYY HH:MM');
    			})
    			.catch(function(err){
                    vm.evento = {};
    				console.log(err);
    			});
		}
    }
})();