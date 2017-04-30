import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import planRoutes from './plan.route';
import testRoutes from './test.route';
import subscriptionRoutes from './subscription.route';
import optionRoutes from './option.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount auth routes at /plans
router.use('/plans', planRoutes);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount subscriptions routes at /subscriptions
router.use('/subscriptions', subscriptionRoutes);

// mount subscriptions routes at /options
router.use('/options', optionRoutes);

// mount test routes at /test
router.use('/test', testRoutes);

export default router;
