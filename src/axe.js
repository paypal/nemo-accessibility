'use strict';
var   debug = require("debug"),
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
                      // delete violations[i].nodes;
                  }
                  console.log('OP => ', argObj)
                  if(argObj.output === 'html'){
                    retStr = processResultsAxeHTML(violations ,'Axe Accessibility Plugin');
                  } else{
                    retStr = processResultsAxe(violations);
                  }
                  resolve(retStr);
                })
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

  function processResultsAxeHTML(arr, heading){
    var msg, resultHTML = '<!DOCTYPE html><html lang="en"><head>';
    resultHTML += '<style>table{color:#333;font-family:Helvetica,Arial,sans-serif;width:640px;border-collapse:collapse;border-spacing:0}td,th{border:1px solid transparent;height:30px;transition:all .3s}th{background:#dfdfdf;font-weight:700}td{background:#fafafa;text-align:center}tr:nth-child(even) td{background:#f1f1f1}tr:nth-child(odd) td{background:#fefefe}tr td:hover{background:#666;color:#fff}</style>';
    resultHTML += '</head><body><table><thead><tr><th>ID</th><th>Rule</th><th>impact</th><th>Details</th></tr></thead><tbody>';

    if (arr.length === 0) {
        resultHTML +='<tr><td colspan="4">No violations found</td></tr>';
    } else{
        resultHTML +='';

        for (var key in arr) {
          msg = arr[key];
          resultHTML +='<tr><td>' + msg.id +'</td>';
          resultHTML +='<td>' + msg.help +'</td>';
          resultHTML +='<td>' + msg.impact +'</td>';
          var nodes=msg.nodes;
          resultHTML +='<td>';
          for (var n in nodes) {
            resultHTML += nodes[n].failureSummary +'<br>';
            resultHTML += nodes[n].html +'<br>';
            resultHTML += '<hr style="border-top: 1px dotted red">';
          }
          resultHTML +='</td></tr>';
        }      
    }     
    resultHTML += '</tbody></table></body></html>';
    jsonOp["results"] = resultHTML;
    return JSON.stringify(jsonOp);
  }

  module.exports.getAxeResults = getAxeResults; 