describe('cardSearch', function() {
    //Load the module that has the cardSearch component
    beforeEach(module('cardSearch'));

    describe('CardSearchController', function() {
        var $scope, controller, $httpBackend;

        beforeEach(inject(function($rootScope, $componentController, _$httpBackend_) {
            $scope = $rootScope.$new();
            controller = $componentController("cardSearch");
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('https://api.magicthegathering.io/v1/cards?name="lava axe"')
                .respond({"cards":[{"name":"Lava Axe","manaCost":"{4}{R}","cmc":5,"colors":["Red"],
                    "type":"Sorcery","types":["Sorcery"],"rarity":"Common","set":"POR","setName":"Portal"}]});
        }));

        it('should return an array of card objects using the search function', function() {
            controller.search("lava axe");
            $httpBackend.flush();
            expect(controller.cardList[0].name).toBe("Lava Axe");
        });
    });
});