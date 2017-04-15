import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8).max(50),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      // in case admin, editor or parent create a teacher or student,
      // the parentId field will refer to user field in user_roles table.
      parentId: Joi.string().guid(),
      status: Joi.array().items(Joi.string().valid('parent', 'student')), // optional
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(), // optional
      password: Joi.string().min(8).max(50), // optional
      firstName: Joi.string(), // optional
      lastName: Joi.string(), // optional
      // in case admin, editor or parent create a teacher or student,
      // the parentId field will refer to user field in user_roles table.
      parentId: Joi.string().guid(), // optional
      status: Joi.array().items(Joi.string().valid('parent', 'student')), // optional
    },
    params: {
      userId: Joi.string().guid().required(),
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required().email(),
      password: Joi.string().required().min(8).max(50),
    }
  },

  // Create subscription /api/subscriptions
  createSubscription: {
    body: {
      parentId: Joi.string().guid(), // optional
      planId: Joi.string().guid() // optional
    }
  }
};
