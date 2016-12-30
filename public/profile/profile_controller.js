(function () {
    'use strict';

    angular
        .module('app')
        .controller('profile_controller',Controller);

    function Controller(UserService,EventService){
    	var vm = this;

        vm.usuario = {};
        vm.nombreImagen = undefined;
        vm.eventos = [];
        vm.eventosCreados = 0;
        vm.eventosAcademicos = 0;
        vm.eventosDeportivos = 0;
        vm.eventosExtracurriculares = 0;
        vm.eventosUrgentes = 0;
    	initController();

		function initController(){
			UserService.getCurrentUser()
    			.then(function(usuario){
    				vm.usuario = usuario;
                    vm.nombreImagen = vm.usuario.foto_perfil.split("/")[4];
    			})
    			.catch(function(err){
    				vm.usuario = {};
    			});
            EventService.getByCreator()
                .then(function(eventos){
                    vm.eventos=eventos;
                    contarEventos(vm.eventos);
                })
                .catch(function(err){
                    console.log(err);
                })
		}

        function contarEventos(eventos){
            for (var i = eventos.length - 1; i >= 0; i--) {
                switch(eventos[i].categoria){
                    case 1: vm.eventosExtracurriculares+=1;break;
                    case 2: vm.eventosAcademicos+=1;break;
                    case 3: vm.eventosDeportivos+=1;break;
                    case 4: vm.eventosUrgentes+=1;break;
                }
            };
            vm.eventosCreados=eventos.length;
        }
    }
})();