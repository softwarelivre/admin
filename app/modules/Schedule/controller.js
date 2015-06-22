(function() {
  "use string";

  angular
    .module("segue.admin.schedule",[
      "segue.admin",
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
    .controller("ScheduleDaysController", function($scope, $state, days) {
      $scope.days = days;
    })
    .controller("ScheduleGridController", function($scope, $state, Schedule, day, days, hours, rooms) {
      $scope.days = days;
      $scope.hours = hours;
      $scope.rooms = rooms;
      $scope.currentDay = day;
      $scope.slotsOfRoom = {};

      function reloadRoom(room) {
        Schedule.slotsOfRoom(room.id, $scope.currentDay).then(function(data) {
          $scope.slotsOfRoom[room.id] = data;
        });
      }

      function reloadAllRooms() {
        return _.each($scope.rooms, reloadRoom);
      }

      reloadAllRooms();
    });
})();
