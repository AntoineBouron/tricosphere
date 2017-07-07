angular
    .module('tricosphere')
    .controller('NavbarCtrl', function($timeout, $scope, $state, store, $http, $stateParams, config) {

        $scope.doDeconnect = function() {
            store.remove('auth');
            $state.go('login', {msgOk: 'Vous avez bien été déconnecté'});
        };

        $scope.menuItems = {
            data: [
                {
                    text: "Merceries",
                    link: "#!/merceries",
                    icon: "shopping-basket"
                },
                {
                    text: "Designers",
                    link: "#!/designers",
                    icon: "pencil"
                },
                {
                    text: "Communauté",
                    link: "#!/community",
                    icon: "users"
                },
                {
                    text: "Réglages",
                    link: "#!/settings",
                    icon: "cogs"
                },
                {
                    text: "Admin",
                    link: "#!/admin",
                    icon: "lock"
                }
            ]
        };

    });
