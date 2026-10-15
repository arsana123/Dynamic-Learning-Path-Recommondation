import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getRecommendations
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/recommendations', protect, getRecommendations);
router.get('/:id', getCourse);
router.post('/', protect, authorize('admin', 'instructor'), createCourse);
router.put('/:id', protect, authorize('admin', 'instructor'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.post('/:id/enroll', protect, enrollCourse);

export default router;
