import { Router } from 'express';
import { KeywordsController } from '../controllers/keywords.controller';

const router = Router();
const keywordsController = new KeywordsController();

// Get recently used keywords across all funnel steps
router.get('/recent', keywordsController.getRecentKeywords);

// Get all keywords for a specific funnel step
router.get('/funnel-steps/:stepId/keywords', keywordsController.getStepKeywords);

// Add a keyword to a funnel step
router.post('/funnel-steps/:stepId/keywords', keywordsController.addKeyword);

// Remove a keyword from a funnel step
router.delete('/funnel-steps/:stepId/keywords/:keyword', keywordsController.removeKeyword);

// Get keyword suggestions based on step type and query
router.get('/suggestions', keywordsController.getKeywordSuggestions);

// Get keyword performance analytics
router.get('/analytics/performance', keywordsController.getKeywordPerformance);

export default router;