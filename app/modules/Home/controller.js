(function() {
  "use strict";

  angular
    .module('segue.admin.home', [
      'segue.admin.authenticate.service',
      'segue.admin.home.controller'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('home', {
          url: '^/',
          views: {
            header: {                               templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'HomeController', templateUrl: 'modules/Home/home.html' }
          }
        });
    });

  angular
    .module('segue.admin.home.controller', [])
    .controller('HomeController', function($rootScope, $scope, Auth) {
      $scope.enforceAuth();
      $scope.credentials = Auth.glue($scope, 'credentials');
    });
})();
