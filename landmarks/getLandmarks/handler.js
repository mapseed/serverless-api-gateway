'use strict';

var lib = require('../lib')

module.exports.handler = function(event, context, cb) {
  // Example event object in event.json
  var queryParams = event.queryParams.replace(/[{}]/g, '').split(',')
  for (var i = 0; i < queryParams.length; i++) {
    queryParams[i] = queryParams[i].trim().slice(0,-1)
  }
  lib.getLandmarks(queryParams, cb)

  // To access query params with serverless-serve,
  // we should instead use the code below:
  // (at least until this issue is resolved:
  // https://github.com/Nopik/serverless-serve/issues/4)
  // lib.getLandmarks(Object.keys(event), cb)
};
