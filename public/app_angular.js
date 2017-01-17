(function () {
	'use strict';

	angular
		.module('app', ['ngRoute','moment-picker','ui.calendar','angular-web-notification','ngAnimate','ngDialog'])
		.config(config)
		.config(['momentPickerProvider', function (momentPickerProvider) {
			momentPickerProvider.options({
				/* Picker properties */
				locale:        'en',
				format:        'YYYY/MM/DD HH:mm',
				minView:       'month',
				maxView:       'minute',
				startView:     'month',
				autoclose:     true,
				today:         true,
				keyboard:      true,
				
				/* Extra: Views properties */
				leftArrow:     '&larr;',
				rightArrow:    '&rarr;',
				yearsFormat:   'YYYY',
				monthsFormat:  'MMM',
				daysFormat:    'D',
				hoursFormat:   'HH:[00]',
				minutesFormat: moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
				secondsFormat: 'ss',
				minutesStep:   5,
				secondsStep:   1
			});
		}])
		.run(run);

	function config($routeProvider) {
		$routeProvider.otherwise('/');

		$routeProvider
			.when('/', {
				templateUrl: '/public/home/index.html',
				controller: 'home_controller',
				controllerAs: 'vm'
			})
			.when('/home', {
				templateUrl: '/public/home/index.html',
				controller: 'home_controller',
				controllerAs: 'vm'
			})
			.when('/calendario', {
				templateUrl: '/public/calendario/calendario.html',
				controller: 'calendar_controller'
			})
			.when('/eventos/categoria/:categoria', {
				templateUrl: '/public/eventos_categoria/eventos_categoria.html',
				controller: 'eventos_categoria_controller',
				controllerAs: 'vm'
			})
			.when('/evento/:id', {
				templateUrl: '/public/home/ver_evento.html',
				controller: 'ver_evento_controller',
				controllerAs: 'vm'
			})
			.when('/login', {
				templateUrl: '/public/home/login.html'
			})
			.when('/forgot', {
				templateUrl: '/public/home/forgot.html'
			})
			.when('/app', {
				templateUrl: '/public/my-app/home.html',
				controller: 'my_events_controller',
				controllerAs: 'vm'
			})
			.when('/app/crear_evento/:categoria', {
				templateUrl: '/public/my-app/crear_evento.html',
				controller: 'crear_evento_controller',
				controllerAs: 'vm'
			})
			.when('/app/modificar_evento/:id', {
				templateUrl: '/public/my-app/modificar_evento.html',
				controller: 'modificar_evento_controller',
				controllerAs: 'vm'
			})
			.when('/app/chat', {
				templateUrl: '/public/chat/chat.html',
				controller: 'chat_controller',
				controllerAs: 'vm'
			})
			.when('/app/registrar_usuario', {
				templateUrl: '/public/profile/registrar_correo.html'
			})
			.when('/app/perfil', {
				templateUrl: '/public/profile/perfil.html',
				controller: 'profile_controller',
				controllerAs: 'vm'
			})
			.when('/app/modificar_perfil', {
				templateUrl: '/public/profile/modificar_perfil.html',
				controller: 'profile_controller',
				controllerAs: 'vm'
			})
			.when('/app/gestionar_usuarios', {
				templateUrl: '/public/profile/gestionar_usuarios.html',
				controller: 'users_controller',
				controllerAs: 'vm'
			})
			.when('/app/editar_usuario/:id', {
				templateUrl: '/public/profile/editar_usuario.html',
				controller: 'editar_usuario_controller',
				controllerAs: 'vm'
			})
			.when('/about', {
				templateUrl: '/public/about/about.html'
			});
	}

	function run($http,$rootScope,$window,$timeout) {
			// add JWT token as default auth header
			//$http.defaults.headers.common.Authorization = 'Bearer ' + $window.jwtToken;
			
			$rootScope.$on('$viewContentLoaded', ()=> {
				$timeout(() => {
					componentHandler.upgradeAllRegistered();
				})
			});
	}

	/*$(function () {
		// get JWT token from server
		$.get('/protected/token', function (token) {
			window.jwtToken = token;
			angular.bootstrap(document, ['app']);
		});
	});*/
})();