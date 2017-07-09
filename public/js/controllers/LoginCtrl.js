angular.module('LoginCtrl', []).controller('LoginController', function($rootScope,$location,$scope, UserService) {
    $scope.login = function(){
        user = {
            "username" : $scope.vm.username,
            "password" : $scope.vm.password
        }

        UserService.authenticate(user).then(
            function(restObject){
                console.log("User authenticated!");
                $rootScope.user = user.username;
                $location.path('/map').replace();
            },
            function(errResponse){
                console.error('User authentication error', errResponse);
            }
        )
    }

    $scope.register = function(){
        user = {
            "name" : $scope.vm.username,
            "password" : $scope.vm.password
        }

        UserService.createUser(user).then(
            function(restObject){
                console.log("User created!")
            },
            function(errResponse){
                console.error('Error while creating User');
            }
        )
    }
});