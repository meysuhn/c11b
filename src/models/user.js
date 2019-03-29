
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // https://stackoverflow.com/questions/29320201/error-installing-bcrypt-with-npm

// _id (ObjectId) is auto-generated and so doesn't need to be declared in the model schema.

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: 'Please enter your first name',
    trim: true,
  },
  lastName: {
    type: String,
    required: 'Please enter your last name',
    trim: true,
  },
  emailAddress: {
    type: String,
    required: 'Please provide your email address', // enforces response to this field
    trim: true, // removes any whitespace from beginning and end of text input
    validate: { validator: validator.isEmail, message: 'You must enter a valid email address' },
    unique: 'Email already exists in database', // ensures email address does not already appear in the database.
  },
  password: {
    type: String,
    required: 'A password is required',
  },
});

// unique: true, // ensures email address does not already appear in the database.


// Method to Authenticate User
  // See https://teamtreehouse.com/library/authenticating-the-username-and-password
UserSchema.statics.authenticate = (email, password, callback) => {
    User.findOne({ emailAddress: email })
      .exec((err, user) => { // .exec executes the search and have a callback to process the results
          if (err) {
              return callback(err);
          } else if (!user) { // if email address don't exist then error
              err = new Error();
              err.message = 'User not found (no account matches that email address)';
              err.status = 401;
              return callback(err);
          }
          bcrypt.compare(password, user.password, (err, result) => { // compare supplied password with hashed version
            // 1st argument is user supplied password. 2nd argument is password stored in db.
              if (result === true) { // compare method simply returns true if there's a match, and false if not.
                return callback(null, user); // return the authorised user back to middlware
                  // null represents an error value. Node's standard pattern for callbackas is (error, argument1, argument 2 etc)
                  // As there's no error in this case we pass null to that parameter.
              }
              return callback();
          });
      });
};

// Hash password before saving (using pre save) to db.
// Below not written with arrow functions as they mess with 'this' context:
  // https://stackoverflow.com/questions/33774472/mongoose-pre-save-is-using-incorrect-this-context
UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});


// 'const User' holds the model defined above.
// ('name of the model', the schema that defines it (i.e. the UserSchema declared in the above constructor))
// Mongoose will pluralise the name 'User' to 'Users', which will map to a 'Users' collection in the mongodb database.
const User = mongoose.model('User', UserSchema);
module.exports = User;
