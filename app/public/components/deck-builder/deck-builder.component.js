angular.module('deckBuilder').
    component('deckBuilder', {
        templateUrl: 'components/deck-builder/deck-builder.template.html',
        controller: function DeckBuilderController($scope, mtgAPIservice) {
            this.cardList = [];
            this.mainBoard = ""; // Card names for main board
            this.sideBoard = ""; // Card names for side board
            this.deck = [];
            this.card = "";
            this.hidden = 'hidden'; // Hide image until search is made
            this.cardStats = [];
            this.cardCount = 0;
            this.average = 0;
            this.sum = 0;
            this.cmc = [0,0,0,0,0,0,0,0];
            var that = this;

            this.search = function(name) {
                mtgAPIservice.getCards(name).then(function(response) {
                    // Obtain relevant data from response
                    that.cardList = response.data.cards;
                });
                this.hidden = '';
            };

            // Adds cards to either mainboard or sideboard
            // and stores cards for statistics
            this.addCard = function(card, quantity, board, format) {
                that.cardCount += quantity;
                if(board) {
                    that.mainBoard += (quantity + "x " + card + "\r\n");
                }
                if(!board) {
                    that.sideBoard += (quantity + "x " + card + "\r\n");
                }
                
                // that.card = $scope.cardName; // Obtain query param from input
                mtgAPIservice.getCards(card).then(function(response) {
                    // Obtain last card (most recent) from response and push into card stats array
                    that.cardStats.push([{"quantity": quantity}, {"card": response.data.cards[response.data.cards.length - 1]}]);

                    // Keep track of cmc and push in appropriate array slot
                    if(that.cardStats[that.cardStats.length-1][1].card.cmc) {
                        that.sum += (that.cardStats[that.cardStats.length-1][1].card.cmc * quantity);
                        for (var j = 0; j < 8; j++) {
                            if (j == that.cardStats[that.cardStats.length-1][1].card.cmc) {
                                that.cmc[j]+= that.cardStats[that.cardStats.length-1][0].quantity;
                            }
                        }
                        if (that.cardStats[that.cardStats.length-1][1].card.cmc > 7) {
                            that.cmc[7]+= that.cardStats[that.cardStats.length-1][0].quantity;
                        }
                    }
                });
            };

            // Saves deck as local text file
            this.saveDeck = function(deckFormat, mainBoard, sideBoard, notes) {
                var format = "Deck Format: " + deckFormat + "\r\n";
                var main = "Mainboard:\r\n" + mainBoard + "\r\n";
                var side = "Sideboard:\r\n" + sideBoard + "\r\n";
                var deckNotes = "Notes about deck:\r\n " + notes;
                var deck = new Blob([format, main, side, deckNotes], {type: "text/plain;charset=utf-8"});
                saveAs(deck, "deck.txt");
                this.textDeck = deck;
            };

            this.stats = function() {
                // Data for bar chart
                that.average = that.sum / that.cardCount;
                $scope.labels = ['0','1','2','3','4','5','6','7+'];
                $scope.series = ['Number of cards'];
                $scope.data = [
                    that.cmc
                ];
            };
        }
    });