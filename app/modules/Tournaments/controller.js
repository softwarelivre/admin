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
        });
    });

  angular
    .module("segue.admin.tournaments.controller", [ ])
    .controller("TournamentListController", function($scope, $state, tournaments) {
      console.log(123);
      $scope.tournaments = tournaments;
    })
    .controller("TournamentShowController", function($scope, $state, tournament) {
      $scope.tournament = tournament;
    });
})();
