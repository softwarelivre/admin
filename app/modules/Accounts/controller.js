(function() {
  "use string";

  angular
    .module("segue.admin.accounts",[
      "segue.admin",
      "segue.admin.libs",
      "segue.admin.errors",
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
            query:   { controller: 'AccountController',     templateUrl: 'modules/common/back.html' },
            content: { controller: 'AccountShowController', templateUrl: 'modules/Accounts/accounts.detail.html' }
          },
          resolve: {
            account: function(Accounts, $stateParams) { return Accounts.get($stateParams.id); },
            purchases: function(account) { return account.follow('purchases'); },
            proposals: function(account) { return account.follow('proposals'); }
          }
        })
        .state('accounts.create', {
          url: '/create/:id',
          views: {
            query:   { controller: 'AccountController',       templateUrl: 'modules/common/back.html' },
            content: { controller: 'AccountCreateController', templateUrl: 'modules/Accounts/accounts.create.html' }
          },
          resolve: { }
        });
    });

  angular
    .module("segue.admin.accounts.controller", [
      'segue.admin.accounts.service'
    ])
    .controller("AccountController", function($scope, $state, Accounts, focusOn) {
      $scope.enforceAuth();

      $scope.accounts = [];
      $scope.query = { needle: '' };
      $scope.doSearch = function() {
        Accounts.lookup($scope.query).then(function(data) {
          $scope.accounts = data;
        });
      };
    })
    .controller("AccountListController", function($scope, $state, Accounts, focusOn) {
      focusOn('query.needle');
    })
    .controller("AccountShowController", function($scope, $state, account, purchases, proposals, focusOn) {
      $scope.account = account;
      $scope.purchases = purchases;
      $scope.proposals = proposals;

      $scope.paymentsOf = {};

      $scope.showPaymentsOf = function(purchase) {
        purchase.follow("payments").then(function(payments) {
          $scope.paymentsOf[purchase.id] = payments;
        });
      };

      $scope.hidePaymentsOf = function(purchaseId) {
        delete $scope.paymentsOf[purchaseId];
      };
    })
    .controller("AccountCreateController", function($scope, $state, Validator, FormErrors, Accounts, focusOn) {
      $scope.account = {};
      focusOn("account.name", 200);

      $scope.submit = function() {
        Validator.validate($scope.account, "accounts/admin_create")
                 .then(Accounts.createOne)
                 .then(moveToNextState)
                 .catch(FormErrors.set);
      };
      function moveToNextState(account) {
        if ($scope.closeThisDialog) {
          $scope.closeThisDialog(account);
        } else {
          $state.go('accounts.detail', { id: account.id });
        }
      }
    });
})();
