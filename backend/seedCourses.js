// Adds or updates all courses from /content WITHOUT touching users or their progress.
// Usage:  npm run seed:courses
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Course from './models/Course.js';
import User from './models/User.js';
import { loadAllCourses, resolvePrerequisites } from './utils/contentLoader.js';

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    const admin = await User.findOne({ role: 'admin' });
    let added = 0;
    let updated = 0;

    const all = loadAllCourses();
    for (const data of all) {
      const existing = await Course.findOne({ title: data.title });
      if (!existing) {
        await Course.create({ ...data, instructorId: admin?._id });
        added++;
        continue;
      }

      // Keep lesson _ids stable for lessons that already exist (so student progress isn't lost)
      const lessons = data.lessons.map((l) => {
        const old = existing.lessons.find((x) => x.order === l.order && x.title === l.title);
        return old ? { ...l, _id: old._id } : l;
      });
      existing.set({ ...data, lessons, enrolledCount: existing.enrolledCount || data.enrolledCount });
      await existing.save();
      updated++;
    }

    // Link prerequisites (by title) now that every course exists
    const saved = await Course.find({}, '_id title');
    for (const data of all) {
      const { prerequisites } = resolvePrerequisites(data, (t) => saved.find((x) => x.title === t)?._id);
      if (prerequisites.length) await Course.updateOne({ title: data.title }, { prerequisites });
    }

    console.log(`Done. Added ${added} new course(s), updated ${updated} existing course(s).`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

run();
