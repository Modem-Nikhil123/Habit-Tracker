import express from 'express';
import { protectRoute } from '../controllers/auth.js';
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getCalendarActivities,
  getAnalytics,
} from '../controllers/activityController.js';

const router = express.Router();


router.use(protectRoute);


router.get('/', getActivities);
router.post('/', createActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);


router.get('/calendar', getCalendarActivities);
router.get('/analytics', getAnalytics);

export default router;
