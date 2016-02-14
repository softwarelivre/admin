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
          url: '/list/:query',
          views: {
            query:   { controller: 'AccountListController', templateUrl: 'modules/Accounts/accounts.query.html' },
            content: { controller: 'AccountListController', templateUrl: 'modules/Accounts/accounts.list.html' }
          },
          resolve: {
            accounts: function(Accounts, $stateParams) { return Accounts.lookup({ needle: $stateParams.query }); },
          }
        })
        .state('accounts.detail', {
          url: '/detail/:id',
          views: {
            query:   {},
            content: { controller: 'AccountShowController', templateUrl: 'modules/Accounts/accounts.detail.html' }
          },
          resolve: {
            account: function(Accounts, $stateParams) { return Accounts.get($stateParams.id); },
            purchases: function(account) { return account.follow('purchases'); },
            proposals: function(account) { return account.follow('proposals'); }
          }
        })
        .state('accounts.by_purchase', {
          url: '/by-purchase/:id',
          views: {
            query:   {},
            content: { controller: 'AccountShowController', templateUrl: 'modules/Accounts/accounts.detail.html' }
          },
          resolve: {
            account: function(Accounts, $stateParams) { return Accounts.getByPurchase($stateParams.id); },
            purchases: function(account) { return account.follow('purchases'); },
            proposals: function(account) { return account.follow('proposals'); }
          }
        })
        .state('accounts.edit', {
          url: '/edit/:id',
          views: {
            query:   {},
            content: { controller: 'AccountEditController', templateUrl: 'modules/Accounts/accounts.edit.html' }
          },
          resolve: {
            account: function(Accounts, $stateParams) { return Accounts.get($stateParams.id); },
            isCreation: function()  { return false; }
          }
        })

        .state('accounts.create', {
          url: '/create/:id',
          views: {
            query:   { },
            content: { controller: 'AccountEditController', templateUrl: 'modules/Accounts/accounts.edit.html' }
          },
          resolve: {
            account: function() { return {}; },
            isCreation: function()  { return true; }
          }
        });
    });

  angular
    .module("segue.admin.accounts.controller", [
      'segue.admin.errors',
      'segue.admin.accounts.service'
    ])
    .controller("AccountListController", function($scope, $state, accounts, focusOn) {
      $scope.enforceAuth();
      $scope.accounts = accounts;
      $scope.query = { needle: $state.params.query };
      $scope.doSearch = function() {
        $state.go("accounts.list", { query: $scope.query.needle });
      };
      focusOn("query.needle");
    })
    .controller("AccountController", function($scope, $state, Accounts, focusOn) {
      focusOn('query.needle');
    })
    .controller("AccountShowController", function($scope, $state, account, purchases, proposals, focusOn) {
      $scope.enforceAuth();
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
    .controller("AccountEditController", function($scope, $state, Validator, FormErrors, Accounts,
                                                  account, isCreation, focusOn) {
      $scope.enforceAuth();
      $scope.account = account;
      $scope.isCreation = isCreation;
      focusOn("account.name", 200);

      $scope.submit = function() {
        var schema = (isCreation)? 'accounts/admin_create':'accounts/admin_edit';
        var saveFn = (isCreation)? Accounts.createOne : Accounts.saveOne;
        Validator.validate($scope.account, schema)
                 .then(saveFn)
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
    })
    .service("AccountCreateModal", function(ngDialog) {
      var options = {
        controller: 'AccountEditController',
        template: 'modules/Accounts/accounts.edit.html',
        className: 'ngdialog-theme-default dialog-account-create',
        resolve: {
          account: function() { return {}; },
          isCreation: function() { return true; }
        }
      };
      console.log(options);
      return function() {
        return ngDialog.open(options);
      };
    });
})();
