var config = require('codeceptjs').config.get();
module.exports = {

    login(username, password){
        if (!username) username = config.testData.username;
        if (!password) password = config.testData.password;
        var _login = {
            username: username,
            password: password
        }
        return _login;
    },
}     
