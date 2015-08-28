var Accessibility = require("../index"),
 nemo = {};

describe("nemo-accessibility ", function () {
   it("should get set up", function (done) {
      Accessibility.setup('http://someurl', nemo, function (err) {
         if (nemo.accessibility) {
            done()
         } else if (err) {
            done(err)
         } else {
            done(new Error("Didn't get accessibility object back"))
         }
      })
   });
});