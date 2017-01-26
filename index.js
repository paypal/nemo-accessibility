'use strict';
var request = require("request"),
  debug = require("debug"),
  log = debug("nemo-accessibility:log"),
  error = debug("nemo-accessibility:error");

module.exports = {

  "setup": function (accessibilityApiUrl, nemo, callback) {

    var returnObj = nemo;

    returnObj.accessibility = {
      'scan': function (options) {

        var d = nemo.wd.promise.defer(),
            errLevel = options && options.errLevel || '1,2,3',
            level = options && options.level || 'WCAG2AA',
            driver = options && options.element ? options.element : nemo.driver,
            scanElement = options && options.element ? options.element : driver.findElement(nemo.wd.By.tagName('html')),
            engine = options && options.engine ? options.engine : '',
            output = options && options.output ? options.output : '';

        scanElement.getAttribute('innerHTML').then(function (source) {
          log('Now scanning with error level ', errLevel);
          log('Accessibility url ', accessibilityApiUrl);
          if (!accessibilityApiUrl) {
            error('You must specify accessibilityApiUrl as a plugin argument');
            d.reject(new Error('You must specify accessibilityApiUrl as a plugin argument'));
          }
          var body = {
              'source': source,
              'errLevel': errLevel,
              'level' : level,
              'engine' : engine,
              'output': output
            },
            options = {
              'headers': {
                'Content-Type': 'application/json'
              },
              'url': accessibilityApiUrl,
              'method': 'POST',
              'body': body,
              'json': true,
              'rejectUnauthorized': false
            };
          request(options, function (err, response, responseBody) {
            if (err) {
              error(err);
              d.reject(err);
            }
            if (err || response.statusCode !== 200) {
              d.reject('Error is ' + err + ' Response code is ' + (response && response.statusCode));
            }
            d.fulfill(responseBody);
          });
        });
        return d;
      }
    };
    callback(null);
  }
};
