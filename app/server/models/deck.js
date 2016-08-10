// deck model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// To Be Continued, Deck for each User.
var DeckSchema = new Schema({
    _owner: {type: Schema.ObjectId, ref: 'User'},
    name: String,
    format: String,
    description: String,
    cardList: String
});

var DeckModel = mongoose.model('decks', DeckSchema);
exports.create = function (req, res) {
    var deck;

    deck = new DeckModel({
        name: req.body.name,
        format: req.body.format,
        description: req.body.description,
        // cardList. req.
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