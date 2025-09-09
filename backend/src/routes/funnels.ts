import { Router } from 'express';
import { funnelsController } from '../controllers/funnelsController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', asyncHandler(funnelsController.getFunnels));
router.get('/:id', asyncHandler(funnelsController.getFunnelById));
router.get('/:id/analytics', asyncHandler(funnelsController.getFunnelAnalytics));
router.post('/', asyncHandler(funnelsController.createFunnel));
router.put('/:id', asyncHandler(funnelsController.updateFunnel));
router.delete('/:id', asyncHandler(funnelsController.deleteFunnel));

export default router;