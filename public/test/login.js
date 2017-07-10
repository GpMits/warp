casper.test.begin('Application login with default user', 5, function suite(test) {
    casper.start("http://localhost:8080/", function () {
        test.assertTitle("Reasonable Restaurants", "The title is the one expected");
        test.assertExists('input[id="username"]', "username input is found");
        test.assertExists('input[id="password"]', "password input is found");
        test.assertExists('button[type="submit"]', "submit button is found");
    });

    casper.then(function () {
        this.sendKeys('input[id="username"]', "admin", {
            keepFocus: true
        });
        this.sendKeys('input[id="password"]', "admin", {
            keepFocus: true
        });
        this.click('button[type="submit"]');
        this.waitForSelector('//*[@id="map"]',
            function pass() {
                test.pass("Found map div");
            },
            function fail() {
                test.fail("Did not load map div");
            },
            2000
        );
    });

    casper.run(function () {
        test.done();
    });
});