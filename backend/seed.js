import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Course from './models/Course.js';
import { loadAllCourses, resolvePrerequisites } from './utils/contentLoader.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Course.deleteMany();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    });

    const user = await User.create({
      name: 'Archana',
      email: 'archana@example.com',
      password: 'password123',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      streak: 3
    });

    const raw = loadAllCourses();
    const courses = await Course.insertMany(raw.map((c) => ({ ...c, instructorId: admin._id })));

    // Link prerequisites (listed by title in each content file)
    for (const c of raw) {
      const doc = courses.find((x) => x.title === c.title);
      const { prerequisites } = resolvePrerequisites(c, (t) => courses.find((x) => x.title === t)?._id);
      if (prerequisites.length) await Course.updateOne({ _id: doc._id }, { prerequisites });
    }
    const byTitle = (t) => courses.find((c) => c.title === t);

    // Sample progress for the demo student
    const ml = byTitle('Introduction to Machine Learning');
    const dsa = byTitle('Data Structures & Algorithms');
    const enrollments = [];

    if (ml) {
      const done = ml.lessons.slice(0, 2);
      enrollments.push({
        course: ml._id,
        completedLessons: done.map((l) => l._id),
        progress: Math.round((done.length / ml.lessons.length) * 100)
      });
    }
    if (dsa) {
      enrollments.push({
        course: dsa._id,
        completedLessons: dsa.lessons.map((l) => l._id),
        progress: 100,
        completed: true,
        completedAt: new Date()
      });
    }
    user.enrolledCourses = enrollments;
    await user.save();

    const lessonCount = courses.reduce((n, c) => n + c.lessons.length, 0);
    console.log(`Database seeded successfully! ${courses.length} courses, ${lessonCount} lessons.`);
    console.log('\nTest Credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: archana@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
