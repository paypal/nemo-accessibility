# nemo-accessibility

nemo-accessibility is a nemo plugin aimed to run accessibility scans during nemo tests. nemo-accessibility plugin uses [AATT api][1] from [AATT][2] to run accessibility scans on a given page or on a given element on a page.


## Installation

`npm install nemo-accessibility --save-dev`

## Configuration

Add nemo-accessibility to your `config/nemo-plugins.json` file. Pass [AATT api][1] as a plugin argument like below

``` javascript
 "nemo-accessibility":{
        "module":"nemo-accessibility",
        "arguments": ["https://your_nodejs_accessibility_server/evaluate"]
    }
```

## Details

Once `nemo-accessibility` plugin is registered, you should now have `nemo.accessibility` namespace available in your tests. `nemo.accessibility` exposes a method called `scan` to help you run accessibility evaluation against your page/element. `scan` method takes an _optional_ object like below,

```javascript
 var options = {
    'priority': 'P1' or ['P1','P2','P3'], //expects either a string or an array; default is ['P1','P2','P3','P4']
    'element': driver.findElement(wd.tagName('iframe')), //default is entire page
    'output': 'html' or 'json' //default is html
 }
```

`scan` method returns a promise with resulting `HTML` or `json` response from [AATT api][1] when fulfilled. You can then write the HTML to a file or parse JSON response for later reporting. For example,

``` javascript
   nemo.driver.get('http://www.paypal.com');
   nemo.accessibility.scan().then(function (result) {
     fs.writeFile('report/accessibility.html', result, function (err) {
         done();
     });
   });
```
You could also run accessibility scan on a _certain_ _element_ like below. This is useful when lets say you scanned an entire page already, and subsequently a certain automated test interaction opened a dialog box; you can now only scan newly opened dialog box since you already scanned the rest of the page before.

Here is a "made up" example, (note this example uses excellent [nemo-view](https://github.com/paypal/nemo-view) plugin for finding elements)

```javascript
  it('will run scan on an element', function (done) {
        nemo.driver.get('http://www.paypal.com');
        nemo.accessibility.scan().then(function (result) {
            fs.writeFile('report/entirePage.html',result,function (err) {
               done();
            });
        });
        var welcomePage = nemo.view.welcomePage;
        welcomePage.buttonThatOpensAPopup().click();
        var element = welcomePage.popup();,
            options = {
                'priority': ['P1', 'P2'],
                'element': element
            };
        nemo.accessibility.scan(options).then(function (result) {
            fs.writeFile('report/scanAnElement.html', result, function (err) {
                done();
            });
        });
    });
```

Like HTML output one could also get json output result from nemo-accessibility plugin and parse the json response to mark your tests passed or failed based on your criteria.

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
              if(result.priority === 'P1'){
                count ++;
              }
           });
           assert.equal(count,0,'P1 Errors exist in the current page, please check \n'+ results);
        });
    });
```
##Example
In this project a sample `nemo-accessibility` plugin test is written under `example/usingNemoAccessibility.js`. As mentioned above `nemo-accessibility` plugin uses [AATT api][1] from [AATT][2] to run accessibility scans on a given page/element. Therefore to run the sample nemo-accessibility test, first we need to setup [AATT][2] which is pretty straightforward and should be done in a few minutes with steps below. If [AATT][2] is already setup, please skip this step

```bash
git clone https://github.com/paypal/AATT.git
cd AATT
npm install
git submodule init
git submodule update
$ node app.js
```
You can also find above instructions in detail over [here](https://github.com/paypal/AATT#set-up)

Once AATT is running on default port of 80, you can switch back to `nemo-accessibility` project and run a sample test like below

```bash
npm install
DEBUG=nemo* node example/usingNemoAccessibility.js
```
Test will launch a firefox browser and redirect to `www.paypal.com` and it will run accessibility scan. Once scanning is complete, accessibility results will be written to a file `example/defaultOptions.html`

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
