const AWS = require('aws-sdk')

AWS.config.update({region: 'local'})

const sqs = new AWS.SQS({apiVersion: '2012-11-05'})
const queueURL = process.env.QUEUE_URL || "http://localhost:9324/queue/export-request"

const params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 60*60,
    WaitTimeSeconds: 20
}

sqs.receiveMessage(params, function(err, data) {
    if (err) {
        console.log("Receive Error", err);
        return
    }
    if (!data.Messages) {
        console.log("Data has no messages")
        return
    }

    console.log(data)

    const deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle
    };

    sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
            console.log("Delete Error", err);
        } else {
            console.log("Message Deleted", data);
        }
    })
})
