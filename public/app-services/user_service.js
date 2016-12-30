(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.getAllUsers = getAllUsers;
        service.getById = getById;
        service.getCurrentUser = getCurrentUser;
        service.addUser = addUser;
        service.updateUser = updateUser;
        service.deleteUser = deleteUser;

        return service;

        function getAllUsers() {
            return $http.get('/api/users').then(handleSuccess, handleError);
        }

        function getById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError);
        }

        function getCurrentUser() {
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function addUser(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        function updateUser(id,user) {
            return $http.put('/api/users/' + id, user).then(handleSuccess, handleError);
        }

        function deleteUser(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();