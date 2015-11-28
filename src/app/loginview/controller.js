angular.module('app').controller('loginviewCtrl', [
'$scope','nameservice', '$state',
function($scope, nameservice, $state) {
    $scope.login = function () {
        nameservice.save(form.name);
        $state.go('mainview');
    };

}]);
