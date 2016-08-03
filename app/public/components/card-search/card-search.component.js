angular.module('cardSearch').
    component('cardSearch', {
        templateUrl: 'components/card-search/card-search.template.html',
        controller:  function CardSearchController($scope, mtgAPIservice) {
            this.cardList = [];
            this.hidden = 'hidden';
            this.token = '';
            this.clicked = 0;
            this.price = [0,0,0]; // high, low, mid
            var that = this;

            this.search = function(name) {
                that.clicked++;
                mtgAPIservice.getCards(name).then(function(response) {
                    // Obtain relevant data from response
                    that.cardList = response.data.cards;

                    mtgAPIservice.getToken().then(function(response) {
                        that.token = response;

                        mtgAPIservice.getPrice(that.cardList[0].multiverseid, that.token).then(function(response) {
                            that.price[0] = response.data.card.tcg_high;
                            that.price[1] = response.data.card.tcg_low;
                            that.price[2] = response.data.card.tcg_mid;

                            // Append card stats to results div
                            $('.results').empty().append(
                                "<p><strong>Name: </strong>" + that.cardList[0].name + " </p>" +
                                "<p><strong>Artist: </strong>" + that.cardList[0].artist + "</p>" +
                                "<p><strong>Rarity: </strong>" + that.cardList[0].rarity + "</p>" +
                                "<p><strong>P/T: </strong>" + that.cardList[0].power + " / " + that.cardList[0].toughness + "</p>" +
                                "<p><strong>Card Text: </strong>" + that.cardList[0].text + "</p>" +
                                "<p><strong>Flavor: </strong><em>" + that.cardList[0].flavor + "</em></p>");

                            // Append line chart with item prices
                            var sImg = document.getElementById('searchImg');
                            sImg.classList.remove('hidden');
                            $('.canvasWrapper').empty().append('<label>Price</label><canvas id="line" width="450" height="450"></canvas>');
                            var ctx = document.getElementById('line').getContext('2d');
                            var myLineChart = new Chart(ctx, {
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
                        });
                    });
                });
            };
        }
    });