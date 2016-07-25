angular.module('deckBuilder').
    component('deckBuilder', {
        templateUrl: 'components/deck-builder/deck-builder.template.html',
        controller: function DeckBuilderController($scope, mtgAPIservice) {
            $scope.cardList = [];
            $scope.card = "";
            $scope.hidden = 'hidden'; // Hide image until search is made

            $scope.cardList.search = function() {
                $scope.card = $scope.cardName; // Obtain query param from input
                mtgAPIservice.getCards($scope.card).then(function(response) {
                    // Obtain relevant data from response
                    $scope.cardList = response.data.cards;
                });
                $scope.hidden = '';
            }
        }
    });