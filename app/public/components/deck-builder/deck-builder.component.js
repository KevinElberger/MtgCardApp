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
            this.cardTypes = [0,0,0,0,0,0,0];
            this.cardColors = [{color: "White", count: 0}, {color: "Black", count: 0}, {color: "Blue", count: 0}, {color: "Red", count: 0}, {color: "Green", count: 0}];
            this.cardCount = 0;
            this.average = 0;
            this.sum = 0;
            this.cmc = [0,0,0,0,0,0,0,0];
            var that = this;

            // this.search = function(name) {
            //     mtgAPIservice.getCards(name).then(function(response) {
            //         // Obtain relevant data from response
            //         that.cardList = response.data.cards;
            //     });
            //     this.hidden = '';
            // };

            // Adds cards to either mainboard or sideboard
            // and stores cards for statistics
            this.addCard = function(card, quantity, board, format) {
                if (quantity > 0) {
                    that.cardCount += quantity;
                    mtgAPIservice.getCards(card).then(function (response) {
                        var data = response.data.cards[response.data.cards.length - 1];
                        // console.log(data);
                        var cardType = response.data.cards[response.data.cards.length - 1].types[0];

                        // Obtain last card (most recent) from response and push into card stats array
                        that.cardStats.push([{"quantity": quantity}, {"card": response.data.cards[response.data.cards.length - 1]}]);
                        // Keep track of cmc and push in appropriate array slot
                        if (that.cardStats[that.cardStats.length - 1][1].card.cmc) {
                            that.sum += (that.cardStats[that.cardStats.length - 1][1].card.cmc * quantity);
                            for (var j = 0; j < 8; j++) {
                                if (j == that.cardStats[that.cardStats.length - 1][1].card.cmc) {
                                    that.cmc[j] += that.cardStats[that.cardStats.length - 1][0].quantity;
                                }
                            }
                            if (that.cardStats[that.cardStats.length - 1][1].card.cmc > 7) {
                                that.cmc[7] += that.cardStats[that.cardStats.length - 1][0].quantity;
                            }
                        }
                        if (!that.hasCard(card, quantity)) {
                            // Record color types for polar area chart
                            that.recordColor(data, quantity);
                            switch (cardType) {
                                case "Creature":
                                    that.cardTypes[0]+= quantity;
                                    that.creatures.push([data, quantity]);
                                    break;
                                case "Sorcery":
                                    that.cardTypes[1]+= quantity;
                                    that.spells.push([data, quantity]);
                                    break;
                                case "Instant":
                                    that.cardTypes[2]+= quantity;
                                    that.spells.push([data, quantity]);
                                    break;
                                case "Artifact":
                                    that.cardTypes[3]+= quantity;
                                    that.artifacts.push([data, quantity]);
                                    break;
                                case "Enchantment":
                                    that.cardTypes[4]+= quantity;
                                    that.enchantments.push([data, quantity]);
                                    break;
                                case "Planeswalker":
                                    that.cardTypes[5]+= quantity;
                                    that.planeswalkers.push([data, quantity]);
                                    break;
                                default:
                                    that.cardTypes[6]+= quantity;
                                    that.lands.push([data, quantity]);
                                    break;
                            }
                        }
                        // Update statistics graphs
                        that.displayStats();
                    });
                }
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
            };

            this.recordColor = function(card, quantity) {
                console.log(card);
                if (card.colors) {
                    for (var i = 0; i < that.cardColors.length; i++) {
                        for (var j = 0; j < that.cardColors.length; j++) {
                            if (card.colors[j] == that.cardColors[i].color) {
                                that.cardColors[i].count+= quantity;
                                break;
                            }
                        }
                    }
                }
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

            this.displayStats = function() {
                // Data for bar chart
                var clicked = 0;
                if (clicked < 2) {
                    clicked++;
                    this.computeStats();
                }
            };

            this.computeStats = function() {
                that.average = that.sum / that.cardCount;
                var statWrap = document.getElementById("statisticsWrapper");
                statWrap.classList.remove("hidden");
                $('.canvasWrapper').empty().append('<label>Mana Curve</label><canvas id="bar" width="250" height="250"></canvas>' +
                '<label>Type Breakdown</label><canvas id="pie" width="250" height="250"></canvas><br/>' + '<label>Color Breakdown</label>' +
                '<canvas id="polar" width="250" height="250"></canvas>');
                var ctx = document.getElementById('bar').getContext('2d');
                var myBarChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['0','1','2','3','4','5','6','7+'],
                        datasets: [
                            {
                                label: '# of Cards',
                                data: that.cmc,
                                backgroundColor: ['#FF8B66',
                                    '#5B62BC',
                                    '#FFD666',
                                    '#DF5988',
                                    '#4C8BB0',
                                    '#4CBE84',
                                    '#FFBA66'
                                ],
                                borderColor: ['#FF8B66',
                                    '#5B62BC',
                                    '#FFD666',
                                    '#DF5988',
                                    '#4C8BB0',
                                    '#4CBE84',
                                    '#FFBA66'
                                ]
                            }
                        ],
                        options: {
                            responsiveAnimationDuration: 1000,
                            maintainAspectRatio: false
                        }
                    }
                });

                var pie = document.getElementById('pie').getContext('2d');
                var myPieChart = new Chart(pie, {
                    type: 'pie',
                    data: {
                        labels: [
                            "Creature",
                            "Sorcery",
                            "Instant",
                            "Artifact",
                            "Enchantment",
                            "Planeswalker",
                            "Land"
                        ],
                        datasets: [
                            {
                                data: [that.cardTypes[0], that.cardTypes[1], that.cardTypes[2], that.cardTypes[3],
                                    that.cardTypes[4], that.cardTypes[5], that.cardTypes[6]],
                                backgroundColor: [
                                    "#4CBE84",
                                    "#FF8B66",
                                    "#5B62BC",
                                    "#FFD666",
                                    "#DF5988",
                                    "#4C8BB0",
                                    "#FFBA66"
                                ]
                            }
                        ],
                        options: {
                            responsiveAnimationDuration: 1000,
                            maintainAspectRatio: false
                        }
                    }
                });

                var polar = document.getElementById('polar').getContext('2d');
                var myPolarChart = new Chart(polar, {
                    type: 'polarArea',
                    data: {
                        datasets: [{
                            data: [that.cardColors[0].count,that.cardColors[1].count,that.cardColors[2].count,
                                that.cardColors[3].count,that.cardColors[4].count],
                            backgroundColor: [
                                    "#FFD666",
                                    "#000000",
                                    "#4C8BB0",
                                    "#FF8B66",
                                    "#4C8BB0"
                            ],
                            label: 'Deck Colors' // legend
                        }],
                        labels: [
                            "White",
                            "Black",
                            "Blue",
                            "Red",
                            "Green"
                        ]
                    }
                });
            };
        }
    });