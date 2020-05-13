const mongoose = require('mongoose');

const { Schema } = mongoose;

const TrainingSchema = new mongoose.Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    trainerName: {
      type: String,
    },
    trainingDate: {
      type: Date,
      default: Date.now(),
    },
    topic: {
      type: String,
    },
    type: {
      type: String,
      enum: ['ONLINE', 'OFFLINE'],
      default: 'OFFLINE',
    },
    status: {
      type: String,
      enum: ['REQUESTED', 'CONFIRMED', 'ONHOLD', 'COMPLETED'],
      default: 'REQUESTED',
    },
    attendees: [
      {
        name: String,
        position: String,
        department: String,
        feedback: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Training = mongoose.model('Training', TrainingSchema);

module.exports = Training;
