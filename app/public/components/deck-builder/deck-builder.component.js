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
            $scope.cardStats = [];
            $scope.cardCount = 0;
            $scope.cmc = [0,0,0,0,0,0,0,0];
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
            // and stores cards for statistics
            $scope.deck.addCard = function() {
                $scope.cardCount += $scope.quantity;
                if($scope.board == true) {
                    $scope.mainBoard += ($scope.quantity + "x " + $scope.cardName + "\r\n");
                }
                if($scope.board == false) {
                    $scope.sideBoard += ($scope.quantity + "x " + $scope.cardName + "\r\n");
                }

                $scope.card = $scope.cardName; // Obtain query param from input
                mtgAPIservice.getCards($scope.card).then(function(response) {
                    // Obtain last card (most recent) from response and push into card stats array
                    that.cardStats.push([{"quantity": $scope.quantity}, {"card": response.data.cards[response.data.cards.length - 1]}]);

                    // Keep track of cmc and push in appropriate array slot
                    if(that.cardStats[that.cardStats.length-1][1].card.cmc) {
                        for (var j = 0; j < 8; j++) {
                            if (j == that.cardStats[that.cardStats.length-1][1].card.cmc) {
                                $scope.cmc[j]+= that.cardStats[that.cardStats.length-1][0].quantity;
                            }
                        }
                        if (that.cardStats[that.cardStats.length-1][1].card.cmc > 7) {
                            $scope.cmc[7]+= that.cardStats[that.cardStats.length-1][0].quantity;
                        }
                    }
                });
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

            $scope.deck.stats = function() {
                // Data for bar chart
                $scope.labels = ['0','1','2','3','4','5','6','7+'];
                $scope.series = ['Number of cards'];
                $scope.data = [
                    $scope.cmc
                ];
            };
        }
    });