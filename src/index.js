const amqplib = require('amqplib');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(process.cwd(), 'src/.env') });

async function main() {

    let connection = await amqplib.connect({
        hostname: process.env.RABBIT_HOSTNAME,
        username: process.env.RABBIT_USERNAME,
        password: process.env.RABBIT_PASSWORD,
        vhost: process.env.RABBIT_VHOST
    });
    connection.on("error", (err) => {
        // No need to reject here since close event will be fired after
        // if not connected at all connection promise will be rejected
        console.error("AMQP connection error.", err);
    })
        .on("close", (err) => {
            connected = false;
            if (!connectionDisconnecting) {
                console.error("AMQP connection is closed.");

            } else {
                console.error("AMQP connection is closed gracefully.");
            }
        })
        .on("blocked", (reason) => {
            console.warn("AMQP connection is blocked.", reason);
        })
        .on("unblocked", () => {
            console.info("AMQP connection is unblocked.");
        });
    let channel = await connection.createChannel();
    channel.prefetch(5);
    channel.on('blocked', (reason) => {
        console.log(`Channel is blocked for ${reason}`);
    });
    channel.on('unblocked', () => {
        console.log('Channel has been unblocked.');
    });

    await require("./registerConsumers").register(channel);

    let userRegisteredEvent = require("./events/userRegistered");
    
    userRegisteredEvent.publish(channel,
        {
            "username": "someuser",
            "email": "john@doe.com",
            "name":"John",
            "surname":"Doe",

        }
    );

    process.on('SIGTERM', () => {
        channel.close()
            .then(() => {
                console.debug('Rabbitmq closed');
            }).finally(() => {
                console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
                process.exit();
            });
    });
    process.on('SIGINT', function () {
        channel.close()
            .then(() => {
                console.debug('Rabbitmq closed');
            }).finally(() => {
                console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
                process.exit();
            });
        // some other closing procedures go here
    });
};

main();