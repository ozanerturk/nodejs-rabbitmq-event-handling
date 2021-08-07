const baseEventConsumer = require("../../baseEventConsumer");
const chaiAsPromised = require("chai-as-promised");
const chai = require('chai');
const sinon = require("sinon");
const faker = require("faker");
const { expect, assert } = chai;
chai.use(chaiAsPromised);


describe("baseEventConsumer", function () {
    const fakeChannelStub = {
        assertExchange: function () { },
        assertQueue: function () { },
        bindQueue: function () { },
        consume: function (queueName, callback) { },
        ack: function (msg) { },
    };
    let assertExchangeStub = sinon.stub(fakeChannelStub, "assertExchange").returns(true);
    let assertQueueStub = sinon.stub(fakeChannelStub, "assertQueue").returns({ queue: "" });
    let bindQueueStub = sinon.stub(fakeChannelStub, "bindQueue").returns("yes");


    it("resgisterSuccessFully", async function () {
        let consumer = new baseEventConsumer(fakeChannelStub);
        await consumer.register(fakeChannelStub);
    });
    it("consumerCalledHandle", async function () {
        let consumer = new baseEventConsumer(fakeChannelStub);
        let spy = sinon.spy(consumer, "handle");
        let content = "hello";
        let msg = { content: Buffer.from(content) };

        await consumer.handleConsume(msg);//simulates  incomming events

        assert(spy.getCall(0).args[0] == content);

    });
});