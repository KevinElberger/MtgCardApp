angular.module('mtgCardApp.controllers', []).
controller('mtgController', function($scope, mtgAPIservice) {
    $scope.cardList = [];
    $scope.card = "";
    $scope.hidden = 'hidden';

    $scope.cardList.search = function() {
        $scope.card = $scope.cardName;
        mtgAPIservice.getCards($scope.card).then(function(response) {
            // Obtain relevant data from response
            $scope.cardList = response.data.cards;
        });
        $scope.well = 'well';
        $scope.hidden = '';
    }
});