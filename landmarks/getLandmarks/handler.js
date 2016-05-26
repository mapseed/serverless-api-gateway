'use strict';

var lib = require('../lib')

module.exports.handler = function(event, context, cb) {
  lib.getLandmarks(event, cb)
};
