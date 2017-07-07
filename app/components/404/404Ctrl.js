angular
    .module('tricosphere')
    .controller('404Ctrl', function($scope, $state, $rootScope, auth) {
    	
    	auth.init();

    	$scope.redirectLink = function(previousState) {
    		$state.go($rootScope.prevState);
    	};

    });
