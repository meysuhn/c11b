const mongoose = require('mongoose');

// _id (ObjectId) is auto-generated and so doesn't need to be declared in the model schema.

const CourseSchema = new mongoose.Schema({
  user: { // _id from the users collection
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: 'A course title must be provided',
    trim: true,
    minlength: 1,
    unique: 'Course title already exists. Please choose a unique title.', // ensures email address does not already appear in the database.
  },
  description: {
    type: String,
    required: 'Please provide a course description',
    trim: true,
    minlength: [1, 'Course description must not be blank.'],
  },
  estimatedTime: {
    type: String,
    trim: true,
  },
  materialsNeeded: {
    type: String,
    trim: true,
  },
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
