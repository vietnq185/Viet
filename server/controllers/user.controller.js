import User from '../models/user.model';
import APIResponse from '../helpers/APIResponse';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(new APIResponse(req.user));
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.phone - The phone of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    username: req.body.username,
    phone: req.body.phone
  });

  user.save()
    .then(savedUser => res.json(new APIResponse(savedUser)))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.phone - The phone of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.phone = req.body.phone;

  user.save()
    .then(savedUser => res.json(new APIResponse(savedUser)))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @property {number} req.query.offset - Position to fetch data.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, offset = 0 } = req.query;
  User.list({ limit, offset })
    .then(users => res.json(new APIResponse(users)))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(new APIResponse(deletedUser)))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
