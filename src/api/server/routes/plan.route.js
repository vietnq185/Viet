import express from 'express';

import * as planCtrl from '../controllers/plan.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/plans - Get list of plans */
  .get(planCtrl.list);

export default router;
