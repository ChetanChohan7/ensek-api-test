/** @type {CodeceptJS.MainConfig} */
exports.config = {
  testData: {
    username: "test",
    password: "testing",
    energyTypes: {
      gas: { 
        energy_id: 1,
        price_per_unit: 0.34
      },
      nuclear: { 
        energy_id: 2,
        price_per_unit: 0.56,
      },
      electric: { 
        energy_id: 3,
        price_per_unit: 0.47
      },
      oil: { 
        energy_id: 4,
        price_per_unit: 0.5
      }   
    },
  },
  endpoints:{
    login: '/login',
    orders: '/orders',
    energy: '/energy',
    reset: '/reset',
    buy: '/buy/'
  },
  tests: './tests/*_test.js',
  output: './output',
  helpers: {
    REST: {
      endpoint: 'https://ensekapicandidatetest.azurewebsites.net',
      timeout: 30000
    },
    restHelper:{
      require: './helpers/rest_helper.js'
    },
    functions:{
      require: './helpers/functions.js'
    },
  },
  include: {
    I: './steps_file.js'
  },
  name: 'ENSEK-API'
}