(function() {
  "use strict";

  angular
    .module("segue.admin.caravans.service", [
      'segue.admin',
      'ngStorage',
      'restangular',
    ])
    .service("Caravan", function(Restangular) {
      var self = {};
      var caravans = Restangular.service('admin/caravans');

      self.lookup = function(query, perPage, page) {
        var query_args = _.extend(query, {per_page: perPage, page: page});
        return caravans.one().get(query_args);
      };

      self.getOne = function(id) {
        return caravans.one(id).get();
      };

      self.create = function(caravan) {
        return caravans.post(caravan);
      }

      self.update = function(caravan) {
        if(caravan.owner) {
          caravan.owner_id = caravan.owner.id;
        }
        return caravan.save();
      };

      self.exemptLeader = function(caravan) {
        return caravans.one(caravan.id).one('exempt-leader').get();
      };

      self.getInvites = function(caravanId) {
        return caravans.one(caravanId).one('invites').getList();
      };

      self.sendInvite = function(caravan, caravanInvite) {
        return caravans.one(caravan.id).one('invites').one(caravanInvite.hash).one('send-invite').get();
      }

      self.createNewInvite = function(caravan, invite) {
        return caravans.one(caravan.id).one('invites').post('create', invite);
      };

      self.acceptInvite = function(caravan, invite) {
        return caravans.one(caravan.id).one('invites').one(invite.hash).one('accept').get();
      }

      self.declineInvite = function(caravan, invite) {
        return caravans.one(caravan.id).one('invites').one(invite.hash).one('decline').get();
      }

      self.removeInvite = function(caravan, invite) {
        return caravans.one(caravan.id).one('invites').one(invite.hash).one('delete').remove()
      }

      return self;
    })

})();
