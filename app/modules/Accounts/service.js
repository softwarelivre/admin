(function() {
  "use strict";

  angular
    .module("segue.admin.accounts.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Accounts", function(Restangular, $q) {
      var self = {};
      var accounts = Restangular.service('admin/accounts');

      self.lookup = function(query) {
        if (query.needle) {
          return accounts.getList({ q: query.needle });
        }
        return $q.when([]);
      };

      self.get = function(id) {
        return accounts.one(id).get();
      };

      self.createOne = function(account) {
        return accounts.post(account);
      };

      return self;
    });

})();
