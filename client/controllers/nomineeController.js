(function() {
  'use strict'

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

        Nominee.query(function(nominees) {
          vm.nominees = nominees;
        });

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
            vm.removeMyNominee(nominee);
          }, function(error) {
            errorService.handler(error.data);
          });
        };

        vm.vote = function(nominee) {
          $http.put('/nominees/' + nominee._id + '/vote')
            .then(function success(response) {
              nominee.voters = response.data.voters;
              vm.identity.votes.push(response.data._id);
            }, function error(response) {
              errorService.handler(response.data);
            });
        };

        vm.removeVote = function(nominee) {
          $http.put('/nominees/' + nominee._id + '/removeVote')
            .then(function success() {
              nominee.voters.splice(nominee.voters.indexOf(vm.identity._id), 1);
              vm.removeMyNominee(nominee);
            }, function error(response) {
              errorService.handler(response.data);
            });
        };

        vm.getVoters = function(nominee) {
          vm.selectedNominee = {
            name: nominee.name
          }
          $http.get('/nominees/' + nominee._id + '/getVoters')
            .then(function success(response) {
              vm.selectedNominee.voters = response.data;
              $('.ui.long.modal').modal('show');
            }, function error(response) {
              errorService.handler(response.data);
            });
        };

        vm.resetVoters = function() {
          $http.get('nominees/resetVoters')
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

        vm.removeMyNominee = function(nominee) {
          var index = vm.identity.votes.indexOf(nominee._id);
          if (index !== -1) {
            vm.identity.votes.splice(index, 1);
          }
        };

        vm.containsMyVote = function(nominee) {
          return nominee.voters.indexOf(vm.identity._id) !== -1;
        };

        vm.canVote = function() {
          return vm.identity.votes.length < 3;
        };
      }
    });
  }
})();
