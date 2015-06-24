(function() {
  "use string";

  angular
    .module("segue.admin.schedule",[
      'ngDialog',
      'cfp.hotkeys',
      'ui.keypress',

      "segue.admin",
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
            days: function(Schedule, $stateParams) { return Schedule.days(); }
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
      focusOn('query.needle');
    })

    .controller("ScheduleDaysController", function($scope, $state, days) {
      $scope.days = days;
    })

    .controller("ScheduleGridController", function($scope, $state, ngDialog, hotkeys, Schedule, day, days, hours, rooms, focusOn) {
      $scope.days = days;
      $scope.hours = hours;
      $scope.rooms = rooms;
      $scope.currentDay = day;
      $scope.slotsOfRoom = {};
      $scope.zoomedId = 1;

      function reloadRoom(room) {
        return Schedule.slotsOfRoom(room.id, $scope.currentDay).then(function(data) {
          $scope.slotsOfRoom[room.id] = data;
        });
      }

      function reloadAllRooms() {
        return _.each($scope.rooms, reloadRoom);
      }

      $scope.resetZoom = function($event) {
        if ($event) $event.stopPropagation();
        $scope.zoomedId = null;
      };

      $scope.zoomOnSlot = function(slot) {
        $scope.zoomedId = slot.id;
        console.log(slot.annotation);
        focusOn('slot.annotation');
      };

      $scope.blockSlot = function(slot) {
        Schedule.blockSlot(slot.id)
                .then(_.partial(reloadRoom, slot.room))
                .then($scope.resetZoom);
      };
      $scope.unblockSlot = function(slot) {
        Schedule.unblockSlot(slot.id)
                .then(_.partial(reloadRoom, slot.room))
                .then($scope.resetZoom);
      };
      $scope.emptySlot = function(slot) {
        Schedule.emptySlot(slot.id)
                .then(_.partial(reloadRoom, slot.room))
                .then($scope.resetZoom);
      };
      $scope.saveAnnotation = function(slot) {
        Schedule.annotateSlot(slot.id, slot.annotation)
                .then(_.partial(reloadRoom, slot.room))
                .then($scope.resetZoom);
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
          if (_(data.value).isString()) { return; }
          if (_(data.value).isEmpty()) { return; }
          if (_(data.value.id).isUndefined()) { return; }
          Schedule.setTalkForSlot(slot.id, data.value.id)
                  .then(_.partial(reloadRoom, slot.room))
                  .then($scope.resetZoom);
        });

      };

      hotkeys.bindTo($scope)
              .add({ combo: 'esc', callback: $scope.resetZoom });

      reloadAllRooms();
    });
})();
