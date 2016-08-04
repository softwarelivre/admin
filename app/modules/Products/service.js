(function() {
    "use strict";

    angular
        .module('segue.admin.product.service', [
            'segue.admin',
            'restangular',
        ])
        .factory('Products', function (Restangular) {
            var service = Restangular.service('admin/products');
            var extensions = {};

            return _.extend(service, extensions);
        });
})();