import { Router } from 'express';
import { channelsController } from '../controllers/channelsController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', asyncHandler(channelsController.getChannels));
router.get('/:id', asyncHandler(channelsController.getChannelById));
router.post('/', asyncHandler(channelsController.createChannel));
router.put('/:id', asyncHandler(channelsController.updateChannel));
router.delete('/:id', asyncHandler(channelsController.deleteChannel));

export default router;