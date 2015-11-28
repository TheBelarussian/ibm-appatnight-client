// Create the shop module and name it.
// Also include ngRoute for all our routing needs
angular.module('app', [
    'ui.router',
    'ui.bootstrap'
]);

angular.module('app').config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to the root.
    $urlRouterProvider.otherwise("/");

    // Now set up the states
    $stateProvider
        .state('mainview', {
            url: "/",
            templateUrl : 'mainview/view.html',
            controller  : 'mainviewCtrl'
        });
});

angular.module('app').run(function () {

});
    // Set to the root scope.
