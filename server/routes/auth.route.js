import express from 'express';
import validate from 'express-validation';

import paramValidation from '../../config/param-validation';
import * as authCtrl from '../controllers/auth.controller';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct email and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(authCtrl.verifyToken, authCtrl.getRandomNumber);

export default router;
