angular
.module('tricosphere')
.controller('ResetPasswordCtrl', function($scope, $http, $state) {

	$scope.doResetPassword = function() {
		// TODO : reset Password via http POST
		$state.go('login');
	};
});