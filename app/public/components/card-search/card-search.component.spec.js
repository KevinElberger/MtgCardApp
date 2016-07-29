describe('component: cardSearch', function() {
    var $componentController;

    //Load the module that has the cardSearch component
    beforeEach(module('mtgCardApp'));
    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));

    describe('$scope.cardList', function() {
        var $scope, controller;

        beforeEach(function() {
           $scope = {};
            controller = $componentController('CardSearchController', {$scope: $scope});
        });

        it('should have an empty array for cards', function() {
            expect($scope.cardList.length).toBe(0);
        });
    });
});