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
          url: '/list/:query',
          views: {
            query:   { },
            content: { controller: 'PromocodeListController', templateUrl: 'modules/Promocodes/promocodes.list.html' }
          },
          resolve: {
            promocodes: function(Promocodes, $stateParams) {
              return Promocodes.lookup($stateParams.query);
            }
          }
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
    .controller("PromocodeListController", function($scope, $state, Promocodes, promocodes, focusOn) {
      $scope.enforceAuth();
      $scope.promocodes = promocodes;
      $scope.query = { needle: $state.params.query };
      $scope.doSearch = function() {
        $state.go("promocodes.list", { query: $scope.query.needle });
      };
      focusOn("query.needle");
    })
    .controller("PromocodeCreateController", function($scope, $state, Validator, FormErrors, Promocodes, products, focusOn) {
      $scope.promocode = {};
      $scope.products  = products;

      focusOn("promocode.name", 200);

      $scope.submit = function() {
        Validator.validate($scope.promocode, "purchases/create_promocode")
                 .then(Promocodes.createOne)
                 .then(returnToListingPage)
                 .catch(FormErrors.set);
      };
      function returnToListingPage(promocodes) {
        $state.go('promocodes.list', { query: $scope.promocode.description });
      }
    });
})();
