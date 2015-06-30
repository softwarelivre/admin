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

      self.pushTalkToSlot = function(slot) {
        return function(talk) {
          if (!slot) { return null; }
          return self.setTalkForSlot(slot.id, talk.id);
        };
      };
      self.pipeStatusToSlot = function(status) {
        return function(slot) {
          console.log(slot, status);
          if (!slot) { return null; }
          if (!status) { return slot; }
          return self.setSlotStatus(slot.id, status);
        };
      };
      self.setSlotStatus = function(slotId, status) {
        return slots.one(slotId).post('status', { status: status });
      };
      self.emptySlot = function(slotId, talkId) {
        return slots.one(slotId).one('talk').remove();
      };
      self.annotateSlot = function(slotId, content) {
        return slots.one(slotId).post('annotation', { content: content.trim() });
      };
      self.situation = function() {
        return slots.one('situation').get();
      };
      self.getSlot = function(slotId) {
        return slots.one(slotId).get();
      };

      return self;
    });

})();
