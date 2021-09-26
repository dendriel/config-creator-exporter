const { getExportHandler } = require('./controller/configurationController')

exports.handler = async (event) => {
    console.log(JSON.stringify(event))

    let promises = []
    let errorCount = 0

    event.Records.forEach(r => {
        console.log(JSON.stringify(r))
        const msg = JSON.parse(r.body)
        console.log(`Processing configuration id: ${msg.id}`)

        const promise = getExportHandler(msg)
            .then(() => {
                console.log(`Message ${msg.id} successfully processed.`)
            })
            .catch(error => {
                errorCount++
                throw new Error(`Failed to process message ${msg.id}. ` + error)
            })

        promises.push(promise)
    })

    await Promise.all(promises);

    if (errorCount === 0) {
        console.log("All configurations exported successfully")
    }
    else {
        console.log(`Failed to export ${errorCount} configurations of ${event.Records.length}`)
    }

    return { statusCode: 200 };
};
