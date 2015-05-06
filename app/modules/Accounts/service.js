(function() {
  "use strict";

  angular
    .module("segue.admin.accounts.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Accounts", function(Restangular) {
      var self = {};
      var accounts = Restangular.service('admin/accounts');

      self.lookup = function(query) {
        if (query.needle) {
          return accounts.getList({ q: query.needle });
        }
      };

      self.get = function(id) {
        return accounts.one(id).get();
      };

      return self;
    });

})();
