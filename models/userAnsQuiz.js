const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserAnsQuizSchema = new mongoose.Schema(
  {
    quizID: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    UserAns: {
      type: Array,
    },
    TotalCorrectAns: {
      type: Number,
    },
    TotalCorrectPersentage: {
      type: Number,
    }
  },
  {
    timestamps: true,
  },
);

const UserAnsQuiz = mongoose.model('UserAnsQuiz', UserAnsQuizSchema);

module.exports = UserAnsQuiz;
