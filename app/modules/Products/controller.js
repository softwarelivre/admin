(function() {
  "use string";

  angular
    .module("segue.admin.product",[
      "segue.admin",
      "segue.admin.libs",
      "segue.admin.errors",
      "segue.admin.product.controller",
    ])
    .config(function($stateProvider) {
        $stateProvider
            .state('products', {
                abstract: true,
                url: '^/products',
                views: {
                    header: {templateUrl: 'modules/common/nav.html'},
                    main: {controller: 'ProductController', template: '<div ui-view="content"></div>'}
                }
            })
            .state('products.list', {
                url: '/list',
                views: {
                    content: {controller: 'ProductListController', templateUrl: 'modules/Products/products.list.html'}
                },
                resolve: {
                    products: function (Products) {
                        return Products.getList();
                    }
                }
            })
            .state('products.edit', {
              url: '/edit/:id',
              views: {
                content: { controller: 'ProductEditController', templateUrl: 'modules/Product/products.fieldset.html' }
              },
              resolve: {
                account: function(Products, $stateParams) { return Products.get($stateParams.id); },
              }
            })
    });
  angular
    .module("segue.admin.product.controller", [
      'segue.admin.errors',
      'segue.admin.product.service'
    ])
    .controller("ProductController", function($scope) {
      $scope.enforceAuth();
    })
    .controller("ProductListController", function($scope, products) {
      $scope.enforceAuth();
      $scope.products = products;
    })
    .controller("ProductListController", function($scope, products) {
      $scope.enforceAuth();
      $scope.products = products;
    });

})();