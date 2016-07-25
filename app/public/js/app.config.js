angular.module('mtgCardApp').
    config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.
                when('/deckbuilder', {
                    template: '<deck-builder></deck-builder>'
                }).
                when('/', {
                    template: '<card-search></card-search>'
                }).
                otherwise('/');
        }
]);