# nemo-accessibility

    nemo-accessibility is a nemo plugin aimed to run accessibility scans during nemo tests. nemo-accessibility plugin uses axe-core, htmlcode smiffer and chrome engines to run accessibility scans on a given page or on a given element on a page.

## How to Use
1. Install this package
`npm install nemo-accessibility --save-dev`
2. Add nemo-accessibility to your `config/nemo-plugins.json` file like below

``` javascript
 "nemo-accessibility":{
        "module":"nemo-accessibility",
      "arguments": [
                    {
                       "engine":"axe"
                       "engine":"chrome"
                       "engine":"htmlcs"
                    }
                  ]
    }
```
3. Call Scan method 
`let results= await nemo.accessibility.scan({'project': 'mynodewebproject', 'page': 'somepageName'})`

## Details

Once `nemo-accessibility` plugin is registered, you should now have `nemo.accessibility` namespace available in your tests. `nemo.accessibility` exposes a method called `scan` to help you run accessibility evaluation against your page/element. 

`scan` method returns a promise with resulting json` response and you can then write the HTML to a file or parse JSON response for later reporting. For example,

``` javascript
   nemo.driver.get('http://www.paypal.com');
   nemo.accessibility.scan().then(function (result) {
     fs.writeFile('report/accessibility.json', result, function (err) {
         done();
     });
   });
```
See usingNemoAccessibility.js. You can run that on Debug mode like 
`DEBUG=nemo* node node_modules/nemo-accessibility/example/usingNemoAccessibility.js`


## Support
Please file a [Nemo a11y plugin issue][1]  for any nemo plugin related questions or file a [issue for AATT][2] for any AATT related questions

[1]: https://github.com/paypal/nemo-accessibility/issues "File a ticket for Nemo a11y plugin"
[2]: https://github.com/paypal/AATT/issues "File a ticket for AATT"

## Copyright and License

Copyright 2019, PayPal under [the BSD license](LICENSE.md).

## Contributors
 - Nilesh Kulkarni ,  developer for nemo accessibility plugin ||[https://github.com/nikulkarni](https://github.com/nikulkarni)
 - Prem Nawaz Khan,  developer || [https://github.com/mpnkhan](https://github.com/mpnkhan) || [@mpnkhan](https://twitter.com/mpnkhan)

