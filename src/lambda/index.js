const { exportConfiguration } = require('./exporter-handler')

exports.handler = async (event) => {
    console.log(JSON.stringify(event))

    let promises = []
    let errorCount = 0

    event.Records.forEach(r => {
        const data = JSON.parse(r.body)
        console.log(`Exporting configuration ${data.id}`)

        const promise = exportConfiguration(data)
            .then(() => {
                console.log(`Configuration ${data.id} successfully exported.`)
            })
            .catch(error => {
                errorCount++
                throw new Error(`Failed to export configuration ${data.id}. ` + error)
            })

        promises.push(promise)
    })

    await Promise.all(promises);

    if (errorCount === 0) {
        console.log("All configurations exported successfully")
    }
    else {
        console.log(`Failed to export ${errorCount} configurations of ${event.Records.length} requests.`)
    }

    return { statusCode: 200 };
};
