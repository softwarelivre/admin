(function() {
  "use string";

  angular
    .module("segue.admin.financial",[
      "segue.admin",
      "segue.admin.libs",
      "segue.admin.errors",
      "segue.admin.financial.controller",
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('financial', {
          url: '^/financial',
          views: {
            header: {                                  templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'FinancialController', templateUrl: 'modules/Accounts/accounts.html' }
          }
        })
        .state('financial.process_boletos', {
          url: '/process-boletos',
          parent: 'financial',
          views: {
            content: { controller: 'FinancialProcessBoletosController', templateUrl: 'modules/Financial/financial.process.boletos.html' }
          }
        })
        .state('financial.adempiere_report', {
          url: '/adempiere-report',
          parent: 'financial',
          views: {
            content: { controller: 'FinancialAdempiereController', templateUrl: 'modules/Financial/financial.adempiere.html' }
          }
        });

    });

  angular
    .module("segue.admin.financial.controller", [
      'segue.admin.errors',
      'segue.admin.financial.service'
    ])
    .controller("FinancialController", function($scope, $state) {
      $scope.enforceAuth()
    })
    .controller("FinancialProcessBoletosController", function($scope, $state, Financial, Config, Upload) {

      $scope.calculateTheTotalAmount = function(payments) {
        var total = 0;
        _.each(payments, function(payments) {
            amount = payments.amount? payments.amount: payments.entry.amount
            total += parseFloat(amount)
        });
        return total;
      };

      $scope.uploadUsingHttp = function(file) {
          file.upload = Upload.upload({
            url: Config.API_HOST + Config.API_PATH + '/purchases/process-boletos',
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
    .controller("FinancialAdempiereController", function($scope, $state, Purchases, Financial, Config, Upload) {

      $scope.adempiereDataSet = [];
      $scope.query = {};

      $scope.search = function() {
        initial = moment($scope.query.initial_date, "DD/MM/YYYY").format("MM/DD/YYYY")
        end = moment($scope.query.end_date, "DD/MM/YYYY").format("MM/DD/YYYY")

        Purchases.getADempiereReport(initial, end).then(function(data) {
          $scope.adempiereDataSet = data['report_data'];
        });
      }

      $scope.remove = function(index) {
        $scope.adempiereDataSet.splice(index, 1);
      }

    });
})();
