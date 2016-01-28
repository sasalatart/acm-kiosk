(function() {
  'use strict'

  angular.module('acmKiosk').controller('userController', userController);

  userController.$inject = ['sessionService', '$http'];

  function userController(sessionService, $http) {
    var vm = this;
    vm.sessionService = sessionService;

    sessionService.identity().then(function(identity) {
      if (!identity) {
        sessionService.redirectToRoot();
        alert('You have not logged in!');
      } else {
        index();

        vm.toggleAdmin = function(user) {
          $http({
            method: 'PUT',
            url: '/users/' + user._id + '/toggleAdmin',
          })
          .success(function(updatedUser) {
            user.admin = updatedUser.admin;
          })
          .error(function(error) {
            console.log(error);
          });
        };

        function index() {
          $http({
            method: 'GET',
            url: '/users'
          })
          .success(function(users) {
            vm.users = users;
          })
          .error(function(error) {
            console.log(error);
          });
        }
      }
    })
  }
})();
