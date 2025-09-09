import { Router } from 'express';
import channelsRouter from './channels';
import campaignsRouter from './campaigns';
import eventsRouter from './events';
import funnelsRouter from './funnels';

const router = Router();

router.use('/channels', channelsRouter);
router.use('/campaigns', campaignsRouter);
router.use('/events', eventsRouter);
router.use('/funnels', funnelsRouter);

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Click Engine API v1',
    version: '1.0.0',
    endpoints: [
      '/channels - Marketing channels management',
      '/campaigns - Campaign management',
      '/events - User event tracking',
      '/funnels - Conversion funnel analytics'
    ]
  });
});

export default router;