(function() {
  'use strict'

  angular.module('acmKiosk').controller('userController', userController);

  userController.$inject = ['sessionService', 'errorService', 'User'];

  function userController(sessionService, errorService, User) {
    var vm = this;
    vm.sessionService = sessionService;

    sessionService.identity().then(function(identity) {
      if (!identity) {
        sessionService.redirectToRoot();
        swal('Oops...', '¡Debes iniciar sesión para hacer esto!', 'error');
      } else {
        User.query(function(users) {
          vm.users = users;
        });

        vm.toggleAdmin = function(user) {
          user.$toggleAdmin({
            id: user._id
          }, function(updatedUser) {
            user.admin = updatedUser.admin;
          }, function(error) {
            errorService.handler(error.data);
          });
        };
      }
    });
  }
})();
