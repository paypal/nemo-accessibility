'use strict';
var request = require("request");
module.exports = {
    /**
     *    setup - initialize this functionality during nemo.setup
     *    @param config {Object} - full config object passed to nemo.setup().
     *                                This plugin's config must be referenced with the same identifier
     *                                used in the setup method below
     *    @param result {Object} - result object which will eventually be passed back to the test script
     *                                once all setup methods are complete. Namespace this plugin's
     *                                functionality under it's identifier.
     *    @param callback {Function} - callback to continue the setup process.
     *                                Args are err {Error}, config {Object}, returnObj {Object}
     */
    "setup": function (config, result, callback) {

        var returnObj = result;

        returnObj.accessibility = {
            'scan': function (options) {

                var d = result.wd.promise.defer(),
                    withPriority = options && options.priority || ['P1', 'P2', 'P3', 'P4'],
                    priority = withPriority instanceof Array ? withPriority.toString() : withPriority,
                    driver = options && options.element ? options.element : result.driver,
                    scanElement = options && options.element ? options.element : driver.findElement(result.wd.By.tagName('html')),
                    output = options && options.output ? options.output : '';

                scanElement.getAttribute('innerHTML').then(function (source) {
                    console.log('now scanning ' + withPriority);
                    console.log(result.props.accessibilityApiUrl);
                    if (!result.props.accessibilityApiUrl) {
                        d.reject(new Error('You must specify accessibilityApiUrl under nemoData property'));
                    }
                    var body = {
                            'source': source,
                            'priority': priority,
                            'output': output
                        },
                        options = {
                            'headers': {
                                'Content-Type': 'application/json'
                            },
                            'url': result.props.accessibilityApiUrl,
                            'method': 'POST',
                            'body': body,
                            'json': true,
                            'rejectUnauthorized': false
                        };
                    request(options, function (err, response, responseBody) {
                        if (err) {
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
        callback(null, config, returnObj);
    }
};
