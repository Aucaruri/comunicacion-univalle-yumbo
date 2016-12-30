(function () {
	'use strict';

	angular
		.module('app')
		.controller('my_events_controller',Controller);

	function Controller(EventService, UserService, webNotification, ngDialog, $scope){
		var vm = this;
		var socket = io.connect( '/', {
			reconnection: false
		});

		vm.eventos = [];
		vm.evento = {};
		vm.usuario = {};
		vm.deleteEvent = deleteEvent;
		vm.openDialog = openDialog;
		var snackbarContainer = document.querySelector('#snackbar-container');
		var showSnackbarReq = document.querySelector('#req-flash');

		initController();

		function initController(){
			EventService.getByCreator()
				.then(function(eventos){
					vm.eventos = eventos;
				})
				.catch(function(err){
					console.log(err);
					vm.eventos = [];
				});
			//Ya que esta es la pantalla que aparecerá cuando un usuario inicie sesión podemos mandar
			//su info por aqui para que se guarde en los sockets
			UserService.getCurrentUser()
				.then(function(usuario) {
					vm.usuario = usuario;
					socket.emit("new user",vm.usuario);
				})
				.catch(function(err) {
					console.log(err);
				});
		}

		function deleteEvent(){
			EventService.deleteEvent(vm.evento.evento_id,vm.evento)
				.then(function(){
					initController();
					showSnackbar();
				})
				.catch(function(err){
					console.log(err);
				});
		}

		socket.on('new message', function(mensaje){
			webNotification.showNotification('Nuevo mensaje de '+mensaje.nombres, {
				body: mensaje.mensaje,
				icon: '/public/icons/chat.png',
				autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
			}, function onShow(error, hide) {
				if (error) {
					window.alert('Unable to show notification: ' + error.message);
				} else {
					console.log('Notification Shown.');
				}
			});
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

		function showSnackbar(){
			showSnackbarReq.innerText='Se ha eliminado un evento';
			if(showSnackbarReq.innerText !== '') {
				'use strict';
				//El mensajes del snackbar va a ser lo que esta dentro del div donde se recibe el req.flash
				var data = {message: showSnackbarReq.innerText, timeout: 3000};
				snackbarContainer.MaterialSnackbar.showSnackbar(data);
			}
		}

		function openDialog(evento){
			vm.evento=evento;
			ngDialog.open({ template: 'deleteDialog', className: 'ngdialog-theme-default' , scope: $scope});
		}
	}
})();