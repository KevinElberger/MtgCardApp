describe('deckBuilder', function() {
    // Load the module that contains the deckBuilder component
    beforeEach(module('deckBuilder'));

    describe('DeckBuilderController', function() {
        var scope, controller, $httpBackend;

        beforeEach(inject(function($rootScope, $componentController, _$httpBackend_) {
            scope = $rootScope.$new();
            controller = $componentController('deckBuilder');
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

        it('should display card name & quantity in mainboard when add card button is pressed & board is true', function() {
            scope.quantity = 2;
            scope.board = true;
            controller.addCard("lava axe", scope.quantity, scope.board);
            $httpBackend.flush();
            expect(controller.mainBoard).toBe('2x lava axe\r\n');
        });

        it('should display card name & quantity in sideboard when add card button is pressed & board is false', function() {
            scope.quantity = 2;
            scope.board = false;
            controller.addCard("lava axe", scope.quantity, scope.board);
            $httpBackend.flush();
            expect(controller.sideBoard).toBe('2x lava axe\r\n');
        });

        it('should save a text file with deck notes, boards & format when save deck button is pressed', function() {
            scope.format = "Standard";
            scope.mainBoard = "2x lava axe";
            scope.sideBoard = "2x air elemental";
            scope.notes = "hello world";
            controller.saveDeck(scope.format, scope.mainBoard, scope.sideBoard, scope.notes);
            expect(controller.textDeck).not.toBe(null);
        });
        
        it('should compute the number of cards in the deck & average mana cost', function() {
            scope.quantity = 2;
            scope.board = false;
            controller.addCard("lava axe", scope.quantity, scope.board);
            $httpBackend.flush();
            controller.stats();
            expect(controller.average).toEqual(5);
        });
    });
});