Feature('Ordering @ordering');
var moment = require('moment');
var assert = require('assert');
var models = require('../helpers/models.js');
var config = require('codeceptjs').config.get();
var authourisationResponse
var accessToken
var initial_energyInfo
var updated_energyInfo
var orderId
var orderInfo

Before(async({I}) => {
    // obtaining authorisation before every scenario
    var loginModel = models.login();
    authourisationResponse = await I.login(loginModel);
    accessToken = authourisationResponse.data.access_token;
    // resetting test data before every scenario
    await I.resetData(accessToken);
    // get initial energy info
    initial_energyInfo = await I.getEnergyDetails(accessToken);
    initial_energyInfo = initial_energyInfo.data;
});

Scenario('001: Order energy type: Gas', async ({ I }) => {
    initial_energyInfo = await I.filterEnergyDetails(initial_energyInfo, config.testData.energyTypes.gas.energy_id);   
    var quantityToOrder = 2;
    var expectedMessage = `You have purchased ${quantityToOrder} m³ at a cost of ${quantityToOrder * initial_energyInfo.price_per_unit} there are ${initial_energyInfo.quantity_of_units - quantityToOrder} units remaining`;
    var orderResponse = await I.buyEnergy(accessToken, config.testData.energyTypes.gas.energy_id, quantityToOrder);
    orderId = await I.getOrderIdFromOrderResponse(orderResponse.data.message);    
    updated_energyInfo = await I.getEnergyDetails(accessToken);
    updated_energyInfo = updated_energyInfo.data;
    updated_energyInfo = await I.filterEnergyDetails(updated_energyInfo, config.testData.energyTypes.gas.energy_id);
    let orders = await I.getOrders(accessToken);
    orders = orders.data;
    console.log(`Order Id: ${orderId}`);
    orderInfo = await I.filterOrderDetails(orders, orderId);
    console.log(`Order Info: ${JSON.stringify(orderInfo)}`);
    // assertion to check the total quantity has been decremented
    assert.strictEqual(updated_energyInfo.quantity_of_units, (initial_energyInfo.quantity_of_units - quantityToOrder), `Calculation of quantity decrement invalid`);
    // assertion to check response message contains the correct values
    assert(orderResponse.data.message.includes(expectedMessage), `Order response message invalid`);
    // assertion to check the order information has been returned based off the order id
    assert(orderInfo !== undefined, `No order with id: ${orderId} was returned in /orders`);
    await I.resetData(accessToken);
});

Scenario('002: Attempt to order energy type: Nuclear when quantity is zero', async ({ I }) => {
    initial_energyInfo = await I.filterEnergyDetails(initial_energyInfo, config.testData.energyTypes.nuclear.energy_id);   
    var quantityToOrder = 1;
    var expectedMessage = `There is no nuclear fuel to purchase!`;
    var orderResponse = await I.buyEnergy(accessToken, config.testData.energyTypes.nuclear.energy_id, quantityToOrder);
    assert.strictEqual(orderResponse.data.message, expectedMessage);
});

Scenario('003: Order energy type: Electric', async ({ I }) => {
    initial_energyInfo = await I.filterEnergyDetails(initial_energyInfo, config.testData.energyTypes.electric.energy_id);   
    var quantityToOrder = 2;
    var expectedMessage = `You have purchased ${quantityToOrder} kWh at a cost of ${quantityToOrder * initial_energyInfo.price_per_unit} there are ${initial_energyInfo.quantity_of_units - quantityToOrder} units remaining`;
    var orderResponse = await I.buyEnergy(accessToken, config.testData.energyTypes.electric.energy_id, quantityToOrder);
    orderId = await I.getOrderIdFromOrderResponse(orderResponse.data.message);    
    updated_energyInfo = await I.getEnergyDetails(accessToken);
    updated_energyInfo = updated_energyInfo.data;
    updated_energyInfo = await I.filterEnergyDetails(updated_energyInfo, config.testData.energyTypes.electric.energy_id);
    let orders = await I.getOrders(accessToken);
    orders = orders.data;
    console.log(`Order Id: ${orderId}`);
    orderInfo = await I.filterOrderDetails(orders, orderId);
    console.log(`Order Info: ${JSON.stringify(orderInfo)}`);
    // assertion to check the total quantity has been decremented
    assert.strictEqual(updated_energyInfo.quantity_of_units, (initial_energyInfo.quantity_of_units - quantityToOrder), `Calculation of quantity decrement invalid`);
    // assertion to check response message contains the correct values
    assert(orderResponse.data.message.includes(expectedMessage), `Order response message invalid`);
    // assertion to check the order information has been returned based off the order id
    assert(orderInfo !== undefined, `No order with id: ${orderId} was returned in /orders`);
    await I.resetData(accessToken);
});

Scenario('004: Order energy type: Oil', async ({ I }) => {
    initial_energyInfo = await I.filterEnergyDetails(initial_energyInfo, config.testData.energyTypes.oil.energy_id);   
    var quantityToOrder = 2;
    var expectedMessage = `You have purchased ${quantityToOrder} Litres at a cost of ${quantityToOrder * initial_energyInfo.price_per_unit} there are ${initial_energyInfo.quantity_of_units - quantityToOrder} units remaining`;
    var orderResponse = await I.buyEnergy(accessToken, config.testData.energyTypes.oil.energy_id, quantityToOrder);
    orderId = await I.getOrderIdFromOrderResponse(orderResponse.data.message);    
    updated_energyInfo = await I.getEnergyDetails(accessToken);
    updated_energyInfo = updated_energyInfo.data;
    updated_energyInfo = await I.filterEnergyDetails(updated_energyInfo, config.testData.energyTypes.oil.energy_id);
    let orders = await I.getOrders(accessToken);
    orders = orders.data;
    console.log(`Order Id: ${orderId}`);
    orderInfo = await I.filterOrderDetails(orders, orderId);
    console.log(`Order Info: ${JSON.stringify(orderInfo)}`);
    // assertion to check the total quantity has been decremented
    assert.strictEqual(updated_energyInfo.quantity_of_units, (initial_energyInfo.quantity_of_units - quantityToOrder), `Calculation of quantity decrement invalid`);
    // assertion to check response message contains the correct values
    assert(orderResponse.data.message.includes(expectedMessage), `Order response message invalid`);
    // assertion to check the order information has been returned based off the order id
    assert(orderInfo !== undefined, `No order with id: ${orderId} was returned in /orders`);
    await I.resetData(accessToken);
});

Scenario('005: Attempt to order energy type: Oil and exceed quantity available', async ({ I }) => {
    initial_energyInfo = await I.filterEnergyDetails(initial_energyInfo, config.testData.energyTypes.oil.energy_id);   
    var quantityToOrder = initial_energyInfo.quantity_of_units + 1;
    var expectedMessage = `You have purchased ${quantityToOrder} m³ at a cost of ${quantityToOrder * initial_energyInfo.price_per_unit} there are ${initial_energyInfo.quantity_of_units - quantityToOrder} units remaining`;
    var orderResponse = await I.buyEnergy(accessToken, config.testData.energyTypes.oil.energy_id, quantityToOrder);
    // expected order response message to state order can not be completed as it exceeds the available quantity
    // instead an order is placed and returns in the order request
    orderId = await I.getOrderIdFromOrderResponse(orderResponse.data.message); 
    updated_energyInfo = await I.getEnergyDetails(accessToken);
    updated_energyInfo = updated_energyInfo.data;
    updated_energyInfo = await I.filterEnergyDetails(updated_energyInfo, config.testData.energyTypes.gas.energy_id);
    let orders = await I.getOrders(accessToken);
    orders = orders.data;
    console.log(`Order Id: ${orderId}`);
    orderInfo = await I.filterOrderDetails(orders, orderId);
    console.log(`Order Info: ${JSON.stringify(orderInfo)}`);
    // assertion to check that no order is returned within /orders with the given order id
    assert(orderInfo === undefined, `Order with id: ${orderId} was incorrectly returned in /orders`);
    await I.resetData(accessToken);
});

Scenario('006: Attempt to order an invalid energy id', async ({ I }) => {
    var orderResponse = await I.buyEnergy(accessToken, 5, 1);
    assert.strictEqual(orderResponse.status, 400);
    assert.strictEqual(orderResponse.data.message, "Bad request");
});

Scenario('007: Confirm how many orders were created before the current data', async ({ I }) => {
    let orders = await I.getOrders(accessToken);
    var dateList = await I.getListOfOrderDates(orders.data);
    console.log(dateList);
    var todaysDate = moment().format();
    console.log(`todays date: ${todaysDate}`);
    let datesBeforeToday = [];
    for (var i = 0; i < dateList.length; i++){
      if (dateList[i] < todaysDate) datesBeforeToday.push(dateList[i]);
    }   
    console.log(`Orders created before current date: ${datesBeforeToday.length}`);
});
  