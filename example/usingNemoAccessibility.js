var Nemo = require('nemo');
var fs = require('fs');
var nemo =  Nemo(process.cwd()+'/example',function(err){
  if(!err) {
    nemo.driver.get('http://www.paypal.com');
    console.log('Nemo initialized successfully');
    var options = {
      'priority': ['P1', 'P2', 'P3']
    };
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