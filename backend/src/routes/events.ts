import { Router } from 'express';
import { eventsController } from '../controllers/eventsController';
import { optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.post('/', optionalAuth, asyncHandler(eventsController.createEvent));
router.get('/', asyncHandler(eventsController.getEvents));
router.get('/analytics', asyncHandler(eventsController.getEventAnalytics));
router.get('/:id', asyncHandler(eventsController.getEventById));

export default router;