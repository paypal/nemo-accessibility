var Nemo = require('nemo');
var fs = require('fs');

var nemo =  Nemo(process.cwd()+'/example',function(err){
  if(!err) {

    nemo.driver.get('http://localhost/test/bs_modal_dynamic/donate.html');
    var options = {
      'priority': ['P1', 'P2', 'P3']
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
            'source': 'btnDonate'
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