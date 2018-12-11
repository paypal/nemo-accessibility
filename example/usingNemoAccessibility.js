var Nemo = require('nemo');
var fs = require('fs');
var nemo =  Nemo(process.cwd()+'/example',function(err){
  if(!err) {
    nemo.driver.get('http://www.paypal.com');
    console.log('Nemo initialized successfully');
    nemo.accessibility.scan().then(function (result) {
      console.log('result', result);
      var file = process.cwd() + '/example/report/accessibility.json';
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