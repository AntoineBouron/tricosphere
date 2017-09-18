angular
    .module('tricosphere')
    .controller('NavbarCtrl', function($timeout, $scope, $state, store, $http, $stateParams, config) {

        $scope.doDeconnect = function() {
            store.remove('auth');
            $state.go('login', {msgOk: 'Vous avez bien été déconnecté'});
        };

        $scope.menuItems =  [
                {
                    text: "Merceries",
                    link: "#!/merceries"
                },
                {
                    text: "Designers",
                    link: "#!/designers"
                },
                {
                    text: "Communauté",
                    link: "#!/community"
                },
                {
                    text: "Réglages",
                    link: "#!/settings"
                },
                {
                    text: "Profil",
                    link: "#!/profil"
                },
                {
                    text: "Admin",
                    link: "#!/admin"
                }
            ];

    });
