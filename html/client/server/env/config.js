'use strict';

var _ = require('lodash');

/**
 * Load environment configuration
 */
module.exports = _.merge(
    require('./all.js'),
    require('./' + process.env.NODE_ENV + '.js') || {});