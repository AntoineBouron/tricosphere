angular
    .module('tricosphere')
    .controller('SignupCtrl', function($scope, $http, $state, config, store, $stateParams) {


    	$scope.msg = null;

        $scope.doSignUp = function() {
        	console.log( $scope.formSignup.data);
            if ($scope.formSignup.pwd1 === $scope.formSignup.pwd2) {
                $http({
                    method: 'POST',
                    url: config.api + '/signup',
                    data: $scope.formSignup.data
                }).then(function successCallback(response) {
                    store.set('auth', response.data);
                    $state.go('login', {msgOk: response.data.msg, userEmail: $scope.formSignup.data.email, userPwd: $scope.formSignup.data.pwd1});
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
            } else {
                $scope.msg = "Les deux mots de passe doivent être identiques";
            }
        };

        
    });
