var Nemo = require('nemo');
var fs = require('fs');
var nemo =  Nemo(process.cwd()+'/example',function(err){
  if(!err) {
    nemo.driver.get('https://paypal.com/signup/accountCreate');
    console.log('Nemo initialized successfully');
    var options = {
      'project': 'consumer'
      , 'page' : 'signup'
      // , 'output' :'json'
    };

    nemo.accessibility.scan(options).then(function (results) {
      if(typeof results === 'object') results = JSON.stringify(results)
      var file = process.cwd() + '/example/report/consumer.html';
      fs.writeFile(file, results , function (err) {
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