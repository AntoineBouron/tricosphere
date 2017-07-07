var app = angular.module("tricosphere", [
    'ui.router',
    'angular-jwt',
    'ui.bootstrap',
    'angular-storage',
    'ui.router.state.events',
    'ngMessages'
]);



app.run(function($rootScope, $state) {
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        $rootScope.prevPageLink = from.url;
    });
});

/** TOKEN DANS LE HEADER **/
app.config(function Config($httpProvider, jwtInterceptorProvider, jwtOptionsProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});

app.constant("config", {
    "url": "http://localhost/tricosphere",
    "api": "http://localhost/tricosphere/api/index.php"
});

/*app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
});
*/
