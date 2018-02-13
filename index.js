'use strict';
var request = require("request"),
  debug = require("debug"),
  fs = require('fs'),
  log = debug("nemo-accessibility:log"),
  error = debug("nemo-accessibility:error"),
  path = require('path');

module.exports = {

  "setup": function (argObj, nemo, callback) {
    var returnObj = nemo;

    returnObj.accessibility = {
      'scan': function (options) {
        var d = nemo.wd.promise.defer();
        // var driver = options && options.element ? options.element : nemo.driver;
         var driver = nemo.driver;
         var scanElement = options && options.element ? options.element : driver.findElement(nemo.wd.By.tagName('html'));

        log('api url', argObj.accessibilityApiUrl);
        log('engine', argObj.engine);

      if (argObj.accessibilityApiUrl) {
        var errLevel = options && options.errLevel || '1',
            level = options && options.level || 'WCAG2AA',
            engine = options && options.engine ? options.engine : '',
            output = options && options.output ? options.output : '',
            project = options && options.project || '',
            page = options && options.page || '' ,
            accessibilityApiUrl = argObj.accessibilityApiUrl;

        scanElement.getAttribute('innerHTML').then(function (source) {
          // log('Page source:', source);
          log('Now scanning with error level ', errLevel);
          log('API engine', engine);
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
      } else{
          switch(argObj.engine) {
              case 'axe':
                var filePath = path.join(__dirname, './lib/engines/axe/axe.js');
                var scriptSource = fs.readFileSync(filePath, 'utf8');
                driver.executeScript(scriptSource)
                    .then(function(){
                        driver.switchTo().defaultContent();
                         driver.executeAsyncScript(function() {
                           var callback = arguments[arguments.length - 1];
                            window.axe.a11yCheck(document, null, function (results) {
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
                              console.log(violations);
                            });
                    })
                  break;
              case 'htmlcs':
                var filePath = path.join(__dirname, './lib/engines/htmlcs/HTMLCS.js');
                var scriptSource = fs.readFileSync(filePath, 'utf8');              
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
                                var voila = processResultsHTMLCS(msgs);
                                console.log(voila)
                          });
                      })
                  break;
              case 'chrome':
                var filePath = path.join(__dirname, './lib/engines/chrome/axs_testing.js');
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
                              console.log(audit)
                            });
                    })


                  break;              
              default:
              //
          } //end switch
      } // end else 
      
        return d;
      }   //scan function
    }    //returnObj
    callback(null);
  } //setup function
};    //module.export


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
        return content;
    } catch (e) {
              console.log('Error:', e.toString());
    }
  }