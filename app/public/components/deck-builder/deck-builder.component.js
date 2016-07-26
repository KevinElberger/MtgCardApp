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
            var that = $scope;

            $scope.search = function() {
                $scope.card = $scope.cardName; // Obtain query param from input
                mtgAPIservice.getCards($scope.card).then(function(response) {
                    // Obtain relevant data from response
                    that.cardList = response.data.cards;
                });
                $scope.hidden = '';
            };

            // Adds cards to either mainboard or sideboard
            $scope.deck.addCard = function(card) {
                console.log($scope.board);
                if($scope.board == true) {
                    $scope.mainBoard += ($scope.quantity + "x " + $scope.cardName + "\n");
                }
                if($scope.board == false) {
                    $scope.sideBoard += ($scope.quantity + "x " + $scope.cardName + "\n");
                }
            };

            // Saves deck as local text file
            $scope.deck.saveDeck = function() {
                var format = "Deck Format: " + $scope.deckFormat + "\r\n";
                var main = "Mainboard:\r\n" + $scope.mainBoard + "\r\n";
                var side = "Sideboard:\r\n" + $scope.sideBoard + "\r\n";
                var notes = "Notes about deck:\r\n " + $scope.notes;
                var deck = new Blob([format, main, side, notes], {type: "text/plain;charset=utf-8"});
                saveAs(deck, "deck.txt");
            };
        }
    });