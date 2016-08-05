angular.module('deckBuilder').
    component('deckBuilder', {
        templateUrl: 'components/deck-builder/deck-builder.template.html',
        controller: function DeckBuilderController($scope, mtgAPIservice) {
            this.card = "";
            this.hidden = 'hidden'; // Hide image until search is made
            this.cardStats = [];
            this.cardTypes = [0,0,0,0,0,0,0];
            this.cardColors = [{color: "White", count: 0}, {color: "Black", count: 0}, {color: "Blue", count: 0}, {color: "Red", count: 0}, {color: "Green", count: 0}];
            this.cardCount = 0;
            this.average = 0;
            this.sum = 0;
            this.row1 = [], this.row2 = [], this.row3 = [], this.row4 = [];
            this.cmc = [0,0,0,0,0,0,0,0];
            var that = this;

            // Adds cards to either mainboard or sideboard
            // and stores cards for statistics
            this.addCard = function(card) {
                // if (quantity > 0) {
                //     that.cardCount += quantity;

                // Get card from API
                mtgAPIservice.getCards(card).then(function (response) {
                    var data = response.data.cards[response.data.cards.length - 1];
                    var cardType = response.data.cards[response.data.cards.length - 1].types[0];

                    if (that.cardCount < 15) {
                        that.row1.push(response.data.cards[response.data.cards.length-1]);
                    } else if (that.cardCount >= 15 && that.cardCount < 30) {
                        that.row2.push(response.data.cards[response.data.cards.length-1]);
                    } else if (that.cardCount >= 30 && that.cardCount < 45) {
                        that.row3.push(response.data.cards[response.data.cards.length-1]);
                    } else if (that.cardCount >= 45 && that.cardCount < 60) {
                        that.row4.push(response.data.cards[response.data.cards.length-1]);
                    }
                    that.cardCount++;

                    // Obtain last card (most recent) from response and push into card stats array
                    that.cardStats.push(response.data.cards[response.data.cards.length - 1]);
                    // Keep track of cmc and push in appropriate array slot
                    if (that.cardStats[that.cardStats.length - 1].cmc) {
                        that.sum += that.cardStats[that.cardStats.length - 1].cmc;
                        for (var j = 0; j < 8; j++) {
                            if (j == that.cardStats[that.cardStats.length - 1].cmc) {
                                that.cmc[j] ++;
                            }
                        }
                        if (that.cardStats[that.cardStats.length - 1].cmc > 7) {
                            that.cmc[7] ++;
                        }
                    }
                    // Record color and quantity for polar chart
                    that.recordColor(data);

                    switch (cardType) {
                        case "Creature":
                            that.cardTypes[0]++;
                            break;
                        case "Sorcery":
                            that.cardTypes[1]++;
                            break;
                        case "Instant":
                            that.cardTypes[2]++;
                            break;
                        case "Artifact":
                            that.cardTypes[3]++;
                            break;
                        case "Enchantment":
                            that.cardTypes[4]++;
                            break;
                        case "Planeswalker":
                            that.cardTypes[5]++;
                            break;
                        default:
                            // Lands
                            that.cardTypes[6]++;
                            break;
                    }
                    // Update statistics graphs
                    that.displayStats();
                });
            };

            this.recordColor = function(card) {
                if (card.colors) {
                    for (var i = 0; i < that.cardColors.length; i++) {
                        for (var j = 0; j < that.cardColors.length; j++) {
                            if (card.colors[j] == that.cardColors[i].color) {
                                that.cardColors[i].count++;
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
                '<canvas id="polar" width="300" height="300"></canvas>');
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
                                    "#4C8BB0",
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
                    type: 'doughnut',
                    data: {
                        labels: [
                            "White",
                            "Black",
                            "Blue",
                            "Red",
                            "Green"
                        ],
                        datasets: [{
                            data: [that.cardColors[0].count,that.cardColors[1].count,that.cardColors[2].count,
                                that.cardColors[3].count,that.cardColors[4].count],
                            backgroundColor: [
                                    "#FFD666",
                                    "#333333",
                                    "#4C8BB0",
                                    "#FF8B66",
                                    "#4CBE84"
                            ]
                        }],
                        options: {
                            responsiveAnimationDuration: 1000,
                            maintainAspectRatio: false
                        }
                    }
                });
            };
        }
    });