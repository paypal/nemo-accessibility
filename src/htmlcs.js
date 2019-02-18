'use strict';
var
  debug = require("debug"),
  fs = require('fs'),
  log = debug("nemo-accessibility:log"),
  error = debug("nemo-accessibility:error"),
  path = require('path');

  var jsonOp = {};


  module.exports = {
     getHtmlcsResults: function (argObj, nemo, callback) {
      return new Promise(function(resolve, reject) {
        var filePath = path.join(__dirname, '../lib/engines/htmlcs/HTMLCS.js');
        var scriptSource = fs.readFileSync(filePath, 'utf8');
        var driver = nemo.driver;
        var violations = null;         
        driver.executeScript(scriptSource)
          .then(function(){
              driver.switchTo().defaultContent();
               driver.executeAsyncScript(function() {
                 var callback = arguments[arguments.length - 1];
                  HTMLCS.process('WCAG2AA', document, function() {
                    var results = HTMLCS.getMessages();
                    callback(results);
                  }) 
               }).then(function(msgs) {
                      violations = processResultsHTMLCS(msgs);
                      resolve(violations);
                });
            })
      })  //end return promise
    }
  }
 
  function processResultsHTMLCS(msgs){
    var content = [];
    var heading = "";
    var type = '';
    var outerHTML = '';

    try {
        var principles = {
                'Principle1': 'Perceivable',
                'Principle2': 'Operable',
                'Principle3': 'Understandable',
                'Principle4': 'Robust'
            };

        if (msgs.length === 0) {
            content.push({'message':'No violations found'});
            return;
        }

        var errors   = 0;
        var count=1;

        for (var i = 0; i < msgs.length; i++) {
            var msg = msgs[i];
            var temp_obj = {};
          // console.log(msg.element);
          if(msg.type ===1){      //Error only
            var msgParts   = msg.code.split('.');
            var principle  = msgParts[1];
            var sc         = msgParts[3].split('_').slice(0, 3).join('_');
            var techniques = msgParts[4];
            techniques     = techniques.split(',');

            msgParts.shift();
            msgParts.unshift('[Standard]');
            var noStdMsgParts = msgParts.join('.');
            errors += 1;
            temp_obj["type"] = 'error';
            temp_obj["msg"] = msg.msg;
            temp_obj["code"] = msg.element.outerHTML;
            temp_obj["principle"] = '<a href="http://www.w3.org/TR/WCAG20/#' + principles[principle].toLowerCase() + '" target="_blank">' + principles[principle] + '</a>';

            var technique='';
            for (var j = 0; j < techniques.length; j++) {
                technique += '<a href="http://www.w3.org/TR/WCAG20-TECHS/' + techniques[j] + '" target="_blank">' + techniques[j] + '</a>';
            }
            temp_obj["techniques"] = technique;

            count++;
            content.push(temp_obj);
          } //close if error  
        } //Closing for loop
        // return content;
        jsonOp["results"] = content;
        return JSON.stringify(jsonOp);        
    } catch (e) {
        console.log('Error:', e.toString());
    }
  }

  