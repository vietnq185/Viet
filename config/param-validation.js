import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8).max(50),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(), // optional
      password: Joi.string().min(8).max(50), // optional
      firstName: Joi.string(), // optional
      lastName: Joi.string(), // optional
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
  }
};
