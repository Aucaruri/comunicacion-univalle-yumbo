(function () {
    'use strict';

    angular
        .module('app')
        .factory('EventService', Service);

    function Service($http, $q) {
        var service = {};

        service.getAllEvents = getAllEvents;
        service.getHomeEvents = getHomeEvents;
        service.getSliderEvents = getSliderEvents;
        service.getCategoryEvents = getCategoryEvents;
        service.getById = getById;
        service.getByCreator = getByCreator;
        service.addEvent = addEvent;
        service.updateEvent = updateEvent;
        service.deleteEvent = deleteEvent;

        return service;

        function getAllEvents() {
            return $http.get('/api/events').then(handleSuccess, handleError);
        }

        function getHomeEvents() {
            return $http.get('/api/events/home').then(handleSuccess, handleError);
        }

        function getSliderEvents() {
            return $http.get('/api/events/slider').then(handleSuccess, handleError);
        }

        function getCategoryEvents(id) {
            return $http.get('/api/events/category/'+id).then(handleSuccess, handleError);
        }

        function getById(id) {
            return $http.get('/api/events/' + id).then(handleSuccess, handleError);
        }

        function getByCreator() {
            return $http.get('/api/events/user_events').then(handleSuccess, handleError);
        }

        function addEvent(evento) {
            return $http.post('/api/events', evento).then(handleSuccess, handleError);
        }

        function updateEvent(evento) {
            return $http.put('/api/events/' + event.evento_id, evento).then(handleSuccess, handleError);
        }

        function deleteEvent(id,evento) {
            return $http.delete('/api/events/' + id, evento).then(handleSuccess, handleError);
        }

        // Funciones privdas
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
