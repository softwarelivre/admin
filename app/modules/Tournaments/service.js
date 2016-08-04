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

      self.lookup = function(id, proposal_type, track_id) {
        return tournaments.one(id).getList('standings', {proposal_type: proposal_type, proposal_track: track_id});
      };

      self.standings = function(id) {
        return tournaments.one(id).one('standings').getList();
      };

      return self;
    });

})();
