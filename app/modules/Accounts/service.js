(function() {
  "use strict";

  angular
    .module("segue.admin.accounts.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Accounts", function(Restangular) {
      var PATH = 'admin/accounts';
      var accounts = Restangular.service(PATH);

      self.lookup = function(query) {
        if (query.needle) {
          return accounts.getList({ q: query.needle });
        }
      };

      self.get = function(id) {
        return accounts.one(id).get();
      };

      Restangular.extendModel(PATH, function(model) {
        model.follow = function(name) {
          var path = model.links[name].href.replace(/.api./,'');
          return Restangular.one(path).getList();
        };
        return model;
      });

      return self;
    });

})();
