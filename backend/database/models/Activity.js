import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true,
      maxlength: [100, 'Activity name cannot exceed 100 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [1440, 'Duration cannot exceed 24 hours (1440 minutes)'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Work', 'Study', 'Exercise', 'Break', 'Other'],
        message: '{VALUE} is not a valid category',
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ userId: 1, category: 1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
