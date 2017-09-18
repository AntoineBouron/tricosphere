angular
    .module('tricosphere')
    .controller('AdminCtrl', function($rootScope, $scope, $http, store, $state, auth) {
    	auth.isAdmin();
    });
