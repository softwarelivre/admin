(function() {
  "use string";

  angular
    .module("segue.admin.purchase",[
      "segue.admin",
      "segue.admin.libs",
      "segue.admin.errors",
      "segue.admin.purchase.controller",
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('purchase', {
          abstract: true,
          url: '^/purchase',
          views: {
            header: {                                  templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'PurchaseController', templateUrl: 'modules/Purchases/purchases.html' }
           }
        })
        .state('purchase.list', {
          url: '/list/:query',
          views: {
            content:   { controller: 'PurchaseListController', templateUrl: 'modules/Purchases/purchases.query.html' }
          },
          resolve: {
            products: function (Products) {
                return Products.getList();
            }
          }
        })
    });

  angular
    .module("segue.admin.purchase.controller", [
      'segue.admin.errors',
      'segue.admin.purchase.service'
    ])
    .controller("PurchaseListController", function($scope, products, Purchases, ngToast) {

        $scope.query = {};
        $scope.purchases = [];
        $scope.products = products;

        $scope.statusList = {
            'pending': 'Pendente',
            'paid': 'Pago',
            'canceled': 'Cancelado',
            'student_document_in_analysis':'Vínculo estudantil aguardando análise',
            'gov_document_in_analysis':'Nota de empenho aguardando análise',
            'gov_document_submission_pending': 'Aguardando submissão da nota de empenho'
        };

        $scope.doSearch = function() {
          Purchases.lookup($scope.query).then(function(data) {
              $scope.purchases = data;
          });
        }

        $scope.confirmStudentDocument = function (index) {
          purchase = $scope.purchases[index];

          Purchases.confirmStudentDocument(String(purchase.id)).then(
            function (result) {
                ngToast.create({
                    content: 'Vínculo estudantil foi aprovado',
                    className: 'success'
                });
                $scope.purchases.splice(index, 1);
            }, function (error) {
                ngToast.create({
                    content: 'Erro ao aprovar o vínculo estudantil',
                    className: 'danger'
                });
            }
          );
        };


        $scope.confirmGovDocument = function (index) {
          purchase = $scope.purchases[index];

          Purchases.confirmGovDocument(String(purchase.id)).then(
            function (result) {
                ngToast.create({
                    content:'O documento de empenho foi aprovado',
                    className: 'success'
                });
                $scope.purchases.splice(index, 1);
            }, function (error) {
                ngToast.create({
                    content: 'Erro ao aprovar documento de empenho',
                    className: 'danger'
                });
            }
          );
        };
        
    })
    .controller("PurchaseController", function($scope, $state) {
        $scope.enforceAuth();
    });
})();
