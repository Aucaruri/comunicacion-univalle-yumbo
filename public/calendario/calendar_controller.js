(function () {
	'use strict';

	angular
		.module('app')
		.controller('calendar_controller',Controller);

	function Controller($scope,$window,EventService,uiCalendarConfig,webNotification){

		$scope.SelectedEvent = null;
		var isFirstTime = true;

		$scope.eventos = [];

		$scope.eventSources = [$scope.eventos];

		EventService.getAllEvents()
			.then(function(eventos){
				console.log(eventos[0]);
				$scope.eventos.slice(0, $scope.eventos.length);
				angular.forEach(eventos ,function(value){
					$scope.eventos.push({
						id: value.evento_id,
						title: value.titulo,
						description: value.descripcion,
						start: new Date(parseInt(value.fecha_inicio.substr(0,4)), parseInt(value.fecha_inicio.substr(5,2))-1, parseInt(value.fecha_inicio.substr(8,2)),parseInt(value.fecha_inicio.substr(11,2)),parseInt(value.fecha_inicio.substr(14,2))),
						fecha_inicio: value.fecha_inicio,
						end: new Date(parseInt(value.fecha_final.substr(0,4)), parseInt(value.fecha_final.substr(5,2))-1, parseInt(value.fecha_final.substr(8,2)),parseInt(value.fecha_final.substr(11,2)),parseInt(value.fecha_final.substr(14,2))),
						fecha_final: value.fecha_final,
						allDay: value.todoElDia,
						stick: true,
						place: value.lugar,
						image: value.imagen,
						categoria: value.nombre_categoria
					});
				});
			})
			.catch(function(err){
					$scope.eventos = [];
			});
		$scope.uiConfig = {
			calendar: {
				height: 450,
				editable: false,
				displayEventTime: false,
				allDayText: "Todo el día",
				dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
				dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
				monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
				monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
				header: {
					left: 'month agendaWeek agendaDay',
					center: 'title',
					right: 'prev,today,next'
				},
				buttonText: {
					prev: "<",
					next: ">",
					prevYear: "prev year",
					nextYear: "next year",
					year: 'Año', // TODO: locale files need to specify this
					today: 'Hoy',
					month: 'Mes',
					week: 'Semana',
					day: 'Día'
				},
				eventClick: function(event) {
					$scope.SelectedEvent = event;
				},
				eventAfterAllRender: function() {
					if($scope.eventos.length > 0 && isFirstTime) {
						//Señalar el primer evento
						uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.eventos[0].start);
						isFirstTime = false;
					}
				}
			}
		};
	}
})();