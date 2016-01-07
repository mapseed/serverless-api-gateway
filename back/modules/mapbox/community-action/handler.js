'use strict';

/**
 * Serverless Module: Lambda Handler
 * - Your lambda functions should be a thin wrapper around your own separate
 * modules, to keep your code testable, reusable and AWS independent
 * - 'serverless-helpers-js' module is required for Serverless ENV var support.  Hopefully, AWS will add ENV support to Lambda soon :)
 */

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Require Logic
var lib = require('../lib');

// Lambda Handler
// https://t9t3m4dora.execute-api.us-west-2.amazonaws.com/development/greetings/hello
module.exports.handler = function(event, context) {
  event['url'] = process.env['MAPBOX_COMMUNITY_URL']
  lib.getMapboxWithTitle(event, function(error, response) {
    return context.done(error, response);
  });
};
