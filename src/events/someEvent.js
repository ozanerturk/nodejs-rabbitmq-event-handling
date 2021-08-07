const util = require("../util/parseJsonToSchema");
const eventName = "user.someEvent";
const Example = {
    "username": "someuser",
    "email": "john@doe.com"

};
/**
 * parse json string to event object 
 * @param {string} msg
 * @returns {Example}
 */
function parseAndValidate(msg) {
    let parsed = JSON.parse(msg);
    //todo validate
    return parsed;
}
/**
 * publishes event 
 * @param {Example} payload
 */
async function publish(channel, payload) {
    await channel.assertExchange(eventName, 'fanout');
    channel.publish(
        eventName,
        "",
        Buffer.from(JSON.stringify(payload))
    );
    console.log(`${eventName} event published`);
}

module.exports = {
    eventName,
    parseAndValidate,
    publish
};