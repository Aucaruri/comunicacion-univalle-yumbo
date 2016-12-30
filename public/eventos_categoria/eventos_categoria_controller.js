(function () {
    'use strict';

    angular
        .module('app')
        .controller('eventos_categoria_controller',Controller);

    function Controller(EventService,UserService,$routeParams){
    	var vm = this;
        vm.categoria = $routeParams.categoria;
        vm.eventos = [];
        vm.usuario = {};
        vm.title = "";
        if(vm.categoria == 1){
            vm.title = "extracurriculares";
        }else if(vm.categoria == 2){
            vm.title = "académicos";
        }else if(vm.categoria == 3){
            vm.title = "deportivos";
        }
        initController();

        function initController(){
            EventService.getCategoryEvents(vm.categoria)
                .then(function(eventos){
                    vm.eventos = eventos;
                })
                .catch(function(err){
                    vm.eventos = [];
                    console.log(err);
                });
            UserService.getCurrentUser()
                .then(function(usuario) {
                    vm.usuario = usuario;
                })
                .catch(function(err) {
                    console.log('No hay usuario conectado');
                })
        }
    }
})();