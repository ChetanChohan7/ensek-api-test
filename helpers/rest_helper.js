'use strict';
let I;
const helper = require('@codeceptjs/helper');
var config = require('codeceptjs').config.get();
var assert = require('assert');

class restHelper extends helper {
  _init() {
    I = actor();
  };

  async login(loginModel) {
    var client = this.helpers['REST'];
    let response = null;
    var headers = `{ accept: application/json, Content-Type: application/json }`;
    // Implemented this loop just to try work with the occasional 500 responses that get returned
    // If a 500 is a returned there is a 1 second timer and the request is made again
    let i = 0;
    while (i < 9){
      response = await client.sendPostRequest(config.endpoints.login, loginModel, headers);
      if (response.status === 200 || response.status === 400 || response.status === 401){
        i = 9;
        break;
      }
      else if (response.status === 500){
        await new Promise(r => setTimeout(r, 1000));
        i++;
      };
    };    
    return response;
  }; 

  async getOrders(accessToken) {
    var client = this.helpers['REST'];
    let response = null;
    var headers = `{ accept: application/json }`
    response = await client.sendGetRequest(config.endpoints.orders, { "Authorization": `Bearer ${accessToken}` }, headers);
    return response;
  };

  async getEnergyDetails(accessToken) {
    var client = this.helpers['REST'];
    let response = null;
    var headers = `{ accept: application/json }`
    response = await client.sendGetRequest(config.endpoints.energy, { "Authorization": `Bearer ${accessToken}` }, headers);
    return response;
  };

  async resetData(accessToken) {
    var client = this.helpers['REST'];
    let response = null;
    var headers = `{ accept: application/json }`
    response = await client.sendPostRequest(config.endpoints.reset, {}, { "Authorization": `Bearer ${accessToken}` }, headers);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.message, "Success");
    return response;
  };

  async buyEnergy(accessToken, energy_id, quantity) {
    var client = this.helpers['REST'];
    let response = null;
    var headers = `{ accept: application/json }`
    response = await client.sendPutRequest(`${config.endpoints.buy}${energy_id}/${quantity}`, { "Authorization": `Bearer ${accessToken}` }, headers);
    return response;
  }; 
}
module.exports = restHelper;