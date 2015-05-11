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
          }
        })
        .state('proposals.search', {
          url: '/list',
          views: {
            query:   { controller: 'ProposalListController', templateUrl: 'modules/Proposals/proposals.query.html' },
            content: { controller: 'ProposalListController', templateUrl: 'modules/Proposals/proposals.list.html' }
          }
        })
        .state('proposals.detail', {
          url: '/detail/:id',
          views: {
            query:   { controller: 'ProposalController',     templateUrl: 'modules/Proposals/proposals.back.html' },
            content: { controller: 'ProposalShowController', templateUrl: 'modules/Proposals/proposals.detail.html' }
          },
          resolve: {
            proposal: function(Proposals, $stateParams) { return Proposals.get($stateParams.id); }
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
      $scope.query = { needle: '' };
      $scope.doSearch = function() {
        Proposals.lookup($scope.query).then(function(data) {
          $scope.proposals = data;
        });
      };
    })
    .controller("ProposalListController", function($scope, $state, Proposals, focusOn) {
      focusOn('query.needle');
    })
    .controller("ProposalShowController", function($scope, $state, proposal, focusOn) {
      $scope.proposal = proposal;
    });
})();
