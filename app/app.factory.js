
/** INTERCEPTOR POUR LA GESTION DU TOKEN **/
// A chaque requete, on envoit le token  auth dans le header s'il existe et s'il est valide
// Sinon, on redirige vers la page /login
angular
.module('tricosphere')
.factory('authInterceptor', function($rootScope, $q, store, $state, jwtHelper) {
    return {
            // Add authorization jwt to headers
            request: function(config) {
                config.headers = config.headers || {};
                if (store.get('auth')) {
                    config.headers.Authorization = 'Bearer ' + store.get('auth');
                    //config.headers.Authorization = 'Content-Type : application/json';
                }
                return config;
            },
            // Intercept 401s and redirect you to login
            responseError: function(response) {
                if (response.status === 401) {
                    $state.go('login');
                    if (!store.get('auth') || jwtHelper.isTokenExpired(store.get('auth'))) {
                        store.remove('auth');
                    }
                    return $q.reject(response);
                } else if (response.status === 404) {
                    $state.go('404');
                } else {
                    return $q.reject(response);
                }
            }
        };
    });

/**
factory pour savoir si l'utilisateur est bien authentifié ou non
**/
angular
.module('tricosphere')
.factory('auth', function(store, jwtHelper, $state, $http, $q) {
    return {
        init: function(response) {
            var authJWT = store.get('auth') || null;
            if(null !== authJWT && !jwtHelper.isTokenExpired(authJWT)) {
                $http({
                    method: 'GET',
                    url: 'http://localhost/tricosphere/api/index.php' + '/isValidToken'
                }).then(function successCallback(response) {
                }, function errorCallback(response) {
                    $state.go('login', {msg: 'Merci de vous athentifier.'});
                });
            } else {
                $state.go('login', {msg: 'Merci de vous athentifier.'});
            }
        },
        isAdmin: function() {
            var authJWT = store.get('auth');
            var token = jwtHelper.decodeToken(authJWT) || null;
            if(null !== token && token.role != 5 && !jwtHelper.isTokenExpired(authJWT)) {
                $http({
                    method: 'GET',
                    url: 'http://localhost/tricosphere/api/index.php' + '/isValidToken'
                }).then(function successCallback(response) {
                }, function errorCallback(response) {
                    $state.go('login', {msg: 'Merci de vous athentifier.'});
                });
            } else {
                $state.go('login', {msg: 'Vous devez être utilisateur pour accéder à cette page'});
            }  
        },
            // sur la page de login, s'il existe un token valide, alors on est redirigé vers la page home
            redirectOnLoginState: function() {
                var authJWT = store.get('auth') || null;
                if(null !== authJWT && !jwtHelper.isTokenExpired(authJWT)) {
                    $http({
                        method: 'GET',
                        url: 'http://localhost/tricosphere/api/index.php' + '/isValidToken'
                    }).then(function successCallback(response) {
                        $state.go('home', {msg: 'Welcome back!'});
                    }, function errorCallback(response) { });
                }
            },
            // exemple d'utilisation des promise
            linkOnUrlNotFound: function(response) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: 'http://localhost/tricosphere/api/index.php' + '/isValidToken'
                }).then(
                function successCallback(response) { deferred.resolve(true); }, 
                function errorCallback(response) { deferred.resolve(false); }
                );
                return deferred.promise;
            }
        };
    });
