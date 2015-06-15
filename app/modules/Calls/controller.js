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
            content: { controller: 'CallController', templateUrl: 'modules/Calls/calls.list.html' }
          },
          resolve: {
            track:   function(Tracks, $stateParams) { return Tracks.one($stateParams.trackId).get(); },
            ranking: function(Calls, $stateParams)  { return Calls.get($stateParams.tournamentId, $stateParams.trackId); }
          }
        });
    });

  angular
    .module("segue.admin.calls.controller", [ ])
    .controller("CallController", function($scope, $state, ranking, tournament, track, tracks) {
      $scope.ranking = ranking;
      $scope.tournament = tournament;
      $scope.tracksByZone = tracks;
      $scope.track = track;
    });
})();
