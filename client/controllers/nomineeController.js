(function() {
  'use strict';

  angular.module('acmKiosk').controller('nomineeController', nomineeController);

  nomineeController.$inject = ['sessionService', 'errorService', 'Nominee', '$http'];

  function nomineeController(sessionService, errorService, Nominee, $http) {
    var vm = this;
    vm.identity = null;

    sessionService.identity().then(function(identity) {
      if (!identity) {
        sessionService.redirectToRoot();
        swal('Oops...', '¡Debes iniciar sesión para hacer esto!', 'error');
      } else {
        vm.identity = identity;

        vm.index = function() {
          $http.get('/nominees')
            .then(function success(response) {
              vm.nominees = response.data.nominees;
              vm.identity.votes = response.data.myVotes;
            }, function error(response) {
              errorService.handler(response.data);
            });
        };
        vm.index();

        vm.newNominee = function() {
          var nominee = new Nominee();
          nominee.name = vm.nomineeForm.name;
          nominee.$save().then(function(newNominee) {
            vm.nominees.push(newNominee);
          }, function(error) {
            errorService.handler(error.data);
          });
          vm.nomineeForm = {};
        };

        vm.destroyNominee = function(nominee) {
          Nominee.delete({
            id: nominee._id
          }, function() {
            vm.nominees.splice(vm.nominees.indexOf(nominee), 1);
            var index = vm.identity.votes.indexOf(nominee._id);
            if (index !== -1) {
              vm.identity.votes.splice(index, 1);
            }
          }, function(error) {
            vm.index();
            errorService.handler(error.data);
          });
        };

        vm.vote = function(nominee) {
          $http.put('/nominees/' + nominee._id + '/vote')
            .then(function success(response) {}, function error(response) {
              errorService.handler(response.data);
            })
            .finally(function() {
              vm.index();
            });
        };

        vm.removeVote = function(nominee) {
          $http.put('/nominees/' + nominee._id + '/removeVote')
            .then(function success(response) {}, function error(response) {
              errorService.handler(response.data);
            })
            .finally(function() {
              vm.index();
            });
        };

        vm.resetVoters = function() {
          $http.get('/nominees/resetVoters')
            .then(function success() {
              vm.nominees.forEach(function(nominee) {
                nominee.voters = [];
              });
              vm.identity.votes = [];
            }, function error(response) {
              errorService.handler(response.data);
            });
        };

        vm.totalVotes = function() {
          return (vm.nominees)
            .map(function(nominee) {
              return nominee.voters.length;
            })
            .reduce(function(sum, current) {
              return sum + current;
            });
        };

        vm.showVoters = function(nominee) {
          vm.selectedNominee = nominee;
          $('.ui.long.modal').modal('show');
        };

        vm.containsMyVote = function(nominee) {
          var ids = nominee.voters.map(function(voter) {
            return voter._id;
          });
          return ids.indexOf(vm.identity._id) !== -1;
        };

        vm.canVote = function() {
          return vm.identity.votes.length < 3;
        };
      }
    });
  }
})();
