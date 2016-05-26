/**
 * Landmarks Lib
 */
var request = require('request')
var eachAsync = require('each-async')
var urlify = require('urlify').create({
  spaces:"-",
  nonPrintable:"",
  trim:true
})

function fetchAndProcessUrl (url, results, done, errors) {
  request({
    url: url,
    method: 'GET',
    json: true
  }, function (error, response, body) {
    if (error) {
      errors.push(error)
      done()
      return
    }
    if (response.statusCode >= 400) {
      errors.push('bad status code:' + response.statusCode)
      done()
      return
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
      var navTitle = urlify(featureTitle.replace(/<[^>]*>/g,'')).toLowerCase()
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
    results.features = results.features.concat(body['features'])
    done()
  })
}

// The url's for our landmarks sources are passed as query params
// (thus, the url's need be url-encoded)
module.exports.getLandmarks = function(queryParams, cb) {
  var results = { features: [] }
  var errors = []
  eachAsync(queryParams, function (item, index, done) {
    var urlFeatures = fetchAndProcessUrl(item, results, done, errors)
  }, function (error) {
    if (error) {
      return cb(error)
    } 
    if (errors.length > 0) {
      return cb(errors.toString())
    }
    return cb(null, results)
  });
}
