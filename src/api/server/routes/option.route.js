import express from 'express';

import * as authCtrl from '../controllers/auth.controller';
import * as optionCtrl from '../controllers/option.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/options - Get list of options */
  .get(authCtrl.verifyAccessToken, authCtrl.adminAuth, optionCtrl.list)
  /** POST /api/users - Create new user */
  .post(authCtrl.verifyAccessToken, authCtrl.adminAuth, optionCtrl.update);

export default router;
