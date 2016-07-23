angular.module('mtgCardApp.controllers', []).
controller('mtgController', function($scope, mtgAPIservice) {
    $scope.cardList = [];
    $scope.card = "";

    $scope.cardList.search = function() {
        $scope.card = $scope.cardName;
        console.log($scope.card);
        mtgAPIservice.getCards($scope.card).then(function(response) {
            // Obtain relevant data from response
            $scope.cardList = response.data.cards;
        });
    }
});