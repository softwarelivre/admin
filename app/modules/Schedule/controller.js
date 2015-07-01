(function() {
  "use string";

  angular
    .module("segue.admin.schedule",[
      'ngDialog',
      'cfp.hotkeys',
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
            "header@": { controller: 'ScheduleGridController', templateUrl: 'modules/Schedule/schedule.days.html' },
            "main@":   { controller: 'ScheduleGridController', templateUrl: 'modules/Schedule/schedule.grid.html' }
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
                                                   ngDialog, hotkeys,
                                                   Schedule, Config,
                                                   day, days, hours, rooms, focusOn) {

      // var socket = io(Config.API_HOST+":9001");
      // socket.on("sync-room", function(room) {
      //   $scope.reloadRoom(room);
      // });
      function emitSignal(room) {
      //  socket.emit("room", room);
      }

      $scope.days = days;
      $scope.hours = hours;
      $scope.rooms = rooms;
      $scope.currentDay = day;
      $scope.slotsOfRoom = {};
      $scope.zoomedId = 1;

      $scope.reloadRoom = function(room) {
        if (!room) { return; }
        return Schedule.slotsOfRoom(room.id, $scope.currentDay).then(function(data) {
          $scope.slotsOfRoom[room.id] = data;
        });
      };

      $scope.reloadAllRooms = function(room) {
        return _.each($scope.rooms, $scope.reloadRoom);
      };

      $scope.resetZoom = function($event) {
        if ($event) $event.stopPropagation();
        $scope.zoomedId = null;
      };

      $scope.zoomOnSlot = function(slot) {
        $scope.zoomedId = slot.id;
        focusOn('slot.annotation');
      };

      $scope.blockSlot = function(slot) {
        Schedule.blockSlot(slot.id)
                .then(_.partial(emitSignal, slot.room))
                .then(_.partial($scope.reloadRoom, slot.room))
                .then($scope.resetZoom);
      };
      $scope.unblockSlot = function(slot) {
        Schedule.unblockSlot(slot.id)
                .then(_.partial(emitSignal, slot.room))
                .then(_.partial($scope.reloadRoom, slot.room))
                .then($scope.resetZoom);
      };
      $scope.emptySlot = function(slot) {
        Schedule.emptySlot(slot.id)
                .then(_.partial(emitSignal, slot.room))
                .then(_.partial($scope.reloadRoom, slot.room))
                .then($scope.resetZoom);
      };
      $scope.saveAnnotation = function(slot) {
        Schedule.annotateSlot(slot.id, slot.annotation)
                .then(_.partial(emitSignal, slot.room))
                .then(_.partial($scope.reloadRoom, slot.room))
                .then($scope.resetZoom);
      };
      $scope.setStatusOfSlot = function(slot, status) {
        Schedule.setSlotStatus(slot.id, status)
                .then(_.partial(emitSignal, slot.room))
                .then(_.partial($scope.reloadRoom, slot.room))
                .then($scope.resetZoom);
      };

      $scope.createTalkForSlot = function(slot) {
        var url = $state.href('proposals.create_for_slot', { slotId: slot.id });
        $window.open(url, "_blank");
      };

      $scope.chooseTalkForSlot = function(slot) {
        var options = {
          controller: 'ProposalLookupController',
          template: 'modules/Schedule/schedule.proposals.lookup.html',
          data: { day: day, slot: slot },
          className: 'ngdialog-theme-default dialog-proposal-lookup',
        };
        var dialog = ngDialog.open(options);
        dialog.closePromise.then(function(data) {
          if (noData(data)) { return; }
          Schedule.setTalkForSlot(slot.id, data.value.id)
                  .then(_.partial(emitSignal, slot.room))
                  .then(_.partial($scope.reloadRoom, slot.room))
                  .then($scope.resetZoom);
        });

      };

      function noData(data) {
          if (_(data.value).isString()) { return true; }
          if (_(data.value).isEmpty()) { return true; }
          if (_(data.value.id).isUndefined()) { return true; }
          return false;
      }

      hotkeys.bindTo($scope).add({ combo: 'esc', callback: $scope.resetZoom });

      $scope.reloadAllRooms();
    });
})();
