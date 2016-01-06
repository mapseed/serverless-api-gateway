/**
 * Lib
 */
var request = require('request')

module.exports.respond = function(event, cb) {

  var response = {
    message: "Your Serverless function ran successfully!"
  };



};


module.exports.getMapboxWithTitle = function(event, cb) {
  console.log("greetings/lib/index.js: event:", event);
  request({
    url: event.url,
    method: 'GET',
    json: true
  }, function (error, response, body) {
    if (error) {
      console.log("error: ", error)
      return cb("error: " + error, null);
    }
    if (response.statusCode >= 400) {
      console.log("status code >= 400: " + response.statusCode)
      return cb('status code: ' + response.statusCode, null);
    }
    // Let's process the body to transform the feature.properties.title into feature.title:
    var numberOfFeatures = body['features'].length;
    console.log("typeof(body):", typeof(body));
    console.log("numberOfFeatures:", numberOfFeatures);
    var i;
    for (i = 0; i < numberOfFeatures; i++) {
      var featureTitle = body.features[i].properties.title;
      var navTitle = featureTitle.replace(/<[^>]*>/g,'').replace(/[\/&:]/g, '').replace(/ /g, '-').replace(/--+/g, '-');
      console.log("navTitle: ", navTitle);
      body.features[i]['title'] = navTitle;
    };
    return cb(null, body);
  })
};
