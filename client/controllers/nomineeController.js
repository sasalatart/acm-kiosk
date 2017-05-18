(function() {
  'use strict';

  angular.module('acmKiosk').controller('nomineeController', nomineeController);

  nomineeController.$inject = ['sessionService', 'errorService', 'Nominee', '$http'];

  function nomineeController(sessionService, errorService, Nominee, $http) {
    const vm = this;
    vm.identity = null;

    sessionService.identity().then(identity => {
      if (!identity) {
        sessionService.redirectToRoot();
        swal('Oops...', '¡Debes iniciar sesión para hacer esto!', 'error');
      } else {
        vm.identity = identity;

        vm.index = () => {
          $http.get('/nominees').then(response => {
            vm.nominees = response.data.nominees;
            vm.identity.votes = response.data.myVotes;
          }, response => {
            errorService.handler(response.data);
          });
        };
        vm.index();

        vm.newNominee = () => {
          const nominee = new Nominee({ name: vm.nomineeForm.name });
          nominee.$save().then(newNominee => {
            vm.nominees.push(newNominee);
          }, error => {
            errorService.handler(error.data);
          });
          vm.nomineeForm = {};
        };

        vm.destroyNominee = nominee => {
          Nominee.delete({ id: nominee._id }, () => {
            vm.nominees.splice(vm.nominees.indexOf(nominee), 1);
            vm.identity.votes.splice(vm.identity.votes.indexOf(nominee._id), 1);
            vm.index();
          }, response => {
            errorService.handler(response.data);
            vm.index();
          });
        };

        vm.vote = nominee => {
          $http.put('/nominees/' + nominee._id + '/vote').then(response => {
            nominee.voters.push(vm.identity);
            vm.identity.votes.push(nominee._id);
          }, response => {
            errorService.handler(response.data);
          }).finally(() => {
            vm.index();
          });
        };

        vm.removeVote = nominee => {
          $http.put('/nominees/' + nominee._id + '/remove_vote').then(response => {
            nominee.voters.splice(nominee.voters.indexOf(vm.identity), 1);
            vm.identity.votes.splice(vm.identity.votes.indexOf(nominee._id), 1);
          }, response => {
            errorService.handler(response.data);
          }).finally(() => {
            vm.index();
          });
        };

        vm.resetVoters = () => {
          $http.get('/nominees/reset_voters').then(() => {
            vm.nominees.forEach(nominee => nominee.voters = []);
            vm.identity.votes = [];
          }, response => {
            errorService.handler(response.data);
          });
        };

        vm.totalVotes = () => {
          return vm.nominees.map(nominee => nominee.voters.length)
            .reduce((sum, current) => sum + current);
        };

        vm.showVoters = nominee => {
          vm.selectedNominee = nominee;
          $('#voters').modal('show');
        };

        vm.containsMyVote = nominee => {
          const ids = nominee.voters.map(voter => voter._id);
          return ids.indexOf(vm.identity._id) !== -1;
        };

        vm.canVote = () => {
          return vm.identity.votes.length < 3;
        };
      }
    });
  }
})();
