'use strict';
const request = require("request"),
    debug = require("debug"),
    fs = require('fs'),
    log = debug("nemo-accessibility:log"),
    error = debug("nemo-accessibility:error"),
    path = require('path');

  let jsonOp = {};
  let resultArr = [];
  let retStr ='';
  const axeResults = require('./src/axe');
  const htmlcsResults = require('./src/htmlcs');
  const chromeResults = require('./src/chrome');


function setup (argObj, nemo, callback) {
    nemo.accessibility = {
      'scan': async function (options) {
        // const driver = options && options.element ? options.element : nemo.driver;
         const driver = nemo.driver,
          scanElement = options && options.element ? options.element : driver.findElement(nemo.wd.By.tagName('html')),
          project = options && options.project || '',
          page = options && options.page || '' ,          
          errLevel = options && options.errLevel || '1',
          level = options && options.level || 'WCAG2AA';

          log('engine', argObj.engine);
          
          jsonOp["project"] = project;
          jsonOp["page"] = page;
          let results='';

          switch(argObj.engine) {
              case 'htmlcs':
                  results = await htmlcsResults.getHtmlcsResults(argObj, nemo, callback)
                  break;
              case 'chrome':
                  results = await chromeResults.getChromeResults(argObj, nemo, callback)
                  break;
              case 'axe':
              default:
                   results = await axeResults.getAxeResults(argObj, nemo, callback)
              //
          } //end switch
        return results
      }   //scan function
    }    //nemo.accessibility
    callback(null);
  } //setup function

module.exports = {
  "setup": setup
}
