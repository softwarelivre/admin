(function() {
  "use strict";

  angular
    .module("segue.admin.promocodes.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Promocodes", function(Restangular, $q) {
      var self = {};
      var promocodes = Restangular.service('admin/promocodes');

      self.lookup = function(query) {
        return promocodes.getList({ q: query });
      };

      self.get = function(id) {
        return promocodes.one(id).get();
      };

      self.createOne = function(promocode) {
        return promocodes.post(promocode);
      };
      self.products = function() {
        return promocodes.one('products').getList();
      };

      return self;
    });

})();
