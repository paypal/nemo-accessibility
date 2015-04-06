var Accessibility = require("../index"),
 returnObj = {
   "driver": true,
   "wd": true
};

describe("nemo-accessibility ", function () {
   it("should get set up", function (done) {
      Accessibility.setup({}, returnObj, function (err, config, returnObj) {
         if (returnObj.accessibility) {
            //console.log("user", returnObj.user);
            done()
         } else if (err) {
            done(err)
         } else {
            done(new Error("Didn't get accessibility object back"))
         }
      })
   });
});