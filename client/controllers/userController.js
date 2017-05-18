(function() {
  'use strict';

  angular.module('acmKiosk').controller('userController', userController);

  userController.$inject = ['sessionService', 'errorService', 'User'];

  function userController(sessionService, errorService, User) {
    const vm = this;
    vm.sessionService = sessionService;

    sessionService.identity().then(identity => {
      if (!identity) {
        sessionService.redirectToRoot();
        swal('Oops...', '¡Debes iniciar sesión para hacer esto!', 'error');
      } else {
        User.query(users => vm.users = users);

        vm.toggleAdmin = user => {
          user.$toggleAdmin({ id: user._id }, updatedUser => {
            user.admin = updatedUser.admin;
          }, error => {
            errorService.handler(error.data);
          });
        };
      }
    });
  }
})();
