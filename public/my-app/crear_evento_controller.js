(function () {
	'use strict';

	angular
		.module('app')
		.controller('crear_evento_controller',Controller);

	function Controller($window,EventService,$routeParams){
		var vm = this;
		vm.evento = {
			titulo: '',
			fecha_inicial: undefined,
			fecha_final: '',
			lugar: '',
			categoria: ''+$routeParams.categoria
		}

		vm.desdeSelected = false;
		vm.hastaSelected = false;

		vm.selectDesde = function(){
			vm.desdeSelected = true;
		}
		vm.selectHasta = function(){
			vm.hastaSelected = true;
		}

	}
})();