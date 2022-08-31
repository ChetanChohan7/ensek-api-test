'use strict';
var moment = require('moment');
let I;
const helper = require('@codeceptjs/helper');

class functions extends helper {
  _init() {
    I = actor();
  }; 

  async wait(time){
    await new Promise(r => setTimeout(r, time * 1000));
  };

  async filterOrderDetails(orderInfo, orderId) {
    var ordersObj = orderInfo.filter(function (_orderInfo) {
      return _orderInfo.id === orderId;  
    })
    return ordersObj[0];
  };

  async filterEnergyDetails(energyInfo, energyId) {
    var energyType = Object.values(energyInfo).filter(value => {
      return value.energy_id === energyId;
    });
    return energyType[0];
  };

  async getOrderIdFromOrderResponse(string) {
    string = string.substr(string.length - 37).slice(0, -1).trim();
    return string;
  };

  async getListOfOrderDates(orders){
    var dateList = [];
    for (var i = 0; i < orders.length; i++){
      let dateTime = orders[i].time;
      dateTime = moment(dateTime).format();
      dateList.push(dateTime);
    }  
    return dateList;
  };

}
module.exports = functions;