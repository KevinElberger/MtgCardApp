angular.module('mtgCardApp.services', []).
    factory('mtgAPIservice', function($http) {

        var mtgAPI = {};

        mtgAPI.getCards = function(name) {
            return $http({
                method: 'GET',
                url: 'https://api.magicthegathering.io/v1/cards?name="' + name + '"'
            }).then(function successCallback(response) {
                console.log(response.data.cards);
                return response;
            }, function errorCallback(response) {
                console.log(response);
            });
        };
        return mtgAPI;
});