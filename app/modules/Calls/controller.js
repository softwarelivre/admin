(function() {
  "use string";

  angular
    .module("segue.admin.calls",[
      "segue.admin",
      'segue.admin.tournaments.service',
      'segue.admin.proposals.service',
      'segue.admin.calls.service',
      "segue.admin.calls.controller"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('calls', {
          abstract: true,
          url: '^/call/:tournamentId',
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
            main:   { templateUrl: 'modules/Calls/calls.html', controller: 'CallController' }
          },
          resolve: {
            track: function() { return {}; },
            ranking: function() { return []; },
            tournament: function(Tournaments, $stateParams) { return Tournaments.get($stateParams.tournamentId); },
            tracks: function(Tracks) { return Tracks.tracksByZone(); }
          }
        })

        .state('calls.list', {
          url: '/track/:trackId',
          views: {
            query:   { controller: 'CallController', templateUrl: 'modules/Calls/calls.tracks.html' },
            content: {  }
          },
          resolve: {
            ranking:  function(Calls, $stateParams) { 
              return  Calls.getByTournament($stateParams.tournamentId); 
            },
          }
        });
    });

  angular
    .module("segue.admin.calls.controller", [ ])
    .controller("CallController", function($scope, $state, $stateParams, 
                                           Calls, Proposals, 
                                           tournament, tracks, ranking) {
      $scope.ranking = ranking;
      $scope.tournament = tournament;
      $scope.tracksByZone = tracks;
      $scope.selectedType = '';
      $scope.types = Proposals.types();
      $scope.currentMark = {
          'name': 'mark-2',
          'description': 'chamada 2'
      };

      function byStatus(ranked) {
        if(!$scope.selectedStatus) {return true}
        else {return ranked.status == $scope.selectedStatus};
      }

      function byType(ranked) {
        if(!$scope.selectedType) { return true }
        else {return ranked.type == $scope.selectedType};
      }

      function byTrack(ranked) {
        if(!$scope.selectedTrack) { return true }
        else {return ranked.track_id == $scope.selectedTrack.id;};
      }

      $scope.isMarked = function(ranked) {
        return _(ranked.tags).contains($scope.currentMark.name);
      }

      $scope.tagAs = function(proposal, tagName) {
        Proposals.addTagToProposal(proposal.id, tagName).then(
            function(response) {
              proposal.tags.push(tagName);
            },
            function(error) {}
          );
      };

      $scope.untag = function(proposal, tagName) {
        Proposals.removeTagFromProposal(proposal.id, tagName).then(
            function(response) {
              idx = proposal.tags.indexOf(tagName);
              if(idx > -1) { 
                proposal.tags.splice(idx, 1);
              }
            },
            function(error) {}
          );
      };

      $scope.totalMarked = function() {
        return $scope.getRanking().filter($scope.isMarked).length
      }

      $scope.getRanking = function() {
        return $scope.ranking.filter(byType).filter(byTrack).filter(byStatus);
      }

      $scope.onZoneChange = function() {
        $scope.selectedTrack = '';
      }

    });
})();
