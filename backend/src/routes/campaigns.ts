import { Router } from 'express';
import { campaignsController } from '../controllers/campaignsController';
import { asyncHandler } from '../middleware/errorHandler';
import { campaignsService } from '../services/campaignsService';

const router = Router();

router.get('/', asyncHandler(campaignsController.getCampaigns));
router.get('/goals', asyncHandler(async (req: any, res: any) => {
  const goals = await campaignsService.getCampaignGoals();
  res.json({
    success: true,
    data: goals
  });
}));
router.get('/:id', asyncHandler(campaignsController.getCampaignById));
router.post('/', asyncHandler(campaignsController.createCampaign));
router.put('/:id', asyncHandler(campaignsController.updateCampaign));
router.delete('/:id', asyncHandler(campaignsController.deleteCampaign));

export default router;