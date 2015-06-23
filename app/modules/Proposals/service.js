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

      extensions.tracksByZone = function() {
        return service.getList().then(function(tracks) {
          return _(tracks).map(addZoneAndTrack).groupBy('zone').value();
        });
      };

      function addZoneAndTrack(entry) {
        var splitted = entry.name_pt.split(' - ');
        entry.zone = splitted[0];
        entry.area = splitted[1];
        return entry;
      }

      return _.extend(service, extensions);
    })
    .service("Proposals", function(Restangular, $q) {
      var self = {};
      var proposals = Restangular.service('admin/proposals');

      self.lookup = function(query) {
        if (query.needle) {
          return proposals.getList({ q: query.needle });
        }
        return $q.when([]);
      };

      self.get = function(id) {
        return proposals.one(id).get();
      };

      self.getByTrack = function(trackId) {
        if (!trackId) { return []; }
        return proposals.getList({track_id: trackId });
      };

      self.changeTrackOfProposal = function(proposalId, newTrackId) {
        return proposals.one(proposalId).post('set-track', { track_id: newTrackId });
      };
      self.addTagToProposal = function(proposalId, tagName) {
        return proposals.one(proposalId).one('tags').post(tagName, {});
      };
      self.removeTagFromProposal = function(proposalId, tagName) {
        return proposals.one(proposalId).one('tags').one(tagName).remove();
      };

      return self;
    });

})();
