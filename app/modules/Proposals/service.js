(function() {
  "use strict";

  angular
    .module("segue.admin.proposals.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Proposals", function(Restangular) {
      var self = {};
      var proposals = Restangular.service('admin/proposals');

      self.lookup = function(query) {
        if (query.needle) {
          return proposals.getList({ q: query.needle });
        }
      };

      self.get = function(id) {
        return proposals.one(id).get();
      };

      return self;
    });

})();
