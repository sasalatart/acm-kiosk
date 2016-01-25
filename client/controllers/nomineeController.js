(function() {
  'use strict'

  angular.module('acmKiosk').controller('nomineeController', nomineeController);

  nomineeController.$inject = ['sessionService', 'Nominee', '$http'];

  function nomineeController(sessionService, Nominee, $http) {
    var vm = this;
    vm.identity = null;
    vm.nomineeForm = {};
    vm.nominees = [];

    sessionService.identity().then(function(identity) {
      if (!identity) {
        sessionService.redirectToRoot();
        alert('You have not logged in!');
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
            vm.nomineeForm = {};
          }, function(error) {
            alert(error.data.messages);
            vm.nomineeForm = {};
          })
        };

        vm.destroyNominee = function(nominee) {
          Nominee.delete({ id: nominee._id }, function() {
            vm.nominees.splice(vm.nominees.indexOf(nominee), 1);
            vm.removeMyNominee(nominee);
          }, function(error) {
            alert(error.data.messages);
          });
        };

        vm.vote = function(nominee) {
          $http({
              method: 'PUT',
              url: '/nominees/' + nominee._id + '/vote'
            })
            .success(function(votedNominee) {
              nominee.voters = votedNominee.voters;
              vm.identity.votes.push(votedNominee._id);
            })
            .error(function(error) {
              console.log(error);
            });
        };

        vm.removeVote = function(nominee) {
          $http({
              method: 'PUT',
              url: '/nominees/' + nominee._id + '/removeVote'
            })
            .success(function() {
              nominee.voters.splice(nominee.voters.indexOf(vm.identity._id), 1);
              vm.removeMyNominee(nominee);
            })
            .error(function(error) {
              console.log(error);
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
      }
    });
  }
})();
