angular
    .module('tricosphere')
    .controller('SettingsCtrl', function($scope, auth) {

        auth.init();
        
    });
