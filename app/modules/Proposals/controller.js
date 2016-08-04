(function() {
  "use string";

  angular
    .module("segue.admin.proposals",[
      "ngDialog",
      "segue.admin",
      "segue.admin.errors",
      "segue.admin.libs",
      "segue.admin.schedule.service",
      "segue.admin.accounts.directives",
      "segue.admin.accounts.controller",
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
            content: { controller: 'ProposalSearchController', templateUrl: 'modules/Proposals/proposals.query.html' }
          }
        })
        .state('proposals.list', {
          url: '/list',
          views: {
            content: { controller: 'ProposalListController', templateUrl: 'modules/Proposals/proposals.tracks.html' }
          }
        })
        .state('proposals.detail', {
          url: '/detail/:id',
          views: {
            content: { controller: 'ProposalShowController', templateUrl: 'modules/Proposals/proposals.detail.html' }
          },
          resolve: {
            proposal: function(Proposals, $stateParams) { return Proposals.get($stateParams.id); },
            invites: function(proposal) { return proposal.follow('invites'); }
          }
        })
        .state('proposals.edit', {
          url: '/edit/:id',
          views: {
            content: { controller: 'ProposalEditController', templateUrl: 'modules/Proposals/proposals.edit.html' }
          },
          resolve: {
            isCreation: function() { return false; },
            slot: function(proposal) { return proposal.slots[0]; },
            proposal: function(Proposals, $stateParams) { return Proposals.get($stateParams.id); }
          }
        })
        .state('proposals.create', {
          url: '/create',
          views: {
            content: { controller: 'ProposalEditController', templateUrl: 'modules/Proposals/proposals.create.html' }
          },
          resolve: {
            isCreation: function() { return true; },
            slot: function() { return null; },
            proposal: function(Proposals) {
              return { coauthors: [], status: 'pending' };
            }
          }
        })
        .state('proposals.create_for_slot', {
          url: '/create/forSlot/:slotId',
          views: {
            query:   { controller: 'ProposalController',     templateUrl: 'modules/common/back.html' },
            content: { controller: 'ProposalEditController', templateUrl: 'modules/Proposals/proposals.edit.html' }
          },
          resolve: {
            isCreation: function() { return true; },
            slot: function(Schedule,$stateParams) { return Schedule.getSlot($stateParams.slotId); },
            proposal: function(Proposals) {
              return { coauthors: [], status: 'confirmed' };
            }
          }
        });
    });

  angular
    .module("segue.admin.proposals.controller", [
      'segue.admin.proposals.service'
    ])
    .controller("ProposalController", function($scope, $state, Proposals) {
      $scope.enforceAuth();
      $scope.proposals = [];
      $scope.query = { needle: '', limit: 20 };
      $scope.doSearch = function() {
        Proposals.lookup($scope.query).then(function(data) {
          $scope.proposals = data;
        });
      };
      $scope.doSearchProposal = function(name) {
        Proposals.lookup($scope.query).then(function(data) {
          return data;
        });
      };
    })
    .controller("ProposalSearchController", function($scope, Proposals, tracks) {
      $scope.query = {};
      $scope.proposals = [];

      $scope.tracks = tracks;
      $scope.types = Proposals.types();
      $scope.status = Proposals.status();

      $scope.doSearch = function() {
        Proposals.lookup($scope.query).then(function(data) {
          $scope.proposals = data;
        });
      };

    })
    .controller("ProposalListController", function($scope, $state, Proposals, tracksByZone) {
      $scope.filterType = 'group';
      $scope.tracksByZone = tracksByZone;
      $scope.proposals = [];
      $scope.selectedZone = {};
      $scope.selectedTrack = {};

      $scope.search = function() {
        if( $scope.selectedTrack ) {
          Proposals.getByTrack($scope.selectedTrack.id).then(function(data) {
            $scope.proposals = data;
          });
        }
      }
    })

    .controller("ProposalShowController", function($scope, $state, proposal, invites, tracks, Proposals, focusOn) {
      $scope.proposal = proposal;
      $scope.invites = invites;
    })

    .controller("ProposalEditController", function($scope, $state, $q, isCreation,
                                                   Validator, FormErrors, Config, Accounts, Schedule, Proposals,
                                                   AccountCreateModal, proposal, tracks, slot, focusOn) {

      $scope.slot = slot;
      $scope.levels = Config.PROPOSAL_LEVELS;
      $scope.tracks = tracks;
      $scope.proposal = proposal;
      $scope.languages = Config.PROPOSAL_LANGUAGES;

      $scope.pending_invites = _.filter($scope.invites, function(invite){
        return invite.status == 'pending';
      });

      $scope.invitesToRemove = [];

      if (isCreation) {
        //$scope.$watch('proposal', Proposals.localSave);
      } else {
        $scope.proposal.owner_id = proposal.owner.id;
        $scope.proposal.track_id = proposal.track.id;
      }

      focusOn('proposal.title',200);

      $scope.setOwner = function(person) {
        $scope.proposal.owner = person;
        $scope.proposal.owner_id = person.id;
        focusOn('proposal.full', 100);
      };
      $scope.pushCoauthor = function(person) {
        person.account_id = person.id;
        $scope.proposal.coauthors.push(person);
        focusOn('coauthor', 100);
      };
      $scope.removeOwner = function() {
        $scope.proposal.owner = null;
        $scope.proposal.owner_id = null;
        focusOn('owner', 100);
      };
      $scope.removeCoauthor = function(index) {
        _.pullAt($scope.proposal.coauthors, index);
        focusOn('coauthor', 100);
      };

      $scope.submitAll = function() {
        proposal = Proposals.cleanUp($scope.proposal)
        Proposals.saveObject(proposal)
                 .then(Proposals.pipeStatusToProposal($scope.proposal.status))
                 .then(Proposals.pipeCoauthorsToProposal($scope.proposal.coauthors))
                 .then(updateProposal)
                 .then(updateSlot)
                 .then(removeInvites)
                 .then(Proposals.localForget)
                 .then(moveToDetailsPage)
                 .catch(FormErrors.setError);
      };
      function updateProposal(proposal) {
        $scope.proposal.id = proposal.id;
        return proposal;
      }
      function updateSlot(proposal) {
        var slot = $scope.slot;
        if (!slot) { return proposal; }
        return $q.when(proposal)
                 .then(Schedule.pushTalkToSlot(slot))
                 .then(Schedule.pipeStatusToSlot(slot.status));
      }
      function moveToDetailsPage() {
        if (!$scope.proposal.id) { return; }
        $state.go('proposals.detail', { id: $scope.proposal.id });
      }

      function removeInvites() {
        angular.forEach($scope.invitesToRemove, function (invite) {
          Proposals.removeInviteFromProposal($scope.proposal.id, invite.id);
        });
      }

      $scope.createOwner = function(slot) {
        AccountCreateModal().closePromise.then(function(data) {
          if (noData(data)) { return; }
          $scope.setOwner(data.value);
        });

      };
      $scope.createCoauthor = function(slot) {
        AccountCreateModal().closePromise.then(function(data) {
          if (noData(data)) { return; }
          $scope.pushCoauthor(data.value);
        });

      };
      $scope.markInviteToRemove = function (index) {
        $scope.invitesToRemove.push($scope.invites[index]);
        $scope.pending_invites.splice(index, 1);
      };

      function noData(data) {
          if (_(data.value).isString()) { return true; }
          if (_(data.value).isEmpty()) { return true; }
          if (_(data.value.id).isUndefined()) { return true; }
          return false;
      }

    });

})();
