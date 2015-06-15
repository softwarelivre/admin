(function() {
  "use strict";

  angular
    .module("segue.admin.calls.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Calls", function(Restangular) {
      var self = {};
      var calls = Restangular.service('admin/call');

      self.get = function(tournamentId, trackId) {
        return calls.one(tournamentId).one(trackId).getList();
      };

      return self;
    });

})();
