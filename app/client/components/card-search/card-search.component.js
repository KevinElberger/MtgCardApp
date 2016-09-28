angular.module('cardSearch').
    component('cardSearch', {
        templateUrl: 'components/card-search/card-search.template.html',
        controller:  function CardSearchController($scope, mtgAPIservice) {
            this.cardList = [];
            this.hidden = 'hidden';
            this.token = '';
            this.price = [0,0,0]; // high, low, mid
            var that = this;

            // Search for a Magic: The Gathering card
            // @param name (String) - card name
            this.search = function(name) {
                $('.results').empty();
                $('.loader').append("<i class='fa fa-cog fa-spin fa-3x fa-fw'></i><span class='sr-only'>Loading...</span>");
                mtgAPIservice.getCards(name).then(function(response) {
                    // Obtain relevant data from response
                    that.cardList = response.data.cards;
                    mtgAPIservice.getToken().then(function(response) {
                        that.token = response;

                        mtgAPIservice.getPrice(that.cardList[0].multiverseid, that.token).then(function(response) {
                            that.price[0] = response.data.card.tcg_high;
                            that.price[1] = response.data.card.tcg_low;
                            that.price[2] = response.data.card.tcg_mid;

                            $('.loader').empty();
                            that.showContent(0);
                            // Append line chart with item prices
                            $('.canvasWrapper').empty().append('<label>Price</label><canvas id="line" width="450" height="450"></canvas>');
                            var ctx = document.getElementById('line').getContext('2d');
                            that.createChart(ctx);
                            // Display card image & set display
                            var set = document.getElementById('setTitle');
                            var sImg = document.getElementById('searchImg');
                            that.remove(set);
                            that.remove(sImg);
                        });
                    });
                });
            };

            // Display the content of the Magic: The Gathering card
            // @param num (number) - card set number
            this.showContent = function(num) {
                // Append card stats to results div
                if (that.cardList[num].power !== undefined && that.cardList[num].toughness !== undefined) {
                    $("<div style='display: none;'><p><strong>Name: </strong>" + that.cardList[num].name + " </p>" +
                        "<p><strong>Artist: </strong>" + that.cardList[num].artist + "</p>" +
                        "<p><strong>Rarity: </strong>" + that.cardList[num].rarity + "</p>" +
                        "<p><strong>P/T: </strong>" + that.cardList[num].power + " / " + that.cardList[num].toughness + "</p>" +
                        "<p><strong>Card Text: </strong>" + that.cardList[num].text + "</p>" +
                        "<p><strong>Flavor: </strong><em>" + that.cardList[num].flavor + "</em></p></div>").appendTo($('.results')).slideDown('slow');
                } else {
                    $("<div style='display: none;'><p><strong>Name: </strong>" + that.cardList[num].name + " </p>" +
                        "<p><strong>Artist: </strong>" + that.cardList[num].artist + "</p>" +
                        "<p><strong>Rarity: </strong>" + that.cardList[num].rarity + "</p>" +
                        "<p><strong>P/T: </strong> / </p>" +
                        "<p><strong>Card Text: </strong>" + that.cardList[num].text + "</p>" +
                        "<p><strong>Flavor: </strong><em>" + that.cardList[num].flavor + "</em></p></div>").appendTo($('.results')).slideDown('slow');
                }
            };

            // Display hidden content
            // @param elem (Object) - element to be displayed
            this.remove = function(elem) {
                elem.classList.remove('hidden');
            };

            // Create a chart to be displayed
            // @param chart (Object) - chart element
            this.createChart = function(chart) {
                var lineChart = new Chart(chart, {
                    type: 'line',
                    data: {
                        labels: ["Low", "Medium", "High"],
                        datasets: [
                            {
                                label: "Price",
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: "rgba(75,192,192,0.4)",
                                borderColor: "#4cbe83",
                                pointRadius: 2,
                                pointHitRadius: 10,
                                data: [that.price[1],that.price[2],that.price[0]],
                                spanGaps: false
                            }
                        ]
                    }
                });
            };

            // Update a card's set information
            // @param set (number) - card set number
            this.update = function(set) {
                // Change selected button color on click
                $('.setbtn').click(function() {
                    $('.setbtn.selected').removeClass('selected');
                    $(this).addClass('selected');
                });
                for (var i = 0; i < that.cardList.length; i++) {
                    if (that.cardList[i].set == set) {
                        // Replace card image
                        if (that.cardList[i].imageUrl) {
                            $('#imgResult').empty().append("<img id='searchImg' class='searchImg' src="+ that.cardList[i].imageUrl +" />");
                        } else {
                            $('#imgResult').empty().append("<i class='fa fa-frown-o fa-3x' aria-hidden='true'></i><p>No image available.</p>")
                        }
                        $('.results').empty();
                        that.showContent(i);
                    }
                }
            }
        }
    });