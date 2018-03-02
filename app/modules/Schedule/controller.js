(function() {
  "use string";

  angular
    .module("segue.admin.schedule",[
      'ngDialog',
      'ui.keypress',

      "segue.admin",
      'segue.admin.proposals.controller',
      'segue.admin.proposals.service',
      'segue.admin.schedule.service',
      "segue.admin.schedule.controller"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('schedule', {
          abstract: true,
          url: '^/schedule',
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
          },
          resolve: {
            situation: function(Schedule) { return Schedule.situation(); },
            days: function(Schedule) { return Schedule.days(); }
          }
        })
        .state('schedule.days', {
          url: '/days',
          views: {
            "main@": { controller: 'ScheduleDaysController', templateUrl: 'modules/Schedule/schedule.days.html' }
          }
        })
        .state('schedule.grid', {
          url: '/grid/:day',
          views: {
             "main@":   { controller: 'ScheduleGridController', templateUrl: 'modules/Schedule/schedule.view.html' }
          },
          resolve: {
            day: function($stateParams) { return $stateParams.day; },
            hours: function(Schedule) { return Schedule.hours(); },
            rooms: function(Schedule) { return Schedule.rooms(); }
          }
        });
    });

  angular
    .module("segue.admin.schedule.controller", [ ])
    .controller("ProposalLookupController", function($scope, Proposals, focusOn) {
      $scope.day  = $scope.ngDialogData.day;
      $scope.slot = $scope.ngDialogData.slot;

      $scope.proposals = [];
      $scope.query = { needle: '', limit: 20 };
      $scope.doSearch = function() {
        Proposals.lookup($scope.query).then(function(data) {
          $scope.proposals = data;
        });
      };
      $scope.selectTalk = function(proposal) {
        $scope.closeThisDialog(proposal);
      };
      focusOn('query.needle',200);
    })

    .controller("ScheduleDaysController", function($scope, $state, situation, days) {
      $scope.situation = situation;
      $scope.sum_free_non_blocked = _.sum(situation.slots, 'free_non_blocked');
      $scope.days = days;
    })

    .controller("ScheduleGridController", function($scope, $state, $window,
                                                   ngDialog,
                                                   Schedule, Config,
                                                   day, days, hours, rooms, focusOn, $uibModal) {
      $scope.days = days;

      $scope.hours = hours;
      $scope.rooms = rooms;
      $scope.currentDay = day;
      $scope.slotsOfRoom = {};
      $scope.zoomedId = 1;

      $scope.defaultSlotTimes = [
          '09:00', '09:20', '09:40',
          '10:00', '10:20', '10:40',
          '11:00', '11:20', '11:40',
          '12:00', '12:20', '12:40',
          '13:00', '13:20', '13:40',
          '14:00', '14:20', '14:40',
          '15:00', '15:20', '15:40',
          '16:00', '16:20', '16:40',
          '17:00', '17:20', '17:40',
          '18:00', '18:20', '18:40',
          '19:00', '19:20', '19:40'
      ];

      $scope.extendedSlotTimes = [
        '08:00', '08:20', '08:40',
        '09:00', '09:20', '09:40',
        '10:00', '10:20', '10:40',
        '11:00', '11:20', '11:40',
        '12:00', '12:20', '12:40',
        '13:00', '13:20', '13:40',
        '14:00', '14:20', '14:40',
        '15:00', '15:20', '15:40',
        '16:00', '16:20', '16:40',
        '17:00', '17:20', '17:40',
        '18:00', '18:20', '18:40',
        '19:00', '19:20', '19:40'
    ];

      $scope.eventTimes = {
        '2018-07-11': $scope.defaultSlotTimes,
        '2018-07-12': $scope.extendedSlotTimes,
        '2018-07-13': $scope.extendedSlotTimes,
        '2018-07-14': $scope.extendedSlotTimes,
      }

      $scope.oneHourEvents = ['10:00', '11:00', '12:00', '13:00'];

      $scope.isOneHourEvent = function(time) {
          return $scope.oneHourEvents.contains(time) >= 0;
      };

      $scope.reloadRoom = function(room) {
        if (!room) { return; }
        return Schedule.slotsOfRoom(room.id, $scope.currentDay).then(function(data) {
            $scope.slotsOfRoom[room.id] = data;
        });
      };

      $scope.reloadAllRooms = function(room) {
        return _.each($scope.rooms, $scope.reloadRoom);
      };

      $scope.editSlot = function (room, slot) {

        Schedule.getSlot(slot.id).then(function(updated) {
            var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'modules/Schedule/schedule.slot.edit.html',
                    controller: 'SlotEditController',
                    size: 'md',
                    resolve: {
                        slot: function () {
                            return updated;
                        }
                    }
            });
            modalInstance.result.then(function (result) {
                 $scope.reloadAllRooms();
            });
        });
      };

      $scope.createTalkForSlot = function(slot) {
        var url = $state.href('proposals.create_for_slot', { slotId: slot.id });
        $window.open(url, "_blank");
      };

      $scope.reloadAllRooms();
    })
    .controller('SlotEditController', function ($scope, $uibModalInstance,
                                               Proposals, Schedule,
                                               slot) {

        $scope.query = {};
        $scope.slot = slot;
        $scope.talk = slot.talk || {};

        $scope.chooseTalkForSlot = function() {
            if(!$scope.talk.id) { return; }
            Schedule.setTalkForSlot($scope.slot.id, $scope.talk.id)
                    .then(close)
        };

        $scope.saveAnnotation = function() {
          if(!$scope.slot.annotation) { return; }
          Schedule.annotateSlot($scope.slot.id, $scope.slot.annotation)
        };

        $scope.onSelectTalk = function(talk) {
            $scope.talk = {
                id: talk.id,
                title: talk.title,
                owner: talk.owner.name,
                track: talk.track.name_pt
            }
        };

        $scope.setStatusOfSlot = function(status) {
            Schedule.setSlotStatus($scope.slot.id, status)
                .then(close)
        };

        $scope.emptySlot = function() {
            if(!$scope.slot.talk.id) { return; }
            Schedule.emptySlot(slot.id)
                .then(close);
        };

         $scope.stretchSlot = function() {
             Schedule.stretchSlot($scope.slot.id)
                .then(close);
         };

        $scope.unstretchSlot = function() {
             Schedule.unstretchSlot($scope.slot.id)
                .then(close);
        };

        $scope.blockSlot = function() {
            Schedule.blockSlot($scope.slot.id)
                .then(close)
        };
        $scope.unblockSlot = function(slot) {
            Schedule.unblockSlot($scope.slot.id)
                .then(close)
        };

        $scope.saveOrUpdate = function() {
            console.log($scope.form.$dirty)
        };

        $scope.performSearch = function(value) {
            var query = {
                title: value
            };
            return Proposals.lookup(query).then(function(data) {
              return data;
            });
        };

        function close() {
            $uibModalInstance.close();
        }

    });
})();
