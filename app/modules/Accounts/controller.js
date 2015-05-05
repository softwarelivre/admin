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
          abstract: true,
          url: '^/accounts',
          views: {
            header: {                                  templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'AccountController', templateUrl: 'modules/Accounts/accounts.html' }
          }
        })
        .state('accounts.list', {
          url: '/list',
          views: {
            query:   { controller: 'AccountListController', templateUrl: 'modules/Accounts/accounts.query.html' },
            content: { controller: 'AccountListController', templateUrl: 'modules/Accounts/accounts.list.html' }
          }
        })
        .state('accounts.detail', {
          url: '/detail/:id',
          views: {
            query:   { controller: 'AccountController',     templateUrl: 'modules/Accounts/accounts.back.html' },
            content: { controller: 'AccountShowController', templateUrl: 'modules/Accounts/accounts.detail.html' }
          },
          resolve: {
            account: function(Accounts, $stateParams) { return Accounts.get($stateParams.id); },
            purchases: function(account) { return account.follow('purchases'); }
          }
        });
    });

  angular
    .module("segue.admin.accounts.controller", [
      'segue.admin.accounts.service'
    ])
    .controller("AccountController", function($scope, $state, Accounts, focusOn) {
      $scope.enforceAuth();

      $scope.accounts = [];
      $scope.query = { needle: 'Felipe' };
      $scope.doSearch = function() {
        Accounts.lookup($scope.query).then(function(data) {
          $scope.accounts = data;
        });
      };
    })
    .controller("AccountListController", function($scope, $state, Accounts, focusOn) {
      focusOn('query.needle');
    })
    .controller("AccountShowController", function($scope, $state, account, purchases, focusOn) {
      $scope.account = account;
      $scope.purchases = purchases;
    });
})();
