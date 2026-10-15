import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  enrolledCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  quizResults: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    completedAt: { type: Date, default: Date.now }
  }],
  careerGoal: {
    type: String,
    enum: ['None', 'Full Stack Developer', 'Data Scientist', 'AI/ML Engineer'],
    default: 'None'
  },
  skillsInterest: [{
    type: String
  }]
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getAverageScore = function() {
  if (this.quizResults.length === 0) return 0;
  const total = this.quizResults.reduce((acc, r) => acc + r.percentage, 0);
  return Math.round(total / this.quizResults.length);
};

userSchema.methods.getCompletedCoursesCount = function() {
  return this.enrolledCourses.filter(e => e.completed).length;
};

export default mongoose.model('User', userSchema);
