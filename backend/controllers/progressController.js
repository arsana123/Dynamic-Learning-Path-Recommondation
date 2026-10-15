import User from '../models/User.js';
import DailyActivity from '../models/Progress.js';
import Course from '../models/Course.js';

export const completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    
    const user = await User.findById(req.user._id);
    const enrollment = user.enrolledCourses.find(e => e.course.toString() === courseId);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      
      const course = await Course.findById(courseId);
      enrollment.progress = Math.round((enrollment.completedLessons.length / course.lessons.length) * 100);
      
      if (enrollment.progress === 100) {
        enrollment.completed = true;
        enrollment.completedAt = new Date();
      }
      
      await user.save();

      // Track daily activity
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await DailyActivity.findOneAndUpdate(
        { user: req.user._id, date: today },
        {
          $inc: { lessonsCompleted: 1, hoursSpent: 0.5 },
          $set: { coursesCompleted: enrollment.progress === 100 ? 1 : 0 }
        },
        { upsert: true }
      );
    }

    res.json({ message: 'Lesson completed', progress: enrollment.progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { courseId, answers } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let correctAnswers = 0;
    course.quizQuestions.forEach((q, index) => {
      if (answers[q._id] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = Math.round((correctAnswers / course.quizQuestions.length) * 100);

    const user = await User.findById(req.user._id);
    user.quizResults.push({
      course: courseId,
      score: correctAnswers,
      totalQuestions: course.quizQuestions.length,
      percentage
    });
    await user.save();

    res.json({
      score: correctAnswers,
      total: course.quizQuestions.length,
      percentage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses.course');
    
    const inProgress = user.enrolledCourses.filter(e => !e.completed && e.completedLessons.length > 0);
    const completed = user.enrolledCourses.filter(e => e.completed);

    res.json({
      inProgress,
      completed,
      totalCourses: user.enrolledCourses.length,
      completedCount: completed.length,
      averageScore: user.getAverageScore()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWeeklyActivity = async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const activities = await DailyActivity.find({
      user: req.user._id,
      date: { $gte: weekAgo, $lte: today }
    }).sort('date');

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
