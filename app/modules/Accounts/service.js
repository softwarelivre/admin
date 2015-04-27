(function() {
  "use strict";

  angular
    .module("segue.admin.accounts.service", [
      'segue.admin',
      'restangular'
    ])
    .service("Accounts", function(Restangular) {
      var accounts = Restangular.service('admin/accounts');

      self.lookup = function(query) {
        if (query.needle) {
          return accounts.getList({ q: query.needle });
        }
      };

      return self;
    });

})();
