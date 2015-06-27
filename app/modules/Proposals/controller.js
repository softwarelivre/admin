(function() {
  "use string";

  angular
    .module("segue.admin.proposals",[
      "segue.admin",
      "segue.admin.proposals.controller",
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('proposals', {
          abstract: true,
          url: '^/proposals',
          views: {
            header: {                                  templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'ProposalController', templateUrl: 'modules/Proposals/proposals.html' }
          },
          resolve: {
            tracks:       function(Tracks) { return Tracks.getList(); },
            tracksByZone: function(Tracks) { return Tracks.tracksByZone(); }
          }
        })
        .state('proposals.search', {
          url: '/search',
          views: {
            query:   { controller: 'ProposalSearchController', templateUrl: 'modules/Proposals/proposals.query.html' },
            content: { controller: 'ProposalSearchController', templateUrl: 'modules/Proposals/proposals.list.html' }
          }
        })
        .state('proposals.list', {
          url: '/list/:trackId',
          views: {
            query:   { controller: 'ProposalListController', templateUrl: 'modules/Proposals/proposals.tracks.html' },
            content: { controller: 'ProposalListController', templateUrl: 'modules/Proposals/proposals.list.html' }
          },
          resolve: {
            proposals: function(Proposals, $stateParams) { return Proposals.getByTrack($stateParams.trackId); }
          }
        })
        .state('proposals.detail', {
          url: '/detail/:id',
          views: {
            query:   { controller: 'ProposalController',     templateUrl: 'modules/common/back.html' },
            content: { controller: 'ProposalShowController', templateUrl: 'modules/Proposals/proposals.detail.html' }
          },
          resolve: {
            proposal: function(Proposals, $stateParams) { return Proposals.get($stateParams.id); },
            invites: function(proposal) { return proposal.follow('invites'); }
          }
        })
        .state('proposals.create', {
          url: '/create',
          views: {
            query:   { controller: 'ProposalController',       templateUrl: 'modules/common/back.html' },
            content: { controller: 'ProposalCreateController', templateUrl: 'modules/Proposals/proposals.edit.html' }
          },
          resolve: {
          }
        });
    });

  angular
    .module("segue.admin.proposals.controller", [
      'segue.admin.proposals.service'
    ])
    .controller("ProposalController", function($scope, $state, Proposals, focusOn) {
      $scope.enforceAuth();
      $scope.proposals = [];
      $scope.query = { needle: '', limit: 20 };
      $scope.doSearch = function() {
        Proposals.lookup($scope.query).then(function(data) {
          $scope.proposals = data;
        });
      };
    })
    .controller("ProposalSearchController", function($scope, $state, focusOn) {
      $scope.filterType = 'search';
      focusOn('query.needle');
    })
    .controller("ProposalListController", function($scope, $state, tracksByZone, proposals, focusOn) {
      $scope.filterType = 'group';
      $scope.tracksByZone = tracksByZone;

      $scope.proposals = proposals;
    })
    .controller("ProposalShowController", function($scope, $state, proposal, invites, tracks, Proposals, focusOn) {
      $scope.proposal = proposal;
      $scope.invites = invites;
      $scope.tracks = tracks;

      $scope.changeTrackOfProposal = function(newTrackId) {
        return Proposals.changeTrackOfProposal(proposal.id, newTrackId)
                        .then($state.reload);
      };
    })
    .controller("ProposalCreateController", function($scope, tracks, focusOn) {
      if ($scope.ngDialogData) {
        $scope.day  = $scope.ngDialogData.day;
        $scope.slot = $scope.ngDialogData.slot;
      }

      $scope.tracks = tracks;
      $scope.proposal = {};
      focusOn('proposal.title',200);
    });
})();
