Feature('Authorisiation @authourisation');
var assert = require('assert');
var models = require('../helpers/models.js');

Scenario('001: Test valid authourisation request can be executed', async ({ I }) => {
    var loginModel = models.login();
    var response = await I.login(loginModel);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.message, "Success");
    assert(response.data.access_token);
});

Scenario('002: Test that invalid credentials return an 401 unauthorised response', async ({ I }) => {
    var loginModel = models.login();
    loginModel.password = "wrong password";
    var response = await I.login(loginModel);
    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.data.message, "Unauthorized");
});

Scenario('003: Test that none existent credentials return an 401 unauthorised response', async ({ I }) => {
    var loginModel = models.login();
    loginModel.username = "some user";
    loginModel.password = "wrong password";
    var response = await I.login(loginModel);
    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.data.message, "Unauthorized");
});

Scenario('004: Test that an invalid request return a 400 bad request response', async ({ I }) => {
    var loginModel = { username: "test" }
    var response = await I.login(loginModel);
    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.data.message, "Bad Request");
});
