const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    Questions: [
      {
        Name: {type: String},
        Question: {type: String},
        OptionalAnswers: {type: Array},
        // [
        //   {
        //     AnsOption: String,
        //     required: true,
        //   }
        // ],
        CorrectAnswer: {type: String},
        Explanation: {type: String}
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
