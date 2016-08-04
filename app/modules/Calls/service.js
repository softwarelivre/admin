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
        if (!trackId) { return []; }
        return calls.one(tournamentId).one(trackId).getList();
      };

      self.getByTournament = function(tournamentId) {
        if (!tournamentId) { return []; }
        return calls.one(tournamentId).getList();
      };


      return self;
    });
})();
