'use strict';
var request = require("request"),
  debug = require("debug"),
  fs = require('fs'),
  log = debug("nemo-accessibility:log"),
  error = debug("nemo-accessibility:error"),
  path = require('path');

  var jsonOp = {};

  function getAxeResults(argObj, nemo, callback){
    return new Promise(function(resolve, reject) {
      var retStr ='';
      var filePath = path.join(__dirname, '../lib/engines/axe/axe.js');
      var scriptSource = fs.readFileSync(filePath, 'utf8');
      var driver = nemo.driver;
      var d = nemo.wd.promise.defer();       
      driver.executeScript(scriptSource)
        .then(function(){
            driver.switchTo().defaultContent();
             driver.executeAsyncScript(function() {
               var callback = arguments[arguments.length - 1];
                window.axe.run(document, function(err, results) {
                    callback(results);
                });

             }).then(function(msg) {
                  // console.log(msg);
                  var violations = msg.violations
                  for (var i=violations.length;i--;){
                      delete violations[i].helpUrl;
                      delete violations[i].tags;              
                      delete violations[i].nodes;
                  } 
                  retStr = processResultsAxe(violations ,'Axe Accessibility Plugin');
                  resolve(retStr);
                  d.fulfill(retStr);

                });
        })
    })  //end return promise  
  }

  function processResultsAxe(arr){
    var msg, resultArr = [];
    if (arr.length === 0) {
        resultArr.push({'message':'No violations found'});
    }           
    for (var key in arr) {
        msg = arr[key];
        var temp_obj = {};
        temp_obj["id"] = msg.id;
        temp_obj["description"] = msg.description;
        temp_obj["help"] = msg.help;
        temp_obj["impact"] = msg.impact;
        resultArr.push(temp_obj);
    }
    jsonOp["results"] = resultArr;
    return JSON.stringify(jsonOp);  
  } 

  module.exports.getAxeResults = getAxeResults; 