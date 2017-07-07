angular
    .module('tricosphere')
    .controller('HomeCtrl', function($rootScope, $scope, $http, store, $state, auth) {

        auth.init();

        $scope.getAllAcounts = function() {
            $http({
                method: 'GET',
                url: 'http://localhost/tricosphere/api/index.php' + '/toto'
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(response) {
                console.log(response);
            });
        };

        $scope.removeAuth = function() {
            console.log('suppression du jwt \'auth\'');
            store.remove('auth');
        };

    });
