angular.module('RestaurantService', []).factory('RestaurantService', ['$http', '$q', function ($http, $q) {

    var REST_SERVICE_URI = 'http://localhost:8080/api/restaurant/';

    var factory = {
        getRestaurant: getRestaurant,
        createRestaurant: createRestaurant,
        updateRestaurant: updateRestaurant
    };

    return factory;

    function getRestaurant(restName) {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + restName)
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

    function createRestaurant(restaurant) {
        var deferred = $q.defer();
        $http.post(REST_SERVICE_URI, restaurant)
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

    function updateRestaurant(restaurant) {
        var deferred = $q.defer();
        $http.put(REST_SERVICE_URI + restaurant.name, restaurant)
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