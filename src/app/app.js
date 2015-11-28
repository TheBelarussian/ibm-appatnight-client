// Create the shop module and name it.
// Also include ngRoute for all our routing needs
angular.module('app', [
    'ui.router',
    'ui.bootstrap'
]);

angular.module('app')
    .config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to the root.
    $urlRouterProvider.otherwise("/");
    // Now set up the states
    $stateProvider
        .state('mainview', {
            url: "/",
            templateUrl : 'mainview/view.html',
            controller  : 'mainviewCtrl'
        })
        .state('loginview', {
            url: "login",
            controller: 'loginviewCtrl',
            templateUrl: 'loginview/login.html'
        })
        .state('testview', {
            url: "/testing",
            templateUrl : 'sockettestview/view.html',
            controller  : 'socketTestCtrl'
        });
});

angular.module('app').run(['$rootScope', '$location', '$http',
    function ($rootScope, $location, $http) {
        /*
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });*/
    }]);
