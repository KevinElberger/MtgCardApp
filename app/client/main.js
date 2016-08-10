var myApp = angular.module('myApp', ['ngRoute', 'deckBuilder', 'cardSearch']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/landing.html',
      access: {restricted: false}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/card', {
      template: '<card-search></card-search>',
      access: {restricted: true}
    })
    .when('/deck', {
      template: '<deck-builder></deck-builder>',
      access: {restricted: true}
    })
    .when('/home', {
      templateUrl: 'partials/home.html',
      access: {restricted: true}
      })
    .otherwise({
      redirectTo: '/'
    });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        $rootScope.isLoggedInAyy = AuthService.isLoggedIn();
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});