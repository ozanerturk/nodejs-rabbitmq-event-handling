const BaseEventConsumer = require("../baseEventConsumer");
const someEvent = require("../events/someEvent");

module.exports = class AnotherConsumer extends BaseEventConsumer {
    consumerQueueName = "AnotherConsumer";
    eventExchangeName = someEvent.eventName;

    async error(error, msg) {
        console.log(error, msg);
    }
    async handle(msg) {
        let event = someEvent.parseAndValidate(msg);

        console.log(event);
    }
};
