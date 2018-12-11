'use strict';
var request = require("request"),
  debug = require("debug"),
  fs = require('fs'),
  log = debug("nemo-accessibility:log"),
  error = debug("nemo-accessibility:error"),
  path = require('path');

  var jsonOp = {};

  function getChromeResults(argObj, nemo, callback){
    return new Promise(function(resolve, reject) {
      var retStr ='';
      var driver = nemo.driver;
      var d = nemo.wd.promise.defer();
      var filePath = path.join(__dirname, '../lib/engines/chrome/axs_testing.js');
      var scriptSource = fs.readFileSync(filePath, 'utf8');              
      driver.executeScript(scriptSource)
        .then(function(){
            driver.switchTo().defaultContent();
             driver.executeAsyncScript(function() {
               var callback = arguments[arguments.length - 1];
                var configuration = new axs.AuditConfiguration();
                configuration.showUnsupportedRulesWarning = false;
                var results = axs.Audit.run(configuration);
                var audit = results.map(function (result) {
                    var DOMElements = result.elements;
                    var message = '';
                    if(result.result ==='FAIL'){
                      if (DOMElements !== undefined) {
                          var maxElements = Math.min(DOMElements.length, 5);
                          for (var i = 0; i < maxElements; i++) {
                              var el = DOMElements[i];
                              message += '\n';
                              try {
                                  message += axs.utils.getQuerySelectorText(el);
                              } catch (err) {
                                  message += ' tagName:' + el.tagName;
                                  message += ' id:' + el.id;
                              }
                          }
                      }
                      return {
                          heading: result.rule.heading,
                          result: result.result,
                          severity: result.rule.severity,
                          elements: message
                      };
                    }   //Return Failures only

                });
                for (var i=audit.length;i--;){
                  if (audit[i] == null) audit.splice(i,1);
                }
                callback(audit);

             }).then(function(audit) {
                  // console.log(audit)
                  jsonOp["results"] = audit;
                  var retobj = JSON.stringify(jsonOp);
                  resolve(retobj);
                  d.fulfill(retobj);
                });
        })

    })  //end return promise  
  }

  module.exports.getChromeResults = getChromeResults; 