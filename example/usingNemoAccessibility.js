const Nemo = require('nemo-core');

const nemo =  Nemo(process.cwd()+'/example', function(err){
  if (err) {
    console.log('Error during Nemo setup', err);
  }
  nemo.driver.get('http://www.paypal.com');
  nemo.driver.getCapabilities().then((cap) => {
    console.info('Nemo successfully launched:', cap.get('browserName'));
  }) .catch((error) => {
    console.log(error);
  })

    const options = {
      'page': 'HomePage'   
    }
    
  nemo.accessibility.scan(options).then(function (result) {
    console.log('Result :' + result);
  }).catch((error) => {
    console.log(error);
  })

  nemo.driver.quit();
});