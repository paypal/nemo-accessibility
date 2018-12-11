'use strict';
var request = require("request"),
  debug = require("debug"),
  fs = require('fs'),
  log = debug("nemo-accessibility:log"),
  error = debug("nemo-accessibility:error"),
  path = require('path');

  var jsonOp = {};
  var resultArr = [];
  var retStr ='';
  var axeResults = require('./src/axe');
  var htmlcsResults = require('./src/htmlcs');
  var chromeResults = require('./src/chrome');

module.exports = {
  "results":"",
  "setup": function (argObj, nemo, callback) {
    var returnObj = nemo;

    returnObj.accessibility = {
      'scan': function (options) {
        var d = nemo.wd.promise.defer();
        // var driver = options && options.element ? options.element : nemo.driver;
         var driver = nemo.driver,
          scanElement = options && options.element ? options.element : driver.findElement(nemo.wd.By.tagName('html')),
          project = options && options.project || '',
          page = options && options.page || '' ,          
          errLevel = options && options.errLevel || '1',
          level = options && options.level || 'WCAG2AA';

          log('api url', argObj.accessibilityApiUrl);
          log('engine', argObj.engine);

      if (argObj.accessibilityApiUrl) {
        var engine = options && options.engine ? options.engine : '',
            output = options && options.output ? options.output : '',
            accessibilityApiUrl = argObj.accessibilityApiUrl;

        scanElement.getAttribute('innerHTML').then(function (source) {

          log('Now scanning with error level ', errLevel);
          log('API engine', engine);
          log('Accessibility url ', accessibilityApiUrl);

          var body = {
              'source': source,
              'errLevel': errLevel,
              'level' : level,
              'engine' : engine,
              'output': output,
              'page' : page,
              'project': project
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
        });   //scanElement.getAttribute
      } else {
          // console.log('Standalone: ', project, page, argObj.engine);
          jsonOp["project"] = project;
          jsonOp["page"] = page;

          switch(argObj.engine) {
              case 'htmlcs':
                      htmlcsResults.getHtmlcsResults(argObj, nemo, callback)
                       .then(function(results){
                        d.fulfill(results);
                      })
                  break;
              case 'chrome':
                      chromeResults.getChromeResults(argObj, nemo, callback)
                       .then(function(results){
                          d.fulfill(results);
                       })
                  break;
              case 'axe':
              default:
                axeResults.getAxeResults(argObj, nemo, callback)
                  .then(function(results){
                    d.fulfill(results);
                })                      
              //
          } //end switch
      } // end else 
        
        return d;
      }   //scan function
    }    //returnObj
    callback(null);
  } //setup function
};    //module.export

