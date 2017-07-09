angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/login.html',
			controller: 'LoginController'
		})

		.when('/register', {
			templateUrl: 'views/register.html',
			controller: 'LoginController'
		})

		.when('/map', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})
		
	$locationProvider.html5Mode(true);

}]);