var Nemo = require('nemo');
var fs = require('fs');

var nemo =  Nemo(process.cwd()+'/example',function(err){
  if(!err) {
    nemo.driver.get('http://localhost/test/bs_modal_dynamic/donate.html');
    console.log('Nemo initialized successfully');
    var options = {
      'priority': ['P1', 'P2', 'P3']
    };
    nemo.driver.sleep(1000);
    var btn= nemo.view._find('css:#btnDonate');    
    btn.click();
    nemo.driver.sleep(2000);

    nemo.accessibility.scan(options).then(function (result) {
      var file = process.cwd() + '/example/defaultOptions.html';
      fs.writeFile(file, result, function (err) {
        if (err) {
          throw err;
        }
        console.log('Successfully wrote the file ' + file);
      });
    });
    nemo.driver.quit();
  } else {
    console.log(err);
  }
});