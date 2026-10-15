import express from 'express';
import {
  completeLesson,
  submitQuiz,
  getProgress,
  getWeeklyActivity
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/lesson/complete', protect, completeLesson);
router.post('/quiz/submit', protect, submitQuiz);
router.get('/', protect, getProgress);
router.get('/weekly', protect, getWeeklyActivity);

export default router;
