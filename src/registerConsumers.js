
const welcomeUser = require("./consumers/welcomeUser");
const anotherConsumer = require("./consumers/anotherConsumer");

module.exports = {
    register: async function (channel) {
        await Promise.all([
            new welcomeUser(channel).register(),
            new anotherConsumer(channel).register(),
        ]);
    }

};