import express from 'express';
import validate from 'express-validation';

import APIResponse from '../helpers/APIResponse';

import paramValidation from '../../config/param-validation';
import * as authCtrl from '../controllers/auth.controller';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct email and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** GET /api/auth/token - Send refresh token to renew access token */
router.route('/logout')
  .get(authCtrl.verifyAccessToken, authCtrl.logout);

/** GET /api/auth/token - Send refresh token to renew access token */
router.route('/token')
  .get(authCtrl.verifyRefreshToken, authCtrl.renewAccessToken);

/** GET /api/auth/checkToken - Send access token to check if it is valid and not expired */
router.route('/checkToken')
  .get(authCtrl.verifyAccessToken, (req, res) => res.json(new APIResponse('OK')));

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(authCtrl.verifyAccessToken, authCtrl.getRandomNumber);

/** GET /api/auth/getOptionPairs - get public options */
router.route('/getOptionPairs')
  .get(authCtrl.getOptionPairs);

export default router;
