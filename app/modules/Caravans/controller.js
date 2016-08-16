(function() {
  "use string";

  angular
    .module("segue.admin.caravans",[
      "ngDialog",
      "segue.admin",
      "segue.admin.errors",
      "segue.admin.libs",
      "segue.admin.schedule.service",
      "segue.admin.accounts.directives",
      "segue.admin.accounts.controller",
      "segue.admin.caravans.controller",
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('caravans', {
          abstract: true,
          url: '^/caravans',
          views: {
            header: {                                  templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'CaravanController', templateUrl: 'modules/Caravans/caravans.html' }
          }
        })
        .state('caravans.search', {
          url: '/search',
          views: {
            content: { controller: 'CaravanSearchController', templateUrl: 'modules/Caravans/caravans.query.html' }
          }
        })
        .state('caravans.create', {
          url: '/create',
          views: {
            content: { controller: 'CaravanNewController', templateUrl: 'modules/Caravans/caravans.create.html' }
          }
        })
        .state('caravans.edit', {
          url: '/edit/:id',
          views: {
            content: { controller: 'CaravanEditController', templateUrl: 'modules/Caravans/caravans.edit.html' }
          },
          resolve: {
            caravan: function($stateParams, Caravan) { return Caravan.getOne($stateParams.id); },
            caravanInvites: function($stateParams, Caravan) {return Caravan.getInvites($stateParams.id); }
          }
        })
        .state('caravans.detail', {
          url: '/detail/:id',
          views: {
            content: { controller: 'DetailCaravanController', templateUrl: 'modules/Caravans/caravans.detail.html' }
          },
          resolve: {
            caravan: function($stateParams, Caravan) { return Caravan.getOne($stateParams.id); },
            caravanInvites: function($stateParams, Caravan) {return Caravan.getInvites($stateParams.id); }
          }
        })
    });

  angular
    .module("segue.admin.caravans.controller", [
      'segue.admin.caravans.service'
    ])
    .controller("CaravanController", function($scope, $state) {

    })
    .controller("CaravanSearchController", function($scope, $state,
                                                    NgTableParams,
                                                    Caravan) {
      $scope.query = {};
      $scope.search = function() {
        $scope.caravansTable = new NgTableParams({}, {
              getData: function(params, $defer) {
                return Caravan.lookup($scope.query, params.count(), params.page()).then(function(result) {
                  params.total(result.total);
                  return result.items;
              });
            }
        });
      }
   })
   .controller("CaravanNewController", function($scope, $state, $uibModal,
                                                Caravan, FlashMsg, FormErrors){

     $scope.caravan = {};
     $scope.caravanInvites = [];
     $scope.invitesTable = {};

     $scope.isNewCaravan = true;

     var showSuccessMsg = _.partial(FlashMsg.success,'A caravana foi criada com sucesso');

     $scope.save = function() {
       Caravan.create($scope.caravan)
         .then(nextState)
         .then(showSuccessMsg)
         .catch(FormErrors.setError);
     };

     $scope.setOwner = function(owner) {
       $scope.caravan.owner = owner;
     };

     $scope.removeOwner = function() {
       $scope.caravan.owner = undefined;
     };

     var nextState = function(caravan) {
       $state.go('caravans.edit', {id: caravan.id} )
     };

   })
   .controller("CaravanEditController", function($scope, $state, $uibModal,
                                                 FlashMsg,
                                                 Caravan, FormErrors, NgTableParams,
                                                 caravan, caravanInvites) {
        $scope.caravan = caravan;
        $scope.caravanInvites = caravanInvites;
        $scope.invitesTable = new NgTableParams({}, {dataset: $scope.caravanInvites});

        var showUpdateMsg = _.partial(FlashMsg.success,'Os dados da caravana foram atualizados com sucesso!');
        var showExemptMsg = _.partial(FlashMsg.success, 'O líder foi isentado!');

        $scope.isDirty = function() {
          return $scope.caravanForm.$dirty;
        };

        $scope.save = function() {
          Caravan.update($scope.caravan)
            .then(showUpdateMsg)
            .then(reload)
            .catch(FormErrors.setError);
        };

        $scope.removeOwner = function() {
          $scope.caravan.owner = undefined;
        };

        $scope.setOwner = function(owner) {
          $scope.caravan.owner = owner;
        };

        $scope.sendInvite = function(caravanInvite) {
          Caravan.sendInvite($scope.caravan, caravanInvite);
        };

        $scope.acceptInvite = function(caravanInvite) {
          Caravan.acceptInvite($scope.caravan, caravanInvite)
        };

        $scope.declineInvite = function(caravanInvite) {
          Caravan.declineInvite($scope.caravan, caravanInvite);
        };

        $scope.removeInvite = function(idx) {
          var invite = $scope.caravanInvites[idx];
          Caravan.removeInvite($scope.caravan, invite).then(function(result) {
            $scope.tableParams.dataset = $scope.caravanInvites;
          });
        };

        $scope.exemptOwner = function() {
          Caravan.exemptLeader($scope.caravan).then(showExemptMsg)
        };

        $scope.addInvite = function() {
          var modalInstance = $uibModal.open({
            templateUrl: 'modules/Caravans/caravans.invite.edit.html',
            controller: 'AddCaravanInviteController',
            resolve: {
              caravan: $scope.caravan
            }
          });

          modalInstance.result.then(function (invite) {
            $state.reload();
          });
        };

        var reload = function() {
          $state.reload();
        }

   })
   .controller("DetailCaravanController", function($scope,
                                                   NgTableParams,
                                                   caravan, caravanInvites) {
     $scope.caravan = caravan;
     $scope.caravanInvites = caravanInvites;
     $scope.isReadOnly = true;
     $scope.invitesTable = new NgTableParams({}, {dataset: $scope.caravanInvites});

   })
   .controller("AddCaravanInviteController", function($scope, $uibModalInstance,
                                                      Caravan, FormErrors, focusOn,
                                                      caravan) {
     $scope.invite = {};

     $scope.save = function() {
       Caravan.createNewInvite(caravan, $scope.invite)
        .then(close)
        .catch(FormErrors.setError)
     };

     var close = function(invite) {
       $uibModalInstance.close(invite)
     };

     $scope.cancel = function () {
        $uibModalInstance.dismiss();
     };

     focusOn('invite.name');

   });

})();
