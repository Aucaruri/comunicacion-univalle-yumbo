(function () {
	'use strict';

	angular
		.module('app')
		.factory('ChatService', Service);

	function Service($http, $q) {
		var service = {};

		service.getAllConversations = getAllConversations; 
		service.getAllMessages = getAllMessages;
		service.addMessage = addMessage;
		service.readMessages = readMessages;

		return service;

		//Obtiene las conversaciones por el ID del usuario loggeado
		function getAllConversations() {
			return $http.get('/api/messages').then(handleSuccess, handleError);
		}

		//Busca los mensajes por el ID de la conversación
		function getAllMessages(id) {
			return $http.get('/api/messages/'+id).then(handleSuccess, handleError);
		}

		//Añade un mensaje a la conversación por su ID
		function addMessage(id,mensaje) {
			return $http.post('/api/messages/'+id, mensaje).then(handleSuccess, handleError);
		}

		//Lee los mensajes por el ID de la conversación
		function readMessages(id,remitente) {
			return $http.put('/api/messages/'+id,remitente).then(handleSuccess, handleError);
		}

		//Funciones privadas
		function handleSuccess(res) {
			return res.data;
		}

		function handleError(res) {
			return $q.reject(res.data);
		}
	}

})();