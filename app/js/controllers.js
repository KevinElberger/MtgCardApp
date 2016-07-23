angular.module('mtgCardApp.controllers', []).
controller('mtgController', function($scope, mtgAPIservice) {
    $scope.cardList = [];

    mtgAPIservice.getCards().then(function(response) {
       // Obtain relevant data from response
        $scope.cardList = response.data.cards;
    });
});