(function() {
  "use strict";

  angular
    .module("segue.admin.tournaments.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Tournaments", function(Restangular) {
      var self = {};
      var tournaments = Restangular.service('admin/tournaments');

      self.all = function() {
        return tournaments.getList();
      };

      self.get = function(id) {
        return tournaments.one(id).get();
      };

      return self;
    });

})();
