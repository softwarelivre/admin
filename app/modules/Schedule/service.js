(function() {
  "use strict";

  angular
    .module("segue.admin.schedule.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Schedule", function(Restangular, Config, $q) {
      var self = {};
      var rooms = Restangular.service('admin/rooms');
      var slots = Restangular.service('admin/slots');

      self.days = function() {
        return Config.EVENT_DAYS;
      };
      self.hours = function() {
        return Config.HOURS;
      };
      self.rooms = function() {
        return rooms.getList();
      };

      self.slotsOfRoom = function(roomId, day) {
        return slots.getList({ day: day, room: roomId });
      };
      self.blockSlot = function(slotId) {
        return slots.one(slotId).post('block');
      };
      self.unblockSlot = function(slotId) {
        return slots.one(slotId).post('unblock');
      };
      self.setTalkForSlot = function(slotId, talkId) {
        return slots.one(slotId).post('talk', { proposal_id: talkId });
      };
      self.emptySlot = function(slotId, talkId) {
        return slots.one(slotId).one('talk').remove();
      };
      self.annotateSlot = function(slotId, content) {
        return slots.one(slotId).post('annotation', { content: content });
      };

      return self;
    });

})();
