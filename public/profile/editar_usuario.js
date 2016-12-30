(function () {
    'use strict';

    angular
        .module('app')
        .controller('editar_usuario_controller',Controller);

    function Controller(UserService, $routeParams, $window){
    	var vm = this;

        vm.usuario = {};
        vm.updateUser = updateUser;
    	initController();

		function initController(){
			UserService.getById($routeParams.id)
    			.then(function(usuario){
    				vm.usuario = usuario;
    			})
    			.catch(function(err){
                    console.log(err);
    			})
		}

        function updateUser(){
            UserService.updateUser($routeParams.id,vm.usuario)
                .then(function() {
                    $window.location='app/#/app/gestionar_usuarios';
                })
                .catch(function(err) {
                    console.log(err);
                })
        }
    }
})();