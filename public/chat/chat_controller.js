(function () {
	'use strict';

	angular
		.module('app')
		.controller('chat_controller',Controller);

	function Controller(UserService,ChatService,$scope,$http,webNotification){
		var vm = this;
		var socket = io.connect( '/', {
			reconnection: false
		});
		socket.on("connect", function() {
			console.log('connected to server');
		});
		socket.on("disconnect", function() {
			console.log('disconnected to server');
		});

		vm.usuarios = [];
		vm.usuario = {};
		vm.mensajes = undefined;
		vm.mensaje = undefined;
		vm.conversacion_id = undefined;
		vm.getAllMessages = getAllMessages;
		vm.addMessage = addMessage;
		vm.readMessages = readMessages;
		vm.scrollDown = scrollDown;
		vm.receptor = undefined;
		vm.badgeValue= 0;

		initController();

		function initController(){
			getCurrentUser();
			getAllConversations();
		}

		function getCurrentUser() {
			UserService.getCurrentUser()
				.then(function(usuario) {
					vm.usuario = usuario;
					socket.emit("new user",vm.usuario);
				})
				.catch(function(err) {
					vm.usuario = {};
					console.log(err);
				});
		}

		function getAllConversations() {
			ChatService.getAllConversations()
				.then(function(usuarios) {
					vm.usuarios = usuarios;
				})
				.catch(function(err) {
					vm.usuarios = [];
					console.log(err);
				});
		}

		function getAllMessages(id,usuario){
			vm.conversacion_id=id;
			vm.conversacion_nombre = usuario.nombres; //Para mostrar el nombre de la persona
			vm.receptor=usuario;	//Usuario en la lista
			ChatService.getAllMessages(id)
				.then(function(mensajes){
					vm.mensajes = mensajes;
					vm.scrollDown();
				})
				.catch(function(err){
					vm.mensajes = [];
					console.log(err);
				});
			vm.readMessages(id,usuario);
		}

		//El mensaje es para la BD, el message es para mostrarlo parcial en la vista
		function addMessage(){
			var mensaje = {
				remitente:vm.usuario.user_id,
				mensaje:vm.mensaje,
				creacion: new Date()
			};
			var message = {
				remitente:vm.usuario.user_id,
				mensaje:vm.mensaje,
				nombres:vm.usuario.nombres,
				apellidos:vm.usuario.apellidos,
				foto_perfil:vm.usuario.foto_perfil,
				receptor:vm.receptor.user_id,
				creacion: new Date()
			};
			ChatService.addMessage(vm.conversacion_id,mensaje)
				.then(function(){
					socket.emit("send message", message);
					vm.mensajes.push(message);
					vm.scrollDown();
					vm.mensaje = '';
				})
				.catch(function(err){
					console.log(err);
				});
		}

		//Aqui se recibe el mensaje y se muestra en pantalla
		socket.on('new message', function(mensaje){
			if(vm.receptor){
				if(mensaje.remitente === vm.receptor.user_id){
					$scope.$apply(function(){
						vm.mensajes.push(mensaje);
						vm.readMessages(vm.conversacion_id,vm.receptor);
						vm.scrollDown();
					});
				}
			}else{
				webNotification.showNotification('Nuevo mensaje de: '+mensaje.nombres, {
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
				$scope.$apply(function(){
					getAllConversations();
				});
			}
		});

		function scrollDown() {
			var pidScroll;
			pidScroll = window.setInterval(function() {
				$('.chatBox').scrollTop(window.Number.MAX_SAFE_INTEGER * 0.001);
				window.clearInterval(pidScroll);
			}, 200);
		}

		function readMessages(conversacion_id,receptor){
			ChatService.readMessages(conversacion_id,receptor)
				.then(function() {
					getAllConversations();
				})
				.catch(function(err) {
					console.log(err);
				});
		}
	}
})();