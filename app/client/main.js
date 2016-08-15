var myApp = angular.module('myApp', ['ngRoute', 'deckBuilder', 'cardSearch', 'profile']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/landing.html'
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
    .when('/profile/:name', {
      templateUrl: 'partials/landing.html',
      access: {restricted: false}
    })
    .when('/profile', {
      template: '<profile></profile>',
      access: {restricted: true}
    })
    .when('/deckbuilder/edit/id=:id', {
      template: '<deck-builder></deck-builder>',
      access: {restricted: true},
      edit: 'true'
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
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});

myApp.directive('background', function() {
  setInterval(function() {
    $(".login-header").fadeTo('slow', 0.5, function() {
      var curId = Math.round(Math.random() * 9) + 1;
      $(".login-header").css("background-image", "url(../img/bg" + curId + ".jpg)");
    }).fadeTo('fast','1');
  }, 12000);
  return {};
});