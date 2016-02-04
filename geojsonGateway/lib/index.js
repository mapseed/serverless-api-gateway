/**
 * Lib
 */
var request = require('request')
var urlify = require('urlify').create({
  spaces:"-",
  nonPrintable:"",
  trim:true
})

module.exports.getMapboxWithTitle = function(event, cb) {
  console.log("greetings/lib/index.js: event:", event)
  request({
    url: event.url,
    method: 'GET',
    json: true
  }, function (error, response, body) {
    if (error) {
      console.log("error: ", error)
      return cb("error: " + error, null)
    }
    if (response.statusCode >= 400) {
      console.log("status code >= 400: " + response.statusCode)
      return cb('status code: ' + response.statusCode, null)
    }
    var numberOfFeatures = body['features'].length
    var i
    for (i = 0; i < numberOfFeatures; i++) {
      var feature = body.features[i]
      // Let's process the body to transform the feature.properties.title
      // into feature.title:
      var featureTitle = feature.properties.title
      // Remove any html tags and 'urlify' the title
      // so it can be used in a url segment
      var navTitle = urlify(featureTitle.replace(/<[^>]*>/g,''))
      feature['title'] = navTitle

      // Let's set the feature.location_type param as well,
      // using the feature.properties.marker-symbol for Points,
      // or to 'mapbox' for Polygons
      if (feature.properties['marker-symbol']) {
        feature['location_type'] = feature.properties['marker-symbol']
      } else {
        feature['location_type'] = 'mapbox'
      }
    }
    return cb(null, body)
  })
}
