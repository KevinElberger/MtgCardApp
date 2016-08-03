angular.module('mtgCardApp.services', []).
    factory('mtgAPIservice', function($http) {

        var mtgAPI = {};

        mtgAPI.getCards = function(name) {
            return $http({
                method: 'GET',
                url: 'https://api.magicthegathering.io/v1/cards?name="' + name + '"'
            }).then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                console.log(response);
            });
        };

        mtgAPI.getToken = function() {
            return $http({
                method: 'POST',
                url: 'https://www.echomtg.com/api/user/auth/&email=kevelberger@gmail.com&password=whitehorse9'
            }).then(function successCallback(response) {
                return response.data.token;
            }, function errorCallback(response) {
                console.log(response);
            });
        };

        mtgAPI.getPrice = function(multiverseID, token) {
            return $http({
                method: 'GET',
                url: 'https://www.echomtg.com/api/inventory/add/mid=' + multiverseID + '&auth=' + token
            }).then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                console.log(response);
            });
        };

        return mtgAPI;
});