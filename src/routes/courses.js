
const express = require('express');
const User = require('../models/user');
const Course = require('../models/course');
const mid = require('../middleware');

const router = express.Router();



// GET /api/courses 200
  // Returns the Course "_id" and "title" properties
router.get('/', (req, res, next) => {
  Course.find({}, 'course_id title', (err, courses) => {
    // This one I need to come back to
    if (err) {
      err.status = 400; // 400 Bad Request response status code indicates that the server could not understand the request due to invalid syntax.
      return next(err);
    } // else (no longer needs to be stated)

    return res.status(200).json(courses);
  }).populate('user', ['firstName', 'lastName']); // Deep Population: Include matched user but return only the user properties stated in the array.
});



// GET /api/course/:courseId 200
  // Returns all Course properties and related documents for the provided course ID
  // populate returns related documents, not only the ids.
router.get('/:courseId', (req, res, next) => {

  Course.findById(req.params.courseId)
    .populate('user', ['firstName', 'lastName']) // Deep Population: Include matched user but return only the user properties stated in the array.
    .exec((err, course) => { // find course by id (using Express's params)

    if (err) {
      err.status = 400;
      return next(err);
    }

  return res.status(200).json(course);
  });
});


// POST /api/courses 201
  // Creates a course, sets the Location header, and returns no content
router.post('/', mid.requiresLogin, (req, res, next) => {
  req.body.user = res.locals.user._id; // add authorised user id to new course body
  Course.create(req.body, (err) => {
    if (err) {
      err.status = 400; // will fire if Mongoose validation fails, passing to Express Global Error Handler
      return next(err);
    }
  return res.status(201).location('/').json(); // Returns no content
  });
});


// Updates (edits) a course and returns no content
// PUT /api/courses/:courseId 204
router.put('/:courseId', mid.requiresLogin, (req, res, next) => {
  Course.findByIdAndUpdate(req.params.courseId, req.body, (err) => {
    if (err) {
      err.status = 400;
      return next(err);
    }
    return res.status(204).json();
  });
});



// Delete Course
router.delete('/:courseId', (req, res, next) => {
  console.log(req.params.courseId); // this is the course id
  console.log(req.AuthorisedUser);
  // how to the get the current logged in users id?
  // Course.findByIdAndRemove(req.params.courseId, (err) => {
  //   if (err) {
  //     err.status = 400;
  //     return next(err);
  //   }
  // return res.status(202).json();
  // });
});


module.exports = router;
