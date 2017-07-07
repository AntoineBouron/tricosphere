angular
    .module('tricosphere')
    .controller('LoginCtrl', function($timeout, $scope, $state, store, $http, $stateParams, config, auth) {

        auth.redirectOnLoginState();

        // on recupere les data passés avec les state
        $scope.msgOk = $stateParams.msgOk || null;
        $scope.msgErr = $stateParams.msgErr || null;
        // effacement du message d'erreur / succes au bout define 3s
        if($scope.msgOk) { $timeout(function() { $scope.msgOk = null; }, 3000); }
        
        // lorsque qu'on est redirigé depuis la page signin
        //$scope.formLogin.data.email = $scope.userEmail ? $stateParams.userMail : null;
        //$scope.formLogin.data.pwd = $scope.userPwd ? $stateParams.userPwd : null;




        $scope.doLogin = function() {
            $http({
                method: 'POST',
                url: config.api + '/login',
                headers: {'Content-Type': 'application/json'},
                data: $scope.formLogin.data
            }).then(function successCallback(response) {
                store.set('auth', response.data.token);
                $state.go('home');
            }, function errorCallback(response) {
                $scope.msgErr = response.data.msg;
                $timeout(function() { $scope.msgErr = null; }, 3000);
            });
        };
    });
