const util = require("../util/parseJsonToSchema");
const eventName = "user.registered";
const Example = {
    "username": "someuser",
    "name": "John",
    "surname": "Doe",
    "email": "john@doe.com"

};
/**
 * parse json string to event object 
 * @param {string} msg
 * @returns {Example}
 */
function parseAndValidate(msg) {
    let parsed = JSON.parse(msg);
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