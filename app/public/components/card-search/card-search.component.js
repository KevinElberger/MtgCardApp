angular.module('cardSearch').
    component('cardSearch', {
        templateUrl: 'components/card-search/card-search.template.html',
        controller:  function CardSearchController($scope, mtgAPIservice) {
            this.cardList = [];
            this.card = "";
            this.hideBar = 'hidden'; // hides progress bar until search
            this.hidden = 'hidden'; // hides results until search
            var that = this;


            this.search = function() {
                this.hideBar = '';
                this.bar = "width: 80%;";
                this.card = $scope.cardName; // Obtain query param from input
                mtgAPIservice.getCards(this.card).then(function(response) {
                    // Obtain relevant data from response
                    that.cardList = response.data.cards;
                });
                setTimeout(function() {
                    that.hideBar = 'hidden';
                    that.well = 'well';
                    that.hidden = '';
                }, 300);
            }
        }
    });