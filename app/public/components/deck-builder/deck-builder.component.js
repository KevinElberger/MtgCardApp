angular.module('deckBuilder').
    component('deckBuilder', {
        templateUrl: 'components/deck-builder/deck-builder.template.html',
        controller: function DeckBuilderController($scope, mtgAPIservice) {
            this.creatures = [];
            this.artifacts = [];
            this.enchantments = [];
            this.spells = [];
            this.planeswalkers = [];
            this.lands = [];
            this.mainBoard = ""; // Card names for main board
            this.sideBoard = ""; // Card names for side board
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

                mtgAPIservice.getCards(card).then(function(response) {
                    var cardType = response.data.cards[response.data.cards.length-1].types[0];
                    var data = response.data.cards[response.data.cards.length-1];
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

                    if (!that.hasCard(card, quantity)) {
                        switch (cardType) {
                            case "Creature":
                                that.creatures.push([data, quantity]);
                                break;
                            case "Sorcery":
                                that.spells.push([data, quantity]);
                                break;
                            case "Instant":
                                that.spells.push([data, quantity]);
                                break;
                            case "Artifact":
                                that.artifacts.push([data, quantity]);
                                break;
                            case "Enchantment":
                                that.enchantments.push([data, quantity]);
                                break;
                            case "Planeswalker":
                                that.planeswalkers.push([data, quantity]);
                                break;
                            default:
                                that.lands.push([data, quantity]);
                                break;
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

            // Check if card is already listed so only quantity needs to be updated
            this.hasCard = function(name, quantity) {
                for (var i = 0; i < that.creatures.length; i++) {
                    if (that.creatures[i][0].name.toUpperCase() === name.toUpperCase()) {
                        that.creatures[i][1] += quantity;
                        return true;
                    }
                }
                for (var j = 0; j < that.artifacts.length; j++) {
                    if (that.artifacts[j][0].name.toUpperCase() === name.toUpperCase()) {
                        that.artifacts[j][1] += quantity;
                        return true;
                    }
                }
                for (var k = 0; k < that.enchantments.length; k++) {
                    if (that.enchantments[k][0].name.toUpperCase() === name.toUpperCase()) {
                        that.enchantments[k][1] += quantity;
                        return true;
                    }
                }
                for (var l = 0; l < that.spells.length; l++) {
                    if (that.spells[l][0].name.toUpperCase() === name.toUpperCase()) {
                        that.spells[l][1] += quantity;
                        return true;
                    }
                }

                for (var m = 0; m < that.lands.length; m++) {
                    if (that.lands[m][0].name.toUpperCase() === name.toUpperCase()) {
                        that.lands[m][1] += quantity;
                        return true;
                    }
                }
                for (var n = 0; n < that.planeswalkers.length; n++) {
                    if (that.planeswalkers[n][0].name.toUpperCase() === name.toUpperCase()) {
                        that.planeswalkers[n][1] += quantity;
                        return true;
                    }
                }
                return false;
            }
        }
    });