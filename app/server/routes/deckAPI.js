var myApp = angular.module('myApp', ['ngRoute', 'deckBuilder', 'cardSearch', 'profile']);

myApp.config(function ($routeProvider) {
    $routeProvider
        .when('/:name', {
            template: '<profile></profile>',
            access: {restricted: true}
        });
});