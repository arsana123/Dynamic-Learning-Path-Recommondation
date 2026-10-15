import Course from '../models/Course.js';
import User from '../models/User.js';

export const getCourses = async (req, res) => {
  try {
    const { difficulty, tags, search, status } = req.query;
    const query = {};

    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (status) query.status = status;
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (!req.user || req.user.role !== 'admin') {
      query.status = 'Published';
    }

    const courses = await Course.find(query)
      .select('-lessons.content -lessons.videoUrl -quizQuestions')
      .sort('-createdAt');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructorId: req.user._id
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);
    const alreadyEnrolled = user.enrolledCourses.find(
      e => e.course.toString() === req.params.id
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push({ course: course._id });
    await user.save();

    course.enrolledCount += 1;
    await course.save();

    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses.course');
    
    
    const enrolledTags = new Set();
    user.enrolledCourses.forEach(e => {
      if (e.course?.tags) {
        e.course.tags.forEach(tag => enrolledTags.add(tag));
      }
    });

    const enrolledIds = user.enrolledCourses.map(e => e.course?._id);

    let recommendations = await Course.find({
      _id: { $nin: enrolledIds },
      status: 'Published',
      tags: { $in: Array.from(enrolledTags) }
    }).limit(5);

    if (recommendations.length < 3) {
      const popular = await Course.find({
        _id: { $nin: [...enrolledIds, ...recommendations.map(r => r._id)] },
        status: 'Published'
      }).sort('-enrolledCount').limit(5 - recommendations.length);
      
      recommendations = [...recommendations, ...popular];
    }

    const withReasons = recommendations.map(course => ({
      ...course.toObject(),
      reason: enrolledTags.size > 0 && course.tags.some(t => enrolledTags.has(t))
        ? 'Based on your interests'
        : 'Popular among learners'
    }));

    res.json(withReasons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
