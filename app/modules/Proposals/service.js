(function() {
  "use strict";

  angular
    .module("segue.admin.proposals.service", [
      'segue.admin',
      'ngStorage',
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
    .service("Proposals", function(Restangular, $q, $localStorage) {
      var self = {};
      var proposals = Restangular.service('admin/proposals');

      self.lookup = function(query) {
        if (query.needle.length > 3) {
          return proposals.getList({ q: query.needle, limit: query.limit });
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
      self.setStatusOfProposal = function(proposalId, status) {
        return proposals.one(proposalId).post('status', { status: status });
      };
      self.setCoauthorsOfProposal = function(proposalId, coauthors) {
        return proposals.one(proposalId).post('coauthors', _.pluck(coauthors, 'id'));
      };
      self.addTagToProposal = function(proposalId, tagName) {
        return proposals.one(proposalId).one('tags').post(tagName, {});
      };
      self.removeTagFromProposal = function(proposalId, tagName) {
        return proposals.one(proposalId).one('tags').one(tagName).remove();
      };
      self.current = function() {
        return $localStorage.savedProposal || {};
      };
      self.localSave = function(value) {
        $localStorage.savedProposal = value || {};
      };
      self.localForget = function() {
        $localStorage.savedProposal = {};
      };
      self.cleanUp = function(proposal) {
        var cloned = _.clone(proposal);
        delete cloned.owner;
        delete cloned.coauthors;
        delete cloned.status;
        cloned.owner_id  = proposal.owner.id;
        return cloned;
      };
      self.createOne = function(proposal) {
        return proposals.post(proposal);
      };
      self.pipeCoauthorsToProposal = function(coauthors) {
        return function(proposal) {
          return self.setCoauthorsOfProposal(proposal.id, coauthors);
        };
      };
      self.pipeStatusToProposal = function(status) {
        return function(proposal) {
          return self.setStatusOfProposal(proposal.id, status);
        };
      };

      return self;
    });

})();
