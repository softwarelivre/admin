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
      self.getByPurchase = function(purchaseId) {
        return accounts.getList({ purchase_id: purchaseId }).then(function(results) {
          return results[0];
        });
      };

      self.createOne = function(account) {
        console.log(account.id);
        return accounts.post(account);
      };
      self.saveOne = function(account) {
        return account.save();
      };

      return self;
    });

})();
