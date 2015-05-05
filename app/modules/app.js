(function() {
  'use strict';

  angular
    .module('templates', []);

  angular
    .module('segue.admin',[
      'templates',
      'ui.gravatar',
      'ui.router',
      'ui.router.compat',
      'ui.keypress',
      'ngToast',
      'restangular',
      'angular-loading-bar',

      'segue.admin.directives',
      'segue.admin.locale',
      'segue.admin.home',
      'segue.admin.authenticate',
      'segue.admin.accounts',
    ])
    .controller('AdminController', function($scope, $state, Auth) {
      $scope.$on('$stateChangeSuccess', function(event, newState) {
        $scope.topState = newState.name.split('.')[0];
        $scope.state    = newState;
      });
      $scope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        console.log('error moving from', fromState, 'to', toState);
        console.log('toParams:', toParams);
        console.log('fromParams:', fromParams);
        console.log(error);
      });

      $scope.home = function() {
        $scope.enforceAuth();
        $state.go('home');
      };
      $scope.enforceAuth = function() {
        if (!Auth.credentials()) { $state.go('authenticate'); }
      };
      $scope.$on('auth:changed', $scope.enforceAuth);

    })
    .config(function(RestangularProvider, Config) {
      RestangularProvider.setBaseUrl(Config.API_HOST + Config.API_PATH);
      RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        if (operation == "getList") { return data.items; }
        if (data.resource) { return data.resource; }
        return data;
      });
    })
    .config(function($urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    });

})();
