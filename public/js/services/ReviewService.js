angular.module('ReviewService', []).factory('ReviewService', ['$http', '$q', function ($http, $q) {

    var REST_SERVICE_URI = 'http://localhost:8080/api/review/';

    var factory = {
        getReview: getReview,
        createReview: createReview,
    };

    return factory;

    function getReview(restName) {
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

    function createReview(review) {
        var deferred = $q.defer();
        $http.post(REST_SERVICE_URI, review)
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