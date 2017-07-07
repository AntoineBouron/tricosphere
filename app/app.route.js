app.config(function($stateProvider, $locationProvider, $urlRouterProvider) {

/*    $urlRouterProvider.otherwise( function($injector, $location) {
        var $state = $injector.get('$state');
        $state.go('login');
    });*/

    // ROUTES PROTEGEES par un ngInit dans les controllers
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'app/components/home/home.html',
        controller: 'HomeCtrl',
        params: {
            msg: null
        }
        // on peut faire des appels à des fonctions avant que le controller n'entre en action
        // on y accede dans le controller en injectant (ici isAuth ou simpleObj)
/*        resolve: {
            isAuth: function(auth) {
                return auth.init();
            },
            simpleObj:  function(){
                return {value: 'simple!'};
             }
        }   */
    });   

    $stateProvider
        .state('merceries', {
            url: '/merceries',
            templateUrl: 'app/components/merceries/merceries.html',
            controller: 'MerceriesCtrl'
        })
        .state('merceries.details', {
            url: '/details/:id',
            templateUrl: 'app/components/merceries/merceries.details.html'
        })
        .state('merceries.recherche', {
            url: '/recherche',
            templateUrl: 'app/components/merceries/merceries.recherche.html'
        });

    $stateProvider.state('settings', {
        url: '/settings',
        templateUrl: 'app/components/settings/settings.html',
        controller: 'SettingsCtrl'
    });

    // ROUTES NON PROTEGEES
    $stateProvider.state('loginRoot', {
        url: '',
        templateUrl: 'app/components/login/login.html',
        controller: 'LoginCtrl'
    });

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'app/components/login/login.html',
        controller: 'LoginCtrl',
        params : {
            msgErr : null,
            msgOk : null,
            userEmail: null,
            userPwd: null
        }
    });

    $stateProvider.state('resetPassword', {
        url: '/resetPassword',
        templateUrl: 'app/components/resetPassword/resetPassword.html',
        controller: 'ResetPasswordCtrl'
    });

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'app/components/signup/signup.html',
        controller: 'SignupCtrl'
    });

    $stateProvider.state('404', {
        url: '/404',
        templateUrl: 'app/components/404/404.html',
        controller: '404Ctrl'
    });

    $urlRouterProvider.otherwise('/404');

    //$locationProvider.html5Mode(true).hashPrefix('!');
    //$locationProvider.hashPrefix('');
});
