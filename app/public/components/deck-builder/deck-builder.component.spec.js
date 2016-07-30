describe('deckBuilder', function() {
    // Load the module that contains the deckBuilder component
    beforeEach(module('mtgCardApp'));

    describe('DeckBuilderController', function() {
        var $scope, controller, $httpBackend;

        beforeEach(inject(function($rootScope, $componentController, _$httpBackend_) {
            $scope = $rootScope.$new();
            controller = $componentController('deckBuilder');
            $httpBackend = _$httpBackend_;
        }));

        
    });
});