var Nemo = require('nemo');
var fs = require('fs');
var debug = require("debug"),
  log = debug("nemo-accessibility:log"),
  error = debug("nemo-accessibility:error");

var url = 'http://localhost/test/bs_modal_dynamic/donate.html';

var nemo =  Nemo(process.cwd()+'/example',function(err){
  if(!err) {
    nemo.driver.get(url);
    log('Testing url: ' + url)

    var options = {
      'priority': ['P1', 'P2', 'P3'],
      'engine' : 'axe'
    };        
    nemo.accessibility.scan(options).then(function (result) {
        var file = process.cwd() + '/example/report/entirePage.html';
        fs.writeFile(file, result,function (err) {
           console.log('Successfully wrote the file ' + file);
        });
    });

    var btn= nemo.view._find('css:#btnDonate');    
    btn.click();
    nemo.driver.sleep(2000);  //Just to show the form for some time

    var options = {
            'priority': ['P1', 'P2'],
            'source': 'btnDonate',
            'engine' : 'htmlcs'
        };
    nemo.accessibility.scan(options).then(function (result) {
        var file = process.cwd() + '/example/report/scanAnElement.html';
        fs.writeFile(file, result, function (err) {
            console.log('Successfully wrote the file ' + file);
        });
    });

    nemo.driver.quit();
  } else {
    console.log(err);
  }
});
