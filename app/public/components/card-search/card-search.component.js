angular.module('cardSearch').
    component('cardSearch', {
        templateUrl: 'components/card-search/card-search.template.html',
        controller: function CardSearchController($scope, mtgAPIservice) {
            $scope.cardList = [];
            $scope.card = "";
            $scope.hideBar = 'hidden'; // hides progress bar until search
            $scope.hidden = 'hidden'; // hides results until search

            $scope.cardList.search = function() {
                $scope.hideBar = '';
                $scope.bar = "width: 80%;";
                $scope.card = $scope.cardName; // Obtain query param from input
                mtgAPIservice.getCards($scope.card).then(function(response) {
                    // Obtain relevant data from response
                    $scope.cardList = response.data.cards;
                });
                setTimeout(function() {
                    $scope.hideBar = 'hidden';
                    $scope.well = 'well';
                    $scope.hidden = '';
                }, 300);
            }
        }
    });