angular.module('UserService', []).factory('UserService', ['$http', '$q', function ($http, $q) {

    var REST_SERVICE_URI = 'http://localhost:8080/api/user/';

    var factory = {
        getUser: getUser,
        createUser: createUser,
        authenticate: authenticate,
        getUserById: getUserById
    };

    return factory;

    function getUser(username) {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + username)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function getUserById(user_id) {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + 'id/' + user_id)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function createUser(user) {
        var deferred = $q.defer();
        $http.post(REST_SERVICE_URI, user)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function authenticate(user) {
        var deferred = $q.defer();
        $http.post(REST_SERVICE_URI + 'authenticate', user)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }
}]);