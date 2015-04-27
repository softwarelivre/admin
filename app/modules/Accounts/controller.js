(function() {
  "use string";

  angular
    .module("segue.admin.accounts",[
      "segue.admin",
      "segue.admin.accounts.controller",
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('accounts', {
          url: '^/accounts',
          views: {
            "header": {                                    templateUrl: 'modules/common/nav.html' },
            "main":   { controller: 'AccountsController',  templateUrl: 'modules/Accounts/accounts.html' },
          },
        });
    });

  angular
    .module("segue.admin.accounts.controller", [
      'segue.admin.accounts.service'
    ])
    .controller("AccountsController", function($scope, $state, Accounts, focusOn) {
      $scope.enforceAuth();
      $scope.query = { needle: 'Felipe' };
      $scope.accounts = [];
      focusOn('query.needle');

      $scope.doSearch = function() {
        Accounts.lookup($scope.query).then(function(data) {
          $scope.accounts = data;
        });
      };
    });
})();
