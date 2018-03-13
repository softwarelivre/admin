(function() {
  "use string";

  angular
    .module("segue.admin.promocodes",[
      "segue.admin",
      "segue.admin.libs",
      "segue.admin.errors",
      "segue.admin.promocodes.controller",
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('promocodes', {
          abstract: true,
          url: '^/promocodes',
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
            main:   { templateUrl: 'modules/Promocodes/promocodes.html' }
          }
        })
        .state('promocodes.list', {
          url: '/list/',
          views: {
            query:   {},
            content: { controller: 'PromocodeListController', templateUrl: 'modules/Promocodes/promocodes.list.html' }
          },
        })
        .state('promocodes.create', {
          url: '/create',
          views: {
            query:   { },
            content: { controller: 'PromocodeCreateController', templateUrl: 'modules/Promocodes/promocodes.edit.html' }
          },
          resolve: {
            products: function(Promocodes) { return Promocodes.products(); }
          }
        });
    });

  angular
    .module("segue.admin.promocodes.controller", [
      'segue.admin.promocodes.service'
    ])
    .controller("PromocodeListController", function($scope, Promocodes, NgTableParams, focusOn) {
      $scope.enforceAuth();

      $scope.query = {};

      $scope.search = function() {
        $scope.promocodeTable = new NgTableParams({}, {
              getData: function(params, $defer) {
                return Promocodes.lookup($scope.query, params.count(), params.page()).then(function(result) {
                  params.total(result.total);
                  return result.items;
              });
            }
        });
      }

      $scope.doSearch = function() {
        $scope.search();
      };

      focusOn("query.hash_code");
    })
    .controller("PromocodeCreateController", function($scope, $state, Validator, FormErrors, Promocodes, products, focusOn) {
      $scope.promocode = {};
      $scope.products  = products;

      $scope.products = products.filter(function(product) {
          return product.category == 'promocode';
      });


      focusOn("promocode.name", 200);

      $scope.submit = function() {
        Promocodes.createOne($scope.promocode)
                 .then(returnToListingPage)
                 .catch(FormErrors.setError);
      };
      function returnToListingPage(promocodes) {
        $state.go('promocodes.list', { query: $scope.promocode.description });
      }
    });
})();
