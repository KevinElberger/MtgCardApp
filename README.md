# Card Constructor

A web application for building Magic The Gathering decks and looking up pricing information about specific cards.

## Installation

###Pre-Requisites

Before running a local copy, you will need to install:
*[NodeJS](https://www.nodejs.org)
*[MongoDB](https://www.mongodb.com)
*[MongooseJS](https://www.mongoosejs.com)


To run a local version, first clone the repository:
`git clone http://github.com/KevinElberger/MTGCardApp.git`

Next, install the packages needed to run the application (must have Node installed)
`npm install`

After the packages are downloaded, navigate to the server directory
`MTGCardApp --> App --> Server`

Finally, run the server using the command
`node app.js`

To run a local server at `localhost:27017`

## Troubleshooting

If you cannot login or register a user, you must check to see if
you have a running instance of MongoDB open. 

## Technologies Used

 * AngularJS - Front-end
 * Bootstrap - Styling
 * MagicTheGathering.io API - Card data
 * EchoMTG API - Card pricing
 * Passport - Authentication
 * FontAwesome - Icons
 * MongooseJS / MongoDB - Back-end