(function() {
	'use strict';
	var socket = io.connect( '/', {
		reconnection: false
	});

	var mensaje = function(){
		var checkAndShowSnackBar = function(){
			var snackbarContainer = document.querySelector('#snackbar-container');
			var showSnackbarReq = document.querySelector('#req-flash');
			var evento = document.querySelector('#evento');
			if(showSnackbarReq.innerText !== '') {
				'use strict';
				//El mensajes del snackbar va a ser lo que esta dentro del div donde se recibe el req.flash
				var data = {message: showSnackbarReq.innerText, timeout: 5000};
				snackbarContainer.MaterialSnackbar.showSnackbar(data);
			}
			if(showSnackbarReq.innerText === '¡Evento creado!') {
				var titulo = evento.innerText.split('/')[0];
				var categoria = evento.innerText.split('/')[1];
				console.log()
				var notificacion = {
					titulo: titulo,
					categoria: categoria
				}
				socket.emit("new event", notificacion);
			}
		};
		var timeout = function(fn, timeout){
			setTimeout(fn, timeout);
		};
		return{
			init: function(){
				//se usa para esperar que las variables de MDL carguen y no haya errores
				timeout(checkAndShowSnackBar, 800);
			}
		}
	}();
	mensaje.init();
}());