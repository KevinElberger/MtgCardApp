angular.module('cardSearch').
    component('cardSearch', {
        templateUrl: 'components/card-search/card-search.template.html',
        controller:  function CardSearchController($scope, mtgAPIservice) {
            this.cardList = [];
            this.card = '';
            this.hideBar = 'hidden'; // hides progress bar until search
            this.hidden = 'hidden'; // hides results until search
            this.token = '';
            this.price = [0,0,0]; // high, low, mid
            var that = this;

            this.search = function(name) {
                this.hideBar = '';
                this.bar = "width: 80%;";
                mtgAPIservice.getCards(name).then(function(response) {
                    // Obtain relevant data from response
                    that.cardList = response.data.cards;
                });
                setTimeout(function() {
                    that.hideBar = 'hidden';
                    that.well = 'well';
                    that.hidden = '';
                }, 300);

                mtgAPIservice.getToken().then(function(response) {
                    that.token = response;

                    mtgAPIservice.getPrice(that.cardList[0].multiverseid, that.token).then(function(response) {
                        that.price[0] = response.data.card.tcg_high;
                        that.price[1] = response.data.card.tcg_low;
                        that.price[2] = response.data.card.tcg_mid;
                        console.log(that.price);
                    });
                });
            };
        }
    });