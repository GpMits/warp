angular.module('LoginCtrl', []).controller('LoginController', function ($rootScope, $location, $scope, UserService) {
    if ($rootScope.showUserCreated == true) {
        $scope.showUserCreated = true;
        $rootScope.showUserCreated = false;
    } else {
        $scope.showUserCreated = false;
    }

    $scope.login = function () {
        user = {
            "username": $scope.vm.username,
            "password": $scope.vm.password
        }

        UserService.authenticate(user).then(
            function (restObject) {
                console.log("User authenticated!");
                $rootScope.user = user.username;
                $location.path('/map').replace();
            },
            function (errResponse) {
                $scope.loginError = true;
                console.error('User authentication error', errResponse);
            }
        )
    }

    $scope.register = function () {
        user = {
            "username": $scope.vm.username,
            "password": $scope.vm.password
        }

        UserService.createUser(user).then(
            function (restObject) {
                console.log("User created!")
                $rootScope.showUserCreated = true;
                $location.path('/').replace();
            },
            function (errResponse) {
                console.error('Error while creating User');
            }
        )
    }
});