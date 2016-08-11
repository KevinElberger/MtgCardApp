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
    img: String
});

var DeckModel = mongoose.model('decks', DeckSchema);
exports.create = function (req, res) {
    var deck;

    deck = new DeckModel({
        owner: req.body.user,
        name: req.body.name,
        format: req.body.format,
        description: req.body.description,
        cardList: [req.body.cards],
        colors: req.body.colors,
        img: req.body.img
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

exports.find = function(req, res) {
    return DeckModel.find({'owner': req.params.name}, function(err, decks) {
        if (!err) {
            res.json(decks);
        } else {
            console.log(err);
        }
    });
};