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
            tournaments: function(Tournaments, $stateParams) { return Tournaments.all(); }
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
    .controller("TournamentStandingsController", function($scope, $state, tournament, standings) {
      $scope.tournament = tournament;
      $scope.standings = standings;
    });
})();
