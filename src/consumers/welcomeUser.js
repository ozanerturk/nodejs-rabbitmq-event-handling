const BaseEventConsumer = require("../baseEventConsumer");
const userRegisteredEvent = require("../events/userRegistered");

//would be published
const someEvent = require("../events/someEvent");

module.exports = class WelcomeUser extends BaseEventConsumer {
    consumerQueueName = "WelcomeUser";
    eventExchangeName = userRegisteredEvent.eventName;

    async error(error, msg) {
        console.log(error, msg);
    }
    async handle(msg) {
        let event = userRegisteredEvent.parseAndValidate(msg);//validates data integrity, json schema could be used

        let mailBody = ` Dear ${event.name} ${event.surname}
        Welcome to the system
        XYZ Company
        `;
        this.sendMail(event.email, mailBody);

        someEvent.publish(this.channel, {
            email: event.email,
            username: event.username,
        });
    }
    async sendMail(email, body) {
        //send email logic
        console.log(email, body);
        console.log("email sent");
    }
};
