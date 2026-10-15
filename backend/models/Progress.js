import mongoose from 'mongoose';

const dailyActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  hoursSpent: {
    type: Number,
    default: 0
  },
  lessonsCompleted: {
    type: Number,
    default: 0
  },
  coursesCompleted: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

dailyActivitySchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyActivity', dailyActivitySchema);
