(function() {
  "use string";

  angular
    .module("segue.admin.tournaments",[
      "segue.admin",
      'segue.admin.tournaments.service',
      "segue.admin.tournaments.controller"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('tournaments', {
          abstract: true,
          url: '^/tournaments',
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
          },
        })
        .state('tournaments.list', {
          url: '/list',
          views: {
            "main@": { controller: 'TournamentListController', templateUrl: 'modules/Tournaments/tournaments.list.html' }
          },
          resolve: {
            tournaments: function(Tournaments, $stateParams) { return Tournaments.all() }
          }
        })
        .state('tournaments.detail', {
          url: '/detail/:id',
          views: {
            "main@": { controller: 'TournamentShowController', templateUrl: 'modules/Tournaments/tournaments.detail.html' }
          },
          resolve: {
            tournament: function(Tournaments, $stateParams) { return Tournaments.get($stateParams.id); },
          }
        })
        .state('tournaments.standings', {
          url: '/standings/:id',
          views: {
            "main@": { controller: 'TournamentStandingsController', templateUrl: 'modules/Tournaments/tournaments.standings.html' }
          },
          resolve: {
            tournament: function(Tournaments, $stateParams) { return Tournaments.get($stateParams.id); },
            standings:  function(Tournaments, $stateParams) { return Tournaments.standings($stateParams.id); },
            tracksByZone: function(Tracks) { return Tracks.tracksByZone() },
          }
        });
    });

  angular
    .module("segue.admin.tournaments.controller", [ ])
    .controller("TournamentListController", function($scope, $state, tournaments) {
      $scope.tournaments = tournaments;
    })
    .controller("TournamentShowController", function($scope, $state, tournament) {
      $scope.tournament = tournament;
    })
    .controller("TournamentStandingsController", function($scope, $state, $stateParams, 
                                                          Proposals, Tournaments,
                                                          tracksByZone, tournament, standings) {
      $scope.types = Proposals.types();
      $scope.tracksByZone = tracksByZone;
      $scope.tournament = tournament;
      $scope.standings = standings;
      $scope.selectedType = '';

      function byType(proposal) {
        if(!$scope.proposal_type) { return true }
        else {return proposal.type == $scope.proposal_type;};
      }

      function byTrack(proposal) {
        if(!$scope.proposal_track) { return true }
        else {return proposal.track_id == $scope.proposal_track.id;};
      }

      $scope.getStandings = function() {
        return $scope.standings.filter(byType).filter(byTrack);
      }

      $scope.onZoneChange = function() {
        $scope.proposal_track = '';
      }

    });
})();
