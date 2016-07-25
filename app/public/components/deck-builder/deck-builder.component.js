angular.module('deckBuilder').
    component('deckBuilder', {
        templateUrl: 'components/deck-builder/deck-builder.template.html',
        controller: function DeckBuilderController($scope, mtgAPIservice) {
            $scope.cardList = [];
            $scope.mainBoard = ""; // Card names for main board
            $scope.sideBoard = ""; // Card names for side board
            $scope.deck = [];
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

            $scope.deck.addCard = function(card) {
                console.log($scope.board);
                if($scope.board == true) {
                    $scope.mainBoard += ($scope.quantity + "x " + $scope.cardName + "\n");
                }
                if($scope.board == false) {
                    $scope.sideBoard += ($scope.quantity + "x " + $scope.cardName + "\n");
                }
            }
        }
    });