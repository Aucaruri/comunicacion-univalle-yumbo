(function () {
	'use strict';

	angular
		.module('app')
		.controller('users_controller',Controller);

	function Controller(UserService,ngDialog,$scope){
		var vm = this;

		vm.usuarios = [];
		vm.usuario = {};
		vm.updateUser = updateUser;
		vm.openDialog = openDialog;
		var snackbarContainer = document.querySelector('#snackbar-container');
		var showSnackbarReq = document.querySelector('#req-flash');
		initController();

		function initController(){
			UserService.getAllUsers()
				.then(function(usuarios){
					vm.usuarios = usuarios;
				})
				.catch(function(err){
					console.log(err);
					vm.usuarios = [];
				});
		}

		function updateUser(){
			if(vm.usuario.estado === 0){
				vm.usuario.estado=1;
			}else{
				vm.usuario.estado=0;
			}
			UserService.updateUser(vm.usuario.user_id,vm.usuario)
				.then(function() {
					initController();
					showSnackbar(vm.usuario.estado);
				})
				.catch(function(err) {
					console.log(err);
				});
		}

		function showSnackbar(estado){
			console.log(showSnackbarReq);
			showSnackbarReq.innerText='';
			if(estado === 0){
				showSnackbarReq.innerText='Se ha bloqueado un usuario';
			}else{
				showSnackbarReq.innerText='Se ha desbloqueado un usuario';
			}
			console.log(showSnackbarReq);
			if(showSnackbarReq.innerText !== '') {
				'use strict';
				//El mensajes del snackbar va a ser lo que esta dentro del div donde se recibe el req.flash
				var data = {message: showSnackbarReq.innerText, timeout: 3000};
				snackbarContainer.MaterialSnackbar.showSnackbar(data);
			}
		}

		function openDialog(usuario){
			vm.usuario=usuario;
			if(vm.usuario.estado === 0){
				ngDialog.open({ template: 'desbloquearDialog', className: 'ngdialog-theme-default' , scope: $scope});
			}else{
				ngDialog.open({ template: 'bloquearDialog', className: 'ngdialog-theme-default' , scope: $scope});
			}
		}
	}
})();