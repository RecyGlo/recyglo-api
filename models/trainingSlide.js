const mongoose = require('mongoose');

const { Schema } = mongoose;

const TrainingSlideSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    quizID: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    Description: {
      type: String,
    },
    Name: {
      type: String,
    },
    Slides: {
      type: Array,
    },
    Reference: {
      type: Array,
    }
  },
  {
    timestamps: true,
  },
);

const TrainingSlide = mongoose.model('TrainingSlide', TrainingSlideSchema);

module.exports = TrainingSlide;
