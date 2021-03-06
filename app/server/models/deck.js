// deck model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Base Deck Schema
var DeckSchema = new Schema({
    owner: String,
    name: String,
    format: String,
    description: String,
    cardList: [String],
    colors: [String],
    sideboard: [String]
});

var DeckModel = mongoose.model('decks', DeckSchema);

// Create deck model for user.
exports.create = function (req, res) {
    var deck;

    deck = new DeckModel({
        owner: req.body.user,
        name: req.body.name,
        format: req.body.format,
        description: req.body.description,
        cardList: req.body.cards,
        colors: req.body.colors,
        sideboard: req.body.sideboard
    });
    deck.save(function(err) {
        if (!err) {
            console.log("created");
        } else {
            console.log(err);
        }
    });
    return res.send(deck);
};

// Find all decks created by user.
exports.find = function(req, res) {
    return DeckModel.find({'owner': req.params.name}, function(err, decks) {
        if (!err) {
            res.json(decks);
        } else {
            console.log(err);
        }
    });
};

// Edit deck selected via id.
exports.edit = function(req, res) {
    return DeckModel.findById(req.params.id, function(err, deck) {
        if(!err) {
            res.json(deck);
        } else {
            console.log(err);
        }
    });
};

exports.update = function(req, res) {
    return DeckModel.findById(req.params.id, function(err, deck) {
        deck.name = req.body.name;
        deck.format = req.body.format;
        deck.description = req.body.description;
        deck.cardList = req.body.cards;
        deck.colors = req.body.colors;
        deck.sideboard = req.body.sideboard;
        deck.save(function (err) {
            if(!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
        })
    })
};

// Delete selected deck created by user.
exports.delete = function(req, res) {
    return DeckModel.findById(req.params.id, function(err, deck) {
        return deck.remove(function(err) {
            if (!err) {
                console.log("removed");
                return res.send('');
            } else {
                console.log(err);
            }
        });
    });
};