angular
    .module('tricosphere')
    .controller('MerceriesCtrl', function($rootScope, $scope, $http, store, $state, auth) {

        auth.init(); // page protégée

    // Recherche de merceries
        // par defaut, c'est la recherche par nom qui est selectionnée
        $scope.typeRechercheMercerie = "nom";



        $scope.merceries = [
            {
                id: 1,
                description: "Description de la mercerie n° 1",
                name: "azert",
                ville: "la rochelle"
            }, {
                id: 2,
                description: "Description de la mercerie n° 2",
                name: "qsdf",
                ville: "nantes"
            }, {
                id: 3,
                description: "Description de la mercerie n° 3",
                name: "wxcv",
                ville: "Lyon"
            }, {
                id: 4,
                description: "Description de la mercerie n° 4",
                name: "poiu",
                ville: "Strasbourg"
            }
        ];

        $scope.doRechercheMerceries = function() {

        };

});
