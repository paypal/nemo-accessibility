# nemo-accessibility

nemo-accessibility is a nemo plugin aimed to run accessibility scans during nemo tests. nemo-accessibility plugin uses [AATT api][1] from [AATT][2] to run accessibility scans on a given page or on a given element on a page.


## Installation

`npm install nemo-accessibility --save-dev`

## Configuration

Add nemo-accessibility to your `config/nemo-plugins.json` file. 

``` javascript
 "accessibility":{
        "module":"nemo-accessibility",
        "register": true
    }
```

## Details

`nemo-accessibility` plugin uses [AATT API][2] to evaluate HTML source. Therefore you must specify API url under `nemoData` like below.

 ```json
    "nemoData": {
       "accessibilityApiUrl" : "https://your_nodejs_server/evaluate"
    }
 ```
Once `nemo-accessibility` plugin is registered, you should now have `nemo.accessibility` object available. `nemo.accessibility` exposes a method called `scan` to help you run accessibility evaluation against your page. `scan` method takes an _optional_ object like below,

```javascript
 var options = {
    'priority': 'P1' or ['P1','P2','P3'], //expects either a string or an array; default is ALL priorities
    'element': nemo.drivex.find({'locator':'iframe','type':'tagName'}), //default is entire page
    'output': 'html' or 'json' //default is html
 }
```

`scan` method returns a promise with resulting `HTML` or `json` response from [AATT api][1] when fulfilled. You can then write the HTML to a file or parse JSON response for later reporting. For example,

``` javascript
   nemo.driver.get('http://www.yahoo.com');
   nemo.accessibility.scan().then(function (result) {
     fs.writeFile('test/functional/report/accessibility.html', result, function (err) {
                 done();
     });
   });
```
You could also pass a certain element to run the scan. This is useful particularly when you already scanned an entire page, and lets say nemo test opened a dialog box; you can now only scan newly opened dialog box since you already scanned the rest of the page before.

```javascript
  it('will run scan on an element', function (done) {
        nemo.driver.get('http://www.paypal.com');
        var element = nemo.driver.findElement(nemo.wd.By.tagName('video')),
            options = {
                'priority': ['P1', 'P2'],
                'element': element
            };
        nemo.accessibility.scan(options).then(function (result) {
            fs.writeFile('test/functional/report/scanAnElement.html', result, function (err) {
                done();
            });
        });
    });
```

You could also get json output result from nemo-accessibility plugin and parse the json response to mark your tests passed or failed based on your criteria. 

For example,

```javascript
 it('will run scan and return JSON', function (done) {
        nemo.driver.get('http://www.paypal.com');
        var options = {
                'priority': ['P1', 'P2'],
                'output': 'json'
            },
            count=0;           
            nemo.accessibility.scan(options).then(function (results) {
              results.forEach(function(result){
              if(result.priority==='P1'){
                count ++;
              }
           });
           assert.equal(count,0,'P1 Errors exist in the current page, please check \n'+ results);
        });
    });
```    
##Summary
The idea behind this plugin is that during the course of nemo test, run accessibility scan;write the HTML output to a file or parse JSON for reporting;perform some selenium actions;run the scan again;report the output and so on.


##Support
Please file a [Nemo a11y plugin issue][3]  for any nemo plugin related questions or file a [issue for AATT][4] for any AATT related questions

[1]: https://yourhostname/evaluate "AATT api"
[2]: https://github.com/paypal/AATT "AATT"
[3]: https://github.com/paypal/nemo-accessibility/issues "File a ticket for Nemo a11y plugin"
[4]: https://github.com/paypal/AATT/issues "File a ticket for AATT"



## Copyright and License

Copyright 2015, eBay Software Foundation under [the BSD license](LICENSE.md).
