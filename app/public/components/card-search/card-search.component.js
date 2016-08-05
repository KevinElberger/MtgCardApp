angular.module('cardSearch').
    component('cardSearch', {
        templateUrl: 'components/card-search/card-search.template.html',
        controller:  function CardSearchController($scope, mtgAPIservice) {
            this.cardList = [];
            this.hidden = 'hidden';
            this.token = '';
            this.price = [0,0,0]; // high, low, mid
            var that = this;

            this.search = function(name, set) {
                $('.results').empty();
                mtgAPIservice.getCards(name).then(function(response) {
                    // Obtain relevant data from response
                    that.cardList = response.data.cards;
                    console.log(that.cardList);
                    mtgAPIservice.getToken().then(function(response) {
                        that.token = response;

                        mtgAPIservice.getPrice(that.cardList[0].multiverseid, that.token).then(function(response) {
                            that.price[0] = response.data.card.tcg_high;
                            that.price[1] = response.data.card.tcg_low;
                            that.price[2] = response.data.card.tcg_mid;

                            // Append card stats to results div
                            if (that.cardList[0].power !== undefined && that.cardList[0].toughness !== undefined) {
                                $("<div style='display: none;'><p><strong>Name: </strong>" + that.cardList[0].name + " </p>" +
                                    "<p><strong>Artist: </strong>" + that.cardList[0].artist + "</p>" +
                                    "<p><strong>Rarity: </strong>" + that.cardList[0].rarity + "</p>" +
                                    "<p><strong>P/T: </strong>" + that.cardList[0].power + " / " + that.cardList[0].toughness + "</p>" +
                                    "<p><strong>Card Text: </strong>" + that.cardList[0].text + "</p>" +
                                    "<p><strong>Flavor: </strong><em>" + that.cardList[0].flavor + "</em></p></div>").appendTo($('.results')).slideDown('slow');
                            } else {
                                $("<div style='display: none;'><p><strong>Name: </strong>" + that.cardList[0].name + " </p>" +
                                    "<p><strong>Artist: </strong>" + that.cardList[0].artist + "</p>" +
                                    "<p><strong>Rarity: </strong>" + that.cardList[0].rarity + "</p>" +
                                    "<p><strong>P/T: </strong> / </p>" +
                                    "<p><strong>Card Text: </strong>" + that.cardList[0].text + "</p>" +
                                    "<p><strong>Flavor: </strong><em>" + that.cardList[0].flavor + "</em></p></div>").appendTo($('.results')).slideDown('slow');
                            }

                            // Append line chart with item prices
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
                            // Display card image & set display
                            var set = document.getElementById('setTitle');
                            set.classList.remove('hidden');
                            var sImg = document.getElementById('searchImg');
                            sImg.classList.remove('hidden');
                        });
                    });
                });
            };

            this.update = function(set) {
                $('.setbtn').click(function() {
                    $('.setbtn.selected').removeClass('selected');
                   $(this).addClass('selected');
                });
                for (var i = 0; i < that.cardList.length; i++) {
                    if (that.cardList[i].set == set) {
                        // Replace card image
                        $('#imgResult').empty().append("<img id='searchImg' class='searchImg' src="+ that.cardList[i].imageUrl +" />");
                        $('.results').empty();
                        if (that.cardList[i].power !== undefined && that.cardList[i].toughness !== undefined) {
                            $("<div style='display: none;'><p><strong>Name: </strong>" + that.cardList[i].name + " </p>" +
                                "<p><strong>Artist: </strong>" + that.cardList[i].artist + "</p>" +
                                "<p><strong>Rarity: </strong>" + that.cardList[i].rarity + "</p>" +
                                "<p><strong>P/T: </strong>" + that.cardList[i].power + " / " + that.cardList[i].toughness + "</p>" +
                                "<p><strong>Card Text: </strong>" + that.cardList[i].text + "</p>" +
                                "<p><strong>Flavor: </strong><em>" + that.cardList[i].flavor + "</em></p></div>").appendTo($('.results')).slideDown('slow');
                        } else {
                            $("<div style='display: none;'><p><strong>Name: </strong>" + that.cardList[i].name + " </p>" +
                                "<p><strong>Artist: </strong>" + that.cardList[i].artist + "</p>" +
                                "<p><strong>Rarity: </strong>" + that.cardList[i].rarity + "</p>" +
                                "<p><strong>P/T: </strong> / </p>" +
                                "<p><strong>Card Text: </strong>" + that.cardList[i].text + "</p>" +
                                "<p><strong>Flavor: </strong><em>" + that.cardList[i].flavor + "</em></p></div>").appendTo($('.results')).slideDown('slow');
                        }
                    }
                }
            }
        }
    });