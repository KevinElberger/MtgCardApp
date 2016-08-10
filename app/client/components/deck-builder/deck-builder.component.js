angular.module('deckBuilder').
    component('deckBuilder', {
        templateUrl: 'components/deck-builder/deck-builder.template.html',
        controller: function DeckBuilderController($scope, mtgAPIservice, $http) {
            this.hidden = 'hidden'; // Hide image until search is made
            this.cardStats = []; // Collection of cards
            this.cardTypes = [0,0,0,0,0,0,0]; // Creature, sorcery, instant, artifact, enchantment, planeswalker, land
            this.cardColors = [{color: "White", count: 0}, {color: "Black", count: 0}, {color: "Blue", count: 0}, {color: "Red", count: 0}, {color: "Green", count: 0}];
            this.cardCount = 0;
            this.cmc = [0,0,0,0,0,0,0,0];
            $scope.form = {};
            this.cards = []; // Name of cards in deck
            $scope.user = JSON.parse(sessionStorage.user);
            var that = this;

            $scope.createDeck = function() {
                $scope.form.user = $scope.user;
                $scope.form.cards = that.cards;
                console.log($scope.form);
                $http.post('/deckbuilder', $scope.form, that.cards, $scope.user)
                    .success(function (data) {
                        console.log(data);
                    })
                    .error(function( data) {
                        console.log(data);
                    });
            };

            // Adds cards for statistics and display purposes
            // @param card (String) - card name
            this.addCard = function(card) {
                // Get card from API
                mtgAPIservice.getCards(card).then(function (response) {
                    var data = response.data.cards[response.data.cards.length - 1];
                    var cardType = response.data.cards[response.data.cards.length - 1].types[0];
                    that.cardCount++;

                    // Obtain last card (most recent) from response and push into card collection
                    that.cardStats.push(data);
                    that.cards.push(data.name);
                    console.log(that.cards);
                    // Keep track of cmc and push in appropriate array slot
                    if (data.cmc) {
                        for (var j = 0; j < 8; j++) {
                            if (j == data.cmc) {
                                that.cmc[j] ++;
                            }
                        }
                        if (data.cmc > 7) {
                            that.cmc[7] ++;
                        }
                    }
                    // Record color for polar chart
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
                    var deck = document.getElementById('deck');
                    deck.classList.remove('hidden');
                    // Update statistics graphs
                    that.computeStats();
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

            this.computeStats = function() {
                var statWrap = document.getElementById("statisticsWrapper");
                statWrap.classList.remove("hidden");
                $('.canvasWrapper').empty().append('<label>Mana Curve</label><canvas id="bar" width="250" height="250"></canvas>' +
                '<label>Type Breakdown</label><canvas id="pie" width="250" height="250"></canvas><br/>' + '<label>Color Breakdown</label>' +
                '<canvas id="polar" width="300" height="300"></canvas>');

                // Create charts
                var ctx = document.getElementById('bar').getContext('2d');
                var pie = document.getElementById('pie').getContext('2d');
                var doughnut = document.getElementById('polar').getContext('2d');
                that.createChart(ctx);
                that.createChart(pie);
                that.createChart(doughnut);
            };

            this.createChart = function(chart) {
                if (chart.canvas.id == "polar") {
                    var doughnutChart = new Chart(chart, {
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
                } else if (chart.canvas.id == "pie") {
                    var pieChart = new Chart(chart, {
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
                } else if (chart.canvas.id == "bar") {
                    var barChart = new Chart(chart, {
                        type: 'bar',
                        data: {
                            labels: ['0','1','2','3','4','5','6','7+'],
                            datasets: [
                                {
                                    label: '# of Cards',
                                    data: that.cmc,
                                    backgroundColor: ['#333333',
                                        '#4C8BB0',
                                        '#FFD666',
                                        '#FF8B66',
                                        '#4C8BB0',
                                        '#4CBE84',
                                        '#FFBA66'
                                    ],
                                    borderColor: ['#333333',
                                        '#4C8BB0',
                                        '#FFD666',
                                        '#FF8B66',
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
                }
            };
        }
    });