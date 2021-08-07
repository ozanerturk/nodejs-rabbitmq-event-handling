module.exports = class BaseEventConsumer {
    consumerQueueName = "";
    eventExchangeName = "";
    constructor(channel) {
        this.channel = channel;
    }
    queueName() {
        return `${this.consumerQueueName}`;
    }
    async handle(msg) {
    }
    async error(error, msg) {

    }
    async stringifyError(err, filter, space) {
        var plainObject = {};
        Object.getOwnPropertyNames(err).forEach(function (key) {
            plainObject[key] = err[key];
        });
        return JSON.stringify(plainObject, filter, space);
    };
    tryToParseJson(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            return jsonString;
        }
    }
    async handleConsume(msg) {
        if (msg !== null) {
            try {
                console.debug(" [x] Event Recieved consumer:%s", this.consumerQueueName);
                await this.handle(msg.content.toString());
                console.debug(" [x] Event  Handled consumer:%s", this.consumerQueueName);

            } catch (e) {
                console.error(e);
                await this.error(e, msg);
            }
            finally {
                this.channel.ack(msg);
            }
        }
    }
    async register() {
        await this.channel.assertExchange(this.eventExchangeName, 'fanout');
        const q = await this.channel.assertQueue(this.queueName(), { persistent: true });//create unqiue queue for event and delete it self after connection is dropped
        this.channel.bindQueue(q.queue, this.eventExchangeName, "");//binding queue to event exchange with no routing pattern
        console.debug("[x]MQ Bind", "Queue:", q.queue, "Exchange:", this.eventExchangeName);

        this.channel.consume(q.queue, (msg)=>this.handleConsume(msg));
        console.debug(this.consumerQueueName + " registered");
    }
};

