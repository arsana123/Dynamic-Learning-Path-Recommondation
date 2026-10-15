import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }


    const avatarSeed = encodeURIComponent(email);
    
    const user = await User.create({
      name,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update streak
    const now = new Date();
    const lastActive = new Date(user.lastActive);
    const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      user.streak += 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
    user.lastActive = now;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      streak: user.streak,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses.course');
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      streak: user.streak,
      completedCourses: user.getCompletedCoursesCount(),
      averageScore: user.getAverageScore(),
      enrolledCourses: user.enrolledCourses,
      careerGoal: user.careerGoal || 'None',
      skillsInterest: user.skillsInterest || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, careerGoal, skillsInterest } = req.body;
    
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (careerGoal !== undefined) updates.careerGoal = careerGoal;
    if (skillsInterest !== undefined) updates.skillsInterest = skillsInterest;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).populate('enrolledCourses.course');

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      streak: user.streak,
      completedCourses: user.getCompletedCoursesCount(),
      averageScore: user.getAverageScore(),
      enrolledCourses: user.enrolledCourses,
      careerGoal: user.careerGoal || 'None',
      skillsInterest: user.skillsInterest || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
