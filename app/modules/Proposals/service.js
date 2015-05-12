(function() {
  "use strict";

  angular
    .module("segue.admin.proposals.service", [
      'segue.admin',
      'restangular',
    ])
    .factory('Tracks', function(Restangular) {
      var service = Restangular.service('proposals/tracks');
      var extensions = {};
      return _.extend(service, extensions);
    })
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

      self.getByTrack = function(trackId) {
        if (!trackId) { return []; }
        return proposals.getList({track_id: trackId });
      }

      return self;
    });

})();
