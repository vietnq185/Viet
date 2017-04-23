import express from 'express';
import validate from 'express-validation';

import paramValidation from '../../config/param-validation';
import * as authCtrl from '../controllers/auth.controller';
import * as userCtrl from '../controllers/user.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(authCtrl.verifyAccessToken, authCtrl.adminOrEditorAuth, userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(authCtrl.verifyAccessToken, userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), authCtrl.verifyAccessToken, userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(authCtrl.verifyAccessToken, userCtrl.remove);

router.route('/cclist/:userId')
  /** GET /api/users/cclist/:userId - Get cclist of user */
  .get(authCtrl.verifyAccessToken, userCtrl.cclist);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);  // router.param accepts only tow params, so that do no put authCtrl.verifyAccessToken here

router.route('/linkStudent')
  /** POST /api/users/linkStudent - Link a student account to current logged-in parent */
  .post(validate(paramValidation.linkStudent), authCtrl.verifyAccessToken, userCtrl.linkStudent);

export default router;
