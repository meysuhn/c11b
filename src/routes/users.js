
const express = require('express');
const User = require('../models/user');
const Course = require('../models/course');
const mid = require('../middleware');

const router = express.Router();

// GET /api/users 200
  // Returns the currently authenticated user
router.get('/', mid.requiresLogin, (req, res) => { // Passes request to middleware's requiresLogin function
  res.status(200).json(res.req.AuthorisedUser); // return the authorised user as json to the client
});


// POST /api/users 201
  // Creates a user, sets the Location header to "/", and returns no content
router.post('/', (req, res, next) => {
  User.findOne({ emailAddress: req.body.emailAddress }).exec((err, user) => {
    if (user) { // if there's an email match then error. No duplicates allowed.
      err = new Error();
      err.message = 'Email already exists in database';
      err.status = 400; // this status gets through.
      next(err);
    } else {
    User.create(req.body, (err, user) => {
      console.log("hi"); //this part is OK.
      if (user) {// If a user has been created
        if (!user.emailAddress || !user.firstName || !user.lastName || !user.password) {
          // if any fields missing then reject.
          err = new Error();
          err.status = 400; // this error status does not get added.
          return next(err);
        }
        if (err) { // Any others errors pathway
          console.log("fired");
          return next(err);
        }
        return res.status(201).location('/').json();
    } else {
      console.log("whatev");
      return next(err);
    };
    });
  }
  }); // Don't put return next() to satisfy 'consistent-return' rule. It will break route.
});

// ///////////////////////////////
// Extra routes (i.e. Not in the Challenge requirmenets)
// ///////////////////////////////

// Delete User
router.delete('/:userId', (req, res, next) => {
  User.findByIdAndRemove(req.params.userId, (err) => {
    console.log(req.params);
    if (err) {
      err.status = 400;
      return next(err);
    }
  return res.status(202).json();
  });
});

// ///////////////////////////////
// Dummy Function
// ///////////////////////////////
// const chrisOK = function () {
//   return 1;
// };

function checkForShip (player, coordinates) {
	var shipPresent, ship;

	for (var i = 0; i < player.ships.length; i++) {
		ship = player.ships[i];

		shipPresent = ship.locations.filter(function (actualCoordinate) {
			return (actualCoordinate[0] === coordinates[0]) && (actualCoordinate[1] === coordinates[1]);
		})[0];

		if (shipPresent) {
			return ship;
		}
	}

	return false;
}

module.exports.checkForShip = checkForShip;
// module.exports.chrisOK = chrisOK;
module.exports = router;
