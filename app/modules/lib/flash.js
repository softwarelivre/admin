(function() {
  "use strict";

  angular
  .module('segue.admin.lib.flash', [
    'segue.admin',
    'ngToast'
  ])
  .service('FlashMsg', function(ngToast) {

    this.success = function(msg) {
      ngToast.create({
        className: 'success',
        content: msg
      });
    }

    this.error = function(msg) {
      ngToast.create({
        className: 'danger',
        content: msg
      });
    }

  });

})();
