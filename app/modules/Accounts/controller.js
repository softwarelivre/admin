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
            query:   {  },
            content: { controller: 'AccountListController', templateUrl: 'modules/Accounts/accounts.query.html' }
          },
          resolve: {
            accounts: function(Accounts, $stateParams) { return Accounts.lookup({ needle: $stateParams.query }); },
          }
        })
        .state('accounts.detail', {
          url: '/detail/:id',
          views: {
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
            content: { controller: 'AccountEditController', templateUrl: 'modules/Accounts/accounts.edit.html' }
          },
          resolve: {
            account: function(Accounts, $stateParams) { return Accounts.get($stateParams.id); },
          }
        })

        .state('accounts.create', {
          url: '/create',
          views: {
            content: { controller: 'AccountCreateController', templateUrl: 'modules/Accounts/accounts.create.html' }
          }
        })
        .state('accounts.upload', {
          url: '/upload',
          views: {
            content: { controller: 'AccountUploadController', templateUrl: 'modules/Accounts/teste.html' }
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
    .controller("AccountListController", function($scope, $state, accounts, focusOn, Accounts) {
      $scope.enforceAuth();
      $scope.accounts = [];
      $scope.query = {};
      $scope.doSearch = function() {
          var query = removeEmptyParams($scope.query)
          
          Accounts.lookup(query).then(function(data) {
            $scope.accounts = data;
          });
      };

      $scope.isAdmin = function(account) {
        return Accounts.isAdmin(account);
      }

      var removeEmptyParams = function(query) {
        var q = Object.assign({}, query);
        for(key in q) {
          if (q[key] === '') {
            delete q[key];
          }
        }
        return q;
      }

      focusOn("query.needle");
    })
    .controller("AccountController", function($scope, $state, Accounts, focusOn) {
      focusOn('query.needle');
    })
    .controller("AccountUploadController", function($scope, $state, Accounts, focusOn, Config, Upload) {

      $scope.calculateTheTotalAmount = function(payments) {
        var total = 0;
        _.each(payments, function(payments) {
            total += payments.amount? payments.amount: payments.entry.amount
        });
        return total;
      };

      $scope.uploadUsingHttp = function(file) {
          file.upload = Upload.upload({
            url: Config.API_HOST + Config.API_PATH + '/'+ 'purchases/'+'csv',
            headers: {
              'Content-Type': file.type,
            },
            data: {file: file}
          });

          file.upload.then(function (response) {
            $scope.payments = response.data.payments;
          }, function (response) {
              $scope.uploadError = true
          });

          file.upload.progress(function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
      }
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
    .controller("AccountCreateController", function($scope, $state,
                                                    FormErrors, Accounts, focusOn) {
      $scope.enforceAuth();

      $scope.type = 'person'
      $scope.account = {
          sex: 'M',
          membership: false,
          disability: 'none'
      };

      $scope.disabilityTypes =  Accounts.getDisabilityTypes();
      $scope.occupationTypes = Accounts.getOccupationTypes();
      $scope.educationTypes = Accounts.getEducationTypes();

      focusOn("account.name", 500);

      $scope.submit = function() {
          Accounts.createOne($scope.account)
                  .then(moveToNextState)
                  .catch(FormErrors.setError);

      };
      function moveToNextState(account) {
        if ($scope.closeThisDialog) {
          $scope.closeThisDialog(account);
        } else {
          $state.go('accounts.detail', { id: account.id });
        }
      }
    })
    .controller("AccountEditController", function($scope, $state, FormErrors, Accounts,
                                                  account, focusOn) {
      $scope.enforceAuth();
      $scope.account = account;

      $scope.lockType = true;


      if(Accounts.isCorporate(account)) {
        $scope.account.cnpj = account.document;
        $scope.type = 'corporate'
      }
      else if(Accounts.isForeign(account)) {
          $scope.account.passport = account.document;
          $scope.type = 'foreign';
      } else {
          $scope.account.cpf = account.document;
          $scope.type = 'person'
      }

      focusOn("account.name", 200);

      $scope.disabilityTypes =  Accounts.getDisabilityTypes();
      $scope.occupationTypes = Accounts.getOccupationTypes();
      $scope.educationTypes = Accounts.getEducationTypes();

      $scope.submit = function() {
        Accounts.saveOne($scope.account)
                .then(moveToNextState)
                .catch(FormErrors.setError);
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
      };
      return function() {
        return ngDialog.open(options);
      };
    });
})();
