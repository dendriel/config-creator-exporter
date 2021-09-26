const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
const { getExportHandler } = require('./controller/configurationController')

const queueURL = process.env.QUEUE_URL || "http://localhost:9324/queue/export-request"

AWS.config.update({
    region: 'test'
});

const app = Consumer.create({
    queueUrl: queueURL,
    handleMessage: async (message) => {
        console.log("Message received\n" + JSON.stringify(message))
        const body = JSON.parse(message.Body)
        console.log("Process message: " + body.id)
        getExportHandler(body)
            .then(() => {
                console.log(`Message ${body.id} successfully processed.`)
            })
            .catch(error => {
                throw new Error(`Failed to process message ${body.id}. ` + error)
            })
    },
    sqs: new AWS.SQS()
});

app.on('error', (err) => {
    console.error("error: " + err.message)
});

app.on('processing_error', (err) => {
    console.error("processing_error: " + err.message)
});

module.exports = app;
